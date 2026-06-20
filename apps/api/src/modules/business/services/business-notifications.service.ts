import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { SendNotificationDto } from '../dto/send-notification.dto';

@Injectable()
export class BusinessNotificationsService {
  constructor(private prisma: PrismaService) {}

  async send(businessId: string, dto: SendNotificationDto) {
    const customers = await this.prisma.gameSession.findMany({
      where: { config: { businessId } },
      select: { customerId: true },
      distinct: ['customerId'],
    });

    const notifications = customers.map((c) => ({
      userId: c.customerId,
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
