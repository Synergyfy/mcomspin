import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class NotificationsService {
  constructor(private prisma: PrismaService) {}

  async getNotifications(userId: string, page: number = 1, limit: number = 20) {
    const [items, total] = await Promise.all([
      this.prisma.notification.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.notification.count({ where: { userId } }),
    ]);
    return { data: items, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  }

  async markAsRead(userId: string, notificationId: string) {
    const notification = await this.prisma.notification.findFirst({ where: { id: notificationId, userId } });
    if (!notification) throw new NotFoundException('Notification not found');
    return this.prisma.notification.update({
      where: { id: notificationId },
      data: { isRead: true, readAt: new Date() },
    });
  }

  async markAllAsRead(userId: string) {
    await this.prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true, readAt: new Date() },
    });
    return { message: 'All notifications marked as read' };
  }

  async getPreferences(userId: string) {
    return this.prisma.notificationPreference.findMany({ where: { userId } });
  }

  async updatePreferences(userId: string, preferences: { channel: any; type: any; enabled: boolean }[]) {
    if (!preferences.length) return { message: 'Preferences updated' };

    await this.prisma.$transaction(
      preferences.map((pref) =>
        this.prisma.notificationPreference.upsert({
          where: { userId_channel_type: { userId, channel: pref.channel, type: pref.type } },
          update: { enabled: pref.enabled },
          create: { userId, channel: pref.channel, type: pref.type, enabled: pref.enabled },
        }),
      ),
    );
    return { message: 'Preferences updated' };
  }

  async getTemplates() {
    return this.prisma.notificationTemplate.findMany();
  }

  async createTemplate(data: { name: string; type: any; channel: any; body: string; subject?: string; title?: string; variables?: any }) {
    return this.prisma.notificationTemplate.create({ data });
  }

  async sendBulk(userId: string, dto: { title: string; message: string; type: any; channel?: any; userIds?: string[] }) {
    const targetUserIds = dto.userIds || [userId];
    const notifications = targetUserIds.map(uid => ({
      userId: uid,
      title: dto.title,
      body: dto.message,
      type: dto.type,
      channel: dto.channel || 'InApp' as any,
    }));
    await this.prisma.notification.createMany({ data: notifications as any });
    return { message: `Sent to ${notifications.length} users` };
  }
}
