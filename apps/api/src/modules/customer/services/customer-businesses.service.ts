import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class CustomerBusinessesService {
  constructor(private prisma: PrismaService) {}

  async findOne(id: string) {
    const business = await this.prisma.business.findFirst({
      where: { id, isActive: true, deletedAt: null },
      include: {
        locations: { take: 1, include: { storefrontCluster: { include: { highStreet: { include: { borough: true } } } } } },
        businessLocations: { include: { highStreet: { include: { borough: true } } } },
        hours: true,
        campaigns: {
          where: { campaign: { status: 'Active', isPublic: true, deletedAt: null } },
          include: { campaign: { include: { rewards: true } } },
          take: 5,
          orderBy: { joinedAt: 'desc' },
        },
        rewards: {
          where: { isActive: true },
          include: { reward: true },
          take: 5,
          orderBy: { createdAt: 'desc' },
        },
        storefront: { select: { id: true, theme: true } },
        _count: { select: { interestSignals: true } },
      },
    });
    if (!business) throw new NotFoundException('Business not found');
    return business;
  }

  async follow(customerId: string, businessId: string) {
    const business = await this.prisma.business.findFirst({
      where: { id: businessId, isActive: true, deletedAt: null },
    });
    if (!business) throw new NotFoundException('Business not found');

    const existing = await this.prisma.interestSignal.findFirst({
      where: { customerId, businessId, signalType: 'follow' },
    });

    if (existing) {
      await this.prisma.interestSignal.delete({ where: { id: existing.id } });
      return { followed: false, message: 'Unfollowed business' };
    }

    await this.prisma.interestSignal.create({
      data: { customerId, businessId, signalType: 'follow' },
    });

    return { followed: true, message: 'Following business' };
  }
}
