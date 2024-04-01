import OpenAI from 'openai';
import dotenv from 'dotenv';
dotenv.config();

const openai = new OpenAI({
    apiKey: process.env.OPEN_API_SECRET_KEY,
  });

const openAiRequest = async (filteredPapers, inclusionCriteria, exclusionCriteria, researchQuestion) => {
     const response = await openai.chat.completions.create({
        model: "gpt-4-0125-preview",
        messages: [
          {
            "role": "system",
            "content": "You will be provided with an array containing an object of research papers, each paper contains a title an abstract, authors. You will also be provided with an inclusion criteria, exclusion criteria and a research question. You task is to compare each paper and remove each that does not meet the inclusion criteria, the exclusion criteria and does not answer the research question. filter the original array and return your selected papers in a valid json format."
          },
          {
            "role": "user",
            "content": `array : ${filteredPapers}, inclusion criteia : ${inclusionCriteria}, exclusion criteria: ${exclusionCriteria}, research question: ${researchQuestion}`
          }
        ],
        temperature: 0.7,
        max_tokens: 1000,
        top_p: 1,
      });
return (response);
}

export default openAiRequest