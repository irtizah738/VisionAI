"use client";

import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCampaign, useUpdateCampaignStatus } from '@/hooks/use-campaigns';
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import {
  BarChart,
  Calendar,
  Edit,
  Pause,
  Play,
  Settings,
  Target,
  Trash,
  Users,
} from "lucide-react";
import { Campaign } from '@/types/campaign';
import { CampaignForm } from '@/components/campaign/campaign-form';
import { AIInsights } from '@/components/campaign/ai-insights';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';

function CampaignMetrics({ metrics }: { metrics?: Campaign['metrics'] }) {
  const t = useTranslations('campaigns.metrics');

  if (!metrics) return null;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {Object.entries(metrics).map(([key, value]) => (
        <Card key={key}>
          <CardHeader className="p-4">
            <CardDescription>{t(key as keyof typeof metrics)}</CardDescription>
            <CardTitle className="text-2xl">{value}</CardTitle>
          </CardHeader>
        </Card>
      ))}
    </div>
  );
}

function CampaignContent({ content }: { content: Campaign['content'] }) {
  const t = useTranslations('campaigns');

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('form.content.title')}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h4 className="font-medium mb-2">{t('form.fields.message')}</h4>
          <p className="text-muted-foreground">{content.mainMessage}</p>
        </div>
        {content.callToAction && (
          <div>
            <h4 className="font-medium mb-2">{t('form.fields.callToAction')}</h4>
            <p className="text-muted-foreground">{content.callToAction}</p>
          </div>
        )}
        {content.schedule && (
          <div>
            <h4 className="font-medium mb-2">{t('actions.schedule')}</h4>
            <div className="space-y-2">
              {content.schedule.postTimes.map((time, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>{format(new Date(time), 'PPP p')}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default function CampaignDetailPage() {
  const params = useParams();
  const t = useTranslations('campaigns');
  const { data: campaign, isLoading, error } = useCampaign(params.id as string);
  const updateStatus = useUpdateCampaignStatus(params.id as string);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Loading Campaign..." description="Fetching omnichannel campaign metrics" />
        <div className="space-y-4">
          <Skeleton className="h-[400px]" />
        </div>
      </div>
    );
  }

  if (error || !campaign) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>{t('error.title')}</AlertTitle>
        <AlertDescription>{t('error.description')}</AlertDescription>
      </Alert>
    );
  }

  const toggleStatus = () => {
    const newStatus = campaign.status === 'active' ? 'paused' : 'active';
    updateStatus.mutate(newStatus);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={campaign.name}
        description={campaign.description || t('noCampaignDescription')}
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={toggleStatus}
              disabled={updateStatus.isPending}
            >
              {campaign.status === 'active' ? (
                <Pause className="mr-2 h-4 w-4" />
              ) : (
                <Play className="mr-2 h-4 w-4" />
              )}
              {t(`status.${campaign.status === 'active' ? 'paused' : 'active'}`)}
            </Button>
            <Button variant="outline">
              <Edit className="mr-2 h-4 w-4" />
              {t('actions.edit')}
            </Button>
            <Button variant="destructive">
              <Trash className="mr-2 h-4 w-4" />
              {t('actions.delete')}
            </Button>
          </div>
        }
      />
      <div className="flex items-center gap-4">
        <Badge variant="outline">{t(`types.${campaign.type}`)}</Badge>
        <Badge>{t(`status.${campaign.status}`)}</Badge>
      </div>

      <Tabs defaultValue="details" className="space-y-6">
        <TabsList>
          <TabsTrigger value="details">{t('tabs.details')}</TabsTrigger>
          <TabsTrigger value="insights">{t('tabs.insights')}</TabsTrigger>
        </TabsList>

        <TabsContent value="details">
          <CampaignForm campaign={campaign} />
        </TabsContent>

        <TabsContent value="insights">
          <AIInsights campaign={campaign} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
