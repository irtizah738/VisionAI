import { NextRequest, NextResponse } from 'next/server';
import { getGenAIClient, VEO_FAST_VIDEO_MODEL } from '@/ai/genai-client';

function extractBase64(input: string, defaultMime = 'image/png'): {
  imageBytes: string;
  mimeType: string;
} {
  if (input.startsWith('data:')) {
    const match = input.match(/^data:([^;]+);base64,(.+)$/);
    if (match) {
      return {
        mimeType: match[1] || defaultMime,
        imageBytes: match[2],
      };
    }
  }
  return {
    mimeType: defaultMime,
    imageBytes: input,
  };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      prompt = '',
      aspectRatio = '16:9',
      resolution = '720p',
      imageBase64,
      imageMimeType = 'image/png',
    } = body;

    const validAspectRatio: '16:9' | '9:16' =
      aspectRatio === '9:16' ? '9:16' : '16:9';
    const validResolution: '720p' | '1080p' =
      resolution === '1080p' ? '1080p' : '720p';

    if (!prompt.trim() && !imageBase64) {
      return NextResponse.json(
        {
          error:
            'Please provide a text prompt or upload an image to generate a Veo 3.1 video.',
        },
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

    let imagePayload: { imageBytes: string; mimeType: string } | undefined =
      undefined;
    if (imageBase64 && typeof imageBase64 === 'string') {
      const parsed = extractBase64(imageBase64, imageMimeType);
      if (parsed.imageBytes) {
        imagePayload = parsed;
      }
    }

    const operation = await ai.models.generateVideos({
      model: VEO_FAST_VIDEO_MODEL,
      prompt:
        prompt.trim() ||
        'Animate this scene with smooth cinematic camera motion and natural lighting.',
      ...(imagePayload ? { image: imagePayload } : {}),
      config: {
        numberOfVideos: 1,
        resolution: validResolution,
        aspectRatio: validAspectRatio,
      },
    });

    return NextResponse.json({
      operationName: operation.name,
      model: VEO_FAST_VIDEO_MODEL,
      aspectRatio: validAspectRatio,
      resolution: validResolution,
      mode: imagePayload ? 'image-to-video' : 'text-to-video',
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        error:
          error?.message ||
          'Veo 3.1 video generation failed. Ensure a billing-enabled API key is configured in Settings > Secrets.',
      },
      { status: 500 }
    );
  }
}
