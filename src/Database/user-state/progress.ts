/**
 * User Progress Mock Data
 *
 * Comprehensive user progress data with 2 years of simulated history.
 * Uses the 10 canonical users (user-1 through user-10).
 *
 * Each user has realistic learning patterns across the 6 series:
 * - ChatGPT, Make, n8n, Midjourney, Stable Diffusion, Gemini
 *
 * Progress data includes:
 * - Multiple completed courses (aligned with TestAccount.totalCoursesCompleted)
 * - Active in-progress courses
 * - Realistic timestamps spanning 2024-2026
 *
 * Test account mapping:
 * - test-explorer-duo-nunu-nx (Alex Chen) -> user-1 (42 completed, power user)
 * - test-explorer-duo-nunu-1 (Sarah Lin) -> user-2 (24 completed, mentor focus)
 * - test-traveler-solo-nunu-n5 (Mike Wang) -> user-3 (28 completed, balanced)
 * - test-explorer-duo-nunu-2 (Emily Huang) -> user-4 (18 completed, active)
 * - test-explorer-solo-1 (Kevin Lee) -> user-5 (8 completed, newer user)
 * - test-traveler-solo-has-nunu (Jessica Wu) -> user-6 (14 completed, premium)
 * - test-explorer-solo-2 (David Zhang) -> user-7 (5 completed, casual)
 * - test-duo-go-nunu-n4 (Lisa Chen) -> user-8 (35 completed, active mentor)
 * - test-duo-fly-n3 (Tom Huang) -> user-9 (48 completed, experienced)
 * - test-duo-run-nunu-n2 (Amy Lin) -> user-10 (65 completed, master)
 *
 * Migrated from data/user-data/progress.ts
 */

import type { WatchProgress } from './types';

