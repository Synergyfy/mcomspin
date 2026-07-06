import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ConnectGoogleDto {
  @ApiProperty()
  @IsString()
  googleBusinessId: string;

  @ApiProperty()
  @IsString()
  accessToken: string;
}
