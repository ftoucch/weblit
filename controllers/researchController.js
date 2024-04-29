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
      `https://api.semanticscholar.org/graph/v1/paper/search/?query=${searchString}&year=${startYear}-${endYear}&fields=title,abstract,authors,referenceCount,citationCount,year,openAccessPdf&limit=2`,
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
    let totalFound = 0
    const filterQuery = await FilterQuery.create({
      researchQuestion,
      inclusionCriteria,
      exclusionCriteria,
      searchString,
      systematicReviewId,
      totalFound,
    });
    for (const filteredPaper of filteredPapers) {
      await ResearchPapers.updateOne(
        { title: filteredPaper.title },
        { $setOnInsert: { ...filteredPaper,systematicReviewId: filterQuery.systematicReviewId,
          filterQuery: filterQuery.id,
          user: req.user.userId, } },
        { upsert: true }
      );
      const openAiResponse = await processResearchPapers(assistantId, filteredPaper, inclusionCriteria, exclusionCriteria, researchQuestion);
      if (openAiResponse === 'Yes') {
        totalFound++;
        await PrimaryStudy.updateOne(
          { title: filteredPaper.title }, 
          {
            $setOnInsert: {
              ...filteredPaper,
              systematicReviewId: filterQuery.systematicReviewId,
              filterQuery: filterQuery.id,
              user: req.user.userId,
            }
          },
          { upsert: true }
        );
      }
    }
    await FilterQuery.updateOne({_id: filterQuery.id}, {$set: {totalFound}});
    res.status(StatusCodes.OK).json({message: 'Primary study selection successfull'}); 
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
