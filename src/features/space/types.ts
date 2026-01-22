// ==========================================
// Companion Types (existing)
// ==========================================
export type CompanionType = 'nunu' | 'certified-nunu' | 'shangzhe';

export interface Companion {
  id: string;
  name: string;
  avatar: string;
  type: CompanionType;
  bio: string;
  expertise: string[];
  discordId: string;
  isAvailable: boolean;
  matchCount: number;
  rating: number;
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

export const NUNU_LEVEL_CONFIGS: NunuLevelConfig[] = [
  {
    level: 'N5',
    name: 'Beginner Nunu',
    maxVavas: 3,
    color: 'bg-gray-600/20 text-gray-400 border-gray-600/30',
    description: 'Entry Level',
  },
  {
    level: 'N4',
    name: 'Intermediate Nunu',
    maxVavas: 5,
    color: 'bg-green-600/20 text-green-400 border-green-600/30',
    description: 'Mid-level Mentor',
  },
  {
    level: 'N3',
    name: 'Senior Nunu',
    maxVavas: 10,
    color: 'bg-blue-600/20 text-blue-400 border-blue-600/30',
    description: 'Advanced Mentor',
  },
  {
    level: 'N2',
    name: 'Expert Nunu',
    maxVavas: 30,
    color: 'bg-purple-600/20 text-purple-400 border-purple-600/30',
    description: 'Expert Level',
  },
  {
    level: 'N1',
    name: 'Master Nunu',
    maxVavas: 50,
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
}

// ==========================================
// Matching Board Types
// ==========================================
export type MatchingPostType = 'nunu-looking-for-vava' | 'vava-looking-for-nunu';
export type TimeSelectionType = 'monthly' | 'seasonal';

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

export const TIME_SELECTION_LABELS: Record<TimeSelectionType, string> = {
  monthly: 'Monthly Matching',
  seasonal: 'Seasonal Matching',
};

export interface MatchingPost {
  id: string;
  authorId: string;
  type: MatchingPostType;
  title: string;
  content: string;
  timeSelection: TimeSelectionType;
  timePeriod: string;
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
  notes?: string;
  // Enriched from users
  nunu?: {
    id: string;
    name: string;
    avatar: string;
    level?: NunuLevel;
  };
  vava?: {
    id: string;
    name: string;
    avatar: string;
  };
}
