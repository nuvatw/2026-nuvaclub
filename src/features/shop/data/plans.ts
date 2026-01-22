import type { PlanProduct } from '@/features/shop/types';

export const PLANS: PlanProduct[] = [
  {
    id: 'plan-explorer',
    type: 'plan',
    planType: 'explorer',
    name: 'Explorer',
    description: 'Start your journey with free access to basic features and community content.',
    price: 0,
    billingCycle: 'monthly',
    features: [
      'Access first chapter of all courses',
      'Browse forum discussions',
      'View Sprint projects',
      'Basic community access',
    ],
    imageUrl: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800',
    rating: 4.5,
    reviewCount: 234,
  },
  {
    id: 'plan-traveler',
    type: 'plan',
    planType: 'traveler',
    name: 'Traveler',
    description: 'Unlock full access to courses, forum posting, and Sprint participation.',
    price: 990,
    billingCycle: 'monthly',
    features: [
      'Full access to all courses',
      'Post and comment in forum',
      'Submit Sprint projects',
      'Vote on Sprint submissions',
      'Priority support',
    ],
    imageUrl: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800',
    rating: 4.8,
    reviewCount: 156,
    isPopular: true,
  },
];

export function getPlanById(id: string): PlanProduct | undefined {
  return PLANS.find((plan) => plan.id === id);
}

export function getPlanByType(planType: 'explorer' | 'traveler'): PlanProduct | undefined {
  return PLANS.find((plan) => plan.planType === planType);
}
