import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { CampaignService } from '@/services/campaign';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const insights = await CampaignService.getAIInsights(params.id);
    return NextResponse.json(insights);
  } catch (error) {
    console.error('Campaign AI insights error:', error);
    return NextResponse.json(
      { error: 'Failed to get AI insights' },
      { status: 500 }
    );
  }
} 