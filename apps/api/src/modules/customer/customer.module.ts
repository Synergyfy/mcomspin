import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PrismaModule } from '../../prisma/prisma.module';
import { CustomerAuthController } from './controllers/customer-auth.controller';
import { CustomerDashboardController } from './controllers/customer-dashboard.controller';
import { CustomerDiscoverController } from './controllers/customer-discover.controller';
import { CustomerCampaignsController } from './controllers/customer-campaigns.controller';
import { CustomerGameController } from './controllers/customer-game.controller';
import { CustomerRewardsController } from './controllers/customer-rewards.controller';
import { CustomerBusinessesController } from './controllers/customer-businesses.controller';
import { CustomerActivityController } from './controllers/customer-activity.controller';
import { CustomerNotificationsController } from './controllers/customer-notifications.controller';
import { CustomerLeaderboardController } from './controllers/customer-leaderboard.controller';
import { CustomerReferralsController } from './controllers/customer-referrals.controller';
import { CustomerProfileController } from './controllers/customer-profile.controller';
import { CustomerSettingsController } from './controllers/customer-settings.controller';
import { CustomerAuthService } from './services/customer-auth.service';
import { CustomerDashboardService } from './services/customer-dashboard.service';
import { CustomerDiscoverService } from './services/customer-discover.service';
import { CustomerCampaignsService } from './services/customer-campaigns.service';
import { CustomerGameService } from './services/customer-game.service';
import { CustomerRewardsService } from './services/customer-rewards.service';
import { CustomerBusinessesService } from './services/customer-businesses.service';
import { CustomerActivityService } from './services/customer-activity.service';
import { CustomerNotificationsService } from './services/customer-notifications.service';
import { CustomerLeaderboardService } from './services/customer-leaderboard.service';
import { CustomerReferralsService } from './services/customer-referrals.service';
import { CustomerProfileService } from './services/customer-profile.service';
import { CustomerSettingsService } from './services/customer-settings.service';
import { CustomerGuard } from './guards/customer.guard';

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
    CustomerAuthController,
    CustomerDashboardController,
    CustomerDiscoverController,
    CustomerCampaignsController,
    CustomerGameController,
    CustomerRewardsController,
    CustomerBusinessesController,
    CustomerActivityController,
    CustomerNotificationsController,
    CustomerLeaderboardController,
    CustomerReferralsController,
    CustomerProfileController,
    CustomerSettingsController,
  ],
  providers: [
    CustomerAuthService,
    CustomerDashboardService,
    CustomerDiscoverService,
    CustomerCampaignsService,
    CustomerGameService,
    CustomerRewardsService,
    CustomerBusinessesService,
    CustomerActivityService,
    CustomerNotificationsService,
    CustomerLeaderboardService,
    CustomerReferralsService,
    CustomerProfileService,
    CustomerSettingsService,
    CustomerGuard,
  ],
  exports: [CustomerGuard],
})
export class CustomerModule {}
