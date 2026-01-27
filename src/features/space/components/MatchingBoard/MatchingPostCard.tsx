'use client';

import Image from 'next/image';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';
import type { MatchingPostWithRelations } from '@/lib/db/hooks/useMatchingPosts';
import { getNunuLevelConfig } from '@/features/space/types';
import type { NunuLevel } from '@/features/space/types';

interface MatchingPostCardProps {
  post: MatchingPostWithRelations;
  onClick?: () => void;
}

/**
 * Format an array of months (YYYY-MM format) into a readable date range.
 * Returns null if no months are provided.
 * Examples:
 * - ['2026-02', '2026-03', '2026-04'] -> "Feb – Apr 2026"
 * - ['2026-02'] -> "Feb 2026"
 * - [] or undefined -> null
 */
function formatTimeRange(months: string[]): string | null {
  if (!months || months.length === 0) return null;

  // Sort months to ensure correct order
  const sortedMonths = [...months].sort();

  if (sortedMonths.length === 1) {
    const [year, month] = sortedMonths[0].split('-');
    return new Date(Number(year), Number(month) - 1).toLocaleDateString('en-US', {
      month: 'short',
      year: 'numeric',
    });
  }

  const startDate = new Date(
    Number(sortedMonths[0].split('-')[0]),
    Number(sortedMonths[0].split('-')[1]) - 1
  );
  const endDate = new Date(
    Number(sortedMonths[sortedMonths.length - 1].split('-')[0]),
    Number(sortedMonths[sortedMonths.length - 1].split('-')[1]) - 1
  );

  // Check if same year - if so, only show year once at the end
  const sameYear = startDate.getFullYear() === endDate.getFullYear();

  const startStr = startDate.toLocaleDateString('en-US', {
    month: 'short',
    ...(sameYear ? {} : { year: 'numeric' }),
  });
  const endStr = endDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });

  return `${startStr} – ${endStr}`;
}

export function MatchingPostCard({ post, onClick }: MatchingPostCardProps) {
  const levelConfig = post.author?.nunuLevel
    ? getNunuLevelConfig(post.author.nunuLevel as NunuLevel)
    : null;

  const timeRange = formatTimeRange(post.availableMonths || []);
  const isNunuPost = post.type === 'nunu-looking-for-vava';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      onClick={onClick}
      className={cn(
        'group p-4 rounded-xl cursor-pointer',
        'bg-neutral-900 border border-neutral-800',
        'hover:border-neutral-600 hover:bg-neutral-800/50',
        'transition-all duration-200'
      )}
    >
      {/* Author Row - Avatar, Name, Level */}
      <div className="flex items-center gap-3 mb-3">
        {post.author && (
          <>
            <Image
              src={post.author.avatar || 'https://api.dicebear.com/9.x/avataaars/png?seed=default'}
              alt={post.author.name}
              width={40}
              height={40}
              className="rounded-full"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-white truncate">
                  {post.author.name}
                </span>
                {levelConfig && (
                  <span
                    className={cn(
                      'px-1.5 py-0.5 rounded text-xs font-medium flex-shrink-0',
                      levelConfig.color
                    )}
                  >
                    {levelConfig.level}
                  </span>
                )}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Title */}
      <h3 className="text-base font-semibold text-white mb-3 line-clamp-2 group-hover:text-primary-400 transition-colors">
        {post.title}
      </h3>

      {/* Time Range */}
      {timeRange && (
        <div className="flex items-center gap-2 text-sm text-neutral-400">
          <svg
            className="w-4 h-4 text-neutral-500 flex-shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <span>{timeRange}</span>
          <span className="text-neutral-600">·</span>
          <span className="text-neutral-500">
            {post.availableMonths?.length} month{post.availableMonths?.length === 1 ? '' : 's'}
          </span>
        </div>
      )}
    </motion.div>
  );
}
