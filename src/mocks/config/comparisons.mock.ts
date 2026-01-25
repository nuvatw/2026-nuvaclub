/**
 * Comparison Tables Configuration
 *
 * Re-exports from the canonical source for backward compatibility.
 * All plan comparison data is now defined in @/features/shop/data/comparisons.
 */

export {
  FEATURE_CATEGORIES,
  PLAN_COMPARISON,
  PLAN_INFO,
  getFeaturesByCategory,
} from '@/features/shop/data/comparisons';

export type { FeatureCategory, PlanFeature } from '@/features/shop/types';
