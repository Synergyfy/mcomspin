import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class CustomerDashboardService {
  constructor(private prisma: PrismaService) {}

  async getDashboard(customerId: string) {
    const [
      activeRewards,
      totalPlays,
      totalWins,
      featuredCampaigns,
      trendingRewards,
      recentActivity,
      nearbyBusinesses,
    ] = await Promise.all([
      this.prisma.customerReward.count({
        where: { customerId, usedAt: null, AND: [{ expiresAt: null }, { expiresAt: { gte: new Date() } }] },
      }),
      this.prisma.gameSession.count({ where: { customerId } }),
      this.prisma.gameSession.count({ where: { customerId, isWin: true } }),
      this.prisma.campaign.findMany({
        where: { status: 'Active', isPublic: true, deletedAt: null },
        include: {
          businesses: { include: { business: { select: { id: true, name: true, logoUrl: true, slug: true } } } },
          _count: { select: { rewards: true } },
        },
        orderBy: { createdAt: 'desc' },
        take: 6,
      }),
      this.prisma.reward.findMany({
        where: { isActive: true, deletedAt: null },
        include: { inventories: { include: { business: { select: { id: true, name: true, logoUrl: true } } }, take: 1 } },
        orderBy: { createdAt: 'desc' },
        take: 6,
      }),
      this.prisma.customerActivityLog.findMany({
        where: { customerId },
        orderBy: { createdAt: 'desc' },
        take: 10,
      }),
      this.prisma.business.findMany({
        where: { isActive: true, deletedAt: null },
        select: { id: true, name: true, slug: true, logoUrl: true, description: true, shortDescription: true },
        take: 6,
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    const totalPoints = await this.prisma.pointsTransaction.aggregate({
      where: { loyaltyMembership: { customerId } },
      _sum: { points: true },
    });

    return {
      summary: {
        activeRewards,
        totalPlays,
        totalWins,
        totalPoints: totalPoints._sum.points ?? 0,
      },
      featuredCampaigns,
      trendingRewards,
      recentActivity,
      nearbyBusinesses,
    };
  }
}
