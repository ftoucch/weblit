import OpenAI from 'openai';
import dotenv from 'dotenv';
dotenv.config();

const openai = new OpenAI({
    apiKey: process.env.OPEN_API_SECRET_KEY,
  });

  const openAiRequest = async (filteredPapers, inclusionCriteria, exclusionCriteria, researchQuestion) => {
    const response = await openai.chat.completions.create({
       model: "gpt-3.5-turbo",
       messages: [
         {
           "role": "system",
           "content": "You will be provided with research papers in a JavaScript array of objects, including abstract, title, id, and author for each paper. Given a research question, inclusion criteria, and exclusion criteria, identify papers that match these requirements. Do not provide explanations or reasoning. Return only a JavaScript array of the papers that match, including title, abstract, id, authors, and match rate in percentage. Follow the structure exactly without adding any additional commentary or summaries."
         },
         {
           "role": "user",
           "content": `${JSON.stringify(filteredPapers)}`
         },
         {
           "role" : "assistant",
           "content" : `inclusionCriteria: ${inclusionCriteria}, exclusionCriteria: ${exclusionCriteria}, researchQuestion: ${researchQuestion}`
         }
         
       ],
       temperature: 0,
       max_tokens: 4096,
       top_p: 1,
       frequency_penalty: 0,
       presence_penalty: 0,
     });
 return (JSON.parse(response.choices[0].message.content));
}
export default openAiRequest