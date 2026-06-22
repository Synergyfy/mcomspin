import { Controller, Get, Post, Put, Delete, Param, Body, Query, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { BusinessOwnerGuard } from '../guards/business-owner.guard';
import { BusinessCampaignsService } from '../services/business-campaigns.service';
import { CreateCampaignDto } from '../../admin/dto/create-campaign.dto';
import { UpdateCampaignDto } from '../../admin/dto/update-campaign.dto';

@ApiTags('Business - Campaigns')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, BusinessOwnerGuard)
@Controller('business/campaigns')
export class BusinessCampaignsController {
  constructor(private readonly businessCampaignsService: BusinessCampaignsService) {}

  @Get()
  @ApiOperation({ summary: 'List business campaigns' })
  @ApiQuery({ name: 'status', required: false })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  findAll(@Req() req: any, @Query() query: { status?: string; page?: string; limit?: string }) {
    return this.businessCampaignsService.findAll(req.businessId, {
      status: query.status,
      page: query.page ? Number(query.page) : 1,
      limit: query.limit ? Number(query.limit) : 20,
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get campaign detail' })
  findOne(@Req() req: any, @Param('id') id: string) {
    return this.businessCampaignsService.findOne(req.businessId, id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a campaign' })
  create(@Req() req: any, @Body() dto: CreateCampaignDto) {
    return this.businessCampaignsService.create(req.businessId, dto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a campaign' })
  update(@Req() req: any, @Param('id') id: string, @Body() dto: UpdateCampaignDto) {
    return this.businessCampaignsService.update(req.businessId, id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a campaign' })
  remove(@Req() req: any, @Param('id') id: string) {
    return this.businessCampaignsService.remove(req.businessId, id);
  }
}
