'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'motion/react';
import { Button } from '@/components/atoms';
import {
  ChevronUpIcon,
  ChevronDownIcon,
  PinIcon,
  ChatBubbleIcon,
  BookmarkIcon,
  BookmarkSolidIcon,
  ShareIcon,
  Icon,
  MoreHorizontalIcon,
  ImageIcon,
  XIcon,
  HeartIcon,
  HeartSolidIcon,
  LockIcon,
  EditIcon,
  TrashIcon,
} from '@/components/icons';
import { Gate } from '@/features/auth/components/Gate';
import { useAuth } from '@/features/auth/components/AuthProvider';
import {
  usePostsFiltered,
  useShare,
  useBookmark,
  type SortOption,
} from '@/lib/db/hooks';
import type { PostWithRelations } from '@/lib/db/repositories/PostRepository';
import {
  POST_CATEGORY_LABELS,
  POST_CATEGORY_COLORS,
  type PostCategory,
} from '@/features/forum/types';
import { IDENTITY_COLORS, IDENTITY_LABELS, type IdentityType } from '@/features/auth/types';
import type { ForumPostCategory } from '@/infra/mock/schema/forum.schema';
import { cn } from '@/lib/utils';
import { PageTransition } from '@/components/molecules/PageTransition';
import { ForumPageSkeleton } from '@/components/skeletons';
import { formatTimeAgo } from '@/lib/utils/date';

// ============================================================================
// TYPES & CONSTANTS
// ============================================================================

// Category filter chips - none selected = show all
const CATEGORIES: { value: PostCategory; label: string }[] = [
  { value: 'question', label: 'Question' },
  { value: 'resource', label: 'Resource' },
  { value: 'announcement', label: 'Announcement' },
  { value: 'discussion', label: 'Discussion' },
];

const SORT_OPTIONS: { value: SortOption; label: string; icon: 'clock' | 'trending-up' }[] = [
  { value: 'popular', label: 'Popular', icon: 'trending-up' },
  { value: 'recent', label: 'Latest', icon: 'clock' },
];

// ============================================================================
// LOCKED COMPOSER PROMPT BAR (for guests/explorers)
// ============================================================================

function LockedComposerPromptBar() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-4"
    >
      <div className="max-w-3xl mx-auto">
        <Link href="/shop#plan">
          <div className="bg-[#1a1a1b] border border-[#343536] rounded-2xl p-3 hover:border-[#4a4a4b] transition-colors cursor-pointer group">
            <div className="flex items-center gap-3">
              {/* Lock Avatar */}
              <div className="flex-shrink-0">
                <div className="w-10 h-10 rounded-full bg-[#343536] flex items-center justify-center text-[#818384] group-hover:bg-[#3a3a3b] transition-colors">
                  <LockIcon size="md" />
                </div>
              </div>

              {/* Locked Message Bar */}
              <div className="flex-1 min-w-0">
                <div className="h-10 px-4 flex items-center justify-between rounded-full bg-[#272729] border border-[#343536] text-sm text-[#6b6c6d] group-hover:border-[#4a4a4b] group-hover:bg-[#1a1a1b] transition-all">
                  <span>想分享點什麼嗎？</span>
                  <span className="flex items-center gap-1.5 text-primary-400 font-medium">
                    <LockIcon size="sm" />
                    Traveler 解鎖
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Link>
      </div>
    </motion.div>
  );
}

// ============================================================================
// COMPOSER PROMPT BAR
// ============================================================================

