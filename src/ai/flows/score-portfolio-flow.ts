
'use server';
/**
 * @fileOverview An AI flow to score a user's portfolio and award badges.
 * 
 * - scorePortfolio - A function that analyzes portfolio content.
 * - ScorePortfolioInput - The input type for the scorePortfolio function.
 * - ScorePortfolioOutput - The return type for the scorePortfolio function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import type { UserInfo } from './extract-user-info-flow';

// We can use the UserInfo schema directly from the other flow
export type ScorePortfolioInput = UserInfo;

const ScorePortfolioOutputSchema = z.object({
  score: z.number().min(0).max(100).describe("The overall portfolio score from 0 to 100."),
  feedback: z.string().describe("A short, one-sentence feedback message for the user."),
  badges: z.array(z.string()).describe("A list of badges awarded based on the portfolio content."),
});
export type ScorePortfolioOutput = z.infer<typeof ScorePortfolioOutputSchema>;

export async function scorePortfolio(input: ScorePortfolioInput): Promise<ScorePortfolioOutput> {
  return scorePortfolioFlow(input);
}

const prompt = ai.definePrompt({
  name: 'scorePortfolioPrompt',
  // We don't need a specific Zod schema for input here, as we'll pass the UserInfo object directly.
  output: { schema: ScorePortfolioOutputSchema },
  prompt: `You are an AI career coach that analyzes a user's portfolio data to provide a "Portfolio Score" and award achievement badges.

  **Scoring Criteria (0-100):**
  - **Completeness (40 points):** How well are all sections filled out? (Bio, Skills, Projects, Experience, Education, Contact). A full score requires all sections to be non-empty.
  - **Clarity & Impact (30 points):** Are the descriptions clear, concise, and results-oriented? Does the bio sound professional?
  - **Project Depth (20 points):** Are there multiple projects with good titles and descriptions?
  - **Skill Representation (10 points):** Is there a good list of relevant skills?

  **Badge Awarding Rules:**
  - Award **"All-Star Profile"** if score is > 85.
  - Award **"Well-Structured Resume"** if workExperience and education sections are well-filled.
  - Award **"Skills Specialist"** if there are more than 10 skills listed.
  - Award **"Project Powerhouse"** if there are 3 or more projects with descriptions.
  - Award **"Experienced Professional"** if there are 2 or more work experiences listed.
  - Award **"Job-Ready in [Field]"** by inferring the user's primary field (e.g., ML, Web Development, UI/UX) from their skills and bio.
  - Award **"Quick Starter"** if the profile is basic but has a name and bio.

  **User's Portfolio Data:**
  \`\`\`json
  {{{jsonInput}}}
  \`\`\`

  Analyze the provided JSON data. Calculate a score, provide one line of constructive feedback, and award all applicable badges.
`,
});

const scorePortfolioFlow = ai.defineFlow(
  {
    name: 'scorePortfolioFlow',
    inputSchema: z.any(), // Use `any` since we are passing a complex object
    outputSchema: ScorePortfolioOutputSchema,
  },
  async (input) => {
    const { output } = await prompt({ jsonInput: JSON.stringify(input, null, 2) });
    if (!output) {
      throw new Error("AI analysis did not return a score.");
    }
    return output;
  }
);
