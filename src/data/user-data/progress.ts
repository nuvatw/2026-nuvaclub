import type { WatchProgress } from '../types/user';

/**
 * Mock user progress data - simulates items the user has started watching
 * Uses the 10 canonical users (user-1 through user-10)
 */
export const MOCK_USER_PROGRESS: WatchProgress[] = [
  // User 1 - Alex Chen - Active learner
  {
    itemId: 'course-1',
    itemType: 'course',
    userId: 'user-1',
    progressPercent: 45,
    currentPosition: 3240,
    totalDuration: 7200,
    lastWatchedAt: new Date('2026-01-20T14:30:00'),
  },
  {
    itemId: 'course-2',
    itemType: 'course',
    userId: 'user-1',
    progressPercent: 100,
    currentPosition: 3600,
    totalDuration: 3600,
    lastWatchedAt: new Date('2026-01-15T10:00:00'),
    completedAt: new Date('2026-01-15T11:00:00'),
  },
  {
    itemId: 'course-3',
    itemType: 'course',
    userId: 'user-1',
    progressPercent: 12,
    currentPosition: 648,
    totalDuration: 5400,
    lastWatchedAt: new Date('2026-01-18T10:00:00'),
  },

  // User 2 - Sarah Lin - Power user
  {
    itemId: 'course-1',
    itemType: 'course',
    userId: 'user-2',
    progressPercent: 100,
    currentPosition: 7200,
    totalDuration: 7200,
    lastWatchedAt: new Date('2026-01-10T09:00:00'),
    completedAt: new Date('2026-01-10T11:00:00'),
  },
  {
    itemId: 'course-4',
    itemType: 'course',
    userId: 'user-2',
    progressPercent: 100,
    currentPosition: 4800,
    totalDuration: 4800,
    lastWatchedAt: new Date('2026-01-12T15:00:00'),
    completedAt: new Date('2026-01-12T16:20:00'),
  },
  {
    itemId: 'course-5',
    itemType: 'course',
    userId: 'user-2',
    progressPercent: 78,
    currentPosition: 4680,
    totalDuration: 6000,
    lastWatchedAt: new Date('2026-01-19T20:00:00'),
  },

  // User 3 - Mike Wang - Experienced learner
  {
    itemId: 'course-2',
    itemType: 'course',
    userId: 'user-3',
    progressPercent: 100,
    currentPosition: 3600,
    totalDuration: 3600,
    lastWatchedAt: new Date('2026-01-08T11:00:00'),
    completedAt: new Date('2026-01-08T12:00:00'),
  },
  {
    itemId: 'course-5',
    itemType: 'course',
    userId: 'user-3',
    progressPercent: 55,
    currentPosition: 3300,
    totalDuration: 6000,
    lastWatchedAt: new Date('2026-01-17T16:00:00'),
  },

  // User 4 - Emily Huang - Premium user
  {
    itemId: 'course-6',
    itemType: 'course',
    userId: 'user-4',
    progressPercent: 100,
    currentPosition: 5400,
    totalDuration: 5400,
    lastWatchedAt: new Date('2026-01-05T14:00:00'),
    completedAt: new Date('2026-01-05T15:30:00'),
  },
  {
    itemId: 'course-8',
    itemType: 'course',
    userId: 'user-4',
    progressPercent: 88,
    currentPosition: 4224,
    totalDuration: 4800,
    lastWatchedAt: new Date('2026-01-20T10:00:00'),
  },

  // User 5 - Kevin Lee - New user / Explorer
  {
    itemId: 'course-1',
    itemType: 'course',
    userId: 'user-5',
    progressPercent: 15,
    currentPosition: 1080,
    totalDuration: 7200,
    lastWatchedAt: new Date('2026-01-19T18:00:00'),
  },

  // User 6 - Jessica Wu - Engaged learner
  {
    itemId: 'course-4',
    itemType: 'course',
    userId: 'user-6',
    progressPercent: 67,
    currentPosition: 3216,
    totalDuration: 4800,
    lastWatchedAt: new Date('2026-01-18T20:00:00'),
  },
  {
    itemId: 'course-3',
    itemType: 'course',
    userId: 'user-6',
    progressPercent: 100,
    currentPosition: 5400,
    totalDuration: 5400,
    lastWatchedAt: new Date('2026-01-14T12:00:00'),
    completedAt: new Date('2026-01-14T13:30:00'),
  },

  // User 7 - David Zhang - Casual user / Explorer
  {
    itemId: 'course-2',
    itemType: 'course',
    userId: 'user-7',
    progressPercent: 22,
    currentPosition: 792,
    totalDuration: 3600,
    lastWatchedAt: new Date('2026-01-16T11:00:00'),
  },

  // User 8 - Lisa Chen - Active participant
  {
    itemId: 'course-5',
    itemType: 'course',
    userId: 'user-8',
    progressPercent: 40,
    currentPosition: 2400,
    totalDuration: 6000,
    lastWatchedAt: new Date('2026-01-19T14:00:00'),
  },
  {
    itemId: 'course-1',
    itemType: 'course',
    userId: 'user-8',
    progressPercent: 100,
    currentPosition: 7200,
    totalDuration: 7200,
    lastWatchedAt: new Date('2026-01-11T09:00:00'),
    completedAt: new Date('2026-01-11T11:00:00'),
  },

  // User 9 - Tom Huang - Regular contributor
  {
    itemId: 'course-7',
    itemType: 'course',
    userId: 'user-9',
    progressPercent: 92,
    currentPosition: 4968,
    totalDuration: 5400,
    lastWatchedAt: new Date('2026-01-21T08:00:00'),
  },
  {
    itemId: 'course-3',
    itemType: 'course',
    userId: 'user-9',
    progressPercent: 100,
    currentPosition: 5400,
    totalDuration: 5400,
    lastWatchedAt: new Date('2026-01-13T15:00:00'),
    completedAt: new Date('2026-01-13T16:30:00'),
  },

  // User 10 - Amy Lin - Expert mentor
  {
    itemId: 'course-8',
    itemType: 'course',
    userId: 'user-10',
    progressPercent: 100,
    currentPosition: 4800,
    totalDuration: 4800,
    lastWatchedAt: new Date('2026-01-03T10:00:00'),
    completedAt: new Date('2026-01-03T11:20:00'),
  },
  {
    itemId: 'course-6',
    itemType: 'course',
    userId: 'user-10',
    progressPercent: 100,
    currentPosition: 5400,
    totalDuration: 5400,
    lastWatchedAt: new Date('2026-01-07T14:00:00'),
    completedAt: new Date('2026-01-07T15:30:00'),
  },
  {
    itemId: 'course-7',
    itemType: 'course',
    userId: 'user-10',
    progressPercent: 100,
    currentPosition: 5400,
    totalDuration: 5400,
    lastWatchedAt: new Date('2026-01-09T11:00:00'),
    completedAt: new Date('2026-01-09T12:30:00'),
  },
];

export function getUserProgress(userId: string, itemId: string): WatchProgress | undefined {
  return MOCK_USER_PROGRESS.find((p) => p.userId === userId && p.itemId === itemId);
}

export function getInProgressItems(userId: string): WatchProgress[] {
  return MOCK_USER_PROGRESS.filter(
    (p) => p.userId === userId && p.progressPercent > 0 && p.progressPercent < 100
  ).sort((a, b) => b.lastWatchedAt.getTime() - a.lastWatchedAt.getTime());
}

export function getCompletedItems(userId: string): WatchProgress[] {
  return MOCK_USER_PROGRESS.filter((p) => p.userId === userId && p.completedAt !== undefined);
}

export function hasAnyProgress(userId: string): boolean {
  return MOCK_USER_PROGRESS.some((p) => p.userId === userId && p.progressPercent > 0);
}
