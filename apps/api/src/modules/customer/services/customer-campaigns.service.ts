import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class CustomerCampaignsService {
  constructor(private prisma: PrismaService) {}

  async findAll(query: { page?: number; limit?: number; status?: string; borough?: string }) {
    const { page = 1, limit = 20, status, borough } = query;
    const where: any = { isPublic: true, deletedAt: null };
    if (status) where.status = status;
    else where.status = 'Active';
    if (borough) {
      where.businesses = {
        some: { business: { businessLocations: { some: { location: { borough: { name: { equals: borough, mode: 'insensitive' } } } } } } },
      };
    }

    const [rawData, total] = await Promise.all([
      this.prisma.campaign.findMany({
        where,
        include: {
          businesses: {
            include: {
              business: {
                select: {
                  id: true,
                  name: true,
                  logoUrl: true,
                  slug: true,
                  games: {
                    where: { isActive: true },
                  },
                },
              },
            },
          },
          rewards: true,
          gameCampaigns: {
            where: { isActive: true },
            include: {
              game: true,
            },
            take: 1,
          },
          _count: { select: { rewards: true } },
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.campaign.count({ where }),
    ]);

    const data = rawData.map((campaign) => {
      const primaryBusiness = campaign.businesses[0]?.business;
      const gameCampaign = campaign.gameCampaigns[0];
      const gameConfig = primaryBusiness?.games?.find((g: any) => g.gameId === gameCampaign?.gameId);
      const boxes = ((gameConfig?.config as any)?.boxes ?? []) as any[];
      const prizeBoxes = boxes.filter((b: any) => b.hasReward);

      return {
        id: campaign.id,
        name: campaign.name,
        description: campaign.description,
        imageUrl: campaign.imageUrl,
        businessId: primaryBusiness?.id ?? null,
        businessName: primaryBusiness?.name ?? 'MCOM Partner',
        businessLogo: primaryBusiness?.logoUrl ?? null,
        businessCategory: primaryBusiness?.name?.includes('Tech') ? 'Technology' : primaryBusiness?.name?.includes('Kitchen') || primaryBusiness?.name?.includes('Food') ? 'Food & Dining' : primaryBusiness?.name?.includes('Style') || primaryBusiness?.name?.includes('Fashion') ? 'Fashion' : 'General',
        gameId: gameCampaign?.game?.id ?? null,
        gameName: gameCampaign?.game?.name ?? null,
        boxCount: boxes.length || 8,
        prizes: prizeBoxes.map((b: any, i: number) => ({
          title: b.label || `Prize ${i + 1}`,
          value: b.rewardValue ? `${b.rewardValue}` : 'Free',
          type: (b.rewardType || 'voucher').toLowerCase(),
          rarity: b.rarity || (i === 0 ? 'legendary' : i < 3 ? 'rare' : 'common'),
          details: b.label || 'Mystery reward',
          image: b.imageUrl || undefined,
        })),
      };
    });

    return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
  }

  async findOne(id: string) {
    const campaign = await this.prisma.campaign.findFirst({
      where: { id, isPublic: true, deletedAt: null },
      include: {
        businesses: { include: { business: { select: { id: true, name: true, slug: true, logoUrl: true, description: true, contactPhone: true, contactEmail: true } } } },
        rewards: true,
        targets: true,
      },
    });
    if (!campaign) throw new NotFoundException('Campaign not found');
    return campaign;
  }
}
