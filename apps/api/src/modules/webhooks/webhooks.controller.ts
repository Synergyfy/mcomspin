import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { Public } from '../../common/decorators/public.decorator';
import { WebhooksService } from './webhooks.service';

@ApiTags('Webhooks')
@Controller('webhooks')
export class WebhooksController {
  constructor(private readonly webhooksService: WebhooksService) {}

  @Public()
  @Post('payment/success')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Payment gateway success callback' })
  handlePaymentSuccess(@Body() payload: any) {
    return this.webhooksService.handlePaymentSuccess(payload);
  }

  @Public()
  @Post('payment/failed')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Payment gateway failure callback' })
  handlePaymentFailed(@Body() payload: any) {
    return this.webhooksService.handlePaymentFailed(payload);
  }

  @Public()
  @Post('google/notification')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Google Business Profile notification' })
  handleGoogleNotification(@Body() payload: any) {
    return this.webhooksService.handleGoogleNotification(payload);
  }
}
