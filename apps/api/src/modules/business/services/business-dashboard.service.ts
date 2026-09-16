import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class BusinessDashboardService {
  constructor(private prisma: PrismaService) {}

  async getSummary(businessId: string) {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const [
      activeCampaigns,
      rewardsIssued,
      rewardsRedeemed,
      totalPlays,
      customersEngaged,
      recentActivity,
      dailySessions,
    ] = await Promise.all([
      this.prisma.campaign.count({
        where: { businesses: { some: { businessId } }, status: 'Active', deletedAt: null },
      }),
      this.prisma.customerReward.count({
        where: { reward: { inventories: { some: { businessId } } } },
      }),
      this.prisma.rewardRedemption.count({ where: { businessId } }),
      this.prisma.gameSession.count({
        where: { config: { businessId } },
      }),
      this.prisma.$queryRaw<{ count: bigint }[]>`
        SELECT COUNT(DISTINCT "GameSession"."customerId") AS count
        FROM "GameSession"
        INNER JOIN "GameConfig" ON "GameConfig"."id" = "GameSession"."configId"
        WHERE "GameConfig"."businessId" = ${businessId}::uuid
      `.then((r) => Number(r[0]?.count ?? 0)),
      this.prisma.gameSession.findMany({
        where: { config: { businessId } },
        include: { customer: { select: { id: true, firstName: true, lastName: true } } },
        orderBy: { createdAt: 'desc' },
        take: 10,
      }),
      // 30-day daily breakdown for the chart
      this.prisma.gameSession.findMany({
        where: {
          config: { businessId },
          createdAt: { gte: thirtyDaysAgo },
        },
        select: { createdAt: true, isWin: true, customerId: true },
        orderBy: { createdAt: 'asc' },
      }),
    ]);

    const redemptionRate =
      rewardsIssued > 0
        ? Number(((rewardsRedeemed / rewardsIssued) * 100).toFixed(2))
        : 0;

    // Build a map of the last 30 days
    const dayMap: Record<string, { engagement: number; leads: number; rewards: number }> = {};
    for (let i = 29; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toLocaleDateString('en-GB', { month: 'short', day: 'numeric' });
      dayMap[key] = { engagement: 0, leads: 0, rewards: 0 };
    }
    const seenCustomers: Record<string, Set<string>> = {};
    for (const session of dailySessions) {
      const key = new Date(session.createdAt).toLocaleDateString('en-GB', {
        month: 'short',
        day: 'numeric',
      });
      if (!dayMap[key]) continue;
      dayMap[key].leads += 1;
      if (session.isWin) dayMap[key].rewards += 1;
      if (!seenCustomers[key]) seenCustomers[key] = new Set();
      seenCustomers[key].add(session.customerId);
      dayMap[key].engagement = seenCustomers[key].size;
    }

    const chartData = Object.entries(dayMap).map(([day, vals]) => ({ day, ...vals }));

    return {
      activeCampaigns,
      rewardsIssued,
      rewardsRedeemed,
      totalPlays,
      customersEngaged,
      redemptionRate,
      recentActivity,
      chartData,
    };
  }
}
