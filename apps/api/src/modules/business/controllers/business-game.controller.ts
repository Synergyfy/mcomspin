import { Controller, Get, Put, Body, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { BusinessOwnerGuard } from '../guards/business-owner.guard';
import { BusinessGameService } from '../services/business-game.service';
import { UpdateGameConfigDto } from '../dto/update-game-config.dto';

@ApiTags('Business - Game')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, BusinessOwnerGuard)
@Controller('business/game')
export class BusinessGameController {
  constructor(private readonly businessGameService: BusinessGameService) {}

  @Get()
  @ApiOperation({ summary: 'Get game configuration' })
  getConfig(@Req() req: any) {
    return this.businessGameService.getConfig(req.businessId);
  }

  @Put()
  @ApiOperation({ summary: 'Update game configuration' })
  updateConfig(@Req() req: any, @Body() dto: UpdateGameConfigDto) {
    return this.businessGameService.updateConfig(req.businessId, dto);
  }
}
