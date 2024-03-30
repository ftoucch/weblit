import express from 'express'
import {createResearch, allResearch,test} from '../controllers/researchController.js'

const router = express.Router();

router.route('/create').post(createResearch);
router.route('/all-research').post(allResearch);
router.route('/test').post(test);


export default router