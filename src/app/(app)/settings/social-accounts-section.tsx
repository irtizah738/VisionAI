'use client';

import { useState } from 'react';
import { SocialAccount } from '@prisma/client';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { LoadingSpinner } from '@/components/ui/loading';
import { formatDistanceToNow } from 'date-fns';

interface SocialAccountsSectionProps {
  accounts: SocialAccount[];
}

const PLATFORMS = {
  twitter: {
    name: 'Twitter',
    icon: '🐦',
    color: 'bg-blue-100 text-blue-800',
  },
  facebook: {
    name: 'Facebook',
    icon: '📘',
    color: 'bg-indigo-100 text-indigo-800',
  },
  instagram: {
    name: 'Instagram',
    icon: '📸',
    color: 'bg-pink-100 text-pink-800',
  },
  linkedin: {
    name: 'LinkedIn',
    icon: '💼',
    color: 'bg-sky-100 text-sky-800',
  },
};

export function SocialAccountsSection({ accounts: initialAccounts }: SocialAccountsSectionProps) {
  const [accounts, setAccounts] = useState(initialAccounts);
  const [isConnecting, setIsConnecting] = useState(false);

  async function connectAccount(platform: string) {
    setIsConnecting(true);

    try {
      // Redirect to OAuth flow
      window.location.href = `/api/auth/${platform}`;
    } catch (error) {
      toast({
        title: 'Error',
        description: `Failed to connect ${platform}. Please try again.`,
        variant: 'destructive',
      });
      setIsConnecting(false);
    }
  }

  async function disconnectAccount(accountId: string) {
    try {
      const response = await fetch(`/api/user/social-accounts/${accountId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to disconnect account');
      }

      setAccounts(accounts.filter(account => account.id !== accountId));

      toast({
        title: 'Account Disconnected',
        description: 'The social media account has been disconnected successfully.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to disconnect account. Please try again.',
        variant: 'destructive',
      });
    }
  }

  const connectedPlatforms = accounts.map(account => account.platform);
  const availablePlatforms = Object.keys(PLATFORMS).filter(
    platform => !connectedPlatforms.includes(platform)
  );

  return (
    <div className="space-y-6">
      <div className="flex gap-4">
        {availablePlatforms.map((platform) => (
          <Button
            key={platform}
            onClick={() => connectAccount(platform)}
            disabled={isConnecting}
            className={PLATFORMS[platform as keyof typeof PLATFORMS].color}
          >
            {isConnecting && <LoadingSpinner className="mr-2 h-4 w-4" />}
            {PLATFORMS[platform as keyof typeof PLATFORMS].icon}
            <span className="ml-2">
              Connect {PLATFORMS[platform as keyof typeof PLATFORMS].name}
            </span>
          </Button>
        ))}
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Platform</TableHead>
              <TableHead>Account ID</TableHead>
              <TableHead>Connected</TableHead>
              <TableHead>Expires</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {accounts.map((account) => (
              <TableRow key={account.id}>
                <TableCell className="font-medium">
                  <span className="flex items-center">
                    {PLATFORMS[account.platform as keyof typeof PLATFORMS].icon}
                    <span className="ml-2">
                      {PLATFORMS[account.platform as keyof typeof PLATFORMS].name}
                    </span>
                  </span>
                </TableCell>
                <TableCell>{account.accountId}</TableCell>
                <TableCell>
                  {formatDistanceToNow(new Date(account.createdAt), { addSuffix: true })}
                </TableCell>
                <TableCell>
                  {account.expiresAt
                    ? formatDistanceToNow(new Date(account.expiresAt), { addSuffix: true })
                    : 'Never'}
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => disconnectAccount(account.id)}
                  >
                    Disconnect
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {accounts.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground">
                  No social accounts connected
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
} 