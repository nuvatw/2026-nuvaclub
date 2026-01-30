import { ForumPost } from '@/domain/types/forum';
import { IBaseRepository } from './IBaseRepository';
import { ForumPostCategory } from '@/domain/types/forum';

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

export interface PostWithRelations extends ForumPost {
    author?: PostAuthor;
    tags?: string[];
    stats?: PostStats;
    // Note: comments are usually fetched separately or on-demand
}

export interface IPostRepository extends IBaseRepository<ForumPost> {
    findByIdWithRelations(id: string): PostWithRelations | undefined;
    findAllWithRelations(): PostWithRelations[];
    findRecent(limit?: number): PostWithRelations[];
    findPinned(): PostWithRelations[];
    findByCategory(category: ForumPostCategory): PostWithRelations[];
    findPopular(limit?: number): PostWithRelations[];
    vote(postId: string, userId: string, voteType: 'upvote' | 'downvote'): void;
    getUserVote(postId: string, userId: string): 'upvote' | 'downvote' | null;
    trackView(postId: string, userId?: string, sessionId?: string): boolean;
    trackShare(postId: string, userId: string): void;
    toggleBookmark(postId: string, userId: string): boolean;
    isBookmarked(postId: string, userId: string): boolean;
    getUserBookmarks(userId: string): PostWithRelations[];
    reportPost(postId: string, userId: string): boolean;
    updatePostScores(postId: string): void;
}
