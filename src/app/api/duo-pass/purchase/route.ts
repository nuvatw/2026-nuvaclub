import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import type { DuoTicketTier, DuoMonthPassStatus } from '@/lib/db/schema/user.schema';

/**
 * Purchase request body
 */
interface PurchaseRequest {
  userId: string;
  tier: DuoTicketTier;
  months: string[]; // Array of YYYY-MM strings
  // Optional: existing entitlements for validation (sent from client)
  existingEntitlements?: Array<{
    month: string;
    tier: DuoTicketTier;
  }>;
}

/**
 * Tier pricing configuration (must match client-side)
 */
const TIER_PRICES: Record<DuoTicketTier, number> = {
  go: 990,
  run: 2490,
  fly: 4990,
};

const TIER_RANK: Record<DuoTicketTier, number> = {
  go: 1,
  run: 2,
  fly: 3,
};

const MAX_COMPANIONS: Record<DuoTicketTier, number> = {
  go: 1,
  run: 5,
  fly: 999,
};

/**
 * POST /api/duo-pass/purchase
 *
 * Validates and processes a duo pass purchase.
 * Returns the computed pricing and validation result.
 *
 * Business rules:
 * 1. No duplicate purchases (same tier, same month)
 * 2. No downgrades (cannot buy Go if already have Run for that month)
 * 3. Upgrades allowed with discount (pay difference)
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as PurchaseRequest;
    const { userId, tier, months, existingEntitlements = [] } = body;

    // Validate required fields
    if (!userId || !tier || !months || months.length === 0) {
      return NextResponse.json(
        { error: 'userId, tier, and months are required' },
        { status: 400 }
      );
    }

    // Validate tier
    if (!TIER_PRICES[tier]) {
      return NextResponse.json(
        { error: `Invalid tier: ${tier}` },
        { status: 400 }
      );
    }

    // Validate month format
    const monthRegex = /^\d{4}-(0[1-9]|1[0-2])$/;
    for (const month of months) {
      if (!monthRegex.test(month)) {
        return NextResponse.json(
          { error: `Invalid month format: ${month}. Expected YYYY-MM` },
          { status: 400 }
        );
      }
    }

    // Build entitlement map from client-provided data
    const entitlementMap = new Map<string, DuoTicketTier>();
    for (const ent of existingEntitlements) {
      entitlementMap.set(ent.month, ent.tier);
    }

    // Validate each month and compute pricing
    const newPurchases: string[] = [];
    const upgrades: Array<{ month: string; fromTier: DuoTicketTier }> = [];
    const blocked: Array<{ month: string; reason: string }> = [];

    for (const month of months) {
      const existingTier = entitlementMap.get(month);

      if (!existingTier) {
        // No existing entitlement - new purchase
        newPurchases.push(month);
      } else {
        const existingRank = TIER_RANK[existingTier];
        const newRank = TIER_RANK[tier];

        if (newRank === existingRank) {
          // Duplicate - same tier
          blocked.push({
            month,
            reason: `Already purchased ${existingTier.toUpperCase()} for this month`,
          });
        } else if (newRank < existingRank) {
          // Downgrade attempt
          blocked.push({
            month,
            reason: `Cannot downgrade from ${existingTier.toUpperCase()} to ${tier.toUpperCase()}`,
          });
        } else {
          // Upgrade
          upgrades.push({ month, fromTier: existingTier });
        }
      }
    }

    // If any blocked months, return validation error
    if (blocked.length > 0 && newPurchases.length === 0 && upgrades.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'All selected months are blocked',
          blocked,
        },
        { status: 400 }
      );
    }

    // Compute pricing
    const tierPrice = TIER_PRICES[tier];
    const newPurchaseCount = newPurchases.length;
    const newPurchaseTotal = newPurchaseCount * tierPrice;

    // Compute upgrade pricing (pay the difference)
    let upgradeTotal = 0;
    const upgradeDetails: Array<{
      month: string;
      fromTier: DuoTicketTier;
      toTier: DuoTicketTier;
      price: number;
    }> = [];

    for (const upgrade of upgrades) {
      const fromPrice = TIER_PRICES[upgrade.fromTier];
      const toPrice = TIER_PRICES[tier];
      const priceDifference = toPrice - fromPrice;

      upgradeTotal += priceDifference;
      upgradeDetails.push({
        month: upgrade.month,
        fromTier: upgrade.fromTier,
        toTier: tier,
        price: priceDifference,
      });
    }

    const totalPrice = newPurchaseTotal + upgradeTotal;

    // Generate pass records to be created
    const now = new Date().toISOString();
    const maxCompanions = MAX_COMPANIONS[tier];

    const passesToCreate = [
      ...newPurchases.map((month) => ({
        id: `dmp_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
        userId,
        month,
        tier,
        status: 'active' as DuoMonthPassStatus,
        maxCompanions,
        currentCompanions: 0,
        isUpgrade: false,
        purchasedAt: now,
        createdAt: now,
        updatedAt: now,
      })),
      ...upgradeDetails.map((upgrade) => ({
        id: `dmp_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
        userId,
        month: upgrade.month,
        tier,
        status: 'active' as DuoMonthPassStatus,
        maxCompanions,
        currentCompanions: 0,
        isUpgrade: true,
        upgradedFrom: upgrade.fromTier,
        purchasedAt: now,
        createdAt: now,
        updatedAt: now,
      })),
    ];

    return NextResponse.json({
      success: true,
      validation: {
        newPurchases,
        upgrades: upgradeDetails,
        blocked,
      },
      pricing: {
        tierPrice,
        newPurchaseCount,
        newPurchaseTotal,
        upgradeCount: upgrades.length,
        upgradeTotal,
        totalPrice,
      },
      passesToCreate,
    });
  } catch (error) {
    console.error('Error processing purchase:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
