import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import * as crypto from 'crypto';
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
    const subject = dto.subject || 'Message from business';
    const { customerIds, content } = dto;

    const batchKey = crypto.randomUUID();

    await this.prisma.messageThread.createMany({
      data: customerIds.map(() => ({
        subject: `__batch_${batchKey}__${subject}`,
      })),
    });

    const threads = await this.prisma.messageThread.findMany({
      where: { subject: { startsWith: `__batch_${batchKey}__` } },
      orderBy: { createdAt: 'asc' },
    });

    const placeholders: string[] = [];
    const values: any[] = [];
    for (let i = 0; i < threads.length; i++) {
      placeholders.push(`($${values.length + 1}::uuid, $${values.length + 2}::uuid)`);
      values.push(threads[i].id, senderId);
      placeholders.push(`($${values.length + 1}::uuid, $${values.length + 2}::uuid)`);
      values.push(threads[i].id, customerIds[i]);
    }

    await Promise.all([
      this.prisma.$executeRawUnsafe(
        `INSERT INTO "_MessageThreadParticipants" ("A", "B") VALUES ${placeholders.join(', ')}`,
        ...values,
      ),
      this.prisma.message.createMany({
        data: threads.map((t) => ({
          threadId: t.id,
          senderId,
          content,
        })),
      }),
    ]);

    // Clean up subject prefix in DB and fetch final result
    await this.prisma.messageThread.updateMany({
      where: { id: { in: threads.map((t) => t.id) } },
      data: { subject },
    });

    const result = await this.prisma.messageThread.findMany({
      where: { id: { in: threads.map((t) => t.id) } },
      include: { messages: true },
    });

    return { message: `Sent message to ${customerIds.length} customers`, threads: result };
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
