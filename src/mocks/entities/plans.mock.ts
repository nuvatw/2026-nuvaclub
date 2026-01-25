/**
 * Plans Mock Data
 *
 * Re-exports from the canonical source for backward compatibility.
 * All plan data and helpers are now defined in @/features/shop/data/plans.
 */

export {
  PLANS,
  PLANS as MOCK_PLANS,
  getPlanById,
  getPlanByType,
  getYearlySavings,
  getYearlyMonthlyEquivalent,
  formatPrice,
} from '@/features/shop/data/plans';

export type { PlanProduct, PlanType } from '@/features/shop/types';

// Additional helpers
import { PLANS } from '@/features/shop/data/plans';
import type { PlanProduct } from '@/features/shop/types';

export function getFreePlan(): PlanProduct | undefined {
  return PLANS.find((plan) => plan.price === 0);
}

export function getPaidPlans(): PlanProduct[] {
  return PLANS.filter((plan) => plan.price > 0);
}
