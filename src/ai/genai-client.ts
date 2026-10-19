import { GoogleGenAI, Type } from '@google/genai';

export const DEFAULT_GEMINI_MODEL = 'gemini-3.8-flash';

let cachedGenAI: GoogleGenAI | null = null;

export function getGenAIClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  if (!cachedGenAI) {
    cachedGenAI = new GoogleGenAI({ apiKey });
  }
  return cachedGenAI;
}

export async function generateGeminiText(params: {
  prompt: string;
  systemInstruction?: string;
  temperature?: number;
  maxOutputTokens?: number;
  model?: string;
}): Promise<string> {
  const ai = getGenAIClient();
  if (!ai) {
    throw new Error('GEMINI_API_KEY is not configured');
  }

  const response = await ai.models.generateContent({
    model: params.model || DEFAULT_GEMINI_MODEL,
    contents: params.prompt,
    config: {
      systemInstruction: params.systemInstruction,
      temperature: params.temperature ?? 0.7,
      maxOutputTokens: params.maxOutputTokens ?? 2048,
      httpOptions: {
        headers: {
          'User-Agent': 'VisionAI-Studio/2.0 (AI-Studio-Build; @google/genai)',
        },
      },
    },
  });

  return response.text || '';
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

  const response = await ai.models.generateContent({
    model: params.model || DEFAULT_GEMINI_MODEL,
    contents: params.prompt,
    config: {
      systemInstruction: params.systemInstruction,
      temperature: params.temperature ?? 0.6,
      responseMimeType: 'application/json',
      responseSchema: params.responseSchema,
      httpOptions: {
        headers: {
          'User-Agent': 'VisionAI-Studio/2.0 (AI-Studio-Build; @google/genai)',
        },
      },
    },
  });

  const text = response.text || '{}';
  return JSON.parse(text) as T;
}

export { Type };
