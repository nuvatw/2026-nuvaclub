/**
 * Plans Table
 *
 * Contains subscription plan products.
 * Plans define the membership tiers: Explorer (free), Traveler, Voyager, Enterprise
 */

export type PlanType = 'explorer' | 'traveler' | 'voyager' | 'enterprise';
export type BillingCycle = 'monthly' | 'yearly';

export interface PlanProduct {
  id: string;
  type: 'plan';
  planType: PlanType;
  name: string;
  description: string;
  price: number;
  yearlyPrice: number;
  billingCycle: BillingCycle;
  features: string[];
  imageUrl: string;
  rating: number;
  reviewCount: number;
  ctaText: string;
  ctaLink?: string;
  ctaExternal?: boolean;
  isPopular?: boolean;
  badge?: string;
  promoted?: boolean;
}

export const PlansTable: PlanProduct[] = [
  {
    id: 'plan-explorer',
    type: 'plan',
    planType: 'explorer',
    name: 'Explorer',
    description: 'Start learning AI for free.',
    price: 0,
    yearlyPrice: 0,
    billingCycle: 'monthly',
    features: [
      'Free courses (Level 1)',
      'Community access',
      'Basic quizzes & checkpoints',
      'Starter learning roadmap',
      'Standard support',
    ],
    imageUrl: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800',
    rating: 4.5,
    reviewCount: 234,
    ctaText: 'Start Free Now',
  },
  {
    id: 'plan-traveler',
    type: 'plan',
    planType: 'traveler',
    name: 'Traveler',
    description: 'Unlock the full learning experience.',
    price: 790,
    yearlyPrice: 7900, // 790 × 10 months
    billingCycle: 'monthly',
    features: [
      'Everything in Explorer',
      'Full premium courses access',
      'Expanded practice sets',
      'Progress tracking',
      'Faster support response',
    ],
    imageUrl: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800',
    rating: 4.8,
    reviewCount: 156,
    isPopular: true,
    ctaText: 'Get Started',
  },
  {
    id: 'plan-voyager',
    type: 'plan',
    planType: 'voyager',
    name: 'Voyager',
    description:
      'Connect with mentors & lead — the fastest path to real growth.',
    price: 990,
    yearlyPrice: 9900, // 990 × 10 months
    billingCycle: 'monthly',
    features: [
      'Everything in Traveler',
      'Mentor support & guidance',
      'Priority feedback loop',
      'Advanced projects & challenges',
      'Certificates / completion proof',
      'Priority support',
    ],
    imageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800',
    rating: 4.9,
    reviewCount: 89,
    badge: 'Most Recommended',
    promoted: true,
    ctaText: 'Get Started',
  },
  {
    id: 'plan-enterprise',
    type: 'plan',
    planType: 'enterprise',
    name: 'Enterprise',
    description:
      'For teams and organizations that need customization, admin control, and direct support.',
    price: 8500,
    yearlyPrice: 0, // Custom pricing - contact required
    billingCycle: 'monthly',
    features: [
      'Team management & admin controls',
      'Custom onboarding & training plan',
      'Dedicated support channel',
      'SLA / priority troubleshooting',
      'Custom integrations (if applicable)',
      'Scalable seats & access control',
    ],
    imageUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800',
    rating: 5.0,
    reviewCount: 12,
    ctaText: 'Contact us on LINE',
    ctaLink: 'https://lin.ee/BS8W6qU',
    ctaExternal: true,
  },
];

// ============================================================
// Helper Functions
// ============================================================

export const getPlanById = (id: string): PlanProduct | undefined =>
  PlansTable.find((plan) => plan.id === id);

export const getPlanByType = (planType: PlanType): PlanProduct | undefined =>
  PlansTable.find((plan) => plan.planType === planType);

export const getFreePlan = (): PlanProduct | undefined =>
  PlansTable.find((plan) => plan.price === 0);

export const getPaidPlans = (): PlanProduct[] =>
  PlansTable.filter((plan) => plan.price > 0);

export const getAllPlans = (): PlanProduct[] => PlansTable;

// Calculate yearly savings
export const getYearlySavings = (plan: PlanProduct): number => {
  if (plan.price === 0) return 0;
  return plan.price * 12 - plan.yearlyPrice;
};

// Get effective monthly price for yearly billing
export const getYearlyMonthlyEquivalent = (plan: PlanProduct): number => {
  if (plan.yearlyPrice === 0) return 0;
  return Math.round(plan.yearlyPrice / 12);
};

// Format price for display
export const formatPrice = (price: number): string => {
  return `NT$${price.toLocaleString()}`;
};

// ============================================================
// Legacy Exports (for backward compatibility)
// ============================================================

/** @deprecated Use PlansTable instead */
export const PLANS = PlansTable;

/** @deprecated Use PlansTable instead */
export const MOCK_PLANS = PlansTable;
