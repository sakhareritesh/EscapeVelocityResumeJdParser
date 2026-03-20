
'use server';
/**
 * @fileOverview Deploys a set of files to Vercel.
 *
 * - deployToVercel - A function that handles the deployment process.
 * - DeployToVercelInput - The input type for the deployToVercel function.
 * - DeployToVercelOutput - The return type for the deployToVercel function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { config } from 'dotenv';
config();

const DeployToVercelInputSchema = z.object({
  projectName: z.string().describe('The name of the project on Vercel.'),
  files: z.record(z.string()).describe('An object where keys are file paths and values are file contents.'),
});
export type DeployToVercelInput = z.infer<typeof DeployToVercelInputSchema>;

const DeployToVercelOutputSchema = z.object({
  url: z.string().describe('The URL of the successful deployment.'),
});
export type DeployToVercelOutput = z.infer<typeof DeployToVercelOutputSchema>;

export async function deployToVercel(input: DeployToVercelInput): Promise<DeployToVercelOutput> {
  return deployToVercelFlow(input);
}

const deployToVercelFlow = ai.defineFlow(
  {
    name: 'deployToVercelFlow',
    inputSchema: DeployToVercelInputSchema,
    outputSchema: DeployToVercelOutputSchema,
  },
  async ({ projectName, files }) => {
    const vercelToken = process.env.VERCEL_TOKEN;

    if (!vercelToken) {
      throw new Error('VERCEL_TOKEN is not configured in environment variables.');
    }

    const fetch = (await import('node-fetch')).default;

    const fileObjects = Object.entries(files).map(([path, content]) => ({
        file: path,
        data: content,
    }));

    const body = {
      name: projectName,
      files: fileObjects,
      projectSettings: {
        framework: null, // This is a static deployment
      },
    };
    
    try {
      const response = await fetch('https://api.vercel.com/v13/deployments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${vercelToken}`,
        },
        body: JSON.stringify(body),
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(`Vercel API Error: ${result.error?.message || 'Unknown error'}`);
      }

      return { url: `https://${result.url}` };

    } catch (error) {
      console.error('Vercel deployment failed:', error);
      throw new Error('Failed to deploy to Vercel.');
    }
  }
);
