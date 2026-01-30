/**
 * Nunu Level Requirements and Eligibility System
 *
 * Nunu levels represent mentor experience progression:
 * Nx → N-5 → N-4 → N-3 → N-2 → N-1 (highest)
 *
 * Verified is an additional certification that can be paired with any N level.
 *
 * IMPORTANT DISTINCTION:
 * - Monthly Missions: Tasks a Nunu must complete each month while AT a level
 * - Application Requirements: Eligibility gates to APPLY FOR a higher level
 *
 * Migrated from features/test/data/nunu-rules.ts
 */

// ==================== TYPES ====================

/** Nunu certification levels (Nx is entry, N-1 is highest) */
export type NunuLevel = 'Nx' | 'N-5' | 'N-4' | 'N-3' | 'N-2' | 'N-1';

/** All Nunu levels in progression order */
export const NUNU_LEVELS: NunuLevel[] = ['Nx', 'N-5', 'N-4', 'N-3', 'N-2', 'N-1'];

/** Mapping from level to next level */
export const NUNU_LEVEL_PROGRESSION: Record<NunuLevel, NunuLevel | null> = {
  'Nx': 'N-5',
  'N-5': 'N-4',
  'N-4': 'N-3',
  'N-3': 'N-2',
  'N-2': 'N-1',
  'N-1': null, // Highest level
};

/**
 * Monthly Missions - Tasks a Nunu must complete EACH MONTH while at their current level.
 * These are NOT promotion requirements; they are ongoing maintenance obligations.
 */
export interface MonthlyMissions {
  /** Courses to complete per month */
  coursesPerMonth: number;
  /** Forum posts to write per month */
  forumPostsPerMonth: number;
  /** Forum comments to write per month */
  forumCommentsPerMonth: number;
  /** Minimum active mentees required each month */
  mentoredActiveMin: number;
  /** Maximum active mentees allowed each month (capacity cap) */
  mentoredActiveMax: number;
}

/**
 * Application Requirements - Eligibility gates to APPLY FOR a target level.
 * These are checked when a user wants to advance to a higher N-level.
 */
export interface ApplicationRequirements {
  /** Minimum Vava level required to apply */
  minVavaLevel: number;
  /** Minimum lifetime total Vavas mentored (only required for N-4 and above) */
  totalMentoredMin?: number;
}

/**
 * Complete configuration for a Nunu level including:
 * - Monthly missions (what to do each month at this level)
 * - Benefits (discounts, bonuses)
 * Note: Application requirements are stored separately in NUNU_APPLICATION_REQUIREMENTS
 */
export interface NunuLevelConfig {
  /** Monthly missions for this level */
  monthlyMissions: MonthlyMissions;
  /** Test upgrade level bonus (null means no bonus) */
  testUpgradeLevel: number | null;
  /** Shop Plan discount percentage */
  shopPlanDiscount: number;
  /** Shop Event discount percentage */
  shopEventDiscount: number;
  /** Merchandise discount percentage */
  merchDiscount: number;
}

/**
 * @deprecated Use NunuLevelConfig instead.
 * Kept for backward compatibility during migration.
 */
export interface NunuLevelRequirements {
  /** @deprecated Use ApplicationRequirements.minVavaLevel */
  minimalLevel: number;
  /** @deprecated Use MonthlyMissions.coursesPerMonth */
  coursesCompleted: number;
  /** Test upgrade level bonus (null means no bonus) */
  testUpgradeLevel: number | null;
  /** @deprecated Use MonthlyMissions.forumPostsPerMonth */
  forumPosts: number;
  /** @deprecated Use MonthlyMissions.forumCommentsPerMonth */
  forumComments: number;
  /** @deprecated Use MonthlyMissions.mentoredActiveMin */
  spaceMinVava: number;
  /** @deprecated Use MonthlyMissions.mentoredActiveMax */
  spaceMaxVava: number;
  /** Shop Plan discount percentage */
  shopPlanDiscount: number;
  /** Shop Event discount percentage */
  shopEventDiscount: number;
  /** Merchandise discount percentage */
  merchDiscount: number;
}

