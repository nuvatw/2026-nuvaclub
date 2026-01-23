'use client';

import { useMemo, useCallback } from 'react';
import { useDB } from '../provider/DBProvider';
import type {
  MatchingPostRecord,
  MatchingPostTagRecord,
  MatchingPostType,
  PriceType,
  NunuProfileRecord,
  NunuStatsRecord,
  MatchingPostStatsRecord,
} from '../schema';

export interface MatchingPostWithRelations extends MatchingPostRecord {
  tags: string[];
  commentCount: number;
  viewCount: number;
  author?: {
    id: string;
    name: string;
    avatar?: string;
    nunuLevel?: string;
    nunuType?: string;
    rating?: number;
  };
}

export interface MatchingPostFilters {
  type?: MatchingPostType;
  isVerifiedNunuOnly?: boolean;
  priceType?: PriceType;
  priceMin?: number;
  priceMax?: number;
  months?: string[];
  authorId?: string;
  isActive?: boolean;
  tags?: string[];
}

export type MatchingPostSortBy = 'newest' | 'oldest' | 'mostViews' | 'mostComments';

/**
 * Hook to access matching board posts - optimized with O(n) lookups
 */
export function useMatchingPosts(filters?: MatchingPostFilters, sortBy: MatchingPostSortBy = 'newest') {
  const db = useDB();

  // Get all posts with relations - optimized with pre-indexed lookups
  const allPosts = useMemo((): MatchingPostWithRelations[] => {
    if (!db) return [];

    const posts = db.matchingPosts.findAll();
    const tags = db.matchingPostTags.findAll();
    const comments = db.matchingComments.findAll();
    const postStats = db.matchingPostStats.findAll();

    // Pre-index tags by postId for O(1) lookup instead of O(n) filter per post
    const tagsByPostId = new Map<string, string[]>();
    for (const tag of tags) {
      const existing = tagsByPostId.get(tag.postId);
      if (existing) {
        existing.push(tag.tag);
      } else {
        tagsByPostId.set(tag.postId, [tag.tag]);
      }
    }

    // Pre-index comment counts by postId for O(1) lookup
    const commentCountByPostId = new Map<string, number>();
    for (const comment of comments) {
      commentCountByPostId.set(comment.postId, (commentCountByPostId.get(comment.postId) || 0) + 1);
    }

    // Pre-index post stats by postId for O(1) lookup
    const statsByPostId = new Map<string, MatchingPostStatsRecord>();
    for (const stat of postStats) {
      statsByPostId.set(stat.postId, stat);
    }

    // Collect unique author IDs and batch fetch users/profiles
    const authorIds = new Set(posts.map((p) => p.authorId));
    const usersMap = new Map<string, { id: string; name: string; avatar?: string }>();
    const profilesMap = new Map<string, NunuProfileRecord>();
    const nunuStatsMap = new Map<string, NunuStatsRecord>();

    for (const authorId of authorIds) {
      const user = db.users.findById(authorId);
      if (user) {
        usersMap.set(authorId, { id: user.id, name: user.name, avatar: user.avatar });
      }
      const profile = db.nunuProfiles.findFirst({ where: { userId: authorId } });
      if (profile) {
        profilesMap.set(authorId, profile);
        // Fetch nunu stats for rating
        const stats = db.nunuStats.findFirst({ where: { profileId: profile.id } });
        if (stats) {
          nunuStatsMap.set(authorId, stats);
        }
      }
    }

    // Build posts with relations using pre-indexed data
    return posts.map((post) => {
      const author = usersMap.get(post.authorId);
      const nunuProfile = profilesMap.get(post.authorId);
      const nunuStats = nunuStatsMap.get(post.authorId);
      const stats = statsByPostId.get(post.id);

      return {
        ...post,
        tags: tagsByPostId.get(post.id) || [],
        commentCount: stats?.commentCount ?? commentCountByPostId.get(post.id) ?? 0,
        viewCount: stats?.viewCount ?? 0,
        author: author
          ? {
              id: author.id,
              name: author.name,
              avatar: author.avatar,
              nunuLevel: nunuProfile?.level,
              nunuType: nunuProfile?.type,
              rating: nunuStats?.avgRating,
            }
          : undefined,
      };
    });
  }, [db]);

  // Apply filters
  const filteredPosts = useMemo(() => {
    if (!filters) return allPosts;

    return allPosts.filter((post) => {
      // Filter by type
      if (filters.type && post.type !== filters.type) return false;

      // Filter by verified nunu only
      if (filters.isVerifiedNunuOnly !== undefined && post.isVerifiedNunuOnly !== filters.isVerifiedNunuOnly) return false;

      // Filter by price type
      if (filters.priceType && post.priceType !== filters.priceType) return false;

      // Filter by price range (for fixed price posts)
      if (filters.priceMin !== undefined && post.priceAmount !== undefined) {
        if (post.priceAmount < filters.priceMin) return false;
      }
      if (filters.priceMax !== undefined && post.priceAmount !== undefined) {
        if (post.priceAmount > filters.priceMax) return false;
      }

      // Filter by available months (any match)
      if (filters.months && filters.months.length > 0) {
        const hasMatchingMonth = filters.months.some((m) => post.availableMonths?.includes(m));
        if (!hasMatchingMonth) return false;
      }

      // Filter by author
      if (filters.authorId && post.authorId !== filters.authorId) return false;

      // Filter by active status
      if (filters.isActive !== undefined && post.isActive !== filters.isActive) return false;

      // Filter by tags (any match)
      if (filters.tags && filters.tags.length > 0) {
        const hasMatchingTag = filters.tags.some((tag) => post.tags.includes(tag));
        if (!hasMatchingTag) return false;
      }

      return true;
    });
  }, [allPosts, filters]);

  // Sort posts
  const sortedPosts = useMemo(() => {
    const posts = [...filteredPosts];

    switch (sortBy) {
      case 'newest':
        return posts.sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      case 'oldest':
        return posts.sort(
          (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
      case 'mostViews':
        return posts.sort((a, b) => b.viewCount - a.viewCount);
      case 'mostComments':
        return posts.sort((a, b) => b.commentCount - a.commentCount);
      default:
        return posts;
    }
  }, [filteredPosts, sortBy]);

  // Get posts visible to a user based on their ticket type
  const getVisiblePosts = useCallback(
    (ticketType: 'go' | 'run' | 'fly' | null) => {
      if (ticketType === 'run' || ticketType === 'fly') {
        // Can see all posts
        return sortedPosts;
      }
      // Go users can't see verified-nunu-only posts
      return sortedPosts.filter((p) => !p.isVerifiedNunuOnly);
    },
    [sortedPosts]
  );

  // Get unique tags from all posts
  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    allPosts.forEach((post) => {
      post.tags.forEach((tag) => tagSet.add(tag));
    });
    return Array.from(tagSet).sort();
  }, [allPosts]);

  // Stats - computed in single pass instead of multiple filter iterations
  const stats = useMemo(() => {
    let active = 0;
    let nunuLookingForVava = 0;
    let vavaLookingForNunu = 0;

    for (const post of allPosts) {
      if (post.isActive) active++;
      switch (post.type) {
        case 'nunu-looking-for-vava':
          nunuLookingForVava++;
          break;
        case 'vava-looking-for-nunu':
          vavaLookingForNunu++;
          break;
      }
    }

    return { total: allPosts.length, active, nunuLookingForVava, vavaLookingForNunu };
  }, [allPosts]);

  return {
    posts: sortedPosts,
    allPosts,
    allTags,
    stats,
    isReady: !!db,
    getVisiblePosts,
    getPostById: (id: string) => allPosts.find((p) => p.id === id) ?? null,
    getPostsByAuthor: (authorId: string) => allPosts.filter((p) => p.authorId === authorId),
  };
}

