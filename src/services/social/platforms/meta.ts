import { SocialPlatform, SocialPlatformConfig, SocialAccount, SocialPost, SocialMetrics } from '../index';

export class MetaPlatform extends SocialPlatform {
  constructor(config: SocialPlatformConfig) {
    super(config);
  }

  getAuthUrl(): string {
    const params = new URLSearchParams({
      client_id: this.config.clientId,
      redirect_uri: this.config.redirectUri,
      scope: this.config.scopes.join(','),
      response_type: 'code',
      state: Math.random().toString(36).substring(7),
    });

    return `https://www.facebook.com/v18.0/dialog/oauth?${params.toString()}`;
  }

  async handleAuthCallback(code: string): Promise<SocialAccount> {
    // Exchange code for access token
    const tokenResponse = await fetch('https://graph.facebook.com/v18.0/oauth/access_token', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client_id: this.config.clientId,
        client_secret: this.config.clientSecret,
        redirect_uri: this.config.redirectUri,
        code,
      }),
    });

    if (!tokenResponse.ok) {
      throw new Error('Failed to exchange code for token');
    }

    const { access_token, expires_in } = await tokenResponse.json();

    // Get user info
    const userResponse = await fetch('https://graph.facebook.com/v18.0/me', {
      headers: { Authorization: `Bearer ${access_token}` },
    });

    if (!userResponse.ok) {
      throw new Error('Failed to get user info');
    }

    const { id, name } = await userResponse.json();

    return {
      id: Math.random().toString(36).substring(7), // Generate a unique ID
      platform: 'facebook',
      accountId: id,
      username: name,
      accessToken: access_token,
      expiresAt: new Date(Date.now() + expires_in * 1000),
    };
  }

  async refreshToken(account: SocialAccount): Promise<Partial<SocialAccount>> {
    if (!account.refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await fetch('https://graph.facebook.com/v18.0/oauth/access_token', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        grant_type: 'fb_exchange_token',
        client_id: this.config.clientId,
        client_secret: this.config.clientSecret,
        fb_exchange_token: account.accessToken,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to refresh token');
    }

    const { access_token, expires_in } = await response.json();

    return {
      accessToken: access_token,
      expiresAt: new Date(Date.now() + expires_in * 1000),
    };
  }

  async createPost(account: SocialAccount, post: SocialPost): Promise<string> {
    const endpoint = post.mediaUrls?.length
      ? 'https://graph.facebook.com/v18.0/me/photos'
      : 'https://graph.facebook.com/v18.0/me/feed';

    const body: Record<string, any> = {
      message: post.content,
      access_token: account.accessToken,
    };

    if (post.mediaUrls?.length) {
      body.url = post.mediaUrls[0]; // For simplicity, only using the first image
    }

    if (post.scheduledTime) {
      body.scheduled_publish_time = Math.floor(post.scheduledTime.getTime() / 1000);
    }

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error('Failed to create post');
    }

    const { id } = await response.json();
    return id;
  }

  async getMetrics(account: SocialAccount, postId: string): Promise<SocialMetrics> {
    const response = await fetch(
      `https://graph.facebook.com/v18.0/${postId}/insights?metric=impressions,engagement,clicks,shares,likes,comments`,
      {
        headers: { Authorization: `Bearer ${account.accessToken}` },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to get metrics');
    }

    const data = await response.json();

    return {
      impressions: data.impressions?.values[0]?.value || 0,
      engagement: data.engagement?.values[0]?.value || 0,
      clicks: data.clicks?.values[0]?.value || 0,
      shares: data.shares?.values[0]?.value || 0,
      likes: data.likes?.values[0]?.value || 0,
      comments: data.comments?.values[0]?.value || 0,
      platform: 'facebook',
      timestamp: new Date(),
    };
  }

  async deletePost(account: SocialAccount, postId: string): Promise<void> {
    const response = await fetch(`https://graph.facebook.com/v18.0/${postId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${account.accessToken}` },
    });

    if (!response.ok) {
      throw new Error('Failed to delete post');
    }
  }
} 