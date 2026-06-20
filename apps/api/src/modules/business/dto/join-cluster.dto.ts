import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class JoinClusterDto {
  @ApiProperty()
  @IsString()
  clusterId: string;
}
