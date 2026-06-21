import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class BusinessRewardsService {
  constructor(private prisma: PrismaService) {}

  async findAll(businessId: string, query: { page?: number; limit?: number; type?: string }) {
    const { page = 1, limit = 20, type } = query;
    const where: any = { inventories: { some: { businessId } } };
    if (type) where.type = type;

    const [data, total] = await Promise.all([
      this.prisma.reward.findMany({
        where,
        include: {
          inventories: { where: { businessId } },
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.reward.count({ where }),
    ]);

    return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
  }

  async findOne(businessId: string, id: string) {
    const reward = await this.prisma.reward.findFirst({
      where: { id, inventories: { some: { businessId } } },
      include: { inventories: { where: { businessId } } },
    });
    if (!reward) throw new NotFoundException('Reward not found');
    return reward;
  }

  async create(businessId: string, dto: any) {
    const reward = await this.prisma.reward.create({
      data: {
        name: dto.name,
        description: dto.description,
        type: dto.type,
        value: dto.value ? Number(dto.value) : 0,
        currency: dto.currency,
        imageUrl: dto.imageUrl,
        inventories: {
          create: {
            businessId,
            totalStock: dto.totalStock ?? 100,
            lowStockThreshold: dto.lowStockThreshold ?? 5,
          },
        },
      },
    });

    return reward;
  }

  async update(businessId: string, id: string, dto: any) {
    const reward = await this.prisma.reward.findFirst({
      where: { id, inventories: { some: { businessId } } },
    });
    if (!reward) throw new NotFoundException('Reward not found');

    return this.prisma.reward.update({
      where: { id },
      data: { name: dto.name, description: dto.description, isActive: dto.isActive },
    });
  }

  async remove(businessId: string, id: string) {
    const reward = await this.prisma.reward.findFirst({
      where: { id, inventories: { some: { businessId } } },
    });
    if (!reward) throw new NotFoundException('Reward not found');

    await this.prisma.reward.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}
