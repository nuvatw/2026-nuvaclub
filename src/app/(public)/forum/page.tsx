'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'motion/react';
import { Button, Badge } from '@/components/atoms';
import {
  FireIcon,
  SparklesIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  PinIcon,
  ChatBubbleIcon,
  EyeIcon,
  BookmarkIcon,
  BookmarkSolidIcon,
  ShareIcon,
  PlusIcon,
  SearchIcon,
  XIcon,
  Icon,
  MoreHorizontalIcon,
} from '@/components/icons';
import { Gate } from '@/features/auth/components/Gate';
import { useAuth } from '@/features/auth/components/AuthProvider';
import {
  useTrendingPosts,
  usePostsFiltered,
  useLeaderboard,
  useShare,
  useBookmark,
  type SortOption,
  type TimeFilter,
} from '@/lib/db/hooks';
import type { PostWithRelations } from '@/lib/db/repositories/PostRepository';
import {
  POST_CATEGORY_LABELS,
  POST_CATEGORY_COLORS,
  type PostCategory,
} from '@/features/forum/types';
import { IDENTITY_COLORS, IDENTITY_LABELS, type IdentityType } from '@/features/auth/types';
import type { ForumPostCategory } from '@/lib/db/schema/forum.schema';
import { cn } from '@/lib/utils';
import { PageTransition } from '@/components/molecules/PageTransition';
import { ForumPageSkeleton } from '@/components/skeletons';
import { formatTimeAgo } from '@/lib/utils/date';

// ============================================================================
// DESIGN TOKENS (Reddit-inspired)
// ============================================================================

const REDDIT_COLORS = {
  // Surface colors
  pageBg: 'bg-[#030303]',
  cardBg: 'bg-[#1a1a1b]',
  cardBgHover: 'hover:bg-[#252526]',
  cardBorder: 'border-[#343536]',
  cardBorderHover: 'hover:border-[#4a4a4b]',

  // Vote colors
  upvote: 'text-[#ff4500]',
  upvoteHover: 'hover:text-[#ff4500] hover:bg-[#ff4500]/10',
  downvote: 'text-[#7193ff]',
  downvoteHover: 'hover:text-[#7193ff] hover:bg-[#7193ff]/10',

  // Text colors
  textPrimary: 'text-[#d7dadc]',
  textSecondary: 'text-[#818384]',
  textMuted: 'text-[#6b6c6d]',

  // Interactive
  linkHover: 'hover:text-[#d7dadc]',
  actionHover: 'hover:bg-[#272729]',
};

// ============================================================================
// TYPES & CONSTANTS
// ============================================================================

const CATEGORIES: { value: PostCategory | 'all'; label: string }[] = [
  { value: 'all', label: 'All Posts' },
  { value: 'discussion', label: 'Discussion' },
  { value: 'question', label: 'Question' },
  { value: 'share', label: 'Share' },
  { value: 'resource', label: 'Resource' },
  { value: 'announcement', label: 'Announcement' },
];

const TIME_FILTERS: { value: TimeFilter; label: string }[] = [
  { value: 'all', label: 'All Time' },
  { value: 'month', label: 'Past Month' },
  { value: 'week', label: 'Past Week' },
  { value: 'day', label: '24 Hours' },
];

const SORT_OPTIONS: { value: SortOption; label: string; icon: 'clock' | 'trending-up' | 'fire' }[] = [
  { value: 'hot', label: 'Hot', icon: 'fire' },
  { value: 'recent', label: 'New', icon: 'clock' },
  { value: 'popular', label: 'Top', icon: 'trending-up' },
];

// ============================================================================
// LEFT SIDEBAR COMPONENTS
// ============================================================================

