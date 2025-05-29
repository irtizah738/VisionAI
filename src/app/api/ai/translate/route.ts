import { NextRequest, NextResponse } from 'next/server';
import { translateContent } from '@/ai/features';
import { handleError } from '../route';
import { logger } from '@/lib/logger';
import { z } from 'zod';

const translateRequestSchema = z.object({
  text: z.string().min(1).max(5000),
  targetLanguage: z.string().min(2).max(5),
  sourceLanguage: z.string().min(2).max(5).optional(),
});

export async function POST(request: NextRequest) {
  const timer = logger.startTimer('translate-api');
  
  try {
    const body = await request.json();
    const { text, targetLanguage, sourceLanguage } = translateRequestSchema.parse(body);

    logger.info('Processing translation request', { 
      textLength: text.length,
      targetLanguage,
      sourceLanguage 
    });

    const response = await translateContent(text, targetLanguage, sourceLanguage);

    if (!response.success) {
      throw new Error(response.error);
    }

    const duration = timer();
    logger.info('Translation completed successfully', { duration });

    return NextResponse.json({
      translation: response.data,
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