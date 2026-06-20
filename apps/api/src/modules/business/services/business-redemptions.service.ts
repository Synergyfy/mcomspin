import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class BusinessRedemptionsService {
  constructor(private prisma: PrismaService) {}

  async findAll(businessId: string, query: { page?: number; limit?: number; status?: string }) {
    const { page = 1, limit = 20, status } = query;
    const where: any = { reward: { inventories: { some: { businessId } } } };

    if (status === 'pending') where.usedAt = null;
    if (status === 'redeemed') where.usedAt = { not: null };

    const [data, total] = await Promise.all([
      this.prisma.customerReward.findMany({
        where,
        include: {
          customer: { select: { id: true, firstName: true, lastName: true, email: true } },
          reward: { select: { id: true, name: true, type: true, value: true } },
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { earnedAt: 'desc' },
      }),
      this.prisma.customerReward.count({ where }),
    ]);

    return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
  }

  async approve(businessId: string, id: string) {
    const customerReward = await this.prisma.customerReward.findUnique({
      where: { id },
      include: { reward: { include: { inventories: { where: { businessId } } } } },
    });
    if (!customerReward) throw new NotFoundException('Redemption not found');
    if (customerReward.usedAt) throw new BadRequestException('Already redeemed');

    return this.prisma.customerReward.update({
      where: { id },
      data: { usedAt: new Date() },
    });
  }
}
