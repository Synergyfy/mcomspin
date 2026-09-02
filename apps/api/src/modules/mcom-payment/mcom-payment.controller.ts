import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { BusinessOwnerGuard } from '../business/guards/business-owner.guard';
import { McomPaymentService } from './mcom-payment.service';
import {
  InitiatePurchaseDto,
  ConfirmPurchaseDto,
  CapturePurchaseDto,
} from './dto/purchase.dto';

@ApiTags('Business - Billing (MCOM Payment)')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, BusinessOwnerGuard)
@Controller('business/billing')
export class McomPaymentController {
  constructor(private readonly mcomPaymentService: McomPaymentService) {}

  @Post('purchase/initiate')
  @ApiOperation({ summary: 'Initiate a plan purchase via MCOM Solutions (Stripe client secret or PayPal approval URL)' })
  initiate(@Req() req: any, @Body() dto: InitiatePurchaseDto) {
    return this.mcomPaymentService.initiate(req.user.id, dto);
  }

  @Post('purchase/confirm')
  @ApiOperation({ summary: 'Confirm a settled Stripe payment and activate the plan' })
  confirm(@Req() req: any, @Body() dto: ConfirmPurchaseDto) {
    return this.mcomPaymentService.confirmStripe(req.user.id, req.businessId, dto);
  }

  @Post('purchase/capture')
  @ApiOperation({ summary: 'Capture an approved PayPal order and activate the plan' })
  capture(@Req() req: any, @Body() dto: CapturePurchaseDto) {
    return this.mcomPaymentService.capturePaypal(req.user.id, req.businessId, dto);
  }
}