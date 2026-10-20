import { NextRequest, NextResponse } from 'next/server';
import {
  getGenAIClient,
  DEFAULT_GEMINI_MODEL,
  COMPLEX_GEMINI_MODEL,
  FAST_GEMINI_MODEL,
  GroundingSource,
} from '@/ai/genai-client';
import { handleError } from '../route';
import { checkRateLimit } from '@/lib/rate-limit';
import { getBrandVoicePromptContext, getVisionAiStore } from '@/lib/prisma';

const ALLOWED_CHAT_MODELS = new Set([
  COMPLEX_GEMINI_MODEL, // gemini-4-argon (complex reasoning / strategy)
  DEFAULT_GEMINI_MODEL, // gemini-3.8-flash (general tasks & search grounding)
  FAST_GEMINI_MODEL,    // gemini-3.1-flash-lite (fast tasks)
]);

export async function POST(request: NextRequest) {
  const rateLimited = checkRateLimit(request, {
    keyPrefix: 'ai:chat',
    limit: 40,
    windowMs: 60_000,
  });
  if (rateLimited) return rateLimited;

  try {
    const body = await request.json();
    const {
      message,
      mode = 'general',
      model: requestedModel,
      history = [],
      context = [],
      useBrandVoice = true,
      useSearchGrounding = false,
      brandVoiceOverride,
    } = body;

    if (!message || !String(message).trim()) {
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
        'You are VisionAI Executive Copilot, a versatile AI marketing strategist and omnichannel advisor.',
      marketing:
        'You are VisionAI Chief Marketing Strategist. Architect full-funnel GTM campaigns, budget allocations, positioning angles, and multi-touch attribution models.',
      content:
        'You are VisionAI Creative Content Director. Write high-converting, platform-native social posts, hooks, video scripts, blog articles, and email sequences.',
      seo:
        'You are VisionAI Technical SEO & Search Architect. Provide high-intent keyword clusters, SERP gap analysis, and structured metadata.',
      social:
        'You are VisionAI Social Command Center Strategist. Optimize hooks above mobile character folds for X (280), LinkedIn (210 fold), Instagram (125 fold), Facebook, and YouTube.',
      analytics:
        'You are VisionAI Principal Growth Data Scientist. Analyze conversion velocity, CAC/LTV ratios, cohort retention, and attribution lift.',
      fast:
        'You are VisionAI Rapid Copy & Hook Assistant. Deliver ultra-fast, punchy headlines, CTAs, hashtags, and micro-edits.',
    };

    // Select model based on explicit request or task complexity:
    // - gemini-4-argon for complex strategy/analytics tasks
    // - gemini-3.8-flash for general/content/social tasks & Google Search Grounding
    // - gemini-3.1-flash-lite for fast/quick tasks
    let selectedModel = DEFAULT_GEMINI_MODEL;
    if (requestedModel && ALLOWED_CHAT_MODELS.has(requestedModel)) {
      selectedModel = requestedModel;
    } else if (mode === 'marketing' || mode === 'analytics') {
      selectedModel = COMPLEX_GEMINI_MODEL;
    } else if (mode === 'fast') {
      selectedModel = FAST_GEMINI_MODEL;
    } else {
      selectedModel = DEFAULT_GEMINI_MODEL;
    }

    // If Google Search grounding is enabled, use gemini-3.8-flash (or keep selected model if supported)
    if (useSearchGrounding && selectedModel === FAST_GEMINI_MODEL) {
      selectedModel = DEFAULT_GEMINI_MODEL;
    }

    const baseInstruction = modeInstructions[mode] || modeInstructions.general;
    const systemInstruction = brandVoiceContext
      ? `${baseInstruction}\n\nAlways adhere strictly to the workspace Brand Voice Memory below:\n${brandVoiceContext}`
      : baseInstruction;

    const { state } = getVisionAiStore();
    const brandName = state.brandVoice?.brandName || 'VisionAI';

    // Normalize conversation history for multi-turn ai.chats.create
    const rawHistory = Array.isArray(history) && history.length > 0 ? history : context;
    const formattedHistory = Array.isArray(rawHistory)
      ? rawHistory
          .filter(
            (m: any) =>
              m &&
              typeof m.content === 'string' &&
              m.content.trim().length > 0 &&
              m.id !== 'welcome'
          )
          .slice(-16)
          .map((m: any) => ({
            role: m.role === 'assistant' || m.role === 'model' ? 'model' : 'user',
            parts: [{ text: String(m.content).trim() }],
          }))
      : [];

    const ai = getGenAIClient();
    let content = '';
    let sources: GroundingSource[] = [];
    let actualModelUsed = selectedModel;

    if (ai) {
      try {
        const chat = ai.chats.create({
          model: selectedModel,
          history: formattedHistory,
          config: {
            systemInstruction,
            ...(useSearchGrounding ? { tools: [{ googleSearch: {} }] } : {}),
          },
        });

        const response = await chat.sendMessage({
          message: String(message).trim(),
        });

        content = response.text || '';
        const chunks =
          response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
        for (const chunk of chunks) {
          if (chunk.web?.uri) {
            sources.push({
              uri: chunk.web.uri,
              title: chunk.web.title || chunk.web.uri,
            });
          }
        }
      } catch (primaryErr: any) {
        // If gemini-4-argon fails on a free-tier key, gracefully retry with gemini-3.8-flash
        if (selectedModel !== DEFAULT_GEMINI_MODEL) {
          try {
            actualModelUsed = DEFAULT_GEMINI_MODEL;
            const fallbackChat = ai.chats.create({
              model: DEFAULT_GEMINI_MODEL,
              history: formattedHistory,
              config: {
                systemInstruction,
                ...(useSearchGrounding ? { tools: [{ googleSearch: {} }] } : {}),
              },
            });
            const fallbackRes = await fallbackChat.sendMessage({
              message: String(message).trim(),
            });
            content = fallbackRes.text || '';
            const chunks =
              fallbackRes.candidates?.[0]?.groundingMetadata?.groundingChunks ||
              [];
            for (const chunk of chunks) {
              if (chunk.web?.uri) {
                sources.push({
                  uri: chunk.web.uri,
                  title: chunk.web.title || chunk.web.uri,
                });
              }
            }
          } catch {
            // Fall through to structured fallback below
          }
        }
      }
    }

    if (!content) {
      content = `Here is your tailored **${mode.toUpperCase()}** action plan for "${message}" (aligned with **${brandName}** Brand Voice Memory — *${state.brandVoice?.tone || 'Executive'}*):\n\n1. **Above-the-Fold Hook**: Keep your opening hook under 125 characters so it never truncates prematurely on mobile feeds.\n2. **Multi-Channel Execution**: Deploy tailored variations across X/Twitter, LinkedIn, Instagram, Facebook, and YouTube using native link cards.\n3. **Brand CTA**: ${state.brandVoice?.ctaStyle || 'Drive clicks to https://visionai.studio/launch with measurable ROI proof.'}`;
    }

    return NextResponse.json({
      id: Date.now().toString(),
      role: 'assistant',
      content,
      message: content,
      sources,
      brandVoiceApplied: Boolean(brandVoiceContext),
      brandName: state.brandVoice?.brandName,
      timestamp: new Date().toISOString(),
      model: actualModelUsed,
      mode,
    });
  } catch (error) {
    return handleError(error);
  }
}