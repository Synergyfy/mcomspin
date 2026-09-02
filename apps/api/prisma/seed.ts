import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // ── Clean existing seed data ──
  await prisma.gameSession.deleteMany({ where: { game: { type: 'BallDrop' } } });
  await prisma.gameConfig.deleteMany({ where: { game: { type: 'BallDrop' } } });
  await prisma.gameCampaign.deleteMany({ where: { game: { type: 'BallDrop' } } });
  await prisma.campaignReward.deleteMany({ where: { campaign: { isPublic: true } } });
  await prisma.campaignBusiness.deleteMany({ where: { campaign: { isPublic: true } } });
  await prisma.campaign.deleteMany({ where: { isPublic: true, status: 'Active' } });
  await prisma.game.deleteMany({ where: { type: 'BallDrop' } });

  // ── Roles ──
  const roleNames = ['SuperAdmin', 'BusinessOwner', 'Customer'] as const;
  const roles: Record<string, string> = {};
  for (const name of roleNames) {
    const role = await prisma.role.upsert({
      where: { name },
      create: { name, isSystem: true },
      update: {},
    });
    roles[name] = role.id;
  }

  // ── Business Owner User ──
  const ownerHash = await bcrypt.hash('password123', 10);
  const owner = await prisma.user.upsert({
    where: { email: 'owner@demo.com' },
    create: {
      email: 'owner@demo.com',
      firstName: 'Demo',
      lastName: 'Owner',
      passwordHash: ownerHash,
      isEmailVerified: true,
      isActive: true,
    },
    update: {},
  });
  await prisma.userRole.upsert({
    where: { userId_roleId: { userId: owner.id, roleId: roles.BusinessOwner } },
    create: { userId: owner.id, roleId: roles.BusinessOwner },
    update: {},
  });

  // ── SuperAdmin User ──
  const adminHash = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@mcomspin.com' },
    create: {
      email: 'admin@mcomspin.com',
      firstName: 'MCom',
      lastName: 'Admin',
      passwordHash: adminHash,
      isEmailVerified: true,
      isActive: true,
    },
    update: {},
  });
  await prisma.userRole.upsert({
    where: { userId_roleId: { userId: admin.id, roleId: roles.SuperAdmin } },
    create: { userId: admin.id, roleId: roles.SuperAdmin },
    update: {},
  });

  // ── Customer User ──
  const customerHash = await bcrypt.hash('password123', 10);
  const customer = await prisma.user.upsert({
    where: { email: 'customer@demo.com' },
    create: {
      email: 'customer@demo.com',
      firstName: 'Demo',
      lastName: 'Customer',
      passwordHash: customerHash,
      isEmailVerified: true,
      isActive: true,
    },
    update: {},
  });
  await prisma.userRole.upsert({
    where: { userId_roleId: { userId: customer.id, roleId: roles.Customer } },
    create: { userId: customer.id, roleId: roles.Customer },
    update: {},
  });

  // ── Businesses ──
  const businesses = [
    {
      slug: 'demo-fashion-boutique',
      name: 'Style Studio Boutique',
      description: 'Premium fashion and accessories for the modern trendsetter.',
      shortDescription: 'Premium fashion boutique',
      logoUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=200&q=80',
      email: 'hello@stylestudio.com',
      phone: '+1-555-0100',
    },
    {
      slug: 'demo-tech-hub',
      name: 'TechHub Electronics',
      description: 'Cutting-edge gadgets, electronics, and tech accessories.',
      shortDescription: 'Electronics & gadgets',
      logoUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=200&q=80',
      email: 'hello@techhub.com',
      phone: '+1-555-0200',
    },
    {
      slug: 'demo-gourmet-kitchen',
      name: 'Gourmet Kitchen',
      description: 'Farm-to-table dining experience with handcrafted dishes.',
      shortDescription: 'Fine dining restaurant',
      logoUrl: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=200&q=80',
      email: 'info@gourmetkitchen.com',
      phone: '+1-555-0300',
    },
  ];

  const createdBusinesses: { business: any }[] = [];
  for (const b of businesses) {
    const business = await prisma.business.upsert({
      where: { slug: b.slug },
      create: {
        ownerId: owner.id,
        name: b.name,
        slug: b.slug,
        description: b.description,
        shortDescription: b.shortDescription,
        logoUrl: b.logoUrl,
        contactEmail: b.email,
        contactPhone: b.phone,
        isActive: true,
        isOpen: true,
      },
      update: {},
    });
    createdBusinesses.push({ business });
  }

  // ── Game ──
  const game = await prisma.game.create({
    data: {
      name: 'Mystery Ball Drop',
      slug: 'mystery-ball-drop',
      type: 'BallDrop',
      description: 'Drop the ball into mystery boxes to win rewards!',
      isActive: true,
      minPlayers: 1,
      maxPlayers: 1,
    },
  });

  const prizeBoxes = [
    { index: 0, hasReward: false, label: 'Try Again' },
    { index: 1, hasReward: false, label: 'Better Luck' },
    { index: 2, hasReward: true, label: 'Small Win', rewardType: 'Discount', rewardValue: 5 },
    { index: 3, hasReward: false, label: 'Try Again' },
    { index: 4, hasReward: false, label: 'Almost' },
    { index: 5, hasReward: true, label: 'Big Win', rewardType: 'Voucher', rewardValue: 25 },
    { index: 6, hasReward: false, label: 'Try Again' },
    { index: 7, hasReward: false, label: 'Better Luck' },
  ];

  const now = new Date();
  const campaignNames = [
    { name: 'Fashion Fest Rewards', desc: 'Drop the ball and win exclusive fashion deals!', img: 'https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=800&q=80' },
    { name: 'Tech Treasure Drop', desc: 'Play and win amazing tech accessories and gadgets!', img: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80' },
    { name: 'Dinner & Drops', desc: 'Play for a chance to win free meals and discounts!', img: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80' },
  ];

  for (let i = 0; i < createdBusinesses.length; i++) {
    const { business } = createdBusinesses[i];
    const cn = campaignNames[i];

    const campaign = await prisma.campaign.create({
      data: {
        name: cn.name,
        description: cn.desc,
        imageUrl: cn.img,
        type: 'Seasonal',
        status: 'Active',
        isPublic: true,
        startDate: now,
        endDate: new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000),
      },
    });

    // Link campaign to business
    await prisma.campaignBusiness.create({
      data: { campaignId: campaign.id, businessId: business.id, isActive: true },
    });

    // Link game to campaign
    await prisma.gameCampaign.create({
      data: { gameId: game.id, campaignId: campaign.id, isActive: true, maxPlaysPerCustomer: 10 },
    });

    // Game config per business
    const config = await prisma.gameConfig.create({
      data: {
        gameId: game.id,
        businessId: business.id,
        name: `${cn.name} Config`,
        isActive: true,
        config: { boxes: prizeBoxes },
      },
    });

    // Campaign rewards
    const rewards = [
      { name: '10% Discount', description: 'Get 10% off your next purchase', rewardType: 'Discount' as const, rewardValue: 10, quantity: 100, remaining: 100 },
      { name: '$25 Voucher', description: '$25 store credit voucher', rewardType: 'Voucher' as const, rewardValue: 25, quantity: 50, remaining: 50 },
      { name: 'Free Gift', description: 'A complimentary gift with purchase', rewardType: 'FreeProduct' as const, rewardValue: 0, quantity: 30, remaining: 30 },
    ];

    for (const r of rewards) {
      await prisma.campaignReward.create({
        data: {
          campaignId: campaign.id,
          name: r.name,
          description: r.description,
          rewardType: r.rewardType,
          rewardValue: r.rewardValue,
          quantity: r.quantity,
          remaining: r.remaining,
        },
      });
    }
  }

  // ── Sample activity for the customer ──
  await prisma.customerActivityLog.createMany({
    data: [
      { customerId: customer.id, activityType: 'Purchase', description: 'Won a 10% Discount at Style Studio Boutique' },
      { customerId: customer.id, activityType: 'Purchase', description: 'Redeemed $25 Voucher at TechHub Electronics' },
      { customerId: customer.id, activityType: 'View', description: 'Browsed Gourmet Kitchen deals' },
    ],
  });

  // ── Subscription Plans ──
  await seedPlans();

  console.log('✅ Seed complete!');
  console.log(`  👤 Owner:     owner@demo.com / password123`);
  console.log(`  👤 Customer:  customer@demo.com / password123`);
  console.log(`  👤 Admin:     admin@mcomspin.com / admin123`);
  console.log(`  🎮 Game ID:   ${game.id}`);
  console.log(`  🏪 Businesses: ${createdBusinesses.length}`);
  console.log(`  📋 Campaigns:  ${campaignNames.length}`);
}

