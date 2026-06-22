import { Controller, Get, Post, Put, Delete, Param, Body, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { Role } from '../../../common/constants/roles.constant';
import { SuperAdminGuard } from '../guards/super-admin.guard';
import { AdminRewardsService } from '../services/admin-rewards.service';
import { CreateRewardDto } from '../dto/create-reward.dto';
import { UpdateRewardDto } from '../dto/update-reward.dto';

@ApiTags('Admin - Rewards')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard, SuperAdminGuard)
@Roles(Role.SuperAdmin)
@Controller('admin/rewards')
export class AdminRewardsController {
  constructor(private readonly adminRewardsService: AdminRewardsService) {}

  @Get()
  @ApiOperation({ summary: 'List all rewards' })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'type', required: false })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  findAll(@Query() query: { search?: string; type?: string; page?: string; limit?: string }) {
    return this.adminRewardsService.findAll({
      search: query.search,
      type: query.type,
      page: query.page ? Number(query.page) : 1,
      limit: query.limit ? Number(query.limit) : 20,
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get reward detail' })
  findOne(@Param('id') id: string) {
    return this.adminRewardsService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a reward' })
  create(@Body() dto: CreateRewardDto) {
    return this.adminRewardsService.create(dto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a reward' })
  update(@Param('id') id: string, @Body() dto: UpdateRewardDto) {
    return this.adminRewardsService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a reward (soft)' })
  remove(@Param('id') id: string) {
    return this.adminRewardsService.remove(id);
  }
}
