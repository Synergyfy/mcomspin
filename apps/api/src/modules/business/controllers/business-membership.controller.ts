import { Controller, Get, Post, Put, Body, Param, Query, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { BusinessOwnerGuard } from '../guards/business-owner.guard';
import { PrismaService } from '../../../prisma/prisma.service';

@ApiTags('Business - Membership')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, BusinessOwnerGuard)
@Controller('business')
export class BusinessMembershipController {
  constructor(private prisma: PrismaService) {}

  @Get('membership')
  @ApiOperation({ summary: 'Get membership details' })
  async getMembership(@Req() req: any) {
    const membership = await this.prisma.businessMembership.findUnique({ where: { businessId: req.businessId } });
    return membership;
  }

  @Put('membership/upgrade')
  @ApiOperation({ summary: 'Upgrade membership plan' })
  async upgradeMembership(@Req() req: any, @Body() dto: { tier: string }) {
    const existing = await this.prisma.businessMembership.findUnique({ where: { businessId: req.businessId } });
    if (existing) {
      return this.prisma.businessMembership.update({
        where: { businessId: req.businessId },
        data: { tier: dto.tier as any },
      });
    }
    return this.prisma.businessMembership.create({
      data: { businessId: req.businessId, tier: dto.tier as any },
    });
  }

  @Get('credits')
  @ApiOperation({ summary: 'Get credit balance' })
  async getCredits(@Req() req: any) {
    const credits = await this.prisma.credit.findMany({ where: { businessId: req.businessId } });
    return credits;
  }

  @Post('credits/redeem')
  @ApiOperation({ summary: 'Redeem credits' })
  async redeemCredits(@Req() req: any, @Body() dto: { creditId: string; amount: number; reason?: string }) {
    const credit = await this.prisma.credit.findUnique({ where: { id: dto.creditId } });
    if (!credit || credit.businessId !== req.businessId) throw new Error('Credit not found');
    if (Number(credit.balance) < dto.amount) throw new Error('Insufficient credits');

    await this.prisma.creditUsage.create({
      data: { creditId: dto.creditId, amount: dto.amount, referenceType: 'manual', metadata: dto.reason ? { reason: dto.reason } : undefined },
    });
    await this.prisma.credit.update({
      where: { id: dto.creditId },
      data: { balance: { decrement: dto.amount } },
    });
    return { message: `Redeemed ${dto.amount} credits` };
  }

  @Get('audits')
  @ApiOperation({ summary: 'Get audit history' })
  async getAudits(@Req() req: any, @Query('page') page?: number, @Query('limit') limit?: number) {
    const p = page || 1;
    const l = limit || 20;
    const [items, total] = await Promise.all([
      this.prisma.audit.findMany({
        where: { businessId: req.businessId },
        skip: (p - 1) * l,
        take: l,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.audit.count({ where: { businessId: req.businessId } }),
    ]);
    return { data: items, meta: { page: p, limit: l, total, totalPages: Math.ceil(total / l) } };
  }

  @Post('audits/run')
  @ApiOperation({ summary: 'Run a new audit' })
  async runAudit(@Req() req: any, @Body() dto: { type?: string }) {
    return this.prisma.audit.create({
      data: { businessId: req.businessId, type: (dto.type || 'Short') as any },
    });
  }

  @Get('recommendations')
  @ApiOperation({ summary: 'Get improvement recommendations' })
  async getRecommendations(@Req() req: any) {
    return this.prisma.auditRecommendation.findMany({
      where: { businessId: req.businessId },
      orderBy: { createdAt: 'desc' },
    });
  }
}
