// This file is machine-generated - edit with care!

'use server';

/**
 * @fileOverview Generates a design theme for a portfolio based on the user's profession.
 *
 * - generateTheme - A function that generates a design theme for a portfolio.
 * - GenerateThemeInput - The input type for the generateTheme function.
 * - GenerateThemeOutput - The return type for the generateTheme function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateThemeInputSchema = z.object({
  profession: z
    .string()
    .describe('The profession of the user for whom the portfolio is being created.'),
});
export type GenerateThemeInput = z.infer<typeof GenerateThemeInputSchema>;

const ThemeSchema = z.object({
  themeDescription: z
    .string()
    .describe('A description of the suggested design theme, including primary and secondary colors, fonts, and overall style.'),
  primaryColor: z.string().describe('The primary color for the theme (hex code).'),
  secondaryColor: z.string().describe('The secondary color for the theme (hex code).'),
  fontFamily: z.string().describe('The font family for the theme.'),
  layout: z.enum(['standard', 'minimalist', 'classic']).describe('The overall layout style for the portfolio.'),
});

const GenerateThemeOutputSchema = z.array(ThemeSchema);

export type GenerateThemeOutput = z.infer<typeof GenerateThemeOutputSchema>;

export async function generateTheme(input: GenerateThemeInput): Promise<GenerateThemeOutput> {
  return generateThemeFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateThemePrompt',
  input: {schema: GenerateThemeInputSchema},
  output: {schema: GenerateThemeOutputSchema},
  prompt: `You are an AI design assistant that specializes in creating portfolio themes based on professions.

  Given the user's profession, suggest 3 distinct design themes that would be appropriate for their portfolio.

  Each design theme should include:
  - An overall description of the theme.
  - A primary color (in hex code).
  - A secondary color (in hex code).
  - A font family.
  - A layout style from the following options: 'standard', 'minimalist', 'classic'.

  Profession: {{{profession}}}

  Please generate 3 professional and visually appealing themes.
  Make sure that the themeDescription gives detailed guidance on how to style the portfolio.
  Return the 3 themes as an array.
`,
});

const generateThemeFlow = ai.defineFlow(
  {
    name: 'generateThemeFlow',
    inputSchema: GenerateThemeInputSchema,
    outputSchema: GenerateThemeOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
