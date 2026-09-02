import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { Role } from '../../../common/constants/roles.constant';
import { SuperAdminGuard } from '../guards/super-admin.guard';
import { AdminPlansService } from '../services/admin-plans.service';
import { CreatePlanInput, UpdatePlanInput } from '../../system/system.service';

@ApiTags('Admin - Plans')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard, SuperAdminGuard)
@Roles(Role.SuperAdmin)
@Controller('admin/plans')
export class AdminPlansController {
  constructor(private readonly adminPlansService: AdminPlansService) {}

  @Get()
  @ApiOperation({ summary: 'List all subscription plans' })
  listPlans() {
    return this.adminPlansService.listPlans();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single subscription plan' })
  getPlan(@Param('id') id: string) {
    return this.adminPlansService.getPlan(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a subscription plan' })
  createPlan(@Body() dto: CreatePlanInput) {
    return this.adminPlansService.createPlan(dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a subscription plan' })
  updatePlan(@Param('id') id: string, @Body() dto: UpdatePlanInput) {
    return this.adminPlansService.updatePlan(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a subscription plan' })
  async deletePlan(@Param('id') id: string) {
    await this.adminPlansService.deletePlan(id);
    return { success: true };
  }
}
