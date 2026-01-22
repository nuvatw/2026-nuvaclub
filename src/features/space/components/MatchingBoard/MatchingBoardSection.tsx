'use client';

import { useState, useMemo, useCallback } from 'react';
import { motion } from 'motion/react';
import { Button } from '@/components/atoms';
import { useAuth } from '@/features/auth/components/AuthProvider';
import { useMatchingPosts, useMatchingPost } from '@/lib/db/hooks/useMatchingPosts';
import { useMatchingComments } from '@/lib/db/hooks/useMatchingComments';
import { MatchingFilters } from './MatchingFilters';
import { MatchingPostCard } from './MatchingPostCard';
import { MatchingPostDetail } from './MatchingPostDetail';
import { LockedPostCard } from './LockedPostCard';
import type { MatchingPostType, TimeSelectionType } from '@/features/space/types';
import type { MatchingPostSortBy } from '@/lib/db/hooks/useMatchingPosts';

const POSTS_PER_PAGE = 6;

export function MatchingBoardSection() {
  const { user, identity, hasPermission } = useAuth();
  const canViewVerified = hasPermission('space:view_certified_nunu');

  // Filters state
  const [selectedType, setSelectedType] = useState<MatchingPostType | 'all'>('all');
  const [selectedTimeSelection, setSelectedTimeSelection] = useState<TimeSelectionType | 'all'>(
    'all'
  );
  const [sortBy, setSortBy] = useState<MatchingPostSortBy>('newest');
  const [showVerifiedOnly, setShowVerifiedOnly] = useState(false);

  // Pagination state
  const [visibleCount, setVisibleCount] = useState(POSTS_PER_PAGE);

  // Selected post state
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);

  // Build filters object
  const filters = useMemo(() => {
    const f: {
      type?: MatchingPostType;
      timeSelection?: TimeSelectionType;
      isVerifiedNunuOnly?: boolean;
      isActive?: boolean;
    } = {
      isActive: true,
    };

    if (selectedType !== 'all') {
      f.type = selectedType;
    }
    if (selectedTimeSelection !== 'all') {
      f.timeSelection = selectedTimeSelection;
    }
    if (showVerifiedOnly) {
      f.isVerifiedNunuOnly = true;
    }

    return f;
  }, [selectedType, selectedTimeSelection, showVerifiedOnly]);

  // Fetch posts
  const { posts, isReady } = useMatchingPosts(filters, sortBy);

  // Filter posts based on user permissions
  const allVisiblePosts = useMemo(() => {
    if (canViewVerified) {
      return posts;
    }
    // For Duo Go users, show non-verified posts only
    return posts.filter((p) => !p.isVerifiedNunuOnly);
  }, [posts, canViewVerified]);

  // Paginated posts - only render what's visible for better performance
  const visiblePosts = useMemo(() => {
    return allVisiblePosts.slice(0, visibleCount);
  }, [allVisiblePosts, visibleCount]);

  const hasMorePosts = visibleCount < allVisiblePosts.length;

  const handleLoadMore = useCallback(() => {
    setVisibleCount((prev) => prev + POSTS_PER_PAGE);
  }, []);

  // Reset pagination when filters change
  const handleTypeChange = useCallback((type: MatchingPostType | 'all') => {
    setSelectedType(type);
    setVisibleCount(POSTS_PER_PAGE);
  }, []);

  const handleTimeSelectionChange = useCallback((time: TimeSelectionType | 'all') => {
    setSelectedTimeSelection(time);
    setVisibleCount(POSTS_PER_PAGE);
  }, []);

  const handleSortChange = useCallback((sort: MatchingPostSortBy) => {
    setSortBy(sort);
    setVisibleCount(POSTS_PER_PAGE);
  }, []);

  const handleVerifiedOnlyChange = useCallback((verified: boolean) => {
    setShowVerifiedOnly(verified);
    setVisibleCount(POSTS_PER_PAGE);
  }, []);

  // Locked posts count (for Duo Go users)
  const lockedPostsCount = useMemo(() => {
    if (canViewVerified) return 0;
    return posts.filter((p) => p.isVerifiedNunuOnly).length;
  }, [posts, canViewVerified]);

  // Selected post details
  const selectedPost = useMatchingPost(selectedPostId || '');
  const { comments } = useMatchingComments(selectedPostId || '', user?.id);

  const handleCreatePost = () => {
    // TODO: Open create post modal
    console.log('Open create post modal');
  };

  const handlePostClick = (postId: string) => {
    setSelectedPostId(postId);
  };

  const handleCloseDetail = () => {
    setSelectedPostId(null);
  };

  const handleRequestMatch = (postId: string) => {
    // TODO: Open request match modal
    console.log('Request match for post', postId);
  };

  const handleAddComment = (content: string, isPrivate: boolean, parentId?: string) => {
    // TODO: Add comment to database
    console.log('Add comment', { content, isPrivate, parentId, postId: selectedPostId });
  };

  if (!isReady) {
    return (
      <section id="matching-board" className="mb-12">
        <div className="animate-pulse">
          <div className="h-8 bg-neutral-800 rounded w-48 mb-4"></div>
          <div className="h-4 bg-neutral-800 rounded w-64 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-48 bg-neutral-800 rounded-xl"></div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="matching-board" className="mb-12">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-start justify-between mb-6"
      >
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Matching Board</h2>
          <p className="text-neutral-400">
            Find your perfect Nunu mentor or recruit Vavas to guide
          </p>
        </div>

        <Button onClick={handleCreatePost}>
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          Create Post
        </Button>
      </motion.div>

      {/* Filters */}
      <MatchingFilters
        selectedType={selectedType}
        onTypeChange={handleTypeChange}
        selectedTimeSelection={selectedTimeSelection}
        onTimeSelectionChange={handleTimeSelectionChange}
        sortBy={sortBy}
        onSortChange={handleSortChange}
        showVerifiedOnly={showVerifiedOnly}
        onVerifiedOnlyChange={handleVerifiedOnlyChange}
      />

      {/* Posts Grid */}
      {visiblePosts.length === 0 && lockedPostsCount === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <svg
            className="w-16 h-16 mx-auto mb-4 text-neutral-700"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
            />
          </svg>
          <h3 className="text-lg font-medium text-white mb-2">No posts found</h3>
          <p className="text-neutral-500 mb-4">
            Try adjusting your filters or be the first to create a post!
          </p>
          <Button onClick={handleCreatePost}>Create First Post</Button>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {visiblePosts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <MatchingPostCard
                post={post}
                onClick={() => handlePostClick(post.id)}
                onRequestMatch={() => handleRequestMatch(post.id)}
              />
            </motion.div>
          ))}

          {/* Show locked cards for Duo Go users */}
          {lockedPostsCount > 0 && (
            <>
              {Array.from({ length: Math.min(lockedPostsCount, 2) }).map((_, i) => (
                <motion.div
                  key={`locked-${i}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: (visiblePosts.length + i) * 0.05 }}
                >
                  <LockedPostCard postType="verified-nunu" />
                </motion.div>
              ))}
              {lockedPostsCount > 2 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="col-span-full text-center py-4"
                >
                  <p className="text-neutral-500">
                    +{lockedPostsCount - 2} more verified Nunu posts available with Duo Run or Fly
                  </p>
                </motion.div>
              )}
            </>
          )}

          {/* Load More Button */}
          {hasMorePosts && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="col-span-full flex justify-center pt-4"
            >
              <Button variant="secondary" onClick={handleLoadMore}>
                Load More ({allVisiblePosts.length - visibleCount} remaining)
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
          isOpen={!!selectedPostId}
          onClose={handleCloseDetail}
          onRequestMatch={() => handleRequestMatch(selectedPost.id)}
          onAddComment={handleAddComment}
        />
      )}
    </section>
  );
}
