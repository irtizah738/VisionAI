import { handleAIRequest } from './core';
import { logger } from '@/lib/logger';

// Types for different AI features
export interface SentimentAnalysis {
  sentiment: 'positive' | 'negative' | 'neutral';
  score: number;
  highlights: string[];
}

export interface KeywordExtraction {
  keywords: string[];
  relevanceScores: number[];
}

export interface ContentSummary {
  summary: string;
  keyPoints: string[];
  wordCount: number;
}

export interface SocialMediaPost {
  content: string;
  hashtags: string[];
  bestTimeToPost?: string;
  targetPlatform: string;
}

export interface SEOSuggestions {
  title: string;
  description: string;
  keywords: string[];
  improvements: string[];
}

export interface TranslationResult {
  translatedText: string;
  detectedLanguage?: string;
  confidence: number;
}

export interface ImageAnalysis {
  description: string;
  tags: string[];
  objects: Array<{
    name: string;
    confidence: number;
    location?: { x: number; y: number; width: number; height: number };
  }>;
  textContent?: string[];
  dominantColors: string[];
}

export interface CompetitorAnalysis {
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
  recommendations: string[];
}

export interface ContentIdeas {
  topics: string[];
  headlines: string[];
  keypoints: Record<string, string[]>;
}

// AI Feature implementations
export async function analyzeSentiment(text: string) {
  logger.info('Analyzing sentiment', { textLength: text.length });
  const timer = logger.startTimer('sentiment-analysis');

  const response = await handleAIRequest<SentimentAnalysis>({
    key: `sentiment:${text.substring(0, 50)}`,
    prompt: `Analyze the sentiment of the following text and provide a structured response with sentiment (positive/negative/neutral), score (0-1), and key highlights: "${text}"`,
  });

  timer();
  return response;
}

export async function extractKeywords(text: string, maxKeywords: number = 10) {
  logger.info('Extracting keywords', { textLength: text.length, maxKeywords });
  const timer = logger.startTimer('keyword-extraction');

  const response = await handleAIRequest<KeywordExtraction>({
    key: `keywords:${text.substring(0, 50)}:${maxKeywords}`,
    prompt: `Extract up to ${maxKeywords} relevant keywords from the following text, with relevance scores (0-1): "${text}"`,
  });

  timer();
  return response;
}

export async function summarizeContent(text: string, maxLength: number = 250) {
  logger.info('Summarizing content', { textLength: text.length, maxLength });
  const timer = logger.startTimer('content-summarization');

  const response = await handleAIRequest<ContentSummary>({
    key: `summary:${text.substring(0, 50)}:${maxLength}`,
    prompt: `Summarize the following text in maximum ${maxLength} words, including key points: "${text}"`,
  });

  timer();
  return response;
}

export async function generateSocialPost(
  topic: string,
  platform: 'twitter' | 'linkedin' | 'instagram' | 'facebook',
  tone: string = 'professional'
) {
  logger.info('Generating social post', { topic, platform, tone });
  const timer = logger.startTimer('social-post-generation');

  const response = await handleAIRequest<SocialMediaPost>({
    key: `social:${platform}:${topic.substring(0, 30)}:${tone}`,
    prompt: `Generate a ${tone} social media post for ${platform} about: "${topic}". Include relevant hashtags and best time to post.`,
  });

  timer();
  return response;
}

export async function optimizeSEO(content: string, targetKeywords: string[] = []) {
  logger.info('Optimizing SEO', { contentLength: content.length, targetKeywords });
  const timer = logger.startTimer('seo-optimization');

  const response = await handleAIRequest<SEOSuggestions>({
    key: `seo:${content.substring(0, 50)}:${targetKeywords.join(',')}`,
    prompt: `Analyze and provide SEO optimization suggestions for the following content${targetKeywords.length ? ` targeting keywords: ${targetKeywords.join(', ')}` : ''}: "${content}"`,
  });

  timer();
  return response;
}

export async function translateContent(
  text: string,
  targetLanguage: string,
  sourceLanguage?: string
) {
  logger.info('Translating content', { 
    textLength: text.length,
    targetLanguage,
    sourceLanguage 
  });
  const timer = logger.startTimer('translation');

  const response = await handleAIRequest<TranslationResult>({
    key: `translate:${sourceLanguage || 'auto'}:${targetLanguage}:${text.substring(0, 50)}`,
    prompt: `Translate the following text ${sourceLanguage ? `from ${sourceLanguage}` : ''} to ${targetLanguage}: "${text}"`,
  });

  timer();
  return response;
}

export async function analyzeImage(imageUrl: string) {
  logger.info('Analyzing image', { imageUrl });
  const timer = logger.startTimer('image-analysis');

  const response = await handleAIRequest<ImageAnalysis>({
    key: `image:${imageUrl}`,
    prompt: `Analyze this image and provide a detailed description, tags, detected objects, any text content, and dominant colors: ${imageUrl}`,
  });

  timer();
  return response;
}

export async function analyzeCompetitors(
  competitors: string[],
  industry: string,
  focusAreas: string[]
) {
  logger.info('Analyzing competitors', { competitors, industry, focusAreas });
  const timer = logger.startTimer('competitor-analysis');

  const response = await handleAIRequest<CompetitorAnalysis>({
    key: `competitors:${industry}:${competitors.join(',')}`,
    prompt: `Perform a SWOT analysis for the following competitors: ${competitors.join(', ')} in the ${industry} industry, focusing on: ${focusAreas.join(', ')}`,
  });

  timer();
  return response;
}

export async function generateContentIdeas(
  topic: string,
  targetAudience: string,
  contentType: 'blog' | 'social' | 'email' | 'video'
) {
  logger.info('Generating content ideas', { topic, targetAudience, contentType });
  const timer = logger.startTimer('content-ideation');

  const response = await handleAIRequest<ContentIdeas>({
    key: `ideas:${contentType}:${topic}:${targetAudience}`,
    prompt: `Generate content ideas for ${contentType} content about "${topic}" targeting ${targetAudience}. Include topics, headlines, and key points for each topic.`,
  });

  timer();
  return response;
} 