'use client';

import { useMemo, useCallback } from 'react';
import { useDB, useDBContext } from '../provider/DBProvider';
import { PostRepository, type PostWithRelations } from '@/infra/mock/repositories';
import type { ForumPostCategory } from '@/infra/mock/schema';

/**
 * Hook to access forum post data from the database
 */
export function usePosts() {
  const db = useDB();
  const { refresh } = useDBContext();

  const repo = useMemo(() => {
    if (!db) return null;
    return new PostRepository(db);
  }, [db]);

  const posts = useMemo(() => {
    if (!repo) return [];
    return repo.findAllWithRelations();
  }, [repo]);

  const pinnedPosts = useMemo(() => {
    if (!repo) return [];
    return repo.findPinned();
  }, [repo]);

  const popularPosts = useMemo(() => {
    if (!repo) return [];
    return repo.findPopular(10);
  }, [repo]);

  const vote = useCallback(
    (postId: string, userId: string, voteType: 'upvote' | 'downvote') => {
      if (!repo) return;
      repo.vote(postId, userId, voteType);
      refresh();
    },
    [repo, refresh]
  );

  return {
    posts,
    pinnedPosts,
    popularPosts,
    isReady: !!db,
    getPostById: (id: string) => repo?.findByIdWithRelations(id),
    getPostsByCategory: (category: ForumPostCategory) => repo?.findByCategory(category) ?? [],
    getRecentPosts: (limit?: number) => repo?.findRecent(limit) ?? [],
    vote,
    getUserVote: (postId: string, userId: string) => repo?.getUserVote(postId, userId) ?? null,
  };
}

interface UsePostResult {
  post: PostWithRelations | undefined;
  isLoading: boolean;
}

/**
 * Hook to get a single post by ID
 * Returns { post, isLoading } to distinguish between loading and not found states
 */
export function usePost(postId: string): UsePostResult {
  const db = useDB();

  return useMemo(() => {
    if (!db) {
      return { post: undefined, isLoading: true };
    }
    const repo = new PostRepository(db);
    const post = repo.findByIdWithRelations(postId);
    return { post, isLoading: false };
  }, [db, postId]);
}
