import { Controller, Get, Post, Body, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { CustomerGameService } from '../services/customer-game.service';
import { CustomerGuard } from '../guards/customer.guard';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import { CustomerGameStartDto } from '../dto/customer-game-start.dto';
import { CustomerGameDropDto } from '../dto/customer-game-drop.dto';
import { CustomerGameClaimDto } from '../dto/customer-game-claim.dto';

@ApiTags('Customer - Game')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, CustomerGuard)
@Controller('customer/games')
export class CustomerGameController {
  constructor(private readonly customerGameService: CustomerGameService) {}

  @Get('eligibility')
  @ApiOperation({ summary: 'Check customer eligibility to play' })
  @ApiQuery({ name: 'gameId', required: false })
  @ApiQuery({ name: 'campaignId', required: false })
  checkEligibility(
    @CurrentUser('id') customerId: string,
    @Query('gameId') gameId?: string,
    @Query('campaignId') campaignId?: string,
  ) {
    return this.customerGameService.checkEligibility(customerId, gameId, campaignId);
  }

  @Post('play')
  @ApiOperation({ summary: 'Initiate a new game session' })
  startGame(@CurrentUser('id') customerId: string, @Body() dto: CustomerGameStartDto) {
    return this.customerGameService.startGame(customerId, dto);
  }

  @Post('drop')
  @ApiOperation({ summary: 'Process ball drop result' })
  processDrop(@CurrentUser('id') customerId: string, @Body() dto: CustomerGameDropDto) {
    return this.customerGameService.processDrop(customerId, dto);
  }

  @Post('claim')
  @ApiOperation({ summary: 'Claim reward from a winning session' })
  claimReward(@CurrentUser('id') customerId: string, @Body() dto: CustomerGameClaimDto) {
    return this.customerGameService.claimReward(customerId, dto);
  }
}
