/**
 * Forum Posts Table
 *
 * Contains forum discussion posts.
 * Uses canonical users (user-1 through user-10)
 */
import type { UserIdentity } from './users';

import {
  MOCK_POSTS as DEMO_POSTS,
  type ForumPost as DemoForumPost,
  type PostCategory as DemoPostCategory,
  type PostAuthor as DemoPostAuthor
} from '@/demo/forum-posts';

export type PostCategory = DemoPostCategory;
export type PostAuthor = DemoPostAuthor;
export type ForumPost = DemoForumPost;

export const ForumPostsTable: ForumPost[] = DEMO_POSTS;

// ============================================================
// Helper Functions
// ============================================================

export const getPostById = (id: string): ForumPost | undefined =>
  ForumPostsTable.find((p) => p.id === id);

export const getPinnedPosts = (): ForumPost[] =>
  ForumPostsTable.filter((p) => p.isPinned);

export const getRecentPosts = (): ForumPost[] =>
  [...ForumPostsTable].sort(
    (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
  );

export const getPostsByCategory = (category: PostCategory): ForumPost[] =>
  ForumPostsTable.filter((p) => p.category === category);

export const getPostsByTag = (tag: string): ForumPost[] =>
  ForumPostsTable.filter((p) => p.tags.includes(tag));

export const searchPosts = (query: string): ForumPost[] => {
  const lowerQuery = query.toLowerCase();
  return ForumPostsTable.filter(
    (p) =>
      p.title.toLowerCase().includes(lowerQuery) ||
      p.content.toLowerCase().includes(lowerQuery) ||
      p.tags.some((t) => t.toLowerCase().includes(lowerQuery))
  );
};

export const getAllPosts = (): ForumPost[] => ForumPostsTable;

// ============================================================
// Legacy Exports (for backward compatibility)
// ============================================================

/** @deprecated Use ForumPostsTable instead */
export const MOCK_POSTS = ForumPostsTable;

// Re-export type with legacy name
export type { ForumPost as Post };
