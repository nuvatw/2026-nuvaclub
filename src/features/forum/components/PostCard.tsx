'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import {
  ChevronUpIcon,
  ChevronDownIcon,
  ChatBubbleIcon,
  EyeIcon,
  ShareIcon,
  BookmarkIcon,
  BookmarkSolidIcon,
  PinIcon,
  MoreHorizontalIcon,
  SearchIcon,
} from '@/components/icons';
import type { Post } from '@/features/forum/types';
import { POST_CATEGORY_LABELS, POST_CATEGORY_COLORS } from '@/features/forum/types';
import { IDENTITY_COLORS, IDENTITY_LABELS } from '@/features/auth/types';
import { cn } from '@/lib/utils';
import { formatTimeAgo } from '@/lib/utils/date';

interface PostCardProps {
  post: Post;
  index?: number;
  isFirst?: boolean;
}

export function PostCard({ post, index = 0, isFirst = false }: PostCardProps) {
  const [showCopied, setShowCopied] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [postSearchQuery, setPostSearchQuery] = useState('');

  const handleShare = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const url = `${window.location.origin}/forum/${post.id}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: post.title,
          text: post.content.slice(0, 100) + '...',
          url: url,
        });
      } catch {
        await copyToClipboard(url);
      }
    } else {
      await copyToClipboard(url);
    }
  };

  const copyToClipboard = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setShowCopied(true);
      setTimeout(() => setShowCopied(false), 2000);
    } catch {
      const textArea = document.createElement('textarea');
      textArea.value = url;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setShowCopied(true);
      setTimeout(() => setShowCopied(false), 2000);
    }
  };

  const handleBookmark = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsBookmarked(!isBookmarked);
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
              post.score > 0 ? 'text-[#ff4500]' : post.score < 0 ? 'text-[#7193ff]' : 'text-[#d7dadc]'
            )}>
              {post.score}
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
                  u/{post.author.name}
                  <span className={cn('w-1.5 h-1.5 rounded-full', IDENTITY_COLORS[post.author.identity])}
                        title={IDENTITY_LABELS[post.author.identity]} />
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
                <span className="text-xs font-bold text-[#d7dadc]">{post.score}</span>
                <ChevronDownIcon size="sm" className="text-[#818384]" />
              </div>

              {/* Comments */}
              <button className="flex items-center gap-1.5 px-2 py-1 rounded text-[#818384] hover:bg-[#272729] transition-colors">
                <ChatBubbleIcon size="sm" />
                <span className="text-xs font-medium">{post.commentCount} Comments</span>
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

              {/* Views */}
              <span className="hidden sm:flex items-center gap-1.5 px-2 py-1 text-[#818384]">
                <EyeIcon size="sm" />
                <span className="text-xs">{post.viewCount}</span>
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
