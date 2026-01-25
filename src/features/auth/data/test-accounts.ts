import type { IdentityType, UserRole } from '@/features/auth/types';
import type { NunuLevel } from '@/features/mission/types';

/**
 * Test accounts with rich 2-year simulated history.
 *
 * Each account represents a realistic user who has been using the platform
 * for approximately 2 years with detailed activity data.
 *
 * Attributes:
 * - isNunu: Whether this user is an approved Nunu mentor
 * - nLevel: Nunu certification level (N1-N5, N1 highest; Nx for testing)
 * - fafaCount: Number of Vava (法法) mentees they have
 * - hasNunuCount: Number of Nunus they are matched with as a Vava
 * - isTestingNx: Whether they're testing experimental Nx features
 * - isDuo: Whether they have an active Duo pairing
 *
 * Rich profile data (simulating 2 years of usage):
 * - joinedAt: When they first registered
 * - lastActiveAt: Most recent platform activity
 * - currentStreak: Days of continuous learning
 * - longestStreak: Best streak achieved
 * - totalCoursesCompleted: Lifetime courses finished
 * - totalLessonsWatched: Lifetime lessons consumed
 * - totalWatchTimeMinutes: Total time spent learning
 * - currentLevel: Test system level (1-12)
 * - testAttempts: Number of level tests taken
 * - testsPassed: Number of level tests passed
 * - becameNunuAt: When they became a certified Nunu
 * - totalVavaMentored: Lifetime Vavas helped
 * - status: Current user status
 */
export interface TestAccount {
  id: string;
  name: string;
  /** @deprecated Use structured fields instead. Kept for reference only. */
  description: string;
  identity: IdentityType;
  isNunu?: boolean;
  nLevel?: NunuLevel;
  fafaCount?: number;
  hasNunuCount?: number;
  isTestingNx?: boolean;
  isDuo?: boolean;

  // Rich profile data
  joinedAt: Date;
  lastActiveAt: Date;
  currentStreak: number;
  longestStreak: number;
  totalCoursesCompleted: number;
  totalLessonsWatched: number;
  totalWatchTimeMinutes: number;
  currentLevel: number;
  testAttempts: number;
  testsPassed: number;
  becameNunuAt?: Date;
  totalVavaMentored: number;
  status: 'active' | 'on-break' | 'mentor-focus' | 'learning-focus' | 'casual';
}

/**
 * 11 Rich Test Accounts with 2 years of simulated usage data.
 *
 * Each non-guest account has comprehensive history simulating realistic
 * platform usage over approximately 2 years (since ~January 2024).
 *
 * Account categories:
 * 1. Guest - no account
 * 2-3. Explorer Solo (non-Nunu) - newer users, learning focus
 * 4-6. Explorer Duo (Nunu mentors) - teaching while learning
 * 7. Traveler Solo (has Nunu) - premium learner with mentor
 * 8. Traveler Solo (is Nunu N5) - new mentor
 * 9. Duo Go (is Nunu N4) - intermediate mentor
 * 10. Duo Fly (N3) - experienced mentor
 * 11. Duo Run (is Nunu N2) - master mentor
 */
