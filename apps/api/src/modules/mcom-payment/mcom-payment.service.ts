import {
  BadRequestException,
  HttpException,
  Injectable,
  NotFoundException,
  ServiceUnavailableException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { BillingService } from '../billing/services/billing.service';
import { SsoService } from '../sso/sso.service';
import {
  InitiatePurchaseDto,
  ConfirmPurchaseDto,
  CapturePurchaseDto,
} from './dto/purchase.dto';

interface BearerRequestOptions {
  method: 'GET' | 'POST';
  body?: Record<string, unknown>;
  accessToken?: string;
}

/**
 * In-app plan purchases proxied to the centralized MCOM Solutions billing
 * engine (same flow as MCOM VCard). MCOM Solutions owns the checkout: we
 * initiate a Stripe/PayPal payment with the user's Central access token, then
 * confirm/capture once the gateway has settled. The `platform` sent to Central
 * is the registered app slug (MCOM_PLATFORM_SLUG, e.g. `spin_local`) so the
 * activation writes a PlatformPackage that flips `canAccess_spin_local`.
 */
@Injectable()
export class McomPaymentService {
  private readonly baseUrl: string;
  private readonly webUrl: string;
  private readonly platformSlug: string;

  constructor(
    private readonly config: ConfigService,
    private readonly prisma: PrismaService,
    private readonly billingService: BillingService,
    private readonly ssoService: SsoService,
  ) {
    this.baseUrl = (this.config.get<string>('MCOM_SOLUTIONS_URL') || 'http://localhost:3010').replace(/\/+$/, '');
    this.webUrl = (this.config.get<string>('WEB_PUBLIC_URL') || 'http://localhost:5004').replace(/\/+$/, '');
    this.platformSlug = this.config.get<string>('MCOM_PLATFORM_SLUG') || 'spin_local';
  }

  /**
   * Kick off a gateway payment on MCOM Solutions. Returns the Stripe
   * `clientSecret` (render a card form) or the PayPal `approvalUrl` (redirect
   * the browser there).
   */
  async initiate(userId: string, dto: InitiatePurchaseDto) {
    await this.requirePurchasablePlan(dto.planId);

    const accessToken = await this.freshAccessToken(userId);
    const billingCycle = this.toCentralCycle(dto.billingCycle);

    return this.bearerRequest(`/api/v1/payment/platform/${dto.provider}/initiate`, {
      method: 'POST',
      accessToken,
      body: {
        platform: this.platformSlug,
        externalPlanId: dto.planId,
        billingCycle,
        returnUrl: this.paypalReturnUrl(),
        cancelUrl: this.paypalCancelUrl(),
      },
    });
  }

  /** Confirm a settled Stripe PaymentIntent/SetupIntent on MCOM Solutions → activates the package + local subscription. */
  async confirmStripe(userId: string, businessId: string, dto: ConfirmPurchaseDto) {
    if (!dto.paymentIntentId && !dto.setupIntentId) {
      throw new BadRequestException('A paymentIntentId or setupIntentId is required');
    }
    await this.requirePurchasablePlan(dto.planId);

    const accessToken = await this.freshAccessToken(userId);
    const billingCycle = this.toCentralCycle(dto.billingCycle);

    const result = await this.bearerRequest('/api/v1/payment/platform/stripe/confirm', {
      method: 'POST',
      accessToken,
      body: {
        platform: this.platformSlug,
        externalPlanId: dto.planId,
        billingCycle,
        ...(dto.setupIntentId ? { setupIntentId: dto.setupIntentId } : { paymentIntentId: dto.paymentIntentId }),
      },
    });

    const subscription = await this.billingService.activatePaidPlan(businessId, {
      planId: dto.planId,
      billingCycle: dto.billingCycle,
      provider: 'stripe',
      providerRef: dto.paymentIntentId || dto.setupIntentId,
    });
    await this.syncCentralPermissions(userId);

    return { ...result, subscription };
  }

  /** Capture an approved PayPal order on MCOM Solutions → activates the package + local subscription. */
  async capturePaypal(userId: string, businessId: string, dto: CapturePurchaseDto) {
    await this.requirePurchasablePlan(dto.planId);

    // MCOM Solutions' capture endpoint is intentionally public (called after
    // PayPal's redirect, orderId-only). No user token required.
    const result = await this.bearerRequest('/api/v1/payment/platform/paypal/capture', {
      method: 'POST',
      body: { orderId: dto.orderId },
    });

    const subscription = await this.billingService.activatePaidPlan(businessId, {
      planId: dto.planId,
      billingCycle: dto.billingCycle,
      provider: 'paypal',
      providerRef: dto.orderId,
    });
    await this.syncCentralPermissions(userId);

    return { ...result, subscription };
  }

  // ── helpers ────────────────────────────────────────────────────────────────

  private toCentralCycle(billingCycle?: 'month' | 'year'): 'monthly' | 'annual' {
    return billingCycle === 'year' ? 'annual' : 'monthly';
  }

  private paypalReturnUrl(): string {
    return `${this.webUrl}/dashboard/billing?paypal_success=1`;
  }

  private paypalCancelUrl(): string {
    return `${this.webUrl}/dashboard/billing`;
  }

  private async requirePurchasablePlan(planId: string) {
    const plan = await this.prisma.subscriptionPlan.findUnique({ where: { id: planId } });
    if (!plan) throw new NotFoundException('Plan not found');
    if (!plan.isActive) throw new BadRequestException('This plan is not currently available');
  }

  /** The user must be SSO-linked and have a usable Central access token. */
  private async freshAccessToken(userId: string): Promise<string> {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    const metadata = (user.metadata ?? {}) as Record<string, unknown>;
    const centralAccessToken = metadata.centralAccessToken as string | undefined;
    const centralRefreshToken = metadata.centralRefreshToken as string | undefined;

    if (centralAccessToken) {
      try {
        await this.ssoService.getCentralUserInfo(centralAccessToken);
        return centralAccessToken;
      } catch {
        // Token expired/invalid — fall through to refresh
      }
    }

    if (!centralRefreshToken) {
      throw new UnauthorizedException('Your MCOM session has expired — sign in with MCOM again to continue');
    }

    try {
      const refreshed = await this.ssoService.refreshCentralToken(centralRefreshToken);
      await this.prisma.user.update({
        where: { id: userId },
        data: {
          metadata: {
            ...metadata,
            centralAccessToken: refreshed.accessToken,
          } as unknown as Prisma.InputJsonValue,
        },
      });
      return refreshed.accessToken;
    } catch {
      // The stored Central tokens are dead (session cleared/expired on MCOM
      // Solutions). A fresh SSO authorization is the only way to re-issue them.
      throw new UnauthorizedException('Your MCOM session has expired — sign in with MCOM again to continue');
    }
  }

  /** Re-sync the user's Central profile + permissions so `hasAccess` reflects the new package. */
  private async syncCentralPermissions(userId: string): Promise<void> {
    try {
      const accessToken = await this.freshAccessToken(userId);
      const profile = await this.ssoService.getCentralUserInfo(accessToken);
      const user = await this.prisma.user.findUnique({ where: { id: userId } });
      const metadata = (user?.metadata ?? {}) as Record<string, unknown>;
      await this.prisma.user.update({
        where: { id: userId },
        data: {
          metadata: {
            ...metadata,
            centralProfile: profile,
            centralPermissions: profile.permissions ?? {},
          } as unknown as Prisma.InputJsonValue,
        },
      });
    } catch {
      // Non-fatal: the next SSO status refresh will pick up the change.
    }
  }

  private async bearerRequest(path: string, opts: BearerRequestOptions): Promise<Record<string, unknown>> {
    const url = `${this.baseUrl}${path}`;

    let res: Response;
    try {
      res = await fetch(url, {
        method: opts.method,
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          ...(opts.accessToken ? { Authorization: `Bearer ${opts.accessToken}` } : {}),
        },
        body: opts.method === 'POST' && opts.body !== undefined ? JSON.stringify(opts.body) : undefined,
      });
    } catch (err) {
      throw new ServiceUnavailableException(
        `MCOM Solutions unreachable at ${this.baseUrl}: ${err instanceof Error ? err.message : String(err)}`,
      );
    }

    if (!res.ok) {
      const text = await res.text().catch(() => '');
      const detail = this.extractMessage(text);
      const suffix = detail ? `: ${detail}` : '';
      if (res.status === 401 || res.status === 403) {
        throw new UnauthorizedException(`MCOM Solutions rejected the request (${res.status})${suffix}`);
      }
      if (res.status === 404) {
        throw new NotFoundException(`MCOM Solutions: ${text.slice(0, 300)}`);
      }
      if (res.status >= 500) {
        throw new ServiceUnavailableException(`MCOM Solutions error (${res.status}): ${text.slice(0, 300)}`);
      }
      throw new HttpException(text.slice(0, 300), res.status);
    }

    const text = await res.text();
    return text ? JSON.parse(text) : {};
  }

  /** Best-effort pull of Central's human-readable error message from its response body. */
  private extractMessage(body: string): string | null {
    if (!body) return null;
    try {
      const parsed = JSON.parse(body) as { message?: unknown };
      if (typeof parsed?.message === 'string') return parsed.message.slice(0, 300);
    } catch {
      // fall through to the raw snippet
    }
    return body.slice(0, 300) || null;
  }
}