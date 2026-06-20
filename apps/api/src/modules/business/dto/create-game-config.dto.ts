import { IsString, IsOptional, IsEnum, IsArray, IsObject, IsNumber } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { GameType } from '@prisma/client';

export class CreateGameConfigDto {
  @ApiProperty({ enum: GameType })
  @IsEnum(GameType)
  gameType: GameType;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  rewardIds?: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsObject()
  rules?: Record<string, any>;

  @ApiPropertyOptional()
  @IsOptional()
  @IsObject()
  config?: Record<string, any>;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  maxPlaysPerCustomer?: number;
}
