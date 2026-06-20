import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { BusinessOwnerGuard } from '../guards/business-owner.guard';
import { BusinessNotificationsService } from '../services/business-notifications.service';
import { SendNotificationDto } from '../dto/send-notification.dto';

@ApiTags('Business - Notifications')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, BusinessOwnerGuard)
@Controller('business/notifications')
export class BusinessNotificationsController {
  constructor(private readonly businessNotificationsService: BusinessNotificationsService) {}

  @Post('send')
  @ApiOperation({ summary: 'Send notification to customers' })
  send(@Req() req: any, @Body() dto: SendNotificationDto) {
    return this.businessNotificationsService.send(req.businessId, dto);
  }
}
