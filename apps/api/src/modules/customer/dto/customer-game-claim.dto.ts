import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CustomerGameClaimDto {
  @ApiProperty()
  @IsString()
  sessionId: string;
}
