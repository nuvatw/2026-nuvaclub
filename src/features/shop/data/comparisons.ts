import type { PlanFeature, DuoFeature } from '../types';

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

export const DUO_COMPARISON: DuoFeature[] = [
  { feature: 'Enter Space', solo: false, go: true, run: true, fly: true },
  { feature: 'Discord group', solo: false, go: true, run: true, fly: true },
  { feature: 'Match with Nunu', solo: false, go: true, run: false, fly: false },
  { feature: 'Match with Certified Nunu', solo: false, go: false, run: true, fly: false },
  { feature: 'Match with founder Shang-Zhe', solo: false, go: false, run: false, fly: true },
  { feature: 'Priority matching', solo: false, go: false, run: true, fly: true },
  { feature: 'Professional guidance', solo: false, go: false, run: true, fly: true },
  { feature: 'Career consulting', solo: false, go: false, run: false, fly: true },
  { feature: 'AI strategy consulting', solo: false, go: false, run: false, fly: true },
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

export const DUO_INFO = {
  solo: {
    name: 'Solo',
    price: 0,
    priceLabel: 'FREE',
    period: '',
    description: 'Explore on your own, not yet in a companion plan',
  },
  go: {
    name: 'Duo Go',
    price: 990,
    priceLabel: '$990',
    period: 'Monthly',
    description: 'Match with Nunu and start your companion journey',
  },
  run: {
    name: 'Duo Run',
    price: 2490,
    priceLabel: '$2,490',
    period: 'Quarterly',
    description: 'Match with Certified Nunu for more professional guidance',
  },
  fly: {
    name: 'Duo Fly',
    price: 4990,
    priceLabel: '$4,990',
    period: 'Quarterly',
    description: 'Match with founder Shang-Zhe for one-on-one deep consulting',
  },
};
