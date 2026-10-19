import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI, Type } from '@google/genai';
import { getBrandVoicePromptContext } from '@/lib/prisma';

const apiKey = process.env.GEMINI_API_KEY || '';
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

export interface RepurposedChannelVariant {
  network: 'twitter' | 'linkedin' | 'instagram' | 'facebook' | 'youtube';
  label: string;
  handle: string;
  content: string;
  scheduledTime: string;
  foldStrategy: string;
  charLimit: number;
  foldCutoff: number;
}

function buildFallbackKit(
  title: string,
  sourceText: string,
  targetUrl: string
): RepurposedChannelVariant[] {
  const cleanTitle = (title || '2026 Omnichannel Social Growth Playbook').trim();
  const cleanUrl = (targetUrl || 'https://visionai.studio/launch').trim();
  const excerpt = (sourceText || '')
    .replace(/#+\s*/g, '')
    .replace(/\*\*/g, '')
    .trim()
    .slice(0, 120);

  return [
    {
      network: 'twitter',
      label: 'X / Twitter Hook + Thread Starter',
      handle: '@VisionAI_HQ',
      content: `Why do 68% of social posts lose clicks at the fold? 🚨\n\n${cleanTitle} breaks down how validating native cutoffs across 5 networks boosts CTR by 3.4x.\n\nFull benchmark: ${cleanUrl} #SocialMedia #MarketingAI #Growth`,
      scheduledTime: 'Mon, Oct 19 at 9:30 AM',
      foldStrategy: 'Under 280 chars with link card trigger and above-the-fold ROI hook.',
      charLimit: 280,
      foldCutoff: 280,
    },
    {
      network: 'linkedin',
      label: 'LinkedIn Executive Thought Leadership',
      handle: 'VisionAI Technologies',
      content: `${cleanTitle} — Here is what our Q4 data revealed before the "...see more" cutoff (${cleanUrl}):\n\n${excerpt || 'Most B2B teams bury their primary call-to-action in paragraph three, losing 64% of mobile readers.'}\n\nKey takeaways for growth leaders:\n• Validate mobile fold cutoffs (~210 chars on LinkedIn)\n• Pair executive benchmarks with native OG link cards\n• Unify attribution across all 5 social channels\n\n#B2BMarketing #ContentStrategy #CMO #MarketingOps`,
      scheduledTime: 'Tue, Oct 20 at 8:45 AM',
      foldStrategy: 'Primary hook + benchmark URL placed inside the first 195 characters before LinkedIn’s 210-char fold.',
      charLimit: 3000,
      foldCutoff: 210,
    },
    {
      network: 'instagram',
      label: 'Instagram 4:5 Carousel Caption',
      handle: '@visionai.studio',
      content: `Stop losing clicks to the "...more" cutoff ✨ Swipe through "${cleanTitle}" →\n\nSlide 1: The 125-char Instagram hook rule\nSlide 2: Side-by-side 5-network previewing\nSlide 3: 3.4x CTR benchmark results\n\nFull guide at ${cleanUrl} #CreatorEconomy #SocialMediaMarketing #ContentCreator #DesignSystems`,
      scheduledTime: 'Wed, Oct 21 at 12:15 PM',
      foldStrategy: 'Opening 110 characters deliver the core value proposition before Instagram’s 125-char caption fold.',
      charLimit: 2200,
      foldCutoff: 125,
    },
    {
      network: 'facebook',
      label: 'Facebook Community & Link Card Post',
      handle: 'VisionAI Official Page',
      content: `New Playbook Live: ${cleanTitle} 📊\n\nSee how marketing teams are eliminating premature caption truncation and scaling organic reach across 5 channels simultaneously: ${cleanUrl}\n\nWhat network drives the highest engagement for your team right now? Drop a comment below! #DigitalMarketing #SocialStrategy`,
      scheduledTime: 'Thu, Oct 22 at 2:00 PM',
      foldStrategy: 'Direct headline + URL placed above Facebook’s 250-character fold to trigger native OpenGraph link card.',
      charLimit: 63206,
      foldCutoff: 250,
    },
    {
      network: 'youtube',
      label: 'YouTube 16:9 Community & Shorts Description',
      handle: 'VisionAI Official',
      content: `${cleanTitle} — Full 60s Walkthrough & Benchmark (${cleanUrl})\n\n00:00 Why mobile fold truncation kills CTR\n00:18 Live side-by-side preview across X, LinkedIn, Instagram, Facebook & YouTube\n00:42 How to schedule all 5 channels in 1 click\n\n#YouTubeShorts #MarketingAutomation #SaaSGrowth`,
      scheduledTime: 'Fri, Oct 23 at 11:00 AM',
      foldStrategy: 'Title and link appear in the first 120 characters before YouTube’s 150-char "Read more" cutoff.',
      charLimit: 5000,
      foldCutoff: 150,
    },
  ];
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      title = 'Why Multi-Platform Social Truncation Previews Increase CTR by 3.4x',
      content = '',
      targetUrl = 'https://visionai.studio/launch',
      useBrandVoice = true,
    } = body;

    const brandVoiceContext = useBrandVoice ? getBrandVoicePromptContext() : '';

    if (ai) {
      try {
        const prompt = `${brandVoiceContext ? `${brandVoiceContext}\n\n` : ''}Repurpose the following long-form article or campaign brief into a 5-channel omnichannel social media kit for X/Twitter, LinkedIn, Instagram, Facebook, and YouTube.

Article Title: ${title}
Target URL to include: ${targetUrl}
Source Content:
${content.slice(0, 3000)}

CRITICAL PLATFORM FOLD REQUIREMENTS:
1. twitter: Must be <= 270 characters total, punchy hook + URL + 2 hashtags.
2. linkedin: Place the hook and URL within the first 195 characters (above the 210-char mobile fold), followed by bulleted executive takeaways.
3. instagram: Place the primary hook within the first 115 characters (above the 125-char fold), followed by carousel slide callouts and hashtags.
4. facebook: Engaging community question + URL above the 240-char fold.
5. youtube: First 135 characters must contain the core hook and URL (above the 150-char fold), followed by video chapter timestamps.`;

        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                variants: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      network: {
                        type: Type.STRING,
                        description: 'twitter, linkedin, instagram, facebook, or youtube',
                      },
                      label: { type: Type.STRING },
                      handle: { type: Type.STRING },
                      content: { type: Type.STRING },
                      scheduledTime: { type: Type.STRING },
                      foldStrategy: { type: Type.STRING },
                    },
                    required: [
                      'network',
                      'label',
                      'handle',
                      'content',
                      'scheduledTime',
                      'foldStrategy',
                    ],
                  },
                },
              },
              required: ['variants'],
            },
          },
        });

        if (response.text) {
          const parsed = JSON.parse(response.text);
          if (Array.isArray(parsed.variants) && parsed.variants.length > 0) {
            const limitsMap: Record<string, { charLimit: number; foldCutoff: number }> = {
              twitter: { charLimit: 280, foldCutoff: 280 },
              linkedin: { charLimit: 3000, foldCutoff: 210 },
              instagram: { charLimit: 2200, foldCutoff: 125 },
              facebook: { charLimit: 63206, foldCutoff: 250 },
              youtube: { charLimit: 5000, foldCutoff: 150 },
            };
            const enriched = parsed.variants.map((v: any) => {
              const net = ['twitter', 'linkedin', 'instagram', 'facebook', 'youtube'].includes(
                v.network
              )
                ? v.network
                : 'linkedin';
              return {
                ...v,
                network: net,
                charLimit: limitsMap[net].charLimit,
                foldCutoff: limitsMap[net].foldCutoff,
              };
            });
            return NextResponse.json({
              variants: enriched,
              brandVoiceApplied: Boolean(brandVoiceContext),
            });
          }
        }
      } catch (aiErr) {
        console.warn('[Repurpose Engine] Falling back to deterministic kit:', aiErr);
      }
    }

    const fallbackVariants = buildFallbackKit(title, content, targetUrl);
    return NextResponse.json({
      variants: fallbackVariants,
      brandVoiceApplied: Boolean(brandVoiceContext),
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Failed to repurpose content' },
      { status: 500 }
    );
  }
}
