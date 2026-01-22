'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'motion/react';
import { Badge } from '@/components/atoms';
import type { Post } from '@/features/forum/types';
import { POST_CATEGORY_LABELS, POST_CATEGORY_COLORS } from '@/features/forum/types';
import { IDENTITY_COLORS } from '@/features/auth/types';
import { cn } from '@/lib/utils';
import { formatTimeAgo } from '@/lib/utils/date';

interface PostCardProps {
  post: Post;
}

export function PostCard({ post }: PostCardProps) {
  const [showCopied, setShowCopied] = useState(false);

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
        // User cancelled or share failed, fall back to clipboard
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
      // Fallback for older browsers
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'group p-4 rounded-xl',
        'bg-neutral-900 border border-neutral-800',
        'hover:border-neutral-700 hover:bg-neutral-800/50',
        'transition-colors cursor-pointer'
      )}
    >
      <Link href={`/forum/${post.id}`} className="block">
        <div className="flex gap-4">
          {/* Vote Section */}
          <div className="flex-shrink-0 flex flex-col items-center gap-1 text-center w-12">
            <button className="p-1 text-neutral-500 hover:text-primary-400 transition-colors">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 15l7-7 7 7"
                />
              </svg>
            </button>
            <span
              className={cn(
                'text-sm font-medium',
                post.score > 0 ? 'text-green-400' : 'text-neutral-400'
              )}
            >
              {post.score}
            </span>
            <button className="p-1 text-neutral-500 hover:text-red-400 transition-colors">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            {/* Header */}
            <div className="flex items-center gap-2 mb-2">
              {post.isPinned && (
                <Badge variant="warning" size="sm">
                  Pinned
                </Badge>
              )}
              <span
                className={cn(
                  'px-2 py-0.5 rounded text-xs font-medium',
                  POST_CATEGORY_COLORS[post.category]
                )}
              >
                {POST_CATEGORY_LABELS[post.category]}
              </span>
            </div>

            {/* Title */}
            <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-primary-400 transition-colors line-clamp-2">
              {post.title}
            </h3>

            {/* Preview */}
            <p className="text-sm text-neutral-400 line-clamp-2 mb-3">
              {post.content}
            </p>

            {/* Tags */}
            <div className="flex flex-wrap gap-1 mb-3">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 rounded text-xs bg-neutral-800 text-neutral-400"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between text-xs text-neutral-500">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  {post.author.avatar && (
                    <Image
                      src={post.author.avatar}
                      alt={post.author.name}
                      width={20}
                      height={20}
                      className="rounded-full"
                    />
                  )}
                  <span className="flex items-center gap-1">
                    {post.author.name}
                    <span
                      className={cn(
                        'w-1.5 h-1.5 rounded-full',
                        IDENTITY_COLORS[post.author.identity]
                      )}
                    />
                  </span>
                </div>
                <span>{formatTimeAgo(post.createdAt, 'en-US')}</span>
              </div>

              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                  {post.commentCount}
                </span>
                <span className="flex items-center gap-1">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                  {post.viewCount}
                </span>
                <button
                  onClick={handleShare}
                  className="flex items-center gap-1 text-neutral-500 hover:text-primary-400 transition-colors relative"
                  title="Share"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                    />
                  </svg>
                  {showCopied && (
                    <span className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 text-xs bg-neutral-700 text-white rounded whitespace-nowrap">
                      Copied!
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
