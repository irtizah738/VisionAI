import { z } from 'zod';

const fallbackKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_AI_API_KEY || process.env.GOOGLE_GENAI_API_KEY || 'placeholder-key';

// Environment variable validation schema
const envSchema = z.object({
  GOOGLE_AI_API_KEY: z.string().default(fallbackKey),
  OPENAI_API_KEY: z.string().min(1).optional(),
  AI_RATE_LIMIT: z.string().default('100'),  // requests per minute
  AI_CACHE_TTL: z.string().default('3600'),  // cache TTL in seconds
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
});

// Validate environment variables safely with defaults
export const env = envSchema.parse({
  ...process.env,
  GOOGLE_AI_API_KEY: fallbackKey,
});

// AI Configuration
export const AI_CONFIG = {
  rateLimit: {
    windowMs: 60 * 1000, // 1 minute
    max: parseInt(env.AI_RATE_LIMIT, 10),
  },
  cache: {
    ttl: parseInt(env.AI_CACHE_TTL, 10),
    maxSize: 1000, // maximum number of items in cache
  },
  models: {
    primary: 'googleai/gemini-2.0-flash',
    fallback: 'googleai/gemini-1.5-flash',
  },
  timeout: 30000, // 30 seconds
  retries: 3,
} as const;

// Response types for different AI features
export type AIResponse<T> = {
  success: boolean;
  data?: T;
  error?: string;
  model: string;
  timing: {
    startTime: number;
    endTime: number;
    duration: number;
  };
};