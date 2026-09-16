import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class SolutionsPaymentProxyService {
  constructor(private readonly prisma: PrismaService) {}

  async initiateStripe(planVariantId: string, accessToken: string) {
    if (!planVariantId) {
      throw new BadRequestException('planVariantId is required');
    }

    const clientSecret = `pi_${planVariantId.slice(0, 8)}_secret_${Date.now()}`;
    return {
      clientSecret,
      platform: 'MCOM Mall',
      externalPlanId: planVariantId,
    };
  }

  async confirmStripe(paymentIntentId: string, accessToken: string) {
    if (!paymentIntentId) {
      throw new BadRequestException('paymentIntentId is required');
    }

    return {
      ok: true,
      details: {
        status: 'succeeded',
        paymentIntentId,
      },
    };
  }

  async initiatePayPal(planVariantId: string, returnUrl: string, cancelUrl: string, accessToken: string) {
    if (!planVariantId) {
      throw new BadRequestException('planVariantId is required');
    }

    const orderId = `PAYPAL-ORDER-${planVariantId.slice(0, 8)}-${Date.now()}`;
    const approvalUrl = `https://www.sandbox.paypal.com/checkoutnow?token=${orderId}`;

    return {
      orderId,
      approvalUrl,
    };
  }

  async capturePayPal(orderId: string, accessToken: string) {
    if (!orderId) {
      throw new BadRequestException('orderId is required');
    }

    return {
      ok: true,
      status: 'COMPLETED',
      orderId,
    };
  }
}
