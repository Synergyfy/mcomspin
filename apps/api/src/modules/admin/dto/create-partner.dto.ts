import { IsString, IsOptional, IsEmail, IsEnum, IsObject } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum PartnerRole {
  Agent = 'Agent',
  Consultant = 'Consultant',
  AccountManager = 'AccountManager',
}

export class CreatePartnerDto {
  @ApiProperty()
  @IsString()
  firstName: string;

  @ApiProperty()
  @IsString()
  lastName: string;

  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ enum: PartnerRole })
  @IsEnum(PartnerRole)
  role: PartnerRole;

  @ApiPropertyOptional()
  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}
