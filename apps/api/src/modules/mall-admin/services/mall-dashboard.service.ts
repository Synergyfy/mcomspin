import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class MallDashboardService {
  constructor(private prisma: PrismaService) {}

  async getDashboardKpis() {
    const [
      totalBusinesses,
      activeBoroughs,
      activeHighStreets,
      totalCustomers,
      activeCampaigns,
      rewardsRedeemed,
      activeQlinks,
    ] = await Promise.all([
      this.prisma.business.count({ where: { deletedAt: null } }),
      this.prisma.borough.count({ where: { isActive: true } }),
      this.prisma.highStreet.count({ where: { isActive: true } }),
      this.prisma.user.count({
        where: { roles: { some: { role: { name: 'Customer' } } }, deletedAt: null },
      }),
      this.prisma.campaign.count({ where: { status: 'Active' } }),
      this.prisma.rewardRedemption.count(),
      this.prisma.qLink.count({ where: { isActive: true } }),
    ]);

    return {
      totalBusinesses,
      activeBoroughs,
      activeHighStreets,
      totalCustomers,
      activeCampaigns,
      rewardsRedeemed,
      activeQlinks,
    };
  }

  async getActivityFeed(limit = 50) {
    const [businessActivity, customerActivity, redemptions, campaigns] = await Promise.all([
      this.prisma.businessActivityLog.findMany({
        orderBy: { createdAt: 'desc' },
        take: limit,
        include: { business: { select: { name: true } } },
      }),
      this.prisma.customerActivityLog.findMany({
        orderBy: { createdAt: 'desc' },
        take: limit,
        include: { customer: { select: { firstName: true, lastName: true } } },
      }),
      this.prisma.rewardRedemption.findMany({
        orderBy: { redeemedAt: 'desc' },
        take: limit,
        include: { reward: { select: { name: true } } },
      }),
      this.prisma.campaign.findMany({
        orderBy: { updatedAt: 'desc' },
        take: limit,
        select: { id: true, name: true, status: true, updatedAt: true },
      }),
    ]);

    return { businessActivity, customerActivity, redemptions, campaigns };
  }

  async getSettings() {
    const settings = await this.prisma.platformSetting.findMany();
    const map: Record<string, any> = {};
    for (const s of settings) {
      map[s.key] = s.value;
    }
    return map;
  }
}
