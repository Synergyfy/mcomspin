import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { Role } from '../../../common/constants/roles.constant';
import { SuperAdminGuard } from '../../admin/guards/super-admin.guard';
import { MallMarketingService } from '../services/mall-marketing.service';

@ApiTags('Mall Admin - Marketing')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard, SuperAdminGuard)
@Roles(Role.SuperAdmin)
@Controller('admin/mall')
export class MallMarketingController {
  constructor(private readonly mallMarketingService: MallMarketingService) {}

  // Promotions
  @Get('promotions')
  @ApiOperation({ summary: 'List promotions' })
  getPromotions(
    @Query('status') status?: string,
    @Query('type') type?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.mallMarketingService.getPromotions({ status, type, page, limit });
  }

  @Post('promotions')
  @ApiOperation({ summary: 'Create promotion' })
  createPromotion(@Body() dto: any) {
    return this.mallMarketingService.createPromotion(dto);
  }

  @Put('promotions/:id')
  @ApiOperation({ summary: 'Update promotion' })
  updatePromotion(@Param('id') id: string, @Body() dto: any) {
    return this.mallMarketingService.updatePromotion(id, dto);
  }

  // QLinks
  @Get('qlinks')
  @ApiOperation({ summary: 'List QLinks' })
  getQlinks(@Query('page') page?: number, @Query('limit') limit?: number) {
    return this.mallMarketingService.getQlinks({ page, limit });
  }

  @Post('qlinks')
  @ApiOperation({ summary: 'Create QLink' })
  createQlink(@Body() dto: { name: string; type: string; destinationUrl?: string; businessId: string }) {
    return this.mallMarketingService.createQlink(dto);
  }

  @Put('qlinks/:id')
  @ApiOperation({ summary: 'Update QLink' })
  updateQlink(@Param('id') id: string, @Body() dto: any) {
    return this.mallMarketingService.updateQlink(id, dto);
  }

  @Delete('qlinks/:id')
  @ApiOperation({ summary: 'Delete QLink' })
  deleteQlink(@Param('id') id: string) {
    return this.mallMarketingService.deleteQlink(id);
  }

  @Get('qlinks/:id/scans')
  @ApiOperation({ summary: 'Get QLink scan analytics' })
  getQlinkScans(@Param('id') id: string) {
    return this.mallMarketingService.getQlinkScans(id);
  }

  // Expos
  @Get('expos')
  @ApiOperation({ summary: 'List expos' })
  getExpos(@Query('page') page?: number, @Query('limit') limit?: number) {
    return this.mallMarketingService.getExpos({ page, limit });
  }

  @Post('expos')
  @ApiOperation({ summary: 'Create expo' })
  createExpo(@Body() dto: any) {
    return this.mallMarketingService.createExpo(dto);
  }

  @Put('expos/:id')
  @ApiOperation({ summary: 'Update expo' })
  updateExpo(@Param('id') id: string, @Body() dto: any) {
    return this.mallMarketingService.updateExpo(id, dto);
  }

  @Get('rewards')
  @ApiOperation({ summary: 'Get global reward overview' })
  getRewards(@Query('page') page?: number, @Query('limit') limit?: number) {
    return this.mallMarketingService.getRewards({ page, limit });
  }

  @Get('rewards/:id')
  @ApiOperation({ summary: 'Get reward detail' })
  getReward(@Param('id') id: string) {
    return this.mallMarketingService.getReward(id);
  }
}