export const TEST_ACCOUNTS: TestAccount[] = [
  // 1. Guest - No profile data
  {
    id: 'test-guest',
    name: 'Guest',
    description: '訪客（未登入）',
    identity: 'guest',
    joinedAt: new Date(),
    lastActiveAt: new Date(),
    currentStreak: 0,
    longestStreak: 0,
    totalCoursesCompleted: 0,
    totalLessonsWatched: 0,
    totalWatchTimeMinutes: 0,
    currentLevel: 0,
    testAttempts: 0,
    testsPassed: 0,
    totalVavaMentored: 0,
    status: 'casual',
  },

  // 2. Explorer Solo #1 - Kevin Lee (newer user, 8 months active)
  {
    id: 'test-explorer-solo-1',
    name: 'Kevin Lee',
    description: 'Explorer Solo（非努努）#1',
    identity: 'explorer',
    isNunu: false,
    isDuo: false,
    joinedAt: new Date('2024-05-15'),
    lastActiveAt: new Date('2026-01-24'),
    currentStreak: 12,
    longestStreak: 28,
    totalCoursesCompleted: 8,
    totalLessonsWatched: 142,
    totalWatchTimeMinutes: 4260,
    currentLevel: 3,
    testAttempts: 5,
    testsPassed: 3,
    totalVavaMentored: 0,
    status: 'active',
  },

  // 3. Explorer Solo #2 - David Zhang (casual learner, 14 months)
  {
    id: 'test-explorer-solo-2',
    name: 'David Zhang',
    description: 'Explorer Solo（非努努）#2',
    identity: 'explorer',
    isNunu: false,
    isDuo: false,
    joinedAt: new Date('2024-11-20'),
    lastActiveAt: new Date('2026-01-20'),
    currentStreak: 3,
    longestStreak: 14,
    totalCoursesCompleted: 5,
    totalLessonsWatched: 89,
    totalWatchTimeMinutes: 2670,
    currentLevel: 2,
    testAttempts: 3,
    testsPassed: 2,
    totalVavaMentored: 0,
    status: 'casual',
  },

  // 4. Explorer Duo Nunu #1 - Sarah Lin (21 months, active Nunu)
  {
    id: 'test-explorer-duo-nunu-1',
    name: 'Sarah Lin',
    description: 'Explorer Duo（自己是努努）#1',
    identity: 'explorer',
    isNunu: true,
    isDuo: true,
    joinedAt: new Date('2024-04-08'),
    lastActiveAt: new Date('2026-01-24'),
    currentStreak: 45,
    longestStreak: 92,
    totalCoursesCompleted: 24,
    totalLessonsWatched: 412,
    totalWatchTimeMinutes: 12360,
    currentLevel: 5,
    testAttempts: 12,
    testsPassed: 5,
    becameNunuAt: new Date('2024-10-15'),
    totalVavaMentored: 8,
    status: 'mentor-focus',
  },

  // 5. Explorer Duo Nunu #2 - Emily Huang (19 months, balanced)
  {
    id: 'test-explorer-duo-nunu-2',
    name: 'Emily Huang',
    description: 'Explorer Duo（自己是努努）#2',
    identity: 'explorer',
    isNunu: true,
    isDuo: true,
    joinedAt: new Date('2024-06-22'),
    lastActiveAt: new Date('2026-01-23'),
    currentStreak: 21,
    longestStreak: 56,
    totalCoursesCompleted: 18,
    totalLessonsWatched: 298,
    totalWatchTimeMinutes: 8940,
    currentLevel: 4,
    testAttempts: 9,
    testsPassed: 4,
    becameNunuAt: new Date('2025-02-20'),
    totalVavaMentored: 5,
    status: 'active',
  },

  // 6. Explorer Duo Nunu Nx - Alex Chen (24 months, power user testing Nx)
  {
    id: 'test-explorer-duo-nunu-nx',
    name: 'Alex Chen',
    description: 'Explorer Duo（自己是努努 + NX 測試中）',
    identity: 'explorer',
    isNunu: true,
    isDuo: true,
    isTestingNx: true,
    joinedAt: new Date('2024-01-10'),
    lastActiveAt: new Date('2026-01-24'),
    currentStreak: 156,
    longestStreak: 156,
    totalCoursesCompleted: 42,
    totalLessonsWatched: 723,
    totalWatchTimeMinutes: 21690,
    currentLevel: 7,
    testAttempts: 18,
    testsPassed: 7,
    becameNunuAt: new Date('2024-07-01'),
    totalVavaMentored: 15,
    status: 'learning-focus',
  },

  // 7. Traveler Solo (has Nunu) - Jessica Wu (16 months, premium learner)
  {
    id: 'test-traveler-solo-has-nunu',
    name: 'Jessica Wu',
    description: 'Traveler Solo（非努努；自己有1隻努努）',
    identity: 'solo-traveler',
    isNunu: false,
    isDuo: false,
    hasNunuCount: 1,
    joinedAt: new Date('2024-09-05'),
    lastActiveAt: new Date('2026-01-22'),
    currentStreak: 8,
    longestStreak: 35,
    totalCoursesCompleted: 14,
    totalLessonsWatched: 245,
    totalWatchTimeMinutes: 7350,
    currentLevel: 4,
    testAttempts: 8,
    testsPassed: 4,
    totalVavaMentored: 0,
    status: 'active',
  },

  // 8. Traveler Solo Nunu N5 - Mike Wang (22 months, new mentor)
  {
    id: 'test-traveler-solo-nunu-n5',
    name: 'Mike Wang',
    description: 'Traveler Solo（自己是努努；N5；法法x1）',
    identity: 'solo-traveler',
    isNunu: true,
    nLevel: 'N5',
    fafaCount: 1,
    isDuo: false,
    joinedAt: new Date('2024-03-18'),
    lastActiveAt: new Date('2026-01-24'),
    currentStreak: 34,
    longestStreak: 78,
    totalCoursesCompleted: 28,
    totalLessonsWatched: 476,
    totalWatchTimeMinutes: 14280,
    currentLevel: 5,
    testAttempts: 14,
    testsPassed: 5,
    becameNunuAt: new Date('2024-11-28'),
    totalVavaMentored: 3,
    status: 'mentor-focus',
  },

  // 9. Duo Go Nunu N4 - Lisa Chen (20 months, intermediate mentor)
  {
    id: 'test-duo-go-nunu-n4',
    name: 'Lisa Chen',
    description: 'Duo Go（自己是努努；N4；法法x3）',
    identity: 'duo-go',
    isNunu: true,
    nLevel: 'N4',
    fafaCount: 3,
    isDuo: true,
    joinedAt: new Date('2024-05-02'),
    lastActiveAt: new Date('2026-01-24'),
    currentStreak: 67,
    longestStreak: 112,
    totalCoursesCompleted: 35,
    totalLessonsWatched: 598,
    totalWatchTimeMinutes: 17940,
    currentLevel: 6,
    testAttempts: 16,
    testsPassed: 6,
    becameNunuAt: new Date('2024-09-10'),
    totalVavaMentored: 12,
    status: 'active',
  },

  // 10. Duo Fly N3 - Tom Huang (23 months, experienced mentor)
  {
    id: 'test-duo-fly-n3',
    name: 'Tom Huang',
    description: 'Duo Fly（N3；法法x7）',
    identity: 'duo-fly',
    isNunu: false,
    nLevel: 'N3',
    fafaCount: 7,
    isDuo: true,
    joinedAt: new Date('2024-02-14'),
    lastActiveAt: new Date('2026-01-24'),
    currentStreak: 89,
    longestStreak: 145,
    totalCoursesCompleted: 48,
    totalLessonsWatched: 812,
    totalWatchTimeMinutes: 24360,
    currentLevel: 8,
    testAttempts: 22,
    testsPassed: 8,
    becameNunuAt: new Date('2024-06-20'),
    totalVavaMentored: 28,
    status: 'mentor-focus',
  },

  // 11. Duo Run Nunu N2 - Amy Lin (24 months, master mentor)
  {
    id: 'test-duo-run-nunu-n2',
    name: 'Amy Lin',
    description: 'Duo Run（自己是努努；N2；法法x11）',
    identity: 'duo-run',
    isNunu: true,
    nLevel: 'N2',
    fafaCount: 11,
    isDuo: true,
    joinedAt: new Date('2024-01-05'),
    lastActiveAt: new Date('2026-01-24'),
    currentStreak: 234,
    longestStreak: 234,
    totalCoursesCompleted: 65,
    totalLessonsWatched: 1124,
    totalWatchTimeMinutes: 33720,
    currentLevel: 10,
    testAttempts: 28,
    testsPassed: 10,
    becameNunuAt: new Date('2024-04-15'),
    totalVavaMentored: 52,
    status: 'active',
  },
];

