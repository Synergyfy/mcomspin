import { Controller, Get, Post, Body, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { Role } from '../../../common/constants/roles.constant';
import { SuperAdminGuard } from '../../admin/guards/super-admin.guard';
import { MallCommunityService } from '../services/mall-community.service';

@ApiTags('Mall Admin - Community')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard, SuperAdminGuard)
@Roles(Role.SuperAdmin)
@Controller('admin/mall')
export class MallCommunityController {
  constructor(private readonly mallCommunityService: MallCommunityService) {}

  @Get('community')
  @ApiOperation({ summary: 'Get community activity feed' })
  getCommunityFeed(@Query('page') page?: number, @Query('limit') limit?: number) {
    return this.mallCommunityService.getCommunityFeed({ page, limit });
  }

  @Post('notifications')
  @ApiOperation({ summary: 'Send notification' })
  sendNotification(@Body() dto: { title: string; message: string; audience: string; boroughId?: string; type?: string }) {
    return this.mallCommunityService.sendNotification(dto);
  }

  @Get('automations')
  @ApiOperation({ summary: 'List automations' })
  getAutomations(@Query('page') page?: number, @Query('limit') limit?: number) {
    return this.mallCommunityService.getAutomations({ page, limit });
  }

  @Post('automations')
  @ApiOperation({ summary: 'Create automation' })
  createAutomation(@Body() dto: any) {
    return this.mallCommunityService.createAutomation(dto);
  }
}
