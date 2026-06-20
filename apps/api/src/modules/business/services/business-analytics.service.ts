import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class BusinessAnalyticsService {
  constructor(private prisma: PrismaService) {}

  async getAnalytics(businessId: string) {
    const [
      totalPlays,
      totalWins,
      totalRedemptions,
      campaignPlays,
      campaignWins,
      rewardPopularity,
      customerSummary,
    ] = await Promise.all([
      this.prisma.gameSession.count({ where: { config: { businessId } } }),
      this.prisma.gameSession.count({ where: { config: { businessId }, isWin: true } }),
      this.prisma.rewardRedemption.count({ where: { businessId } }),
      this.prisma.gameSession.groupBy({
        by: ['configId'],
        where: { config: { businessId } },
        _count: true,
      }),
      this.prisma.gameSession.groupBy({
        by: ['configId'],
        where: { config: { businessId }, isWin: true },
        _count: true,
      }),
      this.prisma.rewardRedemption.groupBy({
        by: ['rewardId'],
        where: { businessId },
        _count: true,
        orderBy: { _count: { rewardId: 'desc' } },
        take: 10,
      }),
      this.prisma.gameSession.groupBy({
        by: ['customerId'],
        where: { config: { businessId } },
        _count: { customerId: true },
      }).then((sessions) => ({
        total: sessions.length,
        returning: sessions.filter((s) => s._count.customerId > 1).length,
      })),
    ]);

    return {
      campaignAnalytics: {
        totalPlays,
        totalWins,
        totalRedemptions,
        winRate: totalPlays > 0 ? Number(((totalWins / totalPlays) * 100).toFixed(2)) : 0,
      },
      rewardAnalytics: {
        mostPopular: rewardPopularity,
      },
      customerAnalytics: customerSummary,
    };
  }
}
