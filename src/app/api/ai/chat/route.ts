import { NextRequest, NextResponse } from 'next/server';
import { handleAIRequest } from '@/ai/core';
import { handleError } from '../route';
import { z } from 'zod';

// Input validation schema
const chatRequestSchema = z.object({
  message: z.string().min(1).max(1000),
  conversationId: z.string().optional(),
  useCache: z.boolean().optional().default(true),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, conversationId, useCache } = chatRequestSchema.parse(body);

    // Generate cache key from message and conversation ID
    const cacheKey = `chat:${conversationId || 'default'}:${message}`;

    const response = await handleAIRequest<string>({
      key: cacheKey,
      prompt: message,
      useCache,
    });

    if (!response.success) {
      throw new Error(response.error);
    }

    return NextResponse.json({
      message: response.data,
      model: response.model,
      timing: response.timing,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      );
    }
    return handleError(error as Error);
  }
} 