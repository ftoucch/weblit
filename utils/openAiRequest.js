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
    instructions: "You are an academic researcher You will be provided with a research paper, containing the fields: abstract, title, id, referenceCount, citationCount, year, openAccessPdf, and author. You will also be Given specific inclusion criteria, exclusion criteria, and a research question, identify and return Yes if the paper meets the inclusion criteria, exclusion criteria and research question and no if it does not meet the inclusion criteria, exclusion criteria and the research queustion",
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
const processResearchPapers = async (assistantId, filteredPaper, inclusionCriteria, exclusionCriteria, researchQuestion) => {
  const thread = await openai.beta.threads.create();
  try {
    const message = await openai.beta.threads.messages.create(
      thread.id,
        {
          role: "user",
          content: `Evaluate this paper based on the following criteria: ${JSON.stringify(filteredPaper)}, Inclusion criteria: ${inclusionCriteria}, Exclusion criteria: ${exclusionCriteria}, Research question: ${researchQuestion}`
        }
    );

    let run = await openai.beta.threads.runs.createAndPoll(
      thread.id,
      { 
        assistant_id: assistantId,
        instructions: "Review the criteria and paper information provided and return 'Yes' if the paper meets all criteria and 'No' if it does not. Ensure no additional explanation is given"
      }
    );
    if (run.status === 'completed') {
      const messages = await openai.beta.threads.messages.list(run.thread_id);
      for (const message of messages.data.reverse()) {
        if(message.role === 'assistant') {
          if (message.content && message.content.length > 0 && message.content[0].type === 'text') {
            const result = message.content[0].text.value;
            console.log(result)
            return result;
          }
        }
      }
    } else {
      console.log("Run status:", run.status);
      return run.status;
    }
  } catch (error) {
    console.error("Failed to process research papers with assistant:", error.message);
    return null;
  }
}
const assistantChat = async (assistantId, researchPapers, userQuestion, threadId) => {
  try {
    const formattedPapers = JSON.stringify({ researchPapers });
    const userMessage = await openai.beta.threads.messages.create(threadId, {
      role: "user",
      content: `Here are some research papers: ${formattedPapers}. Based on these papers, can you answer the question: ${userQuestion}?`,
    });

    const questionTimestamp = new Date(userMessage.created_at);

    let run = await openai.beta.threads.runs.createAndPoll(threadId, {
      assistant_id: assistantId,
      instructions: "Please answer the question strictly using the information from the research papers provided."
    });

    if (run.status === 'completed') {
      const messages = await openai.beta.threads.messages.list(run.thread_id);
      const relevantMessages = messages.data.filter(m => 
        m.role === 'assistant' && new Date(m.created_at) > questionTimestamp
      ).reverse();
      for (const message of relevantMessages) {
        if (message.content && message.content.length > 0 && message.content[0].type === 'text') {
          const result = message.content[0].text.value;
          console.log("Question: ", userQuestion);
          console.log("Response: ", result);     
          return result;
        }
      }
    }
  } catch (error) {
    console.error("Error in assistant chat:", error);
    return "An error occurred while processing your request.";
  }
};
export {processResearchPapers, createResearchAssistant, createChatAssistant, assistantChat}
