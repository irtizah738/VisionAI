// @ts-nocheck
// TODO: Fix TS errors
"use server";
import { generateBlogContent, type GenerateBlogContentInput, type GenerateBlogContentOutput } from '@/ai/flows/generate-blog-content';

export async function generateBlogAction(input: GenerateBlogContentInput): Promise<GenerateBlogContentOutput | { error: string }> {
  try {
    if (!input.prompt || input.prompt.trim() === "") {
      return { error: "Prompt cannot be empty." };
    }
    const result = await generateBlogContent(input);
    if (!result || !result.title || !result.content) {
        return { error: "Failed to generate blog content. The AI model might have returned an unexpected response." };
    }
    return result;
  } catch (e: any) {
    console.error("Error generating blog content:", e);
    return { error: e.message || "An unexpected error occurred while generating blog content." };
  }
}
