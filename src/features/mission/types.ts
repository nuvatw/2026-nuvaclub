/**
 * Mission System Types
 *
 * Monthly missions based on Nunu level requirements
 */

export type NunuLevel = 'Nx' | 'N5' | 'N4' | 'N3' | 'N2' | 'N1';

export interface MissionRequirements {
  minLevel: number;
  coursesPerMonth: number;
  testLevelsPerMonth: number;
  forumPostsPerMonth: number;
  forumCommentsPerMonth: number;
  sprintProjectsPerSeason: number;
  shopDiscount: number; // percentage (0, 50, or 100)
  minActiveVava: number;
  maxActiveNunu: number;
}

export interface MissionProgress {
  coursesCompleted: number;
  testLevelsGained: number;
  forumPostsCreated: number;
  forumCommentsCreated: number;
  sprintProjectsSubmitted: number;
  activeVavaCount: number;
}

export interface MissionItem {
  id: string;
  title: string;
  description: string;
  current: number;
  target: number;
  completed: boolean;
  icon: 'book' | 'test' | 'forum-post' | 'forum-comment' | 'sprint' | 'users' | 'fire';
}

// Mission requirements by Nunu level
export const MISSION_REQUIREMENTS: Record<NunuLevel, MissionRequirements> = {
  Nx: {
    minLevel: 4,
    coursesPerMonth: 1,
    testLevelsPerMonth: 1,
    forumPostsPerMonth: 1,
    forumCommentsPerMonth: 3,
    sprintProjectsPerSeason: 0,
    shopDiscount: 0,
    minActiveVava: 1,
    maxActiveNunu: 1,
  },
  N5: {
    minLevel: 4,
    coursesPerMonth: 1,
    testLevelsPerMonth: 1,
    forumPostsPerMonth: 1,
    forumCommentsPerMonth: 3,
    sprintProjectsPerSeason: 1,
    shopDiscount: 50,
    minActiveVava: 1,
    maxActiveNunu: 3,
  },
  N4: {
    minLevel: 6,
    coursesPerMonth: 1,
    testLevelsPerMonth: 1,
    forumPostsPerMonth: 2,
    forumCommentsPerMonth: 6,
    sprintProjectsPerSeason: 1,
    shopDiscount: 0,
    minActiveVava: 2,
    maxActiveNunu: 5,
  },
  N3: {
    minLevel: 8,
    coursesPerMonth: 2,
    testLevelsPerMonth: 1,
    forumPostsPerMonth: 3,
    forumCommentsPerMonth: 10,
    sprintProjectsPerSeason: 1,
    shopDiscount: 100,
    minActiveVava: 5,
    maxActiveNunu: 10,
  },
  N2: {
    minLevel: 10,
    coursesPerMonth: 2,
    testLevelsPerMonth: 1,
    forumPostsPerMonth: 4,
    forumCommentsPerMonth: 30,
    sprintProjectsPerSeason: 1,
    shopDiscount: 0,
    minActiveVava: 6,
    maxActiveNunu: 10,
  },
  N1: {
    minLevel: 12,
    coursesPerMonth: 3,
    testLevelsPerMonth: 1,
    forumPostsPerMonth: 5,
    forumCommentsPerMonth: 50,
    sprintProjectsPerSeason: 1,
    shopDiscount: 100,
    minActiveVava: 10,
    maxActiveNunu: 30,
  },
};

// Helper to get level display name
export const NUNU_LEVEL_LABELS: Record<NunuLevel, string> = {
  Nx: 'Nunu Candidate',
  N5: 'Nunu Level 5',
  N4: 'Nunu Level 4',
  N3: 'Nunu Level 3',
  N2: 'Nunu Level 2',
  N1: 'Nunu Level 1 (Master)',
};

// Helper to get level color
export const NUNU_LEVEL_COLORS: Record<NunuLevel, string> = {
  Nx: 'text-neutral-400',
  N5: 'text-green-400',
  N4: 'text-blue-400',
  N3: 'text-purple-400',
  N2: 'text-amber-400',
  N1: 'text-red-400',
};
