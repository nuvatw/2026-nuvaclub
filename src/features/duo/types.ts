// ============================================================================
// DUO MODULE - Types and Schemas
// Monthly Duo Pass System
// ============================================================================

export type DuoTier = 'go' | 'run' | 'fly';
export type DuoMonthPassStatus = 'active' | 'expired' | 'upgraded' | 'refunded';

// ==========================================
// DUO MONTH PASS RECORD
// Each pass represents access for a specific month
// ==========================================
export interface DuoMonthPassRecord {
  id: string;
  userId: string;

  // Month specification (YYYY-MM format)
  month: string; // e.g., "2026-03"

  // Tier for this specific month
  tier: DuoTier;

  // Purchase tracking
  purchasedAt: Date;
  orderId?: string;

  // Status
  status: DuoMonthPassStatus;

  // If upgraded, reference to new pass
  upgradedToId?: string;

  // Matching capacity for this month
  maxCompanions: number; // Based on tier: 1/5/unlimited (use 999 for unlimited)
  currentCompanions: number;

  createdAt: Date;
  updatedAt: Date;
}

// ==========================================
// TIER CONFIGURATION
// ==========================================
export const DUO_TIER_CONFIG: Record<
  DuoTier,
  {
    name: string;
    price: number;
    maxCompanions: number;
    companionType: 'nunu' | 'certified-nunu' | 'shangzhe';
    color: string;
    bgColor: string;
    borderColor: string;
    features: string[];
  }
> = {
  go: {
    name: 'Duo Go',
    price: 990,
    maxCompanions: 1,
    companionType: 'nunu',
    color: 'text-green-400',
    bgColor: 'bg-green-500/10',
    borderColor: 'border-green-500/30',
    features: [
      'Enter Space',
      'Match with Regular Nunu',
      'Add Discord friend',
      'Basic learning support',
    ],
  },
  run: {
    name: 'Duo Run',
    price: 2490,
    maxCompanions: 5,
    companionType: 'certified-nunu',
    color: 'text-amber-400',
    bgColor: 'bg-amber-500/10',
    borderColor: 'border-amber-500/30',
    features: [
      'Enter Space',
      'Match with Certified Nunu',
      'Up to 5 companion slots',
      'Priority matching',
      'Professional guidance',
    ],
  },
  fly: {
    name: 'Duo Fly',
    price: 4990,
    maxCompanions: 999, // Unlimited
    companionType: 'shangzhe',
    color: 'text-purple-400',
    bgColor: 'bg-purple-500/10',
    borderColor: 'border-purple-500/30',
    features: [
      'Enter Space',
      'Access Shangzhe (Founders)',
      'Unlimited companion slots',
      '1:1 career consulting',
      'AI strategy planning',
    ],
  },
};

// ==========================================
// TIER HIERARCHY (for upgrade logic)
// ==========================================
export const DUO_TIER_RANK: Record<DuoTier, number> = {
  go: 1,
  run: 2,
  fly: 3,
};

// ==========================================
// MONTH CONFLICT TYPES
// ==========================================
export type MonthConflictAction =
  | 'already_owned_same_or_higher'
  | 'upgrade_available';

export interface MonthConflict {
  month: string;
  existingTier: DuoTier;
  newTier?: DuoTier;
  action: MonthConflictAction;
  priceDifference?: number;
}

export interface DuplicateCheckResult {
  conflicts: MonthConflict[];
  canProceed: boolean;
  validMonths: string[]; // Months that can be purchased
}

// ==========================================
// HELPER FUNCTIONS
// ==========================================
export function getTierConfig(tier: DuoTier) {
  return DUO_TIER_CONFIG[tier];
}

export function getTierRank(tier: DuoTier): number {
  return DUO_TIER_RANK[tier];
}

export function canAccessCompanionType(
  tier: DuoTier,
  companionType: 'nunu' | 'certified-nunu' | 'shangzhe'
): boolean {
  const tierRank = DUO_TIER_RANK[tier];
  const companionRank: Record<string, number> = {
    nunu: 1,
    'certified-nunu': 2,
    shangzhe: 3,
  };
  return tierRank >= companionRank[companionType];
}

export function calculateUpgradePrice(
  currentTier: DuoTier,
  newTier: DuoTier
): number {
  const currentPrice = DUO_TIER_CONFIG[currentTier].price;
  const newPrice = DUO_TIER_CONFIG[newTier].price;
  return Math.max(0, newPrice - currentPrice);
}

export function getMaxCompanions(tier: DuoTier): number {
  return DUO_TIER_CONFIG[tier].maxCompanions;
}

export function isUnlimitedCompanions(tier: DuoTier): boolean {
  return DUO_TIER_CONFIG[tier].maxCompanions >= 999;
}
