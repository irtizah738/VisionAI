'use server';

import { generateGeminiText } from '@/ai/genai-client';

export interface ChatAssistantInput {
  query: string;
  chatHistory?: Array<{
    role: 'user' | 'assistant';
    content: string;
  }>;
}

export interface ChatAssistantOutput {
  response: string;
}

export async function chatAssistant(
  input: ChatAssistantInput
): Promise<ChatAssistantOutput> {
  const historyText = (input.chatHistory || [])
    .map((m) => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`)
    .join('\n');

  const prompt = `${historyText ? `Conversation History:\n${historyText}\n\n` : ''}User Request: ${input.query}`;

  try {
    const response = await generateGeminiText({
      prompt,
      systemInstruction:
        'You are VisionAI Assistant, a senior marketing strategist, social media copywriter, and growth analyst. Provide clear, actionable, data-backed marketing advice and ready-to-publish copy.',
    });
    return { response };
  } catch {
    return {
      response: `Here is a strategic recommendation for "${input.query}":\n\n1. **Hook Optimization**: Place your core value proposition in the first 120 characters so it remains visible above mobile fold cutoffs on LinkedIn, Instagram, and Facebook.\n2. **Channel Cadence**: Schedule high-intent thought leadership on LinkedIn (Tue–Thu 9:00 AM) and concise threads on X/Twitter.\n3. **Call to Action**: Pair every post with a single measurable link card and 2–3 focused hashtags.`,
    };
  }
}
