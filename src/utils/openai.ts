import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config({ path: '../config/config.env' });

// Initialize OpenAI API
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY as string // This is also the default, can be omitted
});

export const createThread = async (): Promise<string> => {
  const thread = await openai.beta.threads.create();
  return thread.id;
};

export const generateAiResponse = async (
  threadId: string,
  prompt: string,
  tags: string[]
): Promise<string | null> => {
  try {
    const joinTags = tags.join(', ');
    const systemMessage = `You are knowledgeable only about ${joinTags}. Respond \"I am sorry have no idea\" other than the topics mentioned. Prompt: ${prompt}`;
    console.log('System message:', prompt);
    await openai.beta.threads.messages.create(threadId, {
      role: 'user',
      content: [{ type: 'text', text: prompt }]
    });

    const response = await openai.beta.threads.runs.create(threadId, {
      assistant_id: process.env.ASSISTANT_ID as string
    });

    let completed = false;
    let aiResponse: string | null = null;

    while (!completed) {
      // Wait for a short interval before checking status again
      await new Promise((resolve) => setTimeout(resolve, 800));

      // Retrieve the status of the response
      const runInfo = await openai.beta.threads.runs.retrieve(
        threadId,
        response.id
      );

      console.log('Run status:', runInfo.status);
      console.log('Run runInfo:', runInfo.id);

      // Check if the response has been completed
      if (runInfo.status === 'completed') {
        const messages = await openai.beta.threads.messages.list(threadId);
        //@ts-ignore
        aiResponse = messages.body.data[0]?.content[0]?.text?.value || null;
        completed = true;
      } else if (
        runInfo.status === 'failed' ||
        runInfo.status === 'cancelled'
      ) {
        throw new Error(
          `AI response failed or was cancelled. Status: ${runInfo.status}`
        );
      }
    }
    console.log('AI response:', aiResponse);
    return aiResponse;
  } catch (error) {
    console.log(error);
    return null;
  }
};
