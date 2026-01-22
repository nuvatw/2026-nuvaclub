import { BaseRepository } from './BaseRepository';
import type { MockDB } from '../core/MockDB';
import type {
  PostRecord,
  CommentRecord,
  PostCategory,
  VoteRecord,
  UserRecord,
} from '../schema';

export interface PostAuthor {
  id: string;
  name: string;
  avatar?: string;
  identityType: string;
}

export interface PostWithRelations extends PostRecord {
  author?: PostAuthor;
  tags?: string[];
  comments?: CommentWithAuthor[];
}

export interface CommentWithAuthor extends CommentRecord {
  author?: {
    id: string;
    name: string;
    avatar?: string;
  };
}

export class PostRepository extends BaseRepository<PostRecord> {
  constructor(db: MockDB) {
    super(db.posts, db);
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
  findByCategory(category: PostCategory): PostWithRelations[] {
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
    const posts = this.findMany({
      orderBy: { field: 'score', direction: 'desc' },
      limit,
    });
    return posts.map((p) => this.enrichPost(p, false));
  }

  /**
   * Get comments for a post
   */
  getComments(postId: string): CommentWithAuthor[] {
    const comments = this.db.comments.findMany({
      where: (c) => c.postId === postId && !c.isDeleted,
      orderBy: { field: 'createdAt', direction: 'asc' },
    });

    return comments.map((comment) => {
      const user = this.db.users.findById(comment.authorId);
      return {
        ...comment,
        author: user
          ? { id: user.id, name: user.name, avatar: user.avatar }
          : undefined,
      };
    });
  }

  /**
   * Add a vote to a post
   */
  vote(postId: string, userId: string, voteType: 'upvote' | 'downvote'): void {
    // Check for existing vote
    const existingVote = this.db.votes.findFirst({
      where: (v) =>
        v.targetType === 'post' && v.targetId === postId && v.userId === userId,
    });

    const post = this.findById(postId);
    if (!post) return;

    if (existingVote) {
      if (existingVote.voteType === voteType) {
        // Remove vote
        this.db.votes.delete(existingVote.id);
        if (voteType === 'upvote') {
          this.update(postId, {
            upvotes: post.upvotes - 1,
            score: post.score - 1,
          });
        } else {
          this.update(postId, {
            downvotes: post.downvotes - 1,
            score: post.score + 1,
          });
        }
      } else {
        // Change vote
        this.db.votes.update(existingVote.id, { voteType });
        if (voteType === 'upvote') {
          this.update(postId, {
            upvotes: post.upvotes + 1,
            downvotes: post.downvotes - 1,
            score: post.score + 2,
          });
        } else {
          this.update(postId, {
            upvotes: post.upvotes - 1,
            downvotes: post.downvotes + 1,
            score: post.score - 2,
          });
        }
      }
    } else {
      // New vote
      this.db.votes.create({
        userId,
        targetType: 'post',
        targetId: postId,
        voteType,
        createdAt: new Date(),
      });

      if (voteType === 'upvote') {
        this.update(postId, {
          upvotes: post.upvotes + 1,
          score: post.score + 1,
        });
      } else {
        this.update(postId, {
          downvotes: post.downvotes + 1,
          score: post.score - 1,
        });
      }
    }

    this.persist();
  }

  /**
   * Get user's vote on a post
   */
  getUserVote(postId: string, userId: string): 'upvote' | 'downvote' | null {
    const vote = this.db.votes.findFirst({
      where: (v) =>
        v.targetType === 'post' && v.targetId === postId && v.userId === userId,
    });
    return vote?.voteType ?? null;
  }

  /**
   * Enrich post with relations
   */
  private enrichPost(
    post: PostRecord,
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

    const tagRecords = this.db.postTags.findMany({
      where: { postId: post.id },
    });
    const tags = tagRecords.map((t) => t.tag);

    const result: PostWithRelations = {
      ...post,
      author,
      tags,
    };

    if (includeComments) {
      result.comments = this.getComments(post.id);
    }

    return result;
  }
}
