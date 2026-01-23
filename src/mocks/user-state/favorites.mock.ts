import type { UserFavorite } from '@/data/types/user';

/**
 * User Favorites Mock Data
 *
 * Simulates user favorite items.
 * Uses canonical users (user-1 through user-10)
 */

export const MOCK_USER_FAVORITES: UserFavorite[] = [
  // User 1 - Alex Chen
  {
    userId: 'user-1',
    itemId: 'course-1',
    itemType: 'course',
    addedAt: new Date('2026-01-15T10:00:00'),
  },
  {
    userId: 'user-1',
    itemId: 'course-7',
    itemType: 'course',
    addedAt: new Date('2026-01-18T14:30:00'),
  },
  {
    userId: 'user-1',
    itemId: 'post-4',
    itemType: 'post',
    addedAt: new Date('2026-01-16T09:00:00'),
  },
  // User 2 - Sarah Lin
  {
    userId: 'user-2',
    itemId: 'course-3',
    itemType: 'course',
    addedAt: new Date('2026-01-12T16:00:00'),
  },
  {
    userId: 'user-2',
    itemId: 'post-1',
    itemType: 'post',
    addedAt: new Date('2026-01-14T11:00:00'),
  },
  // User 3 - Mike Wang
  {
    userId: 'user-3',
    itemId: 'course-5',
    itemType: 'course',
    addedAt: new Date('2026-01-10T08:00:00'),
  },
  {
    userId: 'user-3',
    itemId: 'post-2',
    itemType: 'post',
    addedAt: new Date('2026-01-15T15:30:00'),
  },
  // User 4 - Emily Huang
  {
    userId: 'user-4',
    itemId: 'course-6',
    itemType: 'course',
    addedAt: new Date('2026-01-08T13:00:00'),
  },
  {
    userId: 'user-4',
    itemId: 'course-8',
    itemType: 'course',
    addedAt: new Date('2026-01-12T09:00:00'),
  },
  // User 5 - Kevin Lee
  {
    userId: 'user-5',
    itemId: 'course-1',
    itemType: 'course',
    addedAt: new Date('2026-01-18T10:00:00'),
  },
  // User 6 - Jessica Wu
  {
    userId: 'user-6',
    itemId: 'course-4',
    itemType: 'course',
    addedAt: new Date('2026-01-11T14:00:00'),
  },
  {
    userId: 'user-6',
    itemId: 'post-3',
    itemType: 'post',
    addedAt: new Date('2026-01-17T11:00:00'),
  },
  // User 7 - David Zhang
  {
    userId: 'user-7',
    itemId: 'course-2',
    itemType: 'course',
    addedAt: new Date('2026-01-13T16:00:00'),
  },
  // User 8 - Lisa Chen
  {
    userId: 'user-8',
    itemId: 'course-5',
    itemType: 'course',
    addedAt: new Date('2026-01-09T12:00:00'),
  },
  {
    userId: 'user-8',
    itemId: 'post-4',
    itemType: 'post',
    addedAt: new Date('2026-01-19T08:00:00'),
  },
  // User 9 - Tom Huang
  {
    userId: 'user-9',
    itemId: 'course-7',
    itemType: 'course',
    addedAt: new Date('2026-01-14T17:00:00'),
  },
  // User 10 - Amy Lin
  {
    userId: 'user-10',
    itemId: 'course-8',
    itemType: 'course',
    addedAt: new Date('2026-01-07T10:00:00'),
  },
  {
    userId: 'user-10',
    itemId: 'post-2',
    itemType: 'post',
    addedAt: new Date('2026-01-16T14:00:00'),
  },
];

// Helper functions
export const getUserFavorites = (userId: string): UserFavorite[] =>
  MOCK_USER_FAVORITES.filter((f) => f.userId === userId);

export const getUserFavoritesByType = (userId: string, itemType: UserFavorite['itemType']): UserFavorite[] =>
  MOCK_USER_FAVORITES.filter((f) => f.userId === userId && f.itemType === itemType);

export const isItemFavorited = (userId: string, itemId: string): boolean =>
  MOCK_USER_FAVORITES.some((f) => f.userId === userId && f.itemId === itemId);

export const getFavoriteCount = (itemId: string): number =>
  MOCK_USER_FAVORITES.filter((f) => f.itemId === itemId).length;

export const getRecentFavorites = (userId: string, count: number = 5): UserFavorite[] =>
  getUserFavorites(userId)
    .sort((a, b) => b.addedAt.getTime() - a.addedAt.getTime())
    .slice(0, count);
