import { IsOptional, IsArray, IsString, IsBoolean, IsObject } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class NotificationPref {
  @IsString()
  type: string;

  @IsBoolean()
  enabled: boolean;

  @IsString()
  channel: string;
}

export class CustomerUpdateSettingsDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  notificationPrefs?: NotificationPref[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  language?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsObject()
  privacy?: Record<string, boolean>;
}
