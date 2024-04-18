import express from 'express';
import { Startchat } from '../controllers/chatController.js';
const router = express.Router();

router.route('/:id').post(Startchat)

export default router