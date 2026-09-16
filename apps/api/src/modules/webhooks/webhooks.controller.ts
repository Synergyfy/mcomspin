import { Controller, Post, Body, Headers, HttpCode, HttpStatus, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { Public } from '../../common/decorators/public.decorator';
import { WebhooksService } from './webhooks.service';

@ApiTags('Webhooks')
@Controller('webhooks')
export class WebhooksController {
  constructor(
    private readonly webhooksService: WebhooksService,
    private readonly configService: ConfigService,
  ) {}

  private verifySecret(secretHeader?: string) {
    const configuredSecret =
      this.configService.get<string>('WEBHOOK_SECRET') ||
      this.configService.get<string>('MCOM_HMAC_SECRET');
    if (configuredSecret && secretHeader !== configuredSecret) {
      throw new UnauthorizedException('Invalid or missing webhook signature/secret');
    }
  }

  @Public()
  @Post('payment/success')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Payment gateway success callback' })
  handlePaymentSuccess(
    @Headers('x-webhook-secret') secret: string,
    @Body() payload: any,
  ) {
    this.verifySecret(secret);
    return this.webhooksService.handlePaymentSuccess(payload);
  }

  @Public()
  @Post('payment/failed')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Payment gateway failure callback' })
  handlePaymentFailed(
    @Headers('x-webhook-secret') secret: string,
    @Body() payload: any,
  ) {
    this.verifySecret(secret);
    return this.webhooksService.handlePaymentFailed(payload);
  }

  @Public()
  @Post('google/notification')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Google Business Profile notification' })
  handleGoogleNotification(
    @Headers('x-webhook-secret') secret: string,
    @Body() payload: any,
  ) {
    this.verifySecret(secret);
    return this.webhooksService.handleGoogleNotification(payload);
  }
}
