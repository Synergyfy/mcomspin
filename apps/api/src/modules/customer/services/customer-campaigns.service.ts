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

    const [data, total] = await Promise.all([
      this.prisma.campaign.findMany({
        where,
        include: {
          businesses: { include: { business: { select: { id: true, name: true, logoUrl: true, slug: true } } } },
          rewards: true,
          _count: { select: { rewards: true } },
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.campaign.count({ where }),
    ]);

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
