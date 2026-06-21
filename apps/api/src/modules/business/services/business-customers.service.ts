import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
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
          customerRewards: { where: { reward: { inventories: { some: { businessId } } } }, select: { id: true } },
          gameSessions: { where: { config: { businessId } }, select: { id: true } },
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

  async allocatePoints(businessId: string, customerId: string, dto: { points: number; reason?: string }) {
    const customer = await this.prisma.user.findFirst({
      where: { id: customerId, gameSessions: { some: { config: { businessId } } } },
    });
    if (!customer) throw new NotFoundException('Customer not found');

    let membership = await this.prisma.loyaltyMembership.findFirst({
      where: { customerId, loyaltyProgram: { businessId } },
    });

    if (!membership) {
      const program = await this.prisma.loyaltyProgram.findFirst({ where: { businessId } });
      if (!program) throw new BadRequestException('No loyalty program configured');

      const tier = await this.prisma.loyaltyTier.findFirst({ where: { loyaltyProgramId: program.id } });
      membership = await this.prisma.loyaltyMembership.create({
        data: { customerId, loyaltyProgramId: program.id, tierId: tier?.id, points: 0 },
      });
    }

    await this.prisma.pointsTransaction.create({
      data: {
        loyaltyMembershipId: membership.id,
        points: dto.points,
        type: 'earned',
        description: dto.reason || 'Manual allocation',
      },
    });

    await this.prisma.loyaltyMembership.update({
      where: { id: membership.id },
      data: { points: { increment: dto.points } },
    });

    return { message: `Allocated ${dto.points} points to customer` };
  }

  async sendMessage(businessId: string, senderId: string, dto: { customerIds: string[]; subject?: string; content: string }) {
    const results = [];
    for (const customerId of dto.customerIds) {
      const thread = await this.prisma.messageThread.create({
        data: {
          subject: dto.subject || 'Message from business',
          participants: { connect: [{ id: senderId }, { id: customerId }] },
          messages: {
            create: { senderId, content: dto.content },
          },
        },
        include: { messages: true },
      });
      results.push(thread);
    }
    return { message: `Sent message to ${dto.customerIds.length} customers`, threads: results };
  }

  async getReviews(businessId: string, query: { page?: number; limit?: number }) {
    const { page = 1, limit = 20 } = query;
    const [items, total] = await Promise.all([
      this.prisma.customerActivityLog.findMany({
        where: { activityType: 'Review', entityType: 'business', entityId: businessId },
        include: { customer: { select: { firstName: true, lastName: true, avatarUrl: true } } },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.customerActivityLog.count({
        where: { activityType: 'Review', entityType: 'business', entityId: businessId },
      }),
    ]);
    return { data: items, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  }
}
