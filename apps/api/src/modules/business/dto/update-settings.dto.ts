import { IsOptional, IsObject, IsBoolean, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateBusinessSettingsDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsObject()
  notifications?: {
    email?: boolean;
    sms?: boolean;
    push?: boolean;
  };

  @ApiPropertyOptional()
  @IsOptional()
  @IsObject()
  branding?: {
    logo?: string;
    colours?: Record<string, string>;
    banners?: Record<string, string>;
  };

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  password?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  twoFactorEnabled?: boolean;
}
