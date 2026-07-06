import { IsString, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CustomerGameDropDto {
  @ApiProperty()
  @IsString()
  sessionId: string;

  @ApiProperty()
  @IsNumber()
  boxIndex: number;
}
