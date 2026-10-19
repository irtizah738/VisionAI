import { NextRequest, NextResponse } from 'next/server';
import { getVisionAiStore, prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const { state } = getVisionAiStore();
    const posts = await prisma.post.findMany();
    const scheduledPosts = posts.filter((p: any) => p.status !== 'published');
    const publishedPosts = posts.filter((p: any) => p.status === 'published');

    return NextResponse.json({
      columns: state.streamColumns,
      scheduledPosts,
      publishedPosts,
      mentions: state.mentions,
      socialAccounts: state.socialAccounts,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Failed to load streams' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { state, save } = getVisionAiStore();

    if (Array.isArray(body.columns)) {
      state.streamColumns = body.columns.map((col: any, index: number) => ({
        id: col.id || `col-${Date.now()}-${index}`,
        title: col.title || 'Stream Column',
        network: col.network || 'all',
        type: col.type || 'scheduled',
        position: index,
      }));
    }

    if (Array.isArray(body.mentions)) {
      state.mentions = body.mentions;
    }

    save();

    return NextResponse.json({
      columns: state.streamColumns,
      mentions: state.mentions,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Failed to update stream columns' },
      { status: 500 }
    );
  }
}
