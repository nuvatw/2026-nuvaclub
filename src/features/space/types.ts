/**
 * Space Feature Types
 *
 * Re-exports entity types from Database (canonical source)
 * and defines feature-specific types and UI constants.
 */

// Re-export entity types from Database (canonical source)
export type { Companion, CompanionType } from '@/lib/types/legacy-shim';

// Import for use in constants below
import type { CompanionType } from '@/lib/types/legacy-shim';

// ==========================================
// Status Badge Types
// ==========================================
export type StatusType = 'active' | 'pending' | 'completed';

export interface StatusBadge {
  label: string;
  color: string;
}

const STATUS_BADGES: Record<StatusType, StatusBadge> = {
  active: { label: 'Active', color: 'bg-green-500/10 text-green-400' },
  pending: { label: 'Pending', color: 'bg-amber-500/10 text-amber-400' },
  completed: { label: 'Completed', color: 'bg-primary-500/10 text-primary-400' },
};

const DEFAULT_STATUS_BADGE: StatusBadge = { label: '', color: 'bg-neutral-500/10 text-neutral-400' };

export function getStatusBadge(status: string): StatusBadge {
  const badge = STATUS_BADGES[status as StatusType];
  if (badge) return badge;
  return { ...DEFAULT_STATUS_BADGE, label: status };
}

export interface Match {
  id: string;
  userId: string;
  companionId: string;
  status: 'pending' | 'active' | 'completed';
  startDate: Date;
  endDate?: Date;
}

export const COMPANION_TYPE_LABELS: Record<CompanionType, string> = {
  nunu: 'Nunu',
  'certified-nunu': 'Certified Nunu',
  shangzhe: 'Shangzhe',
};

export const COMPANION_TYPE_COLORS: Record<CompanionType, string> = {
  nunu: 'bg-green-600/20 text-green-400',
  'certified-nunu': 'bg-purple-600/20 text-purple-400',
  shangzhe: 'bg-amber-600/20 text-amber-400',
};

// ==========================================
// Nunu Level System
// ==========================================
export type NunuLevel = 'N5' | 'N4' | 'N3' | 'N2' | 'N1';

export interface NunuLevelConfig {
  level: NunuLevel;
  name: string;
  maxVavas: number;
  minVavas: number;
  color: string;
  description: string;
}

export const NUNU_LEVEL_MAX_VAVAS: Record<NunuLevel, number> = {
  N5: 3,
  N4: 5,
  N3: 10,
  N2: 30,
  N1: 50,
};

/**
 * Nunu level sort order for sorting (higher = stronger)
 * N1 is the strongest (5), N5 is the weakest (1)
 */
export const NUNU_LEVEL_SORT_ORDER: Record<NunuLevel, number> = {
  N1: 5, // Master - strongest
  N2: 4, // Expert
  N3: 3, // Advanced
  N4: 2, // Intermediate
  N5: 1, // Beginner - weakest
};

export const NUNU_LEVEL_CONFIGS: NunuLevelConfig[] = [
  {
    level: 'N5',
    name: 'Beginner Nunu',
    maxVavas: 3,
    minVavas: 1,
    color: 'bg-gray-600/20 text-gray-400 border-gray-600/30',
    description: 'Entry Level',
  },
  {
    level: 'N4',
    name: 'Intermediate Nunu',
    maxVavas: 5,
    minVavas: 2,
    color: 'bg-green-600/20 text-green-400 border-green-600/30',
    description: 'Mid-level Mentor',
  },
  {
    level: 'N3',
    name: 'Senior Nunu',
    maxVavas: 10,
    minVavas: 3,
    color: 'bg-blue-600/20 text-blue-400 border-blue-600/30',
    description: 'Advanced Mentor',
  },
  {
    level: 'N2',
    name: 'Expert Nunu',
    maxVavas: 30,
    minVavas: 5,
    color: 'bg-purple-600/20 text-purple-400 border-purple-600/30',
    description: 'Expert Level',
  },
  {
    level: 'N1',
    name: 'Master Nunu',
    maxVavas: 50,
    minVavas: 10,
    color: 'bg-amber-600/20 text-amber-400 border-amber-600/30',
    description: 'Highest Level',
  },
];

