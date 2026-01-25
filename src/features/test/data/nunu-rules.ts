/**
 * Nunu Level Requirements and Eligibility System
 *
 * Nunu levels represent mentor experience progression:
 * N-Test → N-5 → N-4 → N-3 → N-2 → N-1 (highest)
 *
 * Verified is an additional certification that can be paired with any N level.
 */

// ==================== TYPES ====================

/** Nunu certification levels (N-Test is entry, N-1 is highest) */
export type NunuLevel = 'N-Test' | 'N-5' | 'N-4' | 'N-3' | 'N-2' | 'N-1';

/** All Nunu levels in progression order */
export const NUNU_LEVELS: NunuLevel[] = ['N-Test', 'N-5', 'N-4', 'N-3', 'N-2', 'N-1'];

/** Mapping from level to next level */
export const NUNU_LEVEL_PROGRESSION: Record<NunuLevel, NunuLevel | null> = {
  'N-Test': 'N-5',
  'N-5': 'N-4',
  'N-4': 'N-3',
  'N-3': 'N-2',
  'N-2': 'N-1',
  'N-1': null, // Highest level
};

/** Requirements for each Nunu level */
export interface NunuLevelRequirements {
  /** Minimum Vava level required */
  minimalLevel: number;
  /** Number of courses completed */
  coursesCompleted: number;
  /** Test upgrade level bonus (null means no bonus) */
  testUpgradeLevel: number | null;
  /** Minimum forum posts */
  forumPosts: number;
  /** Minimum forum comments */
  forumComments: number;
  /** Minimum Vavas mentored in Space */
  spaceMinVava: number;
  /** Maximum Vavas that can be mentored in Space */
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
  coursesCompleted: number;
  forumPosts: number;
  forumComments: number;
  spaceVavaCount: number;
  /** Number of consecutive months with completed missions at current level */
  missionStreak: number;
  currentNunuLevel: NunuLevel | null;
  isVerified: boolean;
  /** Verified courses completed (out of 5) */
  verifiedCoursesCompleted: number;
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

// ==================== REQUIREMENTS TABLE ====================

/**
 * Nunu level requirements data (from user specification)
 *
 * | Item / Level           | N-Test | N-5  | N-4  | N-3  | N-2  | N-1  |
 * |------------------------|--------|------|------|------|------|------|
 * | Minimal Level          | 4      | 4    | 6    | 8    | 10   | 12   |
 * | Courses Completed      | 1      | 1    | 1    | 2    | 2    | 3    |
 * | Test Upgrade Level     | ✗      | +1   | +1   | +1   | +1   | +1   |
 * | Forum Post             | 1      | 1    | 2    | 3    | 4    | 5    |
 * | Forum Comment          | 3      | 3    | 5    | 10   | 20   | 50   |
 * | Space (min vava)       | 1      | 1    | 3    | 5    | 10   | 30   |
 * | Space (max vava)       | 1      | 3    | 5    | 10   | 30   | 50   |
 * | Shop Plan (% off)      | ✗      | 50%  | 50%  | 100% | 100% | 100% |
 * | Shop Event (% off)     | ✗      | 20%  | 20%  | 50%  | 50%  | 100% |
 * | Merch (% off)          | 10%    | 10%  | 20%  | 20%  | 30%  | 30%  |
 */
export const NUNU_REQUIREMENTS: Record<NunuLevel, NunuLevelRequirements> = {
  'N-Test': {
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
    forumPosts: 1,
    forumComments: 3,
    spaceMinVava: 1,
    spaceMaxVava: 3,
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
    coursesCompleted: 2,
    testUpgradeLevel: 1,
    forumPosts: 3,
    forumComments: 10,
    spaceMinVava: 5,
    spaceMaxVava: 10,
    shopPlanDiscount: 100,
    shopEventDiscount: 50,
    merchDiscount: 20,
  },
  'N-2': {
    minimalLevel: 10,
    coursesCompleted: 2,
    testUpgradeLevel: 1,
    forumPosts: 4,
    forumComments: 20,
    spaceMinVava: 10,
    spaceMaxVava: 30,
    shopPlanDiscount: 100,
    shopEventDiscount: 50,
    merchDiscount: 30,
  },
  'N-1': {
    minimalLevel: 12,
    coursesCompleted: 3,
    testUpgradeLevel: 1,
    forumPosts: 5,
    forumComments: 50,
    spaceMinVava: 30,
    spaceMaxVava: 50,
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
 * Get requirements for the next Nunu level
 */
export function getNextLevelRequirements(
  currentLevel: NunuLevel | null
): NunuLevelRequirements | null {
  if (currentLevel === null) {
    return NUNU_REQUIREMENTS['N-Test'];
  }
  const nextLevel = NUNU_LEVEL_PROGRESSION[currentLevel];
  if (nextLevel === null) return null;
  return NUNU_REQUIREMENTS[nextLevel];
}

/**
 * Calculate eligibility for the next Nunu level
 */
export function calculateEligibility(stats: NunuUserStats): EligibilityResult {
  const currentLevel = stats.currentNunuLevel;
  const nextLevel = currentLevel ? NUNU_LEVEL_PROGRESSION[currentLevel] : 'N-Test';

  // Already at highest level
  if (nextLevel === null) {
    return {
      eligible: false,
      currentLevel,
      nextLevel: null,
      requirements: [],
      missingRequirements: [],
      missionStreakRequired: 0,
      missionStreakCurrent: stats.missionStreak,
    };
  }

  const requirements = NUNU_REQUIREMENTS[nextLevel];
  const checks: RequirementCheck[] = [];

  // Check Vava level
  checks.push({
    key: 'minimalLevel',
    label: 'Vava Level',
    required: requirements.minimalLevel,
    current: stats.vavaLevel,
    met: stats.vavaLevel >= requirements.minimalLevel,
  });

  // Check courses completed
  checks.push({
    key: 'coursesCompleted',
    label: 'Courses Completed',
    required: requirements.coursesCompleted,
    current: stats.coursesCompleted,
    met: stats.coursesCompleted >= requirements.coursesCompleted,
  });

  // Check forum posts
  checks.push({
    key: 'forumPosts',
    label: 'Forum Posts',
    required: requirements.forumPosts,
    current: stats.forumPosts,
    met: stats.forumPosts >= requirements.forumPosts,
  });

  // Check forum comments
  checks.push({
    key: 'forumComments',
    label: 'Forum Comments',
    required: requirements.forumComments,
    current: stats.forumComments,
    met: stats.forumComments >= requirements.forumComments,
  });

  // Check Space Vava count
  checks.push({
    key: 'spaceMinVava',
    label: 'Vavas Mentored',
    required: requirements.spaceMinVava,
    current: stats.spaceVavaCount,
    met: stats.spaceVavaCount >= requirements.spaceMinVava,
  });

  // Check mission streak (3 consecutive months)
  const missionStreakMet = stats.missionStreak >= MISSION_STREAK_REQUIRED;
  checks.push({
    key: 'missionStreak',
    label: 'Mission Streak (months)',
    required: MISSION_STREAK_REQUIRED,
    current: stats.missionStreak,
    met: missionStreakMet,
  });

  const missingRequirements = checks.filter((c) => !c.met);
  const eligible = missingRequirements.length === 0;

  return {
    eligible,
    currentLevel,
    nextLevel,
    requirements: checks,
    missingRequirements,
    missionStreakRequired: MISSION_STREAK_REQUIRED,
    missionStreakCurrent: stats.missionStreak,
  };
}

/**
 * Check eligibility for Verified status
 */
export function checkVerifiedEligibility(stats: NunuUserStats): {
  eligible: boolean;
  coursesCompleted: number;
  coursesRequired: number;
  hasPassedExam: boolean;
} {
  const VERIFIED_COURSES_REQUIRED = 5;
  return {
    eligible: stats.verifiedCoursesCompleted >= VERIFIED_COURSES_REQUIRED,
    coursesCompleted: stats.verifiedCoursesCompleted,
    coursesRequired: VERIFIED_COURSES_REQUIRED,
    hasPassedExam: stats.isVerified,
  };
}

// ==================== DISPLAY HELPERS ====================

/** Get display color for Nunu level */
export function getNunuLevelColor(level: NunuLevel): string {
  const colors: Record<NunuLevel, string> = {
    'N-Test': 'text-neutral-400',
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
    'N-Test': 'bg-neutral-500/10 border-neutral-500/30',
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

// ==================== MOCK USER STATS ====================

/**
 * Generate mock user stats for demo purposes
 * In production, this would come from the user's actual data
 */
export function getMockNunuUserStats(): NunuUserStats {
  return {
    vavaLevel: 5,
    coursesCompleted: 2,
    forumPosts: 2,
    forumComments: 8,
    spaceVavaCount: 2,
    missionStreak: 1,
    currentNunuLevel: null,
    isVerified: false,
    verifiedCoursesCompleted: 1,
  };
}
