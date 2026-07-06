import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class AdminAnalyticsService {
  constructor(private prisma: PrismaService) {}

  async getAnalytics(query: { period?: string; from?: string; to?: string }) {
    const { period = 'daily' } = query;

    const [
      totalPlays,
      uniquePlayers,
      rewardsIssued,
      rewardsRedeemed,
      activeBusinesses,
      activeCampaigns,
      topBusinesses,
      topCampaigns,
      topRewards,
    ] = await Promise.all([
      this.prisma.gameSession.count(),
      this.prisma.gameSession.groupBy({ by: ['customerId'] }).then((r) => r.length),
      this.prisma.customerReward.count(),
      this.prisma.rewardRedemption.count(),
      this.prisma.business.count({ where: { isActive: true } }),
      this.prisma.campaign.count({ where: { status: 'Active' } }),
      this.prisma.business.findMany({
        take: 5,
        orderBy: { campaigns: { _count: 'desc' } },
        select: { id: true, name: true, _count: { select: { campaigns: true, rewards: true } } },
      }),
      this.prisma.campaign.findMany({
        take: 5,
        orderBy: { businesses: { _count: 'desc' } },
        select: { id: true, name: true, status: true, _count: { select: { businesses: true, rewards: true } } },
      }),
      this.prisma.reward.findMany({
        take: 5,
        orderBy: { redemptions: { _count: 'desc' } },
        select: { id: true, name: true, _count: { select: { redemptions: true, inventories: true } } },
      }),
    ]);

    return {
      cards: {
        totalPlays,
        uniquePlayers,
        rewardsIssued,
        rewardsRedeemed,
        activeBusinesses,
        activeCampaigns,
      },
      charts: {
        period,
        topBusinesses,
        topCampaigns,
        topRewards,
      },
    };
  }
}
