import express from 'express';
import {
  createResearch,
  allResearch,
  test,
  getResearch,
} from '../controllers/researchController.js';

const router = express.Router();

router.route('/create').post(createResearch);
router.route('/all').get(allResearch);
router.route('/:id').get(getResearch);
router.route('/test').post(test);

export default router;
