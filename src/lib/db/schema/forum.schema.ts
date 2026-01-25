// ============================================================================
// FORUM MODULE - Database Schema
// Community discussions, posts, comments, and voting
// Following 3NF Normalization Principles
// ============================================================================

// ==========================================
// ENUMS & TYPES
// ==========================================
export type ForumPostCategory = 'discussion' | 'question' | 'resource' | 'announcement' | 'share';
export type PostCategory = ForumPostCategory; // Backward compatibility alias
export type VoteType = 'upvote' | 'downvote';

// ==========================================
// FORUM POSTS TABLE
// Main forum posts
// ==========================================
export interface ForumPostRecord {
  // Primary Key
  id: string;

  // Foreign Keys
  authorId: string; // FK -> users.id

  // Post Content
  title: string;
  content: string; // Markdown content
  category: ForumPostCategory;

  // Status Flags
  isPinned: boolean;
  isLocked: boolean;
  isDeleted: boolean; // Soft delete

  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

// Index: authorId, category, isPinned, isLocked, createdAt

// ==========================================
// FORUM POST STATS TABLE
// Denormalized statistics for posts
// ==========================================
export interface ForumPostStatsRecord {
  // Primary Key
  id: string; // Same as postId for 1:1 relationship

  // Foreign Keys
  postId: string; // FK -> forum_posts.id

  // Voting Statistics
  upvotes: number;
  downvotes: number;
  score: number; // Computed: upvotes - downvotes

  // Engagement Statistics
  viewCount: number;
  commentCount: number;
  bookmarkCount: number;
  shareCount: number;
  reportCount: number;

  // Rolling window stats for trending
  uniqueViewCount24h: number;

  // Computed scores
  postPoints: number; // Quality score
  trendingScore: number; // Time-decay trending score
  trendingUpdatedAt: Date;

  // Timestamps
  lastUpdatedAt: Date;
}

// Primary Key: postId

// ==========================================
// FORUM POST TAGS TABLE (Junction)
// Tags for forum posts - 1NF compliance
// ==========================================
export interface ForumPostTagRecord {
  // Primary Key
  id: string;

  // Foreign Keys
  postId: string; // FK -> forum_posts.id

  // Data
  tag: string;
}

// Unique Index: (postId, tag)
// Index: postId, tag

// ==========================================
// FORUM COMMENTS TABLE
// Comments on forum posts
// ==========================================
export interface ForumCommentRecord {
  // Primary Key
  id: string;

  // Foreign Keys
  postId: string; // FK -> forum_posts.id
  authorId: string; // FK -> users.id
  parentId?: string; // FK -> forum_comments.id (for nested replies)

  // Content
  content: string;

  // Soft Delete
  isDeleted: boolean;

  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

// Index: postId, authorId, parentId, createdAt

// ==========================================
// FORUM COMMENT STATS TABLE
// Denormalized statistics for comments
// ==========================================
export interface ForumCommentStatsRecord {
  // Primary Key
  id: string; // Same as commentId for 1:1 relationship

  // Foreign Keys
  commentId: string; // FK -> forum_comments.id

  // Voting Statistics
  upvotes: number;
  downvotes: number;
  score: number; // Computed: upvotes - downvotes

  // Timestamps
  lastUpdatedAt: Date;
}

// Primary Key: commentId

// ==========================================
// FORUM VOTES TABLE
// User votes on posts and comments
// Polymorphic design for both post and comment votes
// ==========================================
export interface ForumVoteRecord {
  // Primary Key
  id: string;

  // Foreign Keys
  userId: string; // FK -> users.id

  // Polymorphic Target
  targetType: 'post' | 'comment';
  targetId: string; // FK -> forum_posts.id or forum_comments.id

  // Vote
  voteType: VoteType;

  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

// Unique Index: (userId, targetType, targetId) - one vote per user per target
// Index: targetType, targetId, voteType

// ==========================================
// FORUM POST VIEWS TABLE
// Detailed view tracking (optional - for analytics)
// ==========================================
export interface ForumPostViewRecord {
  // Primary Key
  id: string;

  // Foreign Keys
  postId: string; // FK -> forum_posts.id
  userId?: string; // FK -> users.id (null for anonymous)

  // Session Info
  sessionId?: string; // For anonymous deduplication

  // Timestamps
  viewedAt: Date;
}

// Index: postId, userId, viewedAt

// ==========================================
// FORUM BOOKMARKS TABLE
// User bookmarked posts
// ==========================================
export interface ForumBookmarkRecord {
  // Primary Key
  id: string;

  // Foreign Keys
  userId: string; // FK -> users.id
  postId: string; // FK -> forum_posts.id

  // Timestamps
  createdAt: Date;
}

// Unique Index: (userId, postId)
// Index: userId, createdAt

// ==========================================
// FORUM POST EVENTS TABLE
// Tracks shares and reports on posts
// ==========================================
export type PostEventType = 'share' | 'report';

export interface ForumPostEventRecord {
  // Primary Key
  id: string;

  // Foreign Keys
  postId: string; // FK -> forum_posts.id
  userId: string; // FK -> users.id

  // Event Type
  eventType: PostEventType;

  // Timestamps
  createdAt: Date;
}

// Index: postId, userId, eventType, createdAt
