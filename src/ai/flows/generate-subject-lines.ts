
'use server';
/**
 * @fileOverview Generates email subject lines using AI.
 *
 * - generateSubjectLines - A function that handles the subject line generation process.
 * - GenerateSubjectLinesInput - The input type for the generateSubjectLines function.
 * - GenerateSubjectLinesOutput - The return type for the generateSubjectLines function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateSubjectLinesInputSchema = z.object({
  topic: z.string().min(3, { message: "Topic must be at least 3 characters long." }).describe('The topic or keywords for the email.'),
});
export type GenerateSubjectLinesInput = z.infer<typeof GenerateSubjectLinesInputSchema>;

const GenerateSubjectLinesOutputSchema = z.object({
  subjectLines: z.array(z.string()).describe('A list of generated email subject lines.'),
});
export type GenerateSubjectLinesOutput = z.infer<typeof GenerateSubjectLinesOutputSchema>;

export async function generateSubjectLines(input: GenerateSubjectLinesInput): Promise<GenerateSubjectLinesOutput> {
  return generateSubjectLinesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateSubjectLinesPrompt',
  input: {schema: GenerateSubjectLinesInputSchema},
  output: {schema: GenerateSubjectLinesOutputSchema},
  prompt: `You are an expert email marketer. Generate 5 creative and engaging email subject lines for the following topic.

Topic: {{{topic}}}

Focus on encouraging opens and clicks. Provide only the subject lines.`,
});

const generateSubjectLinesFlow = ai.defineFlow(
  {
    name: 'generateSubjectLinesFlow',
    inputSchema: GenerateSubjectLinesInputSchema,
    outputSchema: GenerateSubjectLinesOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    
    // Ensure output is not null and has subjectLines, otherwise return an empty array or handle as needed.
    if (!output || !output.subjectLines) {
      // Attempt to extract from text if structured output fails
      const llmResponse = await prompt(input);
      const textResponse = llmResponse.text;
      if (textResponse) {
        const lines = textResponse.split('\n').map(line => line.trim().replace(/^- /, '')).filter(line => line.length > 0);
        if (lines.length > 0) {
          return { subjectLines: lines.slice(0, 5) }; // Take up to 5
        }
      }
      return { subjectLines: ["Could not generate subject lines at this time. Please try rephrasing your topic."] };
    }
    return output;
  }
);
