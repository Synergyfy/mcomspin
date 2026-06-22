import { Controller, Put, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CustomerSettingsService } from '../services/customer-settings.service';
import { CustomerGuard } from '../guards/customer.guard';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import { CustomerUpdateSettingsDto } from '../dto/customer-update-settings.dto';

@ApiTags('Customer - Settings')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, CustomerGuard)
@Controller('customer/settings')
export class CustomerSettingsController {
  constructor(private readonly customerSettingsService: CustomerSettingsService) {}

  @Put()
  @ApiOperation({ summary: 'Update customer settings' })
  update(@CurrentUser('id') customerId: string, @Body() dto: CustomerUpdateSettingsDto) {
    return this.customerSettingsService.update(customerId, dto);
  }
}
