import PrimaryStudy from '../models/PrimaryStudies.js';
import { StatusCodes } from 'http-status-codes';
import dotenv from 'dotenv';
dotenv.config();
import axios from 'axios';
import SystematicReview from '../models/SystematicReview.js';
import FilterQuery from '../models/FilterQuery.js';
import UnAuthenticatedError from '../errors/unauthenticated.js';
import filterScholarresponse from '../utils/filterScholarResponse.js';
import openAiRequest from '../utils/openAiRequest.js';

const createResearch = async (req, res) => {
  const { title, description } = req.body;
  const user = req.user.userId;
  if (!title || !description)
    throw new UnAuthenticatedError('please enter all field');
  const systematicReview = await SystematicReview.create({
    title,
    description,
    user,
  });
  res.status(StatusCodes.CREATED).json({
    message: 'Systematic Literature Review Created sucessfully',
    id: systematicReview.id,
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

  /*const filterQuery = await FilterQuery.create({
    researchQuestion, inclusionCriteria, exclusionCriteria,searchString, systematicReviewId
  }) */
  try {
    // Call Semantic Scholar API
    const semanticResponse = await axios.get(
      `https://api.semanticscholar.org/graph/v1/paper/search/?query=${searchString}&fields=title,abstract,authors,referenceCount,citationCount,year,openAccessPdf&limit=20`,
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
    const filteredPapers = filterScholarresponse(semanticResponse.data);
    const openAiResponse = await openAiRequest(
      filteredPapers,
      inclusionCriteria,
      exclusionCriteria,
      researchQuestion
    );
    res.status(StatusCodes.OK).json(openAiResponse);
  } catch (error) {
    console.log(error);
  }
};
export {
  createResearch,
  allResearch,
  getResearch,
  createQuery,
  deleteResearch,
  updateResearch,
};
