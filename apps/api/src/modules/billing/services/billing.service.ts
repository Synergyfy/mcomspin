import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { Prisma, SubscriptionPlanType } from '@prisma/client';
import { PrismaService } from '../../../prisma/prisma.service';

const PLAN_TYPE_BY_NAME: Record<string, SubscriptionPlanType> = {
  'spin free': SubscriptionPlanType.Free,
  'spin starter': SubscriptionPlanType.Starter,
  'spin growth': SubscriptionPlanType.Growth,
  'spin enterprise': SubscriptionPlanType.Enterprise,
};

@Injectable()
export class BillingService {
  constructor(private prisma: PrismaService) {}

  async getSubscription(businessId: string) {
    const sub = await this.prisma.subscription.findFirst({
      where: { businessId },
      orderBy: { createdAt: 'desc' },
      include: { plan: true, invoices: { orderBy: { createdAt: 'desc' }, take: 5 } },
    });
    if (!sub) throw new NotFoundException('No active subscription');
    return sub;
  }

  async changePlan(businessId: string, planType: any) {
    const current = await this.prisma.subscription.findFirst({ where: { businessId }, orderBy: { createdAt: 'desc' } });
    if (current) {
      await this.prisma.subscription.update({ where: { id: current.id }, data: { status: 'cancelled', cancelledAt: new Date() } });
    }
    return this.prisma.subscription.create({
      data: { businessId, planType, currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) },
    });
  }

  /**
   * Subscribe the business to a plan. Cancels the current active subscription
   * and creates a new one linked to the chosen SubscriptionPlan.
   */
  async subscribe(businessId: string, dto: { planId: string; billingCycle?: 'month' | 'year' }) {
    const plan = await this.prisma.subscriptionPlan.findUnique({ where: { id: dto.planId } });
    if (!plan) throw new NotFoundException('Plan not found');
    if (!plan.isActive) throw new BadRequestException('This plan is not currently available');

    const billingCycle = dto.billingCycle === 'year' ? 'year' : 'month';
    const periodMs = billingCycle === 'year' ? 365 * 24 * 60 * 60 * 1000 : 30 * 24 * 60 * 60 * 1000;

    await this.prisma.subscription.updateMany({
      where: { businessId, status: 'active' },
      data: { status: 'cancelled', cancelledAt: new Date() },
    });

    const planType = PLAN_TYPE_BY_NAME[plan.name.toLowerCase()] ?? SubscriptionPlanType.Growth;
    const now = new Date();

    return this.prisma.$transaction(async (tx) => {
      const sub = await tx.subscription.create({
        data: {
          businessId,
          planId: plan.id,
          planType,
          status: 'active',
          currentPeriodStart: now,
          currentPeriodEnd: new Date(now.getTime() + periodMs),
          metadata: { billingCycle },
        },
      });

      if (!plan.isFree && Number(plan.price) > 0) {
        const invoice = await tx.invoice.create({
          data: {
            businessId,
            subscriptionId: sub.id,
            invoiceNumber: `INV-${sub.id.slice(0, 8).toUpperCase()}`,
            description: `${plan.name} subscription (${billingCycle})`,
            amount: plan.price,
            taxAmount: new Prisma.Decimal(0),
            totalAmount: plan.price,
            currency: plan.currency,
            status: 'Paid',
            dueDate: now,
            paidAt: now,
          },
        });
        await tx.transaction.create({
          data: {
            businessId,
            invoiceId: invoice.id,
            amount: plan.price,
            currency: plan.currency,
            status: 'Completed',
            type: 'Subscription',
            description: `${plan.name} (${billingCycle})`,
          },
        });
      }

      return tx.subscription.findUnique({
        where: { id: sub.id },
        include: { plan: true },
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
    const plan = await this.prisma.subscriptionPlan.findUnique({ where: { id: opts.planId } });
    if (!plan) throw new NotFoundException('Plan not found');
    if (!plan.isActive) throw new BadRequestException('This plan is not currently available');

    const billingCycle = opts.billingCycle === 'year' ? 'year' : 'month';
    const periodMs = billingCycle === 'year' ? 365 * 24 * 60 * 60 * 1000 : 30 * 24 * 60 * 60 * 1000;

    await this.prisma.subscription.updateMany({
      where: { businessId, status: 'active' },
      data: { status: 'cancelled', cancelledAt: new Date() },
    });

    const planType = PLAN_TYPE_BY_NAME[plan.name.toLowerCase()] ?? SubscriptionPlanType.Growth;
    const now = new Date();

    return this.prisma.$transaction(async (tx) => {
      const sub = await tx.subscription.create({
        data: {
          businessId,
          planId: plan.id,
          planType,
          status: 'active',
          currentPeriodStart: now,
          currentPeriodEnd: new Date(now.getTime() + periodMs),
          metadata: {
            billingCycle,
            provider: opts.provider ?? null,
            providerRef: opts.providerRef ?? null,
          },
        },
      });

      if (!plan.isFree && Number(plan.price) > 0) {
        const invoice = await tx.invoice.create({
          data: {
            businessId,
            subscriptionId: sub.id,
            invoiceNumber: `INV-${sub.id.slice(0, 8).toUpperCase()}`,
            description: `${plan.name} subscription (${billingCycle})`,
            amount: plan.price,
            taxAmount: new Prisma.Decimal(0),
            totalAmount: plan.price,
            currency: plan.currency,
            status: 'Paid',
            dueDate: now,
            paidAt: now,
            metadata: {
              provider: opts.provider ?? null,
              providerRef: opts.providerRef ?? null,
            },
          },
        });
        await tx.transaction.create({
          data: {
            businessId,
            invoiceId: invoice.id,
            amount: plan.price,
            currency: plan.currency,
            status: 'Completed',
            type: 'Subscription',
            description: `${plan.name} (${billingCycle})`,
            provider: opts.provider ?? null,
            providerRef: opts.providerRef ?? null,
          },
        });
      }

      return tx.subscription.findUnique({
        where: { id: sub.id },
        include: { plan: true },
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

  async getInvoiceById(invoiceId: string) {
    const invoice = await this.prisma.invoice.findUnique({ where: { id: invoiceId }, include: { transactions: true } });
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
    const plans = await this.prisma.subscriptionPlan.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
    });
    return plans.map((plan) => ({
      id: plan.id,
      name: plan.name,
      description: plan.description,
      isFree: plan.isFree,
      monthlyPrice: Number(plan.price),
      currency: plan.currency,
      interval: plan.interval,
      isDefault: ((plan.features as any)?.isDefault ?? false) as boolean,
      configuration: {
        quotas: ((plan.features as any)?.quotas ?? {}) as Record<string, number>,
        featureFlags: ((plan.features as any)?.featureFlags ?? {}) as Record<string, boolean>,
      },
    }));
  }
}
