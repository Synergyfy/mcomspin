import { Controller, Get, Post, Put, Body, Query, UseGuards, Req, BadRequestException, NotFoundException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { BusinessOwnerGuard } from '../guards/business-owner.guard';
import { PrismaService } from '../../../prisma/prisma.service';
import { PlanExpiryService } from '../../billing/services/plan-expiry.service';
import { McomWalletService } from '../../billing/services/mcom-wallet.service';
import { SolutionsPaymentProxyService } from '../../billing/services/solutions-payment-proxy.service';

export interface InitiatePaymentDto {
  provider: 'mcom_wallet' | 'stripe' | 'paypal';
  planVariantId: string;
  idempotencyKey?: string;
  returnUrl?: string;
  cancelUrl?: string;
}

export interface VerifyPaymentDto {
  provider: 'mcom_wallet' | 'stripe' | 'paypal';
  planVariantId: string;
  holdId?: string;
  transactionId?: string;
  idempotencyKey?: string;
}

@ApiTags('Business - Membership')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, BusinessOwnerGuard)
@Controller('business')
export class BusinessMembershipController {
  constructor(
    private readonly prisma: PrismaService,
    private readonly planExpiryService: PlanExpiryService,
    private readonly walletService: McomWalletService,
    private readonly paymentProxy: SolutionsPaymentProxyService,
  ) {}

  @Get('membership')
  @ApiOperation({ summary: 'Get unified membership details' })
  async getMembership(@Req() req: any) {
    const userId = req.user?.id;
    const businessId = req.businessId;

    let membership = await this.prisma.membership.findUnique({
      where: { userId },
      include: {
        planVariant: {
          include: {
            plan: true,
            tierLevel: true,
          },
        },
        price: true,
        payment: true,
      },
    });

    if (!membership && businessId) {
      // Fallback check on BusinessMembership if legacy
      const legacy = await this.prisma.businessMembership.findUnique({
        where: { businessId },
      });
      return { legacy, isUnified: false };
    }

    return { membership, isUnified: true };
  }

