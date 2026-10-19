export interface SocialPlatformConfig {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  scopes: string[];
  [key: string]: any;
}

export interface SocialAccount {
  id: string;
  platform: string;
  accountId: string;
  username: string;
  accessToken: string;
  refreshToken?: string;
  expiresAt?: Date;
  profileUrl?: string;
  avatarUrl?: string;
}

export interface SocialPost {
  content: string;
  mediaUrls?: string[];
  scheduledTime?: Date;
}

export interface SocialMetrics {
  impressions: number;
  engagement: number;
  clicks: number;
  shares: number;
  likes: number;
  comments: number;
  platform: string;
  timestamp: Date;
}

export abstract class SocialPlatform {
  protected config: SocialPlatformConfig;

  constructor(config: SocialPlatformConfig) {
    this.config = config;
  }

  abstract getAuthUrl(): string;
  abstract handleAuthCallback(code: string): Promise<SocialAccount>;
  abstract refreshToken(account: SocialAccount): Promise<Partial<SocialAccount>>;
  abstract createPost(account: SocialAccount, post: SocialPost): Promise<string>;
  abstract getMetrics(account: SocialAccount, postId: string): Promise<SocialMetrics>;
  abstract deletePost(account: SocialAccount, postId: string): Promise<void>;
}

export class SocialService {
  private platforms = new Map<string, SocialPlatform>();

  registerPlatform(name: string, platform: SocialPlatform): void {
    this.platforms.set(name, platform);
  }

  getPlatform(name: string): SocialPlatform {
    const platform = this.platforms.get(name);
    if (!platform) {
      throw new Error(`Platform ${name} not supported`);
    }
    return platform;
  }

  hasPlatform(name: string): boolean {
    return this.platforms.has(name);
  }
}