/** User stats needed for eligibility calculation */
export interface NunuUserStats {
  vavaLevel: number;
  /** Courses completed THIS month (for mission tracking) */
  coursesCompletedThisMonth: number;
  /** Forum posts THIS month (for mission tracking) */
  forumPostsThisMonth: number;
  /** Forum comments THIS month (for mission tracking) */
  forumCommentsThisMonth: number;
  /** Current active mentees count (for mission tracking) */
  activeMenteesCount: number;
  /** Lifetime total Vavas mentored (for application requirements) */
  totalMentored: number;
  /** Number of consecutive months with completed missions at current level */
  missionStreak: number;
  currentNunuLevel: NunuLevel | null;
  isVerified: boolean;
  /** Verified courses completed (out of 5) */
  verifiedCoursesCompleted: number;

  // Legacy fields for backward compatibility
  /** @deprecated Use coursesCompletedThisMonth */
  coursesCompleted: number;
  /** @deprecated Use forumPostsThisMonth */
  forumPosts: number;
  /** @deprecated Use forumCommentsThisMonth */
  forumComments: number;
  /** @deprecated Use activeMenteesCount */
  spaceVavaCount: number;
}

/** Individual requirement check result */
export interface RequirementCheck {
  key: string;
  label: string;
  required: number | string;
  current: number | string;
  met: boolean;
}

/** Eligibility result */
export interface EligibilityResult {
  eligible: boolean;
  currentLevel: NunuLevel | null;
  nextLevel: NunuLevel | null;
  requirements: RequirementCheck[];
  missingRequirements: RequirementCheck[];
  missionStreakRequired: number;
  missionStreakCurrent: number;
}

// ==================== MONTHLY MISSIONS ====================

/**
 * Helper to create monthly missions with enforced max = 3× min rule.
 */
function createMonthlyMissions(
  coursesPerMonth: number,
  forumPostsPerMonth: number,
  forumCommentsPerMonth: number,
  mentoredActiveMin: number
): MonthlyMissions {
  return {
    coursesPerMonth,
    forumPostsPerMonth,
    forumCommentsPerMonth,
    mentoredActiveMin,
    mentoredActiveMax: mentoredActiveMin * 3, // Enforced: max = 3× min
  };
}

/**
 * Monthly missions scale with level - higher levels have harder requirements.
 *
 * Rule: Active mentees max = Active mentees min × 3 (always enforced)
 *
 * | Level | Courses | Posts | Comments | Min Mentees | Max Mentees |
 * |-------|---------|-------|----------|-------------|-------------|
 * | Nx    | 1       | 1     | 3        | 1           | 3           |
 * | N-5   | 1       | 2     | 5        | 2           | 6           |
 * | N-4   | 2       | 3     | 8        | 3           | 9           |
 * | N-3   | 2       | 4     | 12       | 4           | 12          |
 * | N-2   | 3       | 5     | 15       | 5           | 15          |
 * | N-1   | 3       | 6     | 20       | 6           | 18          |
 */
export const MONTHLY_MISSIONS_BY_LEVEL: Record<NunuLevel, MonthlyMissions> = {
  'Nx': createMonthlyMissions(1, 1, 3, 1),
  'N-5': createMonthlyMissions(1, 2, 5, 2),
  'N-4': createMonthlyMissions(2, 3, 8, 3),
  'N-3': createMonthlyMissions(2, 4, 12, 4),
  'N-2': createMonthlyMissions(3, 5, 15, 5),
  'N-1': createMonthlyMissions(3, 6, 20, 6),
};

/**
 * @deprecated Use MONTHLY_MISSIONS_BY_LEVEL[level] instead.
 * Kept for backward compatibility.
 */
export const MONTHLY_MISSIONS: MonthlyMissions = MONTHLY_MISSIONS_BY_LEVEL['N-4'];

/**
 * @deprecated Use MONTHLY_MISSIONS_BY_LEVEL['Nx'] instead.
 */
export const NX_MONTHLY_MISSIONS: MonthlyMissions = MONTHLY_MISSIONS_BY_LEVEL['Nx'];

// ==================== APPLICATION REQUIREMENTS ====================

/**
 * Application requirements to APPLY FOR each N-level.
 * These are eligibility gates checked when a user wants to advance.
 *
 * | Target Level | Min Vava Level | Total Mentored Min |
 * |--------------|----------------|--------------------|
 * | N-5          | 4              | N/A                |
 * | N-4          | 6              | 10                 |
 * | N-3          | 8              | 30                 |
 * | N-2          | 10             | 50                 |
 * | N-1          | 12             | 100                |
 *
 * Note: Nx has no application requirements (entry level via exam only)
 */
