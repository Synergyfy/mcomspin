import { Controller, Get, Param, Query, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { BusinessOwnerGuard } from '../guards/business-owner.guard';
import { BusinessCustomersService } from '../services/business-customers.service';

@ApiTags('Business - Customers')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, BusinessOwnerGuard)
@Controller('business/customers')
export class BusinessCustomersController {
  constructor(private readonly businessCustomersService: BusinessCustomersService) {}

  @Get()
  @ApiOperation({ summary: 'List business customers' })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  findAll(@Req() req: any, @Query() query: { search?: string; page?: string; limit?: string }) {
    return this.businessCustomersService.findAll(req.businessId, {
      search: query.search,
      page: query.page ? Number(query.page) : 1,
      limit: query.limit ? Number(query.limit) : 20,
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get customer detail' })
  findOne(@Req() req: any, @Param('id') id: string) {
    return this.businessCustomersService.findOne(req.businessId, id);
  }
}
