'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'motion/react';
import { Button, Badge } from '@/components/atoms';
import { Gate } from '@/features/auth/components/Gate';
import { useAuth } from '@/features/auth/components/AuthProvider';
import { MOCK_POSTS, MOCK_COMMENTS } from '@/features/forum/data/posts';
import {
  POST_CATEGORY_LABELS,
  POST_CATEGORY_COLORS,
  POST_CATEGORY_ICONS,
  type PostCategory,
  type Post,
} from '@/features/forum/types';
import { IDENTITY_COLORS, IDENTITY_LABELS, type IdentityType } from '@/features/auth/types';
import { cn } from '@/lib/utils';
import { PageTransition } from '@/components/molecules/PageTransition';
import { ForumPageSkeleton } from '@/components/skeletons';
import { formatTimeAgo } from '@/lib/utils/date';

// ============================================================================
// TYPES & CONSTANTS
// ============================================================================

type SortOption = 'recent' | 'popular' | 'comments';
type TimeFilter = 'all' | 'day' | 'week' | 'month';

const CATEGORIES: (PostCategory | 'all')[] = [
  'all',
  'discussion',
  'question',
  'share',
  'resource',
  'announcement',
];

const TIME_FILTERS: { value: TimeFilter; label: string }[] = [
  { value: 'all', label: 'All Time' },
  { value: 'month', label: 'Past Month' },
  { value: 'week', label: 'Past Week' },
  { value: 'day', label: '24 Hours' },
];

