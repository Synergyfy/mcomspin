import { IsString, IsOptional, IsDateString, IsObject } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateSharedCampaignDto {
  @ApiProperty()
  @IsString()
  partnerBusinessId: string;

  @ApiProperty()
  @IsString()
  campaignType: string;

  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsDateString()
  startDate: string;

  @ApiProperty()
  @IsDateString()
  endDate: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsObject()
  offerDetails?: Record<string, any>;

  @ApiPropertyOptional()
  @IsOptional()
  @IsObject()
  contribution?: Record<string, any>;
}
