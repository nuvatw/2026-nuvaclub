/**
 * User Points Utilities
 *
 * Point values, daily caps, and quality gates for the reputation system.
 */

import type { PointActionType, PointCategory } from '@/lib/db/schema/user.schema';

// ============================================================================
// POINT VALUES
// ============================================================================

// Learning points
export const LEARNING_POINTS = {
  lesson_complete: 10,
  course_complete: 50,
  quiz_pass: 25,
} as const;

// Community points
export const COMMUNITY_POINTS = {
  post_create: 15,
  reply_create: 5,
  upvote_received: 2,
  downvote_received: -1,
} as const;

// ============================================================================
// DAILY CAPS
// ============================================================================

export const DAILY_CAPS = {
  learning: 300, // Max learning points per day
  community: 200, // Max community points per day
  upvotes: 50, // Max points from upvotes received per day (sub-cap of community)
} as const;

// ============================================================================
// QUALITY GATES
// ============================================================================

export const QUALITY_GATES = {
  minPostTitleLength: 10,
  minPostContentLength: 50,
  minCommentLength: 10,
} as const;

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Get point value for an action
 */
export function getPointValue(actionType: PointActionType): number {
  switch (actionType) {
    case 'lesson_complete':
      return LEARNING_POINTS.lesson_complete;
    case 'course_complete':
      return LEARNING_POINTS.course_complete;
    case 'quiz_pass':
      return LEARNING_POINTS.quiz_pass;
    case 'post_create':
      return COMMUNITY_POINTS.post_create;
    case 'reply_create':
      return COMMUNITY_POINTS.reply_create;
    case 'upvote_received':
      return COMMUNITY_POINTS.upvote_received;
    case 'downvote_received':
      return COMMUNITY_POINTS.downvote_received;
    default:
      return 0;
  }
}

/**
 * Get category for an action type
 */
export function getCategoryForAction(actionType: PointActionType): PointCategory {
  switch (actionType) {
    case 'lesson_complete':
    case 'course_complete':
    case 'quiz_pass':
      return 'learning';
    case 'post_create':
    case 'reply_create':
    case 'upvote_received':
    case 'downvote_received':
      return 'community';
    default:
      return 'community';
  }
}

/**
 * Check if an action is subject to the upvote sub-cap
 */
export function isUpvoteAction(actionType: PointActionType): boolean {
  return actionType === 'upvote_received';
}

/**
 * Calculate points with cap enforcement
 *
 * Returns: { actualPoints, wasCapped }
 */
export function calculatePointsWithCap(
  requestedPoints: number,
  currentDailyPoints: number,
  dailyCap: number
): { actualPoints: number; wasCapped: boolean } {
  // Handle negative points (no cap on penalties)
  if (requestedPoints < 0) {
    return { actualPoints: requestedPoints, wasCapped: false };
  }

  const remainingCap = Math.max(0, dailyCap - currentDailyPoints);
  const actualPoints = Math.min(requestedPoints, remainingCap);
  const wasCapped = actualPoints < requestedPoints;

  return { actualPoints, wasCapped };
}

/**
 * Check if post meets quality gate for points
 */
export function meetsPostQualityGate(
  title: string,
  content: string
): boolean {
  return (
    title.trim().length >= QUALITY_GATES.minPostTitleLength &&
    content.trim().length >= QUALITY_GATES.minPostContentLength
  );
}

/**
 * Check if comment meets quality gate for points
 */
export function meetsCommentQualityGate(content: string): boolean {
  return content.trim().length >= QUALITY_GATES.minCommentLength;
}

/**
 * Check if daily reset is needed
 */
export function needsDailyReset(lastReset: Date): boolean {
  const now = new Date();
  const lastResetDate = new Date(lastReset);

  // Reset at midnight UTC
  const nowUTCDate = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())
  );
  const lastResetUTCDate = new Date(
    Date.UTC(
      lastResetDate.getUTCFullYear(),
      lastResetDate.getUTCMonth(),
      lastResetDate.getUTCDate()
    )
  );

  return nowUTCDate > lastResetUTCDate;
}

/**
 * Get start of current UTC day
 */
export function getStartOfUTCDay(): Date {
  const now = new Date();
  return new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())
  );
}
