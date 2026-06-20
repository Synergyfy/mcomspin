import { Controller, Post, Body, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { BusinessAuthService } from '../services/business-auth.service';
import { BusinessRegisterDto } from '../dto/business-register.dto';
import { BusinessVerifyDto } from '../dto/business-verify.dto';
import { Public } from '../../../common/decorators/public.decorator';

@ApiTags('Business - Auth')
@Controller('auth/business')
export class BusinessAuthController {
  constructor(private readonly businessAuthService: BusinessAuthService) {}

  @Public()
  @Post('register')
  @ApiOperation({ summary: 'Register a new business account' })
  register(@Body() dto: BusinessRegisterDto) {
    return this.businessAuthService.register(dto);
  }

  @Public()
  @Post('verify')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Verify business email/phone' })
  verify(@Body() dto: BusinessVerifyDto) {
    return this.businessAuthService.verify(dto);
  }
}
