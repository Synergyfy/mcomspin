import { Controller, Get, Put, Param, Body, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { Role } from '../../../common/constants/roles.constant';
import { SuperAdminGuard } from '../guards/super-admin.guard';
import { AdminBusinessesService } from '../services/admin-businesses.service';
import { BusinessActionDto } from '../dto/business-action.dto';

@ApiTags('Admin - Businesses')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard, SuperAdminGuard)
@Roles(Role.SuperAdmin)
@Controller('admin/businesses')
export class AdminBusinessesController {
  constructor(private readonly adminBusinessesService: AdminBusinessesService) {}

  @Get()
  @ApiOperation({ summary: 'List all businesses' })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'status', required: false })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  findAll(@Query() query: { search?: string; status?: string; page?: string; limit?: string }) {
    return this.adminBusinessesService.findAll({
      search: query.search,
      status: query.status,
      page: query.page ? Number(query.page) : 1,
      limit: query.limit ? Number(query.limit) : 20,
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get business profile detail' })
  findOne(@Param('id') id: string) {
    return this.adminBusinessesService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Approve, suspend, or activate business' })
  updateStatus(@Param('id') id: string, @Body() dto: BusinessActionDto) {
    return this.adminBusinessesService.updateStatus(id, dto);
  }
}
