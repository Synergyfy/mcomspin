import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class CustomerPromotionsService {
  constructor(private prisma: PrismaService) {}

  async redeem(customerId: string, promotionId: string) {
    const promotion = await this.prisma.promotion.findUnique({
      where: { id: promotionId, deletedAt: null },
      include: { business: { select: { id: true, name: true } } },
    });
    if (!promotion) throw new NotFoundException('Promotion not found');
    if (promotion.status !== 'Active') throw new BadRequestException('Promotion is not active');
    if (new Date() < promotion.startDate || new Date() > promotion.endDate) {
      throw new BadRequestException('Promotion is not currently valid');
    }

    if (promotion.usageLimit && promotion.usageCount >= promotion.usageLimit) {
      throw new BadRequestException('Promotion usage limit reached');
    }

    if (promotion.perCustomerLimit) {
      const customerUsage = await this.prisma.promotionRedemption.count({
        where: { promotionId, customerId },
      });
      if (customerUsage >= promotion.perCustomerLimit) {
        throw new BadRequestException('You have reached the maximum redemptions for this promotion');
      }
    }

    const [redemption] = await this.prisma.$transaction([
      this.prisma.promotionRedemption.create({
        data: { promotionId, customerId },
      }),
      this.prisma.promotion.update({
        where: { id: promotionId },
        data: { usageCount: { increment: 1 } },
      }),
    ]);
    return redemption;
  }
}