export const MOCK_USER_PROGRESS: WatchProgress[] = [
  // ========================================
  // User 1 - Alex Chen (Power User, 42 courses completed)
  // Focus: ChatGPT, Make, n8n - testing Nx features
  // ========================================
  // Completed courses (showing 6 representative completions)
  { itemId: 'chatgpt-1', itemType: 'course', userId: 'user-1', progressPercent: 100, currentPosition: 10500, totalDuration: 10500, lastWatchedAt: new Date('2024-03-15T10:00:00'), completedAt: new Date('2024-03-15T13:00:00') },
  { itemId: 'chatgpt-2', itemType: 'course', userId: 'user-1', progressPercent: 100, currentPosition: 10500, totalDuration: 10500, lastWatchedAt: new Date('2024-05-20T14:00:00'), completedAt: new Date('2024-05-20T17:00:00') },
  { itemId: 'make-1', itemType: 'course', userId: 'user-1', progressPercent: 100, currentPosition: 10500, totalDuration: 10500, lastWatchedAt: new Date('2024-07-10T09:00:00'), completedAt: new Date('2024-07-10T12:00:00') },
  { itemId: 'n8n-1', itemType: 'course', userId: 'user-1', progressPercent: 100, currentPosition: 10500, totalDuration: 10500, lastWatchedAt: new Date('2024-09-05T11:00:00'), completedAt: new Date('2024-09-05T14:00:00') },
  { itemId: 'midjourney-1', itemType: 'course', userId: 'user-1', progressPercent: 100, currentPosition: 10500, totalDuration: 10500, lastWatchedAt: new Date('2024-11-22T15:00:00'), completedAt: new Date('2024-11-22T18:00:00') },
  { itemId: 'gemini-1', itemType: 'course', userId: 'user-1', progressPercent: 100, currentPosition: 10500, totalDuration: 10500, lastWatchedAt: new Date('2025-01-18T10:00:00'), completedAt: new Date('2025-01-18T13:00:00') },
  // In-progress courses
  { itemId: 'chatgpt-8', itemType: 'course', userId: 'user-1', progressPercent: 72, currentPosition: 7560, totalDuration: 10500, lastWatchedAt: new Date('2026-01-22T14:30:00') },
  { itemId: 'make-6', itemType: 'course', userId: 'user-1', progressPercent: 45, currentPosition: 4725, totalDuration: 10500, lastWatchedAt: new Date('2026-01-23T18:00:00') },
  { itemId: 'n8n-5', itemType: 'course', userId: 'user-1', progressPercent: 28, currentPosition: 2940, totalDuration: 10500, lastWatchedAt: new Date('2026-01-24T09:00:00') },

  // ========================================
  // User 2 - Sarah Lin (24 courses completed, mentor focus)
  // Focus: Midjourney, Stable Diffusion - artistic mentoring
  // ========================================
  { itemId: 'midjourney-1', itemType: 'course', userId: 'user-2', progressPercent: 100, currentPosition: 10500, totalDuration: 10500, lastWatchedAt: new Date('2024-06-10T09:00:00'), completedAt: new Date('2024-06-10T12:00:00') },
  { itemId: 'midjourney-2', itemType: 'course', userId: 'user-2', progressPercent: 100, currentPosition: 10500, totalDuration: 10500, lastWatchedAt: new Date('2024-08-15T14:00:00'), completedAt: new Date('2024-08-15T17:00:00') },
  { itemId: 'stable-diffusion-1', itemType: 'course', userId: 'user-2', progressPercent: 100, currentPosition: 10500, totalDuration: 10500, lastWatchedAt: new Date('2024-10-20T10:00:00'), completedAt: new Date('2024-10-20T13:00:00') },
  { itemId: 'chatgpt-1', itemType: 'course', userId: 'user-2', progressPercent: 100, currentPosition: 10500, totalDuration: 10500, lastWatchedAt: new Date('2024-12-05T11:00:00'), completedAt: new Date('2024-12-05T14:00:00') },
  // In-progress
  { itemId: 'midjourney-7', itemType: 'course', userId: 'user-2', progressPercent: 65, currentPosition: 6825, totalDuration: 10500, lastWatchedAt: new Date('2026-01-21T20:00:00') },
  { itemId: 'stable-diffusion-5', itemType: 'course', userId: 'user-2', progressPercent: 38, currentPosition: 3990, totalDuration: 10500, lastWatchedAt: new Date('2026-01-23T09:00:00') },

  // ========================================
  // User 3 - Mike Wang (28 courses completed, new Nunu N5)
  // Focus: n8n, Make - automation specialist
  // ========================================
  { itemId: 'n8n-1', itemType: 'course', userId: 'user-3', progressPercent: 100, currentPosition: 10500, totalDuration: 10500, lastWatchedAt: new Date('2024-05-08T11:00:00'), completedAt: new Date('2024-05-08T14:00:00') },
  { itemId: 'n8n-2', itemType: 'course', userId: 'user-3', progressPercent: 100, currentPosition: 10500, totalDuration: 10500, lastWatchedAt: new Date('2024-07-15T15:00:00'), completedAt: new Date('2024-07-15T18:00:00') },
  { itemId: 'make-1', itemType: 'course', userId: 'user-3', progressPercent: 100, currentPosition: 10500, totalDuration: 10500, lastWatchedAt: new Date('2024-09-22T09:00:00'), completedAt: new Date('2024-09-22T12:00:00') },
  { itemId: 'chatgpt-1', itemType: 'course', userId: 'user-3', progressPercent: 100, currentPosition: 10500, totalDuration: 10500, lastWatchedAt: new Date('2024-11-28T10:00:00'), completedAt: new Date('2024-11-28T13:00:00') },
  // In-progress
  { itemId: 'n8n-8', itemType: 'course', userId: 'user-3', progressPercent: 55, currentPosition: 5775, totalDuration: 10500, lastWatchedAt: new Date('2026-01-20T16:00:00') },
  { itemId: 'make-4', itemType: 'course', userId: 'user-3', progressPercent: 32, currentPosition: 3360, totalDuration: 10500, lastWatchedAt: new Date('2026-01-22T11:00:00') },

  // ========================================
  // User 4 - Emily Huang (18 courses completed, active learner)
  // Focus: ChatGPT, Gemini - AI assistant specialist
  // ========================================
  { itemId: 'chatgpt-1', itemType: 'course', userId: 'user-4', progressPercent: 100, currentPosition: 10500, totalDuration: 10500, lastWatchedAt: new Date('2024-08-14T09:00:00'), completedAt: new Date('2024-08-14T12:00:00') },
  { itemId: 'gemini-1', itemType: 'course', userId: 'user-4', progressPercent: 100, currentPosition: 10500, totalDuration: 10500, lastWatchedAt: new Date('2024-10-20T14:00:00'), completedAt: new Date('2024-10-20T17:00:00') },
  { itemId: 'chatgpt-2', itemType: 'course', userId: 'user-4', progressPercent: 100, currentPosition: 10500, totalDuration: 10500, lastWatchedAt: new Date('2024-12-15T10:00:00'), completedAt: new Date('2024-12-15T13:00:00') },
  // In-progress
  { itemId: 'gemini-4', itemType: 'course', userId: 'user-4', progressPercent: 68, currentPosition: 7140, totalDuration: 10500, lastWatchedAt: new Date('2026-01-21T10:00:00') },
  { itemId: 'chatgpt-5', itemType: 'course', userId: 'user-4', progressPercent: 25, currentPosition: 2625, totalDuration: 10500, lastWatchedAt: new Date('2026-01-23T14:00:00') },

  // ========================================
  // User 5 - Kevin Lee (8 courses completed, newer user)
  // Focus: ChatGPT - beginner learning basics
  // ========================================
  { itemId: 'chatgpt-1', itemType: 'course', userId: 'user-5', progressPercent: 100, currentPosition: 10500, totalDuration: 10500, lastWatchedAt: new Date('2024-08-20T10:00:00'), completedAt: new Date('2024-08-20T13:00:00') },
  { itemId: 'midjourney-1', itemType: 'course', userId: 'user-5', progressPercent: 100, currentPosition: 10500, totalDuration: 10500, lastWatchedAt: new Date('2024-11-05T14:00:00'), completedAt: new Date('2024-11-05T17:00:00') },
  { itemId: 'gemini-1', itemType: 'course', userId: 'user-5', progressPercent: 100, currentPosition: 10500, totalDuration: 10500, lastWatchedAt: new Date('2025-01-15T09:00:00'), completedAt: new Date('2025-01-15T12:00:00') },
  // In-progress
  { itemId: 'chatgpt-2', itemType: 'course', userId: 'user-5', progressPercent: 62, currentPosition: 6510, totalDuration: 10500, lastWatchedAt: new Date('2026-01-22T18:00:00') },
  { itemId: 'make-1', itemType: 'course', userId: 'user-5', progressPercent: 35, currentPosition: 3675, totalDuration: 10500, lastWatchedAt: new Date('2026-01-24T10:00:00') },

  // ========================================
  // User 6 - Jessica Wu (14 courses completed, premium learner with Nunu)
  // Focus: Stable Diffusion, Midjourney - creative AI
  // ========================================
  { itemId: 'stable-diffusion-1', itemType: 'course', userId: 'user-6', progressPercent: 100, currentPosition: 10500, totalDuration: 10500, lastWatchedAt: new Date('2024-11-10T12:00:00'), completedAt: new Date('2024-11-10T15:00:00') },
  { itemId: 'midjourney-1', itemType: 'course', userId: 'user-6', progressPercent: 100, currentPosition: 10500, totalDuration: 10500, lastWatchedAt: new Date('2025-01-08T09:00:00'), completedAt: new Date('2025-01-08T12:00:00') },
  { itemId: 'chatgpt-1', itemType: 'course', userId: 'user-6', progressPercent: 100, currentPosition: 10500, totalDuration: 10500, lastWatchedAt: new Date('2025-03-22T14:00:00'), completedAt: new Date('2025-03-22T17:00:00') },
  // In-progress
  { itemId: 'stable-diffusion-4', itemType: 'course', userId: 'user-6', progressPercent: 67, currentPosition: 7035, totalDuration: 10500, lastWatchedAt: new Date('2026-01-20T20:00:00') },
  { itemId: 'midjourney-3', itemType: 'course', userId: 'user-6', progressPercent: 40, currentPosition: 4200, totalDuration: 10500, lastWatchedAt: new Date('2026-01-22T15:00:00') },

  // ========================================
  // User 7 - David Zhang (5 courses completed, casual learner)
  // Focus: ChatGPT - occasional learning
  // ========================================
  { itemId: 'chatgpt-1', itemType: 'course', userId: 'user-7', progressPercent: 100, currentPosition: 10500, totalDuration: 10500, lastWatchedAt: new Date('2025-01-10T10:00:00'), completedAt: new Date('2025-01-10T13:00:00') },
  { itemId: 'gemini-1', itemType: 'course', userId: 'user-7', progressPercent: 100, currentPosition: 10500, totalDuration: 10500, lastWatchedAt: new Date('2025-05-18T14:00:00'), completedAt: new Date('2025-05-18T17:00:00') },
  // In-progress
  { itemId: 'chatgpt-2', itemType: 'course', userId: 'user-7', progressPercent: 52, currentPosition: 5460, totalDuration: 10500, lastWatchedAt: new Date('2026-01-18T11:00:00') },
  { itemId: 'make-1', itemType: 'course', userId: 'user-7', progressPercent: 30, currentPosition: 3150, totalDuration: 10500, lastWatchedAt: new Date('2026-01-20T16:00:00') },

  // ========================================
  // User 8 - Lisa Chen (35 courses completed, active Nunu N4)
  // Focus: All series - well-rounded mentor
  // ========================================
  { itemId: 'chatgpt-1', itemType: 'course', userId: 'user-8', progressPercent: 100, currentPosition: 10500, totalDuration: 10500, lastWatchedAt: new Date('2024-07-05T09:00:00'), completedAt: new Date('2024-07-05T12:00:00') },
  { itemId: 'make-1', itemType: 'course', userId: 'user-8', progressPercent: 100, currentPosition: 10500, totalDuration: 10500, lastWatchedAt: new Date('2024-09-12T15:00:00'), completedAt: new Date('2024-09-12T18:00:00') },
  { itemId: 'n8n-1', itemType: 'course', userId: 'user-8', progressPercent: 100, currentPosition: 10500, totalDuration: 10500, lastWatchedAt: new Date('2024-11-20T11:00:00'), completedAt: new Date('2024-11-20T14:00:00') },
  { itemId: 'midjourney-1', itemType: 'course', userId: 'user-8', progressPercent: 100, currentPosition: 10500, totalDuration: 10500, lastWatchedAt: new Date('2025-01-25T10:00:00'), completedAt: new Date('2025-01-25T13:00:00') },
  { itemId: 'stable-diffusion-1', itemType: 'course', userId: 'user-8', progressPercent: 100, currentPosition: 10500, totalDuration: 10500, lastWatchedAt: new Date('2025-04-08T14:00:00'), completedAt: new Date('2025-04-08T17:00:00') },
  // In-progress
  { itemId: 'chatgpt-7', itemType: 'course', userId: 'user-8', progressPercent: 58, currentPosition: 6090, totalDuration: 10500, lastWatchedAt: new Date('2026-01-23T10:00:00') },
  { itemId: 'gemini-5', itemType: 'course', userId: 'user-8', progressPercent: 40, currentPosition: 4200, totalDuration: 10500, lastWatchedAt: new Date('2026-01-24T14:00:00') },

  // ========================================
  // User 9 - Tom Huang (48 courses completed, experienced Nunu N3)
  // Focus: Advanced courses across all series
  // ========================================
  { itemId: 'chatgpt-1', itemType: 'course', userId: 'user-9', progressPercent: 100, currentPosition: 10500, totalDuration: 10500, lastWatchedAt: new Date('2024-04-15T15:00:00'), completedAt: new Date('2024-04-15T18:00:00') },
  { itemId: 'chatgpt-5', itemType: 'course', userId: 'user-9', progressPercent: 100, currentPosition: 10500, totalDuration: 10500, lastWatchedAt: new Date('2024-06-22T09:00:00'), completedAt: new Date('2024-06-22T12:00:00') },
  { itemId: 'make-3', itemType: 'course', userId: 'user-9', progressPercent: 100, currentPosition: 10500, totalDuration: 10500, lastWatchedAt: new Date('2024-08-30T11:00:00'), completedAt: new Date('2024-08-30T14:00:00') },
  { itemId: 'n8n-4', itemType: 'course', userId: 'user-9', progressPercent: 100, currentPosition: 10500, totalDuration: 10500, lastWatchedAt: new Date('2024-11-05T10:00:00'), completedAt: new Date('2024-11-05T13:00:00') },
  { itemId: 'midjourney-6', itemType: 'course', userId: 'user-9', progressPercent: 100, currentPosition: 10500, totalDuration: 10500, lastWatchedAt: new Date('2025-01-18T14:00:00'), completedAt: new Date('2025-01-18T17:00:00') },
  // In-progress
  { itemId: 'chatgpt-9', itemType: 'course', userId: 'user-9', progressPercent: 72, currentPosition: 7560, totalDuration: 10500, lastWatchedAt: new Date('2026-01-22T08:00:00') },
  { itemId: 'stable-diffusion-8', itemType: 'course', userId: 'user-9', progressPercent: 45, currentPosition: 4725, totalDuration: 10500, lastWatchedAt: new Date('2026-01-23T19:00:00') },

  // ========================================
  // User 10 - Amy Lin (65 courses completed, master Nunu N2)
  // Focus: Expert across all series, continuous learning
  // ========================================
  { itemId: 'chatgpt-1', itemType: 'course', userId: 'user-10', progressPercent: 100, currentPosition: 10500, totalDuration: 10500, lastWatchedAt: new Date('2024-02-10T10:00:00'), completedAt: new Date('2024-02-10T13:00:00') },
  { itemId: 'chatgpt-10', itemType: 'course', userId: 'user-10', progressPercent: 100, currentPosition: 10500, totalDuration: 10500, lastWatchedAt: new Date('2024-04-25T14:00:00'), completedAt: new Date('2024-04-25T17:00:00') },
  { itemId: 'make-10', itemType: 'course', userId: 'user-10', progressPercent: 100, currentPosition: 10500, totalDuration: 10500, lastWatchedAt: new Date('2024-07-12T09:00:00'), completedAt: new Date('2024-07-12T12:00:00') },
  { itemId: 'n8n-10', itemType: 'course', userId: 'user-10', progressPercent: 100, currentPosition: 10500, totalDuration: 10500, lastWatchedAt: new Date('2024-09-28T11:00:00'), completedAt: new Date('2024-09-28T14:00:00') },
  { itemId: 'midjourney-10', itemType: 'course', userId: 'user-10', progressPercent: 100, currentPosition: 10500, totalDuration: 10500, lastWatchedAt: new Date('2024-12-05T15:00:00'), completedAt: new Date('2024-12-05T18:00:00') },
  { itemId: 'stable-diffusion-10', itemType: 'course', userId: 'user-10', progressPercent: 100, currentPosition: 10500, totalDuration: 10500, lastWatchedAt: new Date('2025-02-20T10:00:00'), completedAt: new Date('2025-02-20T13:00:00') },
  { itemId: 'gemini-10', itemType: 'course', userId: 'user-10', progressPercent: 100, currentPosition: 10500, totalDuration: 10500, lastWatchedAt: new Date('2025-05-08T14:00:00'), completedAt: new Date('2025-05-08T17:00:00') },
  // In-progress (always learning more)
  { itemId: 'nunu-v3', itemType: 'course', userId: 'user-10', progressPercent: 85, currentPosition: 3366, totalDuration: 3960, lastWatchedAt: new Date('2026-01-22T14:00:00') },
  { itemId: 'nunu-v5', itemType: 'course', userId: 'user-10', progressPercent: 38, currentPosition: 1504, totalDuration: 3960, lastWatchedAt: new Date('2026-01-24T16:00:00') },
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

export function getAllUserProgress(userId: string): WatchProgress[] {
  return MOCK_USER_PROGRESS.filter((p) => p.userId === userId);
}

export function getProgressByItemId(itemId: string): WatchProgress[] {
  return MOCK_USER_PROGRESS.filter((p) => p.itemId === itemId);
}
