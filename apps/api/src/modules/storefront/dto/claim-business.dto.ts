import { IsString, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class ClaimBusinessDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  message?: string;
}
