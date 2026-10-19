export const socialConfig = {
  facebook: {
    scopes: ['email', 'pages_show_list', 'pages_read_engagement', 'pages_manage_posts', 'instagram_basic'],
    auth: {
      clientId: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    },
    apiVersion: 'v18.0',
  },
  instagram: {
    scopes: ['instagram_basic', 'instagram_content_publish', 'instagram_manage_insights'],
    auth: {
      clientId: process.env.INSTAGRAM_CLIENT_ID,
      clientSecret: process.env.INSTAGRAM_CLIENT_SECRET,
    },
    apiVersion: 'v18.0',
  },
  x: {
    scopes: ['tweet.read', 'tweet.write', 'users.read', 'offline.access'],
    auth: {
      clientId: process.env.TWITTER_CLIENT_ID,
      clientSecret: process.env.TWITTER_CLIENT_SECRET,
    },
    apiVersion: '2.0',
  },
  linkedin: {
    scopes: ['r_liteprofile', 'r_emailaddress', 'w_member_social', 'w_organization_social'],
    auth: {
      clientId: process.env.LINKEDIN_CLIENT_ID,
      clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
    },
    apiVersion: 'v2',
  },
  youtube: {
    scopes: [
      'https://www.googleapis.com/auth/youtube',
      'https://www.googleapis.com/auth/youtube.upload',
      'https://www.googleapis.com/auth/youtube.readonly'
    ],
    auth: {
      clientId: process.env.YOUTUBE_CLIENT_ID,
      clientSecret: process.env.YOUTUBE_CLIENT_SECRET,
    },
    apiVersion: 'v3',
  },
} as const;

export type SocialPlatform = keyof typeof socialConfig; 