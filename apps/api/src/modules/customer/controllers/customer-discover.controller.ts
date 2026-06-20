import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { CustomerDiscoverService } from '../services/customer-discover.service';
import { CustomerGuard } from '../guards/customer.guard';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';

@ApiTags('Customer - Discover')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, CustomerGuard)
@Controller('customer/discover')
export class CustomerDiscoverController {
  constructor(private readonly customerDiscoverService: CustomerDiscoverService) {}

  @Get()
  @ApiOperation({ summary: 'Browse campaigns, businesses, or rewards with filters' })
  @ApiQuery({ name: 'type', required: false, enum: ['campaigns', 'businesses', 'rewards'] })
  @ApiQuery({ name: 'category', required: false })
  @ApiQuery({ name: 'borough', required: false })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  discover(
    @Query('type') type?: 'campaigns' | 'businesses' | 'rewards',
    @Query('category') category?: string,
    @Query('borough') borough?: string,
    @Query('search') search?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.customerDiscoverService.discover({ type, category, borough, search, page, limit });
  }
}
