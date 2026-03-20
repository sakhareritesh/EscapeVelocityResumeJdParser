
'use server';
/**
 * @fileOverview An AI recruitment assistant that matches a candidate's resume against multiple job listings and generates a learning path.
 * 
 * - recruitmentMatcher - A function that handles the matching process.
 * - RecruitmentMatcherInput - The input type for the recruitmentMatcher function.
 * - RecruitmentMatcherOutput - The return type for the recruitmentMatcher function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const RecruitmentMatcherInputSchema = z.object({
  resumeDataUri: z.string().describe("The candidate's resume as a data URI. Must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."),
  jobListingsText: z.string().describe("A string containing one or more job listings to compare against, separated by '---'."),
});
export type RecruitmentMatcherInput = z.infer<typeof RecruitmentMatcherInputSchema>;

const LearningPathSchema = z.object({
    courses: z.array(z.string()).describe("A list of 2-3 specific course suggestions (e.g., 'Advanced React on Coursera', 'Python for Data Science on YouTube')."),
    projects: z.array(z.string()).describe("A list of 1-2 project ideas the candidate could build to strengthen their portfolio for this role (e.g., 'Build a full-stack e-commerce site with MERN')."),
    certifications: z.array(z.string()).describe("A list of 1-2 relevant industry certifications (e.g., 'AWS Certified Developer - Associate').")
});

const CompanyEvaluationSchema = z.object({
  companyName: z.string().describe("The name of the company."),
  role: z.string().describe("The job title or role."),
  eligibility: z.enum(['Eligible', 'Not Eligible']).describe("The candidate's eligibility status for this role."),
  reason: z.string().describe("A short, specific reason for the eligibility decision based on key criteria misses (e.g., 'CGPA 7.8 is below the required 8.0', 'Required skill Python is not listed in resume')."),
  suggestions: z.string().describe("If not eligible, suggest alternative companies *from the provided list* where the candidate might be a better fit based on their resume."),
  learningPath: LearningPathSchema.describe("A detailed, actionable learning path with specific suggestions for courses, projects, and certifications to help the candidate become eligible for this role.")
});

const RecruitmentMatcherOutputSchema = z.object({
    evaluations: z.array(CompanyEvaluationSchema).describe("An array of evaluations for each company.")
});
export type RecruitmentMatcherOutput = z.infer<typeof RecruitmentMatcherOutputSchema>;


export async function recruitmentMatcher(input: RecruitmentMatcherInput): Promise<RecruitmentMatcherOutput> {
  return recruitmentMatcherFlow(input);
}

const prompt = ai.definePrompt({
  name: 'recruitmentMatcherPrompt',
  input: { schema: RecruitmentMatcherInputSchema },
  output: { schema: RecruitmentMatcherOutputSchema },
  prompt: `You are an AI career coach and recruitment matcher. Your task is to analyze a candidate's resume against a list of job openings, determine their eligibility with high precision, and generate a personalized learning path to bridge any skill gaps.

  ### Context and Abbreviations:
  -   **Branch/Degree:** Treat abbreviations as equivalents. For example, "CS" means Computer Science, "IT" means Information Technology, and "ECE" includes "Electronics and Communication Engineering" or "Electronics and Telecommunication".

  ### Eligibility Rules (Apply Strictly):
  - **Pass-out Year:** This is the most important rule. Compare the candidate's graduation year from their resume to the required year in the job listing.
    -   **Rule 1:** If a candidate graduates in a LATER year than required, they are "Not Eligible". For example, a 2026 graduate is NOT eligible for a role requiring a 2024 or 2025 passout.
    -   **Rule 2:** If a candidate graduates in an EARLIER year than required, they are "Not Eligible". For example, a 2024 graduate is NOT eligible for an internship requiring a 2026 graduate.
    -   **Rule 3:** The candidate is only eligible if their graduation year matches the required year exactly, or falls within a specified range (e.g., a 2024 graduate is eligible for "2023/2024 Passout").
  - **CGPA/Grades:** The candidate's CGPA must be equal to or greater than the required CGPA. If the job listing has "Not specified" for CGPA, consider it a match.
  - **Degree/Branch:** The candidate's degree and branch must match the requirements. Use the abbreviation context above.

  ### Inputs:
  1.  **Candidate Resume:**
      {{media url=resumeDataUri}}

  2.  **Job Listings:**
      \`\`\`
      {{{jobListingsText}}}
      \`\`\`

  ### Task:
  For each company and role in the job listings, you must perform a strict analysis and generate the required output:
  1.  **Eligibility Check (Strict):** Compare the candidate's resume against the job's requirements for **Degree, Branch, Passout Year, and CGPA**. If ANY of these do not match based on the rules above, the candidate is "Not Eligible". If all primary criteria match, then check the required skills. If skills also largely match, the candidate is "Eligible".
  2.  **Reason:** Provide a very specific reason for your decision.
      - If "Not Eligible", state the exact criterion that was missed. Examples: "CGPA of 7.5 is below the required 8.0.", "Passout year 2026 does not match required 2024.", "Required skill 'React' is missing."
      - If "Eligible", state that all primary criteria are met. Example: "Candidate meets all degree, CGPA, and passout year requirements and possesses key skills."
  3.  **Alternative Suggestions:** If not eligible, scan the *provided job list* for other roles where the candidate's profile is a better fit.
  4.  **Learning Path Generation:** Identify the key skills or qualifications the candidate is missing for this specific role. Generate a personalized learning path with concrete, actionable steps.
      - **Courses:** Suggest 2-3 specific online courses from platforms like Coursera, Udemy, or free resources on YouTube. Be specific (e.g., "Complete 'The Complete 2024 Web Development Bootcamp' on Udemy").
      - **Projects:** Suggest 1-2 practical project ideas that would demonstrate the missing skills. Be specific (e.g., "Build and deploy a real-time chat application using Socket.io and React").
      - **Certifications:** Suggest 1-2 relevant industry certifications if applicable (e.g., "AWS Certified Solutions Architect - Associate", "Certified Kubernetes Application Developer (CKAD)").

  ### Output Format:
  Return a JSON object containing a single key "evaluations", which is an array. Each item in the array must be an object with the following keys: "companyName", "role", "eligibility", "reason", "suggestions", "learningPath".

  Analyze all companies provided in the job listings and return the complete list of evaluations.
`,
});

const recruitmentMatcherFlow = ai.defineFlow(
  {
    name: 'recruitmentMatcherFlow',
    inputSchema: RecruitmentMatcherInputSchema,
    outputSchema: RecruitmentMatcherOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    if (!output || !output.evaluations) {
        throw new Error("AI analysis did not return the expected evaluation structure.");
    }
    return output;
  }
);
