'use client';

import { useMemo, useCallback, useEffect, useState } from 'react';
import { useDBContext } from '@/lib/db';
import { useAuth, getEffectiveUserId } from '@/features/auth/components/AuthProvider';
import type {
  DuoMonthPassRecord,
  DuoTransactionRecord,
  MonthlyMatchStatusRecord,
} from '@/infra/mock/schema/user.schema';
import type { DuoTier, DuplicateCheckResult, MonthConflict } from '../types';
import {
  DUO_TIER_CONFIG,
  DUO_TIER_RANK,
  calculateUpgradePrice,
} from '../types';
import {
  getCurrentMonth,
  getNextMonths,
  isMonthPast,
  isMonthCurrent,
  addMonths,
  dateToMonth,
} from '../utils/month-utils';

export interface DuoMonthPassWithMeta extends DuoMonthPassRecord {
  isExpired: boolean;
  isCurrent: boolean;
  slotsAvailable: number;
  tierConfig: (typeof DUO_TIER_CONFIG)[DuoTier];
}

export interface TimelineMonth {
  month: string;
  tier: DuoTier | null;
  status: 'none' | 'active' | 'expired' | 'upgraded' | 'refunded';
  isCurrentMonth: boolean;
  isPast: boolean;
  /** When the pass was purchased (if owned) */
  purchasedAt?: Date;
  /** When the pass was refunded (if refunded) */
  refundedAt?: Date;
}

