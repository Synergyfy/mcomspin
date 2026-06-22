import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class AdminDashboardService {
  constructor(private prisma: PrismaService) {}

  async getDashboard() {
    const [
      totalBusinesses,
      activeBusinesses,
      totalCustomers,
      totalCampaigns,
      activeCampaigns,
      totalPlays,
      rewardsIssued,
      rewardsRedeemed,
    ] = await Promise.all([
      this.prisma.business.count(),
      this.prisma.business.count({ where: { isActive: true } }),
      this.prisma.user.count({ where: { isActive: true, roles: { some: { role: { name: 'Customer' } } } } }),
      this.prisma.campaign.count(),
      this.prisma.campaign.count({ where: { status: 'Active' } }),
      this.prisma.gameSession.count(),
      this.prisma.customerReward.count(),
      this.prisma.rewardRedemption.count(),
    ]);

    const redemptionRate = rewardsIssued > 0
      ? Number(((rewardsRedeemed / rewardsIssued) * 100).toFixed(2))
      : 0;

    return {
      totalBusinesses,
      activeBusinesses,
      totalCustomers,
      totalCampaigns,
      activeCampaigns,
      totalPlays,
      rewardsIssued,
      rewardsRedeemed,
      redemptionRate,
    };
  }
}
