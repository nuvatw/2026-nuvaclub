import { IPostRepository } from '@/application/ports/IPostRepository';
import { BaseRepository } from './BaseRepository';
import type { MockDB } from '../core/MockDB';
import type {
  ForumPostRecord,
  ForumCommentRecord,
  ForumPostCategory,
  ForumVoteRecord,
  ForumPostStatsRecord,
} from '../schema';
import {
  computePostPoints,
  computeTrendingScore,
  filterTrendingNow,
} from '@/features/forum/utils/scoring';

export interface PostAuthor {
  id: string;
  name: string;
  avatar?: string;
  identityType: string;
}

export interface PostStats {
  upvotes: number;
  downvotes: number;
  score: number;
  commentCount: number;
  viewCount: number;
  bookmarkCount: number;
  shareCount: number;
  reportCount: number;
  postPoints: number;
  trendingScore: number;
}

export interface PostWithRelations extends ForumPostRecord {
  author?: PostAuthor;
  tags?: string[];
  comments?: CommentWithAuthor[];
  stats?: PostStats;
}

export interface CommentWithAuthor extends ForumCommentRecord {
  author?: {
    id: string;
    name: string;
    avatar?: string;
  };
  stats?: {
    upvotes: number;
    downvotes: number;
    score: number;
  };
}

export class PostRepository extends BaseRepository<ForumPostRecord> implements IPostRepository {
  constructor(db: MockDB) {
    super(db.forumPosts, db);
  }

  /**
   * Find post with all relations
   */
  findByIdWithRelations(id: string): PostWithRelations | undefined {
    const post = this.findById(id);
    if (!post) return undefined;

    return this.enrichPost(post, true);
  }

  /**
   * Find all posts with author info
   */
  findAllWithRelations(): PostWithRelations[] {
    const posts = this.findMany({
      orderBy: { field: 'createdAt', direction: 'desc' },
    });
    return posts.map((p) => this.enrichPost(p, false));
  }

  /**
   * Find recent posts
   */
  findRecent(limit = 10): PostWithRelations[] {
    const posts = this.findMany({
      orderBy: { field: 'createdAt', direction: 'desc' },
      limit,
    });
    return posts.map((p) => this.enrichPost(p, false));
  }

  /**
   * Find pinned posts
   */
  findPinned(): PostWithRelations[] {
    const posts = this.findMany({
      where: { isPinned: true },
      orderBy: { field: 'createdAt', direction: 'desc' },
    });
    return posts.map((p) => this.enrichPost(p, false));
  }

  /**
   * Find posts by category
   */
  findByCategory(category: ForumPostCategory): PostWithRelations[] {
    const posts = this.findMany({
      where: { category },
      orderBy: { field: 'createdAt', direction: 'desc' },
    });
    return posts.map((p) => this.enrichPost(p, false));
  }

  /**
   * Find popular posts (by score)
   */
  findPopular(limit = 10): PostWithRelations[] {
    // Get posts and sort by stats
    const posts = this.findAll();
    const enrichedPosts = posts.map((p) => this.enrichPost(p, false));

    // Sort by score from stats
    enrichedPosts.sort((a, b) => (b.stats?.score ?? 0) - (a.stats?.score ?? 0));

    return enrichedPosts.slice(0, limit);
  }

  /**
   * Get comments for a post
   */
  getComments(postId: string): CommentWithAuthor[] {
    const comments = this.db.forumComments.findMany({
      where: (c) => c.postId === postId && !c.isDeleted,
      orderBy: { field: 'createdAt', direction: 'asc' },
    });

    return comments.map((comment) => {
      const user = this.db.users.findById(comment.authorId);
      const commentStats = this.db.forumCommentStats.findFirst({
        where: { commentId: comment.id },
      });

      return {
        ...comment,
        author: user
          ? { id: user.id, name: user.name, avatar: user.avatar }
          : undefined,
        stats: commentStats
          ? {
            upvotes: commentStats.upvotes,
            downvotes: commentStats.downvotes,
            score: commentStats.score,
          }
          : undefined,
      };
    });
  }

