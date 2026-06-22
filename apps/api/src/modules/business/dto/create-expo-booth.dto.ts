import { IsString, IsOptional, IsArray, IsObject } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateExpoBoothDto {
  @ApiProperty()
  @IsString()
  expoId: string;

  @ApiProperty()
  @IsString()
  name: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  featuredProducts?: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsObject()
  customizations?: Record<string, any>;
}
