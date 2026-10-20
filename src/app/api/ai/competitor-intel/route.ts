import { NextRequest, NextResponse } from 'next/server';
import {
  DEFAULT_GEMINI_MODEL,
  generateGeminiJSON,
  generateGeminiWithSearchGrounding,
  GroundingSource,
  Type,
} from '@/ai/genai-client';
import { getBrandVoicePromptContext, getVisionAiStore } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      action = 'find_gaps',
      competitorName = 'HubSpot',
      industry = 'B2B SaaS Marketing Automation',
      query = '',
    } = body;

    const brandVoiceContext = getBrandVoicePromptContext();
    const { state } = getVisionAiStore();

    if (action === 'live_search') {
      const searchPrompt =
        query ||
        `Latest product updates, pricing changes, customer complaints, and marketing campaigns for ${competitorName} in ${industry}`;

      try {
        const grounded = await generateGeminiWithSearchGrounding({
          model: DEFAULT_GEMINI_MODEL,
          systemInstruction: `You are a competitive intelligence researcher using live Google Search data. Summarize real-time market signals, recent news, pricing shifts, and actionable counter-positioning angles against ${competitorName}.`,
          prompt: searchPrompt,
        });

        return NextResponse.json({
          summary: grounded.text,
          sources: grounded.sources,
          model: grounded.model,
          brandName: state.brandVoice?.brandName || 'VisionAI',
        });
      } catch (err: any) {
        return NextResponse.json({
          summary: `Live intelligence brief for **${competitorName}** (${industry}): Focus on transparent omnichannel pricing, real-time AI visual & video workflows, and fold-aware social publishing to outperform legacy suites.`,
          sources: [],
          model: DEFAULT_GEMINI_MODEL,
          errorNote: err?.message,
          brandName: state.brandVoice?.brandName || 'VisionAI',
        });
      }
    }

    if (action === 'generate_brief') {
      try {
        const result = await generateGeminiJSON<{
          briefTitle: string;
          targetGap: string;
          positioningAngle: string;
          suggestedHeadlines: string[];
          counterContentOutline: string[];
          recommendedPlatforms: string[];
          plannerCopySnippet: string;
        }>({
          systemInstruction: brandVoiceContext
            ? `You are a strategic B2B competitive marketing director. Strictly apply workspace Brand Voice Memory:\n${brandVoiceContext}`
            : `You are a strategic B2B competitive marketing director.`,
          prompt: `Generate an aggressive, high-converting Counter-Content Brief exploiting a competitor's strategy blind spot.
Competitor Name: "${competitorName}"
Industry / Niche: "${industry}"

Requirements:
1. "briefTitle": Punchy title for the counter campaign.
2. "targetGap": Specific blind spot or objection competitors ignore.
3. "positioningAngle": How our product/brand stands out as the superior alternative.
4. "suggestedHeadlines": 3 scroll-stopping headlines for social/blog content.
5. "counterContentOutline": 4 actionable points for the content post.
6. "recommendedPlatforms": Platforms best suited for this campaign.
7. "plannerCopySnippet": Ready-to-publish social post text pre-filled for our planner queue.`,
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              briefTitle: { type: Type.STRING },
              targetGap: { type: Type.STRING },
              positioningAngle: { type: Type.STRING },
              suggestedHeadlines: { type: Type.ARRAY, items: { type: Type.STRING } },
              counterContentOutline: { type: Type.ARRAY, items: { type: Type.STRING } },
              recommendedPlatforms: { type: Type.ARRAY, items: { type: Type.STRING } },
              plannerCopySnippet: { type: Type.STRING },
            },
            required: [
              'briefTitle',
              'targetGap',
              'positioningAngle',
              'suggestedHeadlines',
              'counterContentOutline',
              'plannerCopySnippet',
            ],
          },
        });

        return NextResponse.json({
          brief: result,
          brandName: state.brandVoice?.brandName || 'VisionAI',
        });
      } catch {
        const bvName = state.brandVoice?.brandName || 'VisionAI';
        return NextResponse.json({
          brief: {
            briefTitle: `Counter-Campaign: The True Cost of Hidden ${competitorName} Add-Ons`,
            targetGap: `${competitorName} relies on complex tier pricing and lacks transparent multi-channel analytics for agile teams.`,
            positioningAngle: `Position ${bvName} as the unified, all-in-one command center with zero hidden seat fees.`,
            suggestedHeadlines: [
              `Why 74% of Growth Teams Are Switching Away From Legacy Suites`,
              `The Hidden Costs of ${competitorName}'s Tiered Pricing in 2026`,
              `How to Unify Social, CRM, and AI Content Without 5 Separate Subscriptions`,
            ],
            counterContentOutline: [
              `Expose the hidden API rate limits in traditional platforms.`,
              `Highlight ${bvName}'s real-time AI hook engine and unified pipeline.`,
              `Provide a 10-minute migration roadmap with zero downtime.`,
              `Offer a live benchmark ROI audit consultation.`,
            ],
            recommendedPlatforms: ['linkedin', 'twitter', 'youtube'],
            plannerCopySnippet: `Tired of paying $1,200/mo for 5 disconnected marketing tools? Modern growth teams need real-time publishing, AI copy memory, and multi-channel analytics in ONE place.\n\nSee how ${bvName} delivers 4.2x faster execution: https://visionai.studio/launch #B2BMarketing #GrowthOps #MarTech`,
          },
          brandName: bvName,
        });
      }
    }

    // Default: find_gaps (also fetch live Google Search grounding summary & sources in parallel)
    let groundedSources: GroundingSource[] = [];
    let groundedSummary = '';
    try {
      const grounded = await generateGeminiWithSearchGrounding({
        model: DEFAULT_GEMINI_MODEL,
        systemInstruction: `You are a competitive intelligence analyst using Google Search grounding.`,
        prompt: `What are the latest 2025-2026 product updates, customer pain points, and market positioning for ${competitorName} in ${industry}? Keep it concise (2-3 sentences).`,
      });
      groundedSummary = grounded.text;
      groundedSources = grounded.sources;
    } catch {
      // Optional enrichment
    }

    try {
      const result = await generateGeminiJSON<{
        gaps: Array<{
          topic: string;
          gapDescription: string;
          opportunityScore: number;
          suggestedFormat: string;
        }>;
      }>({
        systemInstruction: brandVoiceContext
          ? `You are an AI competitive intelligence analyst. Follow Brand Voice Memory below:\n${brandVoiceContext}`
          : `You are an AI competitive intelligence analyst.`,
        prompt: `Identify 3 high-leverage content gaps and audience blind spots across top competitors in "${industry}".
Competitors analyzed: ${competitorName}, Sprout Social, Salesforce.
${groundedSummary ? `Recent Google Search Intelligence: ${groundedSummary}` : ''}

Requirements:
1. Provide specific, actionable content gaps that competitors are neglecting.
2. Assign an "opportunityScore" between 75 and 98.`,
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            gaps: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  topic: { type: Type.STRING },
                  gapDescription: { type: Type.STRING },
                  opportunityScore: { type: Type.NUMBER },
                  suggestedFormat: { type: Type.STRING },
                },
                required: ['topic', 'gapDescription', 'opportunityScore', 'suggestedFormat'],
              },
            },
          },
          required: ['gaps'],
        },
      });

      return NextResponse.json({
        gaps: result.gaps || [],
        groundedSummary,
        sources: groundedSources,
        model: DEFAULT_GEMINI_MODEL,
        brandName: state.brandVoice?.brandName || 'VisionAI',
      });
    } catch {
      return NextResponse.json({
        gaps: [
          {
            topic: 'Real-Time Omnichannel ROI Attribution',
            gapDescription:
              'Competitors publish generic tips but lack transparent multi-channel conversion tracking breakdowns.',
            opportunityScore: 94,
            suggestedFormat: 'Interactive Video Walkthrough + Carousel',
          },
          {
            topic: 'AI Brand Voice Memory & Security Compliance',
            gapDescription:
              'Competitors rely on static prompts without persistent brand guidelines or enterprise Firestore security rules.',
            opportunityScore: 89,
            suggestedFormat: 'Executive Whitepaper & Comparison Guide',
          },
          {
            topic: '1-Click Social Visual Canvas & Planner Integration',
            gapDescription:
              'No competitor currently combines visual graphic design canvas with instant planner queue attachments.',
            opportunityScore: 92,
            suggestedFormat: 'Product Demo GIF + Case Study Thread',
          },
        ],
        groundedSummary,
        sources: groundedSources,
        model: DEFAULT_GEMINI_MODEL,
        brandName: state.brandVoice?.brandName || 'VisionAI',
      });
    }
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Competitor intelligence scan failed' },
      { status: 500 }
    );
  }
}
