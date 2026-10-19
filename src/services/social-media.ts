import { SocialPlatform, socialConfig } from '@/config/social';
import { prisma } from '@/lib/prisma';

export class SocialMediaService {
  private userId: string;

  constructor(userId: string) {
    this.userId = userId;
  }

  async getConnectedAccounts() {
    return prisma.socialAccount.findMany({
      where: { userId: this.userId },
    });
  }

  async postContent(platform: SocialPlatform, content: {
    text?: string;
    media?: { url: string; type: 'image' | 'video' }[];
    scheduledTime?: Date;
  }) {
    const account = await prisma.socialAccount.findFirst({
      where: { userId: this.userId, platform },
    });

    if (!account) {
      throw new Error(`No connected ${platform} account found`);
    }

    switch (platform) {
      case 'facebook':
        return this.postToFacebook(account.accessToken, content);
      case 'instagram':
        return this.postToInstagram(account.accessToken, content);
      case 'x':
        return this.postToX(account.accessToken, content);
      case 'linkedin':
        return this.postToLinkedIn(account.accessToken, content);
      case 'youtube':
        return this.postToYouTube(account.accessToken, content);
      default:
        throw new Error(`Unsupported platform: ${platform}`);
    }
  }

  private async postToFacebook(accessToken: string, content: any) {
    const url = `https://graph.facebook.com/${socialConfig.facebook.apiVersion}/me/feed`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: content.text,
        scheduled_publish_time: content.scheduledTime?.getTime() / 1000,
      }),
    });
    return response.json();
  }

  private async postToInstagram(accessToken: string, content: any) {
    // First, create a container
    const url = `https://graph.facebook.com/${socialConfig.instagram.apiVersion}/me/media`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        image_url: content.media?.[0]?.url,
        caption: content.text,
      }),
    });
    const { id } = await response.json();

    // Then publish the container
    const publishUrl = `https://graph.facebook.com/${socialConfig.instagram.apiVersion}/me/media_publish`;
    const publishResponse = await fetch(publishUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ creation_id: id }),
    });
    return publishResponse.json();
  }

  private async postToX(accessToken: string, content: any) {
    const url = 'https://api.twitter.com/2/tweets';
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: content.text,
      }),
    });
    return response.json();
  }

  private async postToLinkedIn(accessToken: string, content: any) {
    const url = 'https://api.linkedin.com/v2/ugcPosts';
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        author: `urn:li:person:${this.userId}`,
        lifecycleState: 'PUBLISHED',
        specificContent: {
          'com.linkedin.ugc.ShareContent': {
            shareCommentary: {
              text: content.text,
            },
            shareMediaCategory: 'NONE',
          },
        },
        visibility: {
          'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC',
        },
      }),
    });
    return response.json();
  }

  private async postToYouTube(accessToken: string, content: any) {
    const url = 'https://www.googleapis.com/youtube/v3/videos';
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        snippet: {
          title: content.text,
          description: content.text,
          tags: [],
          categoryId: '22', // People & Blogs
        },
        status: {
          privacyStatus: 'public',
          publishAt: content.scheduledTime?.toISOString(),
        },
      }),
    });
    return response.json();
  }
} 