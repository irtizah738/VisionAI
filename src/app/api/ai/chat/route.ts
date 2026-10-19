import { NextRequest, NextResponse } from 'next/server';
import { handleAIRequest } from '@/ai/core';
import { handleError } from '../route';
import { checkRateLimit } from '@/lib/rate-limit';
import { getBrandVoicePromptContext, getVisionAiStore } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  const rateLimited = checkRateLimit(request, {
    keyPrefix: 'ai:chat',
    limit: 30,
    windowMs: 60_000,
  });
  if (rateLimited) return rateLimited;

  try {
    const body = await request.json();
    const {
      message,
      mode = 'general',
      context = [],
      useBrandVoice = true,
      brandVoiceOverride,
    } = body;

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    const brandVoiceContext = useBrandVoice
      ? getBrandVoicePromptContext(brandVoiceOverride)
      : '';

    const modeInstructions: Record<string, string> = {
      general:
        'You are VisionAI Assistant, an expert AI marketing strategist and growth advisor.',
      content:
        'You are VisionAI Content Director. Write high-converting, platform-native social posts, blogs, and ad copy.',
      seo:
        'You are VisionAI Technical SEO Architect. Provide keyword clusters, meta tags, and SERP optimization insights.',
      social:
        'You are VisionAI Social Command Center Strategist. Optimize hooks for X (280), LinkedIn (210 fold), Instagram (125 fold), Facebook, and YouTube.',
      analytics:
        'You are VisionAI Growth Analyst. Interpret campaign ROI, CTR, conversion funnels, and attribution metrics.',
    };

    const baseInstruction = modeInstructions[mode] || modeInstructions.general;
    const systemInstruction = brandVoiceContext
      ? `${baseInstruction}\n\nAlways adhere strictly to the workspace Brand Voice Memory below:\n${brandVoiceContext}`
      : baseInstruction;

    const historyText = Array.isArray(context)
      ? context
          .slice(-6)
          .map((m: any) => `${m.role || 'user'}: ${m.content || ''}`)
          .join('\n')
      : '';

    const fullPrompt = `${historyText ? `Recent Context:\n${historyText}\n\n` : ''}User Request (${mode}): ${message}`;

    const { state } = getVisionAiStore();
    const brandName = state.brandVoice?.brandName || 'VisionAI';

    const response = await handleAIRequest<string>(fullPrompt, {
      systemInstruction,
      fallback: `Here is your tailored **${mode.toUpperCase()}** action plan for "${message}" (aligned with **${brandName}** Brand Voice Memory — *${state.brandVoice?.tone || 'Executive'}*):\n\n1. **Above-the-Fold Hook**: Keep your opening hook under 125 characters so it never truncates prematurely on mobile feeds.\n2. **Multi-Channel Execution**: Deploy tailored variations across X/Twitter, LinkedIn, Instagram, Facebook, and YouTube using native link cards.\n3. **Brand CTA**: ${state.brandVoice?.ctaStyle || 'Drive clicks to https://visionai.studio/launch with measurable ROI proof.'}`,
    });

    const content = response.data || 'Ready to assist with your marketing strategy.';

    return NextResponse.json({
      id: Date.now().toString(),
      role: 'assistant',
      content,
      message: content,
      brandVoiceApplied: Boolean(brandVoiceContext),
      brandName: state.brandVoice?.brandName,
      timestamp: new Date().toISOString(),
      model: response.model,
    });
  } catch (error) {
    return handleError(error);
  }
}