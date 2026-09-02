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

  async searchBusinesses(query: {
    search?: string;
    category?: string;
    borough?: string;
    page?: number;
    limit?: number;
  }) {
    const { search, category, borough, page = 1, limit = 20 } = query;
    const where: any = { isActive: true, deletedAt: null };
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { shortDescription: { contains: search, mode: 'insensitive' } },
        { tags: { some: { tag: { name: { contains: search, mode: 'insensitive' } } } } },
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
          businessCategoryAssignments: {
            select: { category: { select: { name: true } } },
            take: 3,
          },
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: [{ isOpen: 'desc' }, { createdAt: 'desc' }],
      }),
      this.prisma.business.count({ where }),
    ]);
    return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
  }

  async nearbyBusinesses(query: {
    latitude: number;
    longitude: number;
    radius?: number;
    page?: number;
    limit?: number;
  }) {
    const { latitude, longitude, radius = 5, page = 1, limit = 20 } = query;
    const earthRadiusKm = 6371;
    const latRad = (latitude * Math.PI) / 180;
    const lonRad = (longitude * Math.PI) / 180;
    const dLat = radius / 111.32;
    const dLon = radius / (111.32 * Math.max(Math.cos(latRad), 0.01));

    const locations = await this.prisma.businessLocation.findMany({
      where: {
        isActive: true,
        latitude: { not: null, gte: latitude - dLat, lte: latitude + dLat },
        longitude: { not: null, gte: longitude - dLon, lte: longitude + dLon },
        business: { isActive: true, deletedAt: null },
      },
      include: {
        business: {
          select: {
            id: true, name: true, slug: true, logoUrl: true, coverImageUrl: true,
            shortDescription: true, isOpen: true,
          },
        },
      },
    });

    const withDistance = locations
      .filter((loc) => loc.latitude !== null && loc.longitude !== null)
      .map((loc) => {
        const locLatRad = (loc.latitude! * Math.PI) / 180;
        const locLonRad = (loc.longitude! * Math.PI) / 180;
        const dlat = locLatRad - latRad;
        const dlon = locLonRad - lonRad;
        const a =
          Math.sin(dlat / 2) ** 2 +
          Math.cos(latRad) * Math.cos(locLatRad) * Math.sin(dlon / 2) ** 2;
        const distance = earthRadiusKm * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return { ...loc, distance: Math.round(distance * 100) / 100 };
      })
      .filter((loc) => loc.distance <= radius)
      .sort((a, b) => a.distance - b.distance);

    const start = (page - 1) * limit;
    const paged = withDistance.slice(start, start + limit);

    const seen = new Set<string>();
    const data = paged
      .filter((loc) => {
        if (seen.has(loc.business.id)) return false;
        seen.add(loc.business.id);
        return true;
      })
      .map((loc) => ({
        business: loc.business,
        distance: loc.distance,
        location: { name: loc.name, addressLine1: loc.addressLine1, city: loc.city, latitude: loc.latitude, longitude: loc.longitude },
      }));

    return { data, meta: { total: withDistance.length, page, limit, totalPages: Math.ceil(withDistance.length / limit) } };
  }
}
