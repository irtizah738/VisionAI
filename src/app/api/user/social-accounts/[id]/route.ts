import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '../../../auth/[...nextauth]/route';
import { logger } from '@/lib/logger';

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return new NextResponse(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401 }
      );
    }

    const socialAccount = await prisma.socialAccount.findUnique({
      where: { id: params.id },
    });

    if (!socialAccount) {
      return new NextResponse(
        JSON.stringify({ error: 'Social account not found' }),
        { status: 404 }
      );
    }

    // Check if the social account belongs to the user
    if (socialAccount.userId !== session.user.id) {
      return new NextResponse(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 403 }
      );
    }

    // Delete the social account
    await prisma.socialAccount.delete({
      where: { id: params.id },
    });

    logger.info('Social account disconnected', {
      userId: session.user.id,
      accountId: params.id,
      platform: socialAccount.platform,
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    logger.error('Social account disconnection error', {
      error,
      accountId: params.id,
    });

    return new NextResponse(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return new NextResponse(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401 }
      );
    }

    const socialAccount = await prisma.socialAccount.findUnique({
      where: { id: params.id },
    });

    if (!socialAccount) {
      return new NextResponse(
        JSON.stringify({ error: 'Social account not found' }),
        { status: 404 }
      );
    }

    // Check if the social account belongs to the user
    if (socialAccount.userId !== session.user.id) {
      return new NextResponse(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 403 }
      );
    }

    return NextResponse.json(socialAccount);
  } catch (error) {
    logger.error('Social account fetch error', {
      error,
      accountId: params.id,
    });

    return new NextResponse(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500 }
    );
  }
} 