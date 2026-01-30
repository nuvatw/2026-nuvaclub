'use client';

import { useMemo, useCallback, useEffect, useState } from 'react';
import { useAuth, getEffectiveUserId } from '@/features/auth/components/AuthProvider';
import type { DuoTier, DuplicateCheckResult, MonthConflict, DuoMonthPass, DuoTransaction, MonthlyMatchStatus } from '../types';
import {
  DUO_TIER_CONFIG,
  DUO_TIER_RANK,
  calculateUpgradePrice,
} from '../types';
import {
  getCurrentMonth,
  getNextMonths,
  isMonthPast,
  addMonths,
} from '../utils/month-utils';

export interface DuoMonthPassWithMeta extends DuoMonthPass {
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
  purchasedAt?: Date | string;
  refundedAt?: Date | string;
}

export function useDuoMonthPasses() {
  const { currentAccountId } = useAuth();
  const [data, setData] = useState<{
    passes: DuoMonthPass[],
    transactions: DuoTransaction[],
    matchStatuses: MonthlyMatchStatus[]
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  const effectiveUserId = useMemo(() => {
    return getEffectiveUserId(currentAccountId);
  }, [currentAccountId]);

  useEffect(() => {
    if (!effectiveUserId) {
      setLoading(false);
      return;
    }
    let mounted = true;
    fetch(`/api/bff/duo/passes?userId=${effectiveUserId}`)
      .then(res => res.json())
      .then(d => {
        if (mounted && !d.error) {
          setData(d);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        if (mounted) setLoading(false);
      });
    return () => { mounted = false; };
  }, [effectiveUserId, refreshKey]);

  const passes = data?.passes || [];
  const transactions = data?.transactions || [];

  const activePasses = useMemo(() => {
    return passes.filter((p) => p.status === 'active');
  }, [passes]);

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

  const getPassForMonth = useCallback(
    (month: string): DuoMonthPass | undefined => {
      return passes.find((p) => p.month === month && p.status === 'active');
    },
    [passes]
  );

  const getAnyPassForMonth = useCallback(
    (month: string): DuoMonthPass | undefined => {
      return (
        passes.find((p) => p.month === month && p.status === 'active') ||
        passes.find((p) => p.month === month && p.status === 'refunded') ||
        passes.find((p) => p.month === month && p.status === 'upgraded')
      );
    },
    [passes]
  );

  const availableMonths = useMemo(() => {
    const months = getNextMonths(13);
    return months.slice(1);
  }, []);

  const ownedMonths = useMemo(() => {
    return activePasses.map((p) => p.month);
  }, [activePasses]);

  const timelineMonths = useMemo((): TimelineMonth[] => {
    const currentMonth = getCurrentMonth();
    const months: TimelineMonth[] = [];

    for (let i = -24; i <= 12; i++) {
      const month = addMonths(currentMonth, i);
      const pass = getAnyPassForMonth(month);

      let refundedAt: Date | undefined;
      if (pass?.status === 'refunded') {
        const refundTx = transactions.find(
          (tx) => tx.month === month && tx.type === 'refund'
        );
        refundedAt = refundTx?.createdAt ? new Date(refundTx.createdAt) : undefined;
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

  const checkDuplicatePurchase = useCallback(
    (selectedMonths: string[], newTier: DuoTier): DuplicateCheckResult => {
      const conflicts: MonthConflict[] = [];
      const validMonths: string[] = [];
      const currentMonth = getCurrentMonth();

      for (const month of selectedMonths) {
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

  const createPasses = useCallback(
    async (
      months: string[],
      tier: DuoTier,
      orderId?: string
    ): Promise<DuoMonthPass[]> => {
      const res = await fetch('/api/bff/duo/purchase', {
        method: 'POST',
        body: JSON.stringify({ months, tier, orderId })
      });
      const result = await res.json();
      setRefreshKey(k => k + 1);
      return result.passes || [];
    },
    []
  );

  const incrementCompanionCount = useCallback(
    async (month: string): Promise<boolean> => {
      const res = await fetch('/api/bff/duo/companion/increment', {
        method: 'POST',
        body: JSON.stringify({ month })
      });
      setRefreshKey(k => k + 1);
      return res.ok;
    },
    []
  );

  const processAutoRefunds = useCallback(async () => { }, []);

  const setMatchStatus = useCallback(
    async (month: string, matched: boolean, matchedWithUserId?: string): Promise<void> => {
      await fetch('/api/bff/duo/match', {
        method: 'POST',
        body: JSON.stringify({ month, matched, matchedWithUserId })
      });
      setRefreshKey(k => k + 1);
    },
    []
  );

  const getHighestTierForMonth = useCallback(
    (month: string): DuoTier | null => {
      const pass = getPassForMonth(month);
      return pass?.tier ?? null;
    },
    [getPassForMonth]
  );

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
    loading
  };
}
