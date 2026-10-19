import { NextRequest, NextResponse } from 'next/server';
import { getVisionAiStore } from '@/lib/prisma';
import { logger } from '@/lib/logger';

export async function POST(request: NextRequest) {
  const timer = logger.startTimer('hubspot-webhook');

  try {
    const bodyText = await request.text();
    let events: any[];

    try {
      const parsed = JSON.parse(bodyText);
      events = Array.isArray(parsed) ? parsed : [parsed];
    } catch {
      return NextResponse.json(
        { error: 'Invalid HubSpot payload' },
        { status: 400 }
      );
    }

    const store = getVisionAiStore();
    const nowIso = new Date().toISOString();
    const processedEvents: any[] = [];

    for (const evt of events) {
      const { subscriptionType, objectId, propertyName, propertyValue } = evt;
      logger.info('Received HubSpot webhook event', { subscriptionType, objectId });

      if (subscriptionType === 'contact.creation' || subscriptionType === 'contact.propertyChange') {
        store.addItem({
          suite: 'crm',
          title: `HubSpot Lead: Contact #${objectId}`,
          status: 'HubSpot Synced',
          summary: `Property change on ${propertyName || 'contact'}: ${propertyValue || 'created'}. Enrolled in Drip Automation Sequence.`,
          primaryMetric: 85,
          secondaryMetric: 1,
          meta: { event: evt, hubspotObjectId: objectId },
        });
        processedEvents.push({ objectId, type: subscriptionType, status: 'enrolled' });
      } else if (subscriptionType === 'deal.creation' || subscriptionType === 'deal.propertyChange') {
        store.addItem({
          suite: 'cro',
          title: `HubSpot Deal Event #${objectId}`,
          status: 'Pipeline Deal',
          summary: `Deal ${propertyName || 'property'} updated to ${propertyValue || 'active'}.`,
          primaryMetric: 12500,
          secondaryMetric: 100,
          meta: { event: evt, hubspotObjectId: objectId },
        });
        processedEvents.push({ objectId, type: subscriptionType, status: 'deal_updated' });
      }
    }

    const duration = timer();
    logger.info('HubSpot webhook batch processed successfully', { count: processedEvents.length, duration });

    return NextResponse.json({
      received: true,
      processedCount: processedEvents.length,
      events: processedEvents,
      processedAt: nowIso,
    });
  } catch (error: any) {
    timer();
    logger.error('HubSpot webhook handler error', error);
    return NextResponse.json(
      { error: error?.message || 'HubSpot webhook processing failed' },
      { status: 500 }
    );
  }
}
