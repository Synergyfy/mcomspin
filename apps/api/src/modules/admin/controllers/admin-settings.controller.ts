import { Controller, Get, Put, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { Role } from '../../../common/constants/roles.constant';
import { SuperAdminGuard } from '../guards/super-admin.guard';
import { AdminSettingsService } from '../services/admin-settings.service';
import { UpdateSettingsDto } from '../dto/update-settings.dto';

@ApiTags('Admin - Settings')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard, SuperAdminGuard)
@Roles(Role.SuperAdmin)
@Controller('admin/settings')
export class AdminSettingsController {
  constructor(private readonly adminSettingsService: AdminSettingsService) {}

  @Get()
  @ApiOperation({ summary: 'Get platform settings' })
  getSettings() {
    return this.adminSettingsService.getSettings();
  }

  @Put()
  @ApiOperation({ summary: 'Update platform settings' })
  updateSettings(@Body() dto: UpdateSettingsDto) {
    return this.adminSettingsService.updateSettings(dto);
  }
}
