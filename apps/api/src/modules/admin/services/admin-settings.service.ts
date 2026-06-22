import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { UpdateSettingsDto } from '../dto/update-settings.dto';

@Injectable()
export class AdminSettingsService {
  constructor(private prisma: PrismaService) {}

  async getSettings() {
    const settings = await this.prisma.$queryRawUnsafe<any[]>(
      `SELECT key, value FROM "PlatformSetting"`,
    );

    const result: Record<string, any> = {};
    for (const row of settings) {
      result[row.key] = typeof row.value === 'string' ? JSON.parse(row.value) : row.value;
    }
    return result;
  }

  async updateSettings(dto: UpdateSettingsDto) {
    for (const [key, value] of Object.entries(dto)) {
      if (value !== undefined) {
        await this.prisma.$executeRawUnsafe(
          `INSERT INTO "PlatformSetting" (key, value) VALUES ($1, $2::jsonb)
           ON CONFLICT (key) DO UPDATE SET value = $2::jsonb, "updatedAt" = NOW()`,
          key,
          JSON.stringify(value),
        );
      }
    }

    return this.getSettings();
  }
}
