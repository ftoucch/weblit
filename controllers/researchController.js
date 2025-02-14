import dotenv from 'dotenv';
import { StatusCodes } from 'http-status-codes';
import UnAuthenticatedError from '../errors/unauthenticated.js';
import NotFoundError from '../errors/notFound.js';
import PrimaryStudy from '../models/PrimaryStudies.js';
import SystematicReview from '../models/SystematicReview.js';
import FilterQuery from '../models/FilterQuery.js';
import ResearchPapers from '../models/ResearchPapers.js';
import Chat from '../models/Chat.js';
import fetchSemanticScholar from '../utils/webScrapper.js';
import { 
  processResearchPapers, 
  createResearchAssistant, 
  createChatAssistant 
} from '../utils/openAiRequest.js';

dotenv.config();

const createResearch = async (req, res) => {
  const { title, description } = req.body;
  if (!title || !description) throw new UnAuthenticatedError('Please enter all fields');

  const [researchAssistantId, chatAssistantId] = await Promise.all([
    createResearchAssistant(),
    createChatAssistant()
  ]);

  const systematicReview = await SystematicReview.create({
    title,
    description,
    user: req.user.userId,
    researchAssistantId,
    chatAssistantId,
  });

  res.status(StatusCodes.CREATED).json({
    message: 'Systematic Literature Review created successfully',
    id: systematicReview.id,
    title,
    description,
    assistantId: systematicReview.assistantId,
  });
};

const allResearch = async (req, res) => {
  const systematicReviews = await SystematicReview.find({ user: req.user.userId });
  res.status(StatusCodes.OK).json({ message: 'Successful', data: systematicReviews });
};

const getResearch = async (req, res) => {
  const systematicReview = await SystematicReview.findById(req.params.id);
  if (!systematicReview) throw new NotFoundError('Systematic review not found');

  res.status(StatusCodes.OK).json({
    title: systematicReview.title,
    description: systematicReview.description,
    assistantId: systematicReview.assistantId,
  });
};

const deleteResearch = async (req, res) => {
  const systematicReview = await SystematicReview.findById(req.params.id);
  if (!systematicReview) throw new NotFoundError('Systematic review not found');

  await Promise.all([
    systematicReview.deleteOne(),
    FilterQuery.deleteMany({ systematicReviewId: req.params.id }),
    PrimaryStudy.deleteMany({ systematicReviewId: req.params.id })
  ]);

  res.status(StatusCodes.OK).json({ message: 'Systematic review removed successfully' });
};

const updateResearch = async (req, res) => {
  const updatedSystematicReview = await SystematicReview.findByIdAndUpdate(req.params.id, req.body);
  if (!updatedSystematicReview) throw new NotFoundError('Systematic review not found');

  res.status(StatusCodes.OK).json({ message: 'Systematic review updated successfully', id: updatedSystematicReview.id });
};

const createQuery = async (req, res) => {
  try {
    const { researchQuestion, inclusionCriteria, exclusionCriteria, searchString, systematicReviewId, maxResearch, startYear, endYear } = req.body;
    if (!researchQuestion || !inclusionCriteria || !exclusionCriteria || !searchString || !systematicReviewId || !startYear || !endYear) 
      throw new UnAuthenticatedError('Please enter all fields');

    const systematicReview = await SystematicReview.findById(systematicReviewId);
    if (!systematicReview) return res.status(StatusCodes.NOT_FOUND).json({ message: 'Systematic review not found' });

    const filteredPapers = await fetchSemanticScholar(searchString, maxResearch, startYear, endYear) || [];
    let totalFound = 0;
    const filterQuery = await FilterQuery.create({
      researchQuestion, inclusionCriteria, exclusionCriteria, searchString, systematicReviewId, totalFound
    });

    for (const paper of filteredPapers) {
      try {
        await new ResearchPapers({
          ...paper,
          filterQuery: filterQuery.id,
          systematicReviewId,
          user: req.user.userId,
        }).save();
      } catch (error) {
        console.error('Error saving Research Paper:', error);
      }

      const openAiResponse = await processResearchPapers(
        systematicReview.researchAssistantId, paper, inclusionCriteria, exclusionCriteria, researchQuestion
      );

      if (openAiResponse.trim().toLowerCase() === 'yes') {
        totalFound++;
        try {
          await new PrimaryStudy({
            ...paper,
            filterQuery: filterQuery.id,
            systematicReviewId,
            user: req.user.userId,
          }).save();
        } catch (error) {
          console.error('Error saving Primary Study:', error);
        }
      }
    }

    await FilterQuery.updateOne({ _id: filterQuery.id }, { $set: { totalFound } });

    res.status(StatusCodes.OK).json({ message: 'Primary study selection successful' });
  } catch (error) {
    console.error('Error during createQuery:', error);
    res.status(StatusCodes.BAD_REQUEST).json({ message: 'Something went wrong' });
  }
};

const allQuery = async (req, res) => {
  const filterQueries = await FilterQuery.find({ systematicReviewId: req.params.id });
  res.status(StatusCodes.OK).json({ message: 'Successful', data: filterQueries });
};

const deleteQuery = async (req, res) => {
  const query = await FilterQuery.findById(req.params.id);
  if (!query) throw new NotFoundError('Query not found');

  await Promise.all([
    query.deleteOne(),
    PrimaryStudy.deleteMany({ filterQuery: req.params.id }),
    ResearchPapers.deleteMany({ filterQuery: req.params.id }),
    Chat.deleteOne({ user: req.user.userId })
  ]);

  res.status(StatusCodes.OK).json({ message: 'Query removed successfully' });
};

const getAllPrimaryStudy = async (req, res) => {
  const primaryStudies = await PrimaryStudy.find({ systematicReviewId: req.params.id });
  res.status(StatusCodes.OK).json({ message: 'Successful', data: primaryStudies });
};

const getAllResearchPaper = async (req, res) => {
  const researchPapers = await ResearchPapers.find({ systematicReviewId: req.params.id });
  res.status(StatusCodes.OK).json({ message: 'Successful', data: researchPapers });
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
