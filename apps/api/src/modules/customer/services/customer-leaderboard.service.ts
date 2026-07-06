import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class CustomerLeaderboardService {
  constructor(private prisma: PrismaService) {}

  async getLeaderboard(type: string = 'topPlayers', query: { limit?: number }) {
    const { limit = 20 } = query;

    switch (type) {
      case 'mostRewards': {
        const data = await this.prisma.customerReward.groupBy({
          by: ['customerId'],
          _count: { id: true },
          orderBy: { _count: { id: 'desc' } },
          take: limit,
        });
        const customers = await this.getCustomerNames(data.map((d) => d.customerId));
        return data.map((d) => ({
          customerId: d.customerId,
          name: customers.get(d.customerId) || 'Unknown',
          count: d._count.id,
        }));
      }

      case 'mostRedemptions': {
        const data = await this.prisma.rewardRedemption.groupBy({
          by: ['customerId'],
          _count: { id: true },
          orderBy: { _count: { id: 'desc' } },
          take: limit,
        });
        const customers = await this.getCustomerNames(data.map((d) => d.customerId));
        return data.map((d) => ({
          customerId: d.customerId,
          name: customers.get(d.customerId) || 'Unknown',
          count: d._count.id,
        }));
      }

      default: {
        const data = await this.prisma.gameSession.groupBy({
          by: ['customerId'],
          _count: { id: true },
          _sum: { score: true },
          orderBy: { _sum: { score: 'desc' } },
          take: limit,
        });
        const customers = await this.getCustomerNames(data.map((d) => d.customerId));
        return data.map((d) => ({
          customerId: d.customerId,
          name: customers.get(d.customerId) || 'Unknown',
          plays: d._count.id,
          totalScore: d._sum.score ?? 0,
        }));
      }
    }
  }

  async getAchievements(customerId: string) {
    const [totalPlays, totalWins, totalRewards, totalRedemptions] = await Promise.all([
      this.prisma.gameSession.count({ where: { customerId } }),
      this.prisma.gameSession.count({ where: { customerId, isWin: true } }),
      this.prisma.customerReward.count({ where: { customerId } }),
      this.prisma.rewardRedemption.count({ where: { customerId } }),
    ]);

    return [
      { id: 'first_win', name: 'First Win', unlocked: totalWins >= 1, progress: Math.min(totalWins, 1), target: 1 },
      { id: 'ten_rewards', name: '10 Rewards Won', unlocked: totalRewards >= 10, progress: totalRewards, target: 10 },
      { id: 'fifty_plays', name: '50 Plays', unlocked: totalPlays >= 50, progress: totalPlays, target: 50 },
      { id: 'vip_player', name: 'VIP Player', unlocked: totalRedemptions >= 5, progress: totalRedemptions, target: 5 },
    ];
  }

  private async getCustomerNames(ids: string[]): Promise<Map<string, string>> {
    const users = await this.prisma.user.findMany({
      where: { id: { in: ids } },
      select: { id: true, firstName: true, lastName: true },
    });
    const map = new Map<string, string>();
    for (const u of users) {
      map.set(u.id, `${u.firstName} ${u.lastName}`.trim());
    }
    return map;
  }
}
