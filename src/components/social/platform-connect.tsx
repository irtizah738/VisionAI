"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Platform } from '@/types/campaign';
import { Facebook, Instagram, Linkedin, Twitter } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PlatformConnectProps {
  onConnect: (platform: Platform) => Promise<void>;
  connectedPlatforms: Platform[];
}

const platformIcons = {
  facebook: Facebook,
  instagram: Instagram,
  linkedin: Linkedin,
  twitter: Twitter,
};

export function PlatformConnect({ onConnect, connectedPlatforms }: PlatformConnectProps) {
  const t = useTranslations('social');
  const [connecting, setConnecting] = useState<Platform | null>(null);

  const handleConnect = async (platform: Platform) => {
    try {
      setConnecting(platform);
      await onConnect(platform);
    } catch (error) {
      console.error(`Error connecting to ${platform}:`, error);
    } finally {
      setConnecting(null);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {Object.values(Platform._def.values)
        .filter((platform) => platform !== 'email' && platform !== 'web')
        .map((platform) => {
          const Icon = platformIcons[platform as keyof typeof platformIcons];
          const isConnected = connectedPlatforms.includes(platform as Platform);

          return (
            <Card
              key={platform}
              className={cn(
                'relative overflow-hidden transition-all',
                isConnected && 'border-primary'
              )}
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {Icon && <Icon className="h-5 w-5" />}
                  {t(`platforms.${platform}`)}
                </CardTitle>
                <CardDescription>
                  {isConnected
                    ? t('platformConnected')
                    : t('platformNotConnected')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  className="w-full"
                  variant={isConnected ? 'outline' : 'default'}
                  disabled={connecting === platform}
                  onClick={() => handleConnect(platform as Platform)}
                >
                  {isConnected
                    ? t('reconnect')
                    : connecting === platform
                    ? t('connecting')
                    : t('connect')}
                </Button>
              </CardContent>
              {isConnected && (
                <div className="absolute top-0 right-0 p-2">
                  <div className="h-2 w-2 rounded-full bg-primary" />
                </div>
              )}
            </Card>
          );
        })}
    </div>
  );
} 