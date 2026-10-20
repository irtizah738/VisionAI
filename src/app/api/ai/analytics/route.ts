import { NextRequest, NextResponse } from 'next/server';
import { analyzeSentiment, extractKeywords, summarizeContent } from '@/ai/features';
import { handleError } from '../route';
import { logger } from '@/lib/logger';
import { z } from 'zod';

const analyticsRequestSchema = z.object({
  content: z.string().min(1).max(5000),
  includeSentiment: z.boolean().optional().default(true),
  includeKeywords: z.boolean().optional().default(true),
  includeSummary: z.boolean().optional().default(false),
  maxKeywords: z.number().optional().default(10),
});

export async function POST(request: NextRequest) {
  const timer = logger.startTimer('analytics-api');

  try {
    const body = await request.json();
    const {
      content,
      includeSentiment,
      includeKeywords,
      includeSummary,
      maxKeywords,
    } = analyticsRequestSchema.parse(body);

    logger.info('Processing content analytics request', {
      contentLength: content.length,
      includeSentiment,
      includeKeywords,
      includeSummary,
    });

    const results: Record<string, any> = {};
    const timings: Record<string, any> = {};

    const [sentimentResult, keywordsResult, summaryResult] = await Promise.all([
      includeSentiment ? analyzeSentiment(content) : Promise.resolve(null),
      includeKeywords ? extractKeywords(content, maxKeywords) : Promise.resolve(null),
      includeSummary ? summarizeContent(content) : Promise.resolve(null),
    ]);

    if (sentimentResult && sentimentResult.success) {
      results.sentiment = sentimentResult.data;
      timings.sentiment = sentimentResult.timing;
    }

    if (keywordsResult && keywordsResult.success) {
      results.keywords = keywordsResult.data;
      timings.keywords = keywordsResult.timing;
    }

    if (summaryResult && summaryResult.success) {
      results.summary = summaryResult.data;
      timings.summary = summaryResult.timing;
    }

    const duration = timer();
    logger.info('Content analysis completed successfully', { duration });

    return NextResponse.json({
      results,
      timings,
      totalDuration: duration,
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