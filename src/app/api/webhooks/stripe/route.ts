import { NextRequest, NextResponse } from 'next/server';
import { getVisionAiStore } from '@/lib/prisma';
import { logger } from '@/lib/logger';

export async function POST(request: NextRequest) {
  const timer = logger.startTimer('stripe-webhook');

  try {
    const signature = request.headers.get('stripe-signature');
    const bodyText = await request.text();
    let event: any;

    try {
      event = JSON.parse(bodyText);
    } catch {
      return NextResponse.json(
        { error: 'Invalid payload format' },
        { status: 400 }
      );
    }

    const { type, data } = event;
    logger.info('Received Stripe webhook event', { type, id: data?.object?.id });

    const store = getVisionAiStore();
    const nowIso = new Date().toISOString();

    switch (type) {
      case 'checkout.session.completed': {
        const session = data?.object;
        const customerEmail = session?.customer_details?.email || 'customer@visionai.studio';
        const amountTotal = (session?.amount_total || 0) / 100;

        // Record in workspace items
        store.addItem({
          suite: 'crm',
          title: `Stripe Checkout Completed: $${amountTotal}`,
          status: 'Active Customer',
          summary: `Subscribed via Checkout session ${session?.id || ''}. Email: ${customerEmail}`,
          primaryMetric: amountTotal,
          secondaryMetric: 100,
          meta: { eventType: type, session },
        });
        break;
      }

      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const sub = data?.object;
        store.addItem({
          suite: 'crm',
          title: `Subscription ${type === 'customer.subscription.created' ? 'Created' : 'Updated'}`,
          status: sub?.status || 'active',
          summary: `Subscription ID ${sub?.id || ''} plan ${sub?.items?.data[0]?.price?.id || 'Enterprise Pro'}.`,
          primaryMetric: (sub?.items?.data[0]?.price?.unit_amount || 29900) / 100,
          secondaryMetric: 1,
          meta: { eventType: type, sub },
        });
        break;
      }

      case 'invoice.payment_succeeded': {
        const invoice = data?.object;
        store.addItem({
          suite: 'cro',
          title: `Invoice Paid: $${(invoice?.amount_paid || 0) / 100}`,
          status: 'Paid',
          summary: `Automated recurring payment processed for ${invoice?.customer_email || 'subscriber'}.`,
          primaryMetric: (invoice?.amount_paid || 0) / 100,
          secondaryMetric: 1,
          meta: { eventType: type, invoice },
        });
        break;
      }

      default:
        logger.info(`Unhandled Stripe event type: ${type}`);
    }

    const duration = timer();
    logger.info('Stripe webhook processed successfully', { duration });

    return NextResponse.json({
      received: true,
      eventType: type,
      processedAt: nowIso,
      status: 'success',
    });
  } catch (error: any) {
    timer();
    logger.error('Stripe webhook handler error', error);
    return NextResponse.json(
      { error: error?.message || 'Webhook processing failed' },
      { status: 500 }
    );
  }
}
