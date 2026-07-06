import { Controller, Get, Post, Param, Body, Query, Req, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { BusinessOwnerGuard } from '../guards/business-owner.guard';
import { BusinessGamificationService } from '../services/business-gamification.service';
import { CreateRotatorDto } from '../dto/create-rotator.dto';
import { CreateGameConfigDto } from '../dto/create-game-config.dto';

@ApiTags('Business - Gamification')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, BusinessOwnerGuard)
@Controller('dashboard/sales')
export class BusinessGamificationController {
  constructor(private readonly gamificationService: BusinessGamificationService) {}

  @Get('rotators')
  @ApiOperation({ summary: 'Rotator list' })
  @ApiQuery({ name: 'status', required: false })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  getRotators(
    @Req() req: any,
    @Query('status') status?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.gamificationService.getRotators(req.businessId, {
      status,
      page: page ? Number(page) : 1,
      limit: limit ? Number(limit) : 20,
    });
  }

  @Post('rotators')
  @ApiOperation({ summary: 'Create rotator' })
  createRotator(@Req() req: any, @Body() dto: CreateRotatorDto) {
    return this.gamificationService.createRotator(req.businessId, dto);
  }

  @Get('gamification')
  @ApiOperation({ summary: 'Gamification config list' })
  getGames(@Req() req: any) {
    return this.gamificationService.getGames(req.businessId);
  }

  @Post('gamification')
  @ApiOperation({ summary: 'Create game' })
  createGame(@Req() req: any, @Body() dto: CreateGameConfigDto) {
    return this.gamificationService.createGame(req.businessId, dto);
  }
}
