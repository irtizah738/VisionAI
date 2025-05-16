
"use server";
import { generateSubjectLines, type GenerateSubjectLinesInput, type GenerateSubjectLinesOutput } from '@/ai/flows/generate-subject-lines';

export async function generateSubjectLinesAction(input: GenerateSubjectLinesInput): Promise<GenerateSubjectLinesOutput | { error: string }> {
  if (!input.topic || input.topic.trim().length < 3) {
    return { error: "Please provide a topic with at least 3 characters." };
  }

  try {
    const result = await generateSubjectLines(input);
    if (!result || !result.subjectLines || result.subjectLines.length === 0) {
      return { error: "AI could not generate subject lines for this topic. Please try a different topic or try again later." };
    }
    return result;
  } catch (e: any) {
    console.error("Error generating subject lines:", e);
    return { error: e.message || "An unexpected error occurred while generating subject lines." };
  }
}

// Keep other actions if they exist, e.g. for email body generation later
// export async function generateEmailBodyAction...
