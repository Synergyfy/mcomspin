import { IsString, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum BoostDuration {
  HOURS_24 = '24h',
  DAYS_7 = '7d',
  DAYS_30 = '30d',
}

export enum BoostType {
  BOROUGH = 'borough_boost',
  HIGH_STREET = 'high_street_boost',
  EVENT = 'event_boost',
  PRODUCT = 'product_boost',
}

export class CreateVisibilityBoostDto {
  @ApiProperty({ enum: BoostType })
  @IsEnum(BoostType)
  boostType: BoostType;

  @ApiProperty({ enum: BoostDuration })
  @IsEnum(BoostDuration)
  duration: BoostDuration;
}
