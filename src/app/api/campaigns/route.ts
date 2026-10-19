import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const campaigns = await prisma.campaign.findMany();
    return NextResponse.json({ campaigns });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Failed to fetch campaigns' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name,
      description = '',
      type = 'multi-channel',
      status = 'active',
      budget = 5000,
      channels = ['twitter', 'linkedin'],
      startDate,
      endDate,
    } = body;

    if (!name || !String(name).trim()) {
      return NextResponse.json(
        { error: 'Campaign name is required' },
        { status: 400 }
      );
    }

    const numericBudget = Number(budget) || 5000;
    const campaign = await prisma.campaign.create({
      data: {
        id: `camp_${Date.now()}`,
        name: String(name).trim(),
        description: String(description).trim(),
        type,
        status,
        budget: numericBudget,
        spent: 0,
        impressions: 0,
        clicks: 0,
        conversions: 0,
        roi: 0,
        channels: Array.isArray(channels) ? channels : ['twitter', 'linkedin'],
        startDate: startDate || new Date().toISOString().split('T')[0],
        endDate:
          endDate ||
          new Date(Date.now() + 86400000 * 30).toISOString().split('T')[0],
        userId: 'usr_visionai_admin',
      },
    });

    return NextResponse.json({ campaign }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Failed to create campaign' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updates } = body;
    if (!id) {
      return NextResponse.json(
        { error: 'Campaign ID is required' },
        { status: 400 }
      );
    }
    const updated = await prisma.campaign.update({
      where: { id },
      data: updates,
    });
    return NextResponse.json({ campaign: updated });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Failed to update campaign' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json(
        { error: 'Campaign ID is required' },
        { status: 400 }
      );
    }
    await prisma.campaign.delete({ where: { id } });
    return NextResponse.json({ success: true, id });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Failed to delete campaign' },
      { status: 500 }
    );
  }
}