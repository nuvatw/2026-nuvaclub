'use client';

import { useMemo } from 'react';
import { useDB } from '../provider/DBProvider';
import { PostRepository, type PostWithRelations } from '@/infra/mock/repositories/PostRepository';
import type { ForumPostCategory } from '@/infra/mock/schema/forum.schema';

export type SortOption = 'recent' | 'popular' | 'trending' | 'hot';
export type TimeFilter = 'all' | 'day' | 'week' | 'month';

interface UsePostsFilteredOptions {
  sort?: SortOption;
  timeFilter?: TimeFilter;
  category?: ForumPostCategory;
  searchQuery?: string;
}

/**
 * Hook to get posts with sorting, time filtering, and category filtering
 */
export function usePostsFiltered(options: UsePostsFilteredOptions = {}) {
  const db = useDB();

  const {
    sort = 'recent',
    timeFilter = 'all',
    category,
    searchQuery,
  } = options;

  // Fetch posts from DB
  const allPosts = useMemo(() => {
    if (!db) {
      return [] as PostWithRelations[];
    }
    const repo = new PostRepository(db);
    return repo.getPostsSorted(sort, timeFilter, category);
  }, [db, sort, timeFilter, category]);

  // Apply search filter client-side
  const filteredPosts = useMemo(() => {
    if (!searchQuery?.trim()) {
      return allPosts;
    }

    const query = searchQuery.toLowerCase();
    return allPosts.filter((post) => {
      return (
        post.title.toLowerCase().includes(query) ||
        post.content.toLowerCase().includes(query) ||
        post.tags?.some((tag) => tag.toLowerCase().includes(query))
      );
    });
  }, [allPosts, searchQuery]);

  return {
    posts: filteredPosts,
    isLoading: !db,
    totalCount: filteredPosts.length,
  };
}
