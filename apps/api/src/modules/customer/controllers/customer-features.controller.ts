import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, Req, NotFoundException, BadRequestException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { CustomerGuard } from '../guards/customer.guard';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import { PrismaService } from '../../../prisma/prisma.service';

@ApiTags('Customer - Features')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, CustomerGuard)
@Controller('customer')
export class CustomerFeaturesController {
  constructor(private prisma: PrismaService) {}

  @Get('onboarding')
  @ApiOperation({ summary: 'Get onboarding status' })
  async getOnboarding(@Req() req: any) {
    const user = await this.prisma.user.findUnique({ where: { id: req.user.id } });
    if (!user) throw new Error('User not found');
    return {
      isEmailVerified: user.isEmailVerified,
      isPhoneVerified: user.isPhoneVerified,
      hasAvatar: !!user.avatarUrl,
      completed: user.isEmailVerified && user.isPhoneVerified && !!user.avatarUrl && !!user.firstName,
    };
  }

  @Post('onboarding/complete')
  @ApiOperation({ summary: 'Mark onboarding as complete' })
  async completeOnboarding(@Req() req: any) {
    return this.prisma.user.update({
      where: { id: req.user.id },
      data: { metadata: { ...(req.user.metadata || {}), onboardingCompleted: true } },
    });
  }

  @Get('wallet')
  @ApiOperation({ summary: 'Get wallet (loyalty points summary)' })
  async getWallet(@Req() req: any) {
    const memberships = await this.prisma.loyaltyMembership.findMany({
      where: { customerId: req.user.id },
      include: { loyaltyProgram: { select: { id: true, name: true } }, tier: { select: { id: true, name: true, level: true } } },
    });
    return { memberships, totalPoints: memberships.reduce((sum, m) => sum + m.points, 0) };
  }

  @Post('qr/scan')
  @ApiOperation({ summary: 'Process QR code scan' })
  async scanQr(@Req() req: any, @Body() dto: { businessId: string; type?: string; metadata?: any }) {
    await this.prisma.customerActivityLog.create({
      data: { customerId: req.user.id, activityType: 'Click', metadata: { businessId: dto.businessId, type: dto.type || 'storefront', ...dto.metadata } },
    });
    return { message: 'Scan recorded', businessId: dto.businessId };
  }

  @Get('promotions/saved')
  @ApiOperation({ summary: 'Get saved promotions' })
  async getSavedPromotions(@Req() req: any) {
    const user = await this.prisma.user.findUnique({ where: { id: req.user.id } });
    const savedIds: string[] = (user?.metadata as any)?.savedPromotionIds || [];
    if (savedIds.length === 0) return [];
    return this.prisma.promotion.findMany({ where: { id: { in: savedIds }, status: 'Active' as any } });
  }

  @Post('promotions/:id/save')
  @ApiOperation({ summary: 'Save a promotion' })
  async savePromotion(@Req() req: any, @Param('id') id: string) {
    const user = await this.prisma.user.findUnique({ where: { id: req.user.id } });
    if (!user) throw new Error('User not found');
    const savedIds: string[] = (user.metadata as any)?.savedPromotionIds || [];
    if (!savedIds.includes(id)) savedIds.push(id);
    await this.prisma.user.update({ where: { id: req.user.id }, data: { metadata: { ...(user.metadata as any || {}), savedPromotionIds: savedIds } } });
    return { message: 'Promotion saved' };
  }

  @Delete('promotions/:id/save')
  @ApiOperation({ summary: 'Unsave a promotion' })
  async unsavePromotion(@Req() req: any, @Param('id') id: string) {
    const user = await this.prisma.user.findUnique({ where: { id: req.user.id } });
    if (!user) throw new Error('User not found');
    const savedIds: string[] = (user.metadata as any)?.savedPromotionIds || [];
    const filtered = savedIds.filter(s => s !== id);
    await this.prisma.user.update({ where: { id: req.user.id }, data: { metadata: { ...(user.metadata as any || {}), savedPromotionIds: filtered } } });
    return { message: 'Promotion unsaved' };
  }

  @Post('wallet/transfer')
  @ApiOperation({ summary: 'Transfer a voucher to another customer' })
  async transferVoucher(@Req() req: any, @Body() dto: { voucherId: string; recipientEmail: string }) {
    const voucher = await this.prisma.voucher.findUnique({ where: { id: dto.voucherId } });
    if (!voucher) throw new NotFoundException('Voucher not found');
    if (voucher.customerId !== req.user.id) throw new BadRequestException('Voucher does not belong to you');
    if (voucher.status !== 'Active') throw new BadRequestException('Voucher is not active');

    const recipient = await this.prisma.user.findUnique({ where: { email: dto.recipientEmail } });
    if (!recipient) throw new NotFoundException('Recipient not found');

    return this.prisma.voucher.update({
      where: { id: dto.voucherId },
      data: { customerId: recipient.id },
    });
  }

  @Get('local-mall')
  @ApiOperation({ summary: 'Get local mall feed' })
  async getLocalMall(@Req() req: any, @Query('page') page?: number, @Query('limit') limit?: number) {
    return this.getFeed(req, page, limit);
  }

  @Get('feed')
  @ApiOperation({ summary: 'Get local mall feed' })
  async getFeed(@Req() req: any, @Query('page') page?: number, @Query('limit') limit?: number) {
    const p = page || 1;
    const l = limit || 20;
    const [promotions, events, posts] = await Promise.all([
      this.prisma.promotion.findMany({ where: { status: 'Active' as any }, include: { business: { select: { id: true, name: true, slug: true, logoUrl: true } } }, orderBy: { createdAt: 'desc' }, skip: (p - 1) * l, take: l }),
      this.prisma.event.findMany({ where: { status: 'published' as any, startDate: { gte: new Date() } }, orderBy: { startDate: 'asc' }, take: 10 }),
      this.prisma.communityPost.findMany({ include: { author: { select: { id: true, firstName: true, lastName: true, avatarUrl: true } } }, orderBy: { createdAt: 'desc' }, take: 20 }),
    ]);
    return { promotions, events, posts };
  }
}
