import { NextRequest, NextResponse } from 'next/server';
import { prisma, StoredWorkspaceItem } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const suite = searchParams.get('suite');

    let items = await prisma.workspaceItem.findMany();
    if (
      suite &&
      ['content', 'cro', 'crm', 'segment', 'project', 'inbox'].includes(suite)
    ) {
      items = items.filter((item: StoredWorkspaceItem) => item.suite === suite);
    }

    return NextResponse.json({ items });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Failed to load workspace suite items' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      suite = 'content',
      title,
      status = 'active',
      summary = '',
      primaryMetric = 0,
      secondaryMetric = 0,
      meta = {},
    } = body;

    if (!title || !String(title).trim()) {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      );
    }

    const validSuite = [
      'content',
      'cro',
      'crm',
      'segment',
      'project',
      'inbox',
    ].includes(suite)
      ? suite
      : 'content';

    const created = await prisma.workspaceItem.create({
      data: {
        id: `ws_${validSuite}_${Date.now()}`,
        userId: 'usr_visionai_admin',
        suite: validSuite,
        title: String(title).trim().slice(0, 150),
        status: String(status || 'active').trim().slice(0, 64),
        summary: String(summary || '').trim().slice(0, 2000),
        primaryMetric: Number(primaryMetric) || 0,
        secondaryMetric: Number(secondaryMetric) || 0,
        meta,
      },
    });

    return NextResponse.json({ item: created }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Failed to create workspace suite item' },
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
        { error: 'Item ID is required' },
        { status: 400 }
      );
    }

    const updated = await prisma.workspaceItem.update({
      where: { id },
      data: updates,
    });

    return NextResponse.json({ item: updated });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Failed to update workspace suite item' },
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
        { error: 'Item ID is required' },
        { status: 400 }
      );
    }

    await prisma.workspaceItem.delete({ where: { id } });
    return NextResponse.json({ success: true, id });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Failed to delete workspace suite item' },
      { status: 500 }
    );
  }
}
