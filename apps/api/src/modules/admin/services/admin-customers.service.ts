import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CustomerAction } from '../dto/customer-action.dto';

@Injectable()
export class AdminCustomersService {
  constructor(private prisma: PrismaService) {}

  async findAll(query: { page?: number; limit?: number; search?: string; status?: string }) {
    const { page = 1, limit = 20, search, status } = query;
    const where: any = {
      deletedAt: null,
      roles: { some: { role: { name: 'Customer' } } },
    };

    if (search) {
      where.OR = [
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search, mode: 'insensitive' } },
      ];
    }
    if (status === 'active') where.isActive = true;
    if (status === 'suspended') where.isActive = false;

    const [data, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        include: {
          _count: { select: { customerRewards: true } },
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.user.count({ where }),
    ]);

    return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
  }

  async findOne(id: string) {
    const customer = await this.prisma.user.findUnique({
      where: { id },
      include: {
        customerRewards: { include: { reward: true }, orderBy: { earnedAt: 'desc' }, take: 20 },
        gameSessions: { orderBy: { createdAt: 'desc' }, take: 20 },
        _count: { select: { customerRewards: true, gameSessions: true } },
      },
    });
    if (!customer) throw new NotFoundException('Customer not found');
    return customer;
  }

  async updateStatus(id: string, dto: { action: CustomerAction }) {
    const customer = await this.prisma.user.findUnique({ where: { id } });
    if (!customer) throw new NotFoundException('Customer not found');

    return this.prisma.user.update({
      where: { id },
      data: { isActive: dto.action === CustomerAction.Activate },
    });
  }
}
