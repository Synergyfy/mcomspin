import { IsOptional, IsString, IsObject, IsNumber, IsBoolean } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateSettingsDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsObject()
  general?: {
    platformName?: string;
    logo?: string;
    supportEmail?: string;
    supportPhone?: string;
  };

  @ApiPropertyOptional()
  @IsOptional()
  @IsObject()
  game?: {
    defaultBallSpeed?: string;
    defaultShuffleDuration?: number;
    defaultBoxCount?: number;
  };

  @ApiPropertyOptional()
  @IsOptional()
  @IsObject()
  reward?: {
    defaultExpiry?: number;
    defaultInventoryRules?: Record<string, any>;
  };

  @ApiPropertyOptional()
  @IsOptional()
  @IsObject()
  notification?: {
    email?: Record<string, any>;
    sms?: Record<string, any>;
    push?: Record<string, any>;
  };

  @ApiPropertyOptional()
  @IsOptional()
  @IsObject()
  security?: {
    passwordRules?: Record<string, any>;
    loginRules?: Record<string, any>;
    fraudRules?: Record<string, any>;
  };

  @ApiPropertyOptional()
  @IsOptional()
  @IsObject()
  api?: {
    integrationKeys?: Record<string, any>;
    webhooks?: Record<string, any>;
  };
}
