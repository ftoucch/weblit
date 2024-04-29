import PrimaryStudy from '../models/PrimaryStudies.js';
import { StatusCodes } from 'http-status-codes';
import dotenv from 'dotenv';
dotenv.config();
import axios from 'axios';
import SystematicReview from '../models/SystematicReview.js';
import FilterQuery from '../models/FilterQuery.js';
import UnAuthenticatedError from '../errors/unauthenticated.js';
import filterScholarresponse from '../utils/filterScholarResponse.js';
import {processResearchPapers, createResearchAssistant, createChatAssistant} from '../utils/openAiRequest.js';
import ResearchPapers from '../models/ResearchPapers.js';

const createResearch = async (req, res) => {
  const { title, description } = req.body;
  const user = req.user.userId;
  if (!title || !description)
    throw new UnAuthenticatedError('please enter all field');
  const researchAssistantId = await createResearchAssistant();
  const chatAssistantId = await createChatAssistant();
  const systematicReview = await SystematicReview.create({
    title,
    description,
    user,
    researchAssistantId,
    chatAssistantId
  });
  res.status(StatusCodes.CREATED).json({
    message: 'Systematic Literature Review Created sucessfully',
    id: systematicReview.id,
    title: systematicReview.title,
    description: systematicReview.description,
    assistantId: systematicReview.assistantId
  });
};

const allResearch = async (req, res) => {
  const systematicReviews = await SystematicReview.find({
    user: req.user.userId,
  });
  res
    .status(StatusCodes.OK)
    .json({ message: 'successfull', data: systematicReviews });
};

const getResearch = async (req, res) => {
  const systematicReview = await SystematicReview.findOne({
    _id: req.params.id,
  });
  res.status(StatusCodes.OK).json({
    title: systematicReview.title,
    description: systematicReview.description,
    assistantId: systematicReview.assistantId
  });
};

const deleteResearch = async (req, res) => {
  const systematicReview = await SystematicReview.findOne({
    _id: req.params.id,
  });

  if (!systematicReview) {
    throw new NotFoundError(`No systematic Review with id :${req.params.id}`);
  }

  await systematicReview.deleteOne({ _id: req.params.id });
  await FilterQuery.deleteOne({systematicReviewId: req.params.id });
  await PrimaryStudy.deleteMany({ systematicReviewId: req.params.id });

  res
    .status(StatusCodes.OK)
    .json({ message: 'Success! systematic review removed' });
};

const updateResearch = async (req, res) => {
  const updatedSystematicReview = await SystematicReview.findByIdAndUpdate(
    req.params.id,
    req.body
  );
  res.status(StatusCodes.OK).json({
    message: 'systematic review edited successfully',
    id: updatedSystematicReview.id,
  });
};

const createQuery = async (req, res) => {
  const {
    researchQuestion,
    inclusionCriteria,
    exclusionCriteria,
    searchString,
    systematicReviewId,
    startYear,
    endYear
  } = req.body;

  if (
    !researchQuestion ||
    !inclusionCriteria ||
    !exclusionCriteria ||
    !searchString ||
    !systematicReviewId
  ) {
    throw new UnAuthenticatedError('please enter all fields');
  }
  try {
    // Call Semantic Scholar API
    const semanticResponse = await axios.get(
      `https://api.semanticscholar.org/graph/v1/paper/search/?query=${searchString}&year=${startYear}-${endYear}&fields=title,abstract,authors,referenceCount,citationCount,year,openAccessPdf&limit=15`,
      {
        headers: {
          'x-api-key': process.env.SEMANTIC_SCHOLAR_API_KEY,
        },
      }
    );
    if (!semanticResponse) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: 'error something Happened' });
    }
    const semanticScholarData = semanticResponse.data
    const filteredPapers = filterScholarresponse(semanticScholarData);
    const systematicReview = await SystematicReview.findOne({_id: systematicReviewId})
    const assistantId = systematicReview.researchAssistantId
    const openAiResponse = await processResearchPapers(assistantId, filteredPapers, inclusionCriteria, exclusionCriteria, researchQuestion);

    const totalFound = openAiResponse.length;
    const filterQuery = await FilterQuery.create({
      researchQuestion,
      inclusionCriteria,
      exclusionCriteria,
      searchString,
      systematicReviewId,
      totalFound,
    });
    const additionalData = {
      systematicReviewId: filterQuery.systematicReviewId,
      filterQuery: filterQuery.id,
      user: req.user.userId,
    };
    try {
    const unfilteredResearch = semanticScholarData.data.map((item) => ({
      ...item,
      ...additionalData
    }))
    unfilteredResearch.forEach(async paper => {
      await ResearchPapers.updateOne(
        { title: paper.title },
        { $setOnInsert: paper },
        { upsert: true }
      )
    })
    console.log('unfiltered research paper updated successfully');
  }
  catch(error) {
    res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: 'error something Happened' });
      console.log(error);
  }
    try {
      const researchPapers = openAiResponse.map((item) => ({
        ...item,
        ...additionalData,
      })
    );
    researchPapers.forEach(async paper => {
      await PrimaryStudy.updateOne(
        { title: paper.title },
        { $setOnInsert: paper },
        { upsert: true }
      );
    });
  
    console.log('Primary study updated successfully');
    } catch (error) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: 'error something Happened' });
      console.log(error);
    }
    res.status(StatusCodes.OK).json(openAiResponse); 
  } catch (error) {
    res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: 'error something Happened' });
    console.log(error);
  }
};

const allQuery = async (req, res) => {
  const filterQueries = await FilterQuery.find({
    systematicReviewId: req.params.id,
  });
  res
    .status(StatusCodes.OK)
    .json({ message: 'successfull', data: filterQueries });
};
const deleteQuery = async (req, res) => {
  const query = await FilterQuery.findOne({
    _id: req.params.id,
  });
  if (!query) {
    throw new NotFoundError(`No query with id :${req.params.id}`);
  }

  await query.deleteOne({ _id: req.params.id });
  await PrimaryStudy.deleteMany({ filterQuery: req.params.id });
  await ResearchPapers.deleteMany({filterQuery: req.params.id });

  res
    .status(StatusCodes.OK)
    .json({ message: 'Success! Query Successfully removed' });
};

const getAllPrimaryStudy = async (req, res) => {
  const primaryStudies = await PrimaryStudy.find({
    systematicReviewId: req.params.id,
  });
  res
    .status(StatusCodes.OK)
    .json({ message: 'successfull', data: primaryStudies });
};
const getAllResearchPaper = async (req, res) => {
  const researchPaper = await ResearchPapers.find({
    systematicReviewId: req.params.id,
  });
  res
    .status(StatusCodes.OK)
    .json({ message: 'successfull', data: researchPaper });
};
export {
  createResearch,
  allResearch,
  getResearch,
  createQuery,
  deleteResearch,
  updateResearch,
  allQuery,
  deleteQuery,
  getAllPrimaryStudy,
  getAllResearchPaper
};
