import OpenAI from 'openai';
import dotenv from 'dotenv';
dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPEN_API_SECRET_KEY,
});

const createAssistant = async () => {
  const assistant = await openai.beta.assistants.create({
    name: "Research Paper Filter",
    description: "An assistant to filter research papers based on specific criteria such as inclusion and exclusion criteria.",
    instructions: "You are provided with a JavaScript array of research papers, each represented as an object containing the fields: abstract, title, id, referenceCount, citationCount, year, openAccessPdf, and author. Given specific inclusion criteria, exclusion criteria, and a research question, identify and return only the papers that meet these criteria. The result should be a JSON array including only the matching papers' title, abstract, id, authors, referenceCount, citationCount, year, openAccessPdf, and match rate in percentage. Ensure no additional explanations or summaries are included.",
    model: "gpt-4-turbo",  // Updated to the latest model for better performance
    tools: [{ type: "code_interpreter" }],
  });
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
        instructions: "just return a JSON array including only the matching papers' title, abstract, id, authors, referenceCount, citationCount, year, openAccessPdf, and match rate in percentage. Ensure no additional explanations or summaries are included."
      }
    );
    if (run.status === 'completed') {
      const messages = await openai.beta.threads.messages.list(
        run.thread_id
      );
      for (const message of messages.data.reverse()) {
        console.log(`${message.content[0].text.value}`);
      }
    } else {
      console.log(run.status);
    }
    //const results = session.messages.find(msg => msg.role === 'assistant').content;
    //return JSON.parse(results);
  } catch (error) {
    console.error("Failed to process research papers with assistant:", error);
    return null;
  }
};

export {processResearchPapers, createAssistant}
