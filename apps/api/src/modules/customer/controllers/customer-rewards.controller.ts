import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CustomerRewardsService } from '../services/customer-rewards.service';
import { CustomerGuard } from '../guards/customer.guard';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import { CustomerRedeemDto } from '../dto/customer-redeem.dto';

@ApiTags('Customer - Rewards')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, CustomerGuard)
@Controller('customer/rewards')
export class CustomerRewardsController {
  constructor(private readonly customerRewardsService: CustomerRewardsService) {}

  @Get(':id')
  @ApiOperation({ summary: 'Get reward detail with QR/voucher' })
  findOne(@CurrentUser('id') customerId: string, @Param('id') id: string) {
    return this.customerRewardsService.findOne(customerId, id);
  }

  @Get()
  @ApiOperation({ summary: 'Get customer reward wallet (available, redeemed, expired)' })
  findAll(@CurrentUser('id') customerId: string) {
    return this.customerRewardsService.findAll(customerId);
  }

  @Post('redeem')
  @ApiOperation({ summary: 'Redeem a reward' })
  redeem(@CurrentUser('id') customerId: string, @Body() dto: CustomerRedeemDto) {
    return this.customerRewardsService.redeem(customerId, dto);
  }

  @Get('history')
  @ApiOperation({ summary: 'Get redemption history' })
  history(@CurrentUser('id') customerId: string) {
    return this.customerRewardsService.history(customerId);
  }
}
