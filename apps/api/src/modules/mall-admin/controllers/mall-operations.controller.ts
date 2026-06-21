import { Controller, Get, Post, Put, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { Role } from '../../../common/constants/roles.constant';
import { SuperAdminGuard } from '../../admin/guards/super-admin.guard';
import { MallOperationsService } from '../services/mall-operations.service';

@ApiTags('Mall Admin - Operations')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard, SuperAdminGuard)
@Roles(Role.SuperAdmin)
@Controller('admin/mall')
export class MallOperationsController {
  constructor(private readonly mallOperationsService: MallOperationsService) {}

  // Billing
  @Get('billing')
  @ApiOperation({ summary: 'Get billing overview' })
  getBilling() {
    return this.mallOperationsService.getBillingOverview();
  }

  // Team
  @Get('team')
  @ApiOperation({ summary: 'List admin team' })
  getTeam() {
    return this.mallOperationsService.getTeam();
  }

  @Post('team/invite')
  @ApiOperation({ summary: 'Invite team member' })
  inviteTeamMember(@Body() dto: { email: string; firstName: string; lastName: string; role: string }) {
    return this.mallOperationsService.inviteTeamMember(dto);
  }

  @Put('team/:id')
  @ApiOperation({ summary: 'Update team member' })
  updateTeamMember(@Param('id') id: string, @Body() dto: { role?: string; isActive?: boolean }) {
    return this.mallOperationsService.updateTeamMember(id, dto);
  }

  // Support
  @Get('support/tickets')
  @ApiOperation({ summary: 'List support tickets' })
  getSupportTickets(@Query('page') page?: number, @Query('limit') limit?: number) {
    return this.mallOperationsService.getSupportTickets({ page, limit });
  }

  @Put('support/tickets/:id')
  @ApiOperation({ summary: 'Update support ticket' })
  updateSupportTicket(@Param('id') id: string, @Body() dto: { status?: string; moderatorId?: string }) {
    return this.mallOperationsService.updateSupportTicket(id, dto);
  }
}
