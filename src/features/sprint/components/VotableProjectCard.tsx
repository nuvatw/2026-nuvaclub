'use client';

import Image from 'next/image';
import { Card, CardContent, Badge } from '@/components/atoms';
import { StarSolidIcon, StarIcon, ExternalLinkIcon } from '@/components/icons';
import type { ProjectWithRelations } from '@/lib/db/repositories';
import { cn } from '@/lib/utils';

interface VotableProjectCardProps {
  project: ProjectWithRelations;
  isVoted: boolean;
  voteCount: number;
  onVote?: () => void;
  isVotingEnabled: boolean;
  isDisabled?: boolean;
  disabledReason?: string;
  className?: string;
  /** Open project in modal instead of navigating */
  onOpenModal?: () => void;
}

export function VotableProjectCard({
  project,
  isVoted,
  voteCount,
  onVote,
  isVotingEnabled,
  isDisabled = false,
  disabledReason,
  className,
  onOpenModal,
}: VotableProjectCardProps) {
  const handleVoteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onVote && !isDisabled) {
      onVote();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.key === 'Enter' || e.key === ' ') && onVote && !isDisabled) {
      e.preventDefault();
      onVote();
    }
  };

  const handleCardClick = (e: React.MouseEvent) => {
    if (onOpenModal) {
      e.preventDefault();
      onOpenModal();
    }
  };

  const CardWrapper = onOpenModal ? 'div' : 'a';
  const cardProps = onOpenModal
    ? { onClick: handleCardClick, role: 'button', tabIndex: 0, 'aria-label': `View ${project.title}` }
    : { href: `/sprint/project/${project.id}` };

  return (
    <Card hover padding="none" className={cn('overflow-hidden group cursor-pointer', className)}>
      <CardWrapper {...(cardProps as any)}>
        <div className="relative aspect-video">
          <Image
            src={project.thumbnailUrl}
            alt={project.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-transparent to-transparent" />

          {/* Rank Badge */}
          {project.rank && project.rank <= 3 && (
            <div className="absolute top-3 left-3">
              <Badge
                variant={
                  project.rank === 1
                    ? 'warning'
                    : project.rank === 2
                      ? 'default'
                      : 'outline'
                }
              >
                #{project.rank}
              </Badge>
            </div>
          )}

          {/* Starred indicator */}
          {isVoted && (
            <div className="absolute top-3 right-3">
              <div className="flex items-center gap-1 bg-amber-500/90 text-black px-2 py-0.5 rounded-full text-xs font-medium">
                <StarSolidIcon size="sm" className="w-3 h-3" />
                Starred
              </div>
            </div>
          )}
        </div>
        <CardContent className="p-4">
          <h3 className="text-base font-semibold text-white mb-1.5 group-hover:text-primary-400 transition-colors line-clamp-1">
            {project.title}
          </h3>
          <p className="text-sm text-neutral-400 line-clamp-2 mb-3">
            {project.description}
          </p>

          {/* Author */}
          <div className="flex items-center gap-2 mb-3">
            {project.author?.avatar && (
              <Image
                src={project.author.avatar}
                alt={project.author.name}
                width={20}
                height={20}
                className="rounded-full"
              />
            )}
            <span className="text-xs text-neutral-500">
              {project.author?.name ?? 'Anonymous'}
            </span>
          </div>

          {/* Vote Stats and Button */}
          <div className="flex items-center justify-between">
            {/* Vote count display */}
            <div className="flex items-center gap-1 text-sm">
              <StarSolidIcon size="sm" className={isVoted ? 'text-amber-400' : 'text-neutral-500'} />
              <span className={cn('font-medium', isVoted ? 'text-amber-400' : 'text-neutral-400')}>
                {voteCount}
              </span>
            </div>

            {/* Vote Button */}
            {isVotingEnabled && (
              <button
                onClick={handleVoteClick}
                onKeyDown={handleKeyDown}
                disabled={isDisabled && !isVoted}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all',
                  isVoted
                    ? 'bg-amber-500/20 text-amber-400 hover:bg-amber-500/30'
                    : isDisabled
                      ? 'bg-neutral-800 text-neutral-500 cursor-not-allowed'
                      : 'bg-amber-500 text-black hover:bg-amber-600'
                )}
                aria-label={
                  isVoted
                    ? `Remove star from ${project.title}`
                    : `Give a star to ${project.title}`
                }
                title={isDisabled && !isVoted ? disabledReason : undefined}
              >
                {isVoted ? (
                  <>
                    <StarSolidIcon size="sm" />
                    <span>Starred</span>
                  </>
                ) : (
                  <>
                    <StarIcon size="sm" />
                    <span>Star</span>
                  </>
                )}
              </button>
            )}
          </div>

          {/* Tech Stack */}
          {project.techStack && project.techStack.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-3">
              {project.techStack.slice(0, 3).map((tech) => (
                <span
                  key={tech}
                  className="px-1.5 py-0.5 text-xs bg-neutral-800 text-neutral-400 rounded"
                >
                  {tech}
                </span>
              ))}
            </div>
          )}

          {/* Links - use buttons to avoid nested <a> inside Link */}
          {(project.githubUrl || project.liveUrl) && (
            <div className="flex items-center gap-2 mt-3 pt-3 border-t border-neutral-800">
              {project.githubUrl && (
                <button
                  type="button"
                  className="text-neutral-400 hover:text-white transition-colors"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    window.open(project.githubUrl, '_blank', 'noopener,noreferrer');
                  }}
                  aria-label="View on GitHub"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                  </svg>
                </button>
              )}
              {project.liveUrl && (
                <button
                  type="button"
                  className="text-neutral-400 hover:text-white transition-colors"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    window.open(project.liveUrl, '_blank', 'noopener,noreferrer');
                  }}
                  aria-label="View live demo"
                >
                  <ExternalLinkIcon size="md" />
                </button>
              )}
            </div>
          )}
        </CardContent>
      </CardWrapper>
    </Card>
  );
}
