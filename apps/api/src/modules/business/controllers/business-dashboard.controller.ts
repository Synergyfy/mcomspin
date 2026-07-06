import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { Request } from 'express';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { BusinessOwnerGuard } from '../guards/business-owner.guard';
import { BusinessDashboardService } from '../services/business-dashboard.service';

@ApiTags('Business - Dashboard')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, BusinessOwnerGuard)
@Controller('dashboard')
export class BusinessDashboardController {
  constructor(private readonly businessDashboardService: BusinessDashboardService) {}

  @Get('summary')
  @ApiOperation({ summary: 'Get business dashboard KPIs' })
  getSummary(@Req() req: any) {
    return this.businessDashboardService.getSummary(req.businessId);
  }
}
