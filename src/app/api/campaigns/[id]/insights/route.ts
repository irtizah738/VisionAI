import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const campaign = await prisma.campaign.findUnique({ where: { id } });

    return NextResponse.json({
      campaignId: id,
      campaignName: campaign?.name || 'Omnichannel Campaign',
      performancePrediction: 92,
      suggestedOptimizations: [
        'Front-load primary value proposition in the first 110 characters above the mobile fold.',
        'Reallocate 15% of budget toward LinkedIn & X threads during peak 9:00 AM EST engagement windows.',
        'Enable automated UTM pipeline attribution for all outbound CTAs.',
      ],
      audienceInsights: [
        'B2B SaaS Decision Makers respond 2.4x higher to benchmark carousels.',
        'Video hooks under 45 seconds drive 38% higher completion rates.',
      ],
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Failed to get AI insights' },
      { status: 500 }
    );
  }
}