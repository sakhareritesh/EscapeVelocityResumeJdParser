
'use server';
/**
 * @fileOverview Extracts user information from various sources to populate a portfolio.
 * 
 * - extractUserInfo - A function that extracts user information.
 * - UserData - The input type for the extractUserInfo function.
 * - UserInfo - The return type for the extractUserInfo function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const UserDataSchema = z.object({
  githubUrl: z.string().optional().describe('URL to the user\'s GitHub profile.'),
  linkedinUrl: z.string().optional().describe('URL to the user\'s LinkedIn profile.'),
  resumeDataUri: z.string().optional().describe('The user\'s resume as a data URI. Must include a MIME type and use Base64 encoding. Expected format: \'data:<mimetype>;base64,<encoded_data>\'.'),
});
export type UserData = z.infer<typeof UserDataSchema>;

const UserInfoSchema = z.object({
  name: z.string().describe('The full name of the user.'),
  avatarUrl: z.string().optional().describe('URL to the user\'s avatar image.'),
  avatarGenerationPrompt: z.string().optional().describe('A prompt for generating a Ghibli-style avatar if a real one is not found.'),
  shortBio: z.string().describe('A short, one-sentence bio for the user.'),
  longBio: z.string().describe('A longer, more detailed bio for the user.'),
  skills: z.array(z.string()).optional().describe('A list of the user\'s professional skills.'),
  projects: z.array(z.object({
    title: z.string().describe('The title of the project.'),
    description: z.string().describe('A brief description of the project.'),
    imageUrl: z.string().optional().describe('URL to an image for the project.'),
    projectUrl: z.string().optional().describe('URL to the live project or its repository.'),
  })).describe('A list of the user\'s top projects.'),
  workExperience: z.array(z.object({
      role: z.string().describe('The user\'s role or job title.'),
      company: z.string().describe('The name of the company.'),
      dates: z.string().describe('The start and end dates of the employment.'),
      description: z.string().describe('A brief description of the responsibilities and achievements in this role.'),
  })).optional().describe('A list of the user\'s work experience.'),
  education: z.array(z.object({
      degree: z.string().describe('The degree or qualification obtained.'),
      institution: z.string().describe('The name of the educational institution.'),
      dates: z.string().describe('The start and end dates of the education.'),
  })).optional().describe('A list of the user\'s educational background.'),
  achievements: z.array(z.string()).optional().describe('A list of key achievements or awards.'),
  contact: z.object({
    email: z.string().optional().describe('The user\'s email address.'),
    github: z.string().optional().describe('URL to the user\'s GitHub profile.'),
    linkedin: z.string().optional().describe('URL to the user\'s LinkedIn profile.'),
  }),
  resumeDataUri: z.string().optional().describe("The user's resume as a data URI."),
});
export type UserInfo = z.infer<typeof UserInfoSchema>;


export async function extractUserInfo(input: UserData): Promise<UserInfo> {
  return extractUserInfoFlow(input);
}

const prompt = ai.definePrompt({
  name: 'extractUserInfoPrompt',
  input: { schema: UserDataSchema },
  output: { schema: UserInfoSchema },
  prompt: `You are an AI assistant that extracts, synthesizes, and summarizes user information from multiple professional sources to create a comprehensive portfolio.

  You will be provided with some combination of a GitHub profile URL, a LinkedIn profile URL, and a resume file. Your task is to analyze all available information and populate a structured profile.

  **Extraction and Synthesis Rules:**
  1.  **Prioritize Sources:** Use the resume as the primary source of truth. Use LinkedIn to supplement or fill in missing details. Use GitHub primarily for project information.
  2.  **Synthesize, Don't Duplicate:** If information about work experience exists in both the resume and LinkedIn, use the resume's version. Only add information from LinkedIn if it's not present in the resume.
  3.  **Be Comprehensive:** Extract all relevant sections from the resume, including Skills, Work Experience, Education, and Achievements/Awards.
  4.  **Do NOT include the resumeDataUri field in your response.** This will be handled by the system.

  **Data to Extract:**
  - **Full Name:** The user's full name.
  - **Avatar URL:** A professional-looking avatar. Prioritize LinkedIn, then GitHub.
  - **Avatar Generation Prompt:** If a suitable avatar URL is not found, generate a descriptive prompt for a Ghibli-style anime portrait based on their profession and bio (e.g., 'A Ghibli-style anime portrait of a software engineer, focused and creative, with code-themed elements in the background.'). Store this in 'avatarGenerationPrompt'.
  - **Short & Long Bio:** A one-sentence short bio and a longer 2-3 sentence detailed bio.
  - **Skills:** A list of professional skills.
  - **Projects (from GitHub & Resume):** A list of their top 3-5 projects. Analyze GitHub repos to find project names and URLs. Supplement with projects listed on the resume. For each, get title, description, and repository/live URL.
  - **Work Experience:** For each role, extract the title, company, employment dates, and a description of responsibilities.
  - **Education:** For each entry, extract the degree, institution, and dates.
  - **Achievements:** List any notable achievements or awards.
  - **Contact Info:** Email, GitHub profile URL, and LinkedIn profile URL.


  **Input Data:**
  GitHub URL: {{{githubUrl}}}
  LinkedIn URL: {{{linkedinUrl}}}
  {{#if resumeDataUri}}
  Resume:
  {{media url=resumeDataUri}}
  {{/if}}

  Now, extract the information and return it in the specified structured format.
`,
});


const extractUserInfoFlow = ai.defineFlow(
  {
    name: 'extractUserInfoFlow',
    inputSchema: UserDataSchema,
    outputSchema: UserInfoSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    if (!output) {
      throw new Error("AI failed to extract user information.");
    }
    // Manually pass through the resume data URI to the final output
    output.resumeDataUri = input.resumeDataUri;
    return output;
  }
);

