'use client';

import { useState, useMemo, useCallback } from 'react';
import { motion } from 'motion/react';
import { Button } from '@/components/atoms';
import { useAuth } from '@/features/auth/components/AuthProvider';
import { useMatchingPosts, useMatchingPost } from '@/lib/db/hooks/useMatchingPosts';
import { useMatchingComments } from '@/lib/db/hooks/useMatchingComments';
import { MatchingPostCard } from './MatchingPostCard';
import { MatchingPostDetail } from './MatchingPostDetail';
import { cn } from '@/lib/utils';
import { useInvitations } from '../../hooks/useInvitations';
import { useDuoEntitlement } from '@/features/shop/hooks/useDuoEntitlement';
import { DUO_VARIANT_LABELS, NUNU_TIER_LABELS } from '@/Database';
import type { MatchingPostSortBy, MatchingPostWithRelations } from '@/lib/db/hooks/useMatchingPosts';
import type { MatchingPostType } from '@/features/space/types';
import type { NunuTier } from '@/features/shop/types';
import Link from 'next/link';

const POSTS_PER_PAGE = 12;

type ViewMode = 'find-nunu' | 'find-vava';

const SORT_OPTIONS: { value: MatchingPostSortBy; label: string }[] = [
  { value: 'rating', label: 'Rating: High → Low' },
  { value: 'ratingLow', label: 'Rating: Low → High' },
  { value: 'mentoredMonthsHigh', label: 'Experience: High → Low' },
  { value: 'mentoredMonthsLow', label: 'Experience: Low → High' },
  { value: 'newest', label: 'Most Recent' },
  { value: 'level', label: 'Nunu Level' },
];

