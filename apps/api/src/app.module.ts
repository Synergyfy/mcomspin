import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { UploadsModule } from './modules/uploads/uploads.module';
import { AdminModule } from './modules/admin/admin.module';
import { BusinessModule } from './modules/business/business.module';
import { CustomerModule } from './modules/customer/customer.module';
import { StorefrontModule } from './modules/storefront/storefront.module';
import { MallAdminModule } from './modules/mall-admin/mall-admin.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { BillingModule } from './modules/billing/billing.module';
import { ModerationModule } from './modules/moderation/moderation.module';
import { WebhooksModule } from './modules/webhooks/webhooks.module';
import { WebsocketModule } from './modules/websocket/websocket.module';
import { PublicModule } from './modules/public/public.module';
import { SsoModule } from './modules/sso/sso.module';
import { SystemModule } from './modules/system/system.module';
import { McomPaymentModule } from './modules/mcom-payment/mcom-payment.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { RolesGuard } from './common/guards/roles.guard';
import { PermissionsGuard } from './common/guards/permissions.guard';
import { ThrottleGuard } from './common/guards/throttle.guard';
import { BoroughScopeGuard } from './common/guards/borough-scope.guard';
import { RequestLoggerMiddleware } from './common/middleware/request-logger.middleware';
import { DeviceDetectorMiddleware } from './common/middleware/device-detector.middleware';
import { WebhookHmacMiddleware } from './common/middleware/webhook-hmac.middleware';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRoot([{ ttl: 60000, limit: 100 }]),
    PrismaModule,
    AuthModule,
    UsersModule,
    UploadsModule,
    AdminModule,
    BusinessModule,
    CustomerModule,
    StorefrontModule,
    MallAdminModule,
    NotificationsModule,
    BillingModule,
    ModerationModule,
    WebhooksModule,
    WebsocketModule,
    PublicModule,
    SsoModule,
    SystemModule,
    McomPaymentModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: RolesGuard },
    { provide: APP_GUARD, useClass: PermissionsGuard },
    { provide: APP_GUARD, useClass: ThrottleGuard },
    { provide: APP_GUARD, useClass: BoroughScopeGuard },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(RequestLoggerMiddleware, DeviceDetectorMiddleware)
      .forRoutes('*')
      .apply(WebhookHmacMiddleware)
      .forRoutes('webhooks');
  }
}
