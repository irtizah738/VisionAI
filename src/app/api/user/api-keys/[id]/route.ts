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

    const apiKey = await prisma.apiKey.findUnique({
      where: { id: params.id },
    });

    if (!apiKey) {
      return new NextResponse(
        JSON.stringify({ error: 'API key not found' }),
        { status: 404 }
      );
    }

    // Check if the API key belongs to the user
    if (apiKey.userId !== session.user.id) {
      return new NextResponse(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 403 }
      );
    }

    // Soft delete by disabling the key
    await prisma.apiKey.update({
      where: { id: params.id },
      data: { enabled: false },
    });

    logger.info('API key revoked', {
      userId: session.user.id,
      keyId: params.id,
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    logger.error('API key revocation error', {
      error,
      keyId: params.id,
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

    const apiKey = await prisma.apiKey.findUnique({
      where: { id: params.id },
    });

    if (!apiKey) {
      return new NextResponse(
        JSON.stringify({ error: 'API key not found' }),
        { status: 404 }
      );
    }

    // Check if the API key belongs to the user
    if (apiKey.userId !== session.user.id) {
      return new NextResponse(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 403 }
      );
    }

    return NextResponse.json(apiKey);
  } catch (error) {
    logger.error('API key fetch error', {
      error,
      keyId: params.id,
    });

    return new NextResponse(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500 }
    );
  }
} 