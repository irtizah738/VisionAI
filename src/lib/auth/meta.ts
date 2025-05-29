import { socialConfig } from '@/config/social';
import { prisma } from '@/lib/prisma';

export const metaAuthConfig = {
  facebook: {
    id: process.env.FACEBOOK_CLIENT_ID!,
    secret: process.env.FACEBOOK_CLIENT_SECRET!,
    authorization: {
      url: 'https://www.facebook.com/v18.0/dialog/oauth',
      params: {
        scope: socialConfig.facebook.scopes.join(','),
      },
    },
    token: {
      url: 'https://graph.facebook.com/v18.0/oauth/access_token',
    },
    userinfo: {
      url: 'https://graph.facebook.com/v18.0/me',
      params: {
        fields: 'id,name,email,picture',
      },
    },
    profile(profile: any) {
      return {
        id: profile.id,
        name: profile.name,
        email: profile.email,
        image: profile.picture?.data?.url,
      };
    },
  },
  instagram: {
    id: process.env.INSTAGRAM_CLIENT_ID!,
    secret: process.env.INSTAGRAM_CLIENT_SECRET!,
    authorization: {
      url: 'https://api.instagram.com/oauth/authorize',
      params: {
        scope: socialConfig.instagram.scopes.join(' '),
      },
    },
    token: {
      url: 'https://api.instagram.com/oauth/access_token',
    },
    userinfo: {
      url: 'https://graph.instagram.com/me',
      params: {
        fields: 'id,username',
      },
    },
    profile(profile: any) {
      return {
        id: profile.id,
        name: profile.username,
        image: null,
      };
    },
  },
};

export async function handleMetaCallback(
  platform: 'facebook' | 'instagram',
  userId: string,
  accessToken: string,
  refreshToken?: string,
  expiresAt?: Date
) {
  // Get user info from the platform
  const userInfoUrl = platform === 'facebook'
    ? `https://graph.facebook.com/v18.0/me?fields=id,name,email&access_token=${accessToken}`
    : `https://graph.instagram.com/me?fields=id,username&access_token=${accessToken}`;

  const response = await fetch(userInfoUrl);
  const data = await response.json();

  // Store the connection in the database
  await prisma.socialAccount.upsert({
    where: {
      platform_accountId: {
        platform,
        accountId: data.id,
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
      accountId: data.id,
      accessToken,
      refreshToken,
      expiresAt,
      userId,
      metadata: {
        name: data.name || data.username,
        email: data.email,
      },
    },
  });

  return data;
} 