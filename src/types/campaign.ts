import { z } from 'zod';

export const CampaignType = z.enum(['social', 'email', 'ads', 'content']);
export type CampaignType = z.infer<typeof CampaignType>;

export const CampaignStatus = z.enum(['draft', 'scheduled', 'active', 'paused', 'completed', 'archived']);
export type CampaignStatus = z.infer<typeof CampaignStatus>;

export const Platform = z.enum(['facebook', 'instagram', 'twitter', 'linkedin', 'tiktok', 'email', 'web']);
export type Platform = z.infer<typeof Platform>;

const DemographicsSchema = z.object({
  ageRange: z.tuple([z.number(), z.number()]).optional(),
  locations: z.array(z.string()).optional(),
  interests: z.array(z.string()).optional(),
});

const TargetAudienceSchema = z.object({
  demographics: DemographicsSchema.optional(),
  customSegments: z.array(z.string()).optional(),
});

const ContentScheduleSchema = z.object({
  postTimes: z.array(z.date()),
  timezone: z.string(),
});

const CampaignContentSchema = z.object({
  mainMessage: z.string().min(1),
  callToAction: z.string().optional(),
  mediaUrls: z.array(z.string().url()).optional(),
  schedule: ContentScheduleSchema.optional(),
});

const CampaignMetricsSchema = z.object({
  impressions: z.number().optional(),
  engagement: z.number().optional(),
  clicks: z.number().optional(),
  conversions: z.number().optional(),
  roi: z.number().optional(),
});

const AIInsightsSchema = z.object({
  performancePrediction: z.number().optional(),
  suggestedOptimizations: z.array(z.string()).optional(),
  audienceInsights: z.array(z.string()).optional(),
});

export const campaignSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().optional(),
  type: CampaignType,
  status: CampaignStatus,
  platforms: z.array(Platform),
  startDate: z.date(),
  endDate: z.date().optional(),
  budget: z.number().positive().optional(),
  targetAudience: TargetAudienceSchema,
  content: CampaignContentSchema,
  metrics: CampaignMetricsSchema.optional(),
  aiInsights: AIInsightsSchema.optional(),
});

export type Campaign = z.infer<typeof campaignSchema> & {
  id: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
};

export type CampaignCreateInput = z.infer<typeof campaignSchema>;
export type CampaignUpdateInput = Partial<CampaignCreateInput>; 