import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class CustomerDiscoverService {
  constructor(private prisma: PrismaService) {}

  async discover(query: {
    type?: 'campaigns' | 'businesses' | 'rewards';
    category?: string;
    borough?: string;
    search?: string;
    page?: number;
    limit?: number;
  }) {
    const { type = 'campaigns', category, borough, search, page = 1, limit = 20 } = query;
    const skip = (page - 1) * limit;

    if (type === 'businesses') {
      const where: any = { isActive: true, deletedAt: null };
      if (search) {
        where.OR = [
          { name: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
        ];
      }
      if (category) {
        where.businessCategoryAssignments = {
          some: { category: { name: { equals: category, mode: 'insensitive' } } },
        };
      }
      if (borough) {
        where.businessLocations = {
          some: { location: { borough: { name: { equals: borough, mode: 'insensitive' } } } },
        };
      }

      const [data, total] = await Promise.all([
        this.prisma.business.findMany({
          where,
          select: {
            id: true, name: true, slug: true, logoUrl: true, coverImageUrl: true,
            shortDescription: true, isOpen: true,
          },
          skip,
          take: limit,
          orderBy: { createdAt: 'desc' },
        }),
        this.prisma.business.count({ where }),
      ]);
      return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
    }

    if (type === 'rewards') {
      const where: any = { isActive: true, deletedAt: null };
      if (search) where.name = { contains: search, mode: 'insensitive' };

      const [data, total] = await Promise.all([
        this.prisma.reward.findMany({
          where,
          include: { inventories: { include: { business: { select: { id: true, name: true, logoUrl: true } } }, take: 1 } },
          skip,
          take: limit,
          orderBy: { createdAt: 'desc' },
        }),
        this.prisma.reward.count({ where }),
      ]);
      return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
    }

    const where: any = { status: 'Active', isPublic: true, deletedAt: null };
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }
    if (borough) {
      where.businesses = { some: { business: { businessLocations: { some: { location: { borough: { name: { equals: borough, mode: 'insensitive' } } } } } } } };
    }

    const [data, total] = await Promise.all([
      this.prisma.campaign.findMany({
        where,
        include: {
          businesses: { include: { business: { select: { id: true, name: true, logoUrl: true, slug: true } } } },
          _count: { select: { rewards: true } },
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.campaign.count({ where }),
    ]);
    return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
  }
}