export const NUNU_APPLICATION_REQUIREMENTS: Record<NunuLevel, ApplicationRequirements | null> = {
  'Nx': null, // Entry level - no application requirements, just pass the exam
  'N-5': {
    minVavaLevel: 4,
  },
  'N-4': {
    minVavaLevel: 6,
    totalMentoredMin: 10,
  },
  'N-3': {
    minVavaLevel: 8,
    totalMentoredMin: 30,
  },
  'N-2': {
    minVavaLevel: 10,
    totalMentoredMin: 50,
  },
  'N-1': {
    minVavaLevel: 12,
    totalMentoredMin: 100,
  },
};

// ==================== LEVEL CONFIGS (NEW) ====================

/**
 * Complete configuration for each Nunu level.
 * Includes monthly missions (now level-specific) and benefits.
 */
export const NUNU_LEVEL_CONFIGS: Record<NunuLevel, NunuLevelConfig> = {
  'Nx': {
    monthlyMissions: MONTHLY_MISSIONS_BY_LEVEL['Nx'],
    testUpgradeLevel: null,
    shopPlanDiscount: 0,
    shopEventDiscount: 0,
    merchDiscount: 10,
  },
  'N-5': {
    monthlyMissions: MONTHLY_MISSIONS_BY_LEVEL['N-5'],
    testUpgradeLevel: 1,
    shopPlanDiscount: 50,
    shopEventDiscount: 20,
    merchDiscount: 10,
  },
  'N-4': {
    monthlyMissions: MONTHLY_MISSIONS_BY_LEVEL['N-4'],
    testUpgradeLevel: 1,
    shopPlanDiscount: 50,
    shopEventDiscount: 20,
    merchDiscount: 20,
  },
  'N-3': {
    monthlyMissions: MONTHLY_MISSIONS_BY_LEVEL['N-3'],
    testUpgradeLevel: 1,
    shopPlanDiscount: 100,
    shopEventDiscount: 50,
    merchDiscount: 20,
  },
  'N-2': {
    monthlyMissions: MONTHLY_MISSIONS_BY_LEVEL['N-2'],
    testUpgradeLevel: 1,
    shopPlanDiscount: 100,
    shopEventDiscount: 50,
    merchDiscount: 30,
  },
  'N-1': {
    monthlyMissions: MONTHLY_MISSIONS_BY_LEVEL['N-1'],
    testUpgradeLevel: 1,
    shopPlanDiscount: 100,
    shopEventDiscount: 100,
    merchDiscount: 30,
  },
};

// ==================== LEGACY REQUIREMENTS TABLE (DEPRECATED) ====================

/**
 * @deprecated Use NUNU_LEVEL_CONFIGS and NUNU_APPLICATION_REQUIREMENTS instead.
 * Kept for backward compatibility.
 *
 * This table conflates monthly missions with application requirements.
 * The new system separates these concerns properly.
 */
export const NUNU_REQUIREMENTS: Record<NunuLevel, NunuLevelRequirements> = {
  'Nx': {
    minimalLevel: 4,
    coursesCompleted: 1,
    testUpgradeLevel: null,
    forumPosts: 1,
    forumComments: 3,
    spaceMinVava: 1,
    spaceMaxVava: 1,
    shopPlanDiscount: 0,
    shopEventDiscount: 0,
    merchDiscount: 10,
  },
  'N-5': {
    minimalLevel: 4,
    coursesCompleted: 1,
    testUpgradeLevel: 1,
    forumPosts: 2,
    forumComments: 5,
    spaceMinVava: 3,
    spaceMaxVava: 5,
    shopPlanDiscount: 50,
    shopEventDiscount: 20,
    merchDiscount: 10,
  },
  'N-4': {
    minimalLevel: 6,
    coursesCompleted: 1,
    testUpgradeLevel: 1,
    forumPosts: 2,
    forumComments: 5,
    spaceMinVava: 3,
    spaceMaxVava: 5,
    shopPlanDiscount: 50,
    shopEventDiscount: 20,
    merchDiscount: 20,
  },
  'N-3': {
    minimalLevel: 8,
    coursesCompleted: 1,
    testUpgradeLevel: 1,
    forumPosts: 2,
    forumComments: 5,
    spaceMinVava: 3,
    spaceMaxVava: 5,
    shopPlanDiscount: 100,
    shopEventDiscount: 50,
    merchDiscount: 20,
  },
  'N-2': {
    minimalLevel: 10,
    coursesCompleted: 1,
    testUpgradeLevel: 1,
    forumPosts: 2,
    forumComments: 5,
    spaceMinVava: 3,
    spaceMaxVava: 5,
    shopPlanDiscount: 100,
    shopEventDiscount: 50,
    merchDiscount: 30,
  },
  'N-1': {
    minimalLevel: 12,
    coursesCompleted: 1,
    testUpgradeLevel: 1,
    forumPosts: 2,
    forumComments: 5,
    spaceMinVava: 3,
    spaceMaxVava: 5,
    shopPlanDiscount: 100,
    shopEventDiscount: 100,
    merchDiscount: 30,
  },
};

