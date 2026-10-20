import { NextRequest, NextResponse } from 'next/server';
import {
  getGenAIClient,
  LYRIA_CLIP_MODEL,
  LYRIA_PRO_MODEL,
  Modality,
} from '@/ai/genai-client';

function extractBase64(input: string, defaultMime = 'image/jpeg'): {
  data: string;
  mimeType: string;
} {
  if (input.startsWith('data:')) {
    const match = input.match(/^data:([^;]+);base64,(.+)$/);
    if (match) {
      return {
        mimeType: match[1] || defaultMime,
        data: match[2],
      };
    }
  }
  return {
    mimeType: defaultMime,
    data: input,
  };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      prompt,
      model = LYRIA_CLIP_MODEL,
      imageBase64,
      imageMimeType = 'image/jpeg',
    } = body;

    if (!prompt || !String(prompt).trim()) {
      return NextResponse.json(
        { error: 'A music prompt is required to generate an audio track.' },
        { status: 400 }
      );
    }

    const selectedModel =
      model === LYRIA_PRO_MODEL ? LYRIA_PRO_MODEL : LYRIA_CLIP_MODEL;

    const ai = getGenAIClient();
    if (!ai) {
      return NextResponse.json(
        { error: 'GEMINI_API_KEY is not configured on the server.' },
        { status: 500 }
      );
    }

    let contents: any = String(prompt).trim();
    if (imageBase64 && typeof imageBase64 === 'string') {
      const parsed = extractBase64(imageBase64, imageMimeType);
      if (parsed.data) {
        contents = {
          parts: [
            { text: String(prompt).trim() },
            { inlineData: { data: parsed.data, mimeType: parsed.mimeType } },
          ],
        };
      }
    }

    const response = await ai.models.generateContentStream({
      model: selectedModel,
      contents,
      config: {
        responseModalities: [Modality.AUDIO],
      },
    });

    let audioBase64 = '';
    let lyrics = '';
    let mimeType = 'audio/wav';

    for await (const chunk of response) {
      const parts = chunk.candidates?.[0]?.content?.parts;
      if (!parts) continue;

      for (const part of parts) {
        if (part.inlineData?.data) {
          if (!audioBase64 && part.inlineData.mimeType) {
            mimeType = part.inlineData.mimeType;
          }
          audioBase64 += part.inlineData.data;
        }
        if (part.text && !lyrics) {
          lyrics = part.text;
        }
      }
    }

    if (!audioBase64) {
      return NextResponse.json(
        {
          error:
            'No audio stream returned from Lyria. Ensure a billing-enabled API key is configured for Lyria 3.',
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      audioBase64,
      mimeType,
      lyrics,
      model: selectedModel,
      trackType:
        selectedModel === LYRIA_PRO_MODEL
          ? 'Full-Length Track (Lyria 3 Pro)'
          : '30s Ad Clip (Lyria 3 Clip)',
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        error:
          error?.message ||
          'Music generation failed. Please verify your GEMINI_API_KEY supports Lyria 3.',
      },
      { status: 500 }
    );
  }
}