  /**
   * Add a vote to a post
   */
  vote(postId: string, userId: string, voteType: 'upvote' | 'downvote'): void {
    // Check for existing vote
    const existingVote = this.db.forumVotes.findFirst({
      where: (v) =>
        v.targetType === 'post' && v.targetId === postId && v.userId === userId,
    });

    const postStats = this.db.forumPostStats.findFirst({
      where: { postId },
    });

    if (!postStats) return;

    if (existingVote) {
      if (existingVote.voteType === voteType) {
        // Remove vote
        this.db.forumVotes.delete(existingVote.id);
        if (voteType === 'upvote') {
          this.db.forumPostStats.update(postStats.postId, {
            upvotes: postStats.upvotes - 1,
            score: postStats.score - 1,
            lastUpdatedAt: new Date(),
          });
        } else {
          this.db.forumPostStats.update(postStats.postId, {
            downvotes: postStats.downvotes - 1,
            score: postStats.score + 1,
            lastUpdatedAt: new Date(),
          });
        }
      } else {
        // Change vote
        this.db.forumVotes.update(existingVote.id, { voteType });
        if (voteType === 'upvote') {
          this.db.forumPostStats.update(postStats.postId, {
            upvotes: postStats.upvotes + 1,
            downvotes: postStats.downvotes - 1,
            score: postStats.score + 2,
            lastUpdatedAt: new Date(),
          });
        } else {
          this.db.forumPostStats.update(postStats.postId, {
            upvotes: postStats.upvotes - 1,
            downvotes: postStats.downvotes + 1,
            score: postStats.score - 2,
            lastUpdatedAt: new Date(),
          });
        }
      }
    } else {
      // New vote
      const now = new Date();
      this.db.forumVotes.create({
        userId,
        targetType: 'post',
        targetId: postId,
        voteType,
        createdAt: now,
        updatedAt: now,
      });

      if (voteType === 'upvote') {
        this.db.forumPostStats.update(postStats.postId, {
          upvotes: postStats.upvotes + 1,
          score: postStats.score + 1,
          lastUpdatedAt: new Date(),
        });
      } else {
        this.db.forumPostStats.update(postStats.postId, {
          downvotes: postStats.downvotes + 1,
          score: postStats.score - 1,
          lastUpdatedAt: new Date(),
        });
      }
    }

    this.persist();
  }

  /**
   * Get user's vote on a post
   */
  getUserVote(postId: string, userId: string): 'upvote' | 'downvote' | null {
    const vote = this.db.forumVotes.findFirst({
      where: (v) =>
        v.targetType === 'post' && v.targetId === postId && v.userId === userId,
    });
    return vote?.voteType ?? null;
  }

  // ============================================================================
  // VIEW TRACKING
  // ============================================================================

  /**
   * Track a view on a post (deduplicated by user/session)
   */
  trackView(postId: string, userId?: string, sessionId?: string): boolean {
    // Check for existing view within the last 24 hours
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const existingView = this.db.forumPostViews.findFirst({
      where: (v) => {
        if (v.postId !== postId) return false;
        if (new Date(v.viewedAt) < yesterday) return false;

        if (userId && v.userId === userId) return true;
        if (sessionId && v.sessionId === sessionId) return true;
        return false;
      },
    });

    if (existingView) {
      return false; // Already viewed recently
    }

    // Record the view
    this.db.forumPostViews.create({
      postId,
      userId,
      sessionId,
      viewedAt: new Date(),
    });

    // Update view counts
    const stats = this.db.forumPostStats.findFirst({ where: { postId } });
    if (stats) {
      this.db.forumPostStats.update(stats.id, {
        viewCount: stats.viewCount + 1,
        uniqueViewCount24h: (stats.uniqueViewCount24h ?? 0) + 1,
        lastUpdatedAt: new Date(),
      });
    }

    this.persist();
    return true;
  }

  // ============================================================================
  // SHARE TRACKING
  // ============================================================================

  /**
   * Track a share event
   */
  trackShare(postId: string, userId: string): void {
    // Check if user already shared this post
    const existingShare = this.db.forumPostEvents.findFirst({
      where: (e) =>
        e.postId === postId && e.userId === userId && e.eventType === 'share',
    });

    if (existingShare) {
      return; // Already shared
    }

    // Record the share
    this.db.forumPostEvents.create({
      postId,
      userId,
      eventType: 'share',
      createdAt: new Date(),
    });

    // Update share count
    const stats = this.db.forumPostStats.findFirst({ where: { postId } });
    if (stats) {
      this.db.forumPostStats.update(stats.id, {
        shareCount: (stats.shareCount ?? 0) + 1,
        lastUpdatedAt: new Date(),
      });
    }

    this.persist();
  }

