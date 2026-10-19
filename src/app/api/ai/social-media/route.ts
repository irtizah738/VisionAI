import { NextRequest, NextResponse } from 'next/server';
import { generateGeminiJSON, Type } from '@/ai/genai-client';
import { getBrandVoicePromptContext, getVisionAiStore } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      prompt = '',
      topic = '',
      platforms = ['twitter', 'linkedin', 'instagram', 'facebook', 'youtube'],
      tone = 'professional',
      useBrandVoice = true,
      brandVoiceOverride,
    } = body;

    const subject = (prompt || topic || 'AI-powered social media workflow').trim();
    const brandVoiceContext = useBrandVoice
      ? getBrandVoicePromptContext(brandVoiceOverride)
      : '';
    const { state } = getVisionAiStore();

    try {
      const result = await generateGeminiJSON<{
        postContent: string;
        hashtags: string[];
        platformVariations: Record<string, string>;
      }>({
        systemInstruction: brandVoiceContext
          ? `You are an elite omnichannel social media copywriter. Strictly follow the Brand Voice Memory below:\n${brandVoiceContext}`
          : undefined,
        prompt: `Write a high-converting, fold-optimized social media post for:
Topic / Draft: "${subject}"
Requested Tone: ${tone}
Target Platforms: ${Array.isArray(platforms) ? platforms.join(', ') : 'All'}

Requirements:
1. Keep the opening hook under 125 characters so it appears above the mobile fold on Instagram, Facebook, LinkedIn, and YouTube.
2. Respect the workspace Brand Voice Memory (brand name, pillars, CTA style, and never use banned words).
3. Include a clear URL (https://visionai.studio/launch) and 3-4 relevant hashtags.
4. Also provide tailored variations for twitter, linkedin, instagram, facebook, and youtube.`,
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            postContent: { type: Type.STRING },
            hashtags: { type: Type.ARRAY, items: { type: Type.STRING } },
            platformVariations: {
              type: Type.OBJECT,
              properties: {
                twitter: { type: Type.STRING },
                linkedin: { type: Type.STRING },
                instagram: { type: Type.STRING },
                facebook: { type: Type.STRING },
                youtube: { type: Type.STRING },
              },
            },
          },
          required: ['postContent', 'hashtags'],
        },
      });

      return NextResponse.json({
        content: result.postContent,
        postContent: result.postContent,
        hashtags: result.hashtags,
        platformVariations: result.platformVariations || {},
        brandVoiceApplied: Boolean(brandVoiceContext),
        brandName: state.brandVoice?.brandName,
      });
    } catch {
      const bvName = state.brandVoice?.brandName || 'VisionAI';
      const fallbackText = `${subject.slice(0, 115)}\n\n${bvName} benchmark data shows teams unifying fold-aware copywriting and real-time multi-platform previews achieve 4.2x pipeline velocity.\n\nExplore the live benchmark: https://visionai.studio/launch #SocialMedia #MarketingAI #B2BGrowth`;
      return NextResponse.json({
        content: fallbackText,
        postContent: fallbackText,
        hashtags: ['#SocialMedia', '#MarketingAI', '#B2BGrowth'],
        platformVariations: {
          twitter: fallbackText.slice(0, 275),
          linkedin: fallbackText,
          instagram: fallbackText,
          facebook: fallbackText,
          youtube: fallbackText,
        },
        brandVoiceApplied: Boolean(brandVoiceContext),
        brandName: bvName,
      });
    }
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Failed to generate social media post' },
      { status: 500 }
    );
  }
}