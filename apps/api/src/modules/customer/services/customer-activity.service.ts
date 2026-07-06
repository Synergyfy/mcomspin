import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class CustomerActivityService {
  constructor(private prisma: PrismaService) {}

  async findAll(customerId: string, query: { page?: number; limit?: number }) {
    const { page = 1, limit = 20 } = query;

    const [data, total] = await Promise.all([
      this.prisma.customerActivityLog.findMany({
        where: { customerId },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.customerActivityLog.count({ where: { customerId } }),
    ]);

    return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
  }
}
