import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { UpdateGameConfigDto } from '../dto/update-game-config.dto';

@Injectable()
export class BusinessGameService {
  constructor(private prisma: PrismaService) {}

  async getConfig(businessId: string) {
    const config = await this.prisma.gameConfig.findFirst({
      where: { businessId, isActive: true },
      include: { game: true, sessions: { take: 5, orderBy: { createdAt: 'desc' } } },
    });
    return config;
  }

  async updateConfig(businessId: string, dto: UpdateGameConfigDto) {
    let config = await this.prisma.gameConfig.findFirst({
      where: { businessId },
    });

    if (!config) {
      const game = await this.prisma.game.findFirst({ where: { type: 'BallDrop' } });
      if (!game) throw new NotFoundException('No BallDrop game found');
      config = await this.prisma.gameConfig.create({
        data: { gameId: game.id, businessId, config: dto.config ?? {} },
      });
    }

    return this.prisma.gameConfig.update({
      where: { id: config.id },
      data: {
        config: dto.config ?? undefined,
        isActive: dto.isActive ?? undefined,
      },
    });
  }
}
