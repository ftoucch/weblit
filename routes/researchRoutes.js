import express from 'express';
import {
  createResearch,
  allResearch,
  getResearch,
  createQuery,
  deleteResearch,
  updateResearch,
  allQuery,
  getAllPrimaryStudy,
  deleteQuery,
} from '../controllers/researchController.js';

const router = express.Router();

router.route('/create').post(createResearch);
router.route('/all').get(allResearch);
router
  .route('/:id')
  .get(getResearch)
  .delete(deleteResearch)
  .patch(updateResearch);
router.route('/query/create').post(createQuery);
router.route('/query/:id').delete(deleteQuery);
router.route('/query/all/:id').get(allQuery);
router.route('/primarystudies/:id').get(getAllPrimaryStudy);

export default router;
