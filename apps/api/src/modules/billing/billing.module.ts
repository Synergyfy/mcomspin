import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PrismaModule } from '../../prisma/prisma.module';
import { BillingController } from './controllers/billing.controller';
import { BillingService } from './services/billing.service';
import { PlanExpiryService } from './services/plan-expiry.service';
import { PlanCapabilityService } from './services/plan-capability.service';
import { PlanCapabilityGuard } from '../../common/guards/plan-capability.guard';
import { McomWalletService } from './services/mcom-wallet.service';
import { SolutionsPaymentProxyService } from './services/solutions-payment-proxy.service';

@Module({
  imports: [
    PrismaModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('JWT_ACCESS_SECRET', 'access-secret'),
        signOptions: { expiresIn: '15m' },
      }),
    }),
  ],
  controllers: [BillingController],
  providers: [
    BillingService,
    PlanExpiryService,
    PlanCapabilityService,
    PlanCapabilityGuard,
    McomWalletService,
    SolutionsPaymentProxyService,
  ],
  exports: [
    BillingService,
    PlanExpiryService,
    PlanCapabilityService,
    PlanCapabilityGuard,
    McomWalletService,
    SolutionsPaymentProxyService,
  ],
})
export class BillingModule {}