export const getNunuLevelConfig = (level: NunuLevel): NunuLevelConfig => {
  return NUNU_LEVEL_CONFIGS.find((c) => c.level === level) || NUNU_LEVEL_CONFIGS[0];
};

// ==========================================
// Nunu Application Types
// ==========================================
export type NunuApplicationStatus = 'pending' | 'approved' | 'rejected';

export const NUNU_APPLICATION_STATUS_LABELS: Record<NunuApplicationStatus, string> = {
  pending: 'Under Review',
  approved: 'Approved',
  rejected: 'Rejected',
};

export const NUNU_APPLICATION_STATUS_COLORS: Record<NunuApplicationStatus, string> = {
  pending: 'bg-yellow-600/20 text-yellow-400',
  approved: 'bg-green-600/20 text-green-400',
  rejected: 'bg-red-600/20 text-red-400',
};

// ==========================================
// Nunu Profile Types
// ==========================================
export type NunuType = 'regular' | 'verified';

export const NUNU_TYPE_LABELS: Record<NunuType, string> = {
  regular: 'Regular Nunu',
  verified: 'Certified Nunu',
};

export const NUNU_TYPE_COLORS: Record<NunuType, string> = {
  regular: 'bg-green-600/20 text-green-400',
  verified: 'bg-purple-600/20 text-purple-400',
};

export interface NunuProfile {
  id: string;
  userId: string;
  level: NunuLevel;
  type: NunuType;
  bio: string;
  expertise: string[];
  discordId: string;
  currentVavaCount: number;
  maxVavas: number;
  totalMentorships: number;
  avgRating: number;
  totalRatings: number;
  isAvailable: boolean;
  // Enriched from user
  userName?: string;
  userAvatar?: string;
  githubUsername?: string;
}

// ==========================================
// Matching Board Types (Marketplace Model)
// ==========================================
export type MatchingPostType = 'nunu-looking-for-vava' | 'vava-looking-for-nunu';
export type PriceType = 'fixed' | 'range' | 'negotiable';

export const MATCHING_POST_TYPE_LABELS: Record<MatchingPostType, string> = {
  'nunu-looking-for-vava': 'Nunu Looking for Vava',
  'vava-looking-for-nunu': 'Vava Looking for Nunu',
};

export const MATCHING_POST_TYPE_COLORS: Record<MatchingPostType, string> = {
  'nunu-looking-for-vava': 'bg-purple-600/20 text-purple-400',
  'vava-looking-for-nunu': 'bg-blue-600/20 text-blue-400',
};

export const MATCHING_POST_TYPE_ICONS: Record<MatchingPostType, string> = {
  'nunu-looking-for-vava': '🎓',
  'vava-looking-for-nunu': '🔍',
};

export const PRICE_TYPE_LABELS: Record<PriceType, string> = {
  fixed: 'Fixed Price',
  range: 'Budget Range',
  negotiable: 'Negotiable',
};

/**
 * Format price for display
 */
export function formatPrice(
  priceType: PriceType,
  priceAmount?: number,
  priceMin?: number,
  priceMax?: number,
  currency: string = 'TWD'
): string {
  const currencySymbol = currency === 'TWD' ? 'NT$' : '$';

  switch (priceType) {
    case 'fixed':
      return priceAmount ? `${currencySymbol}${priceAmount.toLocaleString()}/mo` : 'Price TBD';
    case 'range':
      if (priceMin && priceMax) {
        return `${currencySymbol}${priceMin.toLocaleString()} - ${currencySymbol}${priceMax.toLocaleString()}/mo`;
      }
      return 'Budget TBD';
    case 'negotiable':
      return 'Negotiable';
    default:
      return 'Price TBD';
  }
}

