import { Controller, Get, Put, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { Role } from '../../../common/constants/roles.constant';
import { SuperAdminGuard } from '../../admin/guards/super-admin.guard';
import { MallMembershipsService } from '../services/mall-memberships.service';

@ApiTags('Mall Admin - Memberships')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard, SuperAdminGuard)
@Roles(Role.SuperAdmin)
@Controller('admin/mall')
export class MallMembershipsController {
  constructor(private readonly mallMembershipsService: MallMembershipsService) {}

  @Get('memberships')
  @ApiOperation({ summary: 'List memberships' })
  getMemberships(@Query('tier') tier?: string, @Query('page') page?: number, @Query('limit') limit?: number) {
    return this.mallMembershipsService.getMemberships({ tier, page, limit });
  }

  @Put('memberships/:id')
  @ApiOperation({ summary: 'Update membership' })
  updateMembership(@Param('id') id: string, @Body() dto: { tier?: string; isActive?: boolean; expiresAt?: string }) {
    return this.mallMembershipsService.updateMembership(id, dto);
  }

  @Get('audits')
  @ApiOperation({ summary: 'List audits' })
  getAudits(@Query('page') page?: number, @Query('limit') limit?: number) {
    return this.mallMembershipsService.getAudits({ page, limit });
  }

  @Get('recommendations')
  @ApiOperation({ summary: 'List improvement recommendations' })
  getRecommendations(@Query('page') page?: number, @Query('limit') limit?: number) {
    return this.mallMembershipsService.getRecommendations({ page, limit });
  }
}