export function MatchingBoardSection() {
  const { user } = useAuth();
  const { sendInvitation } = useInvitations();
  const {
    hasDuoTicket,
    currentVariant,
    accessibleTiers,
    isLoading: isDuoLoading,
  } = useDuoEntitlement();

  // View mode - Find Nunu or Find Vava
  const [viewMode, setViewMode] = useState<ViewMode>('find-nunu');

  // Sorting - default to rating high first
  const [sortBy, setSortBy] = useState<MatchingPostSortBy>('rating');

  // Pagination state
  const [visibleCount, setVisibleCount] = useState(POSTS_PER_PAGE);

  // Selected post state
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);

  // Request modal state
  const [showRequestSent, setShowRequestSent] = useState(false);

  // Build filters - no price filtering
  const filters = useMemo(() => {
    return {
      isActive: true,
      // When finding Nunu, show posts from Nunus looking for Vavas
      // When finding Vava, show posts from Vavas looking for Nunus
      type: viewMode === 'find-nunu'
        ? 'nunu-looking-for-vava' as MatchingPostType
        : 'vava-looking-for-nunu' as MatchingPostType,
    };
  }, [viewMode]);

  // Fetch posts
  const { posts, isReady } = useMatchingPosts(filters, sortBy);

  // Paginated posts
  const visiblePosts = useMemo(() => {
    return posts.slice(0, visibleCount);
  }, [posts, visibleCount]);

  const hasMorePosts = visibleCount < posts.length;

  const handleLoadMore = useCallback(() => {
    setVisibleCount((prev) => prev + POSTS_PER_PAGE);
  }, []);

  // Selected post details
  const selectedPost = useMatchingPost(selectedPostId || '');
  const { comments } = useMatchingComments(selectedPostId || '', user?.id);

  const handlePostClick = (postId: string) => {
    setSelectedPostId(postId);
  };

  const handleCloseDetail = () => {
    setSelectedPostId(null);
  };

  const handleSendRequest = useCallback((postId: string, message: string = '') => {
    if (!user) return;

    const post = posts.find(p => p.id === postId);
    if (!post || !post.author) return;

    // Create an invitation using the invitations store
    sendInvitation({
      listingId: post.id,
      listingTitle: post.title,
      listingType: post.type,
      fromUserId: user.id,
      fromUserName: user.name,
      fromUserAvatar: user.avatar,
      toUserId: post.author.id,
      toUserName: post.author.name,
      message: message,
    });

    setShowRequestSent(true);
    setTimeout(() => setShowRequestSent(false), 3000);

    setSelectedPostId(null);
  }, [user, posts, sendInvitation]);

  const handleAddComment = (content: string, isPrivate: boolean, parentId?: string) => {
    console.log('Add comment', { content, isPrivate, parentId, postId: selectedPostId });
  };

  if (!isReady) {
    return (
      <section id="matching-board" className="mb-12">
        <div className="animate-pulse">
          <div className="h-8 bg-neutral-800 rounded w-48 mb-4"></div>
          <div className="h-4 bg-neutral-800 rounded w-64 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-72 bg-neutral-800 rounded-xl"></div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="matching-board" className="mb-12">
      {/* Success Toast */}
      {showRequestSent && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed top-4 right-4 z-50 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg"
        >
          Request sent successfully!
        </motion.div>
      )}

      {/* Header with View Mode Toggle */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h2 className="text-2xl font-bold text-white mb-2">Matching Board</h2>
        <p className="text-neutral-400 mb-6">
          Connect with mentors and learners in the community
        </p>

        {/* Find Nunu / Find Vava Toggle */}
        <div className="flex gap-3 justify-center">
          <button
            onClick={() => {
              setViewMode('find-nunu');
              setVisibleCount(POSTS_PER_PAGE);
            }}
            className={cn(
              'flex-1 sm:flex-none px-6 py-4 rounded-xl font-semibold text-lg transition-all',
              'border-2',
              viewMode === 'find-nunu'
                ? 'bg-purple-600/20 border-purple-500 text-purple-400'
                : 'bg-neutral-800/50 border-neutral-700 text-neutral-400 hover:border-neutral-600'
            )}
          >
            <div className="flex items-center justify-center gap-3">
              <span className="text-2xl">🎓</span>
              <div className="text-left">
                <div className="font-bold">Find Nunu</div>
                <div className="text-xs opacity-70">Find a mentor</div>
              </div>
            </div>
          </button>

          <button
            onClick={() => {
              setViewMode('find-vava');
              setVisibleCount(POSTS_PER_PAGE);
            }}
            className={cn(
              'flex-1 sm:flex-none px-6 py-4 rounded-xl font-semibold text-lg transition-all',
              'border-2',
              viewMode === 'find-vava'
                ? 'bg-blue-600/20 border-blue-500 text-blue-400'
                : 'bg-neutral-800/50 border-neutral-700 text-neutral-400 hover:border-neutral-600'
            )}
          >
            <div className="flex items-center justify-center gap-3">
              <span className="text-2xl">🔍</span>
              <div className="text-left">
                <div className="font-bold">Find Vava</div>
                <div className="text-xs opacity-70">Find a learner</div>
              </div>
            </div>
          </button>
        </div>
      </motion.div>

      {/* Duo Ticket Status Banner */}
      {viewMode === 'find-nunu' && !isDuoLoading && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={cn(
            'mb-4 p-4 rounded-xl border',
            hasDuoTicket
              ? 'bg-green-500/10 border-green-500/30'
              : 'bg-amber-500/10 border-amber-500/30'
          )}
        >
          {hasDuoTicket ? (
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div>
                <p className="text-sm font-medium text-green-400">
                  {DUO_VARIANT_LABELS[currentVariant!]} Active
                </p>
                <p className="text-xs text-neutral-400">
                  You can match with: {accessibleTiers.map(t => NUNU_TIER_LABELS[t]).join(', ')}
                </p>
              </div>
              {currentVariant !== 'fly' && (
                <Link
                  href="/shop?category=duo"
                  className="text-xs text-green-400 hover:text-green-300 underline"
                >
                  Upgrade for more tiers
                </Link>
              )}
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-amber-400">
                  No Duo Ticket
                </p>
                <p className="text-xs text-neutral-400">
                  Get a Duo ticket to match with Nunu mentors
                </p>
              </div>
              <Link
                href="/shop?category=duo"
                className="inline-flex items-center justify-center px-4 py-2 bg-amber-500 text-white text-sm font-medium rounded-lg hover:bg-amber-600 transition-colors"
              >
                Get Duo Ticket
              </Link>
            </div>
          )}
        </motion.div>
      )}

      {/* Sort Controls & Posts Count */}
      <div className="flex items-center justify-between mb-4">
        <div className="text-sm text-neutral-500">
          {posts.length} {viewMode === 'find-nunu' ? 'Nunus' : 'Vavas'} available
          {viewMode === 'find-nunu' && hasDuoTicket && (
            <span className="text-neutral-600 ml-1">
              (filtered by your access tier)
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <label className="text-xs text-neutral-500">Sort:</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as MatchingPostSortBy)}
            className={cn(
              'px-3 py-1.5 rounded-lg text-sm',
              'bg-neutral-800 border border-neutral-700 text-white',
              'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent'
            )}
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Posts Grid */}
      {visiblePosts.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <div className="text-6xl mb-4">
            {viewMode === 'find-nunu' ? '🎓' : '🔍'}
          </div>
          <h3 className="text-lg font-medium text-white mb-2">
            No {viewMode === 'find-nunu' ? 'Nunus' : 'Vavas'} found
          </h3>
          <p className="text-neutral-500 mb-4">
            {viewMode === 'find-nunu'
              ? 'Check back later for available mentors!'
              : 'Check back later for learners looking for guidance!'}
          </p>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {visiblePosts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.03 }}
            >
              <MatchingPostCard
                post={post}
                onClick={() => handlePostClick(post.id)}
              />
            </motion.div>
          ))}

          {/* Load More Button */}
          {hasMorePosts && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="col-span-full flex justify-center pt-4"
            >
              <Button variant="secondary" onClick={handleLoadMore}>
                Load More ({posts.length - visibleCount} remaining)
              </Button>
            </motion.div>
          )}
        </div>
      )}

      {/* Post Detail Modal */}
      {selectedPost && (
        <MatchingPostDetail
          post={selectedPost}
          comments={comments}
          currentUserId={user?.id}
          currentUserName={user?.name}
          currentUserAvatar={user?.avatar}
          isOpen={!!selectedPostId}
          onClose={handleCloseDetail}
          onSendRequest={(message: string) => handleSendRequest(selectedPost.id, message)}
          onAddComment={handleAddComment}
          hidePrice
        />
      )}
    </section>
  );
}
