import { Controller, Get, Query, UseGuards, BadRequestException } from '@nestjs/common';
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

  @Get('search')
  @ApiOperation({ summary: 'Search businesses by keyword' })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'category', required: false })
  @ApiQuery({ name: 'borough', required: false })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  search(
    @Query('search') search?: string,
    @Query('category') category?: string,
    @Query('borough') borough?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.customerDiscoverService.searchBusinesses({ search, category, borough, page, limit });
  }

  @Get('nearby')
  @ApiOperation({ summary: 'Find nearby businesses by coordinates' })
  @ApiQuery({ name: 'latitude', required: true })
  @ApiQuery({ name: 'longitude', required: true })
  @ApiQuery({ name: 'radius', required: false })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  nearby(
    @Query('latitude') latitude: number,
    @Query('longitude') longitude: number,
    @Query('radius') radius?: number,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    if (!latitude || !longitude) throw new BadRequestException('latitude and longitude are required');
    return this.customerDiscoverService.nearbyBusinesses({
      latitude: Number(latitude),
      longitude: Number(longitude),
      radius: radius ? Number(radius) : undefined,
      page,
      limit,
    });
  }
}
