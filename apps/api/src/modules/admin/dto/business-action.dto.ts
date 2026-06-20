import { IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum BusinessAction {
  Approve = 'approve',
  Suspend = 'suspend',
  Activate = 'activate',
}

export class BusinessActionDto {
  @ApiProperty({ enum: BusinessAction })
  @IsEnum(BusinessAction)
  action: BusinessAction;
}
