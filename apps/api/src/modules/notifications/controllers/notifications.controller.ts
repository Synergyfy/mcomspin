import { Controller, Get, Post, Put, Body, Param, Query, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { NotificationsService } from '../services/notifications.service';

@ApiTags('Notifications')
@ApiBearerAuth()
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiOperation({ summary: 'Get my notifications' })
  async getNotifications(@Req() req: any, @Query('page') page?: number, @Query('limit') limit?: number) {
    return this.notificationsService.getNotifications(req.user.id, page || 1, limit || 20);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id/read')
  @ApiOperation({ summary: 'Mark notification as read' })
  async markAsRead(@Req() req: any, @Param('id') id: string) {
    return this.notificationsService.markAsRead(req.user.id, id);
  }

  @UseGuards(JwtAuthGuard)
  @Put('read-all')
  @ApiOperation({ summary: 'Mark all as read' })
  async markAllAsRead(@Req() req: any) {
    return this.notificationsService.markAllAsRead(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('preferences')
  @ApiOperation({ summary: 'Get notification preferences' })
  async getPreferences(@Req() req: any) {
    return this.notificationsService.getPreferences(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Put('preferences')
  @ApiOperation({ summary: 'Update notification preferences' })
  async updatePreferences(@Req() req: any, @Body() dto: { preferences: { channel: any; type: any; enabled: boolean }[] }) {
    return this.notificationsService.updatePreferences(req.user.id, dto.preferences);
  }

  @UseGuards(JwtAuthGuard)
  @Get('templates')
  @ApiOperation({ summary: 'List notification templates' })
  async getTemplates() {
    return this.notificationsService.getTemplates();
  }

  @UseGuards(JwtAuthGuard)
  @Post('templates')
  @ApiOperation({ summary: 'Create notification template' })
  async createTemplate(@Body() dto: any) {
    return this.notificationsService.createTemplate(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('send')
  @ApiOperation({ summary: 'Send notification' })
  async send(@Req() req: any, @Body() dto: any) {
    return this.notificationsService.sendBulk(req.user.id, dto);
  }
}
