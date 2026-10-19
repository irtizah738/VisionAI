import { NextRequest, NextResponse } from 'next/server';
import { getVisionAiStore, prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const { state } = getVisionAiStore();
    const user = state.users[0];
    return NextResponse.json({ user });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Failed to load profile' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { state } = getVisionAiStore();
    const existing = state.users[0];

    const updatedUser = await prisma.user.update({
      where: { id: existing.id },
      data: {
        name: body.name ?? existing.name,
        email: body.email ?? existing.email,
        role: body.role ?? existing.role,
        company: body.company ?? existing.company,
        timezone: body.timezone ?? existing.timezone,
        language: body.language ?? existing.language,
        bio: body.bio ?? existing.bio,
        notifications: body.notifications
          ? { ...existing.notifications, ...body.notifications }
          : existing.notifications,
      },
    });

    return NextResponse.json({ user: updatedUser });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Failed to update profile' },
      { status: 500 }
    );
  }
}