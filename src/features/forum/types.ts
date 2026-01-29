/**
 * Forum Feature Types
 *
 * Re-exports entity types from Database (canonical source)
 * and defines feature-specific types and UI constants.
 */

import type { IdentityType } from '@/features/auth/types';

// Re-export entity types from Database (canonical source)
export type { ForumPost, PostCategory, PostAuthor } from '@/lib/types/legacy-shim/forumPosts';
export type { Comment, CommentAuthor } from '@/lib/types/legacy-shim/comments';

// Alias for backward compatibility
export type { ForumPost as Post } from '@/lib/types/legacy-shim/forumPosts';

// Feature-specific UI constants
import type { PostCategory } from '@/lib/types/legacy-shim/forumPosts';

export const POST_CATEGORY_LABELS: Record<PostCategory, string> = {
  discussion: 'Discussion',
  question: 'Question',
  resource: 'Resource',
  announcement: 'Announcement',
  share: 'Share',
};

export const POST_CATEGORY_COLORS: Record<PostCategory, string> = {
  discussion: 'bg-blue-600/20 text-blue-400',
  question: 'bg-purple-600/20 text-purple-400',
  resource: 'bg-amber-600/20 text-amber-400',
  announcement: 'bg-red-600/20 text-red-400',
  share: 'bg-green-600/20 text-green-400',
};

export const POST_CATEGORY_ICONS: Record<PostCategory, string> = {
  discussion: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z',
  question: 'M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
  resource: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253',
  announcement: 'M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z',
  share: 'M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z',
};

// Feature-specific input type
export interface CreatePostInput {
  title: string;
  content: string;
  category: PostCategory;
  authorId: string;
  tags: string[];
}
