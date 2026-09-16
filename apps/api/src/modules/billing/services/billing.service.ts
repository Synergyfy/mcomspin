import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class BillingService {
  constructor(private prisma: PrismaService) {}

  async getSubscription(businessId: string) {
    const sub = await this.prisma.subscription.findFirst({
      where: { businessId },
      orderBy: { createdAt: 'desc' },
      include: { invoices: { orderBy: { createdAt: 'desc' }, take: 5 } },
    });
    if (!sub) throw new NotFoundException('No active subscription');
    return sub;
  }

  async changePlan(businessId: string, planVariantId: string) {
    const current = await this.prisma.subscription.findFirst({ where: { businessId }, orderBy: { createdAt: 'desc' } });
    if (current) {
      await this.prisma.subscription.update({ where: { id: current.id }, data: { status: 'cancelled', cancelledAt: new Date() } });
    }
    return this.prisma.subscription.create({
      data: { businessId, metadata: { planVariantId }, currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) },
    });
  }

  /**
   * Subscribe the business to a plan variant. Cancels the current active subscription
   * and creates a new one linked to the chosen PlanVariant.
   */
  async subscribe(businessId: string, dto: { planId: string; billingCycle?: 'month' | 'year' }) {
    const variant = await this.prisma.planVariant.findUnique({
      where: { id: dto.planId },
      include: { plan: true, prices: { where: { isActive: true }, orderBy: { createdAt: 'desc' }, take: 1 } },
    });
    if (!variant || !variant.isActive || !variant.plan?.isActive) {
      throw new BadRequestException('This plan variant is not currently available');
    }

    const price = variant.prices[0];
    const amount = price ? price.amount : new Prisma.Decimal(0);
    const currency = price ? price.currency : 'GBP';

    const billingCycle = dto.billingCycle === 'year' ? 'year' : 'month';
    const periodMs = billingCycle === 'year' ? 365 * 24 * 60 * 60 * 1000 : 30 * 24 * 60 * 60 * 1000;

    await this.prisma.subscription.updateMany({
      where: { businessId, status: 'active' },
      data: { status: 'cancelled', cancelledAt: new Date() },
    });

    const now = new Date();

    return this.prisma.$transaction(async (tx) => {
      const sub = await tx.subscription.create({
        data: {
          businessId,
          status: 'active',
          currentPeriodStart: now,
          currentPeriodEnd: new Date(now.getTime() + periodMs),
          metadata: { billingCycle, planVariantId: variant.id, planName: variant.plan?.name },
        },
      });

      if (Number(amount) > 0) {
        const invoice = await tx.invoice.create({
          data: {
            businessId,
            subscriptionId: sub.id,
            invoiceNumber: `INV-${sub.id.slice(0, 8).toUpperCase()}`,
            description: `${variant.plan?.name} subscription (${billingCycle})`,
            amount,
            taxAmount: new Prisma.Decimal(0),
            totalAmount: amount,
            currency,
            status: 'Paid',
            dueDate: now,
            paidAt: now,
          },
        });
        await tx.transaction.create({
          data: {
            businessId,
            invoiceId: invoice.id,
            amount,
            currency,
            status: 'Completed',
            type: 'Subscription',
            description: `${variant.plan?.name} (${billingCycle})`,
          },
        });
      }

      return tx.subscription.findUnique({
        where: { id: sub.id },
      });
    });
  }

  async cancelSubscription(businessId: string) {
    const sub = await this.prisma.subscription.findFirst({ where: { businessId, status: 'active' }, orderBy: { createdAt: 'desc' } });
    if (!sub) throw new NotFoundException('No active subscription');
    return this.prisma.subscription.update({ where: { id: sub.id }, data: { status: 'cancelled', cancelledAt: new Date() } });
  }

  /**
   * Activate a paid plan locally after the payment has been settled through
   * MCOM Solutions. Mirrors `subscribe()` but stamps the gateway provider and
   * reference on the subscription metadata and the transaction record.
   */
  async activatePaidPlan(
    businessId: string,
    opts: { planId: string; billingCycle?: 'month' | 'year'; provider?: string; providerRef?: string },
  ) {
    const variant = await this.prisma.planVariant.findUnique({
      where: { id: opts.planId },
      include: { plan: true, prices: { where: { isActive: true }, orderBy: { createdAt: 'desc' }, take: 1 } },
    });
    if (!variant || !variant.isActive || !variant.plan?.isActive) {
      throw new BadRequestException('This plan variant is not currently available');
    }

    const price = variant.prices[0];
    const amount = price ? price.amount : new Prisma.Decimal(0);
    const currency = price ? price.currency : 'GBP';

    const billingCycle = opts.billingCycle === 'year' ? 'year' : 'month';
    const periodMs = billingCycle === 'year' ? 365 * 24 * 60 * 60 * 1000 : 30 * 24 * 60 * 60 * 1000;

    await this.prisma.subscription.updateMany({
      where: { businessId, status: 'active' },
      data: { status: 'cancelled', cancelledAt: new Date() },
    });

    const now = new Date();

    return this.prisma.$transaction(async (tx) => {
      const sub = await tx.subscription.create({
        data: {
          businessId,
          status: 'active',
          currentPeriodStart: now,
          currentPeriodEnd: new Date(now.getTime() + periodMs),
          metadata: {
            billingCycle,
            planVariantId: variant.id,
            planName: variant.plan?.name,
            provider: opts.provider ?? null,
            providerRef: opts.providerRef ?? null,
          },
        },
      });

      if (Number(amount) > 0) {
        const invoice = await tx.invoice.create({
          data: {
            businessId,
            subscriptionId: sub.id,
            invoiceNumber: `INV-${sub.id.slice(0, 8).toUpperCase()}`,
            description: `${variant.plan?.name} subscription (${billingCycle})`,
            amount,
            taxAmount: new Prisma.Decimal(0),
            totalAmount: amount,
            currency,
            status: 'Paid',
            dueDate: now,
            paidAt: now,
          },
        });
        await tx.transaction.create({
          data: {
            businessId,
            invoiceId: invoice.id,
            amount,
            currency,
            status: 'Completed',
            type: 'Subscription',
            description: `${variant.plan?.name} (${billingCycle})`,
          },
        });
      }

      return tx.subscription.findUnique({
        where: { id: sub.id },
      });
    });
  }

  async getPaymentMethods(businessId: string) {
    return this.prisma.paymentMethod.findMany({ where: { businessId } });
  }

  async addPaymentMethod(businessId: string, dto: { type: any; provider: string; providerId: string; last4?: string; cardholderName?: string; isDefault?: boolean }) {
    if (dto.isDefault) {
      await this.prisma.paymentMethod.updateMany({ where: { businessId, isDefault: true }, data: { isDefault: false } });
    }
    return this.prisma.paymentMethod.create({
      data: { ...dto, businessId, isDefault: dto.isDefault || false },
    });
  }

  async removePaymentMethod(businessId: string, id: string) {
    const pm = await this.prisma.paymentMethod.findFirst({ where: { id, businessId } });
    if (!pm) throw new NotFoundException('Payment method not found');
    await this.prisma.paymentMethod.delete({ where: { id } });
    return { message: 'Payment method removed' };
  }

  async setDefaultPaymentMethod(businessId: string, id: string) {
    await this.prisma.paymentMethod.updateMany({ where: { businessId, isDefault: true }, data: { isDefault: false } });
    await this.prisma.paymentMethod.update({ where: { id }, data: { isDefault: true } });
    return { message: 'Default payment method updated' };
  }

  async getInvoices(businessId: string, page: number = 1, limit: number = 20) {
    const [items, total] = await Promise.all([
      this.prisma.invoice.findMany({
        where: { businessId },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.invoice.count({ where: { businessId } }),
    ]);
    return { data: items, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  }

  async getInvoiceById(businessId: string, invoiceId: string) {
    const invoice = await this.prisma.invoice.findFirst({
      where: { id: invoiceId, businessId },
      include: { transactions: true },
    });
    if (!invoice) throw new NotFoundException('Invoice not found');
    return invoice;
  }

  async payInvoice(businessId: string, invoiceId: string) {
    const invoice = await this.prisma.invoice.findFirst({ where: { id: invoiceId, businessId } });
    if (!invoice) throw new NotFoundException('Invoice not found');
    if (invoice.status === 'Paid') throw new BadRequestException('Invoice already paid');

    return this.prisma.$transaction(async (tx) => {
      await tx.transaction.create({
        data: { businessId, invoiceId, amount: invoice.totalAmount, currency: invoice.currency, status: 'Completed', type: 'Payment' },
      });
      return tx.invoice.update({ where: { id: invoiceId }, data: { status: 'Paid', paidAt: new Date() } });
    });
  }

  async getTransactions(businessId: string, page: number = 1, limit: number = 20) {
    const [items, total] = await Promise.all([
      this.prisma.transaction.findMany({
        where: { businessId },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.transaction.count({ where: { businessId } }),
    ]);
    return { data: items, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  }

  async getPlans() {
    return this.prisma.plan.findMany({
      where: { isActive: true },
      include: {
        variants: {
          where: { isActive: true },
          include: {
            tierLevel: true,
            prices: { where: { isActive: true }, orderBy: { createdAt: 'desc' }, take: 1 },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}
