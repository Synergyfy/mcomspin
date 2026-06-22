import { Controller, Post, Param, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CustomerPromotionsService } from '../services/customer-promotions.service';
import { CustomerGuard } from '../guards/customer.guard';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';

@ApiTags('Customer - Promotions')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, CustomerGuard)
@Controller('customer/promotions')
export class CustomerPromotionsController {
  constructor(private readonly customerPromotionsService: CustomerPromotionsService) {}

  @Post(':id/redeem')
  @ApiOperation({ summary: 'Redeem a promotion' })
  redeem(@Param('id') id: string, @CurrentUser('id') customerId: string) {
    return this.customerPromotionsService.redeem(customerId, id);
  }
}
