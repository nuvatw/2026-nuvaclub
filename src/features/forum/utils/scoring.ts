/**
 * Forum Scoring Utilities
 *
 * Implements PostPoints and TrendingScore algorithms per the spec.
 */

import type { PostStats as ForumPostStats, ForumPost, PostCategory as ForumPostCategory } from '../types';

// ============================================================================
// CONSTANTS
// ============================================================================

// PostPoints weights
export const POST_POINTS_WEIGHTS = {
  upvote: 10,
  downvote: -4,
  reply: 2,
  replyCap: 60, // min(replies * 2, 60)
  view: 0.05,
  viewCap: 20, // min(views * 0.05, 20)
  bookmark: 4,
  share: 6,
  shareCap: 60, // min(shares * 6, 60)
  report: -8,
} as const;

// TrendingScore weights (log-scaled engagement)
export const TRENDING_WEIGHTS = {
  upvote: 1.8,
  reply: 1.2,
  bookmark: 0.8,
  share: 1.0,
  view: 0.4,
  downvote: -1.5,
  report: -2.0,
} as const;

// Time decay half-life in hours
export const TRENDING_HALF_LIFE_HOURS = 18;

// Type boosts for trending
export const TYPE_BOOSTS: Record<ForumPostCategory, number> = {
  resource: 1.1,
  question: 1.05,
  discussion: 1.0,
  share: 1.0,
  announcement: 1.0,
};

// Author boost range
export const AUTHOR_BOOST = {
  divisor: 2000, // authorPoints / 2000
  min: 1.0,
  max: 1.2,
} as const;

// Trending diversity rules
export const TRENDING_DIVERSITY = {
  maxPostsPerAuthor: 2,
  minCategories: 2, // Try to include at least 2 different categories
} as const;

// ============================================================================
// POST POINTS CALCULATION
// ============================================================================

interface PostPointsInput {
  upvotes: number;
  downvotes: number;
  commentCount: number;
  viewCount: number;
  bookmarkCount: number;
  shareCount: number;
  reportCount: number;
}

/**
 * Compute post quality score
 *
 * Formula:
 * postPoints = upvotes*10 - downvotes*4 + min(replies*2, 60) +
 *              min(views*0.05, 20) + bookmarks*4 + min(shares*6, 60) - reports*8
 */
export function computePostPoints(stats: PostPointsInput): number {
  const w = POST_POINTS_WEIGHTS;

  const upvotePoints = stats.upvotes * w.upvote;
  const downvotePoints = stats.downvotes * Math.abs(w.downvote);
  const replyPoints = Math.min(stats.commentCount * w.reply, w.replyCap);
  const viewPoints = Math.min(stats.viewCount * w.view, w.viewCap);
  const bookmarkPoints = stats.bookmarkCount * w.bookmark;
  const sharePoints = Math.min(stats.shareCount * w.share, w.shareCap);
  const reportPoints = stats.reportCount * Math.abs(w.report);

  return Math.round(
    upvotePoints -
    downvotePoints +
    replyPoints +
    viewPoints +
    bookmarkPoints +
    sharePoints -
    reportPoints
  );
}

// ============================================================================
// TRENDING SCORE CALCULATION
// ============================================================================

interface TrendingInput {
  stats: Pick<ForumPostStats, 'upvotes' | 'downvotes' | 'commentCount' | 'viewCount' | 'bookmarkCount' | 'shareCount' | 'reportCount'>;
  post: Pick<ForumPost, 'category' | 'createdAt'>;
  authorTotalPoints: number;
}

/**
 * Compute trending score with time decay
 *
 * Formula:
 * engagement = 1.8*log1p(upvotes) + 1.2*log1p(replies) + 0.8*log1p(bookmarks) +
 *              1.0*log1p(shares) + 0.4*log1p(views) - 1.5*log1p(downvotes) - 2.0*log1p(reports)
 * freshness = 2^(-ageHours/18)
 * authorBoost = clamp(1 + authorPoints/2000, 1.0, 1.2)
 * typeBoost = 1.1 (resource), 1.05 (question), 1.0 (others)
 * trendingScore = engagement * freshness * authorBoost * typeBoost
 */
