import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CustomerRedeemDto } from '../dto/customer-redeem.dto';

@Injectable()
export class CustomerRewardsService {
  constructor(private prisma: PrismaService) {}

  async findOne(customerId: string, id: string) {
    const customerReward = await this.prisma.customerReward.findFirst({
      where: { id, customerId },
      include: { reward: { include: { inventories: { include: { business: { select: { id: true, name: true, logoUrl: true } } }, take: 1 } } } },
    });
    if (!customerReward) throw new NotFoundException('Reward not found');

    const code = `MCS-${customerReward.reward.name.substring(0, 3).toUpperCase()}-${customerReward.id.slice(0, 8)}`;

    return {
      id: customerReward.id,
      reward: customerReward.reward,
      earnedAt: customerReward.earnedAt,
      expiresAt: customerReward.expiresAt,
      status: customerReward.usedAt ? 'redeemed' : (customerReward.expiresAt && customerReward.expiresAt < new Date() ? 'expired' : 'active'),
      business: customerReward.reward.inventories[0]?.business ?? null,
      qrData: code,
      voucherCode: code,
    };
  }

  async findAll(customerId: string) {
    const rewards = await this.prisma.customerReward.findMany({
      where: { customerId },
      include: { reward: { include: { inventories: { include: { business: { select: { id: true, name: true, logoUrl: true } } }, take: 1 } } } },
      orderBy: { earnedAt: 'desc' },
    });

    const now = new Date();
    const categorized = {
      available: [] as any[],
      redeemed: [] as any[],
      expired: [] as any[],
    };

    for (const cr of rewards) {
      const item = {
        id: cr.id,
        reward: cr.reward,
        earnedAt: cr.earnedAt,
        expiresAt: cr.expiresAt,
        status: cr.usedAt ? 'redeemed' : (cr.expiresAt && cr.expiresAt < now ? 'expired' : 'active'),
      };
      if (cr.usedAt) categorized.redeemed.push(item);
      else if (cr.expiresAt && cr.expiresAt < now) categorized.expired.push(item);
      else categorized.available.push(item);
    }

    return categorized;
  }

  async redeem(customerId: string, dto: CustomerRedeemDto) {
    const customerReward = await this.prisma.customerReward.findFirst({
      where: { id: dto.rewardId, customerId },
      include: { reward: { include: { inventories: { include: { business: true }, take: 1 } } } },
    });
    if (!customerReward) throw new NotFoundException('Reward not found');
    if (customerReward.usedAt) throw new BadRequestException('Reward already redeemed');
    if (customerReward.expiresAt && customerReward.expiresAt < new Date()) {
      throw new BadRequestException('Reward has expired');
    }

    const inventory = customerReward.reward.inventories[0];
    const businessId = inventory?.businessId;

    await this.prisma.$transaction(async (tx) => {
      await tx.customerReward.update({
        where: { id: customerReward.id },
        data: { usedAt: new Date() },
      });

      await tx.rewardRedemption.create({
        data: {
          rewardId: customerReward.rewardId,
          customerId,
          businessId: businessId ?? undefined,
        },
      });

      if (inventory) {
        await tx.rewardInventory.update({
          where: { id: inventory.id },
          data: { usedStock: { increment: 1 } },
        });
      }

      await tx.customerActivityLog.create({
        data: {
          customerId,
          activityType: 'Redeem',
          description: `Redeemed ${customerReward.reward.name}`,
          entityType: 'CustomerReward',
          entityId: customerReward.id,
        },
      });
    });

    const code = `MCS-${customerReward.reward.name.substring(0, 3).toUpperCase()}-${customerReward.id.slice(0, 8)}`;

    return {
      id: customerReward.id,
      reward: customerReward.reward,
      method: dto.method,
      code: dto.method === 'code' ? code : null,
      qrCode: dto.method === 'qr' ? code : null,
      expiredAt: customerReward.expiresAt,
      businessId,
    };
  }

  async history(customerId: string) {
    const redemptions = await this.prisma.rewardRedemption.findMany({
      where: { customerId },
      include: { reward: true },
      orderBy: { redeemedAt: 'desc' },
    });

    return redemptions;
  }
}
