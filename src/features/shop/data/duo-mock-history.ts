/**
 * Mock Duo Pass Purchase History
 *
 * This file provides mock purchase history data for demonstration.
 * In production, this would come from the database via useDuoMonthPasses hook.
 *
 * Example purchases to demonstrate:
 * - Multi-month Go pass (green bar spanning Mar-Apr 2026)
 * - Single-month Fly pass (red dot on May 2026)
 * - Multi-month Run pass (yellow bar)
 */

import type { DuoTier } from '@/features/duo/types';

/**
 * Legacy interface for purchase records (kept for backward compatibility)
 * New code should use the TimelineMonth type from useDuoMonthPasses hook
 */
export interface DuoPurchaseRecord {
  id: string;
  tier: DuoTier;
  startMonth: string;
  durationMonths: number;
}

/**
 * Sample purchase history for demonstration
 *
 * These represent purchases a user might have made:
 * - Alex Chen (user-1): Mixed purchases showing all tiers
 * - Jessica Wu (user-6): Long-term Fly commitment
 * - Lisa Chen (user-8): Incremental Go purchases
 */

// User 1 (Alex Chen) - Mixed purchases showing all tiers
export const MOCK_PURCHASES_USER_1: DuoPurchaseRecord[] = [
  {
    id: 'purchase-1-1',
    tier: 'go',
    startMonth: '2026-02',
    durationMonths: 2, // Feb-Mar 2026 (green bar)
  },
  {
    id: 'purchase-1-2',
    tier: 'fly',
    startMonth: '2026-05',
    durationMonths: 1, // May 2026 only (red dot)
  },
  {
    id: 'purchase-1-3',
    tier: 'run',
    startMonth: '2026-07',
    durationMonths: 3, // Jul-Sep 2026 (yellow bar)
  },
];

// User 6 (Jessica Wu) - Long-term Fly user
export const MOCK_PURCHASES_USER_6: DuoPurchaseRecord[] = [
  {
    id: 'purchase-6-1',
    tier: 'fly',
    startMonth: '2026-02',
    durationMonths: 6, // Feb-Jul 2026 (red bar)
  },
];

// User 8 (Lisa Chen) - Incremental Go purchases
export const MOCK_PURCHASES_USER_8: DuoPurchaseRecord[] = [
  {
    id: 'purchase-8-1',
    tier: 'go',
    startMonth: '2026-01',
    durationMonths: 1, // Jan 2026 (green dot)
  },
  {
    id: 'purchase-8-2',
    tier: 'go',
    startMonth: '2026-03',
    durationMonths: 2, // Mar-Apr 2026 (green bar)
  },
];

// User 5 (Kevin Lee) - Run user with gaps
export const MOCK_PURCHASES_USER_5: DuoPurchaseRecord[] = [
  {
    id: 'purchase-5-1',
    tier: 'run',
    startMonth: '2026-02',
    durationMonths: 2, // Feb-Mar 2026 (yellow bar)
  },
];

// User 10 (Amy Lin) - Master mentor with consistent coverage
export const MOCK_PURCHASES_USER_10: DuoPurchaseRecord[] = [
  {
    id: 'purchase-10-1',
    tier: 'fly',
    startMonth: '2026-01',
    durationMonths: 6, // Jan-Jun 2026 (red bar)
  },
  {
    id: 'purchase-10-2',
    tier: 'fly',
    startMonth: '2026-07',
    durationMonths: 6, // Jul-Dec 2026 (red bar)
  },
];

/**
 * Map of user IDs to their mock purchase history
 */
export const MOCK_PURCHASE_HISTORY: Record<string, DuoPurchaseRecord[]> = {
  'user-1': MOCK_PURCHASES_USER_1,
  'user-5': MOCK_PURCHASES_USER_5,
  'user-6': MOCK_PURCHASES_USER_6,
  'user-8': MOCK_PURCHASES_USER_8,
  'user-10': MOCK_PURCHASES_USER_10,
  // Test account mappings
  'test-explorer-duo-nunu-nx': MOCK_PURCHASES_USER_1,
  'test-explorer-solo-1': MOCK_PURCHASES_USER_5,
  'test-traveler-solo-has-nunu': MOCK_PURCHASES_USER_6,
  'test-duo-go-nunu-n4': MOCK_PURCHASES_USER_8,
  'test-duo-run-nunu-n2': MOCK_PURCHASES_USER_10,
};

/**
 * Get mock purchase history for a user
 */
export function getMockPurchaseHistory(userId: string | null): DuoPurchaseRecord[] {
  if (!userId) return [];
  return MOCK_PURCHASE_HISTORY[userId] || [];
}

/**
 * Get all months owned by a user
 */
export function getOwnedMonths(userId: string | null): string[] {
  const purchases = getMockPurchaseHistory(userId);
  const months: string[] = [];

  purchases.forEach((p) => {
    const [year, month] = p.startMonth.split('-').map(Number);
    for (let i = 0; i < p.durationMonths; i++) {
      const date = new Date(year, month - 1 + i, 1);
      const newMonth = String(date.getMonth() + 1).padStart(2, '0');
      const newYear = date.getFullYear();
      months.push(`${newYear}-${newMonth}`);
    }
  });

  return months;
}

/**
 * Check if months overlap with existing purchases
 */
export function checkOverlap(
  userId: string | null,
  selectedMonths: string[]
): { hasOverlap: boolean; overlappingMonths: string[] } {
  const ownedMonths = getOwnedMonths(userId);
  const overlappingMonths = selectedMonths.filter((m) => ownedMonths.includes(m));
  return {
    hasOverlap: overlappingMonths.length > 0,
    overlappingMonths,
  };
}
