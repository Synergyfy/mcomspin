import { IsString, IsOptional, IsEnum, IsDateString, IsNumber, IsObject } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class VoucherType {
  static readonly GIFT = 'gift';
  static readonly DISCOUNT = 'discount';
  static readonly QR = 'qr';
  static readonly REWARD = 'reward';
  static readonly MEMBERSHIP = 'membership';
}

export class CreateVoucherDto {
  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsString()
  type: string;

  @ApiProperty()
  @IsString()
  value: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  expiresAt?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsObject()
  rules?: Record<string, any>;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  distribution?: string;
}
