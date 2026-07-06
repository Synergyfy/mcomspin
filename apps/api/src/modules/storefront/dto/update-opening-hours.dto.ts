import { IsArray, IsOptional, IsString, IsObject } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateOpeningHoursDto {
  @ApiPropertyOptional({ description: 'Opening hours per day' })
  @IsOptional()
  @IsObject()
  hours?: Record<string, { open: string; close: string }[]>;

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  holidays?: string[];
}
