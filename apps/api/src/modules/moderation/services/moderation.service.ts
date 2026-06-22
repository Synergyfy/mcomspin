import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateRuleDto } from '../dto/create-rule.dto';
import { UpdateRuleDto } from '../dto/update-rule.dto';

@Injectable()
export class ModerationService {
  constructor(private prisma: PrismaService) {}

  async getReports(page: number = 1, limit: number = 20, status?: string) {
    const validStatuses = ['Pending', 'Resolved', 'Dismissed'];
    if (status && !validStatuses.includes(status)) {
      throw new BadRequestException(`Invalid status. Must be one of: ${validStatuses.join(', ')}`);
    }
    const where: any = {};
    if (status) where.status = status;

    const [items, total] = await Promise.all([
      this.prisma.abuseReport.findMany({
        where,
        include: { reporter: { select: { id: true, firstName: true, lastName: true, email: true } } },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.abuseReport.count({ where }),
    ]);
    return { data: items, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  }

  async getReport(id: string) {
    const report = await this.prisma.abuseReport.findUnique({
      where: { id },
      include: {
        reporter: { select: { id: true, firstName: true, lastName: true, email: true } },
        actionTaken: true,
      },
    });
    if (!report) throw new NotFoundException('Report not found');
    return report;
  }

  async createReport(dto: { targetType: string; targetId: string; reason: string; description?: string }, userId: string) {
    return this.prisma.abuseReport.create({
      data: { reporterId: userId, targetType: dto.targetType, targetId: dto.targetId, reason: dto.reason, description: dto.description },
    });
  }

  async takeAction(reportId: string, dto: { actionType: any; reason: string; duration?: number }, moderatorId: string) {
    const report = await this.prisma.abuseReport.findUnique({ where: { id: reportId } });
    if (!report) throw new NotFoundException('Report not found');

    await this.prisma.abuseReport.update({
      where: { id: reportId },
      data: { status: 'Resolved', moderatorId, resolvedAt: new Date() },
    });

    return this.prisma.moderationAction.create({
      data: {
        reportId,
        targetType: report.targetType,
        targetId: report.targetId,
        actionType: dto.actionType,
        reason: dto.reason,
        performedBy: moderatorId,
        duration: dto.duration,
      },
    });
  }

  async dismissReport(reportId: string, moderatorId: string) {
    const report = await this.prisma.abuseReport.findUnique({ where: { id: reportId } });
    if (!report) throw new NotFoundException('Report not found');
    return this.prisma.abuseReport.update({
      where: { id: reportId },
      data: { status: 'Dismissed', moderatorId, resolvedAt: new Date() },
    });
  }

  async getFraudAlerts(page: number = 1, limit: number = 20) {
    const [items, total] = await Promise.all([
      this.prisma.fraudAlert.findMany({ orderBy: { createdAt: 'desc' }, skip: (page - 1) * limit, take: limit }),
      this.prisma.fraudAlert.count(),
    ]);
    return { data: items, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  }

  async resolveFraudAlert(id: string, resolvedBy: string) {
    const alert = await this.prisma.fraudAlert.findUnique({ where: { id } });
    if (!alert) throw new NotFoundException('Fraud alert not found');
    return this.prisma.fraudAlert.update({
      where: { id },
      data: { isResolved: true, resolvedBy, resolvedAt: new Date() },
    });
  }

  async getRules() {
    return this.prisma.moderationRule.findMany({ orderBy: { priority: 'desc' } });
  }

  async createRule(dto: CreateRuleDto) {
    return this.prisma.moderationRule.create({ data: dto as any });
  }

  async updateRule(id: string, dto: UpdateRuleDto) {
    return this.prisma.moderationRule.update({ where: { id }, data: dto as any });
  }
}
