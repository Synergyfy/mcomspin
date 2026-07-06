import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { Role } from '../../../common/constants/roles.constant';
import { SuperAdminGuard } from '../../admin/guards/super-admin.guard';
import { MallDashboardService } from '../services/mall-dashboard.service';
import { MallOperationsService } from '../services/mall-operations.service';

@ApiTags('Mall Admin - Dashboard')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard, SuperAdminGuard)
@Roles(Role.SuperAdmin)
@Controller('admin/mall')
export class MallDashboardController {
  constructor(
    private readonly mallDashboardService: MallDashboardService,
    private readonly mallOperationsService: MallOperationsService,
  ) {}

  @Get('dashboard/kpis')
  @ApiOperation({ summary: 'Get mall admin dashboard KPIs' })
  getDashboardKpis() {
    return this.mallDashboardService.getDashboardKpis();
  }

  @Get('dashboard/activity')
  @ApiOperation({ summary: 'Get live activity feed' })
  getActivityFeed(@Query('limit') limit?: number) {
    return this.mallDashboardService.getActivityFeed(limit);
  }

  @Get('analytics')
  @ApiOperation({ summary: 'Get analytics data' })
  getAnalytics(@Query('period') period?: string, @Query('boroughId') boroughId?: string) {
    return this.mallOperationsService.getAnalytics({ period, boroughId });
  }

  @Get('settings')
  @ApiOperation({ summary: 'Get mall settings' })
  getSettings() {
    return this.mallDashboardService.getSettings();
  }
}
