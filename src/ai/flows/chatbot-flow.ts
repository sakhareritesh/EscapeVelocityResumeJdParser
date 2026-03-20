
'use server';
/**
 * @fileOverview A multilingual chatbot that can answer FAQs and provide guidance.
 * 
 * - chatbot - A function that handles the chatbot conversation.
 * - ChatbotInput - The input type for the chatbot function.
 * - ChatbotOutput - The return type for the chatbot function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const ChatbotInputSchema = z.object({
  history: z.array(z.object({
    role: z.enum(['user', 'model']),
    content: z.string(),
  })).describe('The conversation history, including the latest user query.'),
  language: z.string().optional().describe('The language for the chatbot to respond in.'),
});
export type ChatbotInput = z.infer<typeof ChatbotInputSchema>;

const ChatbotOutputSchema = z.object({
  response: z.string().describe('The chatbot\'s response.'),
});
export type ChatbotOutput = z.infer<typeof ChatbotOutputSchema>;

export async function chatbot(input: ChatbotInput): Promise<ChatbotOutput> {
  return chatbotFlow(input);
}

const prompt = ai.definePrompt({
  name: 'chatbotPrompt',
  input: { schema: ChatbotInputSchema },
  output: { schema: ChatbotOutputSchema },
  prompt: `You are ParichayBOT, a friendly and helpful multilingual chatbot for a website called Parichay. Your goal is to assist users with their questions.

  Your capabilities include:
  1.  **Answering FAQs:** Respond to frequently asked questions about Parichay.
  2.  **Guiding Users:** Provide step-by-step instructions on how to use the website to generate a portfolio.
  3.  **Providing Career Advice:** Answer generic questions related to resumes, job placements, current company trends, essential skills, how to make a portfolio stand out, and how to reach out to companies.
  4.  **Being Multilingual:** You must respond in the specified language. If no language is specified, you must detect the user's language from the conversation and respond in the same language.

  **Website Information (Parichay):**
  - **What it is:** An AI-powered platform to create professional portfolio websites.
  - **How it works:**
    1.  Users import data from their resume, GitHub, or LinkedIn.
    2.  The AI extracts and organizes the information.
    3.  Users customize the content and choose from various templates.
    4.  They can then deploy the portfolio website.
  - **Pricing:** There is a Free tier with basic features and a "Pro" paid tier (₹999/month) that allows downloading source code, advanced analytics, and premium templates.

  **Language for response: {{{language}}}**

  **Conversation History:**
  {{#each history}}
  {{role}}: {{content}}
  {{/each}}

  Based on the full conversation history, provide a helpful and concise response in the requested language.
`,
});


const chatbotFlow = ai.defineFlow(
  {
    name: 'chatbotFlow',
    inputSchema: ChatbotInputSchema,
    outputSchema: ChatbotOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return { response: output!.response };
  }
);
