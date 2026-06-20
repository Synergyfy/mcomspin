import { IsString, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ActivateBusinessDto {
  @ApiProperty()
  @IsString()
  targetBusinessId: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  message?: string;
}
