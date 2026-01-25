import type { MockDB } from '../core/MockDB';
import type { DuoMonthPassStatus, DuoTicketTier } from '../schema/user.schema';

/**
 * Seed Duo Pass data for 10 users
 *
 * Creates comprehensive Duo Pass history spanning 2+ years,
 * with varied patterns including:
 * - No purchases (user-13, user-16, user-19, user-20)
 * - Active Go passes
 * - Active Run passes
 * - Active Fly passes
 * - Go→Run upgrades
 * - Refunded passes (matched=false before month start)
 * - Long purchase history (12+ months)
 * - Sporadic purchases
 *
 * Test Account to User ID Mapping:
 * - test-explorer-duo-nunu-nx → user-1 (Alex Chen)
 * - test-explorer-duo-nunu-1 → user-2 (Sarah Lin)
 * - test-traveler-solo-nunu-n5 → user-3 (Mike Wang)
 * - test-explorer-duo-nunu-2 → user-4 (Emily Huang)
 * - test-explorer-solo-1 → user-5 (Kevin Lee)
 * - test-traveler-solo-has-nunu → user-6 (Jessica Wu)
 * - test-explorer-solo-2 → user-7 (David Zhang)
 * - test-duo-go-nunu-n4 → user-8 (Lisa Chen)
 * - test-duo-fly-n3 → user-9 (Tom Huang)
 * - test-duo-run-nunu-n2 → user-10 (Amy Lin)
 */

// Helper to format month
function formatMonth(year: number, month: number): string {
  return `${year}-${String(month).padStart(2, '0')}`;
}

// Helper to add months to a base date
function addMonthsToDate(year: number, month: number, add: number): { year: number; month: number } {
  const totalMonths = year * 12 + (month - 1) + add;
  return {
    year: Math.floor(totalMonths / 12),
    month: (totalMonths % 12) + 1,
  };
}

// Get month string relative to now
function getRelativeMonth(offset: number): string {
  const now = new Date();
  const base = addMonthsToDate(now.getFullYear(), now.getMonth() + 1, offset);
  return formatMonth(base.year, base.month);
}

// Generate a purchase date for a given month offset
function getPurchaseDate(offset: number, daysBeforeMonth: number = 15): Date {
  const now = new Date();
  const result = new Date(now);
  result.setMonth(result.getMonth() + offset - 1);
  result.setDate(Math.max(1, 28 - daysBeforeMonth));
  return result;
}

