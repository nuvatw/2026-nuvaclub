import type { PlanFeature } from '../types';

export const PLAN_COMPARISON: PlanFeature[] = [
  { feature: 'Browse first chapter', explorer: true, traveler: true },
  { feature: 'Browse free courses', explorer: true, traveler: true },
  { feature: 'Access all courses', explorer: false, traveler: true },
  { feature: 'Forum comments & interaction', explorer: true, traveler: true },
  { feature: 'Forum post articles', explorer: false, traveler: true },
  { feature: 'Sprint browse projects', explorer: true, traveler: true },
  { feature: 'Sprint upload projects', explorer: false, traveler: true },
  { feature: 'Sprint voting', explorer: false, traveler: true },
  { feature: 'Priority customer support', explorer: false, traveler: true },
];

export const PLAN_INFO = {
  explorer: {
    name: 'Explorer',
    price: 0,
    priceLabel: 'FREE',
    description: 'Start your exploration journey with free access to basic features',
  },
  traveler: {
    name: 'Traveler',
    price: 990,
    priceLabel: '$990/mo',
    description: 'Unlock full courses, forum posting, and Sprint participation',
  },
};

