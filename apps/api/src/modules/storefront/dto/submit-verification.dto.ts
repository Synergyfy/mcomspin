import { IsString, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class SubmitVerificationDto {
  @ApiProperty()
  @IsString()
  documentType: string;

  @ApiProperty()
  @IsString()
  documentUrl: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notes?: string;
}
