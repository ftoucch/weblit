import express from 'express';
import {
  createResearch,
  allResearch,
  getResearch,
  createQuery,
  deleteResearch
} from '../controllers/researchController.js';

const router = express.Router();

router.route('/create').post(createResearch);
router.route('/all').get(allResearch);
router.route('/:id').get(getResearch).delete(deleteResearch);
router.route('/query/create').post(createQuery)

export default router;
