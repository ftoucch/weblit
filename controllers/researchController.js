import Research from "../models/Research.js";
import { StatusCodes } from "http-status-codes";
import attachCookie from '../utils/attachCookie.js';
import dotenv from 'dotenv'
dotenv.config();
import axios from "axios";
import OpenAI from "openai";

const openai = new OpenAI({
    apiKey: process.env.OPEN_API_SECRET_KEY,
  });

const createResearch = async (req,res) => {
    const { title, description, researchField, inclusionCriteria, exclusionCriteria } = req.body;
    try {
        // Call Semantic Scholar API
        const semanticResponse = await axios.get(`https://api.semanticscholar.org/graph/v1/paper/search/bulk?query=${title}&fields=title,abstract,authors&limit=10`, {
            headers: {
                'x-api-key': process.env.SEMANTIC_SCHOLAR_API_KEY
            }
        });

        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
              {
                "role": "system",
                "content": "You will be provided with json code that contains project title abstract and authors id you will also be provided a description, inclusion and exclusion criteria you will need to remove items in the Json with abstract that does not meet the inclusion, exclusion criteria and is not related to the description and return a valid json response"
              },
              {
                "role": "user",
                "content": `json file : ${semanticResponse.data}, inclusion criteia : ${inclusionCriteria}, exclusion criteria: ${exclusionCriteria}, Description: ${description}`
              }
            ],
            temperature: 0.7,
            max_tokens: 164,
            top_p: 1,
          });

        
        res.status(StatusCodes.OK).json(response);
    }
    catch(error)
    {
        console.log(error)
    }
}

const allResearch = async (req,res) => {

}

export {createResearch, allResearch}
