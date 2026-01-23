'use client';

import Image from 'next/image';
import { motion } from 'motion/react';
import { Badge, Button } from '@/components/atoms';
import { cn } from '@/lib/utils';
import { formatTimeAgo } from '@/lib/utils/date';
import type { MatchingPostWithRelations } from '@/lib/db/hooks/useMatchingPosts';
import {
  MATCHING_POST_TYPE_LABELS,
  MATCHING_POST_TYPE_COLORS,
  MATCHING_POST_TYPE_ICONS,
  getNunuLevelConfig,
  formatPrice,
  formatAvailableMonths,
} from '@/features/space/types';
import type { NunuLevel, PriceType } from '@/features/space/types';

interface MatchingPostCardProps {
  post: MatchingPostWithRelations;
  onClick?: () => void;
  onRequestMatch?: () => void;
}

export function MatchingPostCard({ post, onClick, onRequestMatch }: MatchingPostCardProps) {
  const levelConfig = post.author?.nunuLevel
    ? getNunuLevelConfig(post.author.nunuLevel as NunuLevel)
    : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'group p-4 rounded-xl cursor-pointer',
        'bg-neutral-900 border border-neutral-800',
        'hover:border-neutral-700 hover:bg-neutral-800/50',
        'transition-colors'
      )}
      onClick={onClick}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-lg">{MATCHING_POST_TYPE_ICONS[post.type]}</span>
          <span
            className={cn(
              'px-2 py-0.5 rounded text-xs font-medium',
              MATCHING_POST_TYPE_COLORS[post.type]
            )}
          >
            {MATCHING_POST_TYPE_LABELS[post.type]}
          </span>
          {post.isVerifiedNunuOnly && (
            <Badge variant="default" size="sm" className="bg-purple-600/20 text-purple-400">
              <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              Verified
            </Badge>
          )}
        </div>
        <span className="text-sm font-semibold text-primary-400">
          {formatPrice(post.priceType as PriceType, post.priceAmount, post.priceMin, post.priceMax, post.priceCurrency)}
        </span>
      </div>

      {/* Available Months */}
      <div className="flex items-center gap-2 mb-2 text-xs text-neutral-500">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <span>{formatAvailableMonths(post.availableMonths || [])}</span>
        {post.maxSlots !== undefined && post.type === 'nunu-looking-for-vava' && (
          <span className="text-neutral-600">
            | {(post.maxSlots ?? 0) - (post.currentSlots ?? 0)} slots available
          </span>
        )}
      </div>

      {/* Title */}
      <h3 className="text-lg font-semibold text-white mb-2 line-clamp-2 group-hover:text-primary-400 transition-colors">
        {post.title}
      </h3>

      {/* Content Preview */}
      <p className="text-sm text-neutral-400 mb-3 line-clamp-2">{post.content}</p>

      {/* Tags */}
      <div className="flex flex-wrap gap-1 mb-4">
        {post.tags.slice(0, 4).map((tag) => (
          <span
            key={tag}
            className="px-2 py-0.5 rounded text-xs bg-neutral-800 text-neutral-400"
          >
            {tag}
          </span>
        ))}
        {post.tags.length > 4 && (
          <span className="px-2 py-0.5 rounded text-xs bg-neutral-800 text-neutral-500">
            +{post.tags.length - 4}
          </span>
        )}
      </div>

      {/* Author & Stats */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {post.author && (
            <>
              <Image
                src={post.author.avatar || 'https://i.pravatar.cc/150?u=default'}
                alt={post.author.name}
                width={32}
                height={32}
                className="rounded-full"
              />
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-medium text-white">{post.author.name}</span>
                  {levelConfig && (
                    <span
                      className={cn('px-1.5 py-0.5 rounded text-xs font-medium', levelConfig.color)}
                    >
                      {levelConfig.level}
                    </span>
                  )}
                </div>
                {post.author.rating && (
                  <div className="flex items-center gap-1 text-xs text-neutral-500">
                    <svg className="w-3 h-3 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    {post.author.rating.toFixed(1)}
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        <div className="flex items-center gap-4 text-xs text-neutral-500">
          <span className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
          <span className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
            {post.commentCount}
          </span>
          <span>{formatTimeAgo(post.createdAt, 'en-US')}</span>
        </div>
      </div>

      {/* Action Button - Only show for Nunu posts */}
      {onRequestMatch && post.type === 'nunu-looking-for-vava' && (
        <div className="mt-4 pt-4 border-t border-neutral-800">
          <Button
            size="sm"
            className="w-full"
            onClick={(e) => {
              e.stopPropagation();
              onRequestMatch();
            }}
          >
            Purchase Mentorship
          </Button>
        </div>
      )}
    </motion.div>
  );
}
