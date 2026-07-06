import { Controller, Get, Post, Body, Query, Req, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { BusinessOwnerGuard } from '../guards/business-owner.guard';
import { BusinessSalesSettingsService } from '../services/business-sales-settings.service';
import { RegisterBusinessActivationDto } from '../dto/register-business-activation.dto';
import { CreateAutomationDto } from '../dto/create-automation.dto';
import { AiSuggestDto } from '../dto/ai-suggest.dto';
import { SendNotificationDto } from '../dto/send-notification.dto';

@ApiTags('Business - Sales Settings')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, BusinessOwnerGuard)
@Controller('dashboard/sales')
export class BusinessSalesSettingsController {
  constructor(private readonly salesSettingsService: BusinessSalesSettingsService) {}

  @Get('activation')
  @ApiOperation({ summary: 'Activation dashboard' })
  getActivationDashboard(@Req() req: any) {
    return this.salesSettingsService.getActivationDashboard(req.businessId);
  }

  @Post('activation/register')
  @ApiOperation({ summary: 'Register a business' })
  registerBusiness(@Req() req: any, @Body() dto: RegisterBusinessActivationDto) {
    return this.salesSettingsService.registerBusiness(req.businessId, dto);
  }

  @Get('analytics')
  @ApiOperation({ summary: 'Sales analytics' })
  @ApiQuery({ name: 'period', required: false })
  getAnalytics(@Req() req: any, @Query('period') period?: string) {
    return this.salesSettingsService.getAnalytics(req.businessId, { period });
  }

  @Get('automations')
  @ApiOperation({ summary: 'Automation list' })
  getAutomations(@Req() req: any) {
    return this.salesSettingsService.getAutomations(req.businessId);
  }

  @Post('automations')
  @ApiOperation({ summary: 'Create automation' })
  createAutomation(@Req() req: any, @Body() dto: CreateAutomationDto) {
    return this.salesSettingsService.createAutomation(req.businessId, dto);
  }

  @Post('ai/suggest')
  @ApiOperation({ summary: 'Get AI suggestions' })
  getAiSuggestions(@Req() req: any, @Body() dto: AiSuggestDto) {
    return this.salesSettingsService.getAiSuggestions(req.businessId, dto);
  }

  @Get('interest')
  @ApiOperation({ summary: 'Interest signals' })
  getInterestSignals(@Req() req: any) {
    return this.salesSettingsService.getInterestSignals(req.businessId);
  }

  @Get('live')
  @ApiOperation({ summary: 'Live monitoring' })
  getLiveMonitoring(@Req() req: any) {
    return this.salesSettingsService.getLiveMonitoring(req.businessId);
  }

  @Post('notifications')
  @ApiOperation({ summary: 'Send sales notification' })
  sendSalesNotification(@Req() req: any, @Body() dto: SendNotificationDto) {
    return this.salesSettingsService.sendSalesNotification(req.businessId, dto);
  }
}
