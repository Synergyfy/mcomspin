import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
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

  async changePlan(businessId: string, planType: any) {
    const current = await this.prisma.subscription.findFirst({ where: { businessId }, orderBy: { createdAt: 'desc' } });
    if (current) {
      await this.prisma.subscription.update({ where: { id: current.id }, data: { status: 'cancelled', cancelledAt: new Date() } });
    }
    return this.prisma.subscription.create({
      data: { businessId, planType, currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) },
    });
  }

  async cancelSubscription(businessId: string) {
    const sub = await this.prisma.subscription.findFirst({ where: { businessId, status: 'active' }, orderBy: { createdAt: 'desc' } });
    if (!sub) throw new NotFoundException('No active subscription');
    return this.prisma.subscription.update({ where: { id: sub.id }, data: { status: 'cancelled', cancelledAt: new Date() } });
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

    await this.prisma.transaction.create({
      data: { businessId, invoiceId, amount: invoice.totalAmount, currency: invoice.currency, status: 'Completed', type: 'Payment' },
    });
    return this.prisma.invoice.update({ where: { id: invoiceId }, data: { status: 'Paid', paidAt: new Date() } });
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
    return this.prisma.subscriptionPlan.findMany({ where: { isActive: true }, orderBy: { sortOrder: 'asc' } });
  }
}
