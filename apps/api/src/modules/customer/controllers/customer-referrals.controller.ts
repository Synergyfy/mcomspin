import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CustomerReferralsService } from '../services/customer-referrals.service';
import { CustomerGuard } from '../guards/customer.guard';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import { CustomerCreateReferralDto } from '../dto/customer-create-referral.dto';

@ApiTags('Customer - Referrals')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, CustomerGuard)
@Controller('customer/referrals')
export class CustomerReferralsController {
  constructor(private readonly customerReferralsService: CustomerReferralsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a referral invite' })
  create(@CurrentUser('id') customerId: string, @Body() dto: CustomerCreateReferralDto) {
    return this.customerReferralsService.create(customerId, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get referral tracking data' })
  getReferrals(@CurrentUser('id') customerId: string) {
    return this.customerReferralsService.getReferrals(customerId);
  }
}
