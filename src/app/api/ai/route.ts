import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    version: '2.0',
    sdk: '@google/genai',
    model: 'gemini-3-flash-preview',
  });
}

export function handleError(error: any) {
  console.error('AI API Error:', error);
  return NextResponse.json(
    {
      error: error?.message || 'Internal server error',
      timestamp: new Date().toISOString(),
    },
    { status: error?.status || 500 }
  );
}