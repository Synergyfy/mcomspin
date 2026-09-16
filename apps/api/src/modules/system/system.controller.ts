import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { Public } from '../../common/decorators/public.decorator';
import { ServiceApiKeyGuard } from './service-api-key.guard';
import { SystemService, CreatePlanDto, UpdateVariantPriceDto } from './system.service';

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
    return this.systemService.listUnifiedPlans();
  }

  @Public()
  @Post('plans')
  @ApiOperation({ summary: 'Create a subscription plan with 3 variants' })
  createPlan(@Body() dto: CreatePlanDto) {
    return this.systemService.createUnifiedPlan(dto);
  }

  @Public()
  @Post('plans/variants/:variantId/prices')
  @ApiOperation({ summary: 'Update variant price immutably' })
  repriceVariant(@Param('variantId') variantId: string, @Body() dto: UpdateVariantPriceDto) {
    return this.systemService.repriceVariant(variantId, dto);
  }

  @Public()
  @Get('plans/schema')
  @ApiOperation({ summary: 'Return the plan configuration schema (quotas + feature flags)' })
  getPlanSchema() {
    return this.systemService.getPlanSchema();
  }

  @Public()
  @Get('plans/:id')
  @ApiOperation({ summary: 'Get canonical plan format by plan or variant ID' })
  getPlan(@Param('id') id: string) {
    return this.systemService.findOneCanonicalPlan(id);
  }

  @Public()
  @Get('seasons')
  @ApiOperation({ summary: 'List available seasons (unsupported — returns empty)' })
  getSeasons() {
    return this.systemService.getSeasons();
  }
}
