export type ForumPostCategory = 'discussion' | 'question' | 'resource' | 'announcement' | 'share';
export type VoteType = 'upvote' | 'downvote';

export interface ForumPost {
    id: string;
    authorId: string;
    title: string;
    content: string;
    category: ForumPostCategory;
    isPinned: boolean;
    isLocked: boolean;
    isDeleted: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface ForumPostStats {
    id: string;
    postId: string;
    upvotes: number;
    downvotes: number;
    score: number;
    viewCount: number;
    commentCount: number;
    bookmarkCount: number;
    shareCount: number;
    reportCount: number;
    uniqueViewCount24h: number;
    postPoints: number;
    trendingScore: number;
    trendingUpdatedAt: Date;
    lastUpdatedAt: Date;
}

export interface ForumPostTag {
    id: string;
    postId: string;
    tag: string;
}

export interface ForumComment {
    id: string;
    postId: string;
    authorId: string;
    parentId?: string;
    content: string;
    isDeleted: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface ForumCommentStats {
    id: string;
    commentId: string;
    upvotes: number;
    downvotes: number;
    score: number;
    lastUpdatedAt: Date;
}

export interface ForumVote {
    id: string;
    userId: string;
    targetType: 'post' | 'comment';
    targetId: string;
    voteType: VoteType;
    createdAt: Date;
    updatedAt: Date;
}

export interface ForumPostView {
    id: string;
    postId: string;
    userId?: string;
    sessionId?: string;
    viewedAt: Date;
}

export interface ForumBookmark {
    id: string;
    userId: string;
    postId: string;
    createdAt: Date;
}

export type PostEventType = 'share' | 'report';

export interface ForumPostEvent {
    id: string;
    postId: string;
    userId: string;
    eventType: PostEventType;
    createdAt: Date;
}