export async function seedDuo(db: MockDB): Promise<void> {
  const now = new Date();

  // Track IDs to avoid conflicts
  let passIdCounter = 1;
  let txIdCounter = 1;
  let matchIdCounter = 1;

  const generatePassId = () => `dmp_seed_${passIdCounter++}`;
  const generateTxId = () => `dtx_seed_${txIdCounter++}`;
  const generateMatchId = () => `dms_seed_${matchIdCounter++}`;

  // Tier configurations for pricing
  const TIER_CONFIG: Record<DuoTicketTier, { price: number; maxCompanions: number }> = {
    go: { price: 990, maxCompanions: 1 },
    run: { price: 2490, maxCompanions: 5 },
    fly: { price: 4990, maxCompanions: 999 },
  };

  // Helper to create a pass with transaction and match status
  function createPass(
    userId: string,
    monthOffset: number,
    tier: DuoTicketTier,
    status: DuoMonthPassStatus,
    matched: boolean,
    matchedWithUserId?: string,
    currentCompanions: number = 0,
  ) {
    const month = getRelativeMonth(monthOffset);
    const passId = generatePassId();
    const purchaseDate = getPurchaseDate(monthOffset);

    db.duoMonthPasses.create({
      id: passId,
      userId,
      month,
      tier,
      status,
      maxCompanions: TIER_CONFIG[tier].maxCompanions,
      currentCompanions,
      purchasedAt: purchaseDate,
      createdAt: purchaseDate,
      updatedAt: now,
    });

    db.duoTransactions.create({
      id: generateTxId(),
      userId,
      passId,
      type: 'charge',
      amount: TIER_CONFIG[tier].price,
      currency: 'TWD',
      month,
      tier,
      createdAt: purchaseDate,
    });

    if (status === 'refunded') {
      const refundDate = new Date(purchaseDate);
      refundDate.setMonth(refundDate.getMonth() + 1);
      refundDate.setDate(1);
      db.duoTransactions.create({
        id: generateTxId(),
        userId,
        passId,
        type: 'refund',
        amount: TIER_CONFIG[tier].price,
        currency: 'TWD',
        month,
        tier,
        reason: 'Automatic refund - no match before month start',
        createdAt: refundDate,
      });
    }

    db.monthlyMatchStatus.create({
      id: generateMatchId(),
      userId,
      month,
      matched,
      matchedAt: matched ? purchaseDate : undefined,
      matchedWithUserId: matched ? matchedWithUserId : undefined,
      createdAt: purchaseDate,
      updatedAt: now,
    });

    return passId;
  }

  // ==========================================
  // USER 1 (Alex Chen) - Power user, long Go history
  // Pattern: Consistent Go user for 18+ months with 1 upgrade
  // Months: -18 to +3 (Go, with -6 upgraded to Run)
  // ==========================================
  for (let offset = -18; offset <= 3; offset++) {
    const isUpgradedMonth = offset === -6;
    if (isUpgradedMonth) {
      // Original Go pass (upgraded)
      const passId = generatePassId();
      const purchaseDate = getPurchaseDate(offset);
      db.duoMonthPasses.create({
        id: passId,
        userId: 'user-1',
        month: getRelativeMonth(offset),
        tier: 'go',
        status: 'upgraded',
        maxCompanions: TIER_CONFIG.go.maxCompanions,
        currentCompanions: 1,
        purchasedAt: purchaseDate,
        createdAt: purchaseDate,
        updatedAt: now,
      });
      db.duoTransactions.create({
        id: generateTxId(),
        userId: 'user-1',
        passId,
        type: 'charge',
        amount: TIER_CONFIG.go.price,
        currency: 'TWD',
        month: getRelativeMonth(offset),
        tier: 'go',
        createdAt: purchaseDate,
      });
      // Upgraded Run pass
      const upgradePassId = generatePassId();
      const upgradeDate = new Date(purchaseDate);
      upgradeDate.setDate(upgradeDate.getDate() + 10);
      db.duoMonthPasses.create({
        id: upgradePassId,
        userId: 'user-1',
        month: getRelativeMonth(offset),
        tier: 'run',
        status: 'active',
        maxCompanions: TIER_CONFIG.run.maxCompanions,
        currentCompanions: 2,
        purchasedAt: upgradeDate,
        createdAt: upgradeDate,
        updatedAt: now,
      });
      db.duoTransactions.create({
        id: generateTxId(),
        userId: 'user-1',
        passId: upgradePassId,
        type: 'upgrade_charge',
        amount: TIER_CONFIG.run.price - TIER_CONFIG.go.price,
        currency: 'TWD',
        month: getRelativeMonth(offset),
        tier: 'run',
        createdAt: upgradeDate,
      });
      db.monthlyMatchStatus.create({
        id: generateMatchId(),
        userId: 'user-1',
        month: getRelativeMonth(offset),
        matched: true,
        matchedAt: purchaseDate,
        matchedWithUserId: 'user-2',
        createdAt: purchaseDate,
        updatedAt: now,
      });
    } else {
      createPass('user-1', offset, 'go', 'active', offset <= 0, 'user-2', offset <= 0 ? 1 : 0);
    }
  }

  // ==========================================
  // USER 2 (Sarah Lin) - Nunu mentor, no Duo purchases
  // Pattern: As a Nunu, she doesn't need Duo passes herself
  // ==========================================
  // No Duo purchases for user-2 (she's a mentor)

  // ==========================================
  // USER 3 (Mike Wang) - Run user with long history
  // Pattern: Consistent Run user for 12+ months
  // Months: -12 to +2
  // ==========================================
  for (let offset = -12; offset <= 2; offset++) {
    createPass('user-3', offset, 'run', 'active', offset <= 0, 'user-18', offset <= 0 ? 3 : 0);
  }

  // ==========================================
  // USER 4 (Emily Huang) - Verified Nunu, occasional Duo use
  // Pattern: Sporadic Go purchases (every 3-4 months)
  // ==========================================
  const user4Months = [-15, -12, -8, -5, -2, 1];
  for (const offset of user4Months) {
    createPass('user-4', offset, 'go', 'active', offset <= 0, 'user-10', offset <= 0 ? 1 : 0);
  }

  // ==========================================
  // USER 5 (Kevin Lee) - Run user with recent activity
  // Pattern: Started 6 months ago, consistent Run
  // Months: -6 to +2
  // ==========================================
  for (let offset = -6; offset <= 2; offset++) {
    createPass('user-5', offset, 'run', 'active', offset <= 0, 'user-4', offset <= 0 ? 2 : 0);
  }

  // ==========================================
  // USER 6 (Jessica Wu) - Long-term Fly user (premium)
  // Pattern: Premium user for 10+ months with Fly
  // Months: -10 to +3
  // ==========================================
  for (let offset = -10; offset <= 3; offset++) {
    createPass('user-6', offset, 'fly', 'active', offset <= 0, 'user-10', offset <= 0 ? 5 : 0);
  }

  // ==========================================
  // USER 7 (David Zhang) - New user with refund scenario
  // Pattern: Just started, had one refund
  // Months: -1 (refunded), +1, +2
  // ==========================================
  createPass('user-7', -1, 'go', 'refunded', false);
  createPass('user-7', 1, 'go', 'active', false);
  createPass('user-7', 2, 'go', 'active', false);

  // ==========================================
  // USER 8 (Lisa Chen) - Run user with past + current
  // Pattern: Moderate usage, 8 months history
  // Months: -8 to 0
  // ==========================================
  for (let offset = -8; offset <= 0; offset++) {
    createPass('user-8', offset, 'run', 'active', true, 'user-14', 2);
  }

  // ==========================================
  // USER 9 (Tom Huang) - Sporadic Go user with long history
  // Pattern: Inconsistent, buys 2-3 months then skips
  // ==========================================
  const user9Months = [-20, -19, -16, -15, -14, -10, -9, -5, -4, 0, 2, 3];
  for (const offset of user9Months) {
    createPass('user-9', offset, 'go', 'active', offset <= 0, 'user-11', offset <= 0 ? 1 : 0);
  }

  // ==========================================
  // USER 10 (Amy Lin) - Master N2 Nunu, no Duo purchases
  // Pattern: As a high-level Nunu, she doesn't need Duo passes
  // ==========================================
  // No Duo purchases for user-10 (she's a master mentor)

  // ==========================================
  // USER 12 (Mia Huang) - Go→Run upgrade example
  // Pattern: Started with Go, upgraded some months to Run
  // Months: -4 to +3, with upgrades at -2 and -1
  // ==========================================
  for (let offset = -4; offset <= 3; offset++) {
    if (offset === -2 || offset === -1) {
      // Upgraded months
      const passId = generatePassId();
      const purchaseDate = getPurchaseDate(offset);
      db.duoMonthPasses.create({
        id: passId,
        userId: 'user-12',
        month: getRelativeMonth(offset),
        tier: 'go',
        status: 'upgraded',
        maxCompanions: TIER_CONFIG.go.maxCompanions,
        currentCompanions: 0,
        purchasedAt: purchaseDate,
        createdAt: purchaseDate,
        updatedAt: now,
      });
      db.duoTransactions.create({
        id: generateTxId(),
        userId: 'user-12',
        passId,
        type: 'charge',
        amount: TIER_CONFIG.go.price,
        currency: 'TWD',
        month: getRelativeMonth(offset),
        tier: 'go',
        createdAt: purchaseDate,
      });

      const upgradePassId = generatePassId();
      const upgradeDate = new Date(purchaseDate);
      upgradeDate.setDate(upgradeDate.getDate() + 5);
      db.duoMonthPasses.create({
        id: upgradePassId,
        userId: 'user-12',
        month: getRelativeMonth(offset),
        tier: 'run',
        status: 'active',
        maxCompanions: TIER_CONFIG.run.maxCompanions,
        currentCompanions: offset <= 0 ? 2 : 0,
        purchasedAt: upgradeDate,
        createdAt: upgradeDate,
        updatedAt: now,
      });
      db.duoTransactions.create({
        id: generateTxId(),
        userId: 'user-12',
        passId: upgradePassId,
        type: 'upgrade_charge',
        amount: TIER_CONFIG.run.price - TIER_CONFIG.go.price,
        currency: 'TWD',
        month: getRelativeMonth(offset),
        tier: 'run',
        createdAt: upgradeDate,
      });
      db.monthlyMatchStatus.create({
        id: generateMatchId(),
        userId: 'user-12',
        month: getRelativeMonth(offset),
        matched: offset <= 0,
        matchedAt: offset <= 0 ? purchaseDate : undefined,
        matchedWithUserId: offset <= 0 ? 'user-14' : undefined,
        createdAt: purchaseDate,
        updatedAt: now,
      });
    } else {
      createPass('user-12', offset, 'go', 'active', offset <= 0, 'user-14', offset <= 0 ? 1 : 0);
    }
  }

  // ==========================================
  // USER 15 (Noah Lin) - Go user with future purchases only
  // Pattern: Just bought for future months
  // Months: +1 to +4
  // ==========================================
  for (let offset = 1; offset <= 4; offset++) {
    createPass('user-15', offset, 'go', 'active', false);
  }

  // ==========================================
  // USER 17 (Zoe Wu) - Go user with 3 months
  // Pattern: New user, started recently
  // Months: -1, 0, +1, +2
  // ==========================================
  for (let offset = -1; offset <= 2; offset++) {
    createPass('user-17', offset, 'go', 'active', offset <= 0, 'user-18', offset <= 0 ? 1 : 0);
  }

  // Note: Users without Duo purchases (showing no history):
  // - user-2 (Sarah Lin) - Is a Nunu mentor
  // - user-10 (Amy Lin) - Is a master N2 Nunu mentor
  // - user-11, user-13, user-14, user-16, user-18, user-19, user-20 - Various non-Duo users
}
