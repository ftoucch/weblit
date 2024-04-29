import express from 'express';
import { Startchat, addMessage, getChatHistory } from '../controllers/chatController.js';
const router = express.Router();

router.route('/:id').post(Startchat).patch(addMessage).get(getChatHistory)

export default router