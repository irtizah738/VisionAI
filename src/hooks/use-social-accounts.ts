import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { SocialAccount } from '@/services/social';

async function fetchSocialAccounts(): Promise<SocialAccount[]> {
  const response = await fetch('/api/social-accounts');
  if (!response.ok) {
    throw new Error('Failed to fetch social accounts');
  }
  const data = await response.json();
  return Array.isArray(data) ? data : data.accounts || [];
}

async function createSocialAccount(account: Partial<SocialAccount> & { platform: string }) {
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
  const query = useQuery({
    queryKey: ['socialAccounts'],
    queryFn: fetchSocialAccounts,
  });

  return {
    ...query,
    mutate: query.refetch,
  };
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