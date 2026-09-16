import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding Unified Membership Plans & Tier Levels...');

  // 1. Ensure Plan Tier Levels (STANDARD, PRO, PRO_PLUS)
  const tierStandard = await prisma.planTierLevel.upsert({
    where: { name: 'STANDARD' },
    create: { name: 'STANDARD', sortOrder: 1, durationDays: 90, isCalendarYear: false },
    update: { sortOrder: 1, durationDays: 90, isCalendarYear: false },
  });
  console.log(`  ✓ Tier Level: STANDARD (90 days)`);

  const tierPro = await prisma.planTierLevel.upsert({
    where: { name: 'PRO' },
    create: { name: 'PRO', sortOrder: 2, durationDays: 180, isCalendarYear: false },
    update: { sortOrder: 2, durationDays: 180, isCalendarYear: false },
  });
  console.log(`  ✓ Tier Level: PRO (180 days)`);

  const tierProPlus = await prisma.planTierLevel.upsert({
    where: { name: 'PRO_PLUS' },
    create: { name: 'PRO_PLUS', sortOrder: 3, durationDays: null, isCalendarYear: true },
    update: { sortOrder: 3, durationDays: null, isCalendarYear: true },
  });
  console.log(`  ✓ Tier Level: PRO_PLUS (1 Calendar Year)`);

  // 2. Sample Commercial Plans
  const plans = [
    {
      name: 'Commercial Merchant Plan',
      slug: 'commercial-merchant-plan',
      description: 'The standard monetization and gamification package for retail & services.',
      variants: [
        {
          tier: tierStandard,
          price: 49.99,
          features: [
            '90 Days Full Platform Access',
            'Standard Search Placement',
            'Up to 25 Product & Service Listings',
            'Up to 2 Active Games',
            'Up to 2 Active Campaigns',
            'Standard Email Support',
          ],
          configuration: {
            quotas: {
              maxListings: 25,
              maxProducts: 25,
              maxServices: 10,
              maxActiveGames: 2,
              maxActiveCampaigns: 2,
              maxRewards: 10,
              maxTeamMembers: 3,
              monthlyPlaysAllowance: 1000,
            },
            featureFlags: {
              priorityInSearch: false,
              advancedAnalytics: false,
              dedicatedSupport: false,
              allowCustomBranding: false,
              canScheduleCampaigns: false,
            },
          },
        },
        {
          tier: tierPro,
          price: 89.99,
          features: [
            '180 Days Full Platform Access',
            'Priority Ranking in High Street Search',
            'Up to 100 Listings',
            'Up to 5 Active Games',
            'Up to 5 Active Campaigns',
            'Realtime Analytics Dashboard',
            'Storefront Custom Branding',
            'Campaign Advance Scheduling',
          ],
          configuration: {
            quotas: {
              maxListings: 100,
              maxProducts: 100,
              maxServices: 30,
              maxActiveGames: 5,
              maxActiveCampaigns: 5,
              maxRewards: 50,
              maxTeamMembers: 10,
              monthlyPlaysAllowance: 5000,
            },
            featureFlags: {
              priorityInSearch: true,
              advancedAnalytics: true,
              dedicatedSupport: false,
              allowCustomBranding: true,
              canScheduleCampaigns: true,
            },
          },
        },
        {
          tier: tierProPlus,
          price: 149.99,
          features: [
            '1 Full Calendar Year Unlocked',
            'Top Priority Search Placement & High Street Banner',
            'Unlimited Product & Service Listings',
            'Unlimited Games & Active Campaigns',
            'Unlimited Rewards & Team Members',
            'Dedicated Account Manager',
            'Full Realtime Analytics & Export',
            'Custom Storefront Branding & Themes',
          ],
          configuration: {
            quotas: {
              maxListings: -1,
              maxProducts: -1,
              maxServices: -1,
              maxActiveGames: -1,
              maxActiveCampaigns: -1,
              maxRewards: -1,
              maxTeamMembers: -1,
              monthlyPlaysAllowance: -1,
            },
            featureFlags: {
              priorityInSearch: true,
              advancedAnalytics: true,
              dedicatedSupport: true,
              allowCustomBranding: true,
              canScheduleCampaigns: true,
            },
          },
        },
      ],
    },
    {
      name: 'High Street Growth Plan',
      slug: 'high-street-growth-plan',
      description: 'Specialized package tailored for high-volume local merchants and dining partners.',
      variants: [
        {
          tier: tierStandard,
          price: 59.99,
          features: [
            '90 Days High Street Visibility',
            'Up to 50 Menu & Product Listings',
            'Standard Ball Drop Game Access',
            'Up to 5 Active Campaigns',
          ],
          configuration: {
            quotas: {
              maxListings: 50,
              maxProducts: 50,
              maxServices: 20,
              maxActiveGames: 3,
              maxActiveCampaigns: 5,
              maxRewards: 25,
              maxTeamMembers: 5,
              monthlyPlaysAllowance: 2500,
            },
            featureFlags: {
              priorityInSearch: false,
              advancedAnalytics: false,
              dedicatedSupport: false,
              allowCustomBranding: false,
              canScheduleCampaigns: false,
            },
          },
        },
        {
          tier: tierPro,
          price: 109.99,
          features: [
            '180 Days High Street Visibility',
            'Up to 200 Menu & Product Listings',
            'Priority Search & Circle Sharing',
            'Up to 10 Active Campaigns',
            'Realtime Analytics & Custom Branding',
          ],
          configuration: {
            quotas: {
              maxListings: 200,
              maxProducts: 200,
              maxServices: 50,
              maxActiveGames: 8,
              maxActiveCampaigns: 10,
              maxRewards: 100,
              maxTeamMembers: 15,
              monthlyPlaysAllowance: 10000,
            },
            featureFlags: {
              priorityInSearch: true,
              advancedAnalytics: true,
              dedicatedSupport: false,
              allowCustomBranding: true,
              canScheduleCampaigns: true,
            },
          },
        },
        {
          tier: tierProPlus,
          price: 199.99,
          features: [
            '1 Calendar Year Enterprise High Street Access',
            'Unlimited Listings & Automated Circles',
            'Top Tier High Street Placement',
            'Unlimited Team Members & Locations',
            'Dedicated Account Manager & VIP Support',
          ],
          configuration: {
            quotas: {
              maxListings: -1,
              maxProducts: -1,
              maxServices: -1,
              maxActiveGames: -1,
              maxActiveCampaigns: -1,
              maxRewards: -1,
              maxTeamMembers: -1,
              monthlyPlaysAllowance: -1,
            },
            featureFlags: {
              priorityInSearch: true,
              advancedAnalytics: true,
              dedicatedSupport: true,
              allowCustomBranding: true,
              canScheduleCampaigns: true,
            },
          },
        },
      ],
    },
  ];

  for (const p of plans) {
    const plan = await prisma.plan.upsert({
      where: { slug: p.slug },
      create: {
        name: p.name,
        slug: p.slug,
        description: p.description,
        isActive: true,
      },
      update: {
        name: p.name,
        description: p.description,
        isActive: true,
      },
    });

    console.log(`\n  📦 Plan: "${plan.name}" (${plan.slug})`);

    for (const v of p.variants) {
      let variant = await prisma.planVariant.findFirst({
        where: {
          planId: plan.id,
          tierLevelId: v.tier.id,
        },
      });

      if (!variant) {
        variant = await prisma.planVariant.create({
          data: {
            planId: plan.id,
            tierLevelId: v.tier.id,
            features: v.features,
            configuration: v.configuration,
            isActive: true,
          },
        });
      } else {
        variant = await prisma.planVariant.update({
          where: { id: variant.id },
          data: {
            features: v.features,
            configuration: v.configuration,
            isActive: true,
          },
        });
      }

      // Check active price
      const existingPrice = await prisma.planPrice.findFirst({
        where: {
          planVariantId: variant.id,
          isActive: true,
        },
      });

      if (!existingPrice) {
        await prisma.planPrice.create({
          data: {
            planVariantId: variant.id,
            amount: v.price,
            currency: 'GBP',
            isActive: true,
            effectiveFrom: new Date(),
          },
        });
      } else {
        await prisma.planPrice.update({
          where: { id: existingPrice.id },
          data: {
            amount: v.price,
            currency: 'GBP',
          },
        });
      }

      console.log(`     ↳ Variant [${v.tier.name}]: £${v.price.toFixed(2)} (${v.tier.durationDays ? `${v.tier.durationDays}d` : '1 Year'})`);
    }
  }

  console.log('\n✅ Database successfully seeded with unified membership plans!\n');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
