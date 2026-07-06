import { IsString, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePartnershipRequestDto {
  @ApiProperty()
  @IsString()
  targetBusinessId: string;

  @ApiProperty()
  @IsString()
  partnershipType: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  message?: string;
}
