import { Controller, Get, Post, Put, Param, Body, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { Role } from '../../../common/constants/roles.constant';
import { SuperAdminGuard } from '../../admin/guards/super-admin.guard';
import { MallGamificationService } from '../services/mall-gamification.service';
import { CreateGameConfigDto } from '../dto/create-game-config.dto';
import { UpdateGameConfigDto } from '../dto/update-game-config.dto';

@ApiTags('Mall Admin - Gamification')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard, SuperAdminGuard)
@Roles(Role.SuperAdmin)
@Controller('admin/mall/gamification')
export class MallGamificationController {
  constructor(private readonly mallGamificationService: MallGamificationService) {}

  @Get()
  @ApiOperation({ summary: 'Get gamification overview' })
  getOverview() {
    return this.mallGamificationService.getOverview();
  }

  @Get('games')
  @ApiOperation({ summary: 'List game configs' })
  getGames(@Query('page') page?: number, @Query('limit') limit?: number) {
    return this.mallGamificationService.getGames({ page, limit });
  }

  @Post('games')
  @ApiOperation({ summary: 'Create game config' })
  createGameConfig(@Body() dto: CreateGameConfigDto) {
    return this.mallGamificationService.createGameConfig(dto);
  }

  @Put('games/:id')
  @ApiOperation({ summary: 'Update game config' })
  updateGameConfig(@Param('id') id: string, @Body() dto: UpdateGameConfigDto) {
    return this.mallGamificationService.updateGameConfig(id, dto);
  }
}
