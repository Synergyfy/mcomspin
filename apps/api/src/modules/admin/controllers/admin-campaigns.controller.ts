import { Controller, Get, Post, Put, Delete, Param, Body, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { Role } from '../../../common/constants/roles.constant';
import { SuperAdminGuard } from '../guards/super-admin.guard';
import { AdminCampaignsService } from '../services/admin-campaigns.service';
import { CreateCampaignDto } from '../dto/create-campaign.dto';
import { UpdateCampaignDto } from '../dto/update-campaign.dto';

@ApiTags('Admin - Campaigns')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard, SuperAdminGuard)
@Roles(Role.SuperAdmin)
@Controller('admin/campaigns')
export class AdminCampaignsController {
  constructor(private readonly adminCampaignsService: AdminCampaignsService) {}

  @Get()
  @ApiOperation({ summary: 'List all campaigns' })
  @ApiQuery({ name: 'status', required: false })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  findAll(@Query() query: { status?: string; search?: string; page?: string; limit?: string }) {
    return this.adminCampaignsService.findAll({
      status: query.status,
      search: query.search,
      page: query.page ? Number(query.page) : 1,
      limit: query.limit ? Number(query.limit) : 20,
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get campaign detail' })
  findOne(@Param('id') id: string) {
    return this.adminCampaignsService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a campaign' })
  create(@Body() dto: CreateCampaignDto) {
    return this.adminCampaignsService.create(dto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a campaign' })
  update(@Param('id') id: string, @Body() dto: UpdateCampaignDto) {
    return this.adminCampaignsService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a campaign (soft)' })
  remove(@Param('id') id: string) {
    return this.adminCampaignsService.remove(id);
  }
}
