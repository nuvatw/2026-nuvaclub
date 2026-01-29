'use client';

import { useState, useEffect, useMemo } from 'react';
import type { ForumPost } from '@/lib/legacy-db-shim';

export type SortOption = 'recent' | 'popular' | 'trending' | 'hot';
export type TimeFilter = 'all' | 'day' | 'week' | 'month';
export type ForumPostCategory = 'announcement' | 'discussion' | 'question' | 'showcase';

interface UsePostsFilteredOptions {
  sort?: SortOption;
  timeFilter?: TimeFilter;
  category?: ForumPostCategory;
  searchQuery?: string;
}

/**
 * Hook to get posts with sorting, time filtering, and category filtering via BFF
 */
export function usePostsFiltered(options: UsePostsFilteredOptions = {}) {
  const [allPosts, setAllPosts] = useState<ForumPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const {
    sort = 'recent',
    timeFilter = 'all',
    category,
    searchQuery,
  } = options;

  // Fetch posts from BFF
  useEffect(() => {
    let mounted = true;
    setIsLoading(true);

    const params = new URLSearchParams();
    if (category) params.set('category', category);

    fetch(`/api/bff/forum/posts?${params}`)
      .then(res => res.json())
      .then(data => {
        if (mounted) {
          setAllPosts(Array.isArray(data) ? data : []);
          setIsLoading(false);
        }
      })
      .catch(err => {
        console.error('Failed to fetch posts', err);
        if (mounted) setIsLoading(false);
      });
    return () => { mounted = false; };
  }, [category]);

  // Apply sorting, time filtering, and search client-side
  const filteredPosts = useMemo(() => {
    let filtered = [...allPosts];

    // Time filter
    if (timeFilter !== 'all') {
      const now = new Date();
      const cutoff = new Date();
      if (timeFilter === 'day') cutoff.setDate(now.getDate() - 1);
      if (timeFilter === 'week') cutoff.setDate(now.getDate() - 7);
      if (timeFilter === 'month') cutoff.setMonth(now.getMonth() - 1);

      filtered = filtered.filter(post =>
        new Date(post.createdAt) >= cutoff
      );
    }

    // Search filter
    if (searchQuery?.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((post) => {
        return (
          post.title.toLowerCase().includes(query) ||
          post.content.toLowerCase().includes(query) ||
          post.tags?.some((tag) => tag.toLowerCase().includes(query))
        );
      });
    }

    // Sort
    filtered.sort((a, b) => {
      if (sort === 'recent') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      if (sort === 'popular') {
        return (b.upvotes || 0) - (a.upvotes || 0);
      }
      // 'trending' and 'hot' logic would need engagement metrics
      return 0;
    });

    return filtered;
  }, [allPosts, timeFilter, searchQuery, sort]);

  return {
    posts: filteredPosts,
    isLoading,
    totalCount: filteredPosts.length,
  };
}
