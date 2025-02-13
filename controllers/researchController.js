import PrimaryStudy from '../models/PrimaryStudies.js';
import { StatusCodes } from 'http-status-codes';
import dotenv from 'dotenv';
dotenv.config();
import axios from 'axios';
import SystematicReview from '../models/SystematicReview.js';
import FilterQuery from '../models/FilterQuery.js';
import UnAuthenticatedError from '../errors/unauthenticated.js';
import filterScholarresponse from '../utils/filterScholarResponse.js';
import {
  processResearchPapers,
  createResearchAssistant,
  createChatAssistant,
} from '../utils/openAiRequest.js';
import ResearchPapers from '../models/ResearchPapers.js';
import Chat from '../models/Chat.js';
import webScrapper from '../utils/webScrapper.js';

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
    chatAssistantId,
  });
  res.status(StatusCodes.CREATED).json({
    message: 'Systematic Literature Review Created sucessfully',
    id: systematicReview.id,
    title: systematicReview.title,
    description: systematicReview.description,
    assistantId: systematicReview.assistantId,
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
    assistantId: systematicReview.assistantId,
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
  await FilterQuery.deleteOne({ systematicReviewId: req.params.id });
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
    endYear,
    maxResearch,
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
    const systematicReview = await SystematicReview.findOne({
      _id: systematicReviewId,
    });

    if (!systematicReview) {
      return res.status(StatusCodes.NOT_FOUND).json({ message: 'Systematic review not found' });
    }

    const semanticResponse  = await webScrapper(searchString, maxResearch);


    const semanticScholarData = semanticResponse.data;
    const filteredPapers = filterScholarresponse(semanticScholarData);
    let totalFound = 0;

    const filterQuery = await FilterQuery.create({
      researchQuestion,
      inclusionCriteria,
      exclusionCriteria,
      searchString,
      systematicReviewId,
      totalFound,
    });

    for (const filteredPaper of filteredPapers) {
      // Check and upsert research papers per systematic review
      const upsertQuery = {
        title: filteredPaper.title,
        systematicReviewId: filterQuery.systematicReviewId
      };

      await ResearchPapers.updateOne(upsertQuery, {
        $setOnInsert: {
          ...filteredPaper,
          filterQuery: filterQuery.id,
          user: req.user.userId,
        },
      }, { upsert: true });

      const openAiResponse = await processResearchPapers(
        systematicReview.researchAssistantId,
        filteredPaper,
        inclusionCriteria,
        exclusionCriteria,
        researchQuestion
      );

      if (openAiResponse === 'Yes') {
        totalFound++;
        await PrimaryStudy.updateOne(upsertQuery, {
          $setOnInsert: {
            ...filteredPaper,
            filterQuery: filterQuery.id,
            user: req.user.userId,
          },
        }, { upsert: true });
      }
    }

    await FilterQuery.updateOne(
      { _id: filterQuery.id },
      { $set: { totalFound } }
    );

    res.status(StatusCodes.OK).json({ message: 'Primary study selection successful' });
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({ message: 'Error something happened' });
    console.error(error);
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
  await ResearchPapers.deleteMany({ filterQuery: req.params.id });
  await Chat.deleteOne({ user: req.user.userId });

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
  getAllResearchPaper,
};
