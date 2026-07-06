import { Controller, Get, Put, Post, Delete, Body, Param, Query, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { BusinessOwnerGuard } from '../business/guards/business-owner.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { StorefrontService } from './storefront.service';
import { UpdateStorefrontProfileDto } from './dto/update-storefront-profile.dto';
import { UpdateOpeningHoursDto } from './dto/update-opening-hours.dto';
import { UpdateSocialLinksDto } from './dto/update-social-links.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { SpareCapacityDto } from './dto/spare-capacity.dto';
import { UpdateAppearanceDto } from './dto/update-appearance.dto';
import { ConnectGoogleDto } from './dto/connect-google.dto';
import { SubmitVerificationDto } from './dto/submit-verification.dto';
import { ClaimBusinessDto } from './dto/claim-business.dto';

@ApiTags('Business - Storefront')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, BusinessOwnerGuard)
@Controller('business/storefront')
export class StorefrontController {
  constructor(private readonly storefrontService: StorefrontService) {}

  @Get()
  @ApiOperation({ summary: 'Get storefront overview' })
  getOverview(@Req() req: any) {
    return this.storefrontService.getOverview(req.businessId);
  }

  @Put('profile')
  @ApiOperation({ summary: 'Update storefront profile' })
  updateProfile(@Req() req: any, @Body() dto: UpdateStorefrontProfileDto) {
    return this.storefrontService.updateProfile(req.businessId, dto);
  }

  @Post('logo')
  @ApiOperation({ summary: 'Upload storefront logo' })
  uploadLogo(@Req() req: any, @Body('logoUrl') logoUrl: string) {
    return this.storefrontService.uploadLogo(req.businessId, logoUrl);
  }

  @Post('cover')
  @ApiOperation({ summary: 'Upload storefront cover image' })
  uploadCover(@Req() req: any, @Body('coverUrl') coverUrl: string) {
    return this.storefrontService.uploadCover(req.businessId, coverUrl);
  }

  @Put('hours')
  @ApiOperation({ summary: 'Update opening hours' })
  updateHours(@Req() req: any, @Body() dto: UpdateOpeningHoursDto) {
    return this.storefrontService.updateHours(req.businessId, dto);
  }

  @Put('social')
  @ApiOperation({ summary: 'Update social links' })
  updateSocial(@Req() req: any, @Body() dto: UpdateSocialLinksDto) {
    return this.storefrontService.updateSocial(req.businessId, dto);
  }

  @Get('products')
  @ApiOperation({ summary: 'List products' })
  getProducts(
    @Req() req: any,
    @Query('status') status?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.storefrontService.getProducts(req.businessId, { status, page, limit });
  }

  @Post('products')
  @ApiOperation({ summary: 'Create product' })
  createProduct(@Req() req: any, @Body() dto: CreateProductDto) {
    return this.storefrontService.createProduct(req.businessId, dto);
  }

  @Put('products/:productId')
  @ApiOperation({ summary: 'Update product' })
  updateProduct(@Req() req: any, @Param('productId') productId: string, @Body() dto: UpdateProductDto) {
    return this.storefrontService.updateProduct(req.businessId, productId, dto);
  }

  @Delete('products/:productId')
  @ApiOperation({ summary: 'Delete product' })
  deleteProduct(@Req() req: any, @Param('productId') productId: string) {
    return this.storefrontService.deleteProduct(req.businessId, productId);
  }

  @Post('products/:productId/promote')
  @ApiOperation({ summary: 'Promote product' })
  promoteProduct(@Req() req: any, @Param('productId') productId: string) {
    return this.storefrontService.promoteProduct(req.businessId, productId);
  }

  @Get('services')
  @ApiOperation({ summary: 'List services' })
  getServices(
    @Req() req: any,
    @Query('status') status?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.storefrontService.getServices(req.businessId, { status, page, limit });
  }

  @Post('services')
  @ApiOperation({ summary: 'Create service' })
  createService(@Req() req: any, @Body() dto: CreateServiceDto) {
    return this.storefrontService.createService(req.businessId, dto);
  }

  @Put('services/:serviceId')
  @ApiOperation({ summary: 'Update service' })
  updateService(@Req() req: any, @Param('serviceId') serviceId: string, @Body() dto: UpdateServiceDto) {
    return this.storefrontService.updateService(req.businessId, serviceId, dto);
  }

  @Delete('services/:serviceId')
  @ApiOperation({ summary: 'Delete service' })
  deleteService(@Req() req: any, @Param('serviceId') serviceId: string) {
    return this.storefrontService.deleteService(req.businessId, serviceId);
  }

  @Post('services/:serviceId/spare-capacity')
  @ApiOperation({ summary: 'Create spare capacity offer' })
  createSpareCapacity(@Req() req: any, @Param('serviceId') serviceId: string, @Body() dto: SpareCapacityDto) {
    return this.storefrontService.createSpareCapacity(req.businessId, serviceId, dto);
  }

  @Put('appearance')
  @ApiOperation({ summary: 'Update storefront appearance' })
  updateAppearance(@Req() req: any, @Body() dto: UpdateAppearanceDto) {
    return this.storefrontService.updateAppearance(req.businessId, dto);
  }

  @Post('appearance/banner')
  @ApiOperation({ summary: 'Upload banner image' })
  uploadBanner(
    @Req() req: any,
    @Body('imageUrl') imageUrl: string,
    @Body('title') title?: string,
    @Body('linkUrl') linkUrl?: string,
  ) {
    return this.storefrontService.uploadBanner(req.businessId, imageUrl, { title, linkUrl });
  }

  @Post('appearance/theme')
  @ApiOperation({ summary: 'Apply theme' })
  applyTheme(@Req() req: any, @Body('themeType') themeType: string) {
    return this.storefrontService.applyTheme(req.businessId, themeType);
  }

  @Get('verification')
  @ApiOperation({ summary: 'Get verification status' })
  getVerification(@Req() req: any) {
    return this.storefrontService.getVerification(req.businessId);
  }

  @Post('verification/google')
  @ApiOperation({ summary: 'Connect Google Business' })
  connectGoogle(@Req() req: any, @Body() dto: ConnectGoogleDto) {
    return this.storefrontService.connectGoogle(req.businessId, dto);
  }

  @Post('verification/verify')
  @ApiOperation({ summary: 'Submit verification documents' })
  submitVerification(@Req() req: any, @Body() dto: SubmitVerificationDto) {
    return this.storefrontService.submitVerification(req.businessId, dto);
  }

  @Post('verification/claim')
  @ApiOperation({ summary: 'Claim a business' })
  claimBusiness(@Req() req: any, @CurrentUser('id') userId: string, @Body() dto: ClaimBusinessDto) {
    return this.storefrontService.claimBusiness(req.businessId, userId, dto);
  }
}
