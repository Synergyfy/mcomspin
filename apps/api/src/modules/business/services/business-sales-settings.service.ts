import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { RegisterBusinessActivationDto } from '../dto/register-business-activation.dto';
import { CreateAutomationDto } from '../dto/create-automation.dto';
import { AiSuggestDto } from '../dto/ai-suggest.dto';
import { SendNotificationDto } from '../dto/send-notification.dto';

@Injectable()
export class BusinessSalesSettingsService {
  constructor(private prisma: PrismaService) {}

  async getActivationDashboard(businessId: string) {
    const [activations, leaderboard] = await Promise.all([
      this.prisma.businessActivation.findMany({
        where: { customerId: businessId },
        include: { business: { select: { id: true, name: true, logoUrl: true } } },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.businessActivation.groupBy({
        by: ['customerId'],
        _count: { id: true },
        orderBy: { _count: { id: 'desc' } },
        take: 10,
      }),
    ]);

    return { activations, leaderboard };
  }

  async registerBusiness(businessId: string, dto: RegisterBusinessActivationDto) {
    const slug = dto.name
      .toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
      + '-' + Date.now().toString(36);

    return this.prisma.$transaction(async (tx) => {
      const business = await tx.business.create({
        data: {
          ownerId: businessId,
          name: dto.name,
          slug,
          contactPhone: dto.phone,
          contactEmail: dto.email,
          isActive: false,
          locations: {
            create: { addressLine1: dto.postcode, city: dto.borough, postcode: dto.postcode },
          },
        },
      });

      await tx.businessActivation.create({
        data: {
          businessId: business.id,
          customerId: businessId,
          status: 'pending',
        },
      });

      return business;
    });
  }

  async getAnalytics(
    businessId: string,
    query: { period?: string; page?: number; limit?: number },
  ) {
    const { period = 'week', page = 1, limit = 20 } = query;

    const [promotionViews, eventRegistrations, qrScans, voucherUsage] = await Promise.all([
      this.prisma.analyticsEvent.count({
        where: {
          eventName: 'promotion_view',
          entityType: 'promotion',
          timestamp: { gte: this.getPeriodStart(period) },
        },
      }),
      this.prisma.eventRegistration.count({
        where: {
          event: { organizerId: businessId, organizerType: 'business' },
          registeredAt: { gte: this.getPeriodStart(period) },
        },
      }),
      this.prisma.qLinkScan.count({
        where: {
          qlink: { businessId },
          scannedAt: { gte: this.getPeriodStart(period) },
        },
      }),
      this.prisma.voucher.count({
        where: {
          businessId,
          status: 'Redeemed',
          redeemedAt: { gte: this.getPeriodStart(period) },
        },
      }),
    ]);

    const trends = await this.prisma.analyticsAggregation.findMany({
      where: {
        entityType: 'business',
        entityId: businessId,
        period,
        periodStart: { gte: this.getPeriodStart(period) },
      },
      orderBy: { periodStart: 'asc' },
    });

    return {
      metrics: { promotionViews, eventRegistrations, qrScans, voucherUsage },
      trends,
    };
  }

  async getInterestSignals(businessId: string) {
    const signals = await this.prisma.interestSignal.groupBy({
      by: ['signalType'],
      where: { businessId },
      _count: { id: true },
      orderBy: { _count: { id: 'desc' } },
    });

    const recent = await this.prisma.interestSignal.findMany({
      where: { businessId },
      orderBy: { createdAt: 'desc' },
      take: 20,
      include: { business: { select: { id: true, name: true } } },
    });

    return { signals, recent };
  }

  async getLiveMonitoring(businessId: string) {
    const [activePromotions, activeEvents, recentRedemptions, recentScans, recentActivations] =
      await Promise.all([
        this.prisma.promotion.count({
          where: { businessId, status: 'Active', endDate: { gte: new Date() } },
        }),
        this.prisma.event.count({
          where: { organizerId: businessId, organizerType: 'business', status: 'Ongoing' },
        }),
        this.prisma.promotionRedemption.findMany({
          where: { promotion: { businessId } },
          orderBy: { redeemedAt: 'desc' },
          take: 10,
          include: { promotion: { select: { id: true, name: true } } },
        }),
        this.prisma.qLinkScan.findMany({
          where: { qlink: { businessId } },
          orderBy: { scannedAt: 'desc' },
          take: 10,
        }),
        this.prisma.businessActivation.findMany({
          where: { businessId },
          orderBy: { createdAt: 'desc' },
          take: 10,
        }),
      ]);

    const liveMetrics = {
      activePromotions,
      activeEvents,
      scansToday: recentScans.length,
      redemptionsToday: recentRedemptions.length,
      activationsToday: recentActivations.length,
    };

    return { liveMetrics, recentRedemptions, recentScans, recentActivations };
  }

  async sendSalesNotification(businessId: string, dto: SendNotificationDto) {
    const business = await this.prisma.business.findUnique({
      where: { id: businessId },
      select: { ownerId: true, name: true },
    });
    if (!business) throw new NotFoundException('Business not found');

    const notification = await this.prisma.notification.create({
      data: {
        userId: business.ownerId,
        type: 'Promotional',
        channel: dto.channels[0] || 'InApp',
        title: dto.title,
        body: dto.message,
        data: { businessId, businessName: business.name, campaignId: dto.campaignId, ...dto.metadata },
      },
    });

    return notification;
  }

  private getPeriodStart(period: string): Date {
    const now = new Date();
    switch (period) {
      case 'day': return new Date(now.setHours(0, 0, 0, 0));
      case 'week': return new Date(now.setDate(now.getDate() - 7));
      case 'month': return new Date(now.setMonth(now.getMonth() - 1));
      case 'year': return new Date(now.setFullYear(now.getFullYear() - 1));
      default: return new Date(now.setDate(now.getDate() - 7));
    }
  }

  async getAutomations(businessId: string) {
    return this.prisma.automationRule.findMany({
      where: { businessId, deletedAt: null },
      include: {
        triggers: true,
        actions: { orderBy: { sortOrder: 'asc' } },
        _count: { select: { logs: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async createAutomation(businessId: string, dto: CreateAutomationDto) {
    const rule = await this.prisma.automationRule.create({
      data: {
        businessId,
        name: dto.name,
        description: dto.description,
        isActive: dto.isActive ?? true,
        triggers: {
          create: {
            type: dto.triggerConfig.type || 'Schedule',
            config: dto.triggerConfig,
          },
        },
        actions: {
          create: {
            type: dto.actionConfig.type || 'Notification',
            config: dto.actionConfig,
            sortOrder: 0,
          },
        },
      },
      include: { triggers: true, actions: true },
    });

    return rule;
  }

  async getAiSuggestions(businessId: string, dto: AiSuggestDto) {
    const category = dto.category;
    const suggestions = [];

    const baseSuggestions = [
      {
        type: 'Weekend Promo',
        title: 'Weekend Flash Deal',
        description: 'Drive foot traffic with a limited-time weekend discount',
        priority: 'high',
      },
      {
        type: 'Lunch Deal',
        title: 'Lunchtime Special',
        description: 'Attract the lunch crowd with a time-bound offer',
        priority: 'medium',
      },
      {
        type: 'Reward Spin',
        title: 'Spin the Wheel Campaign',
        description: 'Engage customers with a gamified reward experience',
        priority: 'medium',
      },
      {
        type: 'Borough Event',
        title: 'Borough-Wide Promotion',
        description: 'Participate in borough campaigns to increase visibility',
        priority: 'low',
      },
      {
        type: 'Flash Discount',
        title: 'Flash Sale Alert',
        description: 'Create urgency with a short-duration flash discount',
        priority: 'high',
      },
    ];

    if (category) {
      const categorySuggestions: Record<string, any[]> = {
        Restaurant: [
          { type: 'Meal Deal', title: '2-for-1 Lunch', description: 'Popular among restaurants nearby', priority: 'high' },
          { type: 'Happy Hour', title: 'Evening Happy Hour', description: 'Boost evening foot traffic', priority: 'medium' },
        ],
        Beauty: [
          { type: 'Session Deal', title: 'New Client Discount', description: 'Attract first-time beauty clients', priority: 'high' },
          { type: 'Package Offer', title: 'Treatment Bundle', description: 'Bundle services for higher value', priority: 'medium' },
        ],
        Fashion: [
          { type: 'Seasonal', title: 'Seasonal Collection Drop', description: 'Highlight new arrivals', priority: 'high' },
          { type: 'Clearance', title: 'End of Line Sale', description: 'Clear out old stock', priority: 'medium' },
        ],
      };
      suggestions.push(...(categorySuggestions[category] || []));
    }

    const all = [...baseSuggestions, ...suggestions];
    return { suggestions: all, generatedAt: new Date().toISOString() };
  }
}
