import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/googleai';
import { LRUCache } from 'lru-cache';
import { env, AI_CONFIG, AIResponse } from './config';
import { rateLimit } from 'express-rate-limit';

// Initialize cache
const aiCache = new LRUCache<string, any>({
  max: AI_CONFIG.cache.maxSize,
  ttl: AI_CONFIG.cache.ttl * 1000,
});

// Initialize rate limiter
export const aiRateLimiter = rateLimit({
  windowMs: AI_CONFIG.rateLimit.windowMs,
  max: AI_CONFIG.rateLimit.max,
  message: 'Too many AI requests, please try again later.',
});

// Initialize AI client
export const ai = genkit({
  plugins: [googleAI()],
  model: AI_CONFIG.models.primary,
});

// Generic AI request handler with retries, caching, and error handling
export async function handleAIRequest<T>({
  key,
  prompt,
  useCache = true,
  customModel,
}: {
  key: string;
  prompt: string;
  useCache?: boolean;
  customModel?: string;
}): Promise<AIResponse<T>> {
  const startTime = Date.now();
  
  try {
    // Check cache first if enabled
    if (useCache) {
      const cached = aiCache.get(key);
      if (cached) {
        return {
          success: true,
          data: cached,
          model: 'cache',
          timing: {
            startTime,
            endTime: Date.now(),
            duration: Date.now() - startTime,
          },
        };
      }
    }

    let lastError: Error | null = null;
    
    // Attempt with retries
    for (let i = 0; i < AI_CONFIG.retries; i++) {
      try {
        const model = i === 0 ? (customModel || AI_CONFIG.models.primary) : AI_CONFIG.models.fallback;
        
        const response = await Promise.race([
          ai.generate({
            model,
            prompt,
          }),
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error('AI request timeout')), AI_CONFIG.timeout)
          ),
        ]);

        const result = response as T;
        
        // Cache successful response if caching is enabled
        if (useCache) {
          aiCache.set(key, result);
        }

        return {
          success: true,
          data: result,
          model,
          timing: {
            startTime,
            endTime: Date.now(),
            duration: Date.now() - startTime,
          },
        };
      } catch (error) {
        lastError = error as Error;
        // If this was the last retry, throw the error
        if (i === AI_CONFIG.retries - 1) throw error;
        // Otherwise, continue to next retry
        await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1))); // Exponential backoff
      }
    }

    throw lastError;
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
      model: customModel || AI_CONFIG.models.primary,
      timing: {
        startTime,
        endTime: Date.now(),
        duration: Date.now() - startTime,
      },
    };
  }
} 