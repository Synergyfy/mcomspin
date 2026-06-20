import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class BusinessDashboardService {
  constructor(private prisma: PrismaService) {}

  async getSummary(businessId: string) {
    const [
      activeCampaigns,
      rewardsIssued,
      rewardsRedeemed,
      totalPlays,
      customersEngaged,
      recentActivity,
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
      this.prisma.gameSession.groupBy({
        by: ['customerId'],
        where: { config: { businessId } },
      }).then((r) => r.length),
      this.prisma.gameSession.findMany({
        where: { config: { businessId } },
        include: { customer: { select: { id: true, firstName: true, lastName: true } } },
        orderBy: { createdAt: 'desc' },
        take: 10,
      }),
    ]);

    const redemptionRate = rewardsIssued > 0
      ? Number(((rewardsRedeemed / rewardsIssued) * 100).toFixed(2))
      : 0;

    return {
      activeCampaigns,
      rewardsIssued,
      rewardsRedeemed,
      totalPlays,
      customersEngaged,
      redemptionRate,
      recentActivity,
    };
  }
}
