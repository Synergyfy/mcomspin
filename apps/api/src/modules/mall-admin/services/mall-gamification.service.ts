import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class MallGamificationService {
  constructor(private prisma: PrismaService) {}

  async getOverview() {
    const [games, gameConfigs, activeSessions, leaderboardEntries] = await Promise.all([
      this.prisma.game.findMany({
        include: { _count: { select: { configs: true, sessions: true } } },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.gameConfig.findMany({
        include: { game: { select: { id: true, name: true } } },
        orderBy: { createdAt: 'desc' },
        take: 50,
      }),
      this.prisma.gameSession.count({ where: { endedAt: null } }),
      this.prisma.gameSession.groupBy({
        by: ['customerId'],
        _count: { id: true },
        _sum: { score: true },
        orderBy: { _sum: { score: 'desc' } },
        take: 10,
      }),
    ]);
    return { games, gameConfigs, activeSessions, topPlayers: leaderboardEntries };
  }

  async getGames(query: { page?: number; limit?: number }) {
    const { page = 1, limit = 20 } = query;
    const [data, total] = await Promise.all([
      this.prisma.game.findMany({
        include: {
          configs: true,
          _count: { select: { sessions: true } },
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.game.count(),
    ]);
    return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
  }

  async createGameConfig(dto: any) {
    return this.prisma.gameConfig.create({
      data: {
        game: { connect: { id: dto.gameId } },
        business: { connect: { id: dto.businessId } },
        name: dto.name,
        config: dto.config || {},
        isActive: dto.isActive !== false,
      },
    });
  }

  async updateGameConfig(id: string, dto: any) {
    const config = await this.prisma.gameConfig.findUnique({ where: { id } });
    if (!config) throw new NotFoundException('Game config not found');
    return this.prisma.gameConfig.update({ where: { id }, data: dto });
  }
}
