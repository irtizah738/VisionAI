import { NextRequest, NextResponse } from 'next/server';
import { analyzeImage } from '@/ai/features';
import { handleError } from '../route';
import { logger } from '@/lib/logger';
import { z } from 'zod';

const imageRequestSchema = z.object({
  imageUrl: z.string().url(),
});

export async function POST(request: NextRequest) {
  const timer = logger.startTimer('image-analysis-api');
  
  try {
    const body = await request.json();
    const { imageUrl } = imageRequestSchema.parse(body);

    logger.info('Processing image analysis request', { imageUrl });

    const response = await analyzeImage(imageUrl);

    if (!response.success) {
      throw new Error(response.error);
    }

    const duration = timer();
    logger.info('Image analysis completed successfully', { duration });

    return NextResponse.json({
      analysis: response.data,
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