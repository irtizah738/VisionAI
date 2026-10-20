import { NextRequest, NextResponse } from 'next/server';
import {
  DEFAULT_GEMINI_MODEL,
  generateGeminiWithSearchGrounding,
} from '@/ai/genai-client';
import { getBrandVoicePromptContext } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { query, context = 'marketing intelligence' } = body;

    if (!query || !String(query).trim()) {
      return NextResponse.json(
        { error: 'A search query is required for Google Search grounding.' },
        { status: 400 }
      );
    }

    const brandVoice = getBrandVoicePromptContext();
    const systemInstruction = `You are VisionAI Live Search Intelligence Analyst powered by ${DEFAULT_GEMINI_MODEL} and Google Search Grounding.
Provide accurate, up-to-date, fact-checked insights with concrete figures, recent industry developments, and strategic marketing takeaways for: ${context}.
${brandVoice ? `\nWorkspace Brand Voice Memory:\n${brandVoice}` : ''}`;

    const result = await generateGeminiWithSearchGrounding({
      prompt: String(query).trim(),
      systemInstruction,
      model: DEFAULT_GEMINI_MODEL,
    });

    return NextResponse.json({
      answer: result.text,
      sources: result.sources,
      model: result.model,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        error:
          error?.message ||
          'Google Search grounding query failed. Please check your GEMINI_API_KEY.',
      },
      { status: 500 }
    );
  }
}
