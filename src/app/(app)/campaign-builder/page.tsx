"use client";

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon, PlusCircle } from "lucide-react";
import { Campaign, CampaignCreateInput, CampaignType, Platform, campaignSchema } from '@/types/campaign';
import { useCreateCampaign } from '@/hooks/use-campaigns';

export default function CampaignBuilderPage() {
  const router = useRouter();
  const t = useTranslations('campaigns');
  const createCampaign = useCreateCampaign();

  const form = useForm<CampaignCreateInput>({
    resolver: zodResolver(campaignSchema),
    defaultValues: {
      name: '',
      description: '',
      type: 'social',
      status: 'draft',
      platforms: [],
      startDate: new Date(),
      content: {
        mainMessage: '',
      },
      targetAudience: {},
    },
  });

  const onSubmit = async (data: CampaignCreateInput) => {
    try {
      await createCampaign.mutateAsync(data);
      router.push('/campaigns');
    } catch (error) {
      console.error('Error creating campaign:', error);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        heading={t('form.basicInfo.title')}
        description={t('form.basicInfo.description')}
      />

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>{t('form.basicInfo.title')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">{t('form.fields.name')}</Label>
              <Input
                id="name"
                {...form.register('name')}
                placeholder={t('form.placeholders.name')}
              />
              {form.formState.errors.name && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.name.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">{t('form.fields.description')}</Label>
              <Textarea
                id="description"
                {...form.register('description')}
                placeholder={t('form.placeholders.description')}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">{t('form.fields.type')}</Label>
              <Select
                value={form.watch('type')}
                onValueChange={(value) => form.setValue('type', value as CampaignType)}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t('form.placeholders.type')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="social">{t('types.social')}</SelectItem>
                  <SelectItem value="email">{t('types.email')}</SelectItem>
                  <SelectItem value="ads">{t('types.ads')}</SelectItem>
                  <SelectItem value="content">{t('types.content')}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>{t('form.fields.platforms')}</Label>
              <div className="flex flex-wrap gap-2">
                {Object.values(Platform._def.values).map((platform) => (
                  <Button
                    key={platform}
                    type="button"
                    variant={form.watch('platforms')?.includes(platform as Platform) ? 'default' : 'outline'}
                    onClick={() => {
                      const platforms = form.watch('platforms') || [];
                      if (platforms.includes(platform as Platform)) {
                        form.setValue(
                          'platforms',
                          platforms.filter((p) => p !== platform)
                        );
                      } else {
                        form.setValue('platforms', [...platforms, platform as Platform]);
                      }
                    }}
                  >
                    {platform}
                  </Button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>{t('form.fields.startDate')}</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      'w-full justify-start text-left font-normal',
                      !form.watch('startDate') && 'text-muted-foreground'
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {form.watch('startDate') ? (
                      format(form.watch('startDate'), 'PPP')
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={form.watch('startDate')}
                    onSelect={(date) => form.setValue('startDate', date || new Date())}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label htmlFor="budget">{t('form.fields.budget')}</Label>
              <Input
                id="budget"
                type="number"
                {...form.register('budget', { valueAsNumber: true })}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('form.content.title')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="mainMessage">{t('form.fields.message')}</Label>
              <Textarea
                id="mainMessage"
                {...form.register('content.mainMessage')}
                placeholder={t('form.placeholders.message')}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="callToAction">{t('form.fields.callToAction')}</Label>
              <Input
                id="callToAction"
                {...form.register('content.callToAction')}
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push('/campaigns')}
          >
            {t('actions.cancel')}
          </Button>
          <Button type="submit" disabled={createCampaign.isPending}>
            <PlusCircle className="mr-2 h-4 w-4" />
            {t('actions.create')}
          </Button>
        </div>
      </form>
    </div>
  );
}
