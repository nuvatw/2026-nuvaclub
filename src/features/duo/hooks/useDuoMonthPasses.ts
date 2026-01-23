'use client';

import { useMemo, useCallback } from 'react';
import { useDBContext } from '@/lib/db';
import { useAuth } from '@/features/auth/components/AuthProvider';
import type { DuoMonthPassRecord } from '@/lib/db/schema/user.schema';
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
} from '../utils/month-utils';

export interface DuoMonthPassWithMeta extends DuoMonthPassRecord {
  isExpired: boolean;
  isCurrent: boolean;
  slotsAvailable: number;
  tierConfig: (typeof DUO_TIER_CONFIG)[DuoTier];
}

export function useDuoMonthPasses() {
  const { db, isReady } = useDBContext();
  const { user } = useAuth();

  // Get all passes for the current user
  const passes = useMemo(() => {
    if (!isReady || !db || !user) return [];

    const userPasses = db.duoMonthPasses.findMany({
      where: { userId: user.id },
    });

    // Sort by month
    return userPasses.sort((a, b) => a.month.localeCompare(b.month));
  }, [db, isReady, user]);

  // Get active passes (not expired, not refunded, for current or future months)
  const activePasses = useMemo(() => {
    const currentMonth = getCurrentMonth();
    return passes.filter(
      (p) =>
        p.status === 'active' &&
        p.month >= currentMonth
    );
  }, [passes]);

  // Get passes with metadata for display
  const passesWithMeta = useMemo((): DuoMonthPassWithMeta[] => {
    const currentMonth = getCurrentMonth();
    return passes.map((p) => ({
      ...p,
      isExpired: p.status === 'expired' || isMonthPast(p.month),
      isCurrent: p.month === currentMonth,
      slotsAvailable: Math.max(0, p.maxCompanions - p.currentCompanions),
      tierConfig: DUO_TIER_CONFIG[p.tier],
    }));
  }, [passes]);

  // Get pass for a specific month
  const getPassForMonth = useCallback(
    (month: string): DuoMonthPassRecord | undefined => {
      return passes.find((p) => p.month === month && p.status === 'active');
    },
    [passes]
  );

  // Get available months (next 12 months)
  const availableMonths = useMemo(() => {
    return getNextMonths(12);
  }, []);

  // Get months that user has active passes for
  const ownedMonths = useMemo(() => {
    return activePasses.map((p) => p.month);
  }, [activePasses]);

  // Check for duplicate purchases
  const checkDuplicatePurchase = useCallback(
    (selectedMonths: string[], newTier: DuoTier): DuplicateCheckResult => {
      const conflicts: MonthConflict[] = [];
      const validMonths: string[] = [];

      for (const month of selectedMonths) {
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
        canProceed: validMonths.length > 0 || conflicts.some(c => c.action === 'upgrade_available'),
        validMonths,
      };
    },
    [getPassForMonth]
  );

  // Create new passes (called after purchase)
  const createPasses = useCallback(
    async (
      months: string[],
      tier: DuoTier,
      orderId?: string
    ): Promise<DuoMonthPassRecord[]> => {
      if (!db || !user) return [];

      const now = new Date();
      const tierConfig = DUO_TIER_CONFIG[tier];
      const newPasses: DuoMonthPassRecord[] = [];

      for (const month of months) {
        // Check if upgrading existing pass
        const existing = getPassForMonth(month);

        if (existing && DUO_TIER_RANK[tier] > DUO_TIER_RANK[existing.tier]) {
          // Mark existing as upgraded
          db.duoMonthPasses.update(existing.id, {
            status: 'upgraded',
            updatedAt: now,
          });
        }

        const newPass: DuoMonthPassRecord = {
          id: `dmp_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
          userId: user.id,
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
        }

        db.duoMonthPasses.create(newPass);
        newPasses.push(newPass);
      }

      await db.persist();
      return newPasses;
    },
    [db, user, getPassForMonth]
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
      return true;
    },
    [db, getPassForMonth]
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

  return {
    passes,
    activePasses,
    passesWithMeta,
    availableMonths,
    ownedMonths,
    getPassForMonth,
    checkDuplicatePurchase,
    createPasses,
    incrementCompanionCount,
    getHighestTierForMonth,
    canAccessCompanionForMonth,
    getMonthsForCompanionType,
  };
}
