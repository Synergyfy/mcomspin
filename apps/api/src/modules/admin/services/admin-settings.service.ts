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
    const entries = Object.entries(dto).filter(([, value]) => value !== undefined);
    if (entries.length > 0) {
      const placeholders = entries.map((_, i) => `($${i * 2 + 1}, $${i * 2 + 2}::jsonb)`).join(', ');
      const values = entries.flatMap(([key, value]) => [key, JSON.stringify(value)]);
      await this.prisma.$executeRawUnsafe(
        `INSERT INTO "PlatformSetting" (key, value) VALUES ${placeholders}
         ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, "updatedAt" = NOW()`,
        ...values,
      );
    }

    return this.getSettings();
  }
}