const SORT_OPTIONS: { value: SortOption; label: string; icon: string }[] = [
  { value: 'recent', label: 'Latest', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
  { value: 'popular', label: 'Top', icon: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6' },
  { value: 'comments', label: 'Hot', icon: 'M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z' },
];

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function getTimeFilterDate(filter: TimeFilter): Date | null {
  if (filter === 'all') return null;
  const now = new Date();
  switch (filter) {
    case 'day':
      return new Date(now.getTime() - 24 * 60 * 60 * 1000);
    case 'week':
      return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    case 'month':
      return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    default:
      return null;
  }
}

// Get top contributors from comments and posts
function getTopContributors() {
  const contributorMap = new Map<string, {
    id: string;
    name: string;
    avatar?: string;
    identity: IdentityType;
    posts: number;
    comments: number;
    score: number;
  }>();

  // Count posts
  MOCK_POSTS.forEach(post => {
    const existing = contributorMap.get(post.author.id);
    if (existing) {
      existing.posts++;
      existing.score += post.score;
    } else {
      contributorMap.set(post.author.id, {
        id: post.author.id,
        name: post.author.name,
        avatar: post.author.avatar,
        identity: post.author.identity,
        posts: 1,
        comments: 0,
        score: post.score,
      });
    }
  });

  // Count comments
  MOCK_COMMENTS.forEach(comment => {
    const existing = contributorMap.get(comment.author.id);
    if (existing) {
      existing.comments++;
      existing.score += comment.score;
    } else {
      contributorMap.set(comment.author.id, {
        id: comment.author.id,
        name: comment.author.name,
        avatar: comment.author.avatar,
        identity: 'explorer' as IdentityType,
        posts: 0,
        comments: 1,
        score: comment.score,
      });
    }
  });

  return Array.from(contributorMap.values())
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);
}

// ============================================================================
// COMPONENTS
// ============================================================================

function TrendingPosts({ posts }: { posts: Post[] }) {
  const trending = posts.slice(0, 3);

  if (trending.length === 0) return null;

  return (
    <div className="bg-gradient-to-br from-primary-600/10 via-neutral-900 to-neutral-900 border border-neutral-800 rounded-xl p-5">
      <div className="flex items-center gap-2 mb-4">
        <div className="p-1.5 rounded-lg bg-primary-600/20">
          <svg className="w-4 h-4 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
          </svg>
        </div>
        <h3 className="font-semibold text-white">Trending Now</h3>
      </div>
      <div className="space-y-3">
        {trending.map((post, index) => (
          <Link
            key={post.id}
            href={`/forum/${post.id}`}
            className="flex items-start gap-3 group"
          >
            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-neutral-800 text-neutral-400 text-xs font-medium flex items-center justify-center">
              {index + 1}
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-neutral-200 group-hover:text-primary-400 transition-colors line-clamp-2">
                {post.title}
              </p>
              <div className="flex items-center gap-2 mt-1 text-xs text-neutral-500">
                <span>{post.score} points</span>
                <span>•</span>
                <span>{post.commentCount} replies</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

function TopContributors() {
  const contributors = getTopContributors();

  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5">
      <div className="flex items-center gap-2 mb-4">
        <div className="p-1.5 rounded-lg bg-amber-500/20">
          <svg className="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
          </svg>
        </div>
        <h3 className="font-semibold text-white">Top Contributors</h3>
      </div>
      <div className="space-y-3">
        {contributors.map((contributor, index) => (
          <div key={contributor.id} className="flex items-center gap-3">
            <div className="relative">
              {contributor.avatar ? (
                <Image
                  src={contributor.avatar}
                  alt={contributor.name}
                  width={36}
                  height={36}
                  className="rounded-full"
                />
              ) : (
                <div className="w-9 h-9 rounded-full bg-neutral-800 flex items-center justify-center text-neutral-400 text-sm font-medium">
                  {contributor.name.charAt(0)}
                </div>
              )}
              {index < 3 && (
                <div className={cn(
                  'absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold',
                  index === 0 && 'bg-amber-500 text-amber-950',
                  index === 1 && 'bg-neutral-400 text-neutral-900',
                  index === 2 && 'bg-amber-700 text-amber-100',
                )}>
                  {index + 1}
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-medium text-white truncate">{contributor.name}</span>
                <span className={cn('w-1.5 h-1.5 rounded-full', IDENTITY_COLORS[contributor.identity])} />
              </div>
              <div className="text-xs text-neutral-500">
                {contributor.score} points • {contributor.posts} posts
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function CategoryFilter({
  selected,
  onChange,
}: {
  selected: PostCategory | 'all';
  onChange: (category: PostCategory | 'all') => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {CATEGORIES.map((category) => {
        const isSelected = selected === category;
        const isAll = category === 'all';

        return (
          <button
            key={category}
            onClick={() => onChange(category)}
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all',
              isSelected
                ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/20'
                : 'bg-neutral-900 border border-neutral-800 text-neutral-300 hover:border-neutral-700 hover:bg-neutral-800'
            )}
          >
            {!isAll && (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={POST_CATEGORY_ICONS[category]} />
              </svg>
            )}
            {isAll ? 'All Posts' : POST_CATEGORY_LABELS[category]}
          </button>
        );
      })}
    </div>
  );
}

function PostCard({ post, index }: { post: Post; index: number }) {
  const [showCopied, setShowCopied] = useState(false);

  const handleShare = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const url = `${window.location.origin}/forum/${post.id}`;
    try {
      await navigator.clipboard.writeText(url);
      setShowCopied(true);
      setTimeout(() => setShowCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03 }}
    >
      <Link href={`/forum/${post.id}`} className="block">
        <div className={cn(
          'group bg-neutral-900 border border-neutral-800 rounded-xl p-4',
          'hover:border-neutral-700 hover:bg-neutral-800/50 transition-all',
          post.isPinned && 'border-l-2 border-l-amber-500'
        )}>
          <div className="flex gap-4">
            {/* Vote Section */}
            <div className="hidden sm:flex flex-col items-center gap-1 w-12 flex-shrink-0">
              <button
                onClick={(e) => e.preventDefault()}
                className="p-1 text-neutral-500 hover:text-green-400 hover:bg-green-400/10 rounded transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                </svg>
              </button>
              <span className={cn(
                'text-sm font-semibold',
                post.score > 0 ? 'text-green-400' : post.score < 0 ? 'text-red-400' : 'text-neutral-400'
              )}>
                {post.score}
              </span>
              <button
                onClick={(e) => e.preventDefault()}
                className="p-1 text-neutral-500 hover:text-red-400 hover:bg-red-400/10 rounded transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              {/* Header with badges */}
              <div className="flex flex-wrap items-center gap-2 mb-2">
                {post.isPinned && (
                  <Badge variant="warning" size="sm">
                    <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M5 5a2 2 0 012-2h6a2 2 0 012 2v2a2 2 0 01-2 2H7a2 2 0 01-2-2V5z" />
                      <path d="M7 10h6v7a1 1 0 01-1 1H8a1 1 0 01-1-1v-7z" />
                    </svg>
                    Pinned
                  </Badge>
                )}
                <span className={cn(
                  'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium',
                  POST_CATEGORY_COLORS[post.category]
                )}>
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={POST_CATEGORY_ICONS[post.category]} />
                  </svg>
                  {POST_CATEGORY_LABELS[post.category]}
                </span>
              </div>

              {/* Title */}
              <h3 className="text-base font-semibold text-white group-hover:text-primary-400 transition-colors mb-2 line-clamp-2">
                {post.title}
              </h3>

              {/* Preview */}
              <p className="text-sm text-neutral-400 line-clamp-2 mb-3">
                {post.content}
              </p>

              {/* Tags */}
              {post.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {post.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 rounded-md text-xs bg-neutral-800 text-neutral-400"
                    >
                      {tag}
                    </span>
                  ))}
                  {post.tags.length > 3 && (
                    <span className="text-xs text-neutral-500">+{post.tags.length - 3}</span>
                  )}
                </div>
              )}

              {/* Footer */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {/* Author */}
                  <div className="flex items-center gap-2">
                    {post.author.avatar && (
                      <Image
                        src={post.author.avatar}
                        alt={post.author.name}
                        width={24}
                        height={24}
                        className="rounded-full"
                      />
                    )}
                    <span className="text-sm text-neutral-300">{post.author.name}</span>
                    <span className={cn('w-1.5 h-1.5 rounded-full', IDENTITY_COLORS[post.author.identity])}
                          title={IDENTITY_LABELS[post.author.identity]} />
                  </div>
                  <span className="text-xs text-neutral-500">{formatTimeAgo(post.createdAt, 'en-US')}</span>
                </div>

                {/* Stats */}
                <div className="flex items-center gap-4 text-xs text-neutral-500">
                  <span className="sm:hidden font-medium text-neutral-300">{post.score}</span>
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    {post.commentCount}
                  </span>
                  <span className="hidden sm:flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    {post.viewCount}
                  </span>
                  <button
                    onClick={handleShare}
                    className="p-1 hover:text-primary-400 transition-colors relative"
                    title="Share"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                    </svg>
                    {showCopied && (
                      <span className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 text-xs bg-neutral-700 text-white rounded whitespace-nowrap z-10">
                        Copied!
                      </span>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

// ============================================================================
// MAIN PAGE
// ============================================================================

export default function ForumPage() {
  const { hasPermission } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState<PostCategory | 'all'>('all');
  const [sortBy, setSortBy] = useState<SortOption>('recent');
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter and sort posts
  const filteredPosts = useMemo(() => {
    return MOCK_POSTS.filter((post) => {
      // Category filter
      if (selectedCategory !== 'all' && post.category !== selectedCategory) {
        return false;
      }

      // Time filter
      const minDate = getTimeFilterDate(timeFilter);
      if (minDate && post.createdAt < minDate) {
        return false;
      }

      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          post.title.toLowerCase().includes(query) ||
          post.content.toLowerCase().includes(query) ||
          post.tags.some(tag => tag.toLowerCase().includes(query))
        );
      }

      return true;
    }).sort((a, b) => {
      // Always show pinned first
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;

      switch (sortBy) {
        case 'popular':
          return b.score - a.score;
        case 'comments':
          return b.commentCount - a.commentCount;
        case 'recent':
        default:
          return b.createdAt.getTime() - a.createdAt.getTime();
      }
    });
  }, [selectedCategory, sortBy, timeFilter, searchQuery]);

  // Get trending posts (by score)
  const trendingPosts = useMemo(() => {
    return [...MOCK_POSTS].sort((a, b) => b.score - a.score);
  }, []);

  return (
    <PageTransition skeleton={<ForumPageSkeleton />}>
      <div className="min-h-screen py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <div>
                <h1 className="text-3xl font-bold text-white mb-1">Community Forum</h1>
                <p className="text-neutral-400">
                  Share ideas, ask questions, and learn together
                </p>
              </div>
              <Gate
                permission="forum:post"
                fallback={
                  <Button variant="secondary" disabled className="shrink-0">
                    Traveler+ to post
                  </Button>
                }
              >
                <Link href="/forum/new">
                  <Button className="shrink-0">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    New Post
                  </Button>
                </Link>
              </Gate>
            </div>
          </motion.div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Left Sidebar - Filters (Desktop) */}
            <div className="hidden lg:block space-y-6">
              <TrendingPosts posts={trendingPosts} />
              <TopContributors />
            </div>

            {/* Main Feed */}
            <div className="lg:col-span-3 space-y-6">
              {/* Search & Filters */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="space-y-4"
              >
                {/* Search */}
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search discussions..."
                    className="w-full px-4 py-3 pl-11 rounded-xl bg-neutral-900 border border-neutral-800 text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all"
                  />
                  <svg
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-white transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>

                {/* Category Filter */}
                <CategoryFilter selected={selectedCategory} onChange={setSelectedCategory} />

                {/* Time Filter & Sort */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 bg-neutral-900 border border-neutral-800 rounded-xl">
                  {/* Time Filter */}
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-neutral-400">Time:</span>
                    <div className="flex gap-1 bg-neutral-800 rounded-lg p-1">
                      {TIME_FILTERS.map((option) => (
                        <button
                          key={option.value}
                          onClick={() => setTimeFilter(option.value)}
                          className={cn(
                            'px-3 py-1.5 rounded-md text-xs font-medium transition-colors',
                            timeFilter === option.value
                              ? 'bg-neutral-700 text-white'
                              : 'text-neutral-400 hover:text-white'
                          )}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="hidden sm:block w-px h-6 bg-neutral-700" />

                  {/* Sort */}
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-neutral-400">Sort:</span>
                    <div className="flex gap-1">
                      {SORT_OPTIONS.map((option) => (
                        <button
                          key={option.value}
                          onClick={() => setSortBy(option.value)}
                          className={cn(
                            'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors',
                            sortBy === option.value
                              ? 'bg-primary-600/20 text-primary-400'
                              : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
                          )}
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={option.icon} />
                          </svg>
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Mobile Sidebar Content */}
              <div className="lg:hidden grid grid-cols-1 sm:grid-cols-2 gap-4">
                <TrendingPosts posts={trendingPosts} />
                <TopContributors />
              </div>

              {/* Posts */}
              <div className="space-y-3">
                {filteredPosts.map((post, index) => (
                  <PostCard key={post.id} post={post} index={index} />
                ))}
              </div>

              {/* Empty State */}
              {filteredPosts.length === 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-16 bg-neutral-900 border border-neutral-800 rounded-xl"
                >
                  <div className="text-5xl mb-4">
                    {searchQuery ? '🔍' : '📭'}
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    {searchQuery ? 'No results found' : 'No posts yet'}
                  </h3>
                  <p className="text-neutral-400 mb-6 max-w-md mx-auto">
                    {searchQuery
                      ? `No discussions match "${searchQuery}". Try a different search term.`
                      : 'Be the first to start a discussion in this category!'}
                  </p>
                  {searchQuery ? (
                    <Button variant="secondary" onClick={() => setSearchQuery('')}>
                      Clear Search
                    </Button>
                  ) : (
                    <Gate permission="forum:post">
                      <Link href="/forum/new">
                        <Button>Create First Post</Button>
                      </Link>
                    </Gate>
                  )}
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
