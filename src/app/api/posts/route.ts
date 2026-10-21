import { NextRequest, NextResponse } from 'next/server';
import { getVisionAiStore, prisma, StoredPost } from '@/lib/prisma';
import {
  enqueuePostForBackendDispatch,
  runBackgroundWorkerTick,
} from '@/lib/devops-engine';
import { checkRateLimit } from '@/lib/rate-limit';
import { logger } from '@/lib/logger';

const DEFAULT_HANDLES: Record<string, string> = {
  twitter: '@VisionAI_HQ',
  linkedin: 'VisionAI Technologies',
  instagram: '@visionai.studio',
  facebook: 'VisionAI Official Page',
  youtube: 'VisionAI Official',
};

export async function GET(request: NextRequest) {
  try {
    await runBackgroundWorkerTick();

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const network = searchParams.get('network');

    let posts = await prisma.post.findMany();
    if (status) {
      posts = posts.filter((p: StoredPost) => p.status === status);
    }
    if (network && network !== 'all') {
      posts = posts.filter(
        (p: StoredPost) =>
          p.network === network || (p.platforms && p.platforms.includes(network))
      );
    }

    return NextResponse.json({ posts });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Failed to fetch posts' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const startMs = Date.now();
  const rate = checkRateLimit(request, 'posts_write', {
    limit: 60,
    windowMs: 60_000,
  });
  if (!rate.allowed && rate.response) {
    return rate.response;
  }

  try {
    const body = await request.json();
    const {
      content,
      network = 'twitter',
      platforms = [network],
      scheduledTime,
      dateKey = '2026-10-19',
      presetId = null,
      scheduledAt,
      status = 'scheduled',
      handle,
      mediaUrl,
    } = body;

    if (!content || !String(content).trim()) {
      return NextResponse.json(
        { error: 'Post content is required' },
        { status: 400 }
      );
    }

    const primaryNetwork = (platforms[0] || network || 'twitter') as StoredPost['network'];
    const nowIso = new Date().toISOString();

    const newPost = await prisma.post.create({
      data: {
        id: `sp-${Date.now()}`,
        network: primaryNetwork,
        platforms: Array.isArray(platforms) && platforms.length ? platforms : [primaryNetwork],
        handle: handle || DEFAULT_HANDLES[primaryNetwork] || '@VisionAI_HQ',
        content: String(content).trim(),
        scheduledTime:
          status === 'published'
            ? 'Published Just Now'
            : scheduledTime || 'Mon, Oct 19 at 4:00 PM',
        dateKey,
        presetId,
        scheduledAt: scheduledAt || nowIso,
        publishedAt: status === 'published' ? nowIso : undefined,
        status,
        likes: status === 'published' ? 1 : 0,
        comments: 0,
        shares: 0,
        reach: status === 'published' ? '120' : 'Est. 15.2K',
        mediaUrl,
        userId: 'usr_visionai_admin',
      },
    });

    // Automatically register and process in the backend idempotent dispatch queue
    await enqueuePostForBackendDispatch(newPost, status === 'published');

    logger.recordTrace({
      level: 'INFO',
      service: 'visionai-posts-api',
      route: '/api/posts',
      method: 'POST',
      statusCode: 201,
      durationMs: Math.max(10, Date.now() - startMs),
      message: `Created & queued ${status} post ${newPost.id} on ${primaryNetwork}`,
      metadata: { postId: newPost.id, network: primaryNetwork, status },
    });

    return NextResponse.json({ post: newPost }, { status: 201 });
  } catch (error: any) {
    logger.recordTrace({
      level: 'ERROR',
      service: 'visionai-posts-api',
      route: '/api/posts',
      method: 'POST',
      statusCode: 500,
      durationMs: Date.now() - startMs,
      message: error?.message || 'Failed to create post',
    });
    return NextResponse.json(
      { error: error?.message || 'Failed to create post' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  const startMs = Date.now();
  try {
    const body = await request.json();
    const { id, action, ...updates } = body;

    if (!id) {
      return NextResponse.json({ error: 'Post ID is required' }, { status: 400 });
    }

    if (action === 'publish_now') {
      const updated = await prisma.post.update({
        where: { id },
        data: {
          status: 'published',
          scheduledTime: 'Published Just Now',
          publishedAt: new Date().toISOString(),
          likes: 12,
          comments: 2,
          shares: 4,
          reach: '3.8K',
        },
      });
      await enqueuePostForBackendDispatch(updated, true);
      return NextResponse.json({ post: updated });
    }

    if (action === 'reschedule') {
      const updated = await prisma.post.update({
        where: { id },
        data: {
          dateKey: updates.dateKey,
          scheduledTime: updates.scheduledTime,
          ...(updates.network ? { network: updates.network } : {}),
        },
      });
      await enqueuePostForBackendDispatch(updated, false);
      return NextResponse.json({ post: updated });
    }

    if (action === 'reply_mention') {
      const { state, save } = getVisionAiStore();
      const mentionIdx = state.mentions.findIndex((m) => m.id === id);
      if (mentionIdx !== -1) {
        state.mentions[mentionIdx] = {
          ...state.mentions[mentionIdx],
          replied: true,
          replyText: updates.replyText || 'Thank you for reaching out!',
        };
        save();
        logger.recordTrace({
          level: 'INFO',
          service: 'visionai-inbox-worker',
          route: '/api/posts',
          method: 'PATCH',
          statusCode: 200,
          durationMs: Math.max(8, Date.now() - startMs),
          message: `Dispatched thread reply for mention ${id}`,
        });
        return NextResponse.json({ mention: state.mentions[mentionIdx] });
      }
      return NextResponse.json({ error: 'Mention not found' }, { status: 404 });
    }

    const updated = await prisma.post.update({
      where: { id },
      data: updates,
    });

    return NextResponse.json({ post: updated });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Failed to update post' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'Post ID is required' }, { status: 400 });
    }
    await prisma.post.delete({ where: { id } });

    // Remove any pending dispatch queue job associated with this post in the backend
    const { state, save } = getVisionAiStore();
    state.dispatchQueue = state.dispatchQueue.filter((j) => j.postId !== id);
    save();

    return NextResponse.json({ success: true, id });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Failed to delete post' },
      { status: 500 }
    );
  }
}
