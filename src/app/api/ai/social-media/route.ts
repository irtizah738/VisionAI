import { NextRequest, NextResponse } from 'next/server';
import { generateSocialPost } from '@/ai/features';
import { handleError } from '../route';
import { logger } from '@/lib/logger';
import { z } from 'zod';

const socialPostRequestSchema = z.object({
  topic: z.string().min(1).max(500),
  platform: z.enum(['twitter', 'linkedin', 'instagram', 'facebook']),
  tone: z.string().optional().default('professional'),
});

export async function POST(request: NextRequest) {
  const timer = logger.startTimer('social-media-api');
  
  try {
    const body = await request.json();
    const { topic, platform, tone } = socialPostRequestSchema.parse(body);

    logger.info('Processing social media post request', { topic, platform, tone });

    const response = await generateSocialPost(topic, platform, tone);

    if (!response.success) {
      throw new Error(response.error);
    }

    const duration = timer();
    logger.info('Social media post generated successfully', { duration });

    return NextResponse.json({
      post: response.data,
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