import { IsOptional, IsString, IsBoolean } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateAppearanceDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  themeType?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  primaryColor?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  secondaryColor?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  accentColor?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  fontFamily?: string;

  @ApiPropertyOptional()
  @IsOptional()
  borderRadius?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  showProducts?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  showServices?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  showRotator?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  showGamification?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  customCss?: string;
}
