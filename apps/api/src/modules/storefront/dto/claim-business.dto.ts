import { IsString, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ClaimBusinessDto {
  @ApiProperty()
  @IsString()
  businessId: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  message?: string;
}
