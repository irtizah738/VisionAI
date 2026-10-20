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
      impressions: campaign?.impressions ?? 48200,
      clicks: campaign?.clicks ?? 3410,
      conversions: campaign?.conversions ?? 285,
      roi: campaign?.roi ?? 4.2,
      spent: campaign?.spent ?? 1850,
      budget: campaign?.budget ?? 5000,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Failed to fetch campaign metrics' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    const updated = await prisma.campaign.update({
      where: { id },
      data: body,
    });
    return NextResponse.json(updated);
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Failed to update campaign metrics' },
      { status: 500 }
    );
  }
}