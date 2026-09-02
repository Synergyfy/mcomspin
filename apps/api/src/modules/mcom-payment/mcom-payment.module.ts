import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { BillingModule } from '../billing/billing.module';
import { SsoModule } from '../sso/sso.module';
import { McomPaymentController } from './mcom-payment.controller';
import { McomPaymentService } from './mcom-payment.service';

@Module({
  imports: [PrismaModule, BillingModule, SsoModule],
  controllers: [McomPaymentController],
  providers: [McomPaymentService],
})
export class McomPaymentModule {}