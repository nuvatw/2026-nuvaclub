'use client';

import Image from 'next/image';
import { motion } from 'motion/react';
import { Badge, Button } from '@/components/atoms';
import { cn } from '@/lib/utils';
import type { MatchingPostWithRelations } from '@/lib/db/hooks/useMatchingPosts';
import {
  MATCHING_POST_TYPE_COLORS,
  getNunuLevelConfig,
} from '@/features/space/types';
import type { NunuLevel, PriceType } from '@/features/space/types';

interface MatchingPostCardProps {
  post: MatchingPostWithRelations;
  onClick?: () => void;
  hidePrice?: boolean;
}

function formatPriceDisplay(
  priceType: PriceType,
  priceAmount?: number,
  priceMin?: number,
  priceMax?: number,
  currency: string = 'TWD'
): { main: string; sub: string } {
  const symbol = currency === 'TWD' ? 'NT$' : '$';

  switch (priceType) {
    case 'fixed':
      return {
        main: priceAmount ? `${symbol}${priceAmount.toLocaleString()}` : 'TBD',
        sub: '/month',
      };
    case 'range':
      if (priceMin && priceMax) {
        return {
          main: `${symbol}${priceMin.toLocaleString()} - ${symbol}${priceMax.toLocaleString()}`,
          sub: '/month',
        };
      }
      return { main: 'Budget TBD', sub: '' };
    case 'negotiable':
      return { main: 'Negotiable', sub: '' };
    default:
      return { main: 'TBD', sub: '' };
  }
}

function formatTimeRange(months: string[]): string {
  if (!months || months.length === 0) return 'Flexible';
  if (months.length === 1) {
    const [year, month] = months[0].split('-');
    return new Date(Number(year), Number(month) - 1).toLocaleDateString('en-US', {
      month: 'short',
      year: 'numeric',
    });
  }

  const startDate = new Date(
    Number(months[0].split('-')[0]),
    Number(months[0].split('-')[1]) - 1
  );
  const endDate = new Date(
    Number(months[months.length - 1].split('-')[0]),
    Number(months[months.length - 1].split('-')[1]) - 1
  );

  const startStr = startDate.toLocaleDateString('en-US', { month: 'short' });
  const endStr = endDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });

  return `${startStr} - ${endStr}`;
}

export function MatchingPostCard({ post, onClick, hidePrice = false }: MatchingPostCardProps) {
  const levelConfig = post.author?.nunuLevel
    ? getNunuLevelConfig(post.author.nunuLevel as NunuLevel)
    : null;

  const priceDisplay = hidePrice ? null : formatPriceDisplay(
    post.priceType as PriceType,
    post.priceAmount,
    post.priceMin,
    post.priceMax,
    post.priceCurrency
  );

  const timeRange = formatTimeRange(post.availableMonths || []);
  const isNunuPost = post.type === 'nunu-looking-for-vava';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'group p-4 rounded-xl',
        'bg-neutral-900 border border-neutral-800',
        'hover:border-neutral-700 hover:bg-neutral-800/50',
        'transition-colors flex flex-col'
      )}
    >
      {/* Header - Type Badge & Verified */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span
            className={cn(
              'px-2 py-0.5 rounded text-xs font-medium',
              MATCHING_POST_TYPE_COLORS[post.type]
            )}
          >
            {isNunuPost ? 'Nunu Offering' : 'Vava Seeking'}
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

        {/* Slots available for Nunu posts */}
        {isNunuPost && post.maxSlots !== undefined && (
          <span className="text-xs text-neutral-500">
            {(post.maxSlots ?? 0) - (post.currentSlots ?? 0)} slots left
          </span>
        )}
      </div>

      {/* Title */}
      <h3 className="text-lg font-semibold text-white mb-2 line-clamp-2">
        {post.title}
      </h3>

      {/* Price Display - Prominent (only if not hidden) */}
      {priceDisplay && (
        <div className="bg-neutral-800/80 rounded-lg p-3 mb-3">
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold text-primary-400">{priceDisplay.main}</span>
            <span className="text-sm text-neutral-400">{priceDisplay.sub}</span>
          </div>
        </div>
      )}

      {/* Time Range */}
      <div className="flex items-center gap-2 mb-3 text-sm text-neutral-400">
        <svg className="w-4 h-4 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <span>{timeRange}</span>
        <span className="text-neutral-600">|</span>
        <span>{post.availableMonths?.length || 0} months</span>
      </div>

      {/* Content Preview */}
      <p className="text-sm text-neutral-400 mb-3 line-clamp-2 flex-1">{post.content}</p>

      {/* Tags */}
      <div className="flex flex-wrap gap-1 mb-4">
        {post.tags.slice(0, 3).map((tag) => (
          <span
            key={tag}
            className="px-2 py-0.5 rounded text-xs bg-neutral-800 text-neutral-400"
          >
            {tag}
          </span>
        ))}
        {post.tags.length > 3 && (
          <span className="px-2 py-0.5 rounded text-xs bg-neutral-800 text-neutral-500">
            +{post.tags.length - 3}
          </span>
        )}
      </div>

      {/* Author Info */}
      <div className="flex items-center gap-2 mb-4 pb-4 border-b border-neutral-800">
        {post.author && (
          <>
            <Image
              src={post.author.avatar || 'https://i.pravatar.cc/150?u=default'}
              alt={post.author.name}
              width={32}
              height={32}
              className="rounded-full"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-medium text-white truncate">{post.author.name}</span>
                {levelConfig && (
                  <span
                    className={cn('px-1.5 py-0.5 rounded text-xs font-medium flex-shrink-0', levelConfig.color)}
                  >
                    {levelConfig.level}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 text-xs text-neutral-500">
                {post.author.rating !== undefined && (
                  <span className="flex items-center gap-1">
                    <svg className="w-3 h-3 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="text-amber-400 font-medium">{post.author.rating.toFixed(1)}</span>
                    {post.author.totalRatings !== undefined && (
                      <span className="text-neutral-500">({post.author.totalRatings})</span>
                    )}
                  </span>
                )}
                {post.author.mentoredMonths !== undefined && post.author.mentoredMonths > 0 && (
                  <span className="flex items-center gap-1">
                    <svg className="w-3 h-3 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-blue-400">{post.author.mentoredMonths} mo</span>
                  </span>
                )}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Action Button - Opens Modal for Full Details and Request Flow */}
      <Button
        size="sm"
        className="w-full"
        onClick={(e) => {
          e.stopPropagation();
          onClick?.();
        }}
      >
        <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        View Details
      </Button>
    </motion.div>
  );
}
