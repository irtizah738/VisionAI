import { NextRequest, NextResponse } from 'next/server';
import { analyzeImage, generateMarketingVisual } from '@/ai/features';
import { handleError } from '../route';
import { logger } from '@/lib/logger';
import { checkRateLimit } from '@/lib/rate-limit';

export async function POST(request: NextRequest) {
  const rateLimited = checkRateLimit(request, {
    keyPrefix: 'ai:image',
    limit: 25,
    windowMs: 60_000,
  });
  if (rateLimited) return rateLimited;

  const timer = logger.startTimer('image-ai-api');

  try {
    const body = await request.json();
    const {
      action = body.prompt ? 'generate' : 'analyze',
      prompt,
      aspectRatio = '16:9',
      style = 'Executive High-Contrast Data Card',
      imageUrl,
    } = body;

    if (action === 'generate' || prompt) {
      if (!prompt || !String(prompt).trim()) {
        return NextResponse.json(
          { error: 'A visual prompt is required to generate an image.' },
          { status: 400 }
        );
      }

      logger.info('Generating AI marketing visual', {
        prompt,
        aspectRatio,
        style,
      });

      const response = await generateMarketingVisual({
        prompt: String(prompt).trim(),
        aspectRatio,
        style,
      });

      const duration = timer();
      logger.info('AI marketing visual generated', { duration });

      return NextResponse.json({
        visual: response.data,
        imageUrl: response.data?.imageUrl,
        model: response.model,
        timing: response.timing,
      });
    }

    if (!imageUrl) {
      return NextResponse.json(
        { error: 'Either prompt (to generate) or imageUrl (to analyze) is required' },
        { status: 400 }
      );
    }

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
    return handleError(error as Error);
  }
}