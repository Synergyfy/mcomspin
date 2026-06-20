import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateRotatorDto } from '../dto/create-rotator.dto';
import { CreateGameConfigDto } from '../dto/create-game-config.dto';

@Injectable()
export class BusinessGamificationService {
  constructor(private prisma: PrismaService) {}

  async getRotators(
    businessId: string,
    query: { status?: string; page?: number; limit?: number },
  ) {
    const { status, page = 1, limit = 20 } = query;
    const where: any = {
      campaign: { businesses: { some: { businessId } } },
    };
    if (status === 'active') where.isActive = true;
    else if (status === 'inactive') where.isActive = false;

    const [data, total] = await Promise.all([
      this.prisma.rotator.findMany({
        where,
        include: {
          items: {
            include: {
              product: { select: { id: true, name: true, price: true } },
              promotion: { select: { id: true, name: true, type: true } },
            },
          },
          campaign: { select: { id: true, name: true } },
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.rotator.count({ where }),
    ]);

    return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
  }

  async createRotator(businessId: string, dto: CreateRotatorDto) {
    return this.prisma.$transaction(async (tx) => {
      const campaign = await tx.campaign.create({
        data: {
          name: dto.name,
          type: 'HighStreet',
          status: 'Active',
          startDate: new Date(),
          endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          businesses: { create: { businessId } },
        },
      });

      const rotator = await tx.rotator.create({
        data: {
          campaignId: campaign.id,
          name: dto.name,
          type: dto.type,
          displayOrder: dto.priority ?? 0,
          isActive: true,
          metadata: dto.displaySettings,
        },
      });

      const items: any[] = [];
      if (dto.productIds) {
        for (const productId of dto.productIds) {
          items.push({ rotatorId: rotator.id, productId, sortOrder: items.length });
        }
      }
      if (dto.promotionIds) {
        for (const promotionId of dto.promotionIds) {
          items.push({ rotatorId: rotator.id, promotionId, sortOrder: items.length });
        }
      }

      if (items.length > 0) {
        await tx.rotatorItem.createMany({ data: items });
      }

      return tx.rotator.findUnique({
        where: { id: rotator.id },
        include: { items: true },
      });
    });
  }

  async getGames(businessId: string) {
    return this.prisma.gameConfig.findMany({
      where: { businessId },
      include: {
        game: { select: { id: true, name: true, type: true } },
        _count: { select: { sessions: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async createGame(businessId: string, dto: CreateGameConfigDto) {
    const game = await this.prisma.game.findFirst({
      where: { type: dto.gameType, isActive: true },
    });
    if (!game) {
      const newGame = await this.prisma.game.create({
        data: {
          name: dto.gameType.toString(),
          slug: dto.gameType.toString().toLowerCase(),
          type: dto.gameType,
          isActive: true,
        },
      });
      return this.prisma.gameConfig.create({
        data: {
          gameId: newGame.id,
          businessId,
          name: dto.name,
          config: dto.config || dto.rules || {},
          isActive: true,
        },
        include: { game: true },
      });
    }

    return this.prisma.gameConfig.create({
      data: {
        gameId: game.id,
        businessId,
        name: dto.name,
        config: dto.config || dto.rules || {},
        isActive: true,
      },
      include: { game: true },
    });
  }
}
