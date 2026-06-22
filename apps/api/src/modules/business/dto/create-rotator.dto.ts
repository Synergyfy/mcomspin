import { IsString, IsOptional, IsArray, IsNumber, IsBoolean, IsObject } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateRotatorDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  type: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  productIds?: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  promotionIds?: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  eventIds?: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  serviceIds?: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  displaySpeed?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  displayDuration?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  priority?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsObject()
  displaySettings?: Record<string, any>;
}
