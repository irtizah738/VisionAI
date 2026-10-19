import { prisma } from '@/lib/prisma';
import { socialConfig, type SocialPlatform } from '@/config/social';

export async function getSocialAccounts(userId: string) {
  return prisma.socialAccount.findMany({
    where: { userId },
  });
}

export async function connectSocialAccount(
  userId: string,
  platform: SocialPlatform,
  accountId: string,
  accessToken: string,
  refreshToken?: string,
  expiresAt?: Date
) {
  return prisma.socialAccount.upsert({
    where: {
      platform_accountId: {
        platform,
        accountId,
      },
    },
    update: {
      accessToken,
      refreshToken,
      expiresAt,
      updatedAt: new Date(),
    },
    create: {
      platform,
      accountId,
      accessToken,
      refreshToken,
      expiresAt,
      userId,
    },
  });
}

export async function disconnectSocialAccount(
  userId: string,
  platform: SocialPlatform,
  accountId: string
) {
  return prisma.socialAccount.delete({
    where: {
      platform_accountId: {
        platform,
        accountId,
      },
      userId,
    },
  });
}

export function getSocialConfig(platform: SocialPlatform) {
  return socialConfig[platform];
} 