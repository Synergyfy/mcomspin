-- CreateEnum
CREATE TYPE "RoleName" AS ENUM ('SuperAdmin', 'BoroughAdmin', 'HighStreetManager', 'BusinessOwner', 'Staff', 'Customer');

-- CreateEnum
CREATE TYPE "BusinessVerificationStatus" AS ENUM ('Unverified', 'Pending', 'Verified', 'Rejected', 'Suspended');

-- CreateEnum
CREATE TYPE "BusinessMembershipTier" AS ENUM ('Free', 'Bronze', 'Silver', 'Gold', 'Platinum');

-- CreateEnum
CREATE TYPE "CampaignType" AS ENUM ('Seasonal', 'Holiday', 'BoroughWide', 'HighStreet', 'CrossBusiness', 'FlashMob', 'SharedPartnership', 'ProductBundle', 'BoroughCampaign');

-- CreateEnum
CREATE TYPE "CampaignStatus" AS ENUM ('Draft', 'Scheduled', 'Active', 'Paused', 'Completed', 'Cancelled');

-- CreateEnum
CREATE TYPE "PromotionType" AS ENUM ('FlashDeal', 'BuyOneGetOne', 'PercentageOff', 'FixedAmountOff', 'BundleOffer', 'FreeShipping', 'LoyaltyBonus', 'DailyDeal', 'WeekendOffer', 'Seasonal', 'BoroughCampaign', 'HighStreet', 'Clearance', 'NewCustomer', 'ReturningCustomer', 'SharedPartnership', 'Gamified');

-- CreateEnum
CREATE TYPE "PromotionStatus" AS ENUM ('Draft', 'Active', 'Paused', 'Expired', 'Cancelled');

-- CreateEnum
CREATE TYPE "GameType" AS ENUM ('BallDrop', 'SpinWheel', 'ScratchCard', 'MatchGame', 'LuckyDraw');

-- CreateEnum
CREATE TYPE "GameStatus" AS ENUM ('Draft', 'Active', 'Paused', 'Closed');

-- CreateEnum
CREATE TYPE "RewardType" AS ENUM ('Discount', 'Voucher', 'FreeProduct', 'Cashback', 'Points');

-- CreateEnum
CREATE TYPE "VoucherStatus" AS ENUM ('Active', 'Redeemed', 'Expired', 'Revoked');

-- CreateEnum
CREATE TYPE "EventType" AS ENUM ('Workshop', 'Expo', 'Demo', 'Competition', 'PopUp', 'Launch', 'InStore', 'Webinar', 'ProductLaunch', 'FoodCompetition', 'BeautySession', 'CommunityEvent', 'ExpoBooth', 'LiveStream', 'Training');

-- CreateEnum
CREATE TYPE "EventStatus" AS ENUM ('Draft', 'Published', 'Ongoing', 'Completed', 'Cancelled');

-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('Promotional', 'Transactional', 'Alert', 'Reminder', 'Community');

-- CreateEnum
CREATE TYPE "NotificationChannel" AS ENUM ('InApp', 'Email', 'SMS', 'Push');

-- CreateEnum
CREATE TYPE "ModerationActionType" AS ENUM ('Warning', 'ContentRemoval', 'TemporarySuspension', 'PermanentBan');

-- CreateEnum
CREATE TYPE "SubscriptionPlanType" AS ENUM ('Free', 'Starter', 'Growth', 'Enterprise');

-- CreateEnum
CREATE TYPE "InvoiceStatus" AS ENUM ('Draft', 'Sent', 'Paid', 'Overdue', 'Cancelled', 'Refunded');

-- CreateEnum
CREATE TYPE "TransactionStatus" AS ENUM ('Pending', 'Completed', 'Failed', 'Refunded', 'Cancelled');

-- CreateEnum
CREATE TYPE "PaymentMethodType" AS ENUM ('CreditCard', 'DebitCard', 'BankTransfer', 'MobileMoney', 'Wallet');

-- CreateEnum
CREATE TYPE "AuditType" AS ENUM ('Short', 'Full', 'MCOM');

-- CreateEnum
CREATE TYPE "StorefrontThemeType" AS ENUM ('Light', 'Dark', 'Brand');

-- CreateEnum
CREATE TYPE "QLinkType" AS ENUM ('Campaign', 'Product', 'Event', 'Business', 'Storefront');

-- CreateEnum
CREATE TYPE "PartnershipStatus" AS ENUM ('Pending', 'Active', 'Declined', 'Suspended');

-- CreateEnum
CREATE TYPE "CommunityGroupType" AS ENUM ('HighStreet', 'Borough', 'Interest');

-- CreateEnum
CREATE TYPE "AutomationTriggerType" AS ENUM ('Schedule', 'Event', 'Action', 'Condition');

-- CreateEnum
CREATE TYPE "AutomationActionType" AS ENUM ('Notification', 'Email', 'UpdateStatus', 'CreateTask', 'Webhook');

-- CreateEnum
CREATE TYPE "AbuseReportStatus" AS ENUM ('Open', 'Investigating', 'Resolved', 'Dismissed');

-- CreateEnum
CREATE TYPE "CustomerActivityType" AS ENUM ('View', 'Click', 'Search', 'Purchase', 'Redeem', 'Share', 'Review', 'Favourite');

-- CreateEnum
CREATE TYPE "BusinessActivityType" AS ENUM ('Login', 'Update', 'Create', 'Delete', 'Publish', 'Payment');

