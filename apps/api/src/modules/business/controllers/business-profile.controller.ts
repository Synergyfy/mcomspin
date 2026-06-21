import { Controller, Get, Put, Post, Delete, Body, Param, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { BusinessOwnerGuard } from '../guards/business-owner.guard';
import { BusinessProfileService } from '../services/business-profile.service';
import { UpdateBusinessProfileDto } from '../dto/business-profile.dto';
import { UpdateBusinessSettingsDto } from '../dto/update-settings.dto';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';

@ApiTags('Business - Profile')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, BusinessOwnerGuard)
@Controller('business')
export class BusinessProfileController {
  constructor(private readonly businessProfileService: BusinessProfileService) {}

  @Get('profile')
  @ApiOperation({ summary: 'Get business profile' })
  getProfile(@Req() req: any) {
    return this.businessProfileService.getProfile(req.businessId);
  }

  @Put('profile')
  @ApiOperation({ summary: 'Update business profile' })
  updateProfile(@Req() req: any, @Body() dto: UpdateBusinessProfileDto) {
    return this.businessProfileService.updateProfile(req.businessId, dto);
  }

  @Put('settings')
  @ApiOperation({ summary: 'Update business settings' })
  updateSettings(@CurrentUser('id') userId: string, @Req() req: any, @Body() dto: UpdateBusinessSettingsDto) {
    return this.businessProfileService.updateSettings(userId, req.businessId, dto);
  }

  @Get('billing')
  @ApiOperation({ summary: 'Get billing info and invoices' })
  getBilling(@Req() req: any) {
    return this.businessProfileService.getBilling(req.businessId);
  }

  // Settings sub-endpoints
  @Put('settings/account/email')
  @ApiOperation({ summary: 'Update business email' })
  updateEmail(@Req() req: any, @Body() dto: { email: string }) {
    return this.businessProfileService.updateEmail(req.businessId, dto.email);
  }

  @Put('settings/account/password')
  @ApiOperation({ summary: 'Update password' })
  updatePassword(@CurrentUser('id') userId: string, @Body() dto: { currentPassword: string; newPassword: string }) {
    return this.businessProfileService.updatePassword(userId, dto);
  }

  @Get('settings/account/security')
  @ApiOperation({ summary: 'Get security info' })
  getSecurity(@Req() req: any) {
    return this.businessProfileService.getSecurity(req.businessId);
  }

  @Post('settings/account/logout-devices')
  @ApiOperation({ summary: 'Logout all devices' })
  logoutDevices(@CurrentUser('id') userId: string) {
    return this.businessProfileService.logoutAllDevices(userId);
  }

  @Get('settings/notifications')
  @ApiOperation({ summary: 'Get notification preferences' })
  getNotificationPrefs(@Req() req: any) {
    return this.businessProfileService.getNotificationPrefs(req.businessId);
  }

  @Put('settings/notifications')
  @ApiOperation({ summary: 'Update notification preferences' })
  updateNotificationPrefs(@Req() req: any, @Body() dto: any) {
    return this.businessProfileService.updateNotificationPrefs(req.businessId, dto);
  }

  @Get('settings/integrations')
  @ApiOperation({ summary: 'List integrations' })
  getIntegrations(@Req() req: any) {
    return this.businessProfileService.getIntegrations(req.businessId);
  }

  @Post('settings/integrations/google')
  @ApiOperation({ summary: 'Connect Google' })
  connectGoogle(@Req() req: any, @Body() dto: { googleBusinessId: string }) {
    return this.businessProfileService.connectGoogleIntegration(req.businessId, dto.googleBusinessId);
  }

  @Post('settings/integrations/payment')
  @ApiOperation({ summary: 'Connect payment gateway' })
  connectPayment(@Req() req: any, @Body() dto: { provider: string; accountId: string }) {
    return this.businessProfileService.connectPayment(req.businessId, dto);
  }

  @Delete('settings/integrations/:id')
  @ApiOperation({ summary: 'Disconnect integration' })
  disconnectIntegration(@Req() req: any, @Param('id') id: string) {
    return this.businessProfileService.disconnectIntegration(req.businessId, id);
  }

  @Get('settings/billing/invoices')
  @ApiOperation({ summary: 'List invoices' })
  getInvoices(@Req() req: any) {
    return this.businessProfileService.getInvoices(req.businessId);
  }

  @Get('settings/billing/transactions')
  @ApiOperation({ summary: 'Get transaction history' })
  getTransactions(@Req() req: any) {
    return this.businessProfileService.getTransactions(req.businessId);
  }

  @Put('settings/billing/payment-method')
  @ApiOperation({ summary: 'Update payment method' })
  updatePaymentMethod(@Req() req: any, @Body() dto: any) {
    return this.businessProfileService.updatePaymentMethod(req.businessId, dto);
  }

  @Post('settings/billing/pay-invoice')
  @ApiOperation({ summary: 'Pay invoice' })
  payInvoice(@Req() req: any, @Body() dto: { invoiceId: string }) {
    return this.businessProfileService.payInvoice(req.businessId, dto.invoiceId);
  }

  @Post('settings/deactivate')
  @ApiOperation({ summary: 'Pause or delete account' })
  deactivateAccount(@Req() req: any, @Body() dto: { action: 'pause' | 'delete'; password: string }) {
    return this.businessProfileService.deactivateAccount(req.businessId, dto);
  }
}
