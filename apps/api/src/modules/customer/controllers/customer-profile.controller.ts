import { Controller, Put, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CustomerProfileService } from '../services/customer-profile.service';
import { CustomerGuard } from '../guards/customer.guard';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import { CustomerUpdateProfileDto } from '../dto/customer-update-profile.dto';

@ApiTags('Customer - Profile')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, CustomerGuard)
@Controller('customer/profile')
export class CustomerProfileController {
  constructor(private readonly customerProfileService: CustomerProfileService) {}

  @Put()
  @ApiOperation({ summary: 'Update customer profile' })
  update(@CurrentUser('id') customerId: string, @Body() dto: CustomerUpdateProfileDto) {
    return this.customerProfileService.update(customerId, dto);
  }
}
