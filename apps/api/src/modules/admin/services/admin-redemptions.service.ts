import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { RedemptionAction } from '../dto/redemption-action.dto';

@Injectable()
export class AdminRedemptionsService {
  constructor(private prisma: PrismaService) {}

  async findAll(query: { page?: number; limit?: number; status?: string }) {
    const { page = 1, limit = 20, status } = query;
    const where: any = {};

    if (status) {
      switch (status) {
        case 'pending': where.usedAt = null; break;
        case 'redeemed': where.usedAt = { not: null }; break;
        case 'expired': where.expiresAt = { lte: new Date() }; break;
      }
    }

    const [data, total] = await Promise.all([
      this.prisma.customerReward.findMany({
        where,
        include: {
          customer: { select: { id: true, firstName: true, lastName: true, email: true } },
          reward: true,
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { earnedAt: 'desc' },
      }),
      this.prisma.customerReward.count({ where }),
    ]);

    return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
  }

  async update(id: string, dto: { action: RedemptionAction }) {
    const customerReward = await this.prisma.customerReward.findUnique({ where: { id } });
    if (!customerReward) throw new NotFoundException('Redemption not found');

    if (dto.action === RedemptionAction.Approve) {
      return this.prisma.customerReward.update({
        where: { id },
        data: { usedAt: new Date() },
      });
    }

    return customerReward;
  }
}
