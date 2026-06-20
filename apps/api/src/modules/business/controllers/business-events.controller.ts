import { Controller, Get, Post, Put, Param, Body, Query, Req, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { BusinessOwnerGuard } from '../guards/business-owner.guard';
import { BusinessEventsService } from '../services/business-events.service';
import { CreateEventDto } from '../dto/create-event.dto';
import { UpdateEventDto } from '../dto/update-event.dto';

@ApiTags('Business - Events')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, BusinessOwnerGuard)
@Controller('dashboard/sales')
export class BusinessEventsController {
  constructor(private readonly eventsService: BusinessEventsService) {}

  @Get('events')
  @ApiOperation({ summary: 'Event list' })
  @ApiQuery({ name: 'status', required: false })
  @ApiQuery({ name: 'type', required: false })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  getEvents(
    @Req() req: any,
    @Query('status') status?: string,
    @Query('type') type?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.eventsService.getEvents(req.businessId, {
      status, type,
      page: page ? Number(page) : 1,
      limit: limit ? Number(limit) : 20,
    });
  }

  @Post('events')
  @ApiOperation({ summary: 'Create event' })
  createEvent(@Req() req: any, @Body() dto: CreateEventDto) {
    return this.eventsService.createEvent(req.businessId, dto);
  }

  @Put('events/:id')
  @ApiOperation({ summary: 'Update event' })
  updateEvent(@Req() req: any, @Param('id') id: string, @Body() dto: UpdateEventDto) {
    return this.eventsService.updateEvent(req.businessId, id, dto);
  }

  @Post('events/:id/check-in')
  @ApiOperation({ summary: 'QR check-in' })
  checkIn(
    @Req() req: any,
    @Param('id') id: string,
    @Body('registrationId') registrationId?: string,
  ) {
    return this.eventsService.checkIn(req.businessId, id, registrationId);
  }
}
