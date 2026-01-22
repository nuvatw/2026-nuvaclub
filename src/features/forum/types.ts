import type { IdentityType } from '@/features/auth/types';

export type PostCategory = 'discussion' | 'question' | 'share' | 'resource' | 'announcement';

export interface Post {
  id: string;
  title: string;
  content: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
    identity: IdentityType;
  };
  category: PostCategory;
  tags: string[];
  score: number;
  upvotes: number;
  downvotes: number;
  commentCount: number;
  viewCount: number;
  isPinned: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Comment {
  id: string;
  postId: string;
  content: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
  };
  score: number;
  parentId?: string;
  createdAt: Date;
}

export const POST_CATEGORY_LABELS: Record<PostCategory, string> = {
  discussion: 'Discussion',
  question: 'Question',
  share: 'Share',
  resource: 'Resource',
  announcement: 'Announcement',
};

export const POST_CATEGORY_COLORS: Record<PostCategory, string> = {
  discussion: 'bg-blue-600/20 text-blue-400',
  question: 'bg-purple-600/20 text-purple-400',
  share: 'bg-green-600/20 text-green-400',
  resource: 'bg-amber-600/20 text-amber-400',
  announcement: 'bg-red-600/20 text-red-400',
};

export interface CreatePostInput {
  title: string;
  content: string;
  category: PostCategory;
  authorId: string;
  tags: string[];
}
