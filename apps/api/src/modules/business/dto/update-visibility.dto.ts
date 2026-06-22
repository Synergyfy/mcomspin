import { IsBoolean, IsOptional, IsObject } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateVisibilityDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  featured?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  highStreetVisibility?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  boroughVisibility?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  rotatorVisibility?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  gamificationVisibility?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}
