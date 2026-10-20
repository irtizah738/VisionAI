import {
  GoogleGenAI,
  Type,
  Modality,
  GenerateVideosOperation,
  GenerateContentResponse,
} from '@google/genai';

export const DEFAULT_GEMINI_MODEL = 'gemini-3.8-flash';
export const COMPLEX_GEMINI_MODEL = 'gemini-4-argon';
export const FAST_GEMINI_MODEL = 'gemini-3.1-flash-lite';
export const NANO_BANANA_IMAGE_MODEL = 'gemini-nano-banana-2.1';
export const VEO_FAST_VIDEO_MODEL = 'veo-3.1-fast-generate-preview';
export const LYRIA_CLIP_MODEL = 'lyria-3-clip-preview';
export const LYRIA_PRO_MODEL = 'lyria-3-pro-preview';

let cachedGenAI: GoogleGenAI | null = null;
let cachedApiKey: string | undefined = undefined;

export function getGenAIClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  if (!cachedGenAI || cachedApiKey !== apiKey) {
    cachedApiKey = apiKey;
    cachedGenAI = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return cachedGenAI;
}

export interface GroundingSource {
  uri: string;
  title: string;
}

export async function generateGeminiText(params: {
  prompt: string;
  systemInstruction?: string;
  temperature?: number;
  maxOutputTokens?: number;
  model?: string;
  useGoogleSearch?: boolean;
}): Promise<string> {
  const ai = getGenAIClient();
  if (!ai) {
    throw new Error('GEMINI_API_KEY is not configured');
  }

  const response: GenerateContentResponse = await ai.models.generateContent({
    model: params.model || DEFAULT_GEMINI_MODEL,
    contents: params.prompt,
    config: {
      systemInstruction: params.systemInstruction,
      temperature: params.temperature ?? 0.7,
      ...(params.useGoogleSearch ? { tools: [{ googleSearch: {} }] } : {}),
    },
  });

  return response.text || '';
}

export async function generateGeminiWithSearchGrounding(params: {
  prompt: string;
  systemInstruction?: string;
  model?: string;
}): Promise<{
  text: string;
  sources: GroundingSource[];
  model: string;
}> {
  const ai = getGenAIClient();
  if (!ai) {
    throw new Error('GEMINI_API_KEY is not configured');
  }

  const targetModel = params.model || DEFAULT_GEMINI_MODEL;
  const response: GenerateContentResponse = await ai.models.generateContent({
    model: targetModel,
    contents: params.prompt,
    config: {
      systemInstruction: params.systemInstruction,
      tools: [{ googleSearch: {} }],
    },
  });

  const chunks =
    response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
  const sources: GroundingSource[] = [];
  for (const chunk of chunks) {
    if (chunk.web?.uri) {
      sources.push({
        uri: chunk.web.uri,
        title: chunk.web.title || chunk.web.uri,
      });
    }
  }

  return {
    text: response.text || '',
    sources,
    model: targetModel,
  };
}

export async function generateGeminiJSON<T>(params: {
  prompt: string;
  systemInstruction?: string;
  responseSchema: any;
  temperature?: number;
  model?: string;
}): Promise<T> {
  const ai = getGenAIClient();
  if (!ai) {
    throw new Error('GEMINI_API_KEY is not configured');
  }

  const response: GenerateContentResponse = await ai.models.generateContent({
    model: params.model || DEFAULT_GEMINI_MODEL,
    contents: params.prompt,
    config: {
      systemInstruction: params.systemInstruction,
      temperature: params.temperature ?? 0.6,
      responseMimeType: 'application/json',
      responseSchema: params.responseSchema,
    },
  });

  const text = response.text || '{}';
  return JSON.parse(text) as T;
}

export { Type, Modality, GenerateVideosOperation };
