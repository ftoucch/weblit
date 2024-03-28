import express from 'express'
import {createResearch, allResearch} from '../controllers/researchController.js'

const router = express.Router();

router.route('/create').post(createResearch);
router.route('/all-research').post(allResearch);


export default router