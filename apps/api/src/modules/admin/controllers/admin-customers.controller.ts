import { Controller, Get, Put, Param, Body, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { Role } from '../../../common/constants/roles.constant';
import { SuperAdminGuard } from '../guards/super-admin.guard';
import { AdminCustomersService } from '../services/admin-customers.service';
import { CustomerActionDto } from '../dto/customer-action.dto';

@ApiTags('Admin - Customers')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard, SuperAdminGuard)
@Roles(Role.SuperAdmin)
@Controller('admin/customers')
export class AdminCustomersController {
  constructor(private readonly adminCustomersService: AdminCustomersService) {}

  @Get()
  @ApiOperation({ summary: 'List all customers' })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'status', required: false })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  findAll(@Query() query: { search?: string; status?: string; page?: string; limit?: string }) {
    return this.adminCustomersService.findAll({
      search: query.search,
      status: query.status,
      page: query.page ? Number(query.page) : 1,
      limit: query.limit ? Number(query.limit) : 20,
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get customer profile' })
  findOne(@Param('id') id: string) {
    return this.adminCustomersService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Suspend or activate customer' })
  updateStatus(@Param('id') id: string, @Body() dto: CustomerActionDto) {
    return this.adminCustomersService.updateStatus(id, dto);
  }
}
