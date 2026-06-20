import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateCampaignDto } from '../../admin/dto/create-campaign.dto';
import { UpdateCampaignDto } from '../../admin/dto/update-campaign.dto';

@Injectable()
export class BusinessCampaignsService {
  constructor(private prisma: PrismaService) {}

  async findAll(businessId: string, query: { status?: string; page?: number; limit?: number }) {
    const { status, page = 1, limit = 20 } = query;
    const where: any = {
      deletedAt: null,
      businesses: { some: { businessId } },
    };
    if (status) where.status = status;

    const [data, total] = await Promise.all([
      this.prisma.campaign.findMany({
        where,
        include: { _count: { select: { rewards: true } } },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.campaign.count({ where }),
    ]);

    return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
  }

  async findOne(businessId: string, id: string) {
    const campaign = await this.prisma.campaign.findFirst({
      where: { id, businesses: { some: { businessId } } },
      include: { rewards: true, targets: true },
    });
    if (!campaign) throw new NotFoundException('Campaign not found');
    return campaign;
  }

  async create(businessId: string, dto: CreateCampaignDto) {
    const campaign = await this.prisma.campaign.create({
      data: {
        name: dto.name,
        description: dto.description,
        type: dto.type,
        status: 'Draft',
        startDate: new Date(dto.startDate),
        endDate: new Date(dto.endDate),
        budget: dto.budget ? Number(dto.budget) : undefined,
        imageUrl: dto.imageUrl,
        terms: dto.terms,
        isPublic: dto.isPublic ?? true,
        businesses: { create: { businessId } },
      },
    });

    return campaign;
  }

  async update(businessId: string, id: string, dto: UpdateCampaignDto) {
    const campaign = await this.prisma.campaign.findFirst({
      where: { id, businesses: { some: { businessId } } },
    });
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

  async remove(businessId: string, id: string) {
    const campaign = await this.prisma.campaign.findFirst({
      where: { id, businesses: { some: { businessId } } },
    });
    if (!campaign) throw new NotFoundException('Campaign not found');

    await this.prisma.campaign.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}
