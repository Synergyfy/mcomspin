import { Controller, Get, Post, Put, Param, Body, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { Role } from '../../../common/constants/roles.constant';
import { SuperAdminGuard } from '../../admin/guards/super-admin.guard';
import { MallCampaignsService } from '../services/mall-campaigns.service';
import { CreateCampaignDto } from '../dto/create-campaign.dto';
import { UpdateCampaignDto } from '../dto/update-campaign.dto';

@ApiTags('Mall Admin - Campaigns')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard, SuperAdminGuard)
@Roles(Role.SuperAdmin)
@Controller('admin/mall/campaigns')
export class MallCampaignsController {
  constructor(private readonly mallCampaignsService: MallCampaignsService) {}

  @Get()
  @ApiOperation({ summary: 'List all campaigns (mall-scoped)' })
  @ApiQuery({ name: 'status', required: false })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'boroughId', required: false })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  findAll(
    @Query('status') status?: string,
    @Query('search') search?: string,
    @Query('boroughId') boroughId?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.mallCampaignsService.findAll({ status, search, boroughId, page, limit });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get campaign detail' })
  findOne(@Param('id') id: string) {
    return this.mallCampaignsService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a campaign' })
  create(@Body() dto: CreateCampaignDto) {
    return this.mallCampaignsService.create(dto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a campaign' })
  update(@Param('id') id: string, @Body() dto: UpdateCampaignDto) {
    return this.mallCampaignsService.update(id, dto);
  }
}