  // ============================================================================
  // BOOKMARK MANAGEMENT
  // ============================================================================

  /**
   * Toggle bookmark on a post
   */
  toggleBookmark(postId: string, userId: string): boolean {
    const existing = this.db.forumBookmarks.findFirst({
      where: (b) => b.postId === postId && b.userId === userId,
    });

    const stats = this.db.forumPostStats.findFirst({ where: { postId } });

    if (existing) {
      // Remove bookmark
      this.db.forumBookmarks.delete(existing.id);
      if (stats) {
        this.db.forumPostStats.update(stats.id, {
          bookmarkCount: Math.max(0, (stats.bookmarkCount ?? 0) - 1),
          lastUpdatedAt: new Date(),
        });
      }
      this.persist();
      return false; // No longer bookmarked
    } else {
      // Add bookmark
      this.db.forumBookmarks.create({
        postId,
        userId,
        createdAt: new Date(),
      });
      if (stats) {
        this.db.forumPostStats.update(stats.id, {
          bookmarkCount: (stats.bookmarkCount ?? 0) + 1,
          lastUpdatedAt: new Date(),
        });
      }
      this.persist();
      return true; // Now bookmarked
    }
  }

  /**
   * Check if user has bookmarked a post
   */
  isBookmarked(postId: string, userId: string): boolean {
    const bookmark = this.db.forumBookmarks.findFirst({
      where: (b) => b.postId === postId && b.userId === userId,
    });
    return !!bookmark;
  }

  /**
   * Get user's bookmarked posts
   */
  getUserBookmarks(userId: string): PostWithRelations[] {
    const bookmarks = this.db.forumBookmarks.findMany({
      where: { userId },
      orderBy: { field: 'createdAt', direction: 'desc' },
    });

    return bookmarks
      .map((b) => this.findById(b.postId))
      .filter((p): p is ForumPostRecord => !!p)
      .map((p) => this.enrichPost(p, false));
  }

  // ============================================================================
  // REPORTING
  // ============================================================================

  /**
   * Report a post
   */
  reportPost(postId: string, userId: string): boolean {
    // Check if user already reported this post
    const existingReport = this.db.forumPostEvents.findFirst({
      where: (e) =>
        e.postId === postId && e.userId === userId && e.eventType === 'report',
    });

    if (existingReport) {
      return false; // Already reported
    }

    // Record the report
    this.db.forumPostEvents.create({
      postId,
      userId,
      eventType: 'report',
      createdAt: new Date(),
    });

    // Update report count
    const stats = this.db.forumPostStats.findFirst({ where: { postId } });
    if (stats) {
      this.db.forumPostStats.update(stats.id, {
        reportCount: (stats.reportCount ?? 0) + 1,
        lastUpdatedAt: new Date(),
      });
    }

    this.persist();
    return true;
  }

  // ============================================================================
  // SCORE UPDATES
  // ============================================================================

  /**
   * Recompute postPoints and trendingScore for a post
   */
  updatePostScores(postId: string): void {
    const post = this.findById(postId);
    const stats = this.db.forumPostStats.findFirst({ where: { postId } });

    if (!post || !stats) return;

    // Get author's total points
    const authorPoints = this.db.userPoints.findFirst({
      where: { userId: post.authorId },
    });

    // Compute postPoints
    const postPoints = computePostPoints({
      upvotes: stats.upvotes,
      downvotes: stats.downvotes,
      commentCount: stats.commentCount,
      viewCount: stats.viewCount,
      bookmarkCount: stats.bookmarkCount ?? 0,
      shareCount: stats.shareCount ?? 0,
      reportCount: stats.reportCount ?? 0,
    });

    // Compute trendingScore
    const trendingScore = computeTrendingScore({
      stats: {
        upvotes: stats.upvotes,
        downvotes: stats.downvotes,
        commentCount: stats.commentCount,
        viewCount: stats.viewCount,
        bookmarkCount: stats.bookmarkCount ?? 0,
        shareCount: stats.shareCount ?? 0,
        reportCount: stats.reportCount ?? 0,
      },
      post: {
        category: post.category,
        createdAt: post.createdAt as any,
      },
      authorTotalPoints: authorPoints?.totalPoints ?? 0,
    });

    // Update stats
    this.db.forumPostStats.update(stats.id, {
      postPoints,
      trendingScore,
      trendingUpdatedAt: new Date(),
      lastUpdatedAt: new Date(),
    });

    this.persist();
  }

