import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class WebhooksService {
  constructor(private prisma: PrismaService) {}

  async handlePaymentSuccess(payload: any) {
    const { invoiceId, transactionRef, metadata } = payload;
    if (invoiceId) {
      await this.prisma.invoice.update({
        where: { id: invoiceId },
        data: {
          status: 'Paid',
          paidAt: new Date(),
          metadata: { ...(metadata || {}), transactionRef, webhookProcessedAt: new Date().toISOString() },
        },
      });
    }
    return { received: true, status: 'processed' };
  }

  async handlePaymentFailed(payload: any) {
    const { invoiceId, reason, metadata } = payload;
    if (invoiceId) {
      const invoice = await this.prisma.invoice.findUnique({ where: { id: invoiceId } });
      if (invoice) {
        await this.prisma.invoice.update({
          where: { id: invoiceId },
          data: {
            status: 'Overdue',
            metadata: { ...(metadata || {}), failureReason: reason || 'Payment failed', webhookProcessedAt: new Date().toISOString() },
          },
        });
      }
    }
    return { received: true, status: 'processed' };
  }

  async handleGoogleNotification(payload: any) {
    const { googlePlaceId, businessId, notificationType, ...rest } = payload || {};
    if (!notificationType || typeof notificationType !== 'string') {
      return { received: true, status: 'skipped', reason: 'Missing or invalid notificationType' };
    }
    const notificationMeta: Record<string, unknown> = {
      lastGoogleNotification: new Date().toISOString(),
      notificationType,
      payload: rest,
    };
    if (!businessId && !googlePlaceId) {
      return { received: true, status: 'skipped', reason: 'No businessId or googlePlaceId provided' };
    }
    if (businessId) {
      await this.prisma.businessVerification.updateMany({
        where: { businessId: businessId as string },
        data: { metadata: notificationMeta as any },
      });
    } else {
      await this.prisma.businessVerification.updateMany({
        where: { googlePlaceId: googlePlaceId as string },
        data: { metadata: notificationMeta as any },
      });
    }
    return { received: true, status: 'processed' };
  }
}
