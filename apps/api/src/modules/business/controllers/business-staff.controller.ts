import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { BusinessOwnerGuard } from '../guards/business-owner.guard';
import { BusinessStaffService } from '../services/business-staff.service';
import { InviteStaffDto } from '../dto/invite-staff.dto';
import { UpdateStaffDto } from '../dto/update-staff.dto';

@ApiTags('Business - Staff')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, BusinessOwnerGuard)
@Controller('business/staff')
export class BusinessStaffController {
  constructor(private readonly businessStaffService: BusinessStaffService) {}

  @Get()
  @ApiOperation({ summary: 'List staff members' })
  findAll(@Req() req: any) {
    return this.businessStaffService.findAll(req.businessId);
  }

  @Post()
  @ApiOperation({ summary: 'Invite staff member' })
  invite(@Req() req: any, @Body() dto: InviteStaffDto) {
    return this.businessStaffService.invite(req.businessId, dto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update staff role/permissions' })
  update(@Req() req: any, @Param('id') id: string, @Body() dto: UpdateStaffDto) {
    return this.businessStaffService.update(req.businessId, id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove staff member' })
  remove(@Req() req: any, @Param('id') id: string) {
    return this.businessStaffService.remove(req.businessId, id);
  }
}
