'use client';

import { useMemo } from 'react';
import Image from 'next/image';
import { Card, CardContent } from '@/components/atoms';
import { StarSolidIcon, StarIcon } from '@/components/icons';
import { MAX_VOTES_PER_SPRINT } from '../hooks/useSprintVoting';
import type { ProjectWithRelations } from '@/lib/db/repositories';
import { cn } from '@/lib/utils';

interface MyVotesSectionProps {
  votedProjectIds: string[];
  projects: ProjectWithRelations[];
  remainingVotes: number;
  totalVotes: number;
  onUnvote?: (projectId: string) => void;
  isVotingEnabled: boolean;
  className?: string;
}

export function MyVotesSection({
  votedProjectIds,
  projects,
  remainingVotes,
  totalVotes,
  onUnvote,
  isVotingEnabled,
  className,
}: MyVotesSectionProps) {
  const votedProjects = useMemo(() => {
    return projects.filter((p) => votedProjectIds.includes(p.id));
  }, [projects, votedProjectIds]);

  return (
    <section className={cn('mb-12', className)}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h2 className="text-xl font-bold text-white">我的投票</h2>

        {/* 5-Star Meter */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1" role="meter" aria-label={`已投 ${totalVotes} 票，剩餘 ${remainingVotes} 票`}>
            {Array.from({ length: MAX_VOTES_PER_SPRINT }).map((_, i) => (
              <span key={i} className="text-lg">
                {i < totalVotes ? (
                  <StarSolidIcon size="md" className="text-amber-400" />
                ) : (
                  <StarIcon size="md" className="text-neutral-600" />
                )}
              </span>
            ))}
          </div>
          <span className="text-sm text-neutral-400">
            剩下 <span className="text-white font-semibold">{remainingVotes}</span> 個星星
          </span>
        </div>
      </div>

      {votedProjects.length === 0 ? (
        <Card className="bg-neutral-900/50 border-dashed">
          <CardContent className="py-8 text-center">
            <div className="flex justify-center mb-3">
              <StarIcon size="lg" className="text-neutral-600" />
            </div>
            <p className="text-neutral-400 mb-2">你還沒有投票</p>
            <p className="text-sm text-neutral-500">
              瀏覽下方專案，點擊星星為喜歡的專案投票
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {votedProjects.map((project) => (
            <Card key={project.id} hover className="overflow-hidden group">
              <div className="relative aspect-video">
                <Image
                  src={project.thumbnailUrl}
                  alt={project.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-transparent to-transparent" />
                {/* Voted Badge */}
                <div className="absolute top-2 right-2">
                  <div className="flex items-center gap-1 bg-amber-500/90 text-black px-2 py-0.5 rounded-full text-xs font-medium">
                    <StarSolidIcon size="sm" className="w-3 h-3" />
                    已投票
                  </div>
                </div>
              </div>
              <CardContent className="p-3">
                <h3 className="text-sm font-semibold text-white line-clamp-1 mb-1">
                  {project.title}
                </h3>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-neutral-500">
                    {project.author?.name ?? '匿名'}
                  </span>
                  {isVotingEnabled && onUnvote && (
                    <button
                      onClick={() => onUnvote(project.id)}
                      className="text-xs text-neutral-400 hover:text-red-400 transition-colors"
                      aria-label={`取消對 ${project.title} 的投票`}
                    >
                      取消投票
                    </button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </section>
  );
}
