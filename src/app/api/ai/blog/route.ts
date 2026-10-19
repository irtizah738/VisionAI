import { NextRequest, NextResponse } from 'next/server';
import { generateBlogContent } from '@/ai/flows/generate-blog-content';
import { checkRateLimit } from '@/lib/rate-limit';

export async function POST(request: NextRequest) {
  const rateLimited = checkRateLimit(request, {
    keyPrefix: 'ai:blog',
    limit: 20,
    windowMs: 60_000,
  });
  if (rateLimited) return rateLimited;

  try {
    const body = await request.json();
    const { prompt, topic, tone, keywords } = body;
    const finalPrompt = (prompt || topic || '').trim();

    if (!finalPrompt) {
      return NextResponse.json(
        { error: 'Blog topic or prompt is required' },
        { status: 400 }
      );
    }

    const keywordList = Array.isArray(keywords)
      ? keywords
      : typeof keywords === 'string'
      ? keywords
          .split(',')
          .map((k: string) => k.trim())
          .filter(Boolean)
      : [];

    const result = await generateBlogContent({
      prompt: finalPrompt,
      tone: tone || 'Professional & Insightful',
      keywords: keywordList,
    });

    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Failed to generate blog content' },
      { status: 500 }
    );
  }
}
