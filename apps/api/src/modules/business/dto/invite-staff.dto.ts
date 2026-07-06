import { IsString, IsEmail, IsOptional, IsEnum, IsObject } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum StaffRole {
  Manager = 'Manager',
  Cashier = 'Cashier',
  Editor = 'Editor',
  ViewOnly = 'ViewOnly',
}

export class InviteStaffDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty({ enum: StaffRole })
  @IsEnum(StaffRole)
  role: StaffRole;

  @ApiPropertyOptional()
  @IsOptional()
  @IsObject()
  permissions?: Record<string, boolean>;
}
