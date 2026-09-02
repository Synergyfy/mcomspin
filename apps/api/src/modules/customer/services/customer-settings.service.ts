import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CustomerUpdateSettingsDto } from '../dto/customer-update-settings.dto';

@Injectable()
export class CustomerSettingsService {
  constructor(private prisma: PrismaService) {}

  async update(customerId: string, dto: CustomerUpdateSettingsDto) {
    if (dto.notificationPrefs?.length) {
      await this.prisma.$transaction(
        dto.notificationPrefs.map((pref) =>
          this.prisma.notificationPreference.upsert({
            where: {
              userId_channel_type: {
                userId: customerId,
                channel: pref.channel as any,
                type: pref.type as any,
              },
            },
            update: { enabled: pref.enabled },
            create: {
              userId: customerId,
              channel: pref.channel as any,
              type: pref.type as any,
              enabled: pref.enabled,
            },
          }),
        ),
      );
    }

    const metadataUpdate: any = {};
    if (dto.language !== undefined) metadataUpdate.language = dto.language;
    if (dto.privacy !== undefined) metadataUpdate.privacy = dto.privacy;

    if (Object.keys(metadataUpdate).length > 0) {
      const user = await this.prisma.user.findUnique({
        where: { id: customerId },
        select: { metadata: true },
      });
      const existingMetadata: any = (user?.metadata as Record<string, any>) || {};
      await this.prisma.user.update({
        where: { id: customerId },
        data: { metadata: { ...existingMetadata, ...metadataUpdate } },
      });
    }

    const prefs = await this.prisma.notificationPreference.findMany({
      where: { userId: customerId },
    });

    return { notificationPrefs: prefs, language: dto.language, privacy: dto.privacy };
  }
}
