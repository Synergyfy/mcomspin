import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { MallDashboardController } from './controllers/mall-dashboard.controller';
import { MallMarketplaceController } from './controllers/mall-marketplace.controller';
import { MallLocationsController } from './controllers/mall-locations.controller';
import { MallMarketingController } from './controllers/mall-marketing.controller';
import { MallMembershipsController } from './controllers/mall-memberships.controller';
import { MallCommunityController } from './controllers/mall-community.controller';
import { MallModerationController } from './controllers/mall-moderation.controller';
import { MallOperationsController } from './controllers/mall-operations.controller';
import { MallCampaignsController } from './controllers/mall-campaigns.controller';
import { MallGamificationController } from './controllers/mall-gamification.controller';
import { MallDashboardService } from './services/mall-dashboard.service';
import { MallMarketplaceService } from './services/mall-marketplace.service';
import { MallLocationsService } from './services/mall-locations.service';
import { MallMarketingService } from './services/mall-marketing.service';
import { MallMembershipsService } from './services/mall-memberships.service';
import { MallCommunityService } from './services/mall-community.service';
import { MallModerationService } from './services/mall-moderation.service';
import { MallOperationsService } from './services/mall-operations.service';
import { MallCampaignsService } from './services/mall-campaigns.service';
import { MallGamificationService } from './services/mall-gamification.service';

@Module({
  imports: [PrismaModule],
  controllers: [
    MallDashboardController,
    MallMarketplaceController,
    MallLocationsController,
    MallMarketingController,
    MallMembershipsController,
    MallCommunityController,
    MallModerationController,
    MallOperationsController,
    MallCampaignsController,
    MallGamificationController,
  ],
  providers: [
    MallDashboardService,
    MallMarketplaceService,
    MallLocationsService,
    MallMarketingService,
    MallMembershipsService,
    MallCommunityService,
    MallModerationService,
    MallOperationsService,
    MallCampaignsService,
    MallGamificationService,
  ],
})
export class MallAdminModule {}
