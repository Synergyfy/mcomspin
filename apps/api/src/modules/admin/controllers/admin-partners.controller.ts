import { Controller, Get, Post, Put, Param, Body, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { Role } from '../../../common/constants/roles.constant';
import { SuperAdminGuard } from '../guards/super-admin.guard';
import { AdminPartnersService } from '../services/admin-partners.service';
import { CreatePartnerDto } from '../dto/create-partner.dto';
import { UpdatePartnerDto } from '../dto/update-partner.dto';

@ApiTags('Admin - Partners')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard, SuperAdminGuard)
@Roles(Role.SuperAdmin)
@Controller('admin/partners')
export class AdminPartnersController {
  constructor(private readonly adminPartnersService: AdminPartnersService) {}

  @Get()
  @ApiOperation({ summary: 'List all partners' })
  @ApiQuery({ name: 'role', required: false })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  findAll(@Query() query: { role?: string; page?: string; limit?: string }) {
    return this.adminPartnersService.findAll({
      role: query.role,
      page: query.page ? Number(query.page) : 1,
      limit: query.limit ? Number(query.limit) : 20,
    });
  }

  @Post()
  @ApiOperation({ summary: 'Create a partner' })
  create(@Body() dto: CreatePartnerDto) {
    return this.adminPartnersService.create(dto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a partner' })
  update(@Param('id') id: string, @Body() dto: UpdatePartnerDto) {
    return this.adminPartnersService.update(id, dto);
  }
}
