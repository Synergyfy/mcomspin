import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateRewardDto } from '../dto/create-reward.dto';
import { UpdateRewardDto } from '../dto/update-reward.dto';

@Injectable()
export class AdminRewardsService {
  constructor(private prisma: PrismaService) {}

  async findAll(query: { page?: number; limit?: number; search?: string; type?: string }) {
    const { page = 1, limit = 20, search, type } = query;
    const where: any = { deletedAt: null };

    if (search) where.name = { contains: search, mode: 'insensitive' };
    if (type) where.type = type;

    const [data, total] = await Promise.all([
      this.prisma.reward.findMany({
        where,
        include: {
          _count: { select: { inventories: true, redemptions: true } },
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.reward.count({ where }),
    ]);

    return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
  }

  async findOne(id: string) {
    const reward = await this.prisma.reward.findUnique({
      where: { id },
      include: { inventories: { include: { business: true } }, redemptions: { take: 10 } },
    });
    if (!reward) throw new NotFoundException('Reward not found');
    return reward;
  }

  async create(dto: CreateRewardDto) {
    return this.prisma.reward.create({
      data: {
        name: dto.name,
        description: dto.description,
        type: dto.type,
        value: Number(dto.value),
        currency: dto.currency,
        imageUrl: dto.imageUrl,
        isActive: dto.isActive,
        metadata: dto.metadata,
      },
    });
  }

  async update(id: string, dto: UpdateRewardDto) {
    const reward = await this.prisma.reward.findUnique({ where: { id } });
    if (!reward) throw new NotFoundException('Reward not found');

    return this.prisma.reward.update({
      where: { id },
      data: {
        ...dto,
        value: dto.value ? Number(dto.value) : undefined,
      },
    });
  }

  async remove(id: string) {
    const reward = await this.prisma.reward.findUnique({ where: { id } });
    if (!reward) throw new NotFoundException('Reward not found');

    await this.prisma.reward.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}
