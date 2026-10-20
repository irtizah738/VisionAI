import { Campaign } from '@/types/campaign';

export interface CampaignRecommendationItem {
  type: 'content' | 'targeting' | 'performance' | 'schedule' | 'budget';
  priority: 'low' | 'medium' | 'high';
  message: string;
}

export function useAIRecommendations(campaign?: Campaign) {
  const recommendations: CampaignRecommendationItem[] = [
    {
      type: 'content',
      priority: 'high',
      message: `Front-load your primary hook for "${campaign?.name || 'Active Campaign'}" in the first 110 characters to prevent mobile fold truncation.`,
    },
    {
      type: 'schedule',
      priority: 'medium',
      message: 'Schedule primary LinkedIn and X broadcasts between 9:00 AM and 11:30 AM EST for +28% higher B2B decision-maker reach.',
    },
    {
      type: 'budget',
      priority: 'low',
      message: 'Reallocate 15% of experimental spend to top-converting carousel and short-video variants.',
    },
  ];

  return {
    data: recommendations,
    isLoading: false,
    error: null,
  };
}