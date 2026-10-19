'use client';

import { useState } from 'react';
import { ApiKey } from '@prisma/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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

interface ApiKeySectionProps {
  apiKeys: ApiKey[];
}

export function ApiKeySection({ apiKeys: initialApiKeys }: ApiKeySectionProps) {
  const [apiKeys, setApiKeys] = useState(initialApiKeys);
  const [isLoading, setIsLoading] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');

  async function generateApiKey() {
    if (!newKeyName.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter a name for your API key',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/user/api-keys', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: newKeyName }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate API key');
      }

      const newKey = await response.json();
      setApiKeys([newKey, ...apiKeys]);
      setNewKeyName('');

      toast({
        title: 'API Key Generated',
        description: 'Make sure to copy your API key now. You won\'t be able to see it again.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to generate API key. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }

  async function revokeApiKey(keyId: string) {
    try {
      const response = await fetch(`/api/user/api-keys/${keyId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to revoke API key');
      }

      setApiKeys(apiKeys.filter(key => key.id !== keyId));

      toast({
        title: 'API Key Revoked',
        description: 'The API key has been revoked successfully.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to revoke API key. Please try again.',
        variant: 'destructive',
      });
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex gap-4">
        <Input
          placeholder="API Key Name"
          value={newKeyName}
          onChange={(e) => setNewKeyName(e.target.value)}
          className="max-w-sm"
        />
        <Button onClick={generateApiKey} disabled={isLoading}>
          {isLoading && <LoadingSpinner className="mr-2 h-4 w-4" />}
          Generate New Key
        </Button>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Last Used</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {apiKeys.map((key) => (
              <TableRow key={key.id}>
                <TableCell>{key.name}</TableCell>
                <TableCell>
                  {formatDistanceToNow(new Date(key.createdAt), { addSuffix: true })}
                </TableCell>
                <TableCell>
                  {key.lastUsed
                    ? formatDistanceToNow(new Date(key.lastUsed), { addSuffix: true })
                    : 'Never'}
                </TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    key.enabled ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {key.enabled ? 'Active' : 'Revoked'}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => revokeApiKey(key.id)}
                    disabled={!key.enabled}
                  >
                    Revoke
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {apiKeys.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground">
                  No API keys generated yet
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
} 