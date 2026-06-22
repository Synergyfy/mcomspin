import { IsString, IsOptional, IsEnum, IsDateString, IsBoolean, IsObject } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PromotionType } from '@prisma/client';

export class CreatePromotionDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ enum: PromotionType })
  @IsEnum(PromotionType)
  type: PromotionType;

  @ApiProperty()
  @IsDateString()
  startDate: string;

  @ApiProperty()
  @IsDateString()
  endDate: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  discountType?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  discountValue?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  minPurchase?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  maxDiscount?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  imageUrl?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  terms?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isFeatured?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isBorough?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isRotator?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isQr?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isReward?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsObject()
  audience?: Record<string, any>;
}
