import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Campaign, CampaignCreateInput, CampaignUpdateInput } from '@/types/campaign';
import { useToast } from '@/hooks/use-toast';
import { useTranslations } from 'next-intl';

async function fetchCampaigns(options: {
  search?: string;
  status?: string[];
  type?: string[];
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}) {
  const params = new URLSearchParams();
  Object.entries(options).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach((v) => params.append(key, v));
    } else if (value !== undefined) {
      params.append(key, value.toString());
    }
  });

  const response = await fetch(`/api/campaigns?${params.toString()}`);
  if (!response.ok) {
    throw new Error('Failed to fetch campaigns');
  }
  return response.json();
}

async function fetchCampaign(id: string) {
  const response = await fetch(`/api/campaigns/${id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch campaign');
  }
  return response.json();
}

async function createCampaign(data: CampaignCreateInput) {
  const response = await fetch('/api/campaigns', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error('Failed to create campaign');
  }
  return response.json();
}

async function updateCampaign(id: string, data: CampaignUpdateInput) {
  const response = await fetch(`/api/campaigns/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error('Failed to update campaign');
  }
  return response.json();
}

async function deleteCampaign(id: string) {
  const response = await fetch(`/api/campaigns/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Failed to delete campaign');
  }
}

async function updateCampaignStatus(id: string, status: Campaign['status']) {
  const response = await fetch(`/api/campaigns/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  });
  if (!response.ok) {
    throw new Error('Failed to update campaign status');
  }
  return response.json();
}

export function useCampaigns(options: Parameters<typeof fetchCampaigns>[0] = {}) {
  return useQuery({
    queryKey: ['campaigns', options],
    queryFn: () => fetchCampaigns(options),
  });
}

export function useCampaign(id: string) {
  return useQuery({
    queryKey: ['campaign', id],
    queryFn: () => fetchCampaign(id),
    enabled: !!id,
  });
}

export function useCreateCampaign() {
  const { toast } = useToast();
  const t = useTranslations('campaigns');
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createCampaign,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
      toast({
        title: t('notifications.createSuccess.title'),
        description: t('notifications.createSuccess.description'),
      });
    },
    onError: (error) => {
      toast({
        title: t('notifications.createError.title'),
        description: t('notifications.createError.description'),
        variant: 'destructive',
      });
    },
  });
}

export function useUpdateCampaign(id: string) {
  const { toast } = useToast();
  const t = useTranslations('campaigns');
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CampaignUpdateInput) => updateCampaign(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
      queryClient.invalidateQueries({ queryKey: ['campaign', id] });
      toast({
        title: t('notifications.updateSuccess.title'),
        description: t('notifications.updateSuccess.description'),
      });
    },
    onError: (error) => {
      toast({
        title: t('notifications.updateError.title'),
        description: t('notifications.updateError.description'),
        variant: 'destructive',
      });
    },
  });
}

export function useDeleteCampaign() {
  const { toast } = useToast();
  const t = useTranslations('campaigns');
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteCampaign,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
      toast({
        title: t('notifications.deleteSuccess.title'),
        description: t('notifications.deleteSuccess.description'),
      });
    },
    onError: (error) => {
      toast({
        title: t('notifications.deleteError.title'),
        description: t('notifications.deleteError.description'),
        variant: 'destructive',
      });
    },
  });
}

export function useUpdateCampaignStatus(id: string) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const t = useTranslations('campaigns');

  return useMutation({
    mutationFn: (status: Campaign['status']) => updateCampaignStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
      queryClient.invalidateQueries({ queryKey: ['campaign', id] });
      toast({
        title: t('toast.statusUpdateSuccess.title'),
        description: t('toast.statusUpdateSuccess.description'),
      });
    },
    onError: () => {
      toast({
        title: t('toast.statusUpdateError.title'),
        description: t('toast.statusUpdateError.description'),
        variant: 'destructive',
      });
    },
  });
} 