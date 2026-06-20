import { Controller, Get, Put, Body, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { BusinessOwnerGuard } from '../guards/business-owner.guard';
import { BusinessProfileService } from '../services/business-profile.service';
import { UpdateBusinessProfileDto } from '../dto/business-profile.dto';
import { UpdateBusinessSettingsDto } from '../dto/update-settings.dto';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';

@ApiTags('Business - Profile')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, BusinessOwnerGuard)
@Controller('business')
export class BusinessProfileController {
  constructor(private readonly businessProfileService: BusinessProfileService) {}

  @Get('profile')
  @ApiOperation({ summary: 'Get business profile' })
  getProfile(@Req() req: any) {
    return this.businessProfileService.getProfile(req.businessId);
  }

  @Put('profile')
  @ApiOperation({ summary: 'Update business profile' })
  updateProfile(@Req() req: any, @Body() dto: UpdateBusinessProfileDto) {
    return this.businessProfileService.updateProfile(req.businessId, dto);
  }

  @Put('settings')
  @ApiOperation({ summary: 'Update business settings' })
  updateSettings(@CurrentUser('id') userId: string, @Req() req: any, @Body() dto: UpdateBusinessSettingsDto) {
    return this.businessProfileService.updateSettings(userId, req.businessId, dto);
  }

  @Get('billing')
  @ApiOperation({ summary: 'Get billing info and invoices' })
  getBilling(@Req() req: any) {
    return this.businessProfileService.getBilling(req.businessId);
  }
}
