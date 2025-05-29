import { useTranslations } from 'next-intl';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Campaign } from '@/types/campaign';
import { useAIRecommendations } from '@/hooks/use-campaign-insights';
import { AlertCircle, Brain, Lightbulb, Target, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

type RecommendationType = 'content' | 'targeting' | 'performance' | 'schedule' | 'budget';
type Priority = 'low' | 'medium' | 'high';

interface Recommendation {
  type: RecommendationType;
  priority: Priority;
  message: string;
}

const typeIcons = {
  content: Lightbulb,
  targeting: Target,
  performance: Zap,
  schedule: Brain,
  budget: AlertCircle,
};

function RecommendationAlert({ recommendation }: { recommendation: Recommendation }) {
  const Icon = typeIcons[recommendation.type] || AlertCircle;
  const t = useTranslations('campaigns.recommendations');

  const priorityColors = {
    low: 'bg-muted text-muted-foreground',
    medium: 'bg-warning text-warning-foreground',
    high: 'bg-destructive text-destructive-foreground',
  };

  return (
    <Alert>
      <Icon className="h-4 w-4" />
      <AlertTitle className="flex items-center gap-2">
        {t(`types.${recommendation.type}`)}
        <Badge
          variant="outline"
          className={cn('ml-2', priorityColors[recommendation.priority])}
        >
          {t(`priorities.${recommendation.priority}`)}
        </Badge>
      </AlertTitle>
      <AlertDescription>{recommendation.message}</AlertDescription>
    </Alert>
  );
}

export function CampaignRecommendations({ campaign }: { campaign: Campaign }) {
  const { data: recommendations, isLoading } = useAIRecommendations(campaign);
  const t = useTranslations('campaigns.recommendations');

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            {t('title')}
          </CardTitle>
          <CardDescription>{t('loading')}</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (!recommendations?.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            {t('title')}
          </CardTitle>
          <CardDescription>{t('noRecommendations')}</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const priorityOrder: Priority[] = ['high', 'medium', 'low'];
  const sortedRecommendations = [...recommendations].sort(
    (a, b) =>
      priorityOrder.indexOf(a.priority) - priorityOrder.indexOf(b.priority)
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5" />
          {t('title')}
        </CardTitle>
        <CardDescription>{t('description')}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {sortedRecommendations.map((recommendation, index) => (
          <RecommendationAlert key={index} recommendation={recommendation} />
        ))}
      </CardContent>
    </Card>
  );
} 