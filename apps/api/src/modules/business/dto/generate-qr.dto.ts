import { IsString, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { QLinkType } from '@prisma/client';

export class GenerateQrDto {
  @ApiProperty({ enum: QLinkType })
  @IsEnum(QLinkType)
  type: QLinkType;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  targetId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  targetUrl?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  label?: string;
}
