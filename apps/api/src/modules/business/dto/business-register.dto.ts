import { IsString, IsOptional, IsEmail, IsEnum, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum BusinessType {
  Restaurant = 'Restaurant',
  Salon = 'Salon',
  Barber = 'Barber',
  Retail = 'Retail',
  Fashion = 'Fashion',
  Beauty = 'Beauty',
  Event = 'Event',
  Other = 'Other',
}

export class BusinessRegisterDto {
  @ApiProperty()
  @IsString()
  businessName: string;

  @ApiProperty()
  @IsString()
  contactName: string;

  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty()
  @IsString()
  @MinLength(8)
  password: string;

  @ApiProperty({ enum: BusinessType })
  @IsEnum(BusinessType)
  businessType: BusinessType;
}
