import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../../../prisma/prisma.service';
import { UpdateBusinessProfileDto } from '../dto/business-profile.dto';
import { UpdateBusinessSettingsDto } from '../dto/update-settings.dto';

@Injectable()
export class BusinessProfileService {
  constructor(private prisma: PrismaService) {}

  async getProfile(businessId: string) {
    const business = await this.prisma.business.findUnique({
      where: { id: businessId },
      include: {
        verification: true,
        membership: true,
        locations: { where: { deletedAt: null } },
      },
    });
    if (!business) throw new NotFoundException('Business not found');
    return business;
  }

  async updateProfile(businessId: string, dto: UpdateBusinessProfileDto) {
    const business = await this.prisma.business.findUnique({ where: { id: businessId } });
    if (!business) throw new NotFoundException('Business not found');

    return this.prisma.business.update({
      where: { id: businessId },
      data: dto,
    });
  }

  async updateSettings(userId: string, businessId: string, dto: UpdateBusinessSettingsDto) {
    if (dto.password) {
      const passwordHash = await bcrypt.hash(dto.password, 12);
      await this.prisma.user.update({
        where: { id: userId },
        data: { passwordHash },
      });
    }

    if (dto.branding || dto.notifications) {
      await this.prisma.business.update({
        where: { id: businessId },
        data: {
          metadata: {
            ...dto.branding ? { branding: dto.branding } : {},
            ...dto.notifications ? { notifications: dto.notifications } : {},
          },
        },
      });
    }

    return { message: 'Settings updated' };
  }

