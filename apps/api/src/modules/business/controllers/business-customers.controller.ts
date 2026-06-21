import { Controller, Get, Post, Put, Param, Query, Body, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { BusinessOwnerGuard } from '../guards/business-owner.guard';
import { BusinessCustomersService } from '../services/business-customers.service';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';

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

  @Put(':id/points')
  @ApiOperation({ summary: 'Allocate points to customer' })
  allocatePoints(
    @Req() req: any,
    @Param('id') customerId: string,
    @Body() dto: { points: number; reason?: string },
  ) {
    return this.businessCustomersService.allocatePoints(req.businessId, customerId, dto);
  }

  @Post('messages')
  @ApiOperation({ summary: 'Send message to customers' })
  sendMessage(
    @Req() req: any,
    @CurrentUser('id') userId: string,
    @Body() dto: { customerIds: string[]; subject?: string; content: string },
  ) {
    return this.businessCustomersService.sendMessage(req.businessId, userId, dto);
  }

  @Get('reviews/list')
  @ApiOperation({ summary: 'List customer reviews' })
  getReviews(@Req() req: any, @Query('page') page?: number, @Query('limit') limit?: number) {
    return this.businessCustomersService.getReviews(req.businessId, { page, limit });
  }
}