  /**
   * Update scores for all posts
   */
  updateAllPostScores(): void {
    const posts = this.findAll();
    for (const post of posts) {
      this.updatePostScores(post.id);
    }
  }

  // ============================================================================
  // TRENDING & FILTERED QUERIES
  // ============================================================================

  /**
   * Get trending posts with diversity rules
   */
  getTrending(limit = 5): PostWithRelations[] {
    // Get all non-deleted posts
    const posts = this.findMany({
      where: { isDeleted: false },
    });

    // Build candidate list with scores
    const candidates = posts.map((post) => {
      const stats = this.db.forumPostStats.findFirst({
        where: { postId: post.id },
      });
      return {
        postId: post.id,
        authorId: post.authorId,
        category: post.category,
        trendingScore: stats?.trendingScore ?? 0,
      };
    });

    // Apply diversity filter
    const filtered = filterTrendingNow(candidates, limit);

    // Return enriched posts
    return filtered
      .map((c) => this.findById(c.postId))
      .filter((p): p is ForumPostRecord => !!p)
      .map((p) => this.enrichPost(p, false));
  }

  /**
   * Get posts with sorting and filtering
   */
  getPostsSorted(
    sort: 'recent' | 'popular' | 'trending' | 'hot',
    timeFilter: 'all' | 'day' | 'week' | 'month' = 'all',
    category?: ForumPostCategory
  ): PostWithRelations[] {
    // Get time threshold
    const timeThresholds: Record<string, number> = {
      day: 24 * 60 * 60 * 1000,
      week: 7 * 24 * 60 * 60 * 1000,
      month: 30 * 24 * 60 * 60 * 1000,
    };
    const threshold = timeThresholds[timeFilter];
    const minDate = threshold ? new Date(Date.now() - threshold) : null;

    // Base query
    let posts = this.findMany({
      where: (p) => {
        if (p.isDeleted) return false;
        if (category && p.category !== category) return false;
        if (minDate && new Date(p.createdAt) < minDate) return false;
        return true;
      },
    });

    // Enrich posts
    let enriched = posts.map((p) => this.enrichPost(p, false));

    // Sort
    switch (sort) {
      case 'recent':
        enriched.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        break;
      case 'popular':
        enriched.sort(
          (a, b) => (b.stats?.postPoints ?? 0) - (a.stats?.postPoints ?? 0)
        );
        break;
      case 'trending':
        enriched.sort(
          (a, b) => (b.stats?.trendingScore ?? 0) - (a.stats?.trendingScore ?? 0)
        );
        break;
      case 'hot':
        // Hot = high engagement in short time (use comment count as proxy)
        enriched.sort(
          (a, b) => (b.stats?.commentCount ?? 0) - (a.stats?.commentCount ?? 0)
        );
        break;
    }

    // Always show pinned first
    const pinned = enriched.filter((p) => p.isPinned);
    const nonPinned = enriched.filter((p) => !p.isPinned);

    return [...pinned, ...nonPinned];
  }

  /**
   * Enrich post with relations
   */
  private enrichPost(
    post: ForumPostRecord,
    includeComments: boolean
  ): PostWithRelations {
    const user = this.db.users.findById(post.authorId);
    const author: PostAuthor | undefined = user
      ? {
        id: user.id,
        name: user.name,
        avatar: user.avatar,
        identityType: user.identityType,
      }
      : undefined;

    const tagRecords = this.db.forumPostTags.findMany({
      where: { postId: post.id },
    });
    const tags = tagRecords.map((t) => t.tag);

    // Get stats from separate table
    const postStats = this.db.forumPostStats.findFirst({
      where: { postId: post.id },
    });

    const result: PostWithRelations = {
      ...post,
      author,
      tags,
      stats: postStats
        ? {
          upvotes: postStats.upvotes,
          downvotes: postStats.downvotes,
          score: postStats.score,
          commentCount: postStats.commentCount,
          viewCount: postStats.viewCount,
          bookmarkCount: postStats.bookmarkCount ?? 0,
          shareCount: postStats.shareCount ?? 0,
          reportCount: postStats.reportCount ?? 0,
          postPoints: postStats.postPoints ?? 0,
          trendingScore: postStats.trendingScore ?? 0,
        }
        : undefined,
    };

    if (includeComments) {
      result.comments = this.getComments(post.id);
    }

    return result;
  }
}
