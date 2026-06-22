import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { CustomerLeaderboardService } from '../services/customer-leaderboard.service';
import { CustomerGuard } from '../guards/customer.guard';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';

@ApiTags('Customer - Leaderboard')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, CustomerGuard)
@Controller('customer/leaderboard')
export class CustomerLeaderboardController {
  constructor(private readonly customerLeaderboardService: CustomerLeaderboardService) {}

  @Get()
  @ApiOperation({ summary: 'Get leaderboard data' })
  @ApiQuery({ name: 'type', required: false, enum: ['topPlayers', 'mostRewards', 'mostRedemptions'] })
  @ApiQuery({ name: 'limit', required: false })
  getLeaderboard(
    @Query('type') type?: string,
    @Query('limit') limit?: number,
  ) {
    return this.customerLeaderboardService.getLeaderboard(type, { limit });
  }

  @Get('achievements')
  @ApiOperation({ summary: 'Get customer achievements' })
  getAchievements(@CurrentUser('id') customerId: string) {
    return this.customerLeaderboardService.getAchievements(customerId);
  }
}
