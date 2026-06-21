import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import * as crypto from 'crypto';

@Injectable()
export class MallMarketingService {
  constructor(private prisma: PrismaService) {}

  async getPromotions(query: { status?: string; type?: string; page?: number; limit?: number }) {
    const { status, type, page = 1, limit = 20 } = query;
    const where: any = {};
    if (status) where.status = status;
    if (type) where.type = type;

    const [items, total] = await Promise.all([
      this.prisma.promotion.findMany({
        where,
        include: { business: { select: { name: true } } },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.promotion.count({ where }),
    ]);
    return { data: items, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  }

  async createPromotion(dto: any) {
    return this.prisma.promotion.create({ data: dto });
  }

  async updatePromotion(id: string, dto: any) {
    const promo = await this.prisma.promotion.findUnique({ where: { id } });
    if (!promo) throw new NotFoundException('Promotion not found');
    return this.prisma.promotion.update({ where: { id }, data: dto });
  }

  async getQlinks(query: { page?: number; limit?: number }) {
    const { page = 1, limit = 20 } = query;
    const [items, total] = await Promise.all([
      this.prisma.qLink.findMany({
        include: { _count: { select: { scans: true } }, business: { select: { name: true } } },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.qLink.count(),
    ]);
    return { data: items, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  }

  async createQlink(dto: { name: string; type: string; businessId: string; destinationUrl?: string }) {
    const code = crypto.randomBytes(4).toString('hex');
    return this.prisma.qLink.create({
      data: {
        businessId: dto.businessId,
        type: dto.type as any,
        code,
        label: dto.name,
        targetUrl: dto.destinationUrl,
      },
    });
  }

  async updateQlink(id: string, dto: any) {
    const qlink = await this.prisma.qLink.findUnique({ where: { id } });
    if (!qlink) throw new NotFoundException('QLink not found');
    return this.prisma.qLink.update({ where: { id }, data: dto });
  }

  async deleteQlink(id: string) {
    const qlink = await this.prisma.qLink.findUnique({ where: { id } });
    if (!qlink) throw new NotFoundException('QLink not found');
    return this.prisma.qLink.update({ where: { id }, data: { isActive: false } });
  }

  async getQlinkScans(qlinkId: string) {
    return this.prisma.qLinkScan.findMany({
      where: { qlinkId },
      orderBy: { scannedAt: 'desc' },
    });
  }

  async getExpos(query: { page?: number; limit?: number }) {
    const { page = 1, limit = 20 } = query;
    const [items, total] = await Promise.all([
      this.prisma.expo.findMany({
        include: { _count: { select: { booths: true } }, event: true },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.expo.count(),
    ]);
    return { data: items, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  }

  async createExpo(dto: any) {
    return this.prisma.expo.create({ data: dto });
  }

  async updateExpo(id: string, dto: any) {
    const expo = await this.prisma.expo.findUnique({ where: { id } });
    if (!expo) throw new NotFoundException('Expo not found');
    return this.prisma.expo.update({ where: { id }, data: dto });
  }

  async getRewards(query: { page?: number; limit?: number }) {
    const { page = 1, limit = 20 } = query;
    const [data, total] = await Promise.all([
      this.prisma.reward.findMany({
        include: {
          _count: { select: { redemptions: true, inventories: true } },
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.reward.count(),
    ]);
    return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
  }

  async getReward(id: string) {
    const reward = await this.prisma.reward.findUnique({
      where: { id },
      include: {
        inventories: { include: { business: { select: { id: true, name: true } } } },
        _count: { select: { redemptions: true } },
      },
    });
    if (!reward) throw new NotFoundException('Reward not found');
    return reward;
  }
}
