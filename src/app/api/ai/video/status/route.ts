import { NextRequest, NextResponse } from 'next/server';
import { getGenAIClient, GenerateVideosOperation } from '@/ai/genai-client';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { operationName } = body;

    if (!operationName || typeof operationName !== 'string') {
      return NextResponse.json(
        { error: 'operationName is required to check video status.' },
        { status: 400 }
      );
    }

    const ai = getGenAIClient();
    if (!ai) {
      return NextResponse.json(
        { error: 'GEMINI_API_KEY is not configured on the server.' },
        { status: 500 }
      );
    }

    const op = new GenerateVideosOperation();
    op.name = operationName;
    const updated = await ai.operations.getVideosOperation({ operation: op });

    return NextResponse.json({
      done: Boolean(updated.done),
      error: updated.error || null,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Failed to poll Veo video operation status.' },
      { status: 500 }
    );
  }
}
