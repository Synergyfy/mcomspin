import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { BusinessOwnerGuard } from '../guards/business-owner.guard';
import { BusinessLocationsService } from '../services/business-locations.service';
import { CreateLocationDto } from '../dto/create-location.dto';
import { UpdateLocationDto } from '../dto/update-location.dto';

@ApiTags('Business - Locations')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, BusinessOwnerGuard)
@Controller('business/locations')
export class BusinessLocationsController {
  constructor(private readonly businessLocationsService: BusinessLocationsService) {}

  @Get()
  @ApiOperation({ summary: 'List business locations' })
  findAll(@Req() req: any) {
    return this.businessLocationsService.findAll(req.businessId);
  }

  @Post()
  @ApiOperation({ summary: 'Add a location' })
  create(@Req() req: any, @Body() dto: CreateLocationDto) {
    return this.businessLocationsService.create(req.businessId, dto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a location' })
  update(@Req() req: any, @Param('id') id: string, @Body() dto: UpdateLocationDto) {
    return this.businessLocationsService.update(req.businessId, id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Disable a location' })
  remove(@Req() req: any, @Param('id') id: string) {
    return this.businessLocationsService.remove(req.businessId, id);
  }
}
