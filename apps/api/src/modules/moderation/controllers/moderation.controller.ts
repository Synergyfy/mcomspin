import { Controller, Get, Post, Put, Body, Param, Query, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { ModerationService } from '../services/moderation.service';
import { CreateRuleDto } from '../dto/create-rule.dto';
import { UpdateRuleDto } from '../dto/update-rule.dto';

@ApiTags('Moderation')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('moderation')
export class ModerationController {
  constructor(private readonly moderationService: ModerationService) {}

  @Get('reports')
  @ApiOperation({ summary: 'List reports' })
  getReports(@Query('page') page?: number, @Query('limit') limit?: number, @Query('status') status?: string) {
    return this.moderationService.getReports(page || 1, limit || 20, status);
  }

  @Get('reports/:id')
  @ApiOperation({ summary: 'Get report details' })
  getReport(@Param('id') id: string) {
    return this.moderationService.getReport(id);
  }

  @Post('reports')
  @ApiOperation({ summary: 'Create a report' })
  createReport(@Req() req: any, @Body() dto: { targetType: string; targetId: string; reason: string; description?: string }) {
    return this.moderationService.createReport(dto, req.user.id);
  }

  @Post('reports/:id/action')
  @ApiOperation({ summary: 'Take moderation action' })
  takeAction(@Req() req: any, @Param('id') id: string, @Body() dto: { actionType: any; reason: string; duration?: number }) {
    return this.moderationService.takeAction(id, dto, req.user.id);
  }

  @Post('reports/:id/dismiss')
  @ApiOperation({ summary: 'Dismiss report' })
  dismissReport(@Req() req: any, @Param('id') id: string) {
    return this.moderationService.dismissReport(id, req.user.id);
  }

  @Get('fraud-alerts')
  @ApiOperation({ summary: 'List fraud alerts' })
  getFraudAlerts(@Query('page') page?: number, @Query('limit') limit?: number) {
    return this.moderationService.getFraudAlerts(page || 1, limit || 20);
  }

  @Post('fraud-alerts/:id/resolve')
  @ApiOperation({ summary: 'Resolve fraud alert' })
  resolveFraudAlert(@Req() req: any, @Param('id') id: string) {
    return this.moderationService.resolveFraudAlert(id, req.user.id);
  }

  @Get('rules')
  @ApiOperation({ summary: 'List moderation rules' })
  getRules() {
    return this.moderationService.getRules();
  }

  @Post('rules')
  @ApiOperation({ summary: 'Create moderation rule' })
  createRule(@Body() dto: CreateRuleDto) {
    return this.moderationService.createRule(dto);
  }

  @Put('rules/:id')
  @ApiOperation({ summary: 'Update moderation rule' })
  updateRule(@Param('id') id: string, @Body() dto: UpdateRuleDto) {
    return this.moderationService.updateRule(id, dto);
  }
}
