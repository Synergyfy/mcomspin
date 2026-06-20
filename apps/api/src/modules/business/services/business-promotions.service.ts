import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreatePromotionDto } from '../dto/create-promotion.dto';
import { UpdatePromotionDto } from '../dto/update-promotion.dto';
import { CreateVoucherDto } from '../dto/create-voucher.dto';
import { GenerateQrDto } from '../dto/generate-qr.dto';

@Injectable()
export class BusinessPromotionsService {
  constructor(private prisma: PrismaService) {}

  async getSummary(businessId: string) {
    const now = new Date();
    const [activePromotions, activeEvents, activeCampaigns, totalRedemptions, totalPlays] =
      await Promise.all([
        this.prisma.promotion.count({
          where: { businessId, status: 'Active', startDate: { lte: now }, endDate: { gte: now } },
        }),
        this.prisma.event.count({
          where: {
            status: { in: ['Published', 'Ongoing'] },
            organizerId: businessId,
            organizerType: 'business',
          },
        }),
        this.prisma.campaign.count({
          where: { status: 'Active', businesses: { some: { businessId } } },
        }),
        this.prisma.promotionRedemption.count({
          where: { promotion: { businessId } },
        }),
        this.prisma.gameSession.count({
          where: { config: { businessId } },
        }),
      ]);

    const qrCount = await this.prisma.qLink.count({ where: { businessId, isActive: true } });
    const voucherCount = await this.prisma.voucher.count({ where: { businessId, status: 'Active' } });

    return {
      activePromotions,
      activeEvents,
      activeCampaigns,
      totalRedemptions,
      totalPlays,
      qrCount,
      voucherCount,
    };
  }

  async getPromotions(
    businessId: string,
    query: { status?: string; type?: string; page?: number; limit?: number },
  ) {
    const { status, type, page = 1, limit = 20 } = query;
    const where: any = { businessId, deletedAt: null };
    if (status) where.status = status;
    if (type) where.type = type;

    const [data, total] = await Promise.all([
      this.prisma.promotion.findMany({
        where,
        include: { _count: { select: { redemptions: true, products: true } } },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.promotion.count({ where }),
    ]);

    return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
  }

  async createPromotion(businessId: string, dto: CreatePromotionDto) {
    return this.prisma.promotion.create({
      data: {
        businessId,
        name: dto.name,
        description: dto.description,
        type: dto.type,
        status: 'Draft',
        discountType: dto.discountType,
        discountValue: dto.discountValue ? Number(dto.discountValue) : undefined,
        minPurchase: dto.minPurchase ? Number(dto.minPurchase) : undefined,
        maxDiscount: dto.maxDiscount ? Number(dto.maxDiscount) : undefined,
        startDate: new Date(dto.startDate),
        endDate: new Date(dto.endDate),
        imageUrl: dto.imageUrl,
        terms: dto.terms,
        isFeatured: dto.isFeatured ?? false,
        isBorough: dto.isBorough ?? false,
        isRotator: dto.isRotator ?? false,
        isQr: dto.isQr ?? false,
        isReward: dto.isReward ?? false,
        audience: dto.audience,
      },
    });
  }

  async updatePromotion(businessId: string, id: string, dto: UpdatePromotionDto) {
    const promotion = await this.prisma.promotion.findFirst({
      where: { id, businessId, deletedAt: null },
    });
    if (!promotion) throw new NotFoundException('Promotion not found');

    return this.prisma.promotion.update({
      where: { id },
      data: {
        ...dto,
        discountValue: dto.discountValue ? Number(dto.discountValue) : undefined,
        minPurchase: dto.minPurchase ? Number(dto.minPurchase) : undefined,
        maxDiscount: dto.maxDiscount ? Number(dto.maxDiscount) : undefined,
        startDate: dto.startDate ? new Date(dto.startDate) : undefined,
        endDate: dto.endDate ? new Date(dto.endDate) : undefined,
      },
    });
  }

  async getVouchers(
    businessId: string,
    query: { status?: string; page?: number; limit?: number },
  ) {
    const { status, page = 1, limit = 20 } = query;
    const where: any = { businessId };
    if (status) where.status = status;

    const [data, total] = await Promise.all([
      this.prisma.voucher.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.voucher.count({ where }),
    ]);

    return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
  }

  async createVoucher(businessId: string, dto: CreateVoucherDto) {
    const code = `VCH-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
    return this.prisma.voucher.create({
      data: {
        businessId,
        code,
        value: Number(dto.value),
        status: 'Active',
        metadata: { title: dto.title, type: dto.type, rules: dto.rules, distribution: dto.distribution },
        expiresAt: dto.expiresAt ? new Date(dto.expiresAt) : undefined,
      },
    });
  }

  async getQrCodes(businessId: string) {
    return this.prisma.qLink.findMany({
      where: { businessId, deletedAt: null },
      orderBy: { createdAt: 'desc' },
    });
  }

  async generateQrCode(businessId: string, dto: GenerateQrDto) {
    const code = `QR-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
    const shortUrl = `https://mcom.com/q/${code}`;

    return this.prisma.qLink.create({
      data: {
        businessId,
        type: dto.type,
        code,
        label: dto.label,
        targetId: dto.targetId,
        targetUrl: dto.targetUrl || shortUrl,
        isActive: true,
      },
    });
  }
}
