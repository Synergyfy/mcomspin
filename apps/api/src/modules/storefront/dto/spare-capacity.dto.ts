import { IsString, IsNumber, IsOptional, IsDateString, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class SpareCapacityDto {
  @ApiProperty()
  @IsDateString()
  date: string;

  @ApiProperty()
  @IsString()
  startTime: string;

  @ApiProperty()
  @IsString()
  endTime: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Min(0)
  discountedPrice?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  offerTitle?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  offerDescription?: string;
}
