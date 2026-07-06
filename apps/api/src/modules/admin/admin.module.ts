import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { AdminDashboardController } from './controllers/admin-dashboard.controller';
import { AdminGamesController } from './controllers/admin-games.controller';
import { AdminCampaignsController } from './controllers/admin-campaigns.controller';
import { AdminRewardsController } from './controllers/admin-rewards.controller';
import { AdminBusinessesController } from './controllers/admin-businesses.controller';
import { AdminCustomersController } from './controllers/admin-customers.controller';
import { AdminRedemptionsController } from './controllers/admin-redemptions.controller';
import { AdminPartnersController } from './controllers/admin-partners.controller';
import { AdminAnalyticsController } from './controllers/admin-analytics.controller';
import { AdminSettingsController } from './controllers/admin-settings.controller';
import { AdminDashboardService } from './services/admin-dashboard.service';
import { AdminGamesService } from './services/admin-games.service';
import { AdminCampaignsService } from './services/admin-campaigns.service';
import { AdminRewardsService } from './services/admin-rewards.service';
import { AdminBusinessesService } from './services/admin-businesses.service';
import { AdminCustomersService } from './services/admin-customers.service';
import { AdminRedemptionsService } from './services/admin-redemptions.service';
import { AdminPartnersService } from './services/admin-partners.service';
import { AdminAnalyticsService } from './services/admin-analytics.service';
import { AdminSettingsService } from './services/admin-settings.service';
import { SuperAdminGuard } from './guards/super-admin.guard';

@Module({
  imports: [PrismaModule],
  controllers: [
    AdminDashboardController,
    AdminGamesController,
    AdminCampaignsController,
    AdminRewardsController,
    AdminBusinessesController,
    AdminCustomersController,
    AdminRedemptionsController,
    AdminPartnersController,
    AdminAnalyticsController,
    AdminSettingsController,
  ],
  providers: [
    AdminDashboardService,
    AdminGamesService,
    AdminCampaignsService,
    AdminRewardsService,
    AdminBusinessesService,
    AdminCustomersService,
    AdminRedemptionsService,
    AdminPartnersService,
    AdminAnalyticsService,
    AdminSettingsService,
    SuperAdminGuard,
  ],
})
export class AdminModule {}
