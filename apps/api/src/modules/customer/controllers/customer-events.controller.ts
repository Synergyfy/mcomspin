import { Controller, Get, Post, Param, Query, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { CustomerEventsService } from '../services/customer-events.service';
import { CustomerGuard } from '../guards/customer.guard';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';

@ApiTags('Customer - Events')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, CustomerGuard)
@Controller('customer/events')
export class CustomerEventsController {
  constructor(private readonly customerEventsService: CustomerEventsService) {}

  @Get()
  @ApiOperation({ summary: 'List upcoming events' })
  @ApiQuery({ name: 'type', required: false })
  @ApiQuery({ name: 'borough', required: false })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  findAll(
    @Query('type') type?: string,
    @Query('borough') borough?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.customerEventsService.findAll({ type, borough, page, limit });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get event detail' })
  findOne(@Param('id') id: string) {
    return this.customerEventsService.findOne(id);
  }

  @Post(':id/join')
  @ApiOperation({ summary: 'Register for an event' })
  join(@Param('id') id: string, @CurrentUser('id') customerId: string) {
    return this.customerEventsService.join(id, customerId);
  }
}