  @Get('membership/plans')
  @ApiOperation({ summary: 'List all available unified plans with variants and prices' })
  async listPlans() {
    return this.prisma.plan.findMany({
      where: { isActive: true },
      include: {
        variants: {
          where: { isActive: true },
          include: {
            tierLevel: true,
            prices: {
              where: { isActive: true },
              orderBy: { createdAt: 'desc' },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  @Post('membership/initiate-payment')
  @ApiOperation({ summary: 'Initiate payment hold/intent via MCOM Solutions or Wallet' })
  async initiatePayment(@Req() req: any, @Body() dto: InitiatePaymentDto) {
    const userId = req.user?.id;
    const authHeader = req.headers?.authorization ?? '';
    const token = authHeader.replace(/^Bearer\s+/i, '');

    const variant = await this.prisma.planVariant.findUnique({
      where: { id: dto.planVariantId },
      include: { prices: { where: { isActive: true }, orderBy: { createdAt: 'desc' }, take: 1 } },
    });
    if (!variant || variant.prices.length === 0) {
      throw new NotFoundException(`PlanVariant "${dto.planVariantId}" not found or has no active price`);
    }

    const price = variant.prices[0];
    const amount = Number(price.amount);
    const key = dto.idempotencyKey || `init_${userId}_${dto.planVariantId}_${Date.now()}`;

    if (dto.provider === 'mcom_wallet') {
      const hold = await this.walletService.createHold(userId, amount, key);
      return { provider: 'mcom_wallet', holdId: hold.holdId, expiresAt: hold.expiresAt, amount };
    } else if (dto.provider === 'stripe') {
      const res = await this.paymentProxy.initiateStripe(dto.planVariantId, token);
      return { provider: 'stripe', clientSecret: res.clientSecret, amount };
    } else if (dto.provider === 'paypal') {
      const res = await this.paymentProxy.initiatePayPal(
        dto.planVariantId,
        dto.returnUrl || 'http://localhost:3000/dashboard/membership',
        dto.cancelUrl || 'http://localhost:3000/dashboard/membership',
        token,
      );
      return { provider: 'paypal', orderId: res.orderId, approvalUrl: res.approvalUrl, amount };
    }

    throw new BadRequestException(`Unsupported provider "${dto.provider}"`);
  }

  @Post('membership/verify-payment')
  @ApiOperation({ summary: 'Verify payment and activate membership in-place' })
  async verifyPayment(@Req() req: any, @Body() dto: VerifyPaymentDto) {
    const userId = req.user?.id;
    const businessId = req.businessId;
    const authHeader = req.headers?.authorization ?? '';
    const token = authHeader.replace(/^Bearer\s+/i, '');

    const variant = await this.prisma.planVariant.findUnique({
      where: { id: dto.planVariantId },
      include: {
        plan: true,
        tierLevel: true,
        prices: { where: { isActive: true }, orderBy: { createdAt: 'desc' }, take: 1 },
      },
    });
    if (!variant || variant.prices.length === 0) {
      throw new NotFoundException(`PlanVariant "${dto.planVariantId}" not found or active price missing`);
    }

    const price = variant.prices[0];
    const key = dto.idempotencyKey || dto.transactionId || dto.holdId || `tx_${userId}_${Date.now()}`;

    // 1. Idempotency Check
    const existingPayment = await this.prisma.membershipPayment.findUnique({
      where: { transactionId: key },
      include: { memberships: true },
    });

    if (existingPayment && existingPayment.memberships.length > 0) {
      return { ok: true, membership: existingPayment.memberships[0], idempotencyReplay: true };
    }

    let finalTxId = key;

    // 2. Capture / Confirm with Provider
    if (dto.provider === 'mcom_wallet') {
      if (!dto.holdId) throw new BadRequestException('holdId is required for mcom_wallet verification');
      const capture = await this.walletService.captureHold(userId, dto.holdId, key);
      finalTxId = capture.transactionId;
    } else if (dto.provider === 'stripe') {
      if (!dto.transactionId) throw new BadRequestException('transactionId (PaymentIntent ID) is required for stripe');
      await this.paymentProxy.confirmStripe(dto.transactionId, token);
      finalTxId = dto.transactionId;
    } else if (dto.provider === 'paypal') {
      if (!dto.transactionId) throw new BadRequestException('transactionId (Order ID) is required for paypal');
      await this.paymentProxy.capturePayPal(dto.transactionId, token);
      finalTxId = dto.transactionId;
    }

    // 3. Compute Leap-Safe Expiry Date
    const now = new Date();
    let expiresAt: Date;
    const tierName = variant.tierLevel.name;

    if (tierName === 'PRO') {
      expiresAt = this.planExpiryService.proExpiry(now);
    } else if (tierName === 'PRO_PLUS') {
      expiresAt = this.planExpiryService.proPlusExpiry(now);
    } else {
      expiresAt = this.planExpiryService.standardExpiry(now);
    }

    // 4. Save Payment & Update Membership In-Place (1:1 constraint)
    return this.prisma.$transaction(async (tx) => {
      const savedPayment = await tx.membershipPayment.create({
        data: {
          userId,
          amount: price.amount,
          currency: price.currency,
          paymentMethod: dto.provider,
          transactionId: finalTxId,
        },
      });

      const prior = await tx.membership.findUnique({ where: { userId } });

      const membership = await tx.membership.upsert({
        where: { userId },
        create: {
          userId,
          planVariantId: variant.id,
          priceId: price.id,
          paymentId: savedPayment.id,
          isActive: true,
          isTrial: false,
          startDate: now,
          expiresAt: expiresAt,
          endDate: expiresAt,
        },
        update: {
          planVariantId: variant.id,
          priceId: price.id,
          paymentId: savedPayment.id,
          isActive: true,
          isTrial: false,
          startDate: now,
          expiresAt: expiresAt,
          endDate: expiresAt,
        },
        include: {
          planVariant: {
            include: {
              plan: true,
              tierLevel: true,
            },
          },
          price: true,
          payment: true,
        },
      });

      // Synchronize legacy BusinessMembership if businessId is present
      if (businessId) {
        const legacyTier = variant.plan.name.includes('Gold')
          ? 'Gold'
          : variant.plan.name.includes('Silver')
          ? 'Silver'
          : variant.plan.name.includes('Bronze')
          ? 'Bronze'
          : 'Free';

        await tx.businessMembership.upsert({
          where: { businessId },
          create: {
            businessId,
            tier: legacyTier as any,
            expiresAt: expiresAt,
            features: variant.configuration ?? {},
          },
          update: {
            tier: legacyTier as any,
            expiresAt: expiresAt,
            features: variant.configuration ?? {},
          },
        });
      }

      return { ok: true, membership };
    });
  }

  @Get('credits')
  @ApiOperation({ summary: 'Get credit balance' })
  async getCredits(@Req() req: any) {
    const credits = await this.prisma.credit.findMany({ where: { businessId: req.businessId } });
    return credits;
  }

  @Post('credits/redeem')
  @ApiOperation({ summary: 'Redeem credits' })
  async redeemCredits(@Req() req: any, @Body() dto: { creditId: string; amount: number; reason?: string }) {
    const credit = await this.prisma.credit.findUnique({ where: { id: dto.creditId } });
    if (!credit || credit.businessId !== req.businessId) throw new NotFoundException('Credit not found');
    if (Number(credit.balance) < dto.amount) throw new BadRequestException('Insufficient credits');

    await this.prisma.creditUsage.create({
      data: { creditId: dto.creditId, amount: dto.amount, referenceType: 'manual', metadata: dto.reason ? { reason: dto.reason } : undefined },
    });
    await this.prisma.credit.update({
      where: { id: dto.creditId },
      data: { balance: { decrement: dto.amount } },
    });
    return { message: `Redeemed ${dto.amount} credits` };
  }

  @Get('audits')
  @ApiOperation({ summary: 'Get audit history' })
  async getAudits(@Req() req: any, @Query('page') page?: number, @Query('limit') limit?: number) {
    const p = page || 1;
    const l = limit || 20;
    const [items, total] = await Promise.all([
      this.prisma.audit.findMany({
        where: { businessId: req.businessId },
        skip: (p - 1) * l,
        take: l,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.audit.count({ where: { businessId: req.businessId } }),
    ]);
    return { data: items, meta: { page: p, limit: l, total, totalPages: Math.ceil(total / l) } };
  }

  @Post('audits/run')
  @ApiOperation({ summary: 'Run a new audit' })
  async runAudit(@Req() req: any, @Body() dto: { type?: string }) {
    return this.prisma.audit.create({
      data: { businessId: req.businessId, type: (dto.type || 'Short') as any },
    });
  }

  @Get('recommendations')
  @ApiOperation({ summary: 'Get improvement recommendations' })
  async getRecommendations(@Req() req: any) {
    return this.prisma.auditRecommendation.findMany({
      where: { businessId: req.businessId },
      orderBy: { createdAt: 'desc' },
    });
  }
}
