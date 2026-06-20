import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { CustomerCampaignsService } from '../services/customer-campaigns.service';
import { CustomerGuard } from '../guards/customer.guard';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';

@ApiTags('Customer - Campaigns')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, CustomerGuard)
@Controller('customer/campaigns')
export class CustomerCampaignsController {
  constructor(private readonly customerCampaignsService: CustomerCampaignsService) {}

  @Get()
  @ApiOperation({ summary: 'List public campaigns' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'status', required: false })
  @ApiQuery({ name: 'borough', required: false })
  findAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('status') status?: string,
    @Query('borough') borough?: string,
  ) {
    return this.customerCampaignsService.findAll({ page, limit, status, borough });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get campaign detail' })
  findOne(@Param('id') id: string) {
    return this.customerCampaignsService.findOne(id);
  }
}
