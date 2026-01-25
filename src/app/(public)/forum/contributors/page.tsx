'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'motion/react';
import { SparklesIcon, ChevronLeftIcon } from '@/components/icons';
import { useLeaderboard } from '@/lib/db/hooks';
import { IDENTITY_COLORS, IDENTITY_LABELS, type IdentityType } from '@/features/auth/types';
import { cn } from '@/lib/utils';
import { PageTransition } from '@/components/molecules/PageTransition';
import { ForumPageSkeleton } from '@/components/skeletons';

// ============================================================================
// TOP CONTRIBUTORS PAGE
// ============================================================================

function ContributorCard({
  contributor,
  index,
}: {
  contributor: {
    userId: string;
    name: string;
    avatar?: string;
    identityType: string;
    totalPoints: number;
  };
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="flex items-center gap-4 p-4 bg-[#1a1a1b] border border-[#343536] rounded-lg hover:border-[#4a4a4b] transition-colors"
    >
      {/* Rank */}
      <div className="flex-shrink-0 w-8 text-center">
        {index < 3 ? (
          <div
            className={cn(
              'w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold',
              index === 0 && 'bg-amber-500 text-amber-950',
              index === 1 && 'bg-neutral-400 text-neutral-900',
              index === 2 && 'bg-amber-700 text-amber-100'
            )}
          >
            {index + 1}
          </div>
        ) : (
          <span className="text-[#818384] font-medium">{index + 1}</span>
        )}
      </div>

      {/* Avatar */}
      <div className="flex-shrink-0">
        {contributor.avatar ? (
          <Image
            src={contributor.avatar}
            alt={contributor.name}
            width={48}
            height={48}
            className="rounded-full"
          />
        ) : (
          <div className="w-12 h-12 rounded-full bg-[#343536] flex items-center justify-center text-[#818384] text-lg font-medium">
            {contributor.name.charAt(0)}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-base font-medium text-[#d7dadc] truncate">
            {contributor.name}
          </span>
          <span
            className={cn(
              'w-2 h-2 rounded-full flex-shrink-0',
              IDENTITY_COLORS[contributor.identityType as IdentityType]
            )}
            title={IDENTITY_LABELS[contributor.identityType as IdentityType]}
          />
        </div>
        <p className="text-sm text-[#818384]">
          {contributor.totalPoints.toLocaleString()} points
        </p>
      </div>

      {/* Badge for top 3 */}
      {index < 3 && (
        <div className="flex-shrink-0">
          <SparklesIcon
            size="md"
            className={cn(
              index === 0 && 'text-amber-400',
              index === 1 && 'text-neutral-400',
              index === 2 && 'text-amber-600'
            )}
          />
        </div>
      )}
    </motion.div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="space-y-3">
      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
        <div
          key={i}
          className="flex items-center gap-4 p-4 bg-[#1a1a1b] border border-[#343536] rounded-lg animate-pulse"
        >
          <div className="w-8 h-8 rounded-full bg-[#343536]" />
          <div className="w-12 h-12 rounded-full bg-[#343536]" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-[#343536] rounded w-1/3" />
            <div className="h-3 bg-[#343536] rounded w-1/4" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function ContributorsPage() {
  const { entries, isLoading } = useLeaderboard(20);

  return (
    <PageTransition skeleton={<ForumPageSkeleton />}>
      <div className="min-h-screen bg-[#030303]">
        <div className="max-w-2xl mx-auto px-4 py-6">
          {/* Back Link */}
          <Link
            href="/forum"
            className="inline-flex items-center gap-2 text-[#818384] hover:text-[#d7dadc] transition-colors mb-6"
          >
            <ChevronLeftIcon size="sm" />
            Back to Forum
          </Link>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center gap-3 mb-2">
              <SparklesIcon size="lg" className="text-amber-400" />
              <h1 className="text-2xl font-bold text-[#d7dadc]">Top Contributors</h1>
            </div>
            <p className="text-[#818384]">
              Community members with the highest engagement and contribution scores.
            </p>
          </motion.div>

          {/* Contributors List */}
          {isLoading ? (
            <LoadingSkeleton />
          ) : (
            <div className="space-y-3">
              {entries.map((contributor, index) => (
                <ContributorCard
                  key={contributor.userId}
                  contributor={contributor}
                  index={index}
                />
              ))}
            </div>
          )}

          {/* Empty State */}
          {!isLoading && entries.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12 bg-[#1a1a1b] border border-[#343536] rounded-lg"
            >
              <SparklesIcon size="lg" className="mx-auto mb-3 text-[#818384]" />
              <h3 className="text-lg font-semibold text-[#d7dadc] mb-1.5">
                No contributors yet
              </h3>
              <p className="text-sm text-[#818384]">
                Start participating in the forum to earn points!
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </PageTransition>
  );
}
