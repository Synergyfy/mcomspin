import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { Public } from '../../common/decorators/public.decorator';
import { PublicService } from './public.service';

@ApiTags('Public')
@Public()
@Controller()
export class PublicController {
  constructor(private readonly publicService: PublicService) {}

  @Get('boroughs')
  @ApiOperation({ summary: 'List all boroughs' })
  getBoroughs() {
    return this.publicService.getBoroughs();
  }

  @Get('boroughs/:id')
  @ApiOperation({ summary: 'Get borough detail' })
  getBorough(@Param('id') id: string) {
    return this.publicService.getBorough(id);
  }

  @Get('high-streets')
  @ApiOperation({ summary: 'List high streets' })
  @ApiQuery({ name: 'boroughId', required: false })
  getHighStreets(@Query('boroughId') boroughId?: string) {
    return this.publicService.getHighStreets(boroughId);
  }

  @Get('high-streets/:id')
  @ApiOperation({ summary: 'Get high street detail' })
  getHighStreet(@Param('id') id: string) {
    return this.publicService.getHighStreet(id);
  }

  @Get('businesses')
  @ApiOperation({ summary: 'List businesses' })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'boroughId', required: false })
  @ApiQuery({ name: 'category', required: false })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  getBusinesses(
    @Query('search') search?: string,
    @Query('boroughId') boroughId?: string,
    @Query('category') category?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.publicService.getBusinesses({ search, boroughId, category, page, limit });
  }

  @Get('businesses/:id')
  @ApiOperation({ summary: 'Get business detail' })
  getBusiness(@Param('id') id: string) {
    return this.publicService.getBusiness(id);
  }

  @Get('campaigns')
  @ApiOperation({ summary: 'List campaigns' })
  @ApiQuery({ name: 'boroughId', required: false })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  getCampaigns(
    @Query('boroughId') boroughId?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.publicService.getCampaigns({ boroughId, page, limit });
  }

  @Get('campaigns/:id')
  @ApiOperation({ summary: 'Get campaign detail' })
  getCampaign(@Param('id') id: string) {
    return this.publicService.getCampaign(id);
  }

  @Get('promotions')
  @ApiOperation({ summary: 'List promotions' })
  @ApiQuery({ name: 'type', required: false })
  @ApiQuery({ name: 'boroughId', required: false })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  getPromotions(
    @Query('type') type?: string,
    @Query('boroughId') boroughId?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.publicService.getPromotions({ type, boroughId, page, limit });
  }

  @Get('promotions/nearby')
  @ApiOperation({ summary: 'Get promotions near coordinates' })
  @ApiQuery({ name: 'latitude', required: true })
  @ApiQuery({ name: 'longitude', required: true })
  @ApiQuery({ name: 'radius', required: false })
  getPromotionsNearby(
    @Query('latitude') latitude: number,
    @Query('longitude') longitude: number,
    @Query('radius') radius?: number,
  ) {
    return this.publicService.getPromotionsNearby(Number(latitude), Number(longitude), radius ? Number(radius) : undefined);
  }

  @Get('events')
  @ApiOperation({ summary: 'List events' })
  @ApiQuery({ name: 'type', required: false })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  getEvents(
    @Query('type') type?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.publicService.getEvents({ type, page, limit });
  }

  @Get('events/:id')
  @ApiOperation({ summary: 'Get event detail' })
  getEvent(@Param('id') id: string) {
    return this.publicService.getEvent(id);
  }

  @Get('events/nearby')
  @ApiOperation({ summary: 'Get events near coordinates' })
  @ApiQuery({ name: 'latitude', required: true })
  @ApiQuery({ name: 'longitude', required: true })
  @ApiQuery({ name: 'radius', required: false })
  getEventsNearby(
    @Query('latitude') latitude: number,
    @Query('longitude') longitude: number,
    @Query('radius') radius?: number,
  ) {
    return this.publicService.getEventsNearby(Number(latitude), Number(longitude), radius ? Number(radius) : undefined);
  }

  @Get('rewards')
  @ApiOperation({ summary: 'List rewards' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  getRewards(@Query('page') page?: number, @Query('limit') limit?: number) {
    return this.publicService.getRewards({ page, limit });
  }

  @Get('games/leaderboard')
  @ApiOperation({ summary: 'Get game leaderboard' })
  @ApiQuery({ name: 'limit', required: false })
  getLeaderboard(@Query('limit') limit?: number) {
    return this.publicService.getLeaderboard(limit);
  }
}