-- CreateTable
CREATE TABLE "Role" (
    "id" UUID NOT NULL,
    "name" "RoleName" NOT NULL,
    "description" TEXT,
    "isSystem" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Permission" (
    "id" UUID NOT NULL,
    "roleId" UUID NOT NULL,
    "resource" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "conditions" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Permission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" UUID NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "passwordHash" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "avatarUrl" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isEmailVerified" BOOLEAN NOT NULL DEFAULT false,
    "isPhoneVerified" BOOLEAN NOT NULL DEFAULT false,
    "lastLoginAt" TIMESTAMP(3),
    "metadata" JSONB,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserRole" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "roleId" UUID NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3),
    "createdBy" UUID,

    CONSTRAINT "UserRole_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "refreshToken" TEXT NOT NULL,
    "deviceInfo" JSONB,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "isRevoked" BOOLEAN NOT NULL DEFAULT false,
    "lastActivityAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Borough" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "imageUrl" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Borough_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HighStreet" (
    "id" UUID NOT NULL,
    "boroughId" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "imageUrl" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "HighStreet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StorefrontCluster" (
    "id" UUID NOT NULL,
    "highStreetId" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "clusterType" TEXT,
    "description" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "StorefrontCluster_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Location" (
    "id" UUID NOT NULL,
    "addressLine1" TEXT NOT NULL,
    "addressLine2" TEXT,
    "city" TEXT NOT NULL,
    "postcode" TEXT,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "storefrontClusterId" UUID,
    "businessId" UUID,
    "eventId" UUID,
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,
    "label" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Location_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Business" (
    "id" UUID NOT NULL,
    "ownerId" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "shortDescription" TEXT,
    "logoUrl" TEXT,
    "coverImageUrl" TEXT,
    "contactEmail" TEXT,
    "contactPhone" TEXT,
    "websiteUrl" TEXT,
    "socialLinks" JSONB,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isOpen" BOOLEAN NOT NULL DEFAULT true,
    "taxId" TEXT,
    "registrationNumber" TEXT,
    "metadata" JSONB,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Business_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BusinessVerification" (
    "id" UUID NOT NULL,
    "businessId" UUID NOT NULL,
    "status" "BusinessVerificationStatus" NOT NULL DEFAULT 'Unverified',
    "documents" JSONB,
    "googlePlaceId" TEXT,
    "googleConnected" BOOLEAN NOT NULL DEFAULT false,
    "verifiedAt" TIMESTAMP(3),
    "verifiedBy" UUID,
    "rejectionReason" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BusinessVerification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BusinessClaim" (
    "id" UUID NOT NULL,
    "businessId" UUID NOT NULL,
    "claimerId" UUID NOT NULL,
    "claimerName" TEXT NOT NULL,
    "claimerEmail" TEXT NOT NULL,
    "claimerPhone" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "approvedAt" TIMESTAMP(3),
    "approvedBy" UUID,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BusinessClaim_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BusinessStaff" (
    "id" UUID NOT NULL,
    "businessId" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "role" TEXT NOT NULL,
    "permissions" JSONB,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "invitedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "joinedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BusinessStaff_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BusinessMembership" (
    "id" UUID NOT NULL,
    "businessId" UUID NOT NULL,
    "tier" "BusinessMembershipTier" NOT NULL DEFAULT 'Free',
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3),
    "isAutoRenew" BOOLEAN NOT NULL DEFAULT true,
    "features" JSONB,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BusinessMembership_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BusinessLocation" (
    "id" UUID NOT NULL,
    "businessId" UUID NOT NULL,
    "highStreetId" UUID,
    "name" TEXT,
    "addressLine1" TEXT NOT NULL,
    "addressLine2" TEXT,
    "city" TEXT NOT NULL,
    "postcode" TEXT,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "BusinessLocation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BusinessHours" (
    "id" UUID NOT NULL,
    "businessId" UUID NOT NULL,
    "businessLocationId" UUID,
    "dayOfWeek" INTEGER NOT NULL,
    "openTime" TEXT NOT NULL,
    "closeTime" TEXT NOT NULL,
    "isClosed" BOOLEAN NOT NULL DEFAULT false,
    "is24Hours" BOOLEAN NOT NULL DEFAULT false,
    "effectiveFrom" TIMESTAMP(3),
    "effectiveTo" TIMESTAMP(3),

    CONSTRAINT "BusinessHours_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BusinessCategory" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "parentId" UUID,
    "imageUrl" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BusinessCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BusinessCategoryAssignment" (
    "id" UUID NOT NULL,
    "businessId" UUID NOT NULL,
    "categoryId" UUID NOT NULL,
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "BusinessCategoryAssignment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BusinessTag" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BusinessTag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TagAssignment" (
    "id" UUID NOT NULL,
    "businessId" UUID NOT NULL,
    "tagId" UUID NOT NULL,

    CONSTRAINT "TagAssignment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Storefront" (
    "id" UUID NOT NULL,
    "businessId" UUID NOT NULL,
    "headline" TEXT,
    "tagline" TEXT,
    "welcomeMessage" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Storefront_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StorefrontTheme" (
    "id" UUID NOT NULL,
    "storefrontId" UUID NOT NULL,
    "themeType" "StorefrontThemeType" NOT NULL DEFAULT 'Light',
    "primaryColor" TEXT,
    "secondaryColor" TEXT,
    "accentColor" TEXT,
    "fontFamily" TEXT,
    "borderRadius" INTEGER,
    "customCss" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StorefrontTheme_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StorefrontBanner" (
    "id" UUID NOT NULL,
    "storefrontId" UUID NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "linkUrl" TEXT,
    "title" TEXT,
    "subtitle" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StorefrontBanner_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StorefrontMedia" (
    "id" UUID NOT NULL,
    "storefrontId" UUID NOT NULL,
    "url" TEXT NOT NULL,
    "mediaType" TEXT NOT NULL,
    "caption" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StorefrontMedia_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Product" (
    "id" UUID NOT NULL,
    "storefrontId" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "price" DECIMAL(10,2) NOT NULL,
    "compareAtPrice" DECIMAL(10,2),
    "costPrice" DECIMAL(10,2),
    "currency" TEXT NOT NULL DEFAULT 'GBP',
    "stock" INTEGER NOT NULL DEFAULT 0,
    "lowStockThreshold" INTEGER NOT NULL DEFAULT 5,
    "isTrackStock" BOOLEAN NOT NULL DEFAULT true,
    "allowBackorder" BOOLEAN NOT NULL DEFAULT false,
    "status" TEXT NOT NULL DEFAULT 'active',
    "images" JSONB,
    "attributes" JSONB,
    "variants" JSONB,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Service" (
    "id" UUID NOT NULL,
    "storefrontId" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "price" DECIMAL(10,2) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'GBP',
    "durationMinutes" INTEGER NOT NULL,
    "isOnlineBooking" BOOLEAN NOT NULL DEFAULT true,
    "maxBookingsPerSlot" INTEGER NOT NULL DEFAULT 1,
    "bufferMinutes" INTEGER NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'active',
    "images" JSONB,
    "attributes" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Service_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ServiceAvailability" (
    "id" UUID NOT NULL,
    "serviceId" UUID NOT NULL,
    "dayOfWeek" INTEGER NOT NULL,
    "startTime" TEXT NOT NULL,
    "endTime" TEXT NOT NULL,
    "capacity" INTEGER NOT NULL DEFAULT 1,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ServiceAvailability_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductPromotion" (
    "id" UUID NOT NULL,
    "productId" UUID NOT NULL,
    "promotionId" UUID NOT NULL,
    "discountValue" DECIMAL(10,2),
    "discountType" TEXT,

    CONSTRAINT "ProductPromotion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Campaign" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "type" "CampaignType" NOT NULL,
    "status" "CampaignStatus" NOT NULL DEFAULT 'Draft',
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "budget" DECIMAL(12,2),
    "spentAmount" DECIMAL(12,2) DEFAULT 0,
    "maxBudget" DECIMAL(12,2),
    "imageUrl" TEXT,
    "terms" TEXT,
    "isPublic" BOOLEAN NOT NULL DEFAULT true,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Campaign_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CampaignBusiness" (
    "id" UUID NOT NULL,
    "campaignId" UUID NOT NULL,
    "businessId" UUID NOT NULL,
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "metadata" JSONB,

    CONSTRAINT "CampaignBusiness_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CampaignReward" (
    "id" UUID NOT NULL,
    "campaignId" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "quantity" INTEGER NOT NULL DEFAULT 0,
    "remaining" INTEGER NOT NULL DEFAULT 0,
    "rewardType" "RewardType" NOT NULL,
    "rewardValue" DECIMAL(10,2) NOT NULL,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CampaignReward_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CampaignTarget" (
    "id" UUID NOT NULL,
    "campaignId" UUID NOT NULL,
    "boroughId" UUID,
    "segment" TEXT,
    "minVisits" INTEGER,
    "maxVisits" INTEGER,
    "minSpend" DECIMAL(10,2),
    "maxSpend" DECIMAL(10,2),
    "metadata" JSONB,

    CONSTRAINT "CampaignTarget_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Promotion" (
    "id" UUID NOT NULL,
    "campaignId" UUID,
    "businessId" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "type" "PromotionType" NOT NULL,
    "status" "PromotionStatus" NOT NULL DEFAULT 'Draft',
    "discountValue" DECIMAL(10,2),
    "discountType" TEXT,
    "minPurchase" DECIMAL(10,2),
    "maxDiscount" DECIMAL(10,2),
    "usageLimit" INTEGER DEFAULT 0,
    "usageCount" INTEGER NOT NULL DEFAULT 0,
    "perCustomerLimit" INTEGER DEFAULT 1,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "imageUrl" TEXT,
    "terms" TEXT,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "isBorough" BOOLEAN NOT NULL DEFAULT false,
    "isRotator" BOOLEAN NOT NULL DEFAULT false,
    "isQr" BOOLEAN NOT NULL DEFAULT false,
    "isReward" BOOLEAN NOT NULL DEFAULT false,
    "audience" JSONB,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Promotion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PromotionRedemption" (
    "id" UUID NOT NULL,
    "promotionId" UUID NOT NULL,
    "customerId" UUID NOT NULL,
    "redeemedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "orderRef" TEXT,
    "discountApplied" DECIMAL(10,2),
    "metadata" JSONB,

    CONSTRAINT "PromotionRedemption_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Rotator" (
    "id" UUID NOT NULL,
    "campaignId" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Rotator_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RotatorItem" (
    "id" UUID NOT NULL,
    "rotatorId" UUID NOT NULL,
    "productId" UUID,
    "serviceId" UUID,
    "promotionId" UUID,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "metadata" JSONB,

    CONSTRAINT "RotatorItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Game" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "type" "GameType" NOT NULL,
    "description" TEXT,
    "rules" JSONB,
    "minPlayers" INTEGER NOT NULL DEFAULT 1,
    "maxPlayers" INTEGER NOT NULL DEFAULT 1,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "imageUrl" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Game_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GameSession" (
    "id" UUID NOT NULL,
    "gameId" UUID NOT NULL,
    "configId" UUID,
    "customerId" UUID NOT NULL,
    "score" INTEGER,
    "result" JSONB,
    "isWin" BOOLEAN NOT NULL DEFAULT false,
    "rewardId" UUID,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endedAt" TIMESTAMP(3),
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GameSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GameConfig" (
    "id" UUID NOT NULL,
    "gameId" UUID NOT NULL,
    "businessId" UUID NOT NULL,
    "name" TEXT,
    "config" JSONB NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GameConfig_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GameCampaign" (
    "id" UUID NOT NULL,
    "gameId" UUID NOT NULL,
    "campaignId" UUID NOT NULL,
    "entryFee" DECIMAL(10,2),
    "maxPlaysPerCustomer" INTEGER DEFAULT 1,
    "startsAt" TIMESTAMP(3),
    "endsAt" TIMESTAMP(3),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "metadata" JSONB,

    CONSTRAINT "GameCampaign_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Reward" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "type" "RewardType" NOT NULL,
    "value" DECIMAL(10,2) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'GBP',
    "imageUrl" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Reward_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RewardInventory" (
    "id" UUID NOT NULL,
    "businessId" UUID NOT NULL,
    "rewardId" UUID NOT NULL,
    "totalStock" INTEGER NOT NULL DEFAULT 0,
    "usedStock" INTEGER NOT NULL DEFAULT 0,
    "lowStockThreshold" INTEGER NOT NULL DEFAULT 5,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RewardInventory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RewardRedemption" (
    "id" UUID NOT NULL,
    "rewardId" UUID NOT NULL,
    "customerId" UUID NOT NULL,
    "businessId" UUID NOT NULL,
    "pointsSpent" INTEGER,
    "redeemedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "metadata" JSONB,

    CONSTRAINT "RewardRedemption_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CustomerReward" (
    "id" UUID NOT NULL,
    "customerId" UUID NOT NULL,
    "rewardId" UUID NOT NULL,
    "earnedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3),
    "usedAt" TIMESTAMP(3),
    "metadata" JSONB,

    CONSTRAINT "CustomerReward_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LoyaltyProgram" (
    "id" UUID NOT NULL,
    "businessId" UUID NOT NULL,
    "name" TEXT NOT NULL DEFAULT 'Loyalty Program',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "pointsPerCurrency" DECIMAL(10,2) NOT NULL DEFAULT 1,
    "currencyPerPoints" DECIMAL(10,2),
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LoyaltyProgram_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LoyaltyMembership" (
    "id" UUID NOT NULL,
    "loyaltyProgramId" UUID NOT NULL,
    "customerId" UUID NOT NULL,
    "tierId" UUID,
    "points" INTEGER NOT NULL DEFAULT 0,
    "lifetimePoints" INTEGER NOT NULL DEFAULT 0,
    "visitCount" INTEGER NOT NULL DEFAULT 0,
    "totalSpent" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3),
    "metadata" JSONB,

    CONSTRAINT "LoyaltyMembership_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LoyaltyTier" (
    "id" UUID NOT NULL,
    "loyaltyProgramId" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "level" INTEGER NOT NULL DEFAULT 1,
    "minPoints" INTEGER NOT NULL DEFAULT 0,
    "maxPoints" INTEGER,
    "multiplier" DECIMAL(10,2) NOT NULL DEFAULT 1,
    "benefits" JSONB,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LoyaltyTier_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PointsTransaction" (
    "id" UUID NOT NULL,
    "loyaltyMembershipId" UUID NOT NULL,
    "points" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "description" TEXT,
    "referenceId" TEXT,
    "referenceType" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PointsTransaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Voucher" (
    "id" UUID NOT NULL,
    "code" TEXT NOT NULL,
    "businessId" UUID NOT NULL,
    "rewardId" UUID,
    "customerId" UUID,
    "value" DECIMAL(10,2) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'GBP',
    "discountType" TEXT,
    "discountValue" DECIMAL(10,2),
    "minPurchase" DECIMAL(10,2),
    "status" "VoucherStatus" NOT NULL DEFAULT 'Active',
    "issuedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "redeemedAt" TIMESTAMP(3),
    "expiresAt" TIMESTAMP(3),
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Voucher_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QLink" (
    "id" UUID NOT NULL,
    "businessId" UUID NOT NULL,
    "type" "QLinkType" NOT NULL,
    "code" TEXT NOT NULL,
    "label" TEXT,
    "targetId" TEXT,
    "targetUrl" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "maxScans" INTEGER,
    "scanCount" INTEGER NOT NULL DEFAULT 0,
    "startsAt" TIMESTAMP(3),
    "endsAt" TIMESTAMP(3),
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "QLink_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QLinkScan" (
    "id" UUID NOT NULL,
    "qlinkId" UUID NOT NULL,
    "customerId" UUID,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "metadata" JSONB,
    "scannedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "QLinkScan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QLinkCampaign" (
    "id" UUID NOT NULL,
    "qlinkId" UUID NOT NULL,
    "campaignId" UUID NOT NULL,

    CONSTRAINT "QLinkCampaign_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Event" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "type" "EventType" NOT NULL,
    "status" "EventStatus" NOT NULL DEFAULT 'Draft',
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "isFree" BOOLEAN NOT NULL DEFAULT true,
    "ticketPrice" DECIMAL(10,2),
    "currency" TEXT NOT NULL DEFAULT 'GBP',
    "capacity" INTEGER,
    "registeredCount" INTEGER NOT NULL DEFAULT 0,
    "imageUrl" TEXT,
    "organizerId" UUID,
    "organizerType" TEXT,
    "registrationType" TEXT,
    "promotionSettings" JSONB,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EventRegistration" (
    "id" UUID NOT NULL,
    "eventId" UUID NOT NULL,
    "customerId" UUID NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'confirmed',
    "ticketRef" TEXT,
    "metadata" JSONB,
    "registeredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "cancelledAt" TIMESTAMP(3),

    CONSTRAINT "EventRegistration_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EventCheckIn" (
    "id" UUID NOT NULL,
    "eventId" UUID NOT NULL,
    "registrationId" UUID,
    "customerId" UUID,
    "qrCode" TEXT,
    "checkedInAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "metadata" JSONB,

    CONSTRAINT "EventCheckIn_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Expo" (
    "id" UUID NOT NULL,
    "eventId" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "boothsAvailable" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Expo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExpoBooth" (
    "id" UUID NOT NULL,
    "expoId" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "boothNumber" TEXT,
    "price" DECIMAL(10,2),
    "isBooked" BOOLEAN NOT NULL DEFAULT false,
    "businessId" UUID,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ExpoBooth_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExpoParticipation" (
    "id" UUID NOT NULL,
    "expoBoothId" UUID NOT NULL,
    "businessId" UUID NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'confirmed',
    "customizations" JSONB,
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ExpoParticipation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Partnership" (
    "id" UUID NOT NULL,
    "initiatorId" UUID NOT NULL,
    "partnerId" UUID NOT NULL,
    "status" "PartnershipStatus" NOT NULL DEFAULT 'Pending',
    "partnershipType" TEXT NOT NULL,
    "terms" JSONB,
    "startedAt" TIMESTAMP(3),
    "endedAt" TIMESTAMP(3),
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Partnership_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PartnershipRequest" (
    "id" UUID NOT NULL,
    "targetId" UUID NOT NULL,
    "requesterId" UUID NOT NULL,
    "requesterName" TEXT NOT NULL,
    "requesterEmail" TEXT NOT NULL,
    "partnershipType" TEXT,
    "message" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "respondedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PartnershipRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SharedCampaign" (
    "id" UUID NOT NULL,
    "campaignId" UUID NOT NULL,
    "partnershipId" UUID NOT NULL,
    "contribution" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SharedCampaign_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SharedAudience" (
    "id" UUID NOT NULL,
    "partnershipId" UUID NOT NULL,
    "segment" TEXT,
    "customerIds" JSONB,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SharedAudience_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CommunityGroup" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "type" "CommunityGroupType" NOT NULL,
    "boroughId" UUID,
    "highStreetId" UUID,
    "imageUrl" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "membersCount" INTEGER NOT NULL DEFAULT 0,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "CommunityGroup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CommunityPost" (
    "id" UUID NOT NULL,
    "groupId" UUID NOT NULL,
    "authorId" UUID NOT NULL,
    "businessId" UUID,
    "content" TEXT NOT NULL,
    "mediaUrls" JSONB,
    "tags" TEXT[],
    "isPinned" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "likesCount" INTEGER NOT NULL DEFAULT 0,
    "commentsCount" INTEGER NOT NULL DEFAULT 0,
    "sharesCount" INTEGER NOT NULL DEFAULT 0,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "CommunityPost_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CommunityActivity" (
    "id" UUID NOT NULL,
    "groupId" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "type" TEXT NOT NULL,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CommunityActivity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BusinessActivation" (
    "id" UUID NOT NULL,
    "businessId" UUID NOT NULL,
    "customerId" UUID NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "message" TEXT,
    "rewardAwarded" BOOLEAN NOT NULL DEFAULT false,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BusinessActivation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ActivationReward" (
    "id" UUID NOT NULL,
    "businessId" UUID NOT NULL,
    "rewardId" UUID NOT NULL,
    "points" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ActivationReward_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InterestSignal" (
    "id" UUID NOT NULL,
    "businessId" UUID NOT NULL,
    "customerId" UUID NOT NULL,
    "signalType" TEXT NOT NULL,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "InterestSignal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "type" "NotificationType" NOT NULL,
    "channel" "NotificationChannel" NOT NULL DEFAULT 'InApp',
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "data" JSONB,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "readAt" TIMESTAMP(3),
    "isSent" BOOLEAN NOT NULL DEFAULT false,
    "sentAt" TIMESTAMP(3),
    "templateId" UUID,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NotificationTemplate" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "type" "NotificationType" NOT NULL,
    "channel" "NotificationChannel" NOT NULL,
    "subject" TEXT,
    "title" TEXT,
    "body" TEXT NOT NULL,
    "variables" JSONB,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "NotificationTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NotificationPreference" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "channel" "NotificationChannel" NOT NULL,
    "type" "NotificationType" NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "NotificationPreference_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Message" (
    "id" UUID NOT NULL,
    "threadId" UUID NOT NULL,
    "senderId" UUID NOT NULL,
    "content" TEXT NOT NULL,
    "mediaUrls" JSONB,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "readAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MessageThread" (
    "id" UUID NOT NULL,
    "subject" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MessageThread_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Audit" (
    "id" UUID NOT NULL,
    "businessId" UUID NOT NULL,
    "type" "AuditType" NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "score" INTEGER,
    "maxScore" INTEGER,
    "summary" TEXT,
    "findings" JSONB,
    "conductedBy" UUID,
    "conductedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Audit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditRecommendation" (
    "id" UUID NOT NULL,
    "auditId" UUID NOT NULL,
    "businessId" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "priority" TEXT NOT NULL,
    "category" TEXT,
    "isResolved" BOOLEAN NOT NULL DEFAULT false,
    "resolvedAt" TIMESTAMP(3),
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AuditRecommendation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VisibilityScore" (
    "id" UUID NOT NULL,
    "businessId" UUID NOT NULL,
    "overall" INTEGER NOT NULL DEFAULT 0,
    "search" INTEGER NOT NULL DEFAULT 0,
    "social" INTEGER NOT NULL DEFAULT 0,
    "directory" INTEGER NOT NULL DEFAULT 0,
    "reviews" INTEGER NOT NULL DEFAULT 0,
    "engagement" INTEGER NOT NULL DEFAULT 0,
    "metadata" JSONB,
    "calculatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VisibilityScore_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VisibilityBoost" (
    "id" UUID NOT NULL,
    "businessId" UUID NOT NULL,
    "type" TEXT NOT NULL,
    "startsAt" TIMESTAMP(3) NOT NULL,
    "endsAt" TIMESTAMP(3) NOT NULL,
    "budget" DECIMAL(12,2),
    "spentAmount" DECIMAL(12,2) DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VisibilityBoost_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StorefrontScore" (
    "id" UUID NOT NULL,
    "businessId" UUID NOT NULL,
    "completion" INTEGER NOT NULL DEFAULT 0,
    "quality" INTEGER NOT NULL DEFAULT 0,
    "freshness" INTEGER NOT NULL DEFAULT 0,
    "total" INTEGER NOT NULL DEFAULT 0,
    "breakdown" JSONB,
    "calculatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StorefrontScore_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AutomationRule" (
    "id" UUID NOT NULL,
    "businessId" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "AutomationRule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AutomationTrigger" (
    "id" UUID NOT NULL,
    "ruleId" UUID NOT NULL,
    "type" "AutomationTriggerType" NOT NULL,
    "config" JSONB NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "AutomationTrigger_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AutomationAction" (
    "id" UUID NOT NULL,
    "ruleId" UUID NOT NULL,
    "type" "AutomationActionType" NOT NULL,
    "config" JSONB NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "AutomationAction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AutomationLog" (
    "id" UUID NOT NULL,
    "ruleId" UUID NOT NULL,
    "triggerId" UUID,
    "status" TEXT NOT NULL,
    "result" JSONB,
    "error" TEXT,
    "executedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AutomationLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AbuseReport" (
    "id" UUID NOT NULL,
    "reporterId" UUID NOT NULL,
    "targetType" TEXT NOT NULL,
    "targetId" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "description" TEXT,
    "status" "AbuseReportStatus" NOT NULL DEFAULT 'Open',
    "moderatorId" UUID,
    "resolvedAt" TIMESTAMP(3),
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AbuseReport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ModerationAction" (
    "id" UUID NOT NULL,
    "reportId" UUID,
    "targetType" TEXT NOT NULL,
    "targetId" TEXT NOT NULL,
    "actionType" "ModerationActionType" NOT NULL,
    "reason" TEXT NOT NULL,
    "performedBy" UUID NOT NULL,
    "duration" INTEGER,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ModerationAction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ModerationRule" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "resource" TEXT NOT NULL,
    "conditions" JSONB NOT NULL,
    "action" "ModerationActionType" NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "priority" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ModerationRule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FraudAlert" (
    "id" UUID NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "alertType" TEXT NOT NULL,
    "severity" TEXT NOT NULL,
    "description" TEXT,
    "details" JSONB,
    "isResolved" BOOLEAN NOT NULL DEFAULT false,
    "resolvedBy" UUID,
    "resolvedAt" TIMESTAMP(3),
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FraudAlert_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Subscription" (
    "id" UUID NOT NULL,
    "businessId" UUID NOT NULL,
    "planType" "SubscriptionPlanType" NOT NULL DEFAULT 'Free',
    "status" TEXT NOT NULL DEFAULT 'active',
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "currentPeriodStart" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "currentPeriodEnd" TIMESTAMP(3) NOT NULL,
    "cancelledAt" TIMESTAMP(3),
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Subscription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SubscriptionPlan" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "planType" "SubscriptionPlanType" NOT NULL,
    "description" TEXT,
    "price" DECIMAL(10,2) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'GBP',
    "interval" TEXT NOT NULL DEFAULT 'month',
    "features" JSONB,
    "maxStaff" INTEGER NOT NULL DEFAULT 0,
    "maxLocations" INTEGER NOT NULL DEFAULT 1,
    "maxProducts" INTEGER NOT NULL DEFAULT 0,
    "maxCampaigns" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SubscriptionPlan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Invoice" (
    "id" UUID NOT NULL,
    "subscriptionId" UUID,
    "businessId" UUID NOT NULL,
    "invoiceNumber" TEXT NOT NULL,
    "description" TEXT,
    "amount" DECIMAL(12,2) NOT NULL,
    "taxAmount" DECIMAL(12,2) DEFAULT 0,
    "totalAmount" DECIMAL(12,2) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'GBP',
    "status" "InvoiceStatus" NOT NULL DEFAULT 'Draft',
    "dueDate" TIMESTAMP(3) NOT NULL,
    "paidAt" TIMESTAMP(3),
    "paidById" UUID,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Invoice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PaymentMethod" (
    "id" UUID NOT NULL,
    "businessId" UUID NOT NULL,
    "type" "PaymentMethodType" NOT NULL,
    "provider" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "last4" TEXT,
    "expiryMonth" INTEGER,
    "expiryYear" INTEGER,
    "cardholderName" TEXT,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PaymentMethod_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Transaction" (
    "id" UUID NOT NULL,
    "businessId" UUID NOT NULL,
    "invoiceId" UUID,
    "paymentMethodId" UUID,
    "amount" DECIMAL(12,2) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'GBP',
    "status" "TransactionStatus" NOT NULL DEFAULT 'Pending',
    "type" TEXT NOT NULL,
    "provider" TEXT,
    "providerRef" TEXT,
    "fee" DECIMAL(10,2) DEFAULT 0,
    "netAmount" DECIMAL(12,2),
    "description" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Credit" (
    "id" UUID NOT NULL,
    "businessId" UUID NOT NULL,
    "amount" DECIMAL(12,2) NOT NULL,
    "balance" DECIMAL(12,2) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'GBP',
    "type" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Credit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CreditUsage" (
    "id" UUID NOT NULL,
    "creditId" UUID NOT NULL,
    "amount" DECIMAL(12,2) NOT NULL,
    "referenceType" TEXT,
    "referenceId" TEXT,
    "metadata" JSONB,
    "usedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CreditUsage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AnalyticsEvent" (
    "id" UUID NOT NULL,
    "eventName" TEXT NOT NULL,
    "entityType" TEXT,
    "entityId" TEXT,
    "customerId" UUID,
    "sessionId" TEXT,
    "properties" JSONB,
    "context" JSONB,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AnalyticsEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AnalyticsAggregation" (
    "id" UUID NOT NULL,
    "metric" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "period" TEXT NOT NULL,
    "periodStart" TIMESTAMP(3) NOT NULL,
    "periodEnd" TIMESTAMP(3) NOT NULL,
    "value" DECIMAL(14,2) NOT NULL,
    "dimensions" JSONB,
    "calculatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AnalyticsAggregation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CustomerActivityLog" (
    "id" UUID NOT NULL,
    "customerId" UUID NOT NULL,
    "activityType" "CustomerActivityType" NOT NULL,
    "description" TEXT,
    "entityType" TEXT,
    "entityId" TEXT,
    "metadata" JSONB,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CustomerActivityLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BusinessActivityLog" (
    "id" UUID NOT NULL,
    "businessId" UUID NOT NULL,
    "userId" UUID,
    "activityType" "BusinessActivityType" NOT NULL,
    "description" TEXT,
    "entityType" TEXT,
    "entityId" TEXT,
    "metadata" JSONB,
    "ipAddress" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BusinessActivityLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlatformSetting" (
    "id" UUID NOT NULL,
    "key" TEXT NOT NULL,
    "value" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PlatformSetting_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_MessageThreadParticipants" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL,

    CONSTRAINT "_MessageThreadParticipants_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "Role_name_key" ON "Role"("name");

-- CreateIndex
CREATE INDEX "Permission_roleId_idx" ON "Permission"("roleId");

-- CreateIndex
CREATE UNIQUE INDEX "Permission_roleId_resource_action_key" ON "Permission"("roleId", "resource", "action");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_phone_idx" ON "User"("phone");

-- CreateIndex
CREATE INDEX "User_isActive_idx" ON "User"("isActive");

-- CreateIndex
CREATE INDEX "UserRole_userId_idx" ON "UserRole"("userId");

-- CreateIndex
CREATE INDEX "UserRole_roleId_idx" ON "UserRole"("roleId");

-- CreateIndex
CREATE UNIQUE INDEX "UserRole_userId_roleId_key" ON "UserRole"("userId", "roleId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_refreshToken_key" ON "Session"("refreshToken");

-- CreateIndex
CREATE INDEX "Session_userId_idx" ON "Session"("userId");

-- CreateIndex
CREATE INDEX "Session_refreshToken_idx" ON "Session"("refreshToken");

-- CreateIndex
CREATE INDEX "Session_expiresAt_idx" ON "Session"("expiresAt");

-- CreateIndex
CREATE UNIQUE INDEX "Borough_slug_key" ON "Borough"("slug");

-- CreateIndex
CREATE INDEX "Borough_slug_idx" ON "Borough"("slug");

-- CreateIndex
CREATE INDEX "Borough_isActive_idx" ON "Borough"("isActive");

-- CreateIndex
CREATE UNIQUE INDEX "HighStreet_slug_key" ON "HighStreet"("slug");

-- CreateIndex
CREATE INDEX "HighStreet_boroughId_idx" ON "HighStreet"("boroughId");

-- CreateIndex
CREATE INDEX "HighStreet_slug_idx" ON "HighStreet"("slug");

-- CreateIndex
CREATE INDEX "HighStreet_isActive_idx" ON "HighStreet"("isActive");

-- CreateIndex
CREATE UNIQUE INDEX "StorefrontCluster_slug_key" ON "StorefrontCluster"("slug");

-- CreateIndex
CREATE INDEX "StorefrontCluster_highStreetId_idx" ON "StorefrontCluster"("highStreetId");

-- CreateIndex
CREATE INDEX "StorefrontCluster_slug_idx" ON "StorefrontCluster"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Location_eventId_key" ON "Location"("eventId");

-- CreateIndex
CREATE INDEX "Location_storefrontClusterId_idx" ON "Location"("storefrontClusterId");

-- CreateIndex
CREATE INDEX "Location_businessId_idx" ON "Location"("businessId");

-- CreateIndex
CREATE INDEX "Location_eventId_idx" ON "Location"("eventId");

-- CreateIndex
CREATE INDEX "Location_latitude_longitude_idx" ON "Location"("latitude", "longitude");

-- CreateIndex
CREATE UNIQUE INDEX "Business_slug_key" ON "Business"("slug");

-- CreateIndex
CREATE INDEX "Business_ownerId_idx" ON "Business"("ownerId");

-- CreateIndex
CREATE INDEX "Business_slug_idx" ON "Business"("slug");

-- CreateIndex
CREATE INDEX "Business_isActive_idx" ON "Business"("isActive");

-- CreateIndex
CREATE INDEX "Business_isOpen_idx" ON "Business"("isOpen");

-- CreateIndex
CREATE UNIQUE INDEX "BusinessVerification_businessId_key" ON "BusinessVerification"("businessId");

-- CreateIndex
CREATE INDEX "BusinessVerification_status_idx" ON "BusinessVerification"("status");

-- CreateIndex
CREATE INDEX "BusinessClaim_businessId_idx" ON "BusinessClaim"("businessId");

-- CreateIndex
CREATE INDEX "BusinessClaim_claimerId_idx" ON "BusinessClaim"("claimerId");

-- CreateIndex
CREATE INDEX "BusinessClaim_status_idx" ON "BusinessClaim"("status");

-- CreateIndex
CREATE INDEX "BusinessStaff_businessId_idx" ON "BusinessStaff"("businessId");

-- CreateIndex
CREATE INDEX "BusinessStaff_userId_idx" ON "BusinessStaff"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "BusinessStaff_businessId_userId_key" ON "BusinessStaff"("businessId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "BusinessMembership_businessId_key" ON "BusinessMembership"("businessId");

-- CreateIndex
CREATE INDEX "BusinessMembership_tier_idx" ON "BusinessMembership"("tier");

-- CreateIndex
CREATE INDEX "BusinessLocation_businessId_idx" ON "BusinessLocation"("businessId");

-- CreateIndex
CREATE INDEX "BusinessLocation_highStreetId_idx" ON "BusinessLocation"("highStreetId");

-- CreateIndex
CREATE INDEX "BusinessLocation_latitude_longitude_idx" ON "BusinessLocation"("latitude", "longitude");

-- CreateIndex
CREATE INDEX "BusinessHours_businessId_idx" ON "BusinessHours"("businessId");

-- CreateIndex
CREATE INDEX "BusinessHours_businessLocationId_idx" ON "BusinessHours"("businessLocationId");

-- CreateIndex
CREATE UNIQUE INDEX "BusinessHours_businessLocationId_dayOfWeek_effectiveFrom_key" ON "BusinessHours"("businessLocationId", "dayOfWeek", "effectiveFrom");

-- CreateIndex
CREATE UNIQUE INDEX "BusinessCategory_slug_key" ON "BusinessCategory"("slug");

-- CreateIndex
CREATE INDEX "BusinessCategory_slug_idx" ON "BusinessCategory"("slug");

-- CreateIndex
CREATE INDEX "BusinessCategory_parentId_idx" ON "BusinessCategory"("parentId");

-- CreateIndex
CREATE INDEX "BusinessCategoryAssignment_businessId_idx" ON "BusinessCategoryAssignment"("businessId");

-- CreateIndex
CREATE INDEX "BusinessCategoryAssignment_categoryId_idx" ON "BusinessCategoryAssignment"("categoryId");

-- CreateIndex
CREATE UNIQUE INDEX "BusinessCategoryAssignment_businessId_categoryId_key" ON "BusinessCategoryAssignment"("businessId", "categoryId");

-- CreateIndex
CREATE UNIQUE INDEX "BusinessTag_slug_key" ON "BusinessTag"("slug");

-- CreateIndex
CREATE INDEX "BusinessTag_slug_idx" ON "BusinessTag"("slug");

-- CreateIndex
CREATE INDEX "TagAssignment_businessId_idx" ON "TagAssignment"("businessId");

-- CreateIndex
CREATE INDEX "TagAssignment_tagId_idx" ON "TagAssignment"("tagId");

-- CreateIndex
CREATE UNIQUE INDEX "TagAssignment_businessId_tagId_key" ON "TagAssignment"("businessId", "tagId");

-- CreateIndex
CREATE UNIQUE INDEX "Storefront_businessId_key" ON "Storefront"("businessId");

-- CreateIndex
CREATE INDEX "Storefront_isActive_idx" ON "Storefront"("isActive");

-- CreateIndex
CREATE INDEX "Storefront_isFeatured_idx" ON "Storefront"("isFeatured");

-- CreateIndex
CREATE UNIQUE INDEX "StorefrontTheme_storefrontId_key" ON "StorefrontTheme"("storefrontId");

-- CreateIndex
CREATE INDEX "StorefrontBanner_storefrontId_idx" ON "StorefrontBanner"("storefrontId");

-- CreateIndex
CREATE INDEX "StorefrontBanner_isActive_idx" ON "StorefrontBanner"("isActive");

-- CreateIndex
CREATE INDEX "StorefrontMedia_storefrontId_idx" ON "StorefrontMedia"("storefrontId");

-- CreateIndex
CREATE INDEX "Product_storefrontId_idx" ON "Product"("storefrontId");

-- CreateIndex
CREATE INDEX "Product_status_idx" ON "Product"("status");

-- CreateIndex
CREATE INDEX "Product_name_idx" ON "Product"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Product_storefrontId_slug_key" ON "Product"("storefrontId", "slug");

-- CreateIndex
CREATE INDEX "Service_storefrontId_idx" ON "Service"("storefrontId");

-- CreateIndex
CREATE INDEX "Service_status_idx" ON "Service"("status");

-- CreateIndex
CREATE UNIQUE INDEX "Service_storefrontId_slug_key" ON "Service"("storefrontId", "slug");

-- CreateIndex
CREATE INDEX "ServiceAvailability_serviceId_idx" ON "ServiceAvailability"("serviceId");

-- CreateIndex
CREATE INDEX "ProductPromotion_productId_idx" ON "ProductPromotion"("productId");

-- CreateIndex
CREATE INDEX "ProductPromotion_promotionId_idx" ON "ProductPromotion"("promotionId");

-- CreateIndex
CREATE UNIQUE INDEX "ProductPromotion_productId_promotionId_key" ON "ProductPromotion"("productId", "promotionId");

-- CreateIndex
CREATE INDEX "Campaign_type_idx" ON "Campaign"("type");

-- CreateIndex
CREATE INDEX "Campaign_status_idx" ON "Campaign"("status");

-- CreateIndex
CREATE INDEX "Campaign_startDate_endDate_idx" ON "Campaign"("startDate", "endDate");

-- CreateIndex
CREATE INDEX "CampaignBusiness_campaignId_idx" ON "CampaignBusiness"("campaignId");

-- CreateIndex
CREATE INDEX "CampaignBusiness_businessId_idx" ON "CampaignBusiness"("businessId");

-- CreateIndex
CREATE UNIQUE INDEX "CampaignBusiness_campaignId_businessId_key" ON "CampaignBusiness"("campaignId", "businessId");

-- CreateIndex
CREATE INDEX "CampaignReward_campaignId_idx" ON "CampaignReward"("campaignId");

-- CreateIndex
CREATE INDEX "CampaignTarget_campaignId_idx" ON "CampaignTarget"("campaignId");

-- CreateIndex
CREATE INDEX "CampaignTarget_boroughId_idx" ON "CampaignTarget"("boroughId");

-- CreateIndex
CREATE INDEX "Promotion_campaignId_idx" ON "Promotion"("campaignId");

-- CreateIndex
CREATE INDEX "Promotion_businessId_idx" ON "Promotion"("businessId");

-- CreateIndex
CREATE INDEX "Promotion_type_idx" ON "Promotion"("type");

-- CreateIndex
CREATE INDEX "Promotion_status_idx" ON "Promotion"("status");

-- CreateIndex
CREATE INDEX "Promotion_startDate_endDate_idx" ON "Promotion"("startDate", "endDate");

-- CreateIndex
CREATE INDEX "PromotionRedemption_promotionId_idx" ON "PromotionRedemption"("promotionId");

-- CreateIndex
CREATE INDEX "PromotionRedemption_customerId_idx" ON "PromotionRedemption"("customerId");

-- CreateIndex
CREATE INDEX "Rotator_campaignId_idx" ON "Rotator"("campaignId");

-- CreateIndex
CREATE INDEX "Rotator_isActive_idx" ON "Rotator"("isActive");

-- CreateIndex
CREATE INDEX "RotatorItem_rotatorId_idx" ON "RotatorItem"("rotatorId");

-- CreateIndex
CREATE INDEX "RotatorItem_productId_idx" ON "RotatorItem"("productId");

-- CreateIndex
CREATE INDEX "RotatorItem_serviceId_idx" ON "RotatorItem"("serviceId");

-- CreateIndex
CREATE INDEX "RotatorItem_promotionId_idx" ON "RotatorItem"("promotionId");

-- CreateIndex
CREATE UNIQUE INDEX "Game_slug_key" ON "Game"("slug");

-- CreateIndex
CREATE INDEX "Game_slug_idx" ON "Game"("slug");

-- CreateIndex
CREATE INDEX "Game_type_idx" ON "Game"("type");

-- CreateIndex
CREATE INDEX "GameSession_gameId_idx" ON "GameSession"("gameId");

-- CreateIndex
CREATE INDEX "GameSession_customerId_idx" ON "GameSession"("customerId");

-- CreateIndex
CREATE INDEX "GameSession_configId_idx" ON "GameSession"("configId");

-- CreateIndex
CREATE INDEX "GameSession_isWin_idx" ON "GameSession"("isWin");

-- CreateIndex
CREATE INDEX "GameConfig_gameId_idx" ON "GameConfig"("gameId");

-- CreateIndex
CREATE INDEX "GameConfig_businessId_idx" ON "GameConfig"("businessId");

-- CreateIndex
CREATE INDEX "GameCampaign_gameId_idx" ON "GameCampaign"("gameId");

-- CreateIndex
CREATE INDEX "GameCampaign_campaignId_idx" ON "GameCampaign"("campaignId");

-- CreateIndex
CREATE UNIQUE INDEX "GameCampaign_gameId_campaignId_key" ON "GameCampaign"("gameId", "campaignId");

-- CreateIndex
CREATE INDEX "Reward_type_idx" ON "Reward"("type");

-- CreateIndex
CREATE INDEX "Reward_isActive_idx" ON "Reward"("isActive");

-- CreateIndex
CREATE INDEX "RewardInventory_businessId_idx" ON "RewardInventory"("businessId");

-- CreateIndex
CREATE INDEX "RewardInventory_rewardId_idx" ON "RewardInventory"("rewardId");

-- CreateIndex
CREATE UNIQUE INDEX "RewardInventory_businessId_rewardId_key" ON "RewardInventory"("businessId", "rewardId");

-- CreateIndex
CREATE INDEX "RewardRedemption_rewardId_idx" ON "RewardRedemption"("rewardId");

-- CreateIndex
CREATE INDEX "RewardRedemption_customerId_idx" ON "RewardRedemption"("customerId");

-- CreateIndex
CREATE INDEX "RewardRedemption_businessId_idx" ON "RewardRedemption"("businessId");

-- CreateIndex
CREATE INDEX "CustomerReward_customerId_idx" ON "CustomerReward"("customerId");

-- CreateIndex
CREATE INDEX "CustomerReward_rewardId_idx" ON "CustomerReward"("rewardId");

-- CreateIndex
CREATE UNIQUE INDEX "LoyaltyProgram_businessId_key" ON "LoyaltyProgram"("businessId");

-- CreateIndex
CREATE INDEX "LoyaltyProgram_businessId_idx" ON "LoyaltyProgram"("businessId");

-- CreateIndex
CREATE INDEX "LoyaltyMembership_loyaltyProgramId_idx" ON "LoyaltyMembership"("loyaltyProgramId");

-- CreateIndex
CREATE INDEX "LoyaltyMembership_customerId_idx" ON "LoyaltyMembership"("customerId");

-- CreateIndex
CREATE INDEX "LoyaltyMembership_tierId_idx" ON "LoyaltyMembership"("tierId");

-- CreateIndex
CREATE UNIQUE INDEX "LoyaltyMembership_loyaltyProgramId_customerId_key" ON "LoyaltyMembership"("loyaltyProgramId", "customerId");

-- CreateIndex
CREATE INDEX "LoyaltyTier_loyaltyProgramId_idx" ON "LoyaltyTier"("loyaltyProgramId");

-- CreateIndex
CREATE UNIQUE INDEX "LoyaltyTier_loyaltyProgramId_level_key" ON "LoyaltyTier"("loyaltyProgramId", "level");

-- CreateIndex
CREATE INDEX "PointsTransaction_loyaltyMembershipId_idx" ON "PointsTransaction"("loyaltyMembershipId");

-- CreateIndex
CREATE INDEX "PointsTransaction_type_idx" ON "PointsTransaction"("type");

-- CreateIndex
CREATE INDEX "PointsTransaction_createdAt_idx" ON "PointsTransaction"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "Voucher_code_key" ON "Voucher"("code");

-- CreateIndex
CREATE INDEX "Voucher_code_idx" ON "Voucher"("code");

-- CreateIndex
CREATE INDEX "Voucher_businessId_idx" ON "Voucher"("businessId");

-- CreateIndex
CREATE INDEX "Voucher_customerId_idx" ON "Voucher"("customerId");

-- CreateIndex
CREATE INDEX "Voucher_status_idx" ON "Voucher"("status");

-- CreateIndex
CREATE UNIQUE INDEX "QLink_code_key" ON "QLink"("code");

-- CreateIndex
CREATE INDEX "QLink_businessId_idx" ON "QLink"("businessId");

-- CreateIndex
CREATE INDEX "QLink_code_idx" ON "QLink"("code");

-- CreateIndex
CREATE INDEX "QLink_type_idx" ON "QLink"("type");

-- CreateIndex
CREATE INDEX "QLinkScan_qlinkId_idx" ON "QLinkScan"("qlinkId");

-- CreateIndex
CREATE INDEX "QLinkScan_customerId_idx" ON "QLinkScan"("customerId");

-- CreateIndex
CREATE INDEX "QLinkCampaign_qlinkId_idx" ON "QLinkCampaign"("qlinkId");

-- CreateIndex
CREATE INDEX "QLinkCampaign_campaignId_idx" ON "QLinkCampaign"("campaignId");

-- CreateIndex
CREATE UNIQUE INDEX "QLinkCampaign_qlinkId_campaignId_key" ON "QLinkCampaign"("qlinkId", "campaignId");

-- CreateIndex
CREATE UNIQUE INDEX "Event_slug_key" ON "Event"("slug");

-- CreateIndex
CREATE INDEX "Event_slug_idx" ON "Event"("slug");

-- CreateIndex
CREATE INDEX "Event_type_idx" ON "Event"("type");

-- CreateIndex
CREATE INDEX "Event_status_idx" ON "Event"("status");

-- CreateIndex
CREATE INDEX "Event_startDate_endDate_idx" ON "Event"("startDate", "endDate");

-- CreateIndex
CREATE UNIQUE INDEX "EventRegistration_ticketRef_key" ON "EventRegistration"("ticketRef");

-- CreateIndex
CREATE INDEX "EventRegistration_eventId_idx" ON "EventRegistration"("eventId");

-- CreateIndex
CREATE INDEX "EventRegistration_customerId_idx" ON "EventRegistration"("customerId");

-- CreateIndex
CREATE INDEX "EventRegistration_status_idx" ON "EventRegistration"("status");

-- CreateIndex
CREATE UNIQUE INDEX "EventRegistration_eventId_customerId_key" ON "EventRegistration"("eventId", "customerId");

-- CreateIndex
CREATE UNIQUE INDEX "EventCheckIn_registrationId_key" ON "EventCheckIn"("registrationId");

-- CreateIndex
CREATE INDEX "EventCheckIn_eventId_idx" ON "EventCheckIn"("eventId");

-- CreateIndex
CREATE INDEX "EventCheckIn_customerId_idx" ON "EventCheckIn"("customerId");

-- CreateIndex
CREATE INDEX "Expo_eventId_idx" ON "Expo"("eventId");

-- CreateIndex
CREATE INDEX "ExpoBooth_expoId_idx" ON "ExpoBooth"("expoId");

-- CreateIndex
CREATE INDEX "ExpoBooth_businessId_idx" ON "ExpoBooth"("businessId");

-- CreateIndex
CREATE UNIQUE INDEX "ExpoParticipation_expoBoothId_key" ON "ExpoParticipation"("expoBoothId");

-- CreateIndex
CREATE INDEX "ExpoParticipation_businessId_idx" ON "ExpoParticipation"("businessId");

-- CreateIndex
CREATE INDEX "Partnership_initiatorId_idx" ON "Partnership"("initiatorId");

-- CreateIndex
CREATE INDEX "Partnership_partnerId_idx" ON "Partnership"("partnerId");

-- CreateIndex
CREATE INDEX "Partnership_status_idx" ON "Partnership"("status");

-- CreateIndex
CREATE UNIQUE INDEX "Partnership_initiatorId_partnerId_key" ON "Partnership"("initiatorId", "partnerId");

-- CreateIndex
CREATE INDEX "PartnershipRequest_targetId_idx" ON "PartnershipRequest"("targetId");

-- CreateIndex
CREATE INDEX "PartnershipRequest_requesterId_idx" ON "PartnershipRequest"("requesterId");

-- CreateIndex
CREATE INDEX "PartnershipRequest_status_idx" ON "PartnershipRequest"("status");

-- CreateIndex
CREATE INDEX "SharedCampaign_campaignId_idx" ON "SharedCampaign"("campaignId");

-- CreateIndex
CREATE INDEX "SharedCampaign_partnershipId_idx" ON "SharedCampaign"("partnershipId");

-- CreateIndex
CREATE UNIQUE INDEX "SharedCampaign_campaignId_partnershipId_key" ON "SharedCampaign"("campaignId", "partnershipId");

-- CreateIndex
CREATE INDEX "SharedAudience_partnershipId_idx" ON "SharedAudience"("partnershipId");

-- CreateIndex
CREATE UNIQUE INDEX "CommunityGroup_slug_key" ON "CommunityGroup"("slug");

-- CreateIndex
CREATE INDEX "CommunityGroup_slug_idx" ON "CommunityGroup"("slug");

-- CreateIndex
CREATE INDEX "CommunityGroup_boroughId_idx" ON "CommunityGroup"("boroughId");

-- CreateIndex
CREATE INDEX "CommunityGroup_highStreetId_idx" ON "CommunityGroup"("highStreetId");

-- CreateIndex
CREATE INDEX "CommunityGroup_type_idx" ON "CommunityGroup"("type");

-- CreateIndex
CREATE INDEX "CommunityPost_groupId_idx" ON "CommunityPost"("groupId");

-- CreateIndex
CREATE INDEX "CommunityPost_authorId_idx" ON "CommunityPost"("authorId");

-- CreateIndex
CREATE INDEX "CommunityPost_businessId_idx" ON "CommunityPost"("businessId");

-- CreateIndex
CREATE INDEX "CommunityPost_createdAt_idx" ON "CommunityPost"("createdAt");

-- CreateIndex
CREATE INDEX "CommunityActivity_groupId_idx" ON "CommunityActivity"("groupId");

-- CreateIndex
CREATE INDEX "CommunityActivity_userId_idx" ON "CommunityActivity"("userId");

-- CreateIndex
CREATE INDEX "CommunityActivity_createdAt_idx" ON "CommunityActivity"("createdAt");

-- CreateIndex
CREATE INDEX "BusinessActivation_businessId_idx" ON "BusinessActivation"("businessId");

-- CreateIndex
CREATE INDEX "BusinessActivation_customerId_idx" ON "BusinessActivation"("customerId");

-- CreateIndex
CREATE INDEX "BusinessActivation_status_idx" ON "BusinessActivation"("status");

-- CreateIndex
CREATE UNIQUE INDEX "BusinessActivation_businessId_customerId_key" ON "BusinessActivation"("businessId", "customerId");

-- CreateIndex
CREATE INDEX "ActivationReward_businessId_idx" ON "ActivationReward"("businessId");

-- CreateIndex
CREATE INDEX "ActivationReward_rewardId_idx" ON "ActivationReward"("rewardId");

-- CreateIndex
CREATE INDEX "InterestSignal_businessId_idx" ON "InterestSignal"("businessId");

-- CreateIndex
CREATE INDEX "InterestSignal_customerId_idx" ON "InterestSignal"("customerId");

-- CreateIndex
CREATE INDEX "InterestSignal_signalType_idx" ON "InterestSignal"("signalType");

-- CreateIndex
CREATE INDEX "Notification_userId_idx" ON "Notification"("userId");

-- CreateIndex
CREATE INDEX "Notification_type_idx" ON "Notification"("type");

-- CreateIndex
CREATE INDEX "Notification_isRead_idx" ON "Notification"("isRead");

-- CreateIndex
CREATE INDEX "Notification_createdAt_idx" ON "Notification"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "NotificationTemplate_name_key" ON "NotificationTemplate"("name");

-- CreateIndex
CREATE INDEX "NotificationTemplate_name_idx" ON "NotificationTemplate"("name");

-- CreateIndex
CREATE INDEX "NotificationPreference_userId_idx" ON "NotificationPreference"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "NotificationPreference_userId_channel_type_key" ON "NotificationPreference"("userId", "channel", "type");

-- CreateIndex
CREATE INDEX "Message_threadId_idx" ON "Message"("threadId");

-- CreateIndex
CREATE INDEX "Message_senderId_idx" ON "Message"("senderId");

-- CreateIndex
CREATE INDEX "Audit_businessId_idx" ON "Audit"("businessId");

-- CreateIndex
CREATE INDEX "Audit_type_idx" ON "Audit"("type");

-- CreateIndex
CREATE INDEX "Audit_status_idx" ON "Audit"("status");

-- CreateIndex
CREATE INDEX "AuditRecommendation_auditId_idx" ON "AuditRecommendation"("auditId");

-- CreateIndex
CREATE INDEX "AuditRecommendation_businessId_idx" ON "AuditRecommendation"("businessId");

-- CreateIndex
CREATE INDEX "AuditRecommendation_priority_idx" ON "AuditRecommendation"("priority");

-- CreateIndex
CREATE UNIQUE INDEX "VisibilityScore_businessId_key" ON "VisibilityScore"("businessId");

-- CreateIndex
CREATE INDEX "VisibilityScore_overall_idx" ON "VisibilityScore"("overall");

-- CreateIndex
CREATE INDEX "VisibilityScore_businessId_idx" ON "VisibilityScore"("businessId");

-- CreateIndex
CREATE INDEX "VisibilityBoost_businessId_idx" ON "VisibilityBoost"("businessId");

-- CreateIndex
CREATE INDEX "VisibilityBoost_isActive_idx" ON "VisibilityBoost"("isActive");

-- CreateIndex
CREATE UNIQUE INDEX "StorefrontScore_businessId_key" ON "StorefrontScore"("businessId");

-- CreateIndex
CREATE INDEX "StorefrontScore_businessId_idx" ON "StorefrontScore"("businessId");

-- CreateIndex
CREATE INDEX "AutomationRule_businessId_idx" ON "AutomationRule"("businessId");

-- CreateIndex
CREATE INDEX "AutomationRule_isActive_idx" ON "AutomationRule"("isActive");

-- CreateIndex
CREATE INDEX "AutomationTrigger_ruleId_idx" ON "AutomationTrigger"("ruleId");

-- CreateIndex
CREATE INDEX "AutomationAction_ruleId_idx" ON "AutomationAction"("ruleId");

-- CreateIndex
CREATE INDEX "AutomationLog_ruleId_idx" ON "AutomationLog"("ruleId");

-- CreateIndex
CREATE INDEX "AutomationLog_status_idx" ON "AutomationLog"("status");

-- CreateIndex
CREATE INDEX "AutomationLog_executedAt_idx" ON "AutomationLog"("executedAt");

-- CreateIndex
CREATE INDEX "AbuseReport_reporterId_idx" ON "AbuseReport"("reporterId");

-- CreateIndex
CREATE INDEX "AbuseReport_targetType_idx" ON "AbuseReport"("targetType");

-- CreateIndex
CREATE INDEX "AbuseReport_status_idx" ON "AbuseReport"("status");

-- CreateIndex
CREATE INDEX "AbuseReport_moderatorId_idx" ON "AbuseReport"("moderatorId");

-- CreateIndex
CREATE UNIQUE INDEX "ModerationAction_reportId_key" ON "ModerationAction"("reportId");

-- CreateIndex
CREATE INDEX "ModerationAction_targetType_idx" ON "ModerationAction"("targetType");

-- CreateIndex
CREATE INDEX "ModerationAction_performedBy_idx" ON "ModerationAction"("performedBy");

-- CreateIndex
CREATE UNIQUE INDEX "ModerationRule_name_key" ON "ModerationRule"("name");

-- CreateIndex
CREATE INDEX "ModerationRule_resource_idx" ON "ModerationRule"("resource");

-- CreateIndex
CREATE INDEX "ModerationRule_isActive_idx" ON "ModerationRule"("isActive");

-- CreateIndex
CREATE INDEX "FraudAlert_entityType_idx" ON "FraudAlert"("entityType");

-- CreateIndex
CREATE INDEX "FraudAlert_alertType_idx" ON "FraudAlert"("alertType");

-- CreateIndex
CREATE INDEX "FraudAlert_severity_idx" ON "FraudAlert"("severity");

-- CreateIndex
CREATE INDEX "FraudAlert_isResolved_idx" ON "FraudAlert"("isResolved");

-- CreateIndex
CREATE INDEX "Subscription_businessId_idx" ON "Subscription"("businessId");

-- CreateIndex
CREATE INDEX "Subscription_planType_idx" ON "Subscription"("planType");

-- CreateIndex
CREATE INDEX "Subscription_status_idx" ON "Subscription"("status");

-- CreateIndex
CREATE INDEX "Subscription_currentPeriodEnd_idx" ON "Subscription"("currentPeriodEnd");

-- CreateIndex
CREATE UNIQUE INDEX "SubscriptionPlan_name_key" ON "SubscriptionPlan"("name");

-- CreateIndex
CREATE UNIQUE INDEX "SubscriptionPlan_planType_key" ON "SubscriptionPlan"("planType");

-- CreateIndex
CREATE UNIQUE INDEX "Invoice_invoiceNumber_key" ON "Invoice"("invoiceNumber");

-- CreateIndex
CREATE INDEX "Invoice_subscriptionId_idx" ON "Invoice"("subscriptionId");

-- CreateIndex
CREATE INDEX "Invoice_businessId_idx" ON "Invoice"("businessId");

-- CreateIndex
CREATE INDEX "Invoice_status_idx" ON "Invoice"("status");

-- CreateIndex
CREATE INDEX "Invoice_dueDate_idx" ON "Invoice"("dueDate");

-- CreateIndex
CREATE INDEX "PaymentMethod_businessId_idx" ON "PaymentMethod"("businessId");

-- CreateIndex
CREATE INDEX "PaymentMethod_providerId_idx" ON "PaymentMethod"("providerId");

-- CreateIndex
CREATE INDEX "Transaction_businessId_idx" ON "Transaction"("businessId");

-- CreateIndex
CREATE INDEX "Transaction_invoiceId_idx" ON "Transaction"("invoiceId");

-- CreateIndex
CREATE INDEX "Transaction_status_idx" ON "Transaction"("status");

-- CreateIndex
CREATE INDEX "Transaction_createdAt_idx" ON "Transaction"("createdAt");

-- CreateIndex
CREATE INDEX "Credit_businessId_idx" ON "Credit"("businessId");

-- CreateIndex
CREATE INDEX "Credit_type_idx" ON "Credit"("type");

-- CreateIndex
CREATE INDEX "CreditUsage_creditId_idx" ON "CreditUsage"("creditId");

-- CreateIndex
CREATE INDEX "AnalyticsEvent_eventName_idx" ON "AnalyticsEvent"("eventName");

-- CreateIndex
CREATE INDEX "AnalyticsEvent_entityType_entityId_idx" ON "AnalyticsEvent"("entityType", "entityId");

-- CreateIndex
CREATE INDEX "AnalyticsEvent_customerId_idx" ON "AnalyticsEvent"("customerId");

-- CreateIndex
CREATE INDEX "AnalyticsEvent_timestamp_idx" ON "AnalyticsEvent"("timestamp");

-- CreateIndex
CREATE INDEX "AnalyticsAggregation_metric_entityType_entityId_period_peri_idx" ON "AnalyticsAggregation"("metric", "entityType", "entityId", "period", "periodStart");

-- CreateIndex
CREATE INDEX "AnalyticsAggregation_entityType_entityId_idx" ON "AnalyticsAggregation"("entityType", "entityId");

-- CreateIndex
CREATE INDEX "AnalyticsAggregation_periodStart_periodEnd_idx" ON "AnalyticsAggregation"("periodStart", "periodEnd");

-- CreateIndex
CREATE UNIQUE INDEX "AnalyticsAggregation_metric_entityType_entityId_period_peri_key" ON "AnalyticsAggregation"("metric", "entityType", "entityId", "period", "periodStart");

-- CreateIndex
CREATE INDEX "CustomerActivityLog_customerId_idx" ON "CustomerActivityLog"("customerId");

-- CreateIndex
CREATE INDEX "CustomerActivityLog_activityType_idx" ON "CustomerActivityLog"("activityType");

-- CreateIndex
CREATE INDEX "CustomerActivityLog_createdAt_idx" ON "CustomerActivityLog"("createdAt");

-- CreateIndex
CREATE INDEX "BusinessActivityLog_businessId_idx" ON "BusinessActivityLog"("businessId");

-- CreateIndex
CREATE INDEX "BusinessActivityLog_userId_idx" ON "BusinessActivityLog"("userId");

-- CreateIndex
CREATE INDEX "BusinessActivityLog_activityType_idx" ON "BusinessActivityLog"("activityType");

-- CreateIndex
CREATE INDEX "BusinessActivityLog_createdAt_idx" ON "BusinessActivityLog"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "PlatformSetting_key_key" ON "PlatformSetting"("key");

-- CreateIndex
CREATE INDEX "PlatformSetting_key_idx" ON "PlatformSetting"("key");

-- CreateIndex
CREATE INDEX "_MessageThreadParticipants_B_index" ON "_MessageThreadParticipants"("B");

-- AddForeignKey
ALTER TABLE "Permission" ADD CONSTRAINT "Permission_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserRole" ADD CONSTRAINT "UserRole_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserRole" ADD CONSTRAINT "UserRole_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HighStreet" ADD CONSTRAINT "HighStreet_boroughId_fkey" FOREIGN KEY ("boroughId") REFERENCES "Borough"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StorefrontCluster" ADD CONSTRAINT "StorefrontCluster_highStreetId_fkey" FOREIGN KEY ("highStreetId") REFERENCES "HighStreet"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Location" ADD CONSTRAINT "Location_storefrontClusterId_fkey" FOREIGN KEY ("storefrontClusterId") REFERENCES "StorefrontCluster"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Location" ADD CONSTRAINT "Location_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Location" ADD CONSTRAINT "Location_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Business" ADD CONSTRAINT "Business_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BusinessVerification" ADD CONSTRAINT "BusinessVerification_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BusinessClaim" ADD CONSTRAINT "BusinessClaim_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BusinessStaff" ADD CONSTRAINT "BusinessStaff_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BusinessStaff" ADD CONSTRAINT "BusinessStaff_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BusinessMembership" ADD CONSTRAINT "BusinessMembership_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BusinessLocation" ADD CONSTRAINT "BusinessLocation_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BusinessLocation" ADD CONSTRAINT "BusinessLocation_highStreetId_fkey" FOREIGN KEY ("highStreetId") REFERENCES "HighStreet"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BusinessHours" ADD CONSTRAINT "BusinessHours_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BusinessHours" ADD CONSTRAINT "BusinessHours_businessLocationId_fkey" FOREIGN KEY ("businessLocationId") REFERENCES "BusinessLocation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BusinessCategory" ADD CONSTRAINT "BusinessCategory_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "BusinessCategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BusinessCategoryAssignment" ADD CONSTRAINT "BusinessCategoryAssignment_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BusinessCategoryAssignment" ADD CONSTRAINT "BusinessCategoryAssignment_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "BusinessCategory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TagAssignment" ADD CONSTRAINT "TagAssignment_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TagAssignment" ADD CONSTRAINT "TagAssignment_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "BusinessTag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Storefront" ADD CONSTRAINT "Storefront_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StorefrontTheme" ADD CONSTRAINT "StorefrontTheme_storefrontId_fkey" FOREIGN KEY ("storefrontId") REFERENCES "Storefront"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StorefrontBanner" ADD CONSTRAINT "StorefrontBanner_storefrontId_fkey" FOREIGN KEY ("storefrontId") REFERENCES "Storefront"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StorefrontMedia" ADD CONSTRAINT "StorefrontMedia_storefrontId_fkey" FOREIGN KEY ("storefrontId") REFERENCES "Storefront"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_storefrontId_fkey" FOREIGN KEY ("storefrontId") REFERENCES "Storefront"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Service" ADD CONSTRAINT "Service_storefrontId_fkey" FOREIGN KEY ("storefrontId") REFERENCES "Storefront"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServiceAvailability" ADD CONSTRAINT "ServiceAvailability_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductPromotion" ADD CONSTRAINT "ProductPromotion_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductPromotion" ADD CONSTRAINT "ProductPromotion_promotionId_fkey" FOREIGN KEY ("promotionId") REFERENCES "Promotion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CampaignBusiness" ADD CONSTRAINT "CampaignBusiness_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "Campaign"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CampaignBusiness" ADD CONSTRAINT "CampaignBusiness_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CampaignReward" ADD CONSTRAINT "CampaignReward_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "Campaign"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CampaignTarget" ADD CONSTRAINT "CampaignTarget_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "Campaign"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CampaignTarget" ADD CONSTRAINT "CampaignTarget_boroughId_fkey" FOREIGN KEY ("boroughId") REFERENCES "Borough"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Promotion" ADD CONSTRAINT "Promotion_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "Campaign"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Promotion" ADD CONSTRAINT "Promotion_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PromotionRedemption" ADD CONSTRAINT "PromotionRedemption_promotionId_fkey" FOREIGN KEY ("promotionId") REFERENCES "Promotion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rotator" ADD CONSTRAINT "Rotator_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "Campaign"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RotatorItem" ADD CONSTRAINT "RotatorItem_rotatorId_fkey" FOREIGN KEY ("rotatorId") REFERENCES "Rotator"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RotatorItem" ADD CONSTRAINT "RotatorItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RotatorItem" ADD CONSTRAINT "RotatorItem_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RotatorItem" ADD CONSTRAINT "RotatorItem_promotionId_fkey" FOREIGN KEY ("promotionId") REFERENCES "Promotion"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GameSession" ADD CONSTRAINT "GameSession_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GameSession" ADD CONSTRAINT "GameSession_configId_fkey" FOREIGN KEY ("configId") REFERENCES "GameConfig"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GameSession" ADD CONSTRAINT "GameSession_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GameSession" ADD CONSTRAINT "GameSession_rewardId_fkey" FOREIGN KEY ("rewardId") REFERENCES "Reward"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GameConfig" ADD CONSTRAINT "GameConfig_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GameConfig" ADD CONSTRAINT "GameConfig_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GameCampaign" ADD CONSTRAINT "GameCampaign_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GameCampaign" ADD CONSTRAINT "GameCampaign_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "Campaign"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RewardInventory" ADD CONSTRAINT "RewardInventory_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RewardInventory" ADD CONSTRAINT "RewardInventory_rewardId_fkey" FOREIGN KEY ("rewardId") REFERENCES "Reward"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RewardRedemption" ADD CONSTRAINT "RewardRedemption_rewardId_fkey" FOREIGN KEY ("rewardId") REFERENCES "Reward"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomerReward" ADD CONSTRAINT "CustomerReward_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomerReward" ADD CONSTRAINT "CustomerReward_rewardId_fkey" FOREIGN KEY ("rewardId") REFERENCES "Reward"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LoyaltyProgram" ADD CONSTRAINT "LoyaltyProgram_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LoyaltyMembership" ADD CONSTRAINT "LoyaltyMembership_loyaltyProgramId_fkey" FOREIGN KEY ("loyaltyProgramId") REFERENCES "LoyaltyProgram"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LoyaltyMembership" ADD CONSTRAINT "LoyaltyMembership_tierId_fkey" FOREIGN KEY ("tierId") REFERENCES "LoyaltyTier"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LoyaltyTier" ADD CONSTRAINT "LoyaltyTier_loyaltyProgramId_fkey" FOREIGN KEY ("loyaltyProgramId") REFERENCES "LoyaltyProgram"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PointsTransaction" ADD CONSTRAINT "PointsTransaction_loyaltyMembershipId_fkey" FOREIGN KEY ("loyaltyMembershipId") REFERENCES "LoyaltyMembership"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Voucher" ADD CONSTRAINT "Voucher_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Voucher" ADD CONSTRAINT "Voucher_rewardId_fkey" FOREIGN KEY ("rewardId") REFERENCES "Reward"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QLink" ADD CONSTRAINT "QLink_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QLinkScan" ADD CONSTRAINT "QLinkScan_qlinkId_fkey" FOREIGN KEY ("qlinkId") REFERENCES "QLink"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QLinkCampaign" ADD CONSTRAINT "QLinkCampaign_qlinkId_fkey" FOREIGN KEY ("qlinkId") REFERENCES "QLink"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QLinkCampaign" ADD CONSTRAINT "QLinkCampaign_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "Campaign"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventRegistration" ADD CONSTRAINT "EventRegistration_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventRegistration" ADD CONSTRAINT "EventRegistration_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventCheckIn" ADD CONSTRAINT "EventCheckIn_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventCheckIn" ADD CONSTRAINT "EventCheckIn_registrationId_fkey" FOREIGN KEY ("registrationId") REFERENCES "EventRegistration"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Expo" ADD CONSTRAINT "Expo_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExpoBooth" ADD CONSTRAINT "ExpoBooth_expoId_fkey" FOREIGN KEY ("expoId") REFERENCES "Expo"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExpoBooth" ADD CONSTRAINT "ExpoBooth_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExpoParticipation" ADD CONSTRAINT "ExpoParticipation_expoBoothId_fkey" FOREIGN KEY ("expoBoothId") REFERENCES "ExpoBooth"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExpoParticipation" ADD CONSTRAINT "ExpoParticipation_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Partnership" ADD CONSTRAINT "Partnership_initiatorId_fkey" FOREIGN KEY ("initiatorId") REFERENCES "Business"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Partnership" ADD CONSTRAINT "Partnership_partnerId_fkey" FOREIGN KEY ("partnerId") REFERENCES "Business"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PartnershipRequest" ADD CONSTRAINT "PartnershipRequest_targetId_fkey" FOREIGN KEY ("targetId") REFERENCES "Business"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SharedCampaign" ADD CONSTRAINT "SharedCampaign_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "Campaign"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SharedCampaign" ADD CONSTRAINT "SharedCampaign_partnershipId_fkey" FOREIGN KEY ("partnershipId") REFERENCES "Partnership"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SharedAudience" ADD CONSTRAINT "SharedAudience_partnershipId_fkey" FOREIGN KEY ("partnershipId") REFERENCES "Partnership"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommunityGroup" ADD CONSTRAINT "CommunityGroup_boroughId_fkey" FOREIGN KEY ("boroughId") REFERENCES "Borough"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommunityGroup" ADD CONSTRAINT "CommunityGroup_highStreetId_fkey" FOREIGN KEY ("highStreetId") REFERENCES "HighStreet"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommunityPost" ADD CONSTRAINT "CommunityPost_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "CommunityGroup"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommunityPost" ADD CONSTRAINT "CommunityPost_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommunityPost" ADD CONSTRAINT "CommunityPost_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommunityActivity" ADD CONSTRAINT "CommunityActivity_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "CommunityGroup"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BusinessActivation" ADD CONSTRAINT "BusinessActivation_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActivationReward" ADD CONSTRAINT "ActivationReward_rewardId_fkey" FOREIGN KEY ("rewardId") REFERENCES "Reward"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InterestSignal" ADD CONSTRAINT "InterestSignal_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "NotificationTemplate"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NotificationPreference" ADD CONSTRAINT "NotificationPreference_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_threadId_fkey" FOREIGN KEY ("threadId") REFERENCES "MessageThread"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Audit" ADD CONSTRAINT "Audit_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditRecommendation" ADD CONSTRAINT "AuditRecommendation_auditId_fkey" FOREIGN KEY ("auditId") REFERENCES "Audit"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditRecommendation" ADD CONSTRAINT "AuditRecommendation_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VisibilityScore" ADD CONSTRAINT "VisibilityScore_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VisibilityBoost" ADD CONSTRAINT "VisibilityBoost_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StorefrontScore" ADD CONSTRAINT "StorefrontScore_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AutomationRule" ADD CONSTRAINT "AutomationRule_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AutomationTrigger" ADD CONSTRAINT "AutomationTrigger_ruleId_fkey" FOREIGN KEY ("ruleId") REFERENCES "AutomationRule"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AutomationAction" ADD CONSTRAINT "AutomationAction_ruleId_fkey" FOREIGN KEY ("ruleId") REFERENCES "AutomationRule"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AutomationLog" ADD CONSTRAINT "AutomationLog_ruleId_fkey" FOREIGN KEY ("ruleId") REFERENCES "AutomationRule"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AutomationLog" ADD CONSTRAINT "AutomationLog_triggerId_fkey" FOREIGN KEY ("triggerId") REFERENCES "AutomationTrigger"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AbuseReport" ADD CONSTRAINT "AbuseReport_reporterId_fkey" FOREIGN KEY ("reporterId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AbuseReport" ADD CONSTRAINT "AbuseReport_moderatorId_fkey" FOREIGN KEY ("moderatorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ModerationAction" ADD CONSTRAINT "ModerationAction_reportId_fkey" FOREIGN KEY ("reportId") REFERENCES "AbuseReport"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ModerationAction" ADD CONSTRAINT "ModerationAction_performedBy_fkey" FOREIGN KEY ("performedBy") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_subscriptionId_fkey" FOREIGN KEY ("subscriptionId") REFERENCES "Subscription"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaymentMethod" ADD CONSTRAINT "PaymentMethod_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "Invoice"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_paymentMethodId_fkey" FOREIGN KEY ("paymentMethodId") REFERENCES "PaymentMethod"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Credit" ADD CONSTRAINT "Credit_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CreditUsage" ADD CONSTRAINT "CreditUsage_creditId_fkey" FOREIGN KEY ("creditId") REFERENCES "Credit"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomerActivityLog" ADD CONSTRAINT "CustomerActivityLog_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BusinessActivityLog" ADD CONSTRAINT "BusinessActivityLog_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MessageThreadParticipants" ADD CONSTRAINT "_MessageThreadParticipants_A_fkey" FOREIGN KEY ("A") REFERENCES "MessageThread"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MessageThreadParticipants" ADD CONSTRAINT "_MessageThreadParticipants_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
