'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import type { MatchingPost as BaseMatchingPost } from '@/features/space/types';

export type MatchingPost = BaseMatchingPost;

export interface MatchingPostWithRelations extends MatchingPost {
  // BaseMatchingPost already has tags, viewCount, commentCount, but we can extend if needed.
}

export interface MatchingPostFilters {
  type?: string;
  isVerifiedNunuOnly?: boolean;
  priceType?: string;
  priceMin?: number;
  priceMax?: number;
  months?: string[];
  authorId?: string;
  isActive?: boolean;
  tags?: string[];
}

export type MatchingPostSortBy = 'newest' | 'oldest' | 'mostViews' | 'mostComments' | 'rating' | 'ratingLow' | 'reviews' | 'level' | 'mentoredMonthsHigh' | 'mentoredMonthsLow';

/**
 * Hook to access matching board posts via BFF
 */
export function useMatchingPosts(filters?: MatchingPostFilters, sortBy: MatchingPostSortBy = 'newest') {
  const [allPosts, setAllPosts] = useState<MatchingPostWithRelations[]>([]);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Build query params
    const params = new URLSearchParams();
    if (filters?.type) params.append('type', filters.type);
    if (filters?.authorId) params.append('authorId', filters.authorId);
    if (filters?.isActive !== undefined) params.append('isActive', String(filters.isActive));

    fetch(`/api/bff/space/matching/posts?${params.toString()}`)
      .then(r => r.json())
      .then(data => {
        setAllPosts(Array.isArray(data) ? data : []);
        setIsReady(true);
      })
      .catch(err => {
        console.error('Failed to fetch matching posts:', err);
        setIsReady(true);
      });
  }, [filters?.type, filters?.authorId, filters?.isActive]);

  // Client-side filtering for complex criteria
  const filteredPosts = useMemo(() => {
    if (!filters) return allPosts;

    return allPosts.filter(post => {
      if (filters.isVerifiedNunuOnly !== undefined && post.isVerifiedNunuOnly !== filters.isVerifiedNunuOnly) return false;
      if (filters.priceType && post.priceType !== filters.priceType) return false;
      if (filters.priceMin !== undefined && post.priceAmount !== undefined && post.priceAmount < filters.priceMin) return false;
      if (filters.priceMax !== undefined && post.priceAmount !== undefined && post.priceAmount > filters.priceMax) return false;
      if (filters.months && filters.months.length > 0) {
        const hasMatchingMonth = filters.months.some(m => post.availableMonths?.includes(m));
        if (!hasMatchingMonth) return false;
      }
      if (filters.tags && filters.tags.length > 0) {
        const hasMatchingTag = filters.tags.some(tag => post.tags.includes(tag));
        if (!hasMatchingTag) return false;
      }
      return true;
    });
  }, [allPosts, filters]);

  // Client-side sorting
  const sortedPosts = useMemo(() => {
    const posts = [...filteredPosts];

    switch (sortBy) {
      case 'newest':
        return posts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      case 'oldest':
        return posts.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
      case 'mostViews':
        return posts.sort((a, b) => b.viewCount - a.viewCount);
      case 'mostComments':
        return posts.sort((a, b) => b.commentCount - a.commentCount);
      case 'rating':
        return posts.sort((a, b) => (b.author?.rating ?? 0) - (a.author?.rating ?? 0));
      case 'ratingLow':
        return posts.sort((a, b) => (a.author?.rating ?? 0) - (b.author?.rating ?? 0));
      case 'reviews':
        return posts.sort((a, b) => (b.author?.totalRatings ?? 0) - (a.author?.totalRatings ?? 0));
      case 'mentoredMonthsHigh':
        return posts.sort((a, b) => (b.author?.mentoredMonths ?? 0) - (a.author?.mentoredMonths ?? 0));
      case 'mentoredMonthsLow':
        return posts.sort((a, b) => (a.author?.mentoredMonths ?? 0) - (b.author?.mentoredMonths ?? 0));
      default:
        return posts;
    }
  }, [filteredPosts, sortBy]);

  const getVisiblePosts = useCallback(
    (ticketType: 'go' | 'run' | 'fly' | null) => {
      if (ticketType === 'run' || ticketType === 'fly') {
        return sortedPosts;
      }
      return sortedPosts.filter(p => !p.isVerifiedNunuOnly);
    },
    [sortedPosts]
  );

  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    allPosts.forEach(post => {
      post.tags.forEach(tag => tagSet.add(tag));
    });
    return Array.from(tagSet).sort();
  }, [allPosts]);

  const stats = useMemo(() => {
    let active = 0;
    let nunuLookingForVava = 0;
    let vavaLookingForNunu = 0;

    for (const post of allPosts) {
      if (post.isActive) active++;
      if (post.type === 'nunu-looking-for-vava') nunuLookingForVava++;
      if (post.type === 'vava-looking-for-nunu') vavaLookingForNunu++;
    }

    return { total: allPosts.length, active, nunuLookingForVava, vavaLookingForNunu };
  }, [allPosts]);

  return {
    posts: sortedPosts,
    allPosts,
    allTags,
    stats,
    isReady,
    getVisiblePosts,
    getPostById: (id: string) => allPosts.find(p => p.id === id) ?? null,
    getPostsByAuthor: (authorId: string) => allPosts.filter(p => p.authorId === authorId),
  };
}

/**
 * Hook to get a single matching post
 */
export function useMatchingPost(postId: string): MatchingPostWithRelations | null {
  const { allPosts, isReady } = useMatchingPosts();

  if (!isReady) return null;
  return allPosts.find(p => p.id === postId) || null;
}

/**
 * Hook to check user's posting limits
 */
export function useMatchingPostLimits(userId?: string) {
  const { allPosts, isReady } = useMatchingPosts({ authorId: userId, isActive: true });

  const canPostNunuLookingForVava = useMemo(() => {
    return !allPosts.some(p => p.type === 'nunu-looking-for-vava');
  }, [allPosts]);

  const canPostVavaLookingForNunu = useMemo(() => {
    return !allPosts.some(p => p.type === 'vava-looking-for-nunu');
  }, [allPosts]);

  return {
    userPosts: allPosts,
    canPostNunuLookingForVava,
    canPostVavaLookingForNunu,
    totalActivePosts: allPosts.length,
    maxPosts: 3,
    canPost: allPosts.length < 3,
    isReady,
  };
}
