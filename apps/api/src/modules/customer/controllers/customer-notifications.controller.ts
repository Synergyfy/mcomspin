import { Controller, Get, Put, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { CustomerNotificationsService } from '../services/customer-notifications.service';
import { CustomerGuard } from '../guards/customer.guard';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';

@ApiTags('Customer - Notifications')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, CustomerGuard)
@Controller('customer/notifications')
export class CustomerNotificationsController {
  constructor(private readonly customerNotificationsService: CustomerNotificationsService) {}

  @Get()
  @ApiOperation({ summary: 'Get customer notifications' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  findAll(
    @CurrentUser('id') customerId: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.customerNotificationsService.findAll(customerId, { page, limit });
  }

  @Put(':id')
  @ApiOperation({ summary: 'Mark notification as read' })
  markAsRead(@CurrentUser('id') customerId: string, @Param('id') id: string) {
    return this.customerNotificationsService.markAsRead(customerId, id);
  }
}
