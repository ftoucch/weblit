import PrimaryStudy from "../models/PrimaryStudies.js";
import { StatusCodes } from "http-status-codes";
import dotenv from 'dotenv'
dotenv.config();
import axios from "axios";
import OpenAI from "openai";
import SystematicReviewScholar from "../models/SystematicReview.js";
import SystematicReview from "../models/SystematicReview.js";
import FilterQuery from "../models/FilterQuery.js";

const openai = new OpenAI({
    apiKey: process.env.OPEN_API_SECRET_KEY,
  });

const createResearch = async (req,res) => {
    const { searchString, description, researchQuestion, inclusionCriteria, exclusionCriteria, filterQuery, systematicReviewId, user } = req.body;
    try {
        // Call Semantic Scholar API
        const semanticResponse = await axios.get(`https://api.semanticscholar.org/graph/v1/paper/search/?query=${searchString}&fields=title,abstract,authors,openAccessPdf&limit=3`, {
            headers: {
                'x-api-key': process.env.SEMANTIC_SCHOLAR_API_KEY
            }
        });
        
       const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
              {
                "role": "system",
                "content": `You will be provided with a pair of research papers (in json format) about ${title} a description, inclusion and an exclusion criteria will also be provided. First read the papers in the json then compare each to the value in the inclusion and exclusion criteria, then check the ones that are similar to what the description says. then return a new JSON of papers with title abstract and the match rate`
              },
              {
                "role": "user",
                "content": `research Papers : ${semanticResponse.data}, inclusion criteia : ${inclusionCriteria}, exclusion criteria: ${exclusionCriteria}, Description: ${description}`
              }
            ],
            temperature: 0.7,
            max_tokens: 1000,
            top_p: 1,
          }); 
         let message = response.choices[0].message.content;
        let json = JSON.parse(message)
        
        res.status(StatusCodes.OK).json(research);
    }
    catch(error)
    {
        console.log(error)
    }
}

const allResearch = async (req,res) => {
}
const test = async (req,res) => {
    const {inclusionCriteria, exclusionCriteria, searchString, systematicReviewId, researchQuestion} = req.body
    const filterQuery = await FilterQuery.create({inclusionCriteria, exclusionCriteria, searchString, systematicReviewId, researchQuestion})
    res.status(StatusCodes.CREATED).json({
        researchQuestion: researchQuestion,
        inclusionCriteria: inclusionCriteria,
        exclusionCriteria: exclusionCriteria,
        searchString: searchString,
        systematicReviewId: systematicReviewId
    });
}
export {createResearch, allResearch, test}
