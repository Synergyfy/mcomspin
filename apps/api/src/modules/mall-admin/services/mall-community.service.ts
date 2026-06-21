import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class MallCommunityService {
  constructor(private prisma: PrismaService) {}

  async getCommunityFeed(query: { page?: number; limit?: number }) {
    const { page = 1, limit = 20 } = query;
    const [posts, total] = await Promise.all([
      this.prisma.communityPost.findMany({
        include: {
          group: { select: { name: true, type: true } },
          author: { select: { firstName: true, lastName: true } },
          business: { select: { name: true } },
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.communityPost.count(),
    ]);
    return { data: posts, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  }

  async sendNotification(dto: { title: string; message: string; audience: string; boroughId?: string; type?: string }) {
    const users = await this.prisma.user.findMany({ take: 1000 });

    const notifications = users.map(u => ({
      userId: u.id,
      title: dto.title,
      message: dto.message,
      type: dto.type || 'System',
      channel: 'Push',
    }));

    await this.prisma.notification.createMany({ data: notifications as any });
    return { message: `Notification sent to ${notifications.length} users` };
  }

  async getAutomations(query: { page?: number; limit?: number }) {
    const { page = 1, limit = 20 } = query;
    const [items, total] = await Promise.all([
      this.prisma.automationRule.findMany({
        include: { triggers: true, actions: true, business: { select: { name: true } } },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.automationRule.count(),
    ]);
    return { data: items, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  }

  async createAutomation(dto: any) {
    return this.prisma.automationRule.create({ data: dto });
  }
}
