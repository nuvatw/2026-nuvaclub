'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import type { PostCategory } from '@/features/forum/types';
import type { IdentityType } from '@/features/auth/types';

// Local type definition
export interface ForumPost {
  id: string;
  title: string;
  content: string;
  category: PostCategory;
  createdAt: string | Date;
  isPinned?: boolean;
  tags?: string[];
  upvotes?: number;
  author?: {
    id: string;
    name: string;
    avatar?: string;
    identity?: IdentityType;
    identityType?: IdentityType; // Support both property names for compatibility
  };
  stats?: {
    upvotes?: number;
    downvotes?: number;
    viewCount?: number;
    commentCount?: number;
    score?: number;
    shareCount?: number;
  };
  comments?: Array<{
    id: string;
    content: string;
    createdAt: string;
    author?: {
      id: string;
      name: string;
      avatar?: string;
    };
    stats?: {
      score?: number;
    };
  }>;
}


/**
 * Hook to access forum post data via BFF
 */
export function usePosts() {
  const [allPosts, setAllPosts] = useState<ForumPost[]>([]);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let mounted = true;
    fetch('/api/bff/forum/posts')
      .then(res => res.json())
      .then(data => {
        if (mounted) {
          setAllPosts(Array.isArray(data) ? data : []);
          setIsReady(true);
        }
      })
      .catch(err => {
        console.error('Failed to fetch posts', err);
        if (mounted) setIsReady(true);
      });
    return () => { mounted = false; };
  }, []);

  const posts = allPosts;

  const pinnedPosts = useMemo(() =>
    posts.filter(p => p.isPinned),
    [posts]
  );

  const popularPosts = useMemo(() =>
    posts
      .sort((a, b) => (b.upvotes || 0) - (a.upvotes || 0))
      .slice(0, 10),
    [posts]
  );

  // Note: Vote is now write operation - should be a mutation via BFF POST
  const vote = useCallback(
    (postId: string, userId: string, voteType: 'upvote' | 'downvote') => {
      // TODO: Implement POST /api/bff/forum/posts/vote
      console.warn('Vote endpoint not yet implemented');
    },
    []
  );

  const getPostById = useCallback((id: string) => {
    return posts.find(p => p.id === id);
  }, [posts]);

  const getPostsByCategory = useCallback((category: PostCategory) => {
    return posts.filter(p => p.category === category);
  }, [posts]);

  const getRecentPosts = useCallback((limit?: number) => {
    const sorted = [...posts].sort((a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    return limit ? sorted.slice(0, limit) : sorted;
  }, [posts]);

  const getUserVote = useCallback((postId: string, userId: string) => {
    // TODO: Fetch from user votes endpoint
    return null;
  }, []);

  return {
    posts,
    pinnedPosts,
    popularPosts,
    isReady,
    getPostById,
    getPostsByCategory,
    getRecentPosts,
    vote,
    getUserVote,
  };
}

interface UsePostResult {
  post: ForumPost | undefined;
  isLoading: boolean;
}

/**
 * Hook to get a single post by ID via BFF
 */
export function usePost(postId: string): UsePostResult {
  const [post, setPost] = useState<ForumPost | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!postId) return;
    let mounted = true;

    fetch(`/api/bff/forum/posts?id=${postId}`)
      .then(res => {
        if (!res.ok) return null;
        return res.json();
      })
      .then(data => {
        if (mounted) {
          setPost(data || undefined);
          setIsLoading(false);
        }
      })
      .catch(err => {
        console.error(err);
        if (mounted) setIsLoading(false);
      });
    return () => { mounted = false; };
  }, [postId]);

  return { post, isLoading };
}
