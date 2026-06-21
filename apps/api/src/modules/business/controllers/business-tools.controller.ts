import { Controller, Get, Post, Body, Query, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { BusinessOwnerGuard } from '../guards/business-owner.guard';
import { PrismaService } from '../../../prisma/prisma.service';

@ApiTags('Business - Tools')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, BusinessOwnerGuard)
@Controller('business/tools')
export class BusinessToolsController {
  constructor(private prisma: PrismaService) {}

  @Get()
  @ApiOperation({ summary: 'Get tools overview' })
  async getOverview(@Req() req: any) {
    const [excessStock, spareCapacity, activeCampaigns] = await Promise.all([
      this.prisma.product.findMany({
        where: { storefront: { businessId: req.businessId }, deletedAt: null, isTrackStock: true, stock: { lte: 5 } },
        take: 100,
      }),
      this.prisma.service.count({ where: { storefront: { businessId: req.businessId }, status: 'active' } }),
      this.prisma.campaign.count({
        where: { businesses: { some: { businessId: req.businessId } }, status: 'Active' },
      }),
    ]);
    return { excessStockCount: excessStock.length, excessStockItems: excessStock, spareCapacity, activeCampaigns };
  }

  @Post('excess-stock')
  @ApiOperation({ summary: 'Create excess stock offer' })
  async createExcessStockOffer(@Req() req: any, @Body() dto: { productId: string; discountPercent: number; title?: string }) {
    const product = await this.prisma.product.findFirst({
      where: { id: dto.productId, storefront: { businessId: req.businessId }, deletedAt: null },
    });
    if (!product) throw new Error('Product not found');

    const discountedPrice = Number(product.price) * (1 - dto.discountPercent / 100);
    return this.prisma.product.update({
      where: { id: dto.productId },
      data: { compareAtPrice: product.price, price: discountedPrice, metadata: { ...(product.metadata as any || {}), excessStockOffer: true, offerTitle: dto.title || 'Excess Stock Sale', offerDiscount: dto.discountPercent } },
    });
  }

  @Post('spare-capacity')
  @ApiOperation({ summary: 'Create spare capacity offer' })
  async createSpareCapacityOffer(@Req() req: any, @Body() dto: { serviceId: string; discountedPrice: number; title?: string }) {
    const service = await this.prisma.service.findFirst({
      where: { id: dto.serviceId, storefront: { businessId: req.businessId } },
    });
    if (!service) throw new Error('Service not found');

    const existingAttributes = (service.attributes as Record<string, any>) || {};
    const spareOffers = existingAttributes.spareCapacityOffers || [];
    spareOffers.push({ title: dto.title || 'Spare Capacity Deal', discountedPrice: dto.discountedPrice, createdAt: new Date().toISOString() });

    await this.prisma.service.update({
      where: { id: dto.serviceId },
      data: { attributes: { ...existingAttributes, spareCapacityOffers: spareOffers } },
    });
    return { message: 'Spare capacity offer created' };
  }

  @Post('notifications')
  @ApiOperation({ summary: 'Send push notification' })
  async sendPushNotification(@Req() req: any, @Body() dto: { title: string; message: string; audience?: string }) {
    const customers = await this.prisma.user.findMany({
      where: { gameSessions: { some: { config: { businessId: req.businessId } } } },
      take: 1000,
    });

    const notifications = customers.map(u => ({
      userId: u.id,
      title: dto.title,
      message: dto.message,
      type: 'Promotion',
      channel: 'Push',
    }));

    await this.prisma.notification.createMany({ data: notifications as any });
    return { message: `Notification sent to ${notifications.length} customers` };
  }

  @Get('automations')
  @ApiOperation({ summary: 'List automations' })
  async getAutomations(@Req() req: any) {
    return this.prisma.automationRule.findMany({
      where: { businessId: req.businessId },
      include: { triggers: true, actions: true },
    });
  }

  @Post('automations')
  @ApiOperation({ summary: 'Create automation' })
  async createAutomation(@Req() req: any, @Body() dto: any) {
    return this.prisma.automationRule.create({
      data: { ...dto, businessId: req.businessId },
    });
  }
}
