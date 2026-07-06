import { IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum CustomerAction {
  Suspend = 'suspend',
  Activate = 'activate',
}

export class CustomerActionDto {
  @ApiProperty({ enum: CustomerAction })
  @IsEnum(CustomerAction)
  action: CustomerAction;
}
