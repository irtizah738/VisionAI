import { DEFAULT_GEMINI_MODEL, generateGeminiText } from './genai-client';

export interface AIResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  cached?: boolean;
  model: string;
  timing: {
    start: number;
    end: number;
    duration: number;
  };
}

export async function handleAIRequest<T>(
  prompt: string,
  options: {
    model?: string;
    temperature?: number;
    maxTokens?: number;
    useCache?: boolean;
    systemInstruction?: string;
    fallback?: T;
  } = {}
): Promise<AIResponse<T>> {
  const startTime = Date.now();
  const modelName = options.model || DEFAULT_GEMINI_MODEL;

  try {
    const text = await generateGeminiText({
      prompt,
      model: modelName,
      temperature: options.temperature,
      maxOutputTokens: options.maxTokens,
      systemInstruction: options.systemInstruction,
    });

    const endTime = Date.now();
    return {
      success: true,
      data: text as unknown as T,
      model: modelName,
      timing: {
        start: startTime,
        end: endTime,
        duration: endTime - startTime,
      },
    };
  } catch (error: any) {
    const endTime = Date.now();
    if (options.fallback !== undefined) {
      return {
        success: true,
        data: options.fallback,
        model: modelName,
        timing: {
          start: startTime,
          end: endTime,
          duration: endTime - startTime,
        },
      };
    }
    return {
      success: false,
      error: error?.message || 'AI request failed',
      model: modelName,
      timing: {
        start: startTime,
        end: endTime,
        duration: endTime - startTime,
      },
    };
  }
}