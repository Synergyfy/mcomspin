import { Controller, Get, Put, Param, Query, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { BusinessOwnerGuard } from '../guards/business-owner.guard';
import { BusinessRedemptionsService } from '../services/business-redemptions.service';

@ApiTags('Business - Redemptions')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, BusinessOwnerGuard)
@Controller('business/redemptions')
export class BusinessRedemptionsController {
  constructor(private readonly businessRedemptionsService: BusinessRedemptionsService) {}

  @Get()
  @ApiOperation({ summary: 'List redemptions' })
  @ApiQuery({ name: 'status', required: false })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  findAll(@Req() req: any, @Query() query: { status?: string; page?: string; limit?: string }) {
    return this.businessRedemptionsService.findAll(req.businessId, {
      status: query.status,
      page: query.page ? Number(query.page) : 1,
      limit: query.limit ? Number(query.limit) : 20,
    });
  }

  @Put(':id/approve')
  @ApiOperation({ summary: 'Approve redemption (QR scan)' })
  approve(@Req() req: any, @Param('id') id: string) {
    return this.businessRedemptionsService.approve(req.businessId, id);
  }
}
