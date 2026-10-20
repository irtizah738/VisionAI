import { socialConfig } from '@/config/social';

export class MetaService {
  private accessToken: string;
  private apiVersion: string;

  constructor(accessToken: string) {
    this.accessToken = accessToken;
    this.apiVersion = socialConfig.facebook.apiVersion;
  }

  // Get Facebook Pages that the user manages
  async getFacebookPages() {
    const response = await fetch(
      `https://graph.facebook.com/${this.apiVersion}/me/accounts`,
      {
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
        },
      }
    );
    return response.json();
  }

  // Get Instagram Business Accounts connected to a Facebook Page
  async getInstagramAccounts(pageId: string) {
    const response = await fetch(
      `https://graph.facebook.com/${this.apiVersion}/${pageId}?fields=instagram_business_account`,
      {
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
        },
      }
    );
    return response.json();
  }

  // Post to Facebook Page
  async postToFacebookPage(pageId: string, content: {
    message: string;
    link?: string;
    media?: { url: string; type: 'photo' | 'video' }[];
    scheduledTime?: Date;
  }) {
    const pageAccessToken = await this.getPageAccessToken(pageId);
    
    const postData: any = {
      message: content.message,
    };

    if (content.link) {
      postData.link = content.link;
    }

    if (content.scheduledTime) {
      postData.scheduled_publish_time = Math.floor(content.scheduledTime.getTime() / 1000);
    }

    // If media is present, handle it differently
    if (content.media?.length) {
      const media = content.media[0];
      if (media.type === 'photo') {
        postData.url = media.url;
      } else if (media.type === 'video') {
        // For video, we need to use a different endpoint
        return this.postVideoToFacebookPage(pageId, pageAccessToken, {
          ...content,
          media: content.media,
        });
      }
    }

    const response = await fetch(
      `https://graph.facebook.com/${this.apiVersion}/${pageId}/feed`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${pageAccessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData),
      }
    );

    return response.json();
  }

  // Post to Instagram Business Account
  async postToInstagram(instagramAccountId: string, content: {
    caption: string;
    media: { url: string; type: 'photo' | 'video' }[];
  }) {
    // First, create a container
    const response = await fetch(
      `https://graph.facebook.com/${this.apiVersion}/${instagramAccountId}/media`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image_url: content.media[0].url,
          caption: content.caption,
        }),
      }
    );

    const { id } = await response.json();

    // Then publish the container
    const publishResponse = await fetch(
      `https://graph.facebook.com/${this.apiVersion}/${instagramAccountId}/media_publish`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ creation_id: id }),
      }
    );

    return publishResponse.json();
  }

  // Get insights for a Facebook post
  async getFacebookInsights(postId: string, metrics: string[]) {
    const response = await fetch(
      `https://graph.facebook.com/${this.apiVersion}/${postId}/insights?metric=${metrics.join(',')}`,
      {
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
        },
      }
    );
    return response.json();
  }

  // Get insights for an Instagram post
  async getInstagramInsights(mediaId: string, metrics: string[]) {
    const response = await fetch(
      `https://graph.facebook.com/${this.apiVersion}/${mediaId}/insights?metric=${metrics.join(',')}`,
      {
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
        },
      }
    );
    return response.json();
  }

  private async getPageAccessToken(pageId: string) {
    const response = await fetch(
      `https://graph.facebook.com/${this.apiVersion}/${pageId}?fields=access_token`,
      {
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
        },
      }
    );
    const data = await response.json();
    return data.access_token;
  }

  private async postVideoToFacebookPage(pageId: string, pageAccessToken: string, content: {
    message: string;
    media: { url: string; type: 'photo' | 'video' }[];
    scheduledTime?: Date;
  }) {
    // Initialize the video upload
    const initResponse = await fetch(
      `https://graph.facebook.com/${this.apiVersion}/${pageId}/videos`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${pageAccessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          upload_phase: 'start',
          file_size: await this.getFileSize(content.media[0].url),
        }),
      }
    );

    const { upload_session_id, start_offset, end_offset } = await initResponse.json();

    // Upload the video chunks
    const videoData = await fetch(content.media[0].url).then(r => r.blob());
    await fetch(
      `https://graph.facebook.com/${this.apiVersion}/${pageId}/videos`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${pageAccessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          upload_phase: 'transfer',
          upload_session_id,
          start_offset,
          video_file_chunk: videoData,
        }),
      }
    );

    // Finish the upload
    const finishResponse = await fetch(
      `https://graph.facebook.com/${this.apiVersion}/${pageId}/videos`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${pageAccessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          upload_phase: 'finish',
          upload_session_id,
          title: content.message,
          description: content.message,
        }),
      }
    );

    return finishResponse.json();
  }

  private async getFileSize(url: string) {
    const response = await fetch(url, { method: 'HEAD' });
    return parseInt(response.headers.get('content-length') || '0', 10);
  }
} 