function ComposerPromptBar() {
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);

  // Cleanup object URL on unmount or when image changes
  useEffect(() => {
    return () => {
      if (imagePreviewUrl) {
        URL.revokeObjectURL(imagePreviewUrl);
      }
    };
  }, [imagePreviewUrl]);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Cleanup previous preview URL
      if (imagePreviewUrl) {
        URL.revokeObjectURL(imagePreviewUrl);
      }
      setSelectedImage(file);
      setImagePreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleRemoveImage = () => {
    if (imagePreviewUrl) {
      URL.revokeObjectURL(imagePreviewUrl);
    }
    setSelectedImage(null);
    setImagePreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleImageButtonClick = () => {
    fileInputRef.current?.click();
  };

  // Get display name with fallback
  const displayName = user?.name || 'there';

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-4"
    >
      <div className="max-w-3xl mx-auto">
        <div className="bg-[#1a1a1b] border border-[#343536] rounded-2xl p-3 hover:border-[#4a4a4b] transition-colors">
          <div className="flex items-center gap-3">
            {/* User Avatar */}
            <div className="flex-shrink-0">
              {user?.avatar ? (
                <Image
                  src={user.avatar}
                  alt={user.name || 'User avatar'}
                  width={40}
                  height={40}
                  className="rounded-full"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-[#343536] flex items-center justify-center text-[#818384] text-sm font-medium">
                  {displayName.charAt(0).toUpperCase()}
                </div>
              )}
            </div>

            {/* Input Bar - Links to /forum/new */}
            <Link href="/forum/new" className="flex-1 min-w-0">
              <div className="h-10 px-4 flex items-center rounded-full bg-[#272729] border border-[#343536] text-sm text-[#6b6c6d] cursor-text hover:border-[#4a4a4b] hover:bg-[#1a1a1b] transition-all">
                {user?.name ? `Good evening ${user.name}! Wanna share something?` : 'Good evening! Wanna share something?'}
              </div>
            </Link>

            {/* Hidden file input for image upload */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/jpg,image/webp"
              onChange={handleImageSelect}
              className="hidden"
              aria-label="Select image to upload"
            />

            {/* Image Upload Icon Button */}
            <button
              onClick={handleImageButtonClick}
              className="flex-shrink-0 w-10 h-10 rounded-full text-[#818384] hover:text-[#d7dadc] hover:bg-[#272729] flex items-center justify-center transition-colors"
              title="Upload image"
              aria-label="Upload image"
            >
              <ImageIcon size="md" />
            </button>
          </div>

          {/* Image Preview */}
          {selectedImage && imagePreviewUrl && (
            <div className="mt-3 flex items-center gap-2 p-2 bg-[#272729] rounded-lg">
              <div className="relative w-12 h-12 rounded overflow-hidden flex-shrink-0">
                <Image
                  src={imagePreviewUrl}
                  alt="Selected image preview"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-[#d7dadc] truncate">{selectedImage.name}</p>
                <p className="text-[10px] text-[#818384]">
                  {(selectedImage.size / 1024).toFixed(1)} KB
                </p>
              </div>
              <button
                onClick={handleRemoveImage}
                className="flex-shrink-0 p-1.5 rounded-full text-[#818384] hover:text-[#d7dadc] hover:bg-[#343536] transition-colors"
                title="Remove image"
                aria-label="Remove image"
              >
                <XIcon size="sm" />
              </button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
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
}: {
  selectedCategory: PostCategory | null;
  onCategoryChange: (cat: PostCategory | null) => void;
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
}) {
  return (
    <div className="bg-[#1a1a1b] border border-[#343536] rounded-[4px] p-3">
      {/* Sort & Category Controls */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Sort Options - Popular / Latest */}
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

        {/* Category Filter Chips - none selected = show all */}
        <div className="flex flex-wrap items-center gap-1.5">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.value;
            return (
              <button
                key={cat.value}
                onClick={() => onCategoryChange(isSelected ? null : cat.value)}
                className={cn(
                  'px-2.5 py-1 rounded-full text-xs font-medium transition-all border',
                  isSelected
                    ? 'bg-primary-600/20 text-primary-400 border-primary-600'
                    : 'bg-[#272729] text-[#818384] border-transparent hover:text-[#d7dadc] hover:border-[#4a4a4b]'
                )}
              >
                {cat.label}
              </button>
            );
          })}
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
}: {
  post: PostWithRelations;
  index: number;
  userId?: string | null;
}) {
  const { share, showCopied } = useShare(post.id, userId);
  const { isBookmarked, toggleBookmark, canBookmark } = useBookmark(post.id, userId ?? null);
  const authorIdentity = (post.author?.identityType || 'explorer') as IdentityType;
  const [isHovered, setIsHovered] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Check if current user is the post author
  const isOwner = userId && post.author?.id === userId;

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    }
    if (showMenu) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showMenu]);

  const handleEdit = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowMenu(false);
    // Navigate to edit page
    window.location.href = `/forum/${post.id}/edit`;
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowMenu(false);
    // TODO: Add delete confirmation modal
    if (confirm('確定要刪除這篇貼文嗎？')) {
      // Delete logic would go here
      console.log('Delete post:', post.id);
    }
  };

  const handleMenuToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowMenu(!showMenu);
  };

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

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsLiked(!isLiked);
  };

  const handleVote = (e: React.MouseEvent, _direction: 'up' | 'down') => {
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
            {/* Meta Line */}
            <div className="flex flex-wrap items-center gap-1.5 text-[11px] mb-1.5">
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

            {/* Title */}
            <h3 className={cn(
              'text-base font-semibold text-[#d7dadc] mb-1.5 leading-snug line-clamp-2 transition-colors',
              isHovered && 'text-primary-400'
            )}>
              {post.title}
            </h3>

            {/* Preview */}
            <p className="text-sm text-[#818384] line-clamp-2 mb-2.5 leading-relaxed">
              {post.content}
            </p>

            {/* Action Row - Icons only with counts */}
            <div className="flex items-center gap-0.5">
              {/* Like */}
              <button
                onClick={handleLike}
                className={cn(
                  'flex items-center gap-1 px-2 py-1.5 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500/50',
                  isLiked ? 'text-red-500' : 'text-[#818384] hover:bg-[#272729] hover:text-red-400'
                )}
                aria-label="Like"
              >
                {isLiked ? <HeartSolidIcon size="sm" /> : <HeartIcon size="sm" />}
                <span className="text-xs font-medium tabular-nums">{post.stats?.upvotes ?? 0}</span>
              </button>

              {/* Comment */}
              <button
                className="flex items-center gap-1 px-2 py-1.5 rounded-full text-[#818384] hover:bg-[#272729] hover:text-[#d7dadc] transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500/50"
                aria-label="Comments"
              >
                <ChatBubbleIcon size="sm" />
                <span className="text-xs font-medium tabular-nums">{post.stats?.commentCount ?? 0}</span>
              </button>

              {/* Share */}
              <button
                onClick={handleShare}
                className="flex items-center gap-1 px-2 py-1.5 rounded-full text-[#818384] hover:bg-[#272729] hover:text-[#d7dadc] transition-colors relative focus:outline-none focus:ring-2 focus:ring-primary-500/50"
                aria-label="Share"
              >
                <ShareIcon size="sm" />
                <span className="text-xs font-medium tabular-nums">{post.stats?.shareCount ?? 0}</span>
                {showCopied && (
                  <span className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 text-[10px] bg-[#272729] text-white rounded whitespace-nowrap z-10 border border-[#343536]">
                    Link copied!
                  </span>
                )}
              </button>

              {/* Save - icon only, no count */}
              {canBookmark && (
                <button
                  onClick={handleBookmark}
                  className={cn(
                    'flex items-center px-2 py-1.5 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500/50',
                    isBookmarked ? 'text-amber-400' : 'text-[#818384] hover:bg-[#272729] hover:text-amber-400'
                  )}
                  aria-label="Save"
                >
                  {isBookmarked ? <BookmarkSolidIcon size="sm" /> : <BookmarkIcon size="sm" />}
                </button>
              )}

              {/* More - with dropdown for owner */}
              <div className="relative ml-auto" ref={menuRef}>
                <button
                  onClick={handleMenuToggle}
                  className="flex items-center px-2 py-1.5 rounded-full text-[#818384] hover:bg-[#272729] hover:text-[#d7dadc] transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500/50"
                  aria-label="More options"
                  aria-expanded={showMenu}
                >
                  <MoreHorizontalIcon size="sm" />
                </button>

                {/* Dropdown Menu */}
                {showMenu && (
                  <div className="absolute right-0 top-full mt-1 w-36 bg-[#1a1a1b] border border-[#343536] rounded-lg shadow-xl z-20 overflow-hidden">
                    {isOwner ? (
                      <>
                        <button
                          onClick={handleEdit}
                          className="w-full flex items-center gap-2 px-3 py-2 text-sm text-[#d7dadc] hover:bg-[#272729] transition-colors"
                        >
                          <EditIcon size="sm" />
                          編輯
                        </button>
                        <button
                          onClick={handleDelete}
                          className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-[#272729] transition-colors"
                        >
                          <TrashIcon size="sm" />
                          刪除
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); setShowMenu(false); }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-[#818384] hover:bg-[#272729] transition-colors"
                      >
                        檢舉
                      </button>
                    )}
                  </div>
                )}
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
  const { user } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState<PostCategory | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>('popular');

  const { posts, isLoading } = usePostsFiltered({
    sort: sortBy,
    timeFilter: 'all', // Always use 'all' since we removed time filters
    category: selectedCategory as ForumPostCategory | undefined,
  });

  return (
    <PageTransition skeleton={<ForumPageSkeleton />}>
      <div className="min-h-screen bg-[#030303]">
        <div className="max-w-3xl mx-auto px-4 py-5">
          {/* Composer Prompt Bar - Above everything */}
          <Gate permission="forum:post" fallback={<LockedComposerPromptBar />}>
            <ComposerPromptBar />
          </Gate>

          {/* Single Column Feed */}
          <main className="space-y-3">
            {/* Feed Toolbar - Below composer */}
            <FeedToolbar
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
              sortBy={sortBy}
              onSortChange={setSortBy}
            />

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
                <div className="text-4xl mb-3">📭</div>
                <h3 className="text-lg font-semibold text-[#d7dadc] mb-1.5">
                  No posts yet
                </h3>
                <p className="text-sm text-[#818384] mb-5 max-w-sm mx-auto">
                  Be the first to start a discussion in this community!
                </p>
                <Gate permission="forum:post">
                  <Link href="/forum/new">
                    <Button size="sm">Create First Post</Button>
                  </Link>
                </Gate>
              </motion.div>
            )}
          </main>
        </div>
      </div>
    </PageTransition>
  );
}
