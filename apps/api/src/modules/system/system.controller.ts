import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { Public } from '../../common/decorators/public.decorator';
import { ServiceApiKeyGuard } from './service-api-key.guard';
import { SystemService, CreatePlanInput, UpdatePlanInput } from './system.service';

/**
 * Endpoints consumed by the McomSolution GenericHttpConnector
 * (base URL: {billingApiUrl}/api/v1/system/plans, auth: x-mcom-solution-api-key).
 */
@ApiTags('System (McomSolution Connector)')
@Controller('system')
@UseGuards(ServiceApiKeyGuard)
export class SystemController {
  constructor(private readonly systemService: SystemService) {}

  @Public()
  @Get('plans')
  @ApiOperation({ summary: 'List all subscription plans' })
  listPlans() {
    return this.systemService.getPlans();
  }

  @Public()
  @Post('plans')
  @ApiOperation({ summary: 'Create a subscription plan' })
  createPlan(@Body() dto: CreatePlanInput) {
    return this.systemService.createPlan(dto);
  }

  @Public()
  @Get('plans/schema')
  @ApiOperation({ summary: 'Return the plan configuration schema (quotas + feature flags)' })
  getPlanSchema() {
    return this.systemService.getPlanSchema();
  }

  @Public()
  @Get('plans/:id')
  @ApiOperation({ summary: 'Get a single subscription plan' })
  getPlan(@Param('id') id: string) {
    return this.systemService.getPlanById(id);
  }

  @Public()
  @Patch('plans/:id')
  @ApiOperation({ summary: 'Update a subscription plan' })
  updatePlan(@Param('id') id: string, @Body() dto: UpdatePlanInput) {
    return this.systemService.updatePlan(id, dto);
  }

  @Public()
  @Delete('plans/:id')
  @ApiOperation({ summary: 'Delete a subscription plan' })
  async deletePlan(@Param('id') id: string) {
    await this.systemService.deletePlan(id);
    return { success: true };
  }

  @Public()
  @Get('seasons')
  @ApiOperation({ summary: 'List available seasons (unsupported — returns empty)' })
  getSeasons() {
    return this.systemService.getSeasons();
  }
}
