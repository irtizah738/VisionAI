import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { SocialAccount } from '@/services/social';

async function fetchSocialAccounts() {
  const response = await fetch('/api/social-accounts');
  if (!response.ok) {
    throw new Error('Failed to fetch social accounts');
  }
  return response.json();
}

async function createSocialAccount(account: Omit<SocialAccount, 'id'>) {
  const response = await fetch('/api/social-accounts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(account),
  });
  if (!response.ok) {
    throw new Error('Failed to create social account');
  }
  return response.json();
}

async function deleteSocialAccount(accountId: string) {
  const response = await fetch(`/api/social-accounts/${accountId}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Failed to delete social account');
  }
}

export function useSocialAccounts() {
  return useQuery({
    queryKey: ['socialAccounts'],
    queryFn: fetchSocialAccounts,
  });
}

export function useCreateSocialAccount() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createSocialAccount,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['socialAccounts'] });
    },
  });
}

export function useDeleteSocialAccount() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteSocialAccount,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['socialAccounts'] });
    },
  });
}

export function useSocialAccountsByPlatform(platform: string) {
  const { data: accounts } = useSocialAccounts();
  return accounts?.filter((account: SocialAccount) => account.platform === platform) || [];
} 