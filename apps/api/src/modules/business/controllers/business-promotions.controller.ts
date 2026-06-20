import { Controller, Get, Post, Put, Param, Body, Query, Req, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { BusinessOwnerGuard } from '../guards/business-owner.guard';
import { BusinessPromotionsService } from '../services/business-promotions.service';
import { CreatePromotionDto } from '../dto/create-promotion.dto';
import { UpdatePromotionDto } from '../dto/update-promotion.dto';
import { CreateVoucherDto } from '../dto/create-voucher.dto';
import { GenerateQrDto } from '../dto/generate-qr.dto';

@ApiTags('Business - Sales & Promotions')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, BusinessOwnerGuard)
@Controller('dashboard/sales')
export class BusinessPromotionsController {
  constructor(private readonly promotionsService: BusinessPromotionsService) {}

  @Get('summary')
  @ApiOperation({ summary: 'Sales dashboard KPIs' })
  getSummary(@Req() req: any) {
    return this.promotionsService.getSummary(req.businessId);
  }

  @Get('promotions')
  @ApiOperation({ summary: 'Promotion list' })
  @ApiQuery({ name: 'status', required: false })
  @ApiQuery({ name: 'type', required: false })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  getPromotions(
    @Req() req: any,
    @Query('status') status?: string,
    @Query('type') type?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.promotionsService.getPromotions(req.businessId, {
      status, type,
      page: page ? Number(page) : 1,
      limit: limit ? Number(limit) : 20,
    });
  }

  @Post('promotions')
  @ApiOperation({ summary: 'Create promotion' })
  createPromotion(@Req() req: any, @Body() dto: CreatePromotionDto) {
    return this.promotionsService.createPromotion(req.businessId, dto);
  }

  @Put('promotions/:id')
  @ApiOperation({ summary: 'Update/pause promotion' })
  updatePromotion(@Req() req: any, @Param('id') id: string, @Body() dto: UpdatePromotionDto) {
    return this.promotionsService.updatePromotion(req.businessId, id, dto);
  }

  @Get('vouchers')
  @ApiOperation({ summary: 'Voucher list' })
  @ApiQuery({ name: 'status', required: false })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  getVouchers(
    @Req() req: any,
    @Query('status') status?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.promotionsService.getVouchers(req.businessId, {
      status,
      page: page ? Number(page) : 1,
      limit: limit ? Number(limit) : 20,
    });
  }

  @Post('vouchers')
  @ApiOperation({ summary: 'Create voucher' })
  createVoucher(@Req() req: any, @Body() dto: CreateVoucherDto) {
    return this.promotionsService.createVoucher(req.businessId, dto);
  }

  @Get('qr')
  @ApiOperation({ summary: 'QR list' })
  getQrCodes(@Req() req: any) {
    return this.promotionsService.getQrCodes(req.businessId);
  }

  @Post('qr/generate')
  @ApiOperation({ summary: 'Generate QR' })
  generateQrCode(@Req() req: any, @Body() dto: GenerateQrDto) {
    return this.promotionsService.generateQrCode(req.businessId, dto);
  }
}
