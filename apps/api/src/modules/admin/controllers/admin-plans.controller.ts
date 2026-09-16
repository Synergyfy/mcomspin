import { Controller, Get, Post, Param, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { Role } from '../../../common/constants/roles.constant';
import { SuperAdminGuard } from '../guards/super-admin.guard';
import { AdminPlansService } from '../services/admin-plans.service';
import { CreatePlanDto, UpdateVariantPriceDto } from '../../system/system.service';

@ApiTags('Admin - Plans')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard, SuperAdminGuard)
@Roles(Role.SuperAdmin)
@Controller('admin/plans')
export class AdminPlansController {
  constructor(private readonly adminPlansService: AdminPlansService) {}

  @Get()
  @ApiOperation({ summary: 'List all unified plans' })
  listPlans() {
    return this.adminPlansService.listPlans();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single unified plan' })
  getPlan(@Param('id') id: string) {
    return this.adminPlansService.getPlan(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a plan with 3 variants (STANDARD, PRO, PRO_PLUS)' })
  createPlan(@Body() dto: CreatePlanDto) {
    return this.adminPlansService.createPlan(dto);
  }

  @Post('variants/:variantId/prices')
  @ApiOperation({ summary: 'Reprice a plan variant immutably' })
  repriceVariant(@Param('variantId') variantId: string, @Body() dto: UpdateVariantPriceDto) {
    return this.adminPlansService.repriceVariant(variantId, dto);
  }
}
