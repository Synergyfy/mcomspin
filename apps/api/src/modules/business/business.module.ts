import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PrismaModule } from '../../prisma/prisma.module';
import { BusinessAuthController } from './controllers/business-auth.controller';
import { BusinessDashboardController } from './controllers/business-dashboard.controller';
import { BusinessProfileController } from './controllers/business-profile.controller';
import { BusinessCampaignsController } from './controllers/business-campaigns.controller';
import { BusinessRewardsController } from './controllers/business-rewards.controller';
import { BusinessGameController } from './controllers/business-game.controller';
import { BusinessCustomersController } from './controllers/business-customers.controller';
import { BusinessRedemptionsController } from './controllers/business-redemptions.controller';
import { BusinessLocationsController } from './controllers/business-locations.controller';
import { BusinessStaffController } from './controllers/business-staff.controller';
import { BusinessAnalyticsController } from './controllers/business-analytics.controller';
import { BusinessNotificationsController } from './controllers/business-notifications.controller';
import { BusinessLocalMallController } from './controllers/business-local-mall.controller';
import { BusinessPromotionsController } from './controllers/business-promotions.controller';
import { BusinessEventsController } from './controllers/business-events.controller';
import { BusinessGamificationController } from './controllers/business-gamification.controller';
import { BusinessSalesSettingsController } from './controllers/business-sales-settings.controller';
import { BusinessAuthService } from './services/business-auth.service';
import { BusinessDashboardService } from './services/business-dashboard.service';
import { BusinessProfileService } from './services/business-profile.service';
import { BusinessCampaignsService } from './services/business-campaigns.service';
import { BusinessRewardsService } from './services/business-rewards.service';
import { BusinessGameService } from './services/business-game.service';
import { BusinessCustomersService } from './services/business-customers.service';
import { BusinessRedemptionsService } from './services/business-redemptions.service';
import { BusinessLocationsService } from './services/business-locations.service';
import { BusinessStaffService } from './services/business-staff.service';
import { BusinessAnalyticsService } from './services/business-analytics.service';
import { BusinessNotificationsService } from './services/business-notifications.service';
import { BusinessLocalMallService } from './services/business-local-mall.service';
import { BusinessPromotionsService } from './services/business-promotions.service';
import { BusinessEventsService } from './services/business-events.service';
import { BusinessGamificationService } from './services/business-gamification.service';
import { BusinessSalesSettingsService } from './services/business-sales-settings.service';
import { BusinessMembershipController } from './controllers/business-membership.controller';
import { BusinessToolsController } from './controllers/business-tools.controller';
import { BusinessOwnerGuard } from './guards/business-owner.guard';

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
  controllers: [
    BusinessAuthController,
    BusinessDashboardController,
    BusinessProfileController,
    BusinessCampaignsController,
    BusinessRewardsController,
    BusinessGameController,
    BusinessCustomersController,
    BusinessRedemptionsController,
    BusinessLocationsController,
    BusinessStaffController,
    BusinessAnalyticsController,
    BusinessNotificationsController,
    BusinessLocalMallController,
    BusinessPromotionsController,
    BusinessEventsController,
    BusinessGamificationController,
    BusinessSalesSettingsController,
    BusinessMembershipController,
    BusinessToolsController,
  ],
  providers: [
    BusinessAuthService,
    BusinessDashboardService,
    BusinessProfileService,
    BusinessCampaignsService,
    BusinessRewardsService,
    BusinessGameService,
    BusinessCustomersService,
    BusinessRedemptionsService,
    BusinessLocationsService,
    BusinessStaffService,
    BusinessAnalyticsService,
    BusinessNotificationsService,
    BusinessLocalMallService,
    BusinessPromotionsService,
    BusinessEventsService,
    BusinessGamificationService,
    BusinessSalesSettingsService,
    BusinessOwnerGuard,
  ],
})
export class BusinessModule {}
