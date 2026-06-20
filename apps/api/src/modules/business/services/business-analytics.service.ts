import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class BusinessAnalyticsService {
  constructor(private prisma: PrismaService) {}

  async getAnalytics(businessId: string) {
    const [totalPlays, totalWins, totalRedemptions, rewardPopularity, customerSessions] =
      await Promise.all([
        this.prisma.gameSession.count({ where: { config: { businessId } } }),
        this.prisma.gameSession.count({ where: { config: { businessId }, isWin: true } }),
        this.prisma.rewardRedemption.count({ where: { businessId } }),
        this.prisma.rewardRedemption.groupBy({
          by: ['rewardId'],
          where: { businessId },
          _count: { rewardId: true },
          orderBy: { _count: { rewardId: 'desc' } },
          take: 10,
        }),
        this.prisma.gameSession.groupBy({
          by: ['customerId'],
          where: { config: { businessId } },
          _count: { customerId: true },
        }),
      ]);

    const redemptionRate =
      totalPlays > 0
        ? Number(((totalRedemptions / totalPlays) * 100).toFixed(2))
        : 0;

    const rewardIds = rewardPopularity.map((r) => r.rewardId);
    const rewards = rewardIds.length
      ? await this.prisma.reward.findMany({
          where: { id: { in: rewardIds } },
          select: { id: true, name: true },
        })
      : [];
    const rewardNameMap = Object.fromEntries(rewards.map((r) => [r.id, r.name]));

    const totalCustomers = customerSessions.length;
    const returningCustomers = customerSessions.filter(
      (s) => s._count.customerId > 1,
    ).length;
    const newCustomers = totalCustomers - returningCustomers;
    const newPct =
      totalCustomers > 0 ? Math.round((newCustomers / totalCustomers) * 100) : 0;
    const returningPct = totalCustomers > 0 ? 100 - newPct : 0;

    const COLORS = ['#f97316', '#fb923c', '#fdba74', '#fed7aa'];

    return {
      campaignStats: [
        { label: 'Total Plays', value: totalPlays.toLocaleString(), change: '', trend: 'neutral' },
        { label: 'Total Wins', value: totalWins.toLocaleString(), change: '', trend: 'neutral' },
        { label: 'Redemptions', value: totalRedemptions.toLocaleString(), change: '', trend: 'neutral' },
        { label: 'Redemption Rate', value: `${redemptionRate}%`, change: '', trend: 'neutral' },
      ],
      popularRewards: rewardPopularity.map((r, idx) => ({
        name: rewardNameMap[r.rewardId] ?? 'Unknown Reward',
        wins: r._count.rewardId,
        redeemed: r._count.rewardId,
        color: COLORS[idx] ?? '#f97316',
      })),
      customerMetrics: [
        {
          label: 'New Customers',
          value: newCustomers.toLocaleString(),
          percentage: newPct,
          color: '#f97316',
        },
        {
          label: 'Returning Customers',
          value: returningCustomers.toLocaleString(),
          percentage: returningPct,
          color: '#1a1a1a',
        },
      ],
      totalCustomers,
    };
  }
}
