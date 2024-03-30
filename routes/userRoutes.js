import express from 'express';
import { getCurrentUser } from '../controllers/userController.js';

const router = express.Router();

router.route('/me').get(getCurrentUser)

export default router