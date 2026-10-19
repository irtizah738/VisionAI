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

    const metrics = await CampaignService.getCampaignMetrics(params.id);
    if (!metrics) {
      return NextResponse.json({ error: 'Metrics not found' }, { status: 404 });
    }

    return NextResponse.json(metrics);
  } catch (error) {
    console.error('Campaign metrics fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch campaign metrics' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const metrics = await CampaignService.updateCampaignMetrics(params.id, body);
    return NextResponse.json(metrics);
  } catch (error) {
    console.error('Campaign metrics update error:', error);
    return NextResponse.json(
      { error: 'Failed to update campaign metrics' },
      { status: 500 }
    );
  }
}
 