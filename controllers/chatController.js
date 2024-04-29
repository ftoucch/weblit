import PrimaryStudy from '../models/PrimaryStudies.js';
import SystematicReview from '../models/SystematicReview.js';
import ResearchPapers from '../models/ResearchPapers.js';
import Chat from '../models/Chat.js';
import { StatusCodes } from 'http-status-codes';
import dotenv from 'dotenv';
import OpenAI from 'openai';
import { assistantChat } from '../utils/openAiRequest.js';
import UnAuthenticatedError from '../errors/unauthenticated.js';

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPEN_API_SECRET_KEY,
});

const Startchat = async (req, res) => {
    const { userQuestion} = req.body;
    const systematicReviewId = req.params.id;

    try {
        const systematicReview = await SystematicReview.findOne({_id: systematicReviewId});
        if (!systematicReview) {
            throw new UnAuthenticatedError('Systematic review not found');
        }

        const assistantId = systematicReview.chatAssistantId;
        const researchPapers = await PrimaryStudy.find({systematicReviewId: systematicReviewId});
        const existingChat = await Chat.findOne({systematicReviewId: systematicReviewId});
        let chat;
        if (existingChat) {
            chat = existingChat;
        } else {
            const thread = await openai.beta.threads.create();
            chat = await Chat.create({
                chatAssistantId: assistantId,
                threadId: thread.id,
                user: req.user.userId,
                systematicReviewId: systematicReviewId
            });
        }
    const threadId = chat.threadId
     const chatResponse = await assistantChat(assistantId, researchPapers, userQuestion, threadId);
     res.status(StatusCodes.OK).json({'userQuestion' : userQuestion, 'assistant':chatResponse });

    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Error handling the chat', error: error.message });
        console.log(error);
    }
};

const addMessage = async(req,res) => {
    
}
const getChatHistory = async(req,res) => {

}
export { Startchat, addMessage, getChatHistory };
