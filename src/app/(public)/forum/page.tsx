'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import { Button } from '@/components/atoms';
import { PostCard } from '@/features/forum/components/PostCard';
import { Gate } from '@/features/auth/components/Gate';
import { useAuth } from '@/features/auth/components/AuthProvider';
import { MOCK_POSTS, getPinnedPosts, getRecentPosts } from '@/features/forum/data/posts';
import { POST_CATEGORY_LABELS, type PostCategory } from '@/features/forum/types';
import { cn } from '@/lib/utils';
import { PageTransition } from '@/components/molecules/PageTransition';
import { ForumPageSkeleton } from '@/components/skeletons';

const CATEGORIES: (PostCategory | 'all')[] = [
  'all',
  'discussion',
  'question',
  'share',
  'resource',
  'announcement',
];

type SortOption = 'recent' | 'popular' | 'comments';
type TimeFilter = 'all' | 'day' | 'week' | 'month';

const TIME_FILTERS: { value: TimeFilter; label: string }[] = [
  { value: 'all', label: 'All Time' },
  { value: 'month', label: 'Past Month' },
  { value: 'week', label: 'Past Week' },
  { value: 'day', label: 'Past 24 Hours' },
];

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

export default function ForumPage() {
  const { hasPermission } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState<PostCategory | 'all'>('all');
  const [sortBy, setSortBy] = useState<SortOption>('recent');
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('all');

  const filteredPosts = MOCK_POSTS.filter((post) => {
    // Category filter
    if (selectedCategory !== 'all' && post.category !== selectedCategory) {
      return false;
    }

    // Time filter
    const minDate = getTimeFilterDate(timeFilter);
    if (minDate && post.createdAt < minDate) {
      return false;
    }

    return true;
  }).sort((a, b) => {
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

  // Filter pinned posts by time as well
  const pinnedPosts = getPinnedPosts().filter((post) => {
    const minDate = getTimeFilterDate(timeFilter);
    if (minDate && post.createdAt < minDate) {
      return false;
    }
    return true;
  });

  return (
    <PageTransition skeleton={<ForumPageSkeleton />}>
    <div className="min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Forum</h1>
              <p className="text-neutral-400">
                Connect with the community, share your learning
              </p>
            </div>

            <Gate
              permission="forum:post"
              fallback={
                <Button variant="secondary" disabled>
                  Traveler+ can post
                </Button>
              }
            >
              <Link href="/forum/new">
                <Button>
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  New Post
                </Button>
              </Link>
            </Gate>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2 mb-4">
            {CATEGORIES.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={cn(
                  'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                  selectedCategory === category
                    ? 'bg-primary-600 text-white'
                    : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
                )}
              >
                {category === 'all' ? 'All' : POST_CATEGORY_LABELS[category]}
              </button>
            ))}
          </div>

          {/* Filter & Sort Options */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 text-sm">
            {/* Time Filter */}
            <div className="flex items-center gap-3">
              <span className="text-neutral-400">Filter:</span>
              <div className="flex items-center gap-1 bg-neutral-800 rounded-lg p-1">
                {TIME_FILTERS.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setTimeFilter(option.value)}
                    className={cn(
                      'px-3 py-1.5 rounded-md text-sm transition-colors',
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

            {/* Sort Options */}
            <div className="flex items-center gap-3">
              <span className="text-neutral-400">Sort:</span>
              {[
                { value: 'recent', label: 'Recent' },
                { value: 'popular', label: 'Popular' },
                { value: 'comments', label: 'Most Discussed' },
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => setSortBy(option.value as SortOption)}
                  className={cn(
                    'transition-colors',
                    sortBy === option.value
                      ? 'text-primary-400 font-medium'
                      : 'text-neutral-400 hover:text-white'
                  )}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Pinned Posts */}
        {selectedCategory === 'all' && pinnedPosts.length > 0 && (
          <div className="mb-6">
            <h2 className="text-sm font-medium text-neutral-400 mb-3 flex items-center gap-2">
              <svg
                className="w-4 h-4"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M5 5a2 2 0 012-2h6a2 2 0 012 2v2a2 2 0 01-2 2H7a2 2 0 01-2-2V5z" />
                <path d="M7 10h6v7a1 1 0 01-1 1H8a1 1 0 01-1-1v-7z" />
              </svg>
              Pinned Posts
            </h2>
            <div className="space-y-3">
              {pinnedPosts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          </div>
        )}

        {/* Posts */}
        <div className="space-y-3">
          {filteredPosts
            .filter((p) => !p.isPinned || selectedCategory !== 'all')
            .map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <PostCard post={post} />
              </motion.div>
            ))}
        </div>

        {/* Empty State */}
        {filteredPosts.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📭</div>
            <h3 className="text-xl font-semibold text-white mb-2">
              No posts yet
            </h3>
            <p className="text-neutral-400 mb-6">
              Be the first to create a post!
            </p>
            <Gate permission="forum:post">
              <Link href="/forum/new">
                <Button>New Post</Button>
              </Link>
            </Gate>
          </div>
        )}
      </div>
    </div>
    </PageTransition>
  );
}