export function computeTrendingScore(input: TrendingInput): number {
  const { stats, post, authorTotalPoints } = input;
  const w = TRENDING_WEIGHTS;

  // Engagement score (log-scaled)
  const engagement =
    w.upvote * Math.log1p(stats.upvotes) +
    w.reply * Math.log1p(stats.commentCount) +
    w.bookmark * Math.log1p(stats.bookmarkCount) +
    w.share * Math.log1p(stats.shareCount) +
    w.view * Math.log1p(stats.viewCount) +
    w.downvote * Math.log1p(stats.downvotes) + // negative weight
    w.report * Math.log1p(stats.reportCount); // negative weight

  // Freshness (time decay)
  const ageMs = Date.now() - new Date(post.createdAt).getTime();
  const ageHours = ageMs / (1000 * 60 * 60);
  const freshness = Math.pow(2, -ageHours / TRENDING_HALF_LIFE_HOURS);

  // Author boost
  const rawAuthorBoost = 1 + authorTotalPoints / AUTHOR_BOOST.divisor;
  const authorBoost = Math.max(
    AUTHOR_BOOST.min,
    Math.min(AUTHOR_BOOST.max, rawAuthorBoost)
  );

  // Type boost
  const typeBoost = TYPE_BOOSTS[post.category] ?? 1.0;

  // Final score
  return engagement * freshness * authorBoost * typeBoost;
}

// ============================================================================
// TRENDING DIVERSITY FILTER
// ============================================================================

interface TrendingCandidate {
  postId: string;
  authorId: string;
  category: ForumPostCategory;
  trendingScore: number;
}

/**
 * Filter trending posts applying diversity rules:
 * - Max 2 posts per author
 * - Try to ensure at least 2 different categories in the result
 */
export function filterTrendingNow(
  candidates: TrendingCandidate[],
  limit: number
): TrendingCandidate[] {
  // Sort by trending score descending
  const sorted = [...candidates].sort((a, b) => b.trendingScore - a.trendingScore);

  const result: TrendingCandidate[] = [];
  const authorCounts = new Map<string, number>();
  const categoriesIncluded = new Set<ForumPostCategory>();

  // First pass: add posts respecting author limit
  for (const candidate of sorted) {
    if (result.length >= limit) break;

    const authorCount = authorCounts.get(candidate.authorId) || 0;
    if (authorCount >= TRENDING_DIVERSITY.maxPostsPerAuthor) {
      continue;
    }

    result.push(candidate);
    authorCounts.set(candidate.authorId, authorCount + 1);
    categoriesIncluded.add(candidate.category);
  }

  // Check if we need more category diversity
  if (
    categoriesIncluded.size < TRENDING_DIVERSITY.minCategories &&
    result.length < limit
  ) {
    // Try to find posts from underrepresented categories
    const existingIds = new Set(result.map((r) => r.postId));
    for (const candidate of sorted) {
      if (result.length >= limit) break;
      if (existingIds.has(candidate.postId)) continue;

      // Only add if it brings a new category
      if (!categoriesIncluded.has(candidate.category)) {
        const authorCount = authorCounts.get(candidate.authorId) || 0;
        if (authorCount < TRENDING_DIVERSITY.maxPostsPerAuthor) {
          result.push(candidate);
          authorCounts.set(candidate.authorId, authorCount + 1);
          categoriesIncluded.add(candidate.category);
        }
      }
    }
  }

  // Re-sort result by trending score
  return result.sort((a, b) => b.trendingScore - a.trendingScore);
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Get hours since a date
 */
export function getHoursSince(date: Date): number {
  return (Date.now() - new Date(date).getTime()) / (1000 * 60 * 60);
}

/**
 * Check if a post is still "fresh" (within half-life window)
 */
export function isPostFresh(createdAt: Date): boolean {
  return getHoursSince(createdAt) < TRENDING_HALF_LIFE_HOURS * 2;
}