// ==================== SPRINT MISSION RULES ====================

/** Sprint special months (March, June, September, December) */
export const SPRINT_SPECIAL_MONTHS = [3, 6, 9, 12];

/** Number of consecutive months required for level advancement */
export const MISSION_STREAK_REQUIRED = 3;

/** Check if a month is a sprint special month */
export function isSprintSpecialMonth(month: number): boolean {
  return SPRINT_SPECIAL_MONTHS.includes(month);
}

// ==================== ELIGIBILITY LOGIC ====================

/**
 * Get application requirements for a target Nunu level
 */
export function getApplicationRequirements(
  targetLevel: NunuLevel
): ApplicationRequirements | null {
  return NUNU_APPLICATION_REQUIREMENTS[targetLevel];
}

/**
 * Get the monthly missions for a Nunu level
 */
export function getMonthlyMissions(level: NunuLevel): MonthlyMissions {
  return NUNU_LEVEL_CONFIGS[level].monthlyMissions;
}

/**
 * Get requirements for the next Nunu level
 * @deprecated Use getApplicationRequirements instead
 */
export function getNextLevelRequirements(
  currentLevel: NunuLevel | null
): NunuLevelRequirements | null {
  if (currentLevel === null) {
    return NUNU_REQUIREMENTS['Nx'];
  }
  const nextLevel = NUNU_LEVEL_PROGRESSION[currentLevel];
  if (nextLevel === null) return null;
  return NUNU_REQUIREMENTS[nextLevel];
}


// ==================== DISPLAY HELPERS ====================

/** Get display color for Nunu level */
export function getNunuLevelColor(level: NunuLevel): string {
  const colors: Record<NunuLevel, string> = {
    'Nx': 'text-neutral-400',
    'N-5': 'text-green-400',
    'N-4': 'text-blue-400',
    'N-3': 'text-purple-400',
    'N-2': 'text-amber-400',
    'N-1': 'text-red-400',
  };
  return colors[level];
}

/** Get background color for Nunu level */
export function getNunuLevelBgColor(level: NunuLevel): string {
  const colors: Record<NunuLevel, string> = {
    'Nx': 'bg-neutral-500/10 border-neutral-500/30',
    'N-5': 'bg-green-500/10 border-green-500/30',
    'N-4': 'bg-blue-500/10 border-blue-500/30',
    'N-3': 'bg-purple-500/10 border-purple-500/30',
    'N-2': 'bg-amber-500/10 border-amber-500/30',
    'N-1': 'bg-red-500/10 border-red-500/30',
  };
  return colors[level];
}

/** Format discount percentage for display */
export function formatDiscount(percent: number): string {
  if (percent === 0) return '—';
  if (percent === 100) return 'Free';
  return `${percent}% off`;
}

/** Get level index for progress bar (0-5) */
export function getNunuLevelIndex(level: NunuLevel | null): number {
  if (level === null) return -1;
  return NUNU_LEVELS.indexOf(level);
}

/** Get level from index */
export function getNunuLevelFromIndex(index: number): NunuLevel | null {
  if (index < 0 || index >= NUNU_LEVELS.length) return null;
  return NUNU_LEVELS[index];
}
