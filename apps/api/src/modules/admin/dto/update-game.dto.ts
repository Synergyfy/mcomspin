import { IsOptional, IsString, IsObject, IsBoolean, IsNumber } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateGameDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsObject()
  config?: {
    ballSpeed?: string;
    physicsStrength?: number;
    boxOptions?: number[];
    shuffleEnabled?: boolean;
    shuffleDuration?: number;
    soundEnabled?: boolean;
    animationEnabled?: boolean;
  };

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
