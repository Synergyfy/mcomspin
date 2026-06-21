import { Controller, Get, Post, Put, Delete, Param, Body, Query, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { BusinessOwnerGuard } from '../guards/business-owner.guard';
import { BusinessRewardsService } from '../services/business-rewards.service';
import { CreateRewardDto } from '../../admin/dto/create-reward.dto';
import { UpdateRewardDto } from '../../admin/dto/update-reward.dto';

@ApiTags('Business - Rewards')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, BusinessOwnerGuard)
@Controller('business/rewards')
export class BusinessRewardsController {
  constructor(private readonly businessRewardsService: BusinessRewardsService) {}

  @Get()
  @ApiOperation({ summary: 'List business rewards' })
  @ApiQuery({ name: 'type', required: false })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  findAll(@Req() req: any, @Query() query: { type?: string; page?: string; limit?: string }) {
    return this.businessRewardsService.findAll(req.businessId, {
      type: query.type,
      page: query.page ? Number(query.page) : 1,
      limit: query.limit ? Number(query.limit) : 20,
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get reward detail' })
  findOne(@Req() req: any, @Param('id') id: string) {
    return this.businessRewardsService.findOne(req.businessId, id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a reward' })
  create(@Req() req: any, @Body() dto: CreateRewardDto) {
    return this.businessRewardsService.create(req.businessId, dto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a reward' })
  update(@Req() req: any, @Param('id') id: string, @Body() dto: UpdateRewardDto) {
    return this.businessRewardsService.update(req.businessId, id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a reward' })
  remove(@Req() req: any, @Param('id') id: string) {
    return this.businessRewardsService.remove(req.businessId, id);
  }
}
