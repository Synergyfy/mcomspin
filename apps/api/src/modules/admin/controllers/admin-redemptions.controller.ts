import { Controller, Get, Put, Param, Body, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { Role } from '../../../common/constants/roles.constant';
import { SuperAdminGuard } from '../guards/super-admin.guard';
import { AdminRedemptionsService } from '../services/admin-redemptions.service';
import { RedemptionActionDto } from '../dto/redemption-action.dto';

@ApiTags('Admin - Redemptions')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard, SuperAdminGuard)
@Roles(Role.SuperAdmin)
@Controller('admin/redemptions')
export class AdminRedemptionsController {
  constructor(private readonly adminRedemptionsService: AdminRedemptionsService) {}

  @Get()
  @ApiOperation({ summary: 'List all redemptions' })
  @ApiQuery({ name: 'status', required: false })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  findAll(@Query() query: { status?: string; page?: string; limit?: string }) {
    return this.adminRedemptionsService.findAll({
      status: query.status,
      page: query.page ? Number(query.page) : 1,
      limit: query.limit ? Number(query.limit) : 20,
    });
  }

  @Put(':id')
  @ApiOperation({ summary: 'Approve or reject redemption' })
  update(@Param('id') id: string, @Body() dto: RedemptionActionDto) {
    return this.adminRedemptionsService.update(id, dto);
  }
}
