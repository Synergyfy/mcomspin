import { Controller, Get, Post, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CustomerBusinessesService } from '../services/customer-businesses.service';
import { CustomerGuard } from '../guards/customer.guard';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';

@ApiTags('Customer - Businesses')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, CustomerGuard)
@Controller('customer/businesses')
export class CustomerBusinessesController {
  constructor(private readonly customerBusinessesService: CustomerBusinessesService) {}

  @Get(':id')
  @ApiOperation({ summary: 'Get business profile with active campaigns and rewards' })
  findOne(@Param('id') id: string) {
    return this.customerBusinessesService.findOne(id);
  }

  @Post(':id/follow')
  @ApiOperation({ summary: 'Follow or unfollow a business' })
  follow(@CurrentUser('id') customerId: string, @Param('id') businessId: string) {
    return this.customerBusinessesService.follow(customerId, businessId);
  }
}