  async getBilling(businessId: string) {
    const [subscription, invoices, plans, paymentMethods] = await Promise.all([
      this.prisma.subscription.findFirst({
        where: { businessId },
        orderBy: { createdAt: 'desc' },
        include: { plan: true },
      }),
      this.prisma.invoice.findMany({
        where: { businessId },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.subscriptionPlan.findMany({
        where: { isActive: true },
        orderBy: { sortOrder: 'asc' },
      }),
      this.prisma.paymentMethod.findMany({ where: { businessId } }),
    ]);

    const serializedPlans = plans.map((plan) => ({
      id: plan.id,
      name: plan.name,
      description: plan.description,
      isFree: plan.isFree,
      monthlyPrice: Number(plan.price),
      quarterlyPrice: ((plan.features as any)?.quarterlyPrice ?? undefined) as number | undefined,
      annualPrice: ((plan.features as any)?.annualPrice ?? undefined) as number | undefined,
      type: ((plan.features as any)?.type ?? (plan.isFree ? 'TRIAL' : 'STANDARD')) as string,
      currency: plan.currency,
      interval: plan.interval,
      isDefault: ((plan.features as any)?.isDefault ?? false) as boolean,
      configuration: {
        quotas: ((plan.features as any)?.quotas ?? {}) as Record<string, number>,
        featureFlags: ((plan.features as any)?.featureFlags ?? {}) as Record<string, boolean>,
      },
    }));

    return {
      subscription,
      invoices,
      plans: serializedPlans,
      paymentMethod: paymentMethods.find((pm) => pm.isDefault) ?? paymentMethods[0] ?? null,
    };
  }

  async updateEmail(businessId: string, email: string) {
    const business = await this.prisma.business.findUnique({ where: { id: businessId } });
    if (!business) throw new NotFoundException('Business not found');
    await this.prisma.user.update({
      where: { id: business.ownerId },
      data: { email },
    });
    return { message: 'Email updated' };
  }

  async updatePassword(userId: string, dto: { currentPassword: string; newPassword: string }) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    const isValid = await bcrypt.compare(dto.currentPassword, user.passwordHash);
    if (!isValid) throw new BadRequestException('Current password is incorrect');

    const passwordHash = await bcrypt.hash(dto.newPassword, 12);
    await this.prisma.user.update({
      where: { id: userId },
      data: { passwordHash },
    });
    return { message: 'Password updated' };
  }

  async getSecurity(businessId: string) {
    const business = await this.prisma.business.findUnique({
      where: { id: businessId },
      include: { owner: { include: { sessions: { where: { isRevoked: false }, orderBy: { lastActivityAt: 'desc' }, take: 10 } } } },
    });
    if (!business) throw new NotFoundException('Business not found');
    return {
      email: business.owner.email,
      isEmailVerified: business.owner.isEmailVerified,
      isPhoneVerified: business.owner.isPhoneVerified,
      recentSessions: business.owner.sessions,
      twoFactorEnabled: false,
    };
  }

  async logoutAllDevices(userId: string) {
    await this.prisma.session.updateMany({
      where: { userId, isRevoked: false },
      data: { isRevoked: true },
    });
    return { message: 'Logged out all devices' };
  }

  async getNotificationPrefs(businessId: string) {
    const business = await this.prisma.business.findUnique({ where: { id: businessId }, include: { owner: true } });
    if (!business) throw new NotFoundException('Business not found');
    return this.prisma.notificationPreference.findMany({ where: { userId: business.ownerId } });
  }

  async updateNotificationPrefs(businessId: string, dto: any) {
    const business = await this.prisma.business.findUnique({ where: { id: businessId } });
    if (!business) throw new NotFoundException('Business not found');

    if (dto.preferences && Array.isArray(dto.preferences) && dto.preferences.length > 0) {
      await this.prisma.$transaction(
        dto.preferences.map((pref: { channel: any; type: any; enabled: boolean }) =>
          this.prisma.notificationPreference.upsert({
            where: { userId_channel_type: { userId: business.ownerId, channel: pref.channel, type: pref.type } },
            update: { enabled: pref.enabled },
            create: { userId: business.ownerId, channel: pref.channel, type: pref.type, enabled: pref.enabled },
          }),
        ),
      );
    }
    return { message: 'Notification preferences updated' };
  }

  async getIntegrations(businessId: string) {
    const business = await this.prisma.business.findUnique({ where: { id: businessId } });
    if (!business) throw new NotFoundException('Business not found');
    return { googleBusinessId: (business.metadata as any)?.googleBusinessId, paymentProviders: (business.metadata as any)?.paymentProviders || [] };
  }

  async connectGoogleIntegration(businessId: string, googleBusinessId: string) {
    const business = await this.prisma.business.findUnique({ where: { id: businessId } });
    if (!business) throw new NotFoundException('Business not found');
    await this.prisma.business.update({
      where: { id: businessId },
      data: { metadata: { ...(business.metadata as any || {}), googleBusinessId } },
    });
    return { message: 'Google integration connected' };
  }

  async connectPayment(businessId: string, dto: { provider: string; accountId: string }) {
    await this.prisma.paymentMethod.create({
      data: { businessId, type: 'CreditCard' as any, provider: dto.provider, providerId: dto.accountId, isDefault: false },
    });
    return { message: `${dto.provider} connected` };
  }

  async disconnectIntegration(businessId: string, id: string) {
    await this.prisma.paymentMethod.delete({ where: { id, businessId } });
    return { message: 'Integration disconnected' };
  }

  async getInvoices(businessId: string) {
    return this.prisma.invoice.findMany({ where: { businessId }, orderBy: { createdAt: 'desc' } });
  }

  async getTransactions(businessId: string) {
    return this.prisma.transaction.findMany({ where: { businessId }, orderBy: { createdAt: 'desc' } });
  }

  async updatePaymentMethod(businessId: string, dto: any) {
    if (dto.isDefault) {
      await this.prisma.paymentMethod.updateMany({ where: { businessId, isDefault: true }, data: { isDefault: false } });
    }
    return this.prisma.paymentMethod.upsert({
      where: { id: dto.id || 'nonexistent' },
      update: { ...dto, businessId },
      create: { ...dto, businessId },
    });
  }

  async payInvoice(businessId: string, invoiceId: string) {
    const invoice = await this.prisma.invoice.findUnique({ where: { id: invoiceId } });
    if (!invoice || invoice.businessId !== businessId) throw new NotFoundException('Invoice not found');
    if (invoice.status !== 'Draft' && invoice.status !== 'Sent') throw new BadRequestException('Invoice already paid');

    await this.prisma.transaction.create({
      data: {
        businessId,
        invoiceId,
        amount: invoice.totalAmount,
        currency: invoice.currency,
        status: 'Completed',
        type: 'Payment',
      },
    });
    return this.prisma.invoice.update({
      where: { id: invoiceId },
      data: { status: 'Paid', paidAt: new Date() },
    });
  }

  async deactivateAccount(businessId: string, dto: { action: 'pause' | 'delete'; password: string }) {
    const business = await this.prisma.business.findUnique({ where: { id: businessId }, include: { owner: true } });
    if (!business) throw new NotFoundException('Business not found');

    const isValid = await bcrypt.compare(dto.password, business.owner.passwordHash);
    if (!isValid) throw new BadRequestException('Password is incorrect');

    if (dto.action === 'pause') {
      await this.prisma.business.update({ where: { id: businessId }, data: { isActive: false } });
      return { message: 'Account paused' };
    }
    await this.prisma.business.update({ where: { id: businessId }, data: { deletedAt: new Date() } });
    return { message: 'Account scheduled for deletion' };
  }
}
