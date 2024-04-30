import express from 'express';
import { Startchat, getChatHistory } from '../controllers/chatController.js';
const router = express.Router();

router.route('/:id').post(Startchat).get(getChatHistory)

export default router