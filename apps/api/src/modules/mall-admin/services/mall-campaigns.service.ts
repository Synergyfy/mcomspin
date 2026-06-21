import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class MallCampaignsService {
  constructor(private prisma: PrismaService) {}

  async findAll(query: { status?: string; search?: string; boroughId?: string; page?: number; limit?: number }) {
    const { status, search, boroughId, page = 1, limit = 20 } = query;
    const where: any = { deletedAt: null };
    if (status) where.status = status;
    if (search) where.name = { contains: search, mode: 'insensitive' };
    if (boroughId) where.targets = { some: { boroughId } };

    const [data, total] = await Promise.all([
      this.prisma.campaign.findMany({
        where,
        include: {
          _count: { select: { businesses: true, rewards: true } },
          targets: { include: { borough: { select: { id: true, name: true } } } },
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
    const campaign = await this.prisma.campaign.findUnique({
      where: { id },
      include: {
        businesses: { include: { business: { select: { id: true, name: true, logoUrl: true, slug: true } } } },
        rewards: true,
        targets: { include: { borough: { select: { id: true, name: true } } } },
        _count: { select: { promotions: true } },
      },
    });
    if (!campaign) throw new NotFoundException('Campaign not found');
    return campaign;
  }

  async create(dto: any) {
    const { targetBoroughIds, ...data } = dto;
    return this.prisma.campaign.create({
      data: {
        name: data.name,
        description: data.description,
        type: data.type,
        status: data.status || 'Draft',
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate),
        budget: data.budget ? Number(data.budget) : undefined,
        imageUrl: data.imageUrl,
        terms: data.terms,
        isPublic: data.isPublic !== false,
        targets: targetBoroughIds ? {
          create: targetBoroughIds.map((boroughId: string) => ({ boroughId })),
        } : undefined,
      },
    });
  }

  async update(id: string, dto: any) {
    const campaign = await this.prisma.campaign.findUnique({ where: { id } });
    if (!campaign) throw new NotFoundException('Campaign not found');
    return this.prisma.campaign.update({
      where: { id },
      data: {
        ...dto,
        startDate: dto.startDate ? new Date(dto.startDate) : undefined,
        endDate: dto.endDate ? new Date(dto.endDate) : undefined,
        budget: dto.budget ? Number(dto.budget) : undefined,
      },
    });
  }
}
