import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class CustomerNotificationsService {
  constructor(private prisma: PrismaService) {}

  async findAll(customerId: string, query: { page?: number; limit?: number }) {
    const { page = 1, limit = 20 } = query;

    const [data, total] = await Promise.all([
      this.prisma.notification.findMany({
        where: { userId: customerId },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.notification.count({ where: { userId: customerId } }),
    ]);

    return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
  }

  async markAsRead(customerId: string, id: string) {
    await this.prisma.notification.updateMany({
      where: { id, userId: customerId },
      data: { isRead: true, readAt: new Date() },
    });
    return { message: 'Notification marked as read' };
  }
}
