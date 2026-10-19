import { useQuery } from '@tanstack/react-query';
import { Campaign } from '@/types/campaign';
import { CampaignOptimizer, OptimizationSuggestion, AudienceInsight, CampaignPrediction } from '@/services/ai/campaign-optimizer';

const optimizer = new CampaignOptimizer(process.env.NEXT_PUBLIC_OPENAI_API_KEY || '');

export function useOptimizationSuggestions(campaign: Campaign) {
  return useQuery({
    queryKey: ['campaign-optimizations', campaign.id],
    queryFn: () => optimizer.generateOptimizations(campaign),
    enabled: !!campaign,
  });
}

export function useAudienceInsights(campaign: Campaign) {
  return useQuery({
    queryKey: ['campaign-audience', campaign.id],
    queryFn: () => optimizer.analyzeAudience(campaign),
    enabled: !!campaign,
  });
}

export function usePerformancePrediction(campaign: Campaign) {
  return useQuery({
    queryKey: ['campaign-prediction', campaign.id],
    queryFn: () => optimizer.predictPerformance(campaign),
    enabled: !!campaign,
  });
} 