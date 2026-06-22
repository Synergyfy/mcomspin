import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { Role } from '../../../common/constants/roles.constant';
import { SuperAdminGuard } from '../../admin/guards/super-admin.guard';
import { MallLocationsService } from '../services/mall-locations.service';

@ApiTags('Mall Admin - Locations')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard, SuperAdminGuard)
@Roles(Role.SuperAdmin)
@Controller('admin/mall')
export class MallLocationsController {
  constructor(private readonly mallLocationsService: MallLocationsService) {}

  // Boroughs
  @Get('boroughs')
  @ApiOperation({ summary: 'List boroughs' })
  getBoroughs() {
    return this.mallLocationsService.getBoroughs();
  }

  @Get('boroughs/:id')
  @ApiOperation({ summary: 'Get borough detail' })
  getBorough(@Param('id') id: string) {
    return this.mallLocationsService.getBorough(id);
  }

  @Post('boroughs')
  @ApiOperation({ summary: 'Create borough' })
  createBorough(@Body() dto: { name: string; description?: string; region?: string; isActive?: boolean }) {
    return this.mallLocationsService.createBorough(dto);
  }

  @Put('boroughs/:id')
  @ApiOperation({ summary: 'Update borough' })
  updateBorough(@Param('id') id: string, @Body() dto: { name?: string; description?: string; region?: string; isActive?: boolean }) {
    return this.mallLocationsService.updateBorough(id, dto);
  }

  @Delete('boroughs/:id')
  @ApiOperation({ summary: 'Deactivate borough' })
  deleteBorough(@Param('id') id: string) {
    return this.mallLocationsService.deleteBorough(id);
  }

  @Get('boroughs/:id/businesses')
  @ApiOperation({ summary: 'List businesses in borough' })
  getBoroughBusinesses(@Param('id') id: string, @Query('page') page?: number, @Query('limit') limit?: number) {
    return this.mallLocationsService.getBoroughBusinesses(id, { page, limit });
  }

  @Get('boroughs/:id/analytics')
  @ApiOperation({ summary: 'Get borough analytics' })
  getBoroughAnalytics(@Param('id') id: string) {
    return this.mallLocationsService.getBoroughAnalytics(id);
  }

  // High Streets
  @Get('high-streets')
  @ApiOperation({ summary: 'List high streets' })
  getHighStreets() {
    return this.mallLocationsService.getHighStreets();
  }

  @Get('high-streets/:id')
  @ApiOperation({ summary: 'Get high street detail' })
  getHighStreet(@Param('id') id: string) {
    return this.mallLocationsService.getHighStreet(id);
  }

  @Post('high-streets')
  @ApiOperation({ summary: 'Create high street' })
  createHighStreet(@Body() dto: { name: string; boroughId: string; description?: string; isActive?: boolean }) {
    return this.mallLocationsService.createHighStreet(dto);
  }

  @Put('high-streets/:id')
  @ApiOperation({ summary: 'Update high street' })
  updateHighStreet(@Param('id') id: string, @Body() dto: { name?: string; description?: string; isActive?: boolean }) {
    return this.mallLocationsService.updateHighStreet(id, dto);
  }

  @Delete('high-streets/:id')
  @ApiOperation({ summary: 'Deactivate high street' })
  deleteHighStreet(@Param('id') id: string) {
    return this.mallLocationsService.deleteHighStreet(id);
  }

  @Get('high-streets/:id/businesses')
  @ApiOperation({ summary: 'List businesses on high street' })
  getHighStreetBusinesses(@Param('id') id: string) {
    return this.mallLocationsService.getHighStreetBusinesses(id);
  }
}