/**
 * Format available months for display.
 * Converts YYYY-MM format to readable date range.
 * Examples:
 * - ['2026-02', '2026-03', '2026-04'] -> "Feb – Apr 2026"
 * - ['2026-02'] -> "Feb 2026"
 * - [] -> "—"
 */
export function formatAvailableMonths(months: string[]): string {
  if (!months || months.length === 0) return '—';

  // Sort months to ensure correct order
  const sortedMonths = [...months].sort();

  const formatMonth = (monthStr: string, includeYear: boolean = true) => {
    const [year, month] = monthStr.split('-');
    const date = new Date(Number(year), Number(month) - 1);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      ...(includeYear ? { year: 'numeric' } : {}),
    });
  };

  if (sortedMonths.length === 1) {
    return formatMonth(sortedMonths[0]);
  }

  const firstMonth = sortedMonths[0];
  const lastMonth = sortedMonths[sortedMonths.length - 1];
  const sameYear = firstMonth.split('-')[0] === lastMonth.split('-')[0];

  const startStr = formatMonth(firstMonth, !sameYear);
  const endStr = formatMonth(lastMonth, true);

  return `${startStr} – ${endStr}`;
}

export interface MatchingPost {
  id: string;
  authorId: string;
  type: MatchingPostType;
  title: string;
  content: string;
  description?: string; // Support both for now to minimize breakage while refactoring
  // Pricing (marketplace model)
  priceType: PriceType;
  priceAmount?: number;
  priceMin?: number;
  priceMax?: number;
  priceCurrency: string;
  // Available months (YYYY-MM format)
  availableMonths: string[];
  // Capacity (for Nunu posts)
  maxSlots?: number;
  currentSlots?: number;
  isVerifiedNunuOnly: boolean;
  tags: string[];
  viewCount: number;
  commentCount: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  // Enriched from user/profile
  author?: {
    id: string;
    name: string;
    avatar: string;
    nunuLevel?: NunuLevel;
    nunuType?: NunuType;
    rating?: number;
    totalRatings?: number;
    mentoredMonths?: number;
    discordId?: string;
    githubUsername?: string;
  };
}

export interface MatchingComment {
  id: string;
  postId: string;
  authorId: string;
  content: string;
  isPrivate: boolean;
  parentId?: string;
  createdAt: Date;
  updatedAt: Date;
  // Enriched from user
  author?: {
    id: string;
    name: string;
    avatar: string;
  };
  replies?: MatchingComment[];
}

// ==========================================
// Mentorship Types
// ==========================================
export type MentorshipStatus = 'active' | 'completed' | 'paused';

export const MENTORSHIP_STATUS_LABELS: Record<MentorshipStatus, string> = {
  active: 'In Progress',
  completed: 'Completed',
  paused: 'Paused',
};

export const MENTORSHIP_STATUS_COLORS: Record<MentorshipStatus, string> = {
  active: 'bg-green-600/20 text-green-400',
  completed: 'bg-blue-600/20 text-blue-400',
  paused: 'bg-yellow-600/20 text-yellow-400',
};

export interface Mentorship {
  id: string;
  nunuId: string;
  vavaId: string;
  status: MentorshipStatus;
  startedAt: Date;
  lastSessionAt?: Date;
  sessionCount: number;
  months?: string[];
  notes?: string;
  nunu?: {
    id: string;
    name: string;
    avatar: string;
    level?: NunuLevel;
    type?: NunuType;
    discordId?: string;
    githubUsername?: string;
  };
  vava?: {
    id: string;
    name: string;
    avatar: string;
    discordId?: string;
    githubUsername?: string;
  };
}

// ==========================================
// Match Request / Invitation Types
// ==========================================
export type InvitationStatus = 'pending' | 'accepted' | 'declined';

export interface MatchInvitation {
  id: string;
  listingId: string;
  listingTitle: string;
  listingType: MatchingPostType;
  fromUserId: string;
  fromUserName: string;
  fromUserAvatar?: string;
  toUserId: string;
  toUserName: string;
  message: string;
  status: InvitationStatus;
  createdAt: Date;
  respondedAt?: Date;
}
