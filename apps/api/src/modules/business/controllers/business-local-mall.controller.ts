import { Controller, Get, Post, Put, Delete, Param, Body, Query, Req, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { BusinessOwnerGuard } from '../guards/business-owner.guard';
import { BusinessLocalMallService } from '../services/business-local-mall.service';
import { CreatePartnershipRequestDto } from '../dto/create-partnership-request.dto';
import { UpdatePartnershipDto } from '../dto/update-partnership.dto';
import { CreateSharedCampaignDto } from '../dto/create-shared-campaign.dto';
import { UpdateVisibilityDto } from '../dto/update-visibility.dto';
import { CreateVisibilityBoostDto } from '../dto/create-visibility-boost.dto';
import { ActivateBusinessDto } from '../dto/activate-business.dto';
import { JoinClusterDto } from '../dto/join-cluster.dto';
import { CreateExpoBoothDto } from '../dto/create-expo-booth.dto';

@ApiTags('Business - Local Mall')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, BusinessOwnerGuard)
@Controller('business/local-mall')
export class BusinessLocalMallController {
  constructor(private readonly localMallService: BusinessLocalMallService) {}

  @Get('high-street')
  @ApiOperation({ summary: 'High street overview' })
  getHighStreet(@Req() req: any) {
    return this.localMallService.getHighStreet(req.businessId);
  }

  @Get('map')
  @ApiOperation({ summary: 'Map data for businesses' })
  getMap(@Req() req: any) {
    return this.localMallService.getMap(req.businessId);
  }

  @Get('partnerships')
  @ApiOperation({ summary: 'Partnership list' })
  getPartnerships(@Req() req: any) {
    return this.localMallService.getPartnerships(req.businessId);
  }

  @Post('partnerships/request')
  @ApiOperation({ summary: 'Send partnership request' })
  requestPartnership(@Req() req: any, @Body() dto: CreatePartnershipRequestDto) {
    return this.localMallService.requestPartnership(req.businessId, dto);
  }

  @Put('partnerships/:id')
  @ApiOperation({ summary: 'Update partnership' })
  updatePartnership(@Req() req: any, @Param('id') id: string, @Body() dto: UpdatePartnershipDto) {
    return this.localMallService.updatePartnership(req.businessId, id, dto);
  }

  @Delete('partnerships/:id')
  @ApiOperation({ summary: 'End partnership' })
  removePartnership(@Req() req: any, @Param('id') id: string) {
    return this.localMallService.removePartnership(req.businessId, id);
  }

  @Get('share-campaigns')
  @ApiOperation({ summary: 'Shared campaign list' })
  getSharedCampaigns(@Req() req: any) {
    return this.localMallService.getSharedCampaigns(req.businessId);
  }

  @Post('share-campaigns')
  @ApiOperation({ summary: 'Create shared campaign' })
  createSharedCampaign(@Req() req: any, @Body() dto: CreateSharedCampaignDto) {
    return this.localMallService.createSharedCampaign(req.businessId, dto);
  }

  @Get('visibility')
  @ApiOperation({ summary: 'Get visibility settings' })
  getVisibility(@Req() req: any) {
    return this.localMallService.getVisibility(req.businessId);
  }

  @Put('visibility')
  @ApiOperation({ summary: 'Update visibility settings' })
  updateVisibility(@Req() req: any, @Body() dto: UpdateVisibilityDto) {
    return this.localMallService.updateVisibility(req.businessId, dto);
  }

  @Post('visibility/boost')
  @ApiOperation({ summary: 'Activate visibility boost' })
  createVisibilityBoost(@Req() req: any, @Body() dto: CreateVisibilityBoostDto) {
    return this.localMallService.createVisibilityBoost(req.businessId, dto);
  }

  @Get('community')
  @ApiOperation({ summary: 'Community activation data' })
  getCommunity(@Req() req: any) {
    return this.localMallService.getCommunity(req.businessId);
  }

  @Post('community/activate')
  @ApiOperation({ summary: 'Activate a business' })
  activateBusiness(@Req() req: any, @Body() dto: ActivateBusinessDto) {
    return this.localMallService.activateBusiness(req.businessId, dto);
  }

  @Get('clusters')
  @ApiOperation({ summary: 'Storefront clusters' })
  getClusters(@Req() req: any) {
    return this.localMallService.getClusters(req.businessId);
  }

  @Post('clusters/join')
  @ApiOperation({ summary: 'Join cluster' })
  joinCluster(@Req() req: any, @Body() dto: JoinClusterDto) {
    return this.localMallService.joinCluster(req.businessId, dto);
  }

  @Get('expo')
  @ApiOperation({ summary: 'Expo opportunities' })
  getExpo(@Req() req: any) {
    return this.localMallService.getExpo(req.businessId);
  }

  @Post('expo/booth')
  @ApiOperation({ summary: 'Create booth' })
  createExpoBooth(@Req() req: any, @Body() dto: CreateExpoBoothDto) {
    return this.localMallService.createExpoBooth(req.businessId, dto);
  }

  @Get('hub')
  @ApiOperation({ summary: 'Hub information' })
  getHub(@Req() req: any) {
    return this.localMallService.getHub(req.businessId);
  }

  @Get('notifications')
  @ApiOperation({ summary: 'Local mall notifications' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  getNotifications(@Req() req: any, @Query('page') page?: string, @Query('limit') limit?: string) {
    return this.localMallService.getNotifications(req.businessId, { page: page ? Number(page) : 1, limit });
  }
}
