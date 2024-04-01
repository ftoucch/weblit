import PrimaryStudy from '../models/PrimaryStudies.js';
import { StatusCodes } from 'http-status-codes';
import dotenv from 'dotenv';
dotenv.config();
import axios from 'axios';
import OpenAI from 'openai';
import SystematicReview from '../models/SystematicReview.js';
import FilterQuery from '../models/FilterQuery.js';
import UnAuthenticatedError from '../errors/unauthenticated.js';

const openai = new OpenAI({
  apiKey: process.env.OPEN_API_SECRET_KEY,
});

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
  res
    .status(StatusCodes.CREATED)
    .json({ message: 'Systematic Literature Review Created sucessfully' });
};

const allResearch = async (req, res) => {
  const systematicReviews = await SystematicReview.find();
  res
    .status(StatusCodes.OK)
    .json({ message: 'successfull', data: systematicReviews });
};

const getResearch = async (req, res) => {
  const systematicReview = await SystematicReview.findOne({_id: req.params.id})
  res
    .status(StatusCodes.OK)
    .json({ title: systematicReview.title, description: systematicReview.description });
}

const test = async (req, res) => {
  const {
    inclusionCriteria,
    exclusionCriteria,
    searchString,
    systematicReviewId,
    researchQuestion,
  } = req.body;
  const filterQuery = await FilterQuery.create({
    inclusionCriteria,
    exclusionCriteria,
    searchString,
    systematicReviewId,
    researchQuestion,
  });
  res.status(StatusCodes.CREATED).json({
    researchQuestion: researchQuestion,
    inclusionCriteria: inclusionCriteria,
    exclusionCriteria: exclusionCriteria,
    searchString: searchString,
    systematicReviewId: systematicReviewId,
  });
};
export { createResearch, allResearch, getResearch, test };
