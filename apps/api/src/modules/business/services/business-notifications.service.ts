import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { SendNotificationDto } from '../dto/send-notification.dto';

@Injectable()
export class BusinessNotificationsService {
  constructor(private prisma: PrismaService) {}

  async send(businessId: string, dto: SendNotificationDto) {
    const [players, rewardCustomers] = await Promise.all([
      this.prisma.gameSession.findMany({
        where: { config: { businessId } },
        select: { customerId: true },
        distinct: ['customerId'],
      }),
      this.prisma.customerReward.findMany({
        where: { reward: { inventories: { some: { businessId } } } },
        select: { customerId: true },
        distinct: ['customerId'],
      }),
    ]);

    const customerIds = new Set([
      ...players.map((c) => c.customerId),
      ...rewardCustomers.map((c) => c.customerId),
    ]);

    const notifications = Array.from(customerIds).map((userId) => ({
      userId,
      title: dto.title,
      body: dto.message,
      type: 'Promotional' as const,
      channel: 'InApp' as const,
      data: dto.metadata,
    }));

    if (notifications.length > 0) {
      await this.prisma.notification.createMany({ data: notifications });
    }

    return { sent: notifications.length, channels: dto.channels };
  }
}
