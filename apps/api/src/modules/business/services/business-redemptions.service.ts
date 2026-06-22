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

    // Normalise into the shape the frontend customer-rewards page reads
    const normalised = data.map((cr) => {
      const meta = (cr.metadata as Record<string, unknown>) ?? {};
      let computedStatus: string;
      if (meta.rejectedAt) {
        computedStatus = 'Rejected';
      } else if (cr.expiresAt && new Date(cr.expiresAt) < new Date() && !cr.usedAt) {
        computedStatus = 'Expired';
      } else if (cr.usedAt) {
        computedStatus = 'Redeemed';
      } else {
        computedStatus = 'Pending';
      }

      return {
        id: cr.id,
        customerName:
          [cr.customer?.firstName, cr.customer?.lastName].filter(Boolean).join(' ') ||
          cr.customer?.email ||
          'Unknown',
        rewardName: cr.reward?.name ?? 'Reward',
        code: cr.id.slice(0, 8).toUpperCase(),
        timestamp: new Date(cr.earnedAt).toLocaleString('en-GB', {
          day: 'numeric',
          month: 'short',
          hour: '2-digit',
          minute: '2-digit',
        }),
        status: computedStatus,
        expiresAt: cr.expiresAt,
        earnedAt: cr.earnedAt,
      };
    });

    return { data: normalised, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
  }

  private async verifyBusinessOwnership(customerRewardId: string, businessId: string) {
    const customerReward = await this.prisma.customerReward.findUnique({
      where: { id: customerRewardId },
      include: { reward: { include: { inventories: { where: { businessId } }, } } },
    });
    if (!customerReward) throw new NotFoundException('Redemption not found');
    if (!customerReward.reward.inventories.length) {
      throw new BadRequestException('Reward is not available at this business');
    }
    return customerReward;
  }

  async approve(businessId: string, id: string) {
    const customerReward = await this.verifyBusinessOwnership(id, businessId);
    if (customerReward.usedAt) throw new BadRequestException('Already redeemed');
    const meta = (customerReward.metadata as Record<string, unknown>) ?? {};
    if (meta.rejectedAt) throw new BadRequestException('Already rejected');

    return this.prisma.customerReward.update({
      where: { id },
      data: { usedAt: new Date() },
    });
  }

  async reject(businessId: string, id: string) {
    const customerReward = await this.verifyBusinessOwnership(id, businessId);
    if (customerReward.usedAt) throw new BadRequestException('Already redeemed');
    const meta = (customerReward.metadata as Record<string, unknown>) ?? {};
    if (meta.rejectedAt) throw new BadRequestException('Already rejected');

    return this.prisma.customerReward.update({
      where: { id },
      data: {
        metadata: {
          ...(customerReward.metadata as object),
          rejectedAt: new Date().toISOString(),
        },
      },
    });
  }
}
