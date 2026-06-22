import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CustomerDashboardService } from '../services/customer-dashboard.service';
import { CustomerGuard } from '../guards/customer.guard';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';

@ApiTags('Customer - Dashboard')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, CustomerGuard)
@Controller('customer/dashboard')
export class CustomerDashboardController {
  constructor(private readonly customerDashboardService: CustomerDashboardService) {}

  @Get()
  @ApiOperation({ summary: 'Get personalized customer dashboard' })
  getDashboard(@CurrentUser('id') customerId: string) {
    return this.customerDashboardService.getDashboard(customerId);
  }
}
