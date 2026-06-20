import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { BusinessOwnerGuard } from '../guards/business-owner.guard';
import { BusinessAnalyticsService } from '../services/business-analytics.service';

@ApiTags('Business - Analytics')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, BusinessOwnerGuard)
@Controller('business/analytics')
export class BusinessAnalyticsController {
  constructor(private readonly businessAnalyticsService: BusinessAnalyticsService) {}

  @Get()
  @ApiOperation({ summary: 'Get business analytics' })
  getAnalytics(@Req() req: any) {
    return this.businessAnalyticsService.getAnalytics(req.businessId);
  }
}
