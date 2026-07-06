import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { Role } from '../../../common/constants/roles.constant';
import { SuperAdminGuard } from '../../admin/guards/super-admin.guard';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import { MallMarketplaceService } from '../services/mall-marketplace.service';

@ApiTags('Mall Admin - Marketplace')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard, SuperAdminGuard)
@Roles(Role.SuperAdmin)
@Controller('admin/mall/marketplace')
export class MallMarketplaceController {
  constructor(private readonly mallMarketplaceService: MallMarketplaceService) {}

  @Get('storefronts')
  @ApiOperation({ summary: 'List storefronts' })
  getStorefronts(
    @Query('search') search?: string,
    @Query('boroughId') boroughId?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.mallMarketplaceService.getStorefronts({ search, boroughId, page, limit });
  }

  @Put('storefronts/:id')
  @ApiOperation({ summary: 'Update storefront' })
  updateStorefront(@Param('id') id: string, @Body() dto: { isFeatured?: boolean; isActive?: boolean }) {
    return this.mallMarketplaceService.updateStorefront(id, dto);
  }

  @Get('categories')
  @ApiOperation({ summary: 'List categories' })
  getCategories() {
    return this.mallMarketplaceService.getCategories();
  }

  @Post('categories')
  @ApiOperation({ summary: 'Create category' })
  createCategory(@Body() dto: { name: string; description?: string; parentId?: string; icon?: string }) {
    return this.mallMarketplaceService.createCategory(dto);
  }

  @Put('categories/:id')
  @ApiOperation({ summary: 'Update category' })
  updateCategory(@Param('id') id: string, @Body() dto: { name?: string; description?: string; icon?: string; isActive?: boolean }) {
    return this.mallMarketplaceService.updateCategory(id, dto);
  }

  @Delete('categories/:id')
  @ApiOperation({ summary: 'Delete category' })
  deleteCategory(@Param('id') id: string) {
    return this.mallMarketplaceService.deleteCategory(id);
  }

  @Get('approvals')
  @ApiOperation({ summary: 'Get approval queue' })
  getApprovals(@Query('page') page?: number, @Query('limit') limit?: number) {
    return this.mallMarketplaceService.getApprovals({ page, limit });
  }

  @Put('approvals/:id/:action')
  @ApiOperation({ summary: 'Approve or reject business' })
  approveBusiness(@Param('id') id: string, @Param('action') action: 'approve' | 'reject', @CurrentUser('id') userId: string) {
    return this.mallMarketplaceService.approveBusiness(id, action, userId);
  }
}
