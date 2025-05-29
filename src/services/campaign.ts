import { Campaign } from '@/types/campaign';
import { prisma } from '@/lib/prisma';

export class CampaignService {
  static async createCampaign(data: Omit<Campaign, 'id' | 'createdAt' | 'updatedAt' | 'status'>) {
    return prisma.campaign.create({
      data: {
        ...data,
        status: 'draft',
      },
    });
  }

  static async getCampaigns(options: {
    search?: string;
    status?: string[];
    type?: string[];
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }) {
    const {
      search,
      status,
      type,
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = options;

    const where = {
      AND: [
        search ? {
          OR: [
            { name: { contains: search, mode: 'insensitive' } },
            { description: { contains: search, mode: 'insensitive' } },
          ],
        } : {},
        status?.length ? { status: { in: status } } : {},
        type?.length ? { type: { in: type } } : {},
      ],
    };

    const [total, campaigns] = await Promise.all([
      prisma.campaign.count({ where }),
      prisma.campaign.findMany({
        where,
        orderBy: { [sortBy]: sortOrder },
        skip: (page - 1) * limit,
        limit,
      }),
    ]);

    return {
      campaigns,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  static async getCampaign(id: string) {
    return prisma.campaign.findUnique({
      where: { id },
    });
  }

  static async updateCampaign(id: string, data: Partial<Campaign>) {
    return prisma.campaign.update({
      where: { id },
      data,
    });
  }

  static async deleteCampaign(id: string) {
    return prisma.campaign.delete({
      where: { id },
    });
  }

  static async updateCampaignStatus(id: string, status: Campaign['status']) {
    return prisma.campaign.update({
      where: { id },
      data: { status },
    });
  }

  static async duplicateCampaign(id: string) {
    const campaign = await prisma.campaign.findUnique({
      where: { id },
    });

    if (!campaign) {
      throw new Error('Campaign not found');
    }

    const { id: _, createdAt, updatedAt, ...data } = campaign;

    return prisma.campaign.create({
      data: {
        ...data,
        name: `${data.name} (Copy)`,
        status: 'draft',
      },
    });
  }

  static async getCampaignMetrics(id: string) {
    const campaign = await prisma.campaign.findUnique({
      where: { id },
      select: { metrics: true },
    });

    return campaign?.metrics;
  }

  static async updateCampaignMetrics(id: string, metrics: Campaign['metrics']) {
    return prisma.campaign.update({
      where: { id },
      data: { metrics },
    });
  }

  static async getAIInsights(id: string) {
    // TODO: Implement AI insights generation
    return {
      performancePrediction: Math.random() * 100,
      suggestedOptimizations: [
        'Try posting at different times',
        'Adjust your target audience',
        'Modify your call to action',
      ],
      audienceInsights: [
        'High engagement from 25-34 age group',
        'Strong interest in technology topics',
        'Most active during evenings',
      ],
    };
  }
} 