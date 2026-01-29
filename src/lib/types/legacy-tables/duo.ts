/**
 * Duo Products Table
 *
 * Duo tickets grant access to match with different Nunu (mentor) tiers:
 * - Go: Regular Nunu mentors only
 * - Run: Regular + Verified Nunu mentors
 * - Fly: All Nunu tiers including Super Nunu (founders)
 */

export type DuoVariant = 'go' | 'run' | 'fly';
export type NunuTier = 'nunu' | 'verified_nunu' | 'super_nunu';

export interface DuoProduct {
  id: string;
  type: 'duo';
  duoVariant: DuoVariant;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  rating: number;
  reviewCount: number;
  matchAccess: NunuTier[];
  features: string[];
  isPopular?: boolean;
  badge?: string;
}

export const DuoProductsTable: DuoProduct[] = [
  {
    id: 'duo-go',
    type: 'duo',
    duoVariant: 'go',
    name: 'Duo Go',
    description:
      'Your first step into mentorship. Match with Nunu mentors and start your learning journey.',
    price: 490,
    imageUrl: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800',
    rating: 4.6,
    reviewCount: 89,
    matchAccess: ['nunu'],
    features: [
      'Match with Nunu mentors',
      'Discord community access',
      'My Space dashboard',
      '1 match per month',
    ],
  },
  {
    id: 'duo-run',
    type: 'duo',
    duoVariant: 'run',
    name: 'Duo Run',
    description:
      'Premium mentorship with verified professionals. Get guidance from certified experts.',
    price: 990,
    imageUrl: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800',
    rating: 4.8,
    reviewCount: 156,
    matchAccess: ['nunu', 'verified_nunu'],
    features: [
      'Everything in Duo Go',
      'Match with Verified Nunus',
      'Priority matching queue',
      '5 matches per month',
      'Progress reports',
    ],
    isPopular: true,
    badge: 'Most Popular',
  },
  {
    id: 'duo-fly',
    type: 'duo',
    duoVariant: 'fly',
    name: 'Duo Fly',
    description:
      'VIP access to all mentor tiers including founders. The ultimate mentorship experience.',
    price: 2990,
    imageUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800',
    rating: 4.9,
    reviewCount: 34,
    matchAccess: ['nunu', 'verified_nunu', 'super_nunu'],
    features: [
      'Everything in Duo Run',
      'Match with Super Nunus (Founders)',
      'Unlimited matches',
      '1:1 career guidance',
      'AI strategy consulting',
      'Exclusive VIP community',
    ],
    badge: 'Best Value',
  },
];

// ============================================================
// Helper Functions
// ============================================================

export const getDuoProductById = (id: string): DuoProduct | undefined =>
  DuoProductsTable.find((product) => product.id === id);

export const getDuoProductByVariant = (
  variant: DuoVariant
): DuoProduct | undefined =>
  DuoProductsTable.find((product) => product.duoVariant === variant);

export const getMatchAccessForVariant = (variant: DuoVariant): NunuTier[] => {
  const product = getDuoProductByVariant(variant);
  return product?.matchAccess ?? [];
};

export const canAccessTier = (variant: DuoVariant, tier: NunuTier): boolean => {
  const access = getMatchAccessForVariant(variant);
  return access.includes(tier);
};

export const getAllDuoProducts = (): DuoProduct[] => DuoProductsTable;

// Display labels and colors
export const NUNU_TIER_LABELS: Record<NunuTier, string> = {
  nunu: 'Nunu',
  verified_nunu: 'Verified Nunu',
  super_nunu: 'Super Nunu',
};

export const NUNU_TIER_COLORS: Record<NunuTier, string> = {
  nunu: 'bg-green-600/20 text-green-400',
  verified_nunu: 'bg-purple-600/20 text-purple-400',
  super_nunu: 'bg-amber-600/20 text-amber-400',
};

export const DUO_VARIANT_LABELS: Record<DuoVariant, string> = {
  go: 'Duo Go',
  run: 'Duo Run',
  fly: 'Duo Fly',
};

export const DUO_VARIANT_COLORS: Record<DuoVariant, string> = {
  go: 'bg-green-500',
  run: 'bg-amber-500',
  fly: 'bg-red-500',
};

// ============================================================
// Legacy Exports (for backward compatibility)
// ============================================================

/** @deprecated Use DuoProductsTable instead */
export const DUO_PRODUCTS = DuoProductsTable;
