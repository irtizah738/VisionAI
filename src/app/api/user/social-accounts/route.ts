import { NextRequest, NextResponse } from 'next/server';
import { getVisionAiStore, prisma } from '@/lib/prisma';

const DEFAULT_ACCOUNT_METADATA: Record<
  string,
  { accountName: string; handle: string; followers: string }
> = {
  twitter: {
    accountName: 'VisionAI Official',
    handle: '@VisionAI_HQ',
    followers: '48.2K',
  },
  linkedin: {
    accountName: 'VisionAI Technologies',
    handle: 'linkedin.com/company/visionai',
    followers: '112.5K',
  },
  instagram: {
    accountName: 'VisionAI Studio',
    handle: '@visionai.studio',
    followers: '84.9K',
  },
  facebook: {
    accountName: 'VisionAI Official Page',
    handle: 'fb.com/VisionAIStudio',
    followers: '63.1K',
  },
  youtube: {
    accountName: 'VisionAI Official Channel',
    handle: 'youtube.com/@VisionAI',
    followers: '95.4K',
  },
};

export async function GET() {
  try {
    const accounts = await prisma.socialAccount.findMany();
    return NextResponse.json({ accounts });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Failed to fetch social accounts' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { provider, handle, accountName } = body;

    if (!provider) {
      return NextResponse.json(
        { error: 'Social provider is required' },
        { status: 400 }
      );
    }

    const { state, save } = getVisionAiStore();
    const existingIdx = state.socialAccounts.findIndex(
      (acc) => acc.provider === provider
    );

    const defaults = DEFAULT_ACCOUNT_METADATA[provider] || {
      accountName: `VisionAI ${provider}`,
      handle: `@visionai_${provider}`,
      followers: '12.4K',
    };

    if (existingIdx !== -1) {
      state.socialAccounts[existingIdx] = {
        ...state.socialAccounts[existingIdx],
        accountName: accountName || state.socialAccounts[existingIdx].accountName || defaults.accountName,
        handle: handle || state.socialAccounts[existingIdx].handle || defaults.handle,
        status: 'connected',
        lastSynced: 'Just now',
        updatedAt: new Date().toISOString(),
      };
      save();
      return NextResponse.json({
        account: state.socialAccounts[existingIdx],
        accounts: state.socialAccounts,
      });
    }

    const created = await prisma.socialAccount.create({
      data: {
        id: `acc_${provider}_${Date.now()}`,
        provider,
        accountName: accountName || defaults.accountName,
        handle: handle || defaults.handle,
        followers: defaults.followers,
        status: 'connected',
        lastSynced: 'Just now',
        userId: 'usr_visionai_admin',
      },
    });

    return NextResponse.json({
      account: created,
      accounts: state.socialAccounts,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Failed to connect social account' },
      { status: 500 }
    );
  }
}
