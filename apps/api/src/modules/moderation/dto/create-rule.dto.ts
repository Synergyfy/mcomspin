import { IsString, IsOptional, IsBoolean, IsInt, IsObject } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateRuleDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'Target resource type (post, product, review, message)' })
  @IsString()
  resource: string;

  @ApiProperty({ description: 'Matching conditions as JSON object' })
  @IsObject()
  conditions: Record<string, unknown>;

  @ApiProperty({ enum: ['Warning', 'ContentRemoval', 'TemporarySuspension', 'PermanentBan'] })
  @IsString()
  action: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  priority?: number;
}
