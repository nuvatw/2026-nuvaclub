import type { PlanType, FeatureCategory, PlanFeature } from '../types';

export const FEATURE_CATEGORIES: Record<FeatureCategory, { label: string; icon: string }> = {
  learn: { label: 'Learn', icon: '📚' },
  test: { label: 'Test', icon: '📝' },
  forum: { label: 'Forum', icon: '💬' },
  sprint: { label: 'Sprint', icon: '🚀' },
  space: { label: 'Space', icon: '🌌' },
  extras: { label: 'Extras', icon: '⭐' },
};

export const PLAN_COMPARISON: PlanFeature[] = [
  // Learn
  { category: 'learn', feature: 'Free courses (Level 1)', explorer: true, traveler: true, voyager: true },
  { category: 'learn', feature: 'All premium courses (60+)', explorer: false, traveler: true, voyager: true },
  { category: 'learn', feature: 'Course certificates', explorer: false, traveler: false, voyager: true },
  // Test
  { category: 'test', feature: 'Basic levels (1-3)', explorer: true, traveler: true, voyager: true },
  { category: 'test', feature: 'All 12 levels', explorer: false, traveler: true, voyager: true },
  { category: 'test', feature: 'Skill badges', explorer: false, traveler: false, voyager: true },
  // Forum
  { category: 'forum', feature: 'Read & comment', explorer: true, traveler: true, voyager: true },
  { category: 'forum', feature: 'Create posts', explorer: false, traveler: true, voyager: true },
  // Sprint
  { category: 'sprint', feature: 'Browse projects', explorer: true, traveler: true, voyager: true },
  { category: 'sprint', feature: 'Upload projects & vote', explorer: false, traveler: true, voyager: true },
  { category: 'sprint', feature: 'Featured submission slot', explorer: false, traveler: false, voyager: true },
  { category: 'sprint', feature: 'Early theme access', explorer: false, traveler: false, voyager: true },
  // Space
  { category: 'space', feature: 'Browse marketplace', explorer: true, traveler: true, voyager: true },
  { category: 'space', feature: 'View Certified Nunus', explorer: false, traveler: true, voyager: true },
  { category: 'space', feature: 'Meet Shangzhe mentors', explorer: false, traveler: false, voyager: true },
  { category: 'space', feature: 'Priority matching', explorer: false, traveler: false, voyager: true },
  // Extras
  { category: 'extras', feature: 'Monthly AI Learning Report', explorer: false, traveler: false, voyager: true },
  { category: 'extras', feature: 'Profile badge', explorer: false, traveler: false, voyager: 'Voyager' },
  { category: 'extras', feature: 'Support', explorer: 'Community', traveler: 'Email', voyager: 'Priority' },
];

export const PLAN_INFO: Record<PlanType, {
  name: string;
  tagline: string;
  price: number;
  yearlyPrice: number;
  priceLabel: string;
  description: string;
}> = {
  explorer: {
    name: 'Explorer',
    tagline: 'Start learning AI for free',
    price: 0,
    yearlyPrice: 0,
    priceLabel: 'FREE',
    description: 'Access free courses and explore the platform',
  },
  traveler: {
    name: 'Traveler',
    tagline: 'Unlock the full learning experience',
    price: 790,
    yearlyPrice: 7900,
    priceLabel: 'NT$790/mo',
    description: 'Full courses, Forum posting, and progress tracking',
  },
  voyager: {
    name: 'Voyager',
    tagline: 'Connect with mentors & lead',
    price: 990,
    yearlyPrice: 9900,
    priceLabel: 'NT$990/mo',
    description: 'Mentorship, priority support, and certificates',
  },
  enterprise: {
    name: 'Enterprise',
    tagline: 'For teams and organizations',
    price: 8500,
    yearlyPrice: 0,
    priceLabel: 'NT$8,500/mo',
    description: 'Custom onboarding, admin controls, and dedicated support',
  },
};

// Helper to get features grouped by category
export const getFeaturesByCategory = () => {
  const grouped: Record<FeatureCategory, PlanFeature[]> = {
    learn: [],
    test: [],
    forum: [],
    sprint: [],
    space: [],
    extras: [],
  };

  PLAN_COMPARISON.forEach(feature => {
    grouped[feature.category].push(feature);
  });

  return grouped;
};
