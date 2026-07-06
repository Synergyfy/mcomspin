import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { UpdateGameConfigDto } from '../dto/update-game-config.dto';

@Injectable()
export class BusinessGameService {
  constructor(private prisma: PrismaService) {}

  async getConfig(businessId: string) {
    const config = await this.prisma.gameConfig.findFirst({
      where: { businessId },
      include: { game: true, sessions: { take: 5, orderBy: { createdAt: 'desc' } } },
    });
    if (!config) return null;

    const gameCampaigns = await this.prisma.gameCampaign.findMany({
      where: { gameId: config.gameId },
      include: { campaign: { select: { id: true, name: true } } },
    });

    return {
      ...config,
      config: config.config ?? {},
      gameCampaigns,
    };
  }

  async updateConfig(businessId: string, dto: UpdateGameConfigDto) {
    let config = await this.prisma.gameConfig.findFirst({
      where: { businessId },
    });

    let game = await this.prisma.game.findFirst({ where: { type: 'BallDrop' } });
    if (!game) {
      game = await this.prisma.game.create({
        data: {
          name: 'Ball Drop',
          slug: 'ball-drop',
          type: 'BallDrop',
          description: 'Interactive Ball Drop Game'
        }
      });
    }

    if (!config) {
      config = await this.prisma.gameConfig.create({
        data: { gameId: game.id, businessId, config: {} },
      });
    }

    const updateData: Record<string, any> = {};
    if (dto.config !== undefined) updateData.config = dto.config;
    if (dto.isActive !== undefined) updateData.isActive = dto.isActive;

    if (dto.campaignIds !== undefined) {
      // Find all campaigns owned by this business
      const businessCampaigns = await this.prisma.campaign.findMany({
        where: {
          businesses: { some: { businessId } },
        },
        select: { id: true },
      });
      const businessCampaignIds = businessCampaigns.map((c) => c.id);

      // Only delete game campaigns that are for this game AND belong to this business's campaigns
      await this.prisma.gameCampaign.deleteMany({
        where: {
          gameId: game.id,
          campaignId: { in: businessCampaignIds },
        },
      });

      if (dto.campaignIds.length > 0) {
        await this.prisma.gameCampaign.createMany({
          data: dto.campaignIds.map((campaignId) => ({
            gameId: game.id,
            campaignId,
            maxPlaysPerCustomer: null, // null = no per-campaign cap; rely on config daily/weekly limits
          })),
        });
      }
    }

    return this.prisma.gameConfig.update({
      where: { id: config.id },
      data: updateData,
    });
  }
}
