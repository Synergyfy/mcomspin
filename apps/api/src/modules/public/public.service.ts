import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class PublicService {
  constructor(private prisma: PrismaService) {}

  async getBoroughs() {
    return this.prisma.borough.findMany({
      where: { isActive: true, deletedAt: null },
      include: { _count: { select: { highStreets: true } } },
      orderBy: { name: 'asc' },
    });
  }

  async getBorough(id: string) {
    const borough = await this.prisma.borough.findUnique({
      where: { id, deletedAt: null },
      include: {
        _count: { select: { highStreets: true, campaigns: true } },
        highStreets: { where: { isActive: true }, select: { id: true, name: true, slug: true } },
      },
    });
    if (!borough) throw new NotFoundException('Borough not found');
    return borough;
  }

  async getHighStreets(boroughId?: string) {
    const where: any = { isActive: true, deletedAt: null };
    if (boroughId) where.boroughId = boroughId;
    return this.prisma.highStreet.findMany({
      where,
      include: { borough: { select: { id: true, name: true } }, _count: { select: { businessLocations: true } } },
      orderBy: { name: 'asc' },
    });
  }

  async getHighStreet(id: string) {
    const hs = await this.prisma.highStreet.findUnique({
      where: { id, deletedAt: null },
      include: {
        borough: { select: { id: true, name: true } },
        businessLocations: {
          where: { isActive: true, business: { isActive: true } },
          include: { business: { select: { id: true, name: true, slug: true, logoUrl: true, isOpen: true } } },
        },
      },
    });
    if (!hs) throw new NotFoundException('High street not found');
    return hs;
  }

  async getBusinesses(query: { search?: string; boroughId?: string; category?: string; page?: number; limit?: number }) {
    const { search, boroughId, category, page = 1, limit = 20 } = query;
    const where: any = { isActive: true, deletedAt: null };
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }
    if (boroughId) where.businessLocations = { some: { location: { boroughId } } };
    if (category) where.businessCategoryAssignments = { some: { category: { name: { equals: category, mode: 'insensitive' } } } };

    const [data, total] = await Promise.all([
      this.prisma.business.findMany({
        where,
        select: {
          id: true, name: true, slug: true, logoUrl: true, coverImageUrl: true,
          shortDescription: true, isOpen: true, contactEmail: true, contactPhone: true,
          _count: { select: { promotions: { where: { status: 'Active' } } } },
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: [{ isOpen: 'desc' }, { name: 'asc' }],
      }),
      this.prisma.business.count({ where }),
    ]);
    return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
  }

  async getBusiness(id: string) {
    const business = await this.prisma.business.findUnique({
      where: { id, isActive: true, deletedAt: null },
      select: {
        id: true, name: true, slug: true, logoUrl: true, coverImageUrl: true,
        shortDescription: true, description: true, isOpen: true, contactEmail: true,
        contactPhone: true, websiteUrl: true, socialLinks: true,
        businessLocations: {
          where: { isActive: true },
          select: { id: true, name: true, addressLine1: true, addressLine2: true, city: true, postcode: true, latitude: true, longitude: true, isPrimary: true },
        },
        _count: { select: { promotions: true, campaigns: true } },
      },
    });
    if (!business) throw new NotFoundException('Business not found');
    return business;
  }

  async getCampaigns(query: { page?: number; limit?: number; boroughId?: string }) {
    const { page = 1, limit = 20, boroughId } = query;
    const where: any = { status: 'Active', isPublic: true, deletedAt: null };
    if (boroughId) where.targets = { some: { boroughId } };

    const [data, total] = await Promise.all([
      this.prisma.campaign.findMany({
        where,
        include: {
          businesses: { include: { business: { select: { id: true, name: true, logoUrl: true, slug: true } } } },
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

  async getCampaign(id: string) {
    const campaign = await this.prisma.campaign.findUnique({
      where: { id, deletedAt: null },
      include: {
        businesses: { include: { business: { select: { id: true, name: true, slug: true, logoUrl: true } } } },
        rewards: true,
      },
    });
    if (!campaign) throw new NotFoundException('Campaign not found');
    return campaign;
  }

  async getPromotions(query: { page?: number; limit?: number; type?: string; boroughId?: string }) {
    const { page = 1, limit = 20, type, boroughId } = query;
    const where: any = { status: 'Active', deletedAt: null };
    if (type) where.type = type;
    if (boroughId) where.business = { businessLocations: { some: { location: { boroughId } } } };

    const [data, total] = await Promise.all([
      this.prisma.promotion.findMany({
        where,
        include: { business: { select: { id: true, name: true, slug: true, logoUrl: true } } },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.promotion.count({ where }),
    ]);
    return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
  }

  async getPromotionsNearby(latitude: number, longitude: number, radius = 5) {
    const dLat = radius / 111.32;
    const dLon = radius / (111.32 * Math.max(Math.cos((latitude * Math.PI) / 180), 0.01));

    const locations = await this.prisma.businessLocation.findMany({
      where: {
        isActive: true,
        latitude: { not: null, gte: latitude - dLat, lte: latitude + dLat },
        longitude: { not: null, gte: longitude - dLon, lte: longitude + dLon },
        business: { isActive: true, deletedAt: null, promotions: { some: { status: 'Active' } } },
      },
      include: {
        business: {
          select: { id: true, name: true, slug: true, logoUrl: true },
          include: { promotions: { where: { status: 'Active' }, take: 5 } },
        },
      },
    });

    const earthRadiusKm = 6371;
    const latRad = (latitude * Math.PI) / 180;
    const lonRad = (longitude * Math.PI) / 180;

    const withDistance = locations
      .map((loc) => {
        const locLatRad = (loc.latitude! * Math.PI) / 180;
        const locLonRad = (loc.longitude! * Math.PI) / 180;
        const a = Math.sin((locLatRad - latRad) / 2) ** 2 +
          Math.cos(latRad) * Math.cos(locLatRad) * Math.sin((locLonRad - lonRad) / 2) ** 2;
        const distance = earthRadiusKm * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return { ...loc, distance: Math.round(distance * 100) / 100 };
      })
      .filter((loc) => loc.distance <= radius)
      .sort((a, b) => a.distance - b.distance);

    return withDistance.map((loc) => ({
      business: loc.business,
      distance: loc.distance,
      promotions: loc.business.promotions,
    }));
  }

  async getEvents(query: { page?: number; limit?: number; type?: string }) {
    const { page = 1, limit = 20, type } = query;
    const where: any = { status: 'Published', startDate: { gte: new Date() }, deletedAt: null };
    if (type) where.type = type;

    const [data, total] = await Promise.all([
      this.prisma.event.findMany({
        where,
        include: { _count: { select: { registrations: true } }, location: true },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { startDate: 'asc' },
      }),
      this.prisma.event.count({ where }),
    ]);
    return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
  }

  async getEvent(id: string) {
    const event = await this.prisma.event.findUnique({
      where: { id, deletedAt: null },
      include: { _count: { select: { registrations: true } }, location: true },
    });
    if (!event) throw new NotFoundException('Event not found');
    return event;
  }

  async getEventsNearby(latitude: number, longitude: number, radius = 5) {
    const events = await this.prisma.event.findMany({
      where: {
        status: 'Published',
        startDate: { gte: new Date() },
        deletedAt: null,
        location: { latitude: { not: null }, longitude: { not: null } },
      },
      include: { location: true, _count: { select: { registrations: true } } },
      orderBy: { startDate: 'asc' },
    });

    const earthRadiusKm = 6371;
    const latRad = (latitude * Math.PI) / 180;
    const lonRad = (longitude * Math.PI) / 180;

    return events
      .filter((e) => e.location?.latitude && e.location?.longitude)
      .map((e) => {
        const locLatRad = (e.location!.latitude! * Math.PI) / 180;
        const locLonRad = (e.location!.longitude! * Math.PI) / 180;
        const a = Math.sin((locLatRad - latRad) / 2) ** 2 +
          Math.cos(latRad) * Math.cos(locLatRad) * Math.sin((locLonRad - lonRad) / 2) ** 2;
        const distance = earthRadiusKm * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return { ...e, distance: Math.round(distance * 100) / 100 };
      })
      .filter((e) => e.distance <= radius)
      .sort((a, b) => a.distance - b.distance);
  }

  async getRewards(query: { page?: number; limit?: number }) {
    const { page = 1, limit = 20 } = query;
    const where: any = { isActive: true, deletedAt: null };
    const [data, total] = await Promise.all([
      this.prisma.reward.findMany({
        where,
        include: {
          _count: { select: { redemptions: true } },
          inventories: { include: { business: { select: { id: true, name: true, logoUrl: true } } }, take: 3 },
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.reward.count({ where }),
    ]);
    return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
  }

  async getLeaderboard(limit = 20) {
    const topSessions = await this.prisma.gameSession.groupBy({
      by: ['customerId'],
      _count: { id: true },
      _sum: { score: true },
      orderBy: { _sum: { score: 'desc' } },
      take: limit,
    });
    const customerIds = topSessions.map((s) => s.customerId);
    const customers = await this.prisma.user.findMany({
      where: { id: { in: customerIds } },
      select: { id: true, firstName: true, lastName: true, avatarUrl: true },
    });
    const customerMap = new Map(customers.map((c) => [c.id, c]));
    return topSessions.map((s) => ({
      customer: customerMap.get(s.customerId) || null,
      gamesPlayed: s._count.id,
      totalScore: s._sum.score || 0,
    }));
  }
}
