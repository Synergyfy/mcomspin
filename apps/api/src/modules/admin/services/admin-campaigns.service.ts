import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateCampaignDto } from '../dto/create-campaign.dto';
import { UpdateCampaignDto } from '../dto/update-campaign.dto';

@Injectable()
export class AdminCampaignsService {
  constructor(private prisma: PrismaService) {}

  async findAll(query: { status?: string; search?: string; page?: number; limit?: number }) {
    const { status, search, page = 1, limit = 20 } = query;
    const where: any = { deletedAt: null };

    if (status) where.status = status;
    if (search) where.name = { contains: search, mode: 'insensitive' };

    const [data, total] = await Promise.all([
      this.prisma.campaign.findMany({
        where,
        include: {
          _count: { select: { businesses: true, rewards: true } },
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
        businesses: { include: { business: true } },
        rewards: true,
        targets: true,
        _count: { select: { promotions: true } },
      },
    });
    if (!campaign) throw new NotFoundException('Campaign not found');
    return campaign;
  }

  async create(dto: CreateCampaignDto) {
    return this.prisma.campaign.create({
      data: {
        name: dto.name,
        description: dto.description,
        type: dto.type,
        status: dto.status,
        startDate: new Date(dto.startDate),
        endDate: new Date(dto.endDate),
        budget: dto.budget ? Number(dto.budget) : undefined,
        imageUrl: dto.imageUrl,
        terms: dto.terms,
        isPublic: dto.isPublic,
        metadata: dto.metadata,
      },
    });
  }

  async update(id: string, dto: UpdateCampaignDto) {
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

  async remove(id: string) {
    const campaign = await this.prisma.campaign.findUnique({ where: { id } });
    if (!campaign) throw new NotFoundException('Campaign not found');

    await this.prisma.campaign.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}