export function useDuoMonthPasses() {
  const { db, isReady } = useDBContext();
  const { user, currentAccountId } = useAuth();
  const [refreshKey, setRefreshKey] = useState(0);

  // Get the effective user ID for database lookups
  // This maps test account IDs (e.g., 'test-explorer-solo-1') to user IDs (e.g., 'user-5')
  const effectiveUserId = useMemo(() => {
    return getEffectiveUserId(currentAccountId);
  }, [currentAccountId]);

  // Process auto-refunds on mount and when data changes
  const processAutoRefunds = useCallback(async () => {
    if (!db || !effectiveUserId) return;

    const now = new Date();
    const currentMonth = getCurrentMonth();

    // Get all active passes for this user
    const allPasses = db.duoMonthPasses.findMany({
      where: { userId: effectiveUserId },
    });

    let hasChanges = false;

    for (const pass of allPasses) {
      // Only process active passes for months that have started (current or past)
      if (pass.status !== 'active') continue;
      if (pass.month > currentMonth) continue; // Future month, skip

      // Check if this month has started (is current or past)
      const isMonthStarted = pass.month <= currentMonth;
      if (!isMonthStarted) continue;

      // Check match status for this month
      const matchStatus = db.monthlyMatchStatus.findFirst({
        where: { userId: effectiveUserId, month: pass.month },
      });

      // If no match status exists or matched is false, process refund
      if (!matchStatus || !matchStatus.matched) {
        // Mark pass as refunded
        db.duoMonthPasses.update(pass.id, {
          status: 'refunded',
          updatedAt: now,
        });

        // Check if refund transaction already exists
        const existingRefund = db.duoTransactions.findFirst({
          where: {
            userId: effectiveUserId,
            passId: pass.id,
            type: 'refund',
          },
        });

        if (!existingRefund) {
          // Create refund transaction
          const tierConfig = DUO_TIER_CONFIG[pass.tier];
          db.duoTransactions.create({
            id: `dtx_refund_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
            userId: effectiveUserId,
            passId: pass.id,
            type: 'refund',
            amount: tierConfig.price,
            currency: 'TWD',
            month: pass.month,
            tier: pass.tier,
            reason: 'Automatic refund - no match before month start',
            createdAt: now,
          });
        }

        hasChanges = true;
      }
    }

    if (hasChanges) {
      await db.persist();
      setRefreshKey((k) => k + 1);
    }
  }, [db, effectiveUserId]);

  // Process auto-refunds on mount
  useEffect(() => {
    if (isReady && db && effectiveUserId) {
      processAutoRefunds();
    }
  }, [isReady, db, effectiveUserId, processAutoRefunds]);

  // Get all passes for the current user
  const passes = useMemo(() => {
    if (!isReady || !db || !effectiveUserId) return [];

    const userPasses = db.duoMonthPasses.findMany({
      where: { userId: effectiveUserId },
    });

    // Sort by month
    return userPasses.sort((a, b) => a.month.localeCompare(b.month));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [db, isReady, effectiveUserId, refreshKey]);

  // Get all transactions for the current user
  const transactions = useMemo(() => {
    if (!isReady || !db || !effectiveUserId) return [];

    const userTxs = db.duoTransactions.findMany({
      where: { userId: effectiveUserId },
    });

    // Sort by date descending
    return userTxs.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [db, isReady, effectiveUserId, refreshKey]);

  // Get active passes (not expired, not refunded, not upgraded)
  const activePasses = useMemo(() => {
    return passes.filter((p) => p.status === 'active');
  }, [passes]);

  // Get passes with metadata for display
  const passesWithMeta = useMemo((): DuoMonthPassWithMeta[] => {
    const currentMonth = getCurrentMonth();
    return passes.map((p) => ({
      ...p,
      isExpired: p.status === 'expired' || (p.status === 'active' && isMonthPast(p.month)),
      isCurrent: p.month === currentMonth,
      slotsAvailable: Math.max(0, p.maxCompanions - p.currentCompanions),
      tierConfig: DUO_TIER_CONFIG[p.tier],
    }));
  }, [passes]);

  // Get pass for a specific month (active only)
  const getPassForMonth = useCallback(
    (month: string): DuoMonthPassRecord | undefined => {
      return passes.find((p) => p.month === month && p.status === 'active');
    },
    [passes]
  );

  // Get any pass for a month (including refunded/upgraded for display)
  const getAnyPassForMonth = useCallback(
    (month: string): DuoMonthPassRecord | undefined => {
      // Prefer active, then refunded, then upgraded
      return (
        passes.find((p) => p.month === month && p.status === 'active') ||
        passes.find((p) => p.month === month && p.status === 'refunded') ||
        passes.find((p) => p.month === month && p.status === 'upgraded')
      );
    },
    [passes]
  );

  // Get available months (starting from NEXT month, 12 months)
  const availableMonths = useMemo(() => {
    const months = getNextMonths(13); // Get current + 12 more
    return months.slice(1); // Skip current month - can only buy next month onward
  }, []);

  // Get months that user has active passes for
  const ownedMonths = useMemo(() => {
    return activePasses.map((p) => p.month);
  }, [activePasses]);

  // Get timeline months for display (-24 to +12 months from now)
  // This provides 2+ years of history for users to review
  const timelineMonths = useMemo((): TimelineMonth[] => {
    const currentMonth = getCurrentMonth();
    const months: TimelineMonth[] = [];

    // Generate 37 months: -24 to +12 (2 years back, 1 year forward)
    for (let i = -24; i <= 12; i++) {
      const month = addMonths(currentMonth, i);
      const pass = getAnyPassForMonth(month);

      // Find refund transaction if refunded
      let refundedAt: Date | undefined;
      if (pass?.status === 'refunded') {
        const refundTx = transactions.find(
          (tx) => tx.month === month && tx.type === 'refund'
        );
        refundedAt = refundTx?.createdAt;
      }

      months.push({
        month,
        tier: pass?.tier ?? null,
        status: pass?.status ?? 'none',
        isCurrentMonth: month === currentMonth,
        isPast: isMonthPast(month),
        purchasedAt: pass?.purchasedAt,
        refundedAt,
      });
    }

    return months;
  }, [getAnyPassForMonth, transactions]);

  // Check for duplicate purchases
  const checkDuplicatePurchase = useCallback(
    (selectedMonths: string[], newTier: DuoTier): DuplicateCheckResult => {
      const conflicts: MonthConflict[] = [];
      const validMonths: string[] = [];
      const currentMonth = getCurrentMonth();

      for (const month of selectedMonths) {
        // Enforce "next month only" rule
        if (month <= currentMonth) {
          conflicts.push({
            month,
            existingTier: newTier,
            action: 'already_owned_same_or_higher',
          });
          continue;
        }

        const existing = getPassForMonth(month);

        if (existing) {
          const existingRank = DUO_TIER_RANK[existing.tier];
          const newRank = DUO_TIER_RANK[newTier];

          if (newRank <= existingRank) {
            conflicts.push({
              month,
              existingTier: existing.tier,
              action: 'already_owned_same_or_higher',
            });
          } else {
            conflicts.push({
              month,
              existingTier: existing.tier,
              newTier,
              action: 'upgrade_available',
              priceDifference: calculateUpgradePrice(existing.tier, newTier),
            });
          }
        } else {
          validMonths.push(month);
        }
      }

      return {
        conflicts,
        canProceed:
          validMonths.length > 0 ||
          conflicts.some((c) => c.action === 'upgrade_available'),
        validMonths,
      };
    },
    [getPassForMonth]
  );

  // Create new passes with transactions (direct purchase)
  const createPasses = useCallback(
    async (
      months: string[],
      tier: DuoTier,
      orderId?: string
    ): Promise<DuoMonthPassRecord[]> => {
      if (!db || !effectiveUserId) return [];

      const now = new Date();
      const tierConfig = DUO_TIER_CONFIG[tier];
      const newPasses: DuoMonthPassRecord[] = [];
      const currentMonth = getCurrentMonth();

      // Filter out invalid months (current or past)
      const validMonths = months.filter((m) => m > currentMonth);

      for (const month of validMonths) {
        // Check if upgrading existing pass
        const existing = getPassForMonth(month);

        if (existing && DUO_TIER_RANK[tier] > DUO_TIER_RANK[existing.tier]) {
          // Mark existing as upgraded
          db.duoMonthPasses.update(existing.id, {
            status: 'upgraded',
            updatedAt: now,
          });
        }

        const passId = `dmp_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
        const newPass: DuoMonthPassRecord = {
          id: passId,
          userId: effectiveUserId,
          month,
          tier,
          status: 'active',
          orderId,
          maxCompanions: tierConfig.maxCompanions,
          currentCompanions: existing?.currentCompanions ?? 0,
          purchasedAt: now,
          createdAt: now,
          updatedAt: now,
        };

        // Update existing pass reference
        if (existing) {
          db.duoMonthPasses.update(existing.id, {
            upgradedToId: newPass.id,
          });

          // Create upgrade charge transaction (difference)
          const upgradeCost = calculateUpgradePrice(existing.tier, tier);
          db.duoTransactions.create({
            id: `dtx_upgrade_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
            userId: effectiveUserId,
            passId,
            type: 'upgrade_charge',
            amount: upgradeCost,
            currency: 'TWD',
            month,
            tier,
            createdAt: now,
          });
        } else {
          // Create new charge transaction
          db.duoTransactions.create({
            id: `dtx_charge_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
            userId: effectiveUserId,
            passId,
            type: 'charge',
            amount: tierConfig.price,
            currency: 'TWD',
            month,
            tier,
            createdAt: now,
          });
        }

        // Create match status entry (default to not matched)
        const existingMatchStatus = db.monthlyMatchStatus.findFirst({
          where: { userId: effectiveUserId, month },
        });

        if (!existingMatchStatus) {
          db.monthlyMatchStatus.create({
            id: `dms_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
            userId: effectiveUserId,
            month,
            matched: false,
            createdAt: now,
            updatedAt: now,
          });
        }

        db.duoMonthPasses.create(newPass);
        newPasses.push(newPass);
      }

      await db.persist();
      setRefreshKey((k) => k + 1);
      return newPasses;
    },
    [db, effectiveUserId, getPassForMonth]
  );

  // Increment companion count for a month
  const incrementCompanionCount = useCallback(
    async (month: string): Promise<boolean> => {
      if (!db) return false;

      const pass = getPassForMonth(month);
      if (!pass) return false;

      // Check if slots available
      if (pass.currentCompanions >= pass.maxCompanions) {
        return false;
      }

      db.duoMonthPasses.update(pass.id, {
        currentCompanions: pass.currentCompanions + 1,
        updatedAt: new Date(),
      });

      await db.persist();
      setRefreshKey((k) => k + 1);
      return true;
    },
    [db, getPassForMonth]
  );

  // Set match status for a month (for testing/dev)
  const setMatchStatus = useCallback(
    async (month: string, matched: boolean, matchedWithUserId?: string): Promise<void> => {
      if (!db || !effectiveUserId) return;

      const now = new Date();
      const existing = db.monthlyMatchStatus.findFirst({
        where: { userId: effectiveUserId, month },
      });

      if (existing) {
        db.monthlyMatchStatus.update(existing.id, {
          matched,
          matchedAt: matched ? now : undefined,
          matchedWithUserId: matched ? matchedWithUserId : undefined,
          updatedAt: now,
        });
      } else {
        db.monthlyMatchStatus.create({
          id: `dms_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
          userId: effectiveUserId,
          month,
          matched,
          matchedAt: matched ? now : undefined,
          matchedWithUserId: matched ? matchedWithUserId : undefined,
          createdAt: now,
          updatedAt: now,
        });
      }

      await db.persist();

      // Re-process refunds in case status changed
      await processAutoRefunds();
    },
    [db, effectiveUserId, processAutoRefunds]
  );

  // Get highest tier for a specific month
  const getHighestTierForMonth = useCallback(
    (month: string): DuoTier | null => {
      const pass = getPassForMonth(month);
      return pass?.tier ?? null;
    },
    [getPassForMonth]
  );

  // Check if user can access a companion type for a specific month
  const canAccessCompanionForMonth = useCallback(
    (
      month: string,
      companionType: 'nunu' | 'certified-nunu' | 'shangzhe'
    ): boolean => {
      const pass = getPassForMonth(month);
      if (!pass) return false;

      const tierRank = DUO_TIER_RANK[pass.tier];
      const companionRank: Record<string, number> = {
        nunu: 1,
        'certified-nunu': 2,
        shangzhe: 3,
      };

      return tierRank >= companionRank[companionType];
    },
    [getPassForMonth]
  );

  // Get months where user can invite a specific companion type
  const getMonthsForCompanionType = useCallback(
    (companionType: 'nunu' | 'certified-nunu' | 'shangzhe'): string[] => {
      const companionRank: Record<string, number> = {
        nunu: 1,
        'certified-nunu': 2,
        shangzhe: 3,
      };
      const requiredRank = companionRank[companionType];

      return activePasses
        .filter((p) => {
          const tierRank = DUO_TIER_RANK[p.tier];
          const hasSlots = p.currentCompanions < p.maxCompanions;
          return tierRank >= requiredRank && hasSlots;
        })
        .map((p) => p.month);
    },
    [activePasses]
  );

  // Refresh data (force re-fetch)
  const refresh = useCallback(() => {
    setRefreshKey((k) => k + 1);
  }, []);

  return {
    passes,
    activePasses,
    passesWithMeta,
    transactions,
    timelineMonths,
    availableMonths,
    ownedMonths,
    getPassForMonth,
    getAnyPassForMonth,
    checkDuplicatePurchase,
    createPasses,
    incrementCompanionCount,
    setMatchStatus,
    getHighestTierForMonth,
    canAccessCompanionForMonth,
    getMonthsForCompanionType,
    processAutoRefunds,
    refresh,
  };
}
