import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class BusinessCustomersService {
  constructor(private prisma: PrismaService) {}

  async findAll(businessId: string, query: { page?: number; limit?: number; search?: string }) {
    const { page = 1, limit = 20, search } = query;

    const where: any = {
      gameSessions: { some: { config: { businessId } } },
    };
    if (search) {
      where.OR = [
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [data, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          phone: true,
          _count: { select: { customerRewards: true, gameSessions: true } },
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.user.count({ where }),
    ]);

    return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
  }

  async findOne(businessId: string, id: string) {
    const customer = await this.prisma.user.findFirst({
      where: { id, gameSessions: { some: { config: { businessId } } } },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        customerRewards: {
          where: { reward: { inventories: { some: { businessId } } } },
          include: { reward: true },
          orderBy: { earnedAt: 'desc' },
          take: 20,
        },
        gameSessions: {
          where: { config: { businessId } },
          orderBy: { createdAt: 'desc' },
          take: 20,
        },
      },
    });

    return customer;
  }
}
