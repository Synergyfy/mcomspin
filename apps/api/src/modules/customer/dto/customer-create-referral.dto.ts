import { IsString, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CustomerCreateReferralDto {
  @ApiProperty()
  @IsString()
  inviteeEmail: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  message?: string;
}
