import { NextRequest, NextResponse } from 'next/server';
import { optimizeSEO } from '@/ai/features';
import { handleError } from '../route';
import { checkRateLimit } from '@/lib/rate-limit';

export async function POST(request: NextRequest) {
  const rateLimited = checkRateLimit(request, {
    keyPrefix: 'ai:seo',
    limit: 25,
    windowMs: 60_000,
  });
  if (rateLimited) return rateLimited;

  try {
    const body = await request.json();
    const { content, url, keywords } = body;

    const targetContent = (content || url || '').trim();
    if (!targetContent) {
      return NextResponse.json(
        { error: 'Content or URL is required for SEO analysis' },
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
      : ['marketing automation', 'social media scheduler'];

    const response = await optimizeSEO(targetContent, keywordList);
    return NextResponse.json(response);
  } catch (error) {
    return handleError(error);
  }
}