import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    mode: 'server_managed',
    status: 'operational',
    message: 'All AI keys are managed server-side via process.env.GEMINI_API_KEY.',
    keys: [],
  });
}

export async function POST() {
  return NextResponse.json({
    mode: 'server_managed',
    status: 'operational',
    message: 'API keys are managed server-side via environment variables.',
  });
}