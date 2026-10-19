import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  try {
    // Test connection
    await prisma.$connect();
    console.log('✅ Database connection successful');

    // Create test user
    const hashedPassword = await hash('testpass123', 12);
    const user = await prisma.user.upsert({
      where: { email: 'test@example.com' },
      update: {},
      create: {
        email: 'test@example.com',
        name: 'Test User',
        password: hashedPassword,
      },
    });
    console.log('✅ Test user created:', user.email);

    // Create test campaign
    const campaign = await prisma.campaign.create({
      data: {
        name: 'Test Campaign',
        description: 'A test marketing campaign',
        type: 'social',
        status: 'DRAFT',
        platforms: ['facebook', 'instagram'],
        startDate: new Date(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        budget: 1000,
        targetAudience: {
          age: { min: 18, max: 35 },
          locations: ['US', 'UK'],
          interests: ['technology', 'marketing'],
        },
        content: {
          mainMessage: 'Test campaign message',
          callToAction: 'Learn More',
        },
        userId: user.id,
      },
    });
    console.log('✅ Test campaign created:', campaign.name);

    // Create test content
    const content = await prisma.content.create({
      data: {
        type: 'SOCIAL_POST',
        title: 'Test Post',
        body: 'This is a test social media post',
        status: 'DRAFT',
        campaignId: campaign.id,
        metadata: {
          platforms: ['facebook', 'instagram'],
          scheduledTime: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
        },
      },
    });
    console.log('✅ Test content created:', content.title);

    // Create test analytics
    const analytics = await prisma.analytics.create({
      data: {
        type: 'ENGAGEMENT',
        data: {
          views: 1000,
          likes: 150,
          shares: 50,
          comments: 25,
        },
        userId: user.id,
        campaignId: campaign.id,
        contentId: content.id,
      },
    });
    console.log('✅ Test analytics created for campaign');

  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main(); 