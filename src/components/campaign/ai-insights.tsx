"use client";

import { useTranslations } from 'next-intl';
import { Campaign } from '@/types/campaign';
import { useOptimizationSuggestions, useAudienceInsights, usePerformancePrediction } from '@/hooks/use-campaign-optimizer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Brain, Users, TrendingUp, AlertTriangle } from 'lucide-react';

interface AIInsightsProps {
  campaign: Campaign;
}

export function AIInsights({ campaign }: AIInsightsProps) {
  const t = useTranslations('campaigns.ai');
  const { data: optimizations, isLoading: loadingOptimizations } = useOptimizationSuggestions(campaign);
  const { data: insights, isLoading: loadingInsights } = useAudienceInsights(campaign);
  const { data: prediction, isLoading: loadingPrediction } = usePerformancePrediction(campaign);

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Tabs defaultValue="optimizations" className="space-y-4">
      <TabsList>
        <TabsTrigger value="optimizations" className="flex items-center gap-2">
          <Brain className="h-4 w-4" />
          {t('tabs.optimizations')}
        </TabsTrigger>
        <TabsTrigger value="audience" className="flex items-center gap-2">
          <Users className="h-4 w-4" />
          {t('tabs.audience')}
        </TabsTrigger>
        <TabsTrigger value="prediction" className="flex items-center gap-2">
          <TrendingUp className="h-4 w-4" />
          {t('tabs.prediction')}
        </TabsTrigger>
      </TabsList>

      <TabsContent value="optimizations" className="space-y-4">
        {loadingOptimizations ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-4 w-1/4" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-20 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : optimizations?.length ? (
          optimizations.map((suggestion, index) => (
            <Card key={index}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>{t(`optimizationTypes.${suggestion.type}`)}</CardTitle>
                  <Badge variant="outline" className={getImpactColor(suggestion.impact)}>
                    {t('impact', { level: suggestion.impact })}
                  </Badge>
                </div>
                <CardDescription>
                  {t('confidence', { level: Math.round(suggestion.confidence * 100) })}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <p>{suggestion.suggestion}</p>
                <p className="text-sm text-muted-foreground">{suggestion.reasoning}</p>
              </CardContent>
            </Card>
          ))
        ) : (
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>{t('noOptimizations.title')}</AlertTitle>
            <AlertDescription>{t('noOptimizations.description')}</AlertDescription>
          </Alert>
        )}
      </TabsContent>

      <TabsContent value="audience" className="space-y-4">
        {loadingInsights ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-4 w-1/4" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-20 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : insights?.length ? (
          insights.map((insight, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle>{insight.segment}</CardTitle>
                <CardDescription>
                  {t('affinity', { score: Math.round(insight.affinity * 100) })}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">{t('interests')}</h4>
                  <div className="flex flex-wrap gap-2">
                    {insight.interests.map((interest, i) => (
                      <Badge key={i} variant="secondary">
                        {interest}
                      </Badge>
                    ))}
                  </div>
                </div>
                {insight.demographics && (
                  <div>
                    <h4 className="font-medium mb-2">{t('demographics')}</h4>
                    <div className="space-y-1 text-sm">
                      {insight.demographics.ageRange && (
                        <p>{t('ageRange', { min: insight.demographics.ageRange[0], max: insight.demographics.ageRange[1] })}</p>
                      )}
                      {insight.demographics.locations && (
                        <p>{t('locations', { locations: insight.demographics.locations.join(', ') })}</p>
                      )}
                      {insight.demographics.gender && (
                        <p>{t('gender', { gender: insight.demographics.gender })}</p>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        ) : (
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>{t('noInsights.title')}</AlertTitle>
            <AlertDescription>{t('noInsights.description')}</AlertDescription>
          </Alert>
        )}
      </TabsContent>

      <TabsContent value="prediction" className="space-y-4">
        {loadingPrediction ? (
          <Card>
            <CardHeader>
              <Skeleton className="h-4 w-1/4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-[200px] w-full" />
            </CardContent>
          </Card>
        ) : prediction ? (
          <>
            <Card>
              <CardHeader>
                <CardTitle>{t('metrics.title')}</CardTitle>
                <CardDescription>
                  {t('confidence', { level: Math.round(prediction.confidence * 100) })}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[200px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={[
                        { name: t('metrics.current'), ...campaign.metrics },
                        { name: t('metrics.predicted'), ...prediction.metrics },
                      ]}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="impressions" stroke="#8884d8" name={t('metrics.impressions')} />
                      <Line type="monotone" dataKey="engagement" stroke="#82ca9d" name={t('metrics.engagement')} />
                      <Line type="monotone" dataKey="clicks" stroke="#ffc658" name={t('metrics.clicks')} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>{t('factors.positive')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc pl-4 space-y-1">
                    {prediction.factors.positive.map((factor, index) => (
                      <li key={index}>{factor}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>{t('factors.negative')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc pl-4 space-y-1">
                    {prediction.factors.negative.map((factor, index) => (
                      <li key={index}>{factor}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </>
        ) : (
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>{t('noPrediction.title')}</AlertTitle>
            <AlertDescription>{t('noPrediction.description')}</AlertDescription>
          </Alert>
        )}
      </TabsContent>
    </Tabs>
  );
} 