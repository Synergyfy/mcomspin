import { Controller, Get, Put, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { Role } from '../../../common/constants/roles.constant';
import { SuperAdminGuard } from '../../admin/guards/super-admin.guard';
import { MallModerationService } from '../services/mall-moderation.service';

@ApiTags('Mall Admin - Moderation')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard, SuperAdminGuard)
@Roles(Role.SuperAdmin)
@Controller('admin/mall')
export class MallModerationController {
  constructor(private readonly mallModerationService: MallModerationService) {}

  @Get('moderation/reports')
  @ApiOperation({ summary: 'List moderation reports' })
  getReports(
    @Query('status') status?: string,
    @Query('severity') severity?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.mallModerationService.getReports({ status, severity, page, limit });
  }

  @Put('moderation/reports/:id')
  @ApiOperation({ summary: 'Take moderation action' })
  takeAction(@Param('id') id: string, @Body() dto: { action: string; performedBy: string; reason?: string }) {
    return this.mallModerationService.takeAction(id, dto);
  }

  @Get('moderation/fraud')
  @ApiOperation({ summary: 'Get fraud alerts' })
  getFraudAlerts() {
    return this.mallModerationService.getFraudAlerts();
  }
}
