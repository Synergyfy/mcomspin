import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class MallModerationService {
  constructor(private prisma: PrismaService) {}

  async getReports(query: { status?: string; severity?: string; page?: number; limit?: number }) {
    const { status, page = 1, limit = 20 } = query;
    const where: any = {};
    if (status) where.status = status;

    const [items, total] = await Promise.all([
      this.prisma.abuseReport.findMany({
        where,
        include: {
          reporter: { select: { firstName: true, lastName: true, email: true } },
          moderator: { select: { firstName: true, lastName: true } },
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.abuseReport.count({ where }),
    ]);
    return { data: items, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  }

  async takeAction(reportId: string, dto: { action: string; performedBy: string; reason?: string }) {
    const report = await this.prisma.abuseReport.findUnique({ where: { id: reportId } });
    if (!report) throw new NotFoundException('Report not found');

    await this.prisma.abuseReport.update({
      where: { id: reportId },
      data: { status: 'Resolved', resolvedAt: new Date(), moderatorId: dto.performedBy },
    });

    return this.prisma.moderationAction.create({
      data: {
        reportId,
        actionType: dto.action as any,
        targetType: report.targetType,
        targetId: report.targetId,
        reason: dto.reason || 'No reason provided',
        performedBy: dto.performedBy,
      },
    });
  }

  async getFraudAlerts() {
    return this.prisma.fraudAlert.findMany({
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
  }
}
