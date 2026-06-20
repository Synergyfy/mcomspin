import { Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../../../prisma/prisma.service';
import { UpdateBusinessProfileDto } from '../dto/business-profile.dto';
import { UpdateBusinessSettingsDto } from '../dto/update-settings.dto';

@Injectable()
export class BusinessProfileService {
  constructor(private prisma: PrismaService) {}

  async getProfile(businessId: string) {
    const business = await this.prisma.business.findUnique({
      where: { id: businessId },
      include: {
        verification: true,
        membership: true,
        locations: { where: { deletedAt: null } },
      },
    });
    if (!business) throw new NotFoundException('Business not found');
    return business;
  }

  async updateProfile(businessId: string, dto: UpdateBusinessProfileDto) {
    const business = await this.prisma.business.findUnique({ where: { id: businessId } });
    if (!business) throw new NotFoundException('Business not found');

    return this.prisma.business.update({
      where: { id: businessId },
      data: dto,
    });
  }

  async updateSettings(userId: string, businessId: string, dto: UpdateBusinessSettingsDto) {
    if (dto.password) {
      const passwordHash = await bcrypt.hash(dto.password, 12);
      await this.prisma.user.update({
        where: { id: userId },
        data: { passwordHash },
      });
    }

    if (dto.branding || dto.notifications) {
      await this.prisma.business.update({
        where: { id: businessId },
        data: {
          metadata: {
            ...dto.branding ? { branding: dto.branding } : {},
            ...dto.notifications ? { notifications: dto.notifications } : {},
          },
        },
      });
    }

    return { message: 'Settings updated' };
  }

  async getBilling(businessId: string) {
    const [subscription, invoices] = await Promise.all([
      this.prisma.subscription.findFirst({
        where: { businessId },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.invoice.findMany({
        where: { businessId },
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    return { subscription, invoices };
  }
}