function TrendingCard() {
  const { posts, isLoading } = useTrendingPosts(3);

  return (
    <div className="bg-[#1a1a1b] border border-[#343536] rounded-[4px] overflow-hidden">
      {/* Card Header */}
      <div className="px-3 py-2.5 bg-gradient-to-r from-primary-600/20 to-transparent border-b border-[#343536]">
        <div className="flex items-center gap-2">
          <FireIcon size="sm" className="text-primary-400" />
          <span className="text-xs font-bold text-[#d7dadc] uppercase tracking-wide">Trending Now</span>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-3">
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-start gap-3 animate-pulse">
                <div className="w-5 h-5 rounded bg-[#343536] flex-shrink-0" />
                <div className="flex-1 space-y-1.5">
                  <div className="h-3.5 bg-[#343536] rounded w-full" />
                  <div className="h-2.5 bg-[#343536] rounded w-2/3" />
                </div>
              </div>
            ))}
          </div>
        ) : posts.length === 0 ? (
          <p className="text-xs text-[#818384] text-center py-4">No trending posts yet</p>
        ) : (
          <div className="space-y-2.5">
            {posts.slice(0, 3).map((post, index) => (
              <Link
                key={post.id}
                href={`/forum/${post.id}`}
                className="flex items-start gap-3 group py-1"
              >
                <span className={cn(
                  'flex-shrink-0 w-5 h-5 rounded flex items-center justify-center text-xs font-bold',
                  index === 0 && 'bg-primary-600 text-white',
                  index === 1 && 'bg-[#343536] text-[#d7dadc]',
                  index === 2 && 'bg-[#343536] text-[#d7dadc]'
                )}>
                  {index + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-[#d7dadc] group-hover:text-primary-400 transition-colors line-clamp-2 leading-snug">
                    {post.title}
                  </p>
                  <div className="flex items-center gap-1.5 mt-1 text-[10px] text-[#818384]">
                    <span>{post.stats?.postPoints ?? post.stats?.score ?? 0} pts</span>
                    <span>•</span>
                    <span>{post.stats?.commentCount ?? 0} comments</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ContributorsCard() {
  const { entries, isLoading } = useLeaderboard(5);

  return (
    <div className="bg-[#1a1a1b] border border-[#343536] rounded-[4px] overflow-hidden">
      {/* Card Header */}
      <div className="px-3 py-2.5 bg-gradient-to-r from-amber-500/20 to-transparent border-b border-[#343536]">
        <div className="flex items-center gap-2">
          <SparklesIcon size="sm" className="text-amber-400" />
          <span className="text-xs font-bold text-[#d7dadc] uppercase tracking-wide">Top Contributors</span>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-3">
        {isLoading ? (
          <div className="space-y-2.5">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center gap-2.5 animate-pulse">
                <div className="w-8 h-8 rounded-full bg-[#343536]" />
                <div className="flex-1 space-y-1">
                  <div className="h-3 bg-[#343536] rounded w-2/3" />
                  <div className="h-2.5 bg-[#343536] rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {entries.map((contributor, index) => (
              <div key={contributor.userId} className="flex items-center gap-2.5 py-0.5">
                <div className="relative flex-shrink-0">
                  {contributor.avatar ? (
                    <Image
                      src={contributor.avatar}
                      alt={contributor.name}
                      width={32}
                      height={32}
                      className="rounded-full"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-[#343536] flex items-center justify-center text-[#818384] text-xs font-medium">
                      {contributor.name.charAt(0)}
                    </div>
                  )}
                  {index < 3 && (
                    <div className={cn(
                      'absolute -top-0.5 -right-0.5 w-3.5 h-3.5 rounded-full flex items-center justify-center text-[8px] font-bold ring-2 ring-[#1a1a1b]',
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
                    <span className="text-xs font-medium text-[#d7dadc] truncate">{contributor.name}</span>
                    <span className={cn('w-1.5 h-1.5 rounded-full flex-shrink-0', IDENTITY_COLORS[contributor.identityType as IdentityType])} />
                  </div>
                  <div className="text-[10px] text-[#818384]">
                    {contributor.totalPoints.toLocaleString()} points
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================================
// FEED TOOLBAR
// ============================================================================

function FeedToolbar({
  selectedCategory,
  onCategoryChange,
  sortBy,
  onSortChange,
  timeFilter,
  onTimeFilterChange,
}: {
  selectedCategory: PostCategory | 'all';
  onCategoryChange: (cat: PostCategory | 'all') => void;
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
  timeFilter: TimeFilter;
  onTimeFilterChange: (filter: TimeFilter) => void;
}) {
  return (
    <div className="bg-[#1a1a1b] border border-[#343536] rounded-[4px] p-3">
      {/* Category Pills */}
      <div className="flex flex-wrap gap-1.5 mb-3 pb-3 border-b border-[#343536]">
        {CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat.value;
          return (
            <button
              key={cat.value}
              onClick={() => onCategoryChange(cat.value)}
              className={cn(
                'px-3 py-1.5 rounded-full text-xs font-medium transition-all',
                isSelected
                  ? 'bg-primary-600 text-white'
                  : 'bg-transparent text-[#818384] hover:bg-[#272729] hover:text-[#d7dadc] border border-[#343536]'
              )}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Sort & Time Controls */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Sort Options */}
        <div className="flex items-center gap-1 bg-[#272729] rounded-full p-0.5">
          {SORT_OPTIONS.map((option) => {
            const isSelected = sortBy === option.value;
            return (
              <button
                key={option.value}
                onClick={() => onSortChange(option.value)}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all',
                  isSelected
                    ? 'bg-[#1a1a1b] text-[#d7dadc]'
                    : 'text-[#818384] hover:text-[#d7dadc]'
                )}
              >
                <Icon name={option.icon} size="sm" />
                {option.label}
              </button>
            );
          })}
        </div>

        {/* Divider */}
        <div className="w-px h-5 bg-[#343536] hidden sm:block" />

        {/* Time Filter */}
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] text-[#818384] uppercase tracking-wider">Time:</span>
          <select
            value={timeFilter}
            onChange={(e) => onTimeFilterChange(e.target.value as TimeFilter)}
            className="bg-[#272729] border border-[#343536] rounded text-xs text-[#d7dadc] px-2 py-1.5 focus:outline-none focus:border-primary-500 cursor-pointer"
          >
            {TIME_FILTERS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// POST CARD (REDDIT-STYLE)
// ============================================================================

function RedditPostCard({
  post,
  index,
  userId,
  isFirst = false,
}: {
  post: PostWithRelations;
  index: number;
  userId?: string | null;
  isFirst?: boolean;
}) {
  const { share, showCopied } = useShare(post.id, userId);
  const { isBookmarked, toggleBookmark, canBookmark } = useBookmark(post.id, userId ?? null);
  const authorIdentity = (post.author?.identityType || 'explorer') as IdentityType;
  const [postSearchQuery, setPostSearchQuery] = useState('');
  const [isHovered, setIsHovered] = useState(false);

  const handleShare = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    await share();
  };

  const handleBookmark = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleBookmark();
  };

  const handleVote = (e: React.MouseEvent, direction: 'up' | 'down') => {
    e.preventDefault();
    e.stopPropagation();
    // Vote logic would go here
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.02, duration: 0.2 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={`/forum/${post.id}`} className="block">
        <div className={cn(
          'flex bg-[#1a1a1b] border rounded-[4px] transition-all duration-150',
          isHovered ? 'border-[#4a4a4b]' : 'border-[#343536]',
          post.isPinned && 'border-l-2 border-l-amber-500'
        )}>
          {/* Vote Column */}
          <div className="hidden sm:flex flex-col items-center py-2 px-2 bg-[#161617] rounded-l-[4px] w-10 flex-shrink-0">
            <button
              onClick={(e) => handleVote(e, 'up')}
              className="p-1 text-[#818384] hover:text-[#ff4500] hover:bg-[#ff4500]/10 rounded transition-colors"
            >
              <ChevronUpIcon size="md" />
            </button>
            <span className={cn(
              'text-xs font-bold my-0.5',
              (post.stats?.score ?? 0) > 0 ? 'text-[#ff4500]' : (post.stats?.score ?? 0) < 0 ? 'text-[#7193ff]' : 'text-[#d7dadc]'
            )}>
              {post.stats?.score ?? 0}
            </span>
            <button
              onClick={(e) => handleVote(e, 'down')}
              className="p-1 text-[#818384] hover:text-[#7193ff] hover:bg-[#7193ff]/10 rounded transition-colors"
            >
              <ChevronDownIcon size="md" />
            </button>
          </div>

          {/* Main Content */}
          <div className="flex-1 min-w-0 p-2.5 sm:p-3">
            {/* Meta Line with First Post Search */}
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
                {/* Pinned Badge */}
                {post.isPinned && (
                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 font-medium">
                    <PinIcon size="sm" className="w-3 h-3" />
                    Pinned
                  </span>
                )}
                {/* Category Badge */}
                <span className={cn(
                  'px-1.5 py-0.5 rounded text-[10px] font-medium',
                  POST_CATEGORY_COLORS[post.category]
                )}>
                  {POST_CATEGORY_LABELS[post.category]}
                </span>
                {/* Author & Time */}
                <span className="text-[#818384]">
                  Posted by
                </span>
                <span className="flex items-center gap-1 text-[#d7dadc] font-medium">
                  u/{post.author?.name ?? 'Unknown'}
                  <span className={cn('w-1.5 h-1.5 rounded-full', IDENTITY_COLORS[authorIdentity])}
                        title={IDENTITY_LABELS[authorIdentity]} />
                </span>
                <span className="text-[#818384]">
                  {formatTimeAgo(post.createdAt, 'en-US')}
                </span>
              </div>

              {/* First Post Search */}
              {isFirst && (
                <div className="hidden md:flex items-center">
                  <div className="relative">
                    <input
                      type="text"
                      value={postSearchQuery}
                      onChange={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setPostSearchQuery(e.target.value);
                      }}
                      onClick={(e) => e.preventDefault()}
                      placeholder="Search this post..."
                      className="w-40 h-6 pl-7 pr-2 text-[10px] bg-[#272729] border border-[#343536] rounded-full text-[#d7dadc] placeholder-[#6b6c6d] focus:outline-none focus:border-primary-500 focus:w-48 transition-all"
                    />
                    <SearchIcon size="sm" className="absolute left-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#6b6c6d]" />
                  </div>
                </div>
              )}
            </div>

            {/* Title */}
            <h3 className={cn(
              'text-base font-semibold text-[#d7dadc] mb-1.5 leading-snug line-clamp-2 transition-colors',
              isHovered && 'text-primary-400'
            )}>
              {post.title}
            </h3>

            {/* Preview */}
            <p className="text-sm text-[#818384] line-clamp-2 mb-2 leading-relaxed">
              {post.content}
            </p>

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-2.5">
                {post.tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 rounded-full text-[10px] bg-[#272729] text-[#818384] border border-[#343536]"
                  >
                    {tag}
                  </span>
                ))}
                {post.tags.length > 3 && (
                  <span className="text-[10px] text-[#6b6c6d]">+{post.tags.length - 3} more</span>
                )}
              </div>
            )}

            {/* Action Row */}
            <div className="flex items-center gap-1 -ml-1.5">
              {/* Mobile Vote */}
              <div className="flex sm:hidden items-center gap-1 px-2 py-1 rounded hover:bg-[#272729] transition-colors">
                <ChevronUpIcon size="sm" className="text-[#818384]" />
                <span className="text-xs font-bold text-[#d7dadc]">{post.stats?.score ?? 0}</span>
                <ChevronDownIcon size="sm" className="text-[#818384]" />
              </div>

              {/* Comments */}
              <button className="flex items-center gap-1.5 px-2 py-1 rounded text-[#818384] hover:bg-[#272729] transition-colors">
                <ChatBubbleIcon size="sm" />
                <span className="text-xs font-medium">{post.stats?.commentCount ?? 0} Comments</span>
              </button>

              {/* Share */}
              <button
                onClick={handleShare}
                className="flex items-center gap-1.5 px-2 py-1 rounded text-[#818384] hover:bg-[#272729] transition-colors relative"
              >
                <ShareIcon size="sm" />
                <span className="text-xs font-medium hidden sm:inline">Share</span>
                {showCopied && (
                  <span className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 text-[10px] bg-[#272729] text-white rounded whitespace-nowrap z-10 border border-[#343536]">
                    Link copied!
                  </span>
                )}
              </button>

              {/* Save/Bookmark */}
              {canBookmark && (
                <button
                  onClick={handleBookmark}
                  className={cn(
                    'flex items-center gap-1.5 px-2 py-1 rounded transition-colors',
                    isBookmarked ? 'text-amber-400' : 'text-[#818384] hover:bg-[#272729]'
                  )}
                >
                  {isBookmarked ? <BookmarkSolidIcon size="sm" /> : <BookmarkIcon size="sm" />}
                  <span className="text-xs font-medium hidden sm:inline">{isBookmarked ? 'Saved' : 'Save'}</span>
                </button>
              )}

              {/* Views */}
              <span className="hidden sm:flex items-center gap-1.5 px-2 py-1 text-[#818384]">
                <EyeIcon size="sm" />
                <span className="text-xs">{post.stats?.viewCount ?? 0}</span>
              </span>

              {/* More */}
              <button className="flex items-center px-2 py-1 rounded text-[#818384] hover:bg-[#272729] transition-colors ml-auto">
                <MoreHorizontalIcon size="sm" />
              </button>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

// ============================================================================
// RIGHT SIDEBAR
// ============================================================================

function RightSidebar() {
  return (
    <div className="space-y-4">
      {/* Create Post Card */}
      <div className="bg-[#1a1a1b] border border-[#343536] rounded-[4px] p-4">
        <h3 className="text-sm font-bold text-[#d7dadc] mb-2">Community Forum</h3>
        <p className="text-xs text-[#818384] mb-3">
          Share ideas, ask questions, and learn together with the nuva Club community.
        </p>
        <Gate
          permission="forum:post"
          fallback={
            <div className="space-y-2">
              <Button variant="secondary" className="w-full" disabled size="sm">
                Traveler+ to Post
              </Button>
              <p className="text-[10px] text-[#6b6c6d] text-center">
                Upgrade your membership to create posts
              </p>
            </div>
          }
        >
          <Link href="/forum/new" className="block">
            <Button className="w-full" size="sm">
              <PlusIcon size="sm" className="mr-1.5" />
              Create Post
            </Button>
          </Link>
        </Gate>
      </div>

      {/* Community Rules */}
      <div className="bg-[#1a1a1b] border border-[#343536] rounded-[4px] overflow-hidden">
        <div className="px-3 py-2.5 border-b border-[#343536]">
          <span className="text-xs font-bold text-[#d7dadc]">Community Rules</span>
        </div>
        <div className="p-3 space-y-2">
          {[
            'Be respectful and constructive',
            'No spam or self-promotion',
            'Stay on topic',
            'Use appropriate tags',
          ].map((rule, i) => (
            <div key={i} className="flex items-start gap-2 text-xs text-[#818384]">
              <span className="text-[#6b6c6d] font-medium">{i + 1}.</span>
              <span>{rule}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// MAIN PAGE
// ============================================================================

export default function ForumPage() {
  const { user } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState<PostCategory | 'all'>('all');
  const [sortBy, setSortBy] = useState<SortOption>('hot');
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const { posts, isLoading } = usePostsFiltered({
    sort: sortBy,
    timeFilter,
    category: selectedCategory === 'all' ? undefined : selectedCategory as ForumPostCategory,
    searchQuery,
  });

  return (
    <PageTransition skeleton={<ForumPageSkeleton />}>
      <div className="min-h-screen bg-[#030303]">
        <div className="max-w-[1200px] mx-auto px-4 py-5">
          {/* Page Header */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-5"
          >
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-4">
              <div>
                <h1 className="text-2xl sm:text-[28px] font-bold text-[#d7dadc] leading-tight">Community Forum</h1>
                <p className="text-sm text-[#818384] mt-1">
                  Share ideas, ask questions, and learn together
                </p>
              </div>
            </div>

            {/* Global Search */}
            <div className="relative max-w-xl">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search discussions..."
                className="w-full h-10 pl-10 pr-10 rounded-full bg-[#272729] border border-[#343536] text-sm text-[#d7dadc] placeholder-[#6b6c6d] focus:outline-none focus:border-primary-500 focus:bg-[#1a1a1b] transition-all"
              />
              <SearchIcon
                size="sm"
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6b6c6d]"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#6b6c6d] hover:text-[#d7dadc] transition-colors"
                >
                  <XIcon size="sm" />
                </button>
              )}
            </div>
          </motion.div>

          {/* 3-Column Layout */}
          <div className="flex gap-5">
            {/* Left Sidebar */}
            <aside className="hidden lg:block w-[280px] flex-shrink-0 space-y-4">
              <TrendingCard />
              <ContributorsCard />
            </aside>

            {/* Main Feed */}
            <main className="flex-1 min-w-0 max-w-[720px] space-y-3">
              {/* Feed Toolbar */}
              <FeedToolbar
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
                sortBy={sortBy}
                onSortChange={setSortBy}
                timeFilter={timeFilter}
                onTimeFilterChange={setTimeFilter}
              />

              {/* Mobile Sidebar Content */}
              <div className="lg:hidden grid grid-cols-1 sm:grid-cols-2 gap-3">
                <TrendingCard />
                <ContributorsCard />
              </div>

              {/* Loading State */}
              {isLoading && (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-[#1a1a1b] border border-[#343536] rounded-[4px] p-3 animate-pulse">
                      <div className="flex gap-3">
                        <div className="hidden sm:block w-10 space-y-1">
                          <div className="h-6 bg-[#343536] rounded" />
                          <div className="h-4 bg-[#343536] rounded w-full" />
                          <div className="h-6 bg-[#343536] rounded" />
                        </div>
                        <div className="flex-1 space-y-2">
                          <div className="h-3 bg-[#343536] rounded w-1/3" />
                          <div className="h-5 bg-[#343536] rounded w-4/5" />
                          <div className="h-4 bg-[#343536] rounded w-full" />
                          <div className="h-4 bg-[#343536] rounded w-2/3" />
                          <div className="flex gap-2 pt-1">
                            <div className="h-6 bg-[#343536] rounded w-20" />
                            <div className="h-6 bg-[#343536] rounded w-16" />
                            <div className="h-6 bg-[#343536] rounded w-14" />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Posts */}
              {!isLoading && (
                <div className="space-y-3">
                  {posts.map((post, index) => (
                    <RedditPostCard
                      key={post.id}
                      post={post}
                      index={index}
                      userId={user?.id}
                      isFirst={index === 0}
                    />
                  ))}
                </div>
              )}

              {/* Empty State */}
              {!isLoading && posts.length === 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-12 bg-[#1a1a1b] border border-[#343536] rounded-[4px]"
                >
                  <div className="text-4xl mb-3">
                    {searchQuery ? '🔍' : '📭'}
                  </div>
                  <h3 className="text-lg font-semibold text-[#d7dadc] mb-1.5">
                    {searchQuery ? 'No results found' : 'No posts yet'}
                  </h3>
                  <p className="text-sm text-[#818384] mb-5 max-w-sm mx-auto">
                    {searchQuery
                      ? `No discussions match "${searchQuery}". Try a different search term.`
                      : 'Be the first to start a discussion in this community!'}
                  </p>
                  {searchQuery ? (
                    <Button variant="secondary" size="sm" onClick={() => setSearchQuery('')}>
                      Clear Search
                    </Button>
                  ) : (
                    <Gate permission="forum:post">
                      <Link href="/forum/new">
                        <Button size="sm">Create First Post</Button>
                      </Link>
                    </Gate>
                  )}
                </motion.div>
              )}
            </main>

            {/* Right Sidebar */}
            <aside className="hidden xl:block w-[312px] flex-shrink-0">
              <RightSidebar />
            </aside>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
