import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class MallOperationsService {
  constructor(private prisma: PrismaService) {}

  async getBillingOverview() {
    const [subscriptions, invoices, transactions] = await Promise.all([
      this.prisma.subscription.findMany({
        include: { business: { select: { name: true } } },
        orderBy: { createdAt: 'desc' },
        take: 50,
      }),
      this.prisma.invoice.findMany({
        orderBy: { createdAt: 'desc' },
        take: 50,
      }),
      this.prisma.transaction.findMany({
        orderBy: { createdAt: 'desc' },
        take: 50,
      }),
    ]);
    return { subscriptions, invoices, transactions };
  }

  async getTeam() {
    return this.prisma.user.findMany({
      where: {
        roles: { some: { role: { name: { in: ['SuperAdmin', 'BoroughAdmin', 'HighStreetManager'] } } } },
      },
      include: { roles: { include: { role: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async inviteTeamMember(dto: { email: string; firstName: string; lastName: string; role: string }) {
    return this.prisma.user.create({
      data: {
        email: dto.email,
        firstName: dto.firstName,
        lastName: dto.lastName,
        passwordHash: '',
        roles: { create: { role: { connect: { name: dto.role as any } } } },
      },
    });
  }

  async updateTeamMember(id: string, dto: { role?: string; isActive?: boolean }) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    if (dto.isActive !== undefined) {
      await this.prisma.user.update({ where: { id }, data: { isActive: dto.isActive } });
    }
    return { message: 'Team member updated' };
  }

  async getSupportTickets(query: { page?: number; limit?: number }) {
    const { page = 1, limit = 20 } = query;
    const [items, total] = await Promise.all([
      this.prisma.abuseReport.findMany({
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.abuseReport.count(),
    ]);
    return { data: items, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  }

  async updateSupportTicket(id: string, dto: { status?: string; moderatorId?: string }) {
    const ticket = await this.prisma.abuseReport.findUnique({ where: { id } });
    if (!ticket) throw new NotFoundException('Ticket not found');
    return this.prisma.abuseReport.update({ where: { id }, data: dto as any });
  }

  async getAnalytics(query: { period?: string; boroughId?: string }) {
    const now = new Date();
    let startDate: Date;
    switch (query.period) {
      case 'weekly': startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000); break;
      case 'monthly': startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000); break;
      case 'yearly': startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000); break;
      default: startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }

    const [campaigns, rewards, customers] = await Promise.all([
      this.prisma.campaign.findMany({ where: { createdAt: { gte: startDate } } }),
      this.prisma.rewardRedemption.findMany({ where: { redeemedAt: { gte: startDate } } }),
      this.prisma.customerActivityLog.count({ where: { createdAt: { gte: startDate } } }),
    ]);

    return {
      period: query.period || 'monthly',
      campaignsCreated: campaigns.length,
      rewardsRedeemed: rewards.length,
      activeCustomers: customers,
    };
  }
}
