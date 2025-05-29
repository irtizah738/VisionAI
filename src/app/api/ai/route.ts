import { NextRequest, NextResponse } from 'next/server';
import { aiRateLimiter } from '@/ai/core';
import { env } from '@/ai/config';

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    version: '1.0',
    environment: env.NODE_ENV,
  });
}

// Middleware to check API key
export async function middleware(request: NextRequest) {
  // Skip auth check for GET requests to base endpoint
  if (request.method === 'GET' && request.nextUrl.pathname === '/api/ai') {
    return NextResponse.next();
  }

  const apiKey = request.headers.get('x-api-key');
  
  if (!apiKey) {
    return NextResponse.json(
      { error: 'API key is required' },
      { status: 401 }
    );
  }

  // Apply rate limiting
  try {
    await aiRateLimiter(request, NextResponse);
  } catch {
    return NextResponse.json(
      { error: 'Rate limit exceeded' },
      { status: 429 }
    );
  }

  return NextResponse.next();
}

// Error handler
export function handleError(error: Error) {
  console.error('AI API Error:', error);
  
  if (error.message.includes('rate limit')) {
    return NextResponse.json(
      { error: 'Rate limit exceeded' },
      { status: 429 }
    );
  }

  if (error.message.includes('timeout')) {
    return NextResponse.json(
      { error: 'Request timeout' },
      { status: 408 }
    );
  }

  return NextResponse.json(
    { error: 'Internal server error' },
    { status: 500 }
  );
} 