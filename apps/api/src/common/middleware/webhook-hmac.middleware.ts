import { Injectable, NestMiddleware, UnauthorizedException, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as crypto from 'crypto';

@Injectable()
export class WebhookHmacMiddleware implements NestMiddleware {
  private readonly logger = new Logger('WebhookHMAC');

  use(req: Request, res: Response, next: NextFunction) {
    const signature = req.headers['x-webhook-signature'] as string;
    const timestamp = req.headers['x-webhook-timestamp'] as string;

    if (!signature || !timestamp) {
      throw new UnauthorizedException('Missing webhook signature headers');
    }

    const age = Date.now() - Number(timestamp);
    if (age > 5 * 60 * 1000) {
      throw new UnauthorizedException('Webhook timestamp expired');
    }

    const secret = process.env.WEBHOOK_SECRET;
    if (!secret) {
      this.logger.warn('WEBHOOK_SECRET not configured — skipping HMAC verification');
      return next();
    }

    const rawBody = (req as any).rawBody;
    if (!rawBody) {
      throw new UnauthorizedException('Raw body not available for verification');
    }

    const payload = `${timestamp}.${rawBody}`;
    const expected = crypto.createHmac('sha256', secret).update(payload).digest('hex');

    if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) {
      throw new UnauthorizedException('Invalid webhook signature');
    }

    next();
  }
}
