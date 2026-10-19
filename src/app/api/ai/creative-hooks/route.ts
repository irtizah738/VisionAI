import { NextRequest, NextResponse } from 'next/server';
import { generateGeminiJSON, Type } from '@/ai/genai-client';
import { getBrandVoicePromptContext, getVisionAiStore } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { topic = '', tone = 'bold & punchy', targetAudience = 'Growth Marketers' } = body;

    const subject = (topic || 'AI Marketing Automation & Growth').trim();
    const brandVoiceContext = getBrandVoicePromptContext();
    const { state } = getVisionAiStore();

    try {
      const result = await generateGeminiJSON<{
        suggestions: Array<{
          headline: string;
          subhead: string;
          ctaBadge: string;
          hookCategory: string;
          badgeColorHex: string;
        }>;
      }>({
        systemInstruction: brandVoiceContext
          ? `You are an expert social media creative director and visual copywriter. Strictly follow the Brand Voice Memory below:\n${brandVoiceContext}`
          : `You are an expert social media creative director and visual copywriter.`,
        prompt: `Generate 5 high-converting visual graphic hooks for a social media canvas design.
Topic / Product: "${subject}"
Tone: ${tone}
Target Audience: ${targetAudience}

Requirements:
1. "headline": Short, powerful, scroll-stopping title (3 to 8 words max).
2. "subhead": Supporting value statement or punchy elaboration (6 to 14 words max).
3. "ctaBadge": High-converting CTA pill label (e.g., "SWIPE FOR PROOF ->", "READ BLUEPRINT", "CLAIM 30-DAY TRIAL", "LINK IN BIO").
4. "hookCategory": One of ["Curiosity", "Bold Stat", "How-To", "Mistake / Warning", "Framework / Checklist"].
5. "badgeColorHex": Accent color hex suitable for badge background (e.g. "#10B981", "#6366F1", "#F59E0B", "#EC4899", "#3B82F6").`,
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            suggestions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  headline: { type: Type.STRING },
                  subhead: { type: Type.STRING },
                  ctaBadge: { type: Type.STRING },
                  hookCategory: { type: Type.STRING },
                  badgeColorHex: { type: Type.STRING },
                },
                required: ['headline', 'subhead', 'ctaBadge'],
              },
            },
          },
          required: ['suggestions'],
        },
      });

      return NextResponse.json({
        suggestions: result.suggestions || [],
        brandVoiceApplied: Boolean(brandVoiceContext),
        brandName: state.brandVoice?.brandName || 'VisionAI',
      });
    } catch {
      // High quality fallback options
      const bvName = state.brandVoice?.brandName || 'VisionAI';
      const fallbacks = [
        {
          headline: `Stop Guessing Your ${subject.split(' ')[0] || 'Growth'} Strategy`,
          subhead: `How top teams leverage ${bvName} to scale campaign ROI by 4.2x without increasing ad spend.`,
          ctaBadge: "SWIPE FOR BLUEPRINT ->",
          hookCategory: "Curiosity",
          badgeColorHex: "#10B981",
        },
        {
          headline: "3 Costly Marketing Mistakes You're Making Right Now",
          subhead: "Uncover the hidden leak in your conversion funnel and fix it in under 10 minutes.",
          ctaBadge: "GET THE CHECKLIST",
          hookCategory: "Mistake / Warning",
          badgeColorHex: "#EF4444",
        },
        {
          headline: "The 2026 AI Campaign Operating System",
          subhead: "Unified social publishing, automated copy, and real-time ROI tracking in one command center.",
          ctaBadge: "CLAIM FREE ACCESS",
          hookCategory: "Framework / Checklist",
          badgeColorHex: "#6366F1",
        },
        {
          headline: "From 1K to 100K Impressions in 30 Days",
          subhead: "The exact organic distribution playbook used by leading B2B growth leaders.",
          ctaBadge: "LINK IN BIO",
          hookCategory: "Bold Stat",
          badgeColorHex: "#F59E0B",
        },
      ];

      return NextResponse.json({
        suggestions: fallbacks,
        brandVoiceApplied: Boolean(brandVoiceContext),
        brandName: bvName,
      });
    }
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Failed to generate creative hooks' },
      { status: 500 }
    );
  }
}
