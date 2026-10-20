import { NextRequest, NextResponse } from 'next/server';
import { getGenAIClient, GenerateVideosOperation } from '@/ai/genai-client';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { operationName } = body;

    if (!operationName || typeof operationName !== 'string') {
      return NextResponse.json(
        { error: 'operationName is required to download generated video.' },
        { status: 400 }
      );
    }

    const ai = getGenAIClient();
    const apiKey = process.env.GEMINI_API_KEY;
    if (!ai || !apiKey) {
      return NextResponse.json(
        { error: 'GEMINI_API_KEY is not configured on the server.' },
        { status: 500 }
      );
    }

    const op = new GenerateVideosOperation();
    op.name = operationName;
    const updated = await ai.operations.getVideosOperation({ operation: op });
    const uri = updated.response?.generatedVideos?.[0]?.video?.uri;

    if (!uri) {
      return NextResponse.json(
        { error: 'Video URI is not yet available for this operation.' },
        { status: 404 }
      );
    }

    const videoRes = await fetch(uri, {
      headers: {
        'x-goog-api-key': apiKey,
      },
    });

    if (!videoRes.ok || !videoRes.body) {
      return NextResponse.json(
        { error: `Failed to download video binary (${videoRes.status})` },
        { status: 502 }
      );
    }

    return new NextResponse(videoRes.body, {
      status: 200,
      headers: {
        'Content-Type': 'video/mp4',
        'Cache-Control': 'no-store',
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Failed to download Veo generated video.' },
      { status: 500 }
    );
  }
}
