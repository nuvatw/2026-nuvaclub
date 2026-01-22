// ==========================================
// Posts Table
// ==========================================
export type PostCategory = 'discussion' | 'question' | 'share' | 'resource' | 'announcement';

export interface PostRecord {
  id: string;
  title: string;
  content: string; // markdown
  authorId: string;
  category: PostCategory;
  upvotes: number;
  downvotes: number;
  score: number; // computed: upvotes - downvotes
  viewCount: number;
  commentCount: number; // denormalized
  isPinned: boolean;
  isLocked: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// ==========================================
// Post Tags Table (junction)
// ==========================================
export interface PostTagRecord {
  id: string;
  postId: string;
  tag: string;
}

// ==========================================
// Comments Table
// ==========================================
export interface CommentRecord {
  id: string;
  postId: string;
  parentId?: string; // for nested replies
  authorId: string;
  content: string;
  upvotes: number;
  downvotes: number;
  score: number; // computed: upvotes - downvotes
  isDeleted: boolean; // soft delete
  createdAt: Date;
  updatedAt: Date;
}

// ==========================================
// Votes Table (for posts and comments)
// ==========================================
export type VoteTargetType = 'post' | 'comment';
export type VoteType = 'upvote' | 'downvote';

export interface VoteRecord {
  id: string;
  userId: string;
  targetType: VoteTargetType;
  targetId: string;
  voteType: VoteType;
  createdAt: Date;
}
