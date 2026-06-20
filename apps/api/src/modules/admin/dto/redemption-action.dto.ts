import { IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum RedemptionAction {
  Approve = 'approve',
  Reject = 'reject',
}

export class RedemptionActionDto {
  @ApiProperty({ enum: RedemptionAction })
  @IsEnum(RedemptionAction)
  action: RedemptionAction;
}
