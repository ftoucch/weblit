import OpenAI from 'openai';
import dotenv from 'dotenv';
dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPEN_API_SECRET_KEY,
});

const createResearchAssistant = async () => {
  const assistant = await openai.beta.assistants.create({
    name: "Research Paper Filter",
    description: "An assistant to filter research papers based on specific criteria such as inclusion and exclusion criteria.",
    instructions: "You are an academic researcher You will be provided with a JavaScript array of research papers, each represented as an object containing the fields: abstract, title, id, referenceCount, citationCount, year, openAccessPdf, and author. You will also be Given specific inclusion criteria, exclusion criteria, and a research question, identify and return only the papers that meet these criteria. The result should be a JSON array including only the matching papers' title, abstract, id, authors, referenceCount, citationCount, year, openAccessPdf, and match rate in percentage.",
    model: "gpt-4-turbo",
    tools: [{ type: "code_interpreter" }],
  });
return assistant.id
}
const createChatAssistant = async () => {
  const assistant = await openai.beta.assistants.create({
    name: "research Chat assistant",
    description: "An assistant that answers question based on an array of research papers",
    instructions: "you are an academic researcher You will be provided with a JavaScript array of research papers, each represented as an object containing the fields: abstract, title, id, referenceCount, citationCount, year, openAccessPdf, and author. You will be required to answer questions based on the research papers. Strictly answer Question based on the research papers provided",
    model: "gpt-4-turbo",
  })
  return assistant.id
}
const processResearchPapers = async (assistantId, filteredPapers, inclusionCriteria, exclusionCriteria, researchQuestion) => {
  const thread = await openai.beta.threads.create();
  try {
    const message = await openai.beta.threads.messages.create(
      thread.id,
        {
          role: "user",
          content: `papers: ${JSON.stringify({ filteredPapers })}, inclusion criteria : ${inclusionCriteria}, exclusion criteria ${exclusionCriteria}, research question ${researchQuestion}`,
        }
    );

    let run = await openai.beta.threads.runs.createAndPoll(
      thread.id,
      { 
        assistant_id: assistantId,
        instructions: "just return a JSON array including only the matching papers' title, abstract, id, authors, referenceCount, citationCount, year, openAccessPdf. Ensure no additional explanations or summaries are included."
      }
    );
    if (run.status === 'completed') {
      const messages = await openai.beta.threads.messages.list(
        run.thread_id
      );
      for (const message of messages.data.reverse()) {
        if(message.role === 'assistant') {
          const results = message.content[0].text.value
          return (JSON.parse(results))
        }
      }
    } else {
      console.log(run.status);
    }
  } catch (error) {
    console.error("Failed to process research papers with assistant:", error);
    return null;
  }
}
  const assistantChat = async (assistantId, researchPapers, userQuestion, threadId) => {
     try {
      const message = await openai.beta.threads.messages.create(
        threadId,
          {
            role: "user",
            content: `Given the following research papers: ${JSON.stringify(researchPapers)}. Based on these papers, answer the question: ${userQuestion}`,
          }
      );
  
      let run = await openai.beta.threads.runs.createAndPoll(
        threadId,
        { 
          assistant_id: assistantId,
          instructions: `Please answer the question strictly using the information from the research papers provided.`
        }
      );
      if (run.status === 'completed') {
        const messages = await openai.beta.threads.messages.list(
          run.thread_id
        );
        for (const message of messages.data.reverse()) {
          if(message.role === 'assistant') {
            return message.content;
          }
        }
      } else {
        console.log(run.status);
      }
     }
     catch(error) {

     }
}
export {processResearchPapers, createResearchAssistant, createChatAssistant, assistantChat}