async function seedPlans() {
  const plans = [
    {
      name: 'Spin Free',
      description: 'Free tier to try the platform',
      isFree: true,
      monthlyPrice: 0,
      sortOrder: 1,
      isDefault: true,
      quotas: {
        maxActiveGames: 1,
        maxActiveCampaigns: 1,
        maxRewards: 5,
        monthlyPlaysAllowance: 100,
        maxGameSessions: 100,
        maxTeamMembers: 1,
      },
      featureFlags: {},
    },
    {
      name: 'Spin Starter',
      description: 'For growing businesses',
      isFree: false,
      monthlyPrice: 29,
      sortOrder: 2,
      isDefault: false,
      quotas: {
        maxActiveGames: 3,
        maxActiveCampaigns: 3,
        maxRewards: 20,
        monthlyPlaysAllowance: 1000,
        maxGameSessions: 1000,
        maxTeamMembers: 3,
      },
      featureFlags: {
        canCreateRewardFromScratch: true,
      },
    },
    {
      name: 'Spin Growth',
      description: 'For scaling operations',
      isFree: false,
      monthlyPrice: 79,
      sortOrder: 3,
      isDefault: false,
      quotas: {
        maxActiveGames: 10,
        maxActiveCampaigns: 10,
        maxRewards: 100,
        monthlyPlaysAllowance: 5000,
        maxGameSessions: 5000,
        maxTeamMembers: 10,
      },
      featureFlags: {
        canCreateRewardFromScratch: true,
        canScheduleCampaigns: true,
      },
    },
    {
      name: 'Spin Enterprise',
      description: 'For large organisations',
      isFree: false,
      monthlyPrice: 199,
      sortOrder: 4,
      isDefault: false,
      quotas: {
        maxActiveGames: -1,
        maxActiveCampaigns: -1,
        maxRewards: -1,
        monthlyPlaysAllowance: -1,
        maxGameSessions: -1,
        maxTeamMembers: 50,
      },
      featureFlags: {
        canCreateRewardFromScratch: true,
        canScheduleCampaigns: true,
        hasAdvancedAnalytics: true,
      },
    },
  ];

  for (const plan of plans) {
    const features = {
      quotas: plan.quotas,
      featureFlags: plan.featureFlags,
      isDefault: plan.isDefault,
    };
    await prisma.subscriptionPlan.upsert({
      where: { name: plan.name },
      create: {
        name: plan.name,
        description: plan.description,
        isFree: plan.isFree,
        price: plan.monthlyPrice,
        currency: 'GBP',
        interval: 'month',
        features,
        maxStaff: plan.quotas.maxTeamMembers,
        maxLocations: 1,
        maxProducts: 0,
        maxCampaigns: plan.quotas.maxActiveCampaigns,
        isActive: true,
        sortOrder: plan.sortOrder,
      },
      update: {
        description: plan.description,
        isFree: plan.isFree,
        price: plan.monthlyPrice,
        features,
        maxStaff: plan.quotas.maxTeamMembers,
        maxCampaigns: plan.quotas.maxActiveCampaigns,
        isActive: true,
        sortOrder: plan.sortOrder,
      },
    });
  }

  console.log('  💳 Plans:     Spin Free / Starter / Growth / Enterprise');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
