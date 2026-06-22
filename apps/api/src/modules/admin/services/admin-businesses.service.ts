import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { BusinessAction } from '../dto/business-action.dto';

@Injectable()
export class AdminBusinessesService {
  constructor(private prisma: PrismaService) {}

  async findAll(query: { page?: number; limit?: number; search?: string; status?: string }) {
    const { page = 1, limit = 20, search, status } = query;
    const where: any = { deletedAt: null };

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { contactEmail: { contains: search, mode: 'insensitive' } },
      ];
    }
    if (status === 'active') where.isActive = true;
    if (status === 'suspended') where.isActive = false;

    const [data, total] = await Promise.all([
      this.prisma.business.findMany({
        where,
        include: {
          owner: { select: { id: true, firstName: true, lastName: true, email: true } },
          verification: true,
          _count: { select: { campaigns: true, rewards: true } },
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.business.count({ where }),
    ]);

    return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
  }

  async findOne(id: string) {
    const business = await this.prisma.business.findUnique({
      where: { id },
      include: {
        owner: { select: { id: true, firstName: true, lastName: true, email: true, phone: true } },
        verification: true,
        membership: true,
        locations: { where: { deletedAt: null } },
        staff: { include: { user: { select: { id: true, firstName: true, lastName: true, email: true } } } },
        _count: { select: { campaigns: true, rewards: true, locations: true } },
      },
    });
    if (!business) throw new NotFoundException('Business not found');
    return business;
  }

  async updateStatus(id: string, dto: { action: BusinessAction }) {
    const business = await this.prisma.business.findUnique({ where: { id } });
    if (!business) throw new NotFoundException('Business not found');

    switch (dto.action) {
      case BusinessAction.Approve:
        await this.prisma.businessVerification.upsert({
          where: { businessId: id },
          update: { status: 'Verified' },
          create: { businessId: id, status: 'Verified' },
        });
        break;
      case BusinessAction.Suspend:
        await this.prisma.business.update({ where: { id }, data: { isActive: false } });
        break;
      case BusinessAction.Activate:
        await this.prisma.business.update({ where: { id }, data: { isActive: true } });
        break;
      default:
        throw new BadRequestException('Invalid action');
    }

    return this.prisma.business.findUnique({ where: { id } });
  }
}