/**
 * Mapping from test account IDs to legacy user IDs.
 * This ensures mock progress data works correctly with test accounts.
 * Used by progress systems to lookup seed data.
 */
export const TEST_ACCOUNT_TO_USER_ID: Record<string, string> = {
  'test-explorer-duo-nunu-nx': 'user-1', // Alex Chen
  'test-explorer-duo-nunu-1': 'user-2', // Sarah Lin
  'test-traveler-solo-nunu-n5': 'user-3', // Mike Wang
  'test-explorer-duo-nunu-2': 'user-4', // Emily Huang
  'test-explorer-solo-1': 'user-5', // Kevin Lee
  'test-traveler-solo-has-nunu': 'user-6', // Jessica Wu
  'test-explorer-solo-2': 'user-7', // David Zhang
  'test-duo-go-nunu-n4': 'user-8', // Lisa Chen
  'test-duo-fly-n3': 'user-9', // Tom Huang
  'test-duo-run-nunu-n2': 'user-10', // Amy Lin
};

/**
 * Get the effective user ID for progress lookups.
 * Maps test account IDs to their corresponding user IDs,
 * or returns the ID unchanged if it's already a user ID.
 */
export function getEffectiveUserId(accountId: string | null): string | null {
  if (!accountId || accountId === 'test-guest' || accountId === 'guest') {
    return null;
  }
  return TEST_ACCOUNT_TO_USER_ID[accountId] || accountId;
}
