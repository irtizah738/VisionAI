'use client';

import { ConnectMeta } from '@/components/social/connect-meta';
import { FacebookTest } from '@/components/social/facebook-test';

export default function SocialSettingsPage() {
  return (
    <div className="container py-10">
      <div className="mx-auto max-w-4xl space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Social Media Connections</h1>
          <p className="text-muted-foreground">
            Connect your social media accounts to manage your campaigns
          </p>
        </div>

        <ConnectMeta />
        <FacebookTest />
      </div>
    </div>
  );
} 