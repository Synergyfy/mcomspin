import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { BusinessOwnerGuard } from '../../business/guards/business-owner.guard';
import { BillingService } from '../services/billing.service';

@ApiTags('Billing')
@ApiBearerAuth()
@Controller()
export class BillingController {
  constructor(private readonly billingService: BillingService) {}

  // Business owner endpoints
  @UseGuards(JwtAuthGuard, BusinessOwnerGuard)
  @Get('business/billing/subscription')
  @ApiOperation({ summary: 'Get business subscription' })
  getSubscription(@Req() req: any) {
    return this.billingService.getSubscription(req.businessId);
  }

  @UseGuards(JwtAuthGuard, BusinessOwnerGuard)
  @Post('business/billing/subscription/change')
  @ApiOperation({ summary: 'Change subscription plan' })
  changePlan(@Req() req: any, @Body() dto: { planType: any }) {
    return this.billingService.changePlan(req.businessId, dto.planType);
  }

  @UseGuards(JwtAuthGuard, BusinessOwnerGuard)
  @Post('business/billing/subscription/cancel')
  @ApiOperation({ summary: 'Cancel subscription' })
  cancelSubscription(@Req() req: any) {
    return this.billingService.cancelSubscription(req.businessId);
  }

  @UseGuards(JwtAuthGuard, BusinessOwnerGuard)
  @Get('business/billing/payment-methods')
  @ApiOperation({ summary: 'List payment methods' })
  getPaymentMethods(@Req() req: any) {
    return this.billingService.getPaymentMethods(req.businessId);
  }

  @UseGuards(JwtAuthGuard, BusinessOwnerGuard)
  @Post('business/billing/payment-methods')
  @ApiOperation({ summary: 'Add payment method' })
  addPaymentMethod(@Req() req: any, @Body() dto: any) {
    return this.billingService.addPaymentMethod(req.businessId, dto);
  }

  @UseGuards(JwtAuthGuard, BusinessOwnerGuard)
  @Delete('business/billing/payment-methods/:id')
  @ApiOperation({ summary: 'Remove payment method' })
  removePaymentMethod(@Req() req: any, @Param('id') id: string) {
    return this.billingService.removePaymentMethod(req.businessId, id);
  }

  @UseGuards(JwtAuthGuard, BusinessOwnerGuard)
  @Put('business/billing/payment-methods/:id/default')
  @ApiOperation({ summary: 'Set default payment method' })
  setDefaultPaymentMethod(@Req() req: any, @Param('id') id: string) {
    return this.billingService.setDefaultPaymentMethod(req.businessId, id);
  }

  @UseGuards(JwtAuthGuard, BusinessOwnerGuard)
  @Get('business/billing/invoices')
  @ApiOperation({ summary: 'List invoices' })
  getInvoices(@Req() req: any, @Query('page') page?: number, @Query('limit') limit?: number) {
    return this.billingService.getInvoices(req.businessId, page || 1, limit || 20);
  }

  @UseGuards(JwtAuthGuard, BusinessOwnerGuard)
  @Get('business/billing/invoices/:id')
  @ApiOperation({ summary: 'Get invoice details' })
  getInvoiceById(@Param('id') id: string) {
    return this.billingService.getInvoiceById(id);
  }

  @UseGuards(JwtAuthGuard, BusinessOwnerGuard)
  @Post('business/billing/invoices/:id/pay')
  @ApiOperation({ summary: 'Pay invoice' })
  payInvoice(@Req() req: any, @Param('id') id: string) {
    return this.billingService.payInvoice(req.businessId, id);
  }

  @UseGuards(JwtAuthGuard, BusinessOwnerGuard)
  @Get('business/billing/transactions')
  @ApiOperation({ summary: 'Get transaction history' })
  getTransactions(@Req() req: any, @Query('page') page?: number, @Query('limit') limit?: number) {
    return this.billingService.getTransactions(req.businessId, page || 1, limit || 20);
  }

  // Public endpoints
  @Get('billing/plans')
  @ApiOperation({ summary: 'List available plans' })
  getPlans() {
    return this.billingService.getPlans();
  }
}
