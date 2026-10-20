import { NextRequest, NextResponse } from 'next/server';
import { analyzeImage, generateMarketingVisual } from '@/ai/features';
import {
  getGenAIClient,
  NANO_BANANA_IMAGE_MODEL,
} from '@/ai/genai-client';
import { handleError } from '../route';
import { logger } from '@/lib/logger';
import { checkRateLimit } from '@/lib/rate-limit';

const SUPPORTED_ASPECT_RATIOS = new Set([
  '1:1',
  '3:4',
  '4:3',
  '9:16',
  '16:9',
  '1:4',
  '1:8',
  '4:1',
  '8:1',
]);

const SUPPORTED_IMAGE_SIZES = new Set(['1K', '2K', '4K']);

function extractBase64AndMime(input: string, defaultMime = 'image/png'): {
  base64: string;
  mimeType: string;
} {
  if (input.startsWith('data:')) {
    const match = input.match(/^data:([^;]+);base64,(.+)$/);
    if (match) {
      return {
        mimeType: match[1] || defaultMime,
        base64: match[2],
      };
    }
  }
  return {
    mimeType: defaultMime,
    base64: input,
  };
}

export async function POST(request: NextRequest) {
  const rateLimited = checkRateLimit(request, {
    keyPrefix: 'ai:image',
    limit: 25,
    windowMs: 60_000,
  });
  if (rateLimited) return rateLimited;

  const timer = logger.startTimer('image-ai-api');

  try {
    const body = await request.json();
    const {
      action = body.prompt ? (body.imageBase64 ? 'edit' : 'generate') : 'analyze',
      prompt,
      aspectRatio = '16:9',
      imageSize = '1K',
      style = 'Executive High-Contrast Data Card',
      imageUrl,
      imageBase64,
      imageMimeType = 'image/png',
      useGoogleSearch = false,
    } = body;

    if (action === 'generate' || action === 'edit' || prompt) {
      if (!prompt || !String(prompt).trim()) {
        return NextResponse.json(
          { error: 'A text prompt is required to create or edit an image.' },
          { status: 400 }
        );
      }

      const cleanPrompt = String(prompt).trim();
      const normalizedAspect = SUPPORTED_ASPECT_RATIOS.has(aspectRatio)
        ? aspectRatio
        : aspectRatio === '4:5'
        ? '3:4'
        : '16:9';
      const normalizedSize = SUPPORTED_IMAGE_SIZES.has(imageSize)
        ? imageSize
        : '1K';

      const ai = getGenAIClient();
      if (ai) {
        try {
          const parts: any[] = [];
          const sourceImage = imageBase64 || (action === 'edit' ? imageUrl : null);

          if (sourceImage && typeof sourceImage === 'string') {
            const { base64, mimeType } = extractBase64AndMime(
              sourceImage,
              imageMimeType
            );
            if (base64 && !sourceImage.startsWith('data:image/svg+xml')) {
              parts.push({
                inlineData: {
                  data: base64,
                  mimeType,
                },
              });
            }
          }

          parts.push({
            text:
              action === 'edit'
                ? cleanPrompt
                : `${cleanPrompt}. Style: ${style}`,
          });

          const response = await ai.models.generateContent({
            model: NANO_BANANA_IMAGE_MODEL,
            contents: { parts },
            config: {
              imageConfig: {
                aspectRatio: normalizedAspect,
                imageSize: normalizedSize,
              },
              ...(useGoogleSearch
                ? {
                    tools: [
                      {
                        googleSearch: {
                          searchTypes: {
                            webSearch: {},
                            imageSearch: {},
                          },
                        },
                      },
                    ],
                  }
                : {}),
            },
          });

          let generatedDataUrl: string | null = null;
          let modelNotes = '';

          const candidateParts =
            response.candidates?.[0]?.content?.parts || [];
          for (const part of candidateParts) {
            if (part.inlineData?.data) {
              const mime = part.inlineData.mimeType || 'image/png';
              generatedDataUrl = `data:${mime};base64,${part.inlineData.data}`;
            } else if (part.text) {
              modelNotes += part.text;
            }
          }

          if (generatedDataUrl) {
            const duration = timer();
            return NextResponse.json({
              visual: {
                id: `nb_${Date.now()}`,
                prompt: cleanPrompt,
                aspectRatio: aspectRatio,
                style,
                headline: cleanPrompt.slice(0, 42),
                subline: modelNotes || `Generated with ${NANO_BANANA_IMAGE_MODEL}`,
                metricBadge: normalizedSize,
                categoryTag: action === 'edit' ? 'IMAGE EDIT' : 'NANO BANANA 2.1',
                primaryColor: '#090d16',
                secondaryColor: '#112240',
                accentColor: '#10b981',
                imageUrl: generatedDataUrl,
              },
              imageUrl: generatedDataUrl,
              notes: modelNotes,
              model: NANO_BANANA_IMAGE_MODEL,
              action,
              timing: { duration, timestamp: new Date().toISOString() },
            });
          }
        } catch (genErr: any) {
          logger.warn(
            'gemini-nano-banana-2.1 call fell back to SVG studio generator',
            { error: genErr?.message }
          );
        }
      }

      const fallbackRes = await generateMarketingVisual({
        prompt: cleanPrompt,
        aspectRatio: ['1:1', '16:9', '4:5', '9:16'].includes(aspectRatio)
          ? (aspectRatio as any)
          : '16:9',
        style,
      });

      const duration = timer();
      return NextResponse.json({
        visual: fallbackRes.data,
        imageUrl: fallbackRes.data?.imageUrl,
        model: NANO_BANANA_IMAGE_MODEL,
        action,
        timing: { duration, timestamp: new Date().toISOString() },
      });
    }

    if (!imageUrl) {
      return NextResponse.json(
        {
          error:
            'Either prompt (to create/edit) or imageUrl (to analyze) is required',
        },
        { status: 400 }
      );
    }

    const response = await analyzeImage(imageUrl);
    if (!response.success) {
      throw new Error(response.error);
    }

    const duration = timer();
    return NextResponse.json({
      analysis: response.data,
      model: response.model,
      timing: { duration, timestamp: new Date().toISOString() },
    });
  } catch (error) {
    timer();
    return handleError(error as Error);
  }
}