/**
 * Hook to get a single matching post with full details
 */
export function useMatchingPost(postId: string): MatchingPostWithRelations | null {
  const db = useDB();

  return useMemo(() => {
    if (!db || !postId) return null;

    const post = db.matchingPosts.findById(postId);
    if (!post) return null;

    const tags = db.matchingPostTags.findMany({ where: { postId } }).map((t) => t.tag);
    const comments = db.matchingComments.findMany({ where: { postId } });
    const author = db.users.findById(post.authorId);
    const nunuProfile = db.nunuProfiles.findFirst({ where: { userId: post.authorId } });
    const nunuStats = nunuProfile
      ? db.nunuStats.findFirst({ where: { profileId: nunuProfile.id } })
      : null;
    const postStats = db.matchingPostStats.findFirst({ where: { postId } });

    return {
      ...post,
      tags,
      commentCount: postStats?.commentCount ?? comments.length,
      viewCount: postStats?.viewCount ?? 0,
      author: author
        ? {
            id: author.id,
            name: author.name,
            avatar: author.avatar,
            nunuLevel: nunuProfile?.level,
            nunuType: nunuProfile?.type,
            rating: nunuStats?.avgRating,
          }
        : undefined,
    };
  }, [db, postId]);
}

/**
 * Hook to check user's posting limits
 */
export function useMatchingPostLimits(userId?: string) {
  const db = useDB();

  const userPosts = useMemo(() => {
    if (!db || !userId) return [];
    return db.matchingPosts.findMany({ where: { authorId: userId, isActive: true } });
  }, [db, userId]);

  const canPostNunuLookingForVava = useMemo(() => {
    return !userPosts.some((p) => p.type === 'nunu-looking-for-vava');
  }, [userPosts]);

  const canPostVavaLookingForNunu = useMemo(() => {
    return !userPosts.some((p) => p.type === 'vava-looking-for-nunu');
  }, [userPosts]);

  const totalActivePosts = userPosts.length;

  return {
    userPosts,
    canPostNunuLookingForVava,
    canPostVavaLookingForNunu,
    totalActivePosts,
    maxPosts: 3,
    canPost: totalActivePosts < 3,
    isReady: !!db,
  };
}
