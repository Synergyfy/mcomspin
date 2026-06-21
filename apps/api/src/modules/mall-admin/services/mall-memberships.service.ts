import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class MallMembershipsService {
  constructor(private prisma: PrismaService) {}

  async getMemberships(query: { tier?: string; page?: number; limit?: number }) {
    const { tier, page = 1, limit = 20 } = query;
    const where: any = {};
    if (tier) where.tier = tier;

    const [items, total] = await Promise.all([
      this.prisma.businessMembership.findMany({
        where,
        include: { business: { select: { name: true } } },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.businessMembership.count({ where }),
    ]);
    return { data: items, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  }

  async updateMembership(id: string, dto: { tier?: string; isActive?: boolean; expiresAt?: string }) {
    const membership = await this.prisma.businessMembership.findUnique({ where: { id } });
    if (!membership) throw new NotFoundException('Membership not found');
    const data: any = {};
    if (dto.tier) data.tier = dto.tier;
    if (dto.isActive !== undefined) data.isActive = dto.isActive;
    if (dto.expiresAt) data.expiresAt = new Date(dto.expiresAt);
    return this.prisma.businessMembership.update({ where: { id }, data });
  }

  async getAudits(query: { page?: number; limit?: number }) {
    const { page = 1, limit = 20 } = query;
    const [items, total] = await Promise.all([
      this.prisma.audit.findMany({
        include: { business: { select: { name: true } } },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.audit.count(),
    ]);
    return { data: items, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  }

  async getRecommendations(query: { page?: number; limit?: number }) {
    const { page = 1, limit = 20 } = query;
    const [items, total] = await Promise.all([
      this.prisma.auditRecommendation.findMany({
        include: { business: { select: { name: true } } },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.auditRecommendation.count(),
    ]);
    return { data: items, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  }
}
