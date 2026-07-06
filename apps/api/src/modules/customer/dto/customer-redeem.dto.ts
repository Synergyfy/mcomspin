import { IsString, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum RedeemMethod {
  QR = 'qr',
  Code = 'code',
}

export class CustomerRedeemDto {
  @ApiProperty()
  @IsString()
  rewardId: string;

  @ApiProperty({ enum: RedeemMethod })
  @IsEnum(RedeemMethod)
  method: RedeemMethod;
}
