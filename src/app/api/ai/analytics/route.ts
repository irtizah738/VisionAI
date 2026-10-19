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
      maxKeywords 
    } = analyticsRequestSchema.parse(body);

    logger.info('Processing content analytics request', { 
      contentLength: content.length,
      includeSentiment,
      includeKeywords,
      includeSummary
    });

    const results: any = {};
    const timings: any = {};

    // Run requested analyses in parallel
    const analyses = await Promise.all([
      includeSentiment && analyzeSentiment(content),
      includeKeywords && extractKeywords(content, maxKeywords),
      includeSummary && summarizeContent(content)
    ].filter(Boolean));

    // Combine results
    if (includeSentiment) {
      const sentimentResult = analyses.shift();
      if (sentimentResult?.success) {
        results.sentiment = sentimentResult.data;
        timings.sentiment = sentimentResult.timing;
      }
    }

    if (includeKeywords) {
      const keywordsResult = analyses.shift();
      if (keywordsResult?.success) {
        results.keywords = keywordsResult.data;
        timings.keywords = keywordsResult.timing;
      }
    }

    if (includeSummary) {
      const summaryResult = analyses.shift();
      if (summaryResult?.success) {
        results.summary = summaryResult.data;
        timings.summary = summaryResult.timing;
      }
    }

    const duration = timer();
    logger.info('Content analysis completed successfully', { duration });

    return NextResponse.json({
      results,
      timings,
      totalDuration: duration
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