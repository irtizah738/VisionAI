import { NextRequest, NextResponse } from 'next/server';
import { optimizeSEO } from '@/ai/features';
import { handleError } from '../route';
import { logger } from '@/lib/logger';
import { z } from 'zod';

const seoRequestSchema = z.object({
  content: z.string().min(1).max(5000),
  targetKeywords: z.array(z.string()).optional(),
});

export async function POST(request: NextRequest) {
  const timer = logger.startTimer('seo-api');
  
  try {
    const body = await request.json();
    const { content, targetKeywords } = seoRequestSchema.parse(body);

    logger.info('Processing SEO optimization request', { 
      contentLength: content.length,
      keywordsCount: targetKeywords?.length 
    });

    const response = await optimizeSEO(content, targetKeywords);

    if (!response.success) {
      throw new Error(response.error);
    }

    const duration = timer();
    logger.info('SEO suggestions generated successfully', { duration });

    return NextResponse.json({
      suggestions: response.data,
      model: response.model,
      timing: response.timing,
    });
  } catch (error) {
    timer();
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      );
    }
    return handleError(error as Error);
  }
} 