"use server";
import { chatAssistant, type ChatAssistantInput, type ChatAssistantOutput } from '@/ai/flows/chat-assistant';

export async function chatAssistantAction(input: ChatAssistantInput): Promise<ChatAssistantOutput | { error: string }> {
  try {
    if (!input.query || input.query.trim() === "") {
      return { error: "Query cannot be empty." };
    }
    const result = await chatAssistant(input);
    if (!result || !result.response) {
      return { error: "Failed to get a response from the assistant. The AI model might have returned an unexpected response." };
    }
    return result;
  } catch (e: any) {
    console.error("Error in chat assistant:", e);
    return { error: e?.message || "An unexpected error occurred while communicating with the chat assistant." };
  }
}
