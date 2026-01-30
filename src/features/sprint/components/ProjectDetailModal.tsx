'use client';

import Image from 'next/image';
import { Modal, Badge } from '@/components/atoms';
import {
  EyeIcon,
  StarIcon,
  StarSolidIcon,
  ChevronUpIcon,
  ExternalLinkIcon,
  HeartIcon,
  HeartSolidIcon,
  ChatBubbleIcon,
  ShareIcon,
} from '@/components/icons';
import { MarkdownContent } from '@/features/document/components/MarkdownContent';
import type { ProjectWithRelations } from '@/features/sprint/types';
import { getRankLabel, getRankStyle } from '@/features/sprint/types';
import { formatDateMedium } from '@/lib/utils/date';
import { cn } from '@/lib/utils';

interface ProjectDetailModalProps {
  project: ProjectWithRelations | null;
  isOpen: boolean;
  onClose: () => void;
  // Voting props
  isVoted?: boolean;
  voteCount?: number;
  onVote?: () => void;
  isVotingEnabled?: boolean;
  isVoteDisabled?: boolean;
  voteDisabledReason?: string;
  // Season/Sprint info
  seasonName?: string;
  sprintTheme?: string;
  // Project content (markdown)
  content?: string;
  // Actions
  isLiked?: boolean;
  onLike?: () => void;
  onComment?: () => void;
  onShare?: () => void;
}

export function ProjectDetailModal({
  project,
  isOpen,
  onClose,
  isVoted = false,
  voteCount = 0,
  onVote,
  isVotingEnabled = false,
  isVoteDisabled = false,
  voteDisabledReason,
  seasonName,
  sprintTheme,
  content,
  isLiked = false,
  onLike,
  onComment,
  onShare,
}: ProjectDetailModalProps) {
  if (!project) return null;

  const handleVoteClick = () => {
    if (onVote && !isVoteDisabled) {
      onVote();
    }
  };

  const handleShare = () => {
    if (onShare) {
      onShare();
    } else {
      // Default share behavior using Web Share API
      if (navigator.share) {
        navigator.share({
          title: project.title,
          text: project.description,
          url: window.location.href,
        }).catch(() => {
          // Silently handle share cancellation
        });
      } else {
        // Fallback: copy URL to clipboard
        navigator.clipboard.writeText(window.location.href);
      }
    }
  };

  // GitHub icon component for reuse
  const GitHubIcon = () => (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fillRule="evenodd"
        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
        clipRule="evenodd"
      />
    </svg>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="full"
      padding="sm"
    >
      <div className="max-h-[80vh] overflow-y-auto">
        {/* Thumbnail */}
        <div className="relative aspect-video rounded-xl overflow-hidden mb-6">
          <Image
            src={project.thumbnailUrl}
            alt={project.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/80 via-transparent to-transparent" />

          {/* Rank Badge */}
          {project.rank && project.rank <= 3 && (
            <div className="absolute top-4 left-4">
              <div
                className={`px-4 py-2 rounded-full border font-bold text-lg ${getRankStyle(project.rank)}`}
              >
                {getRankLabel(project.rank)}
              </div>
            </div>
          )}

          {/* Season/Sprint Info */}
          <div className="absolute top-4 right-4 flex gap-2">
            {seasonName && (
              <Badge variant="primary">{seasonName}</Badge>
            )}
            {sprintTheme && (
              <Badge variant="outline">{sprintTheme}</Badge>
            )}
          </div>
        </div>

        {/* Title and Meta */}
        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
          {project.title}
        </h2>

        <p className="text-base text-neutral-400 mb-5">
          {project.description}
        </p>

        {/* Author Info */}
        <div className="flex items-center gap-4 mb-5">
          {project.author?.avatar && (
            <Image
              src={project.author.avatar}
              alt={project.author.name}
              width={48}
              height={48}
              className="rounded-full"
            />
          )}
          <div>
            <p className="text-white font-medium">{project.author?.name ?? 'Anonymous'}</p>
            <p className="text-sm text-neutral-500">
              Submitted on {formatDateMedium(project.createdAt)}
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="flex flex-wrap items-center gap-5 mb-5 pb-5 border-b border-neutral-800">
          <div className="flex items-center gap-2">
            <EyeIcon size="md" className="text-neutral-400" />
            <span className="text-white font-medium">{project.stats?.viewCount?.toLocaleString() ?? 0}</span>
            <span className="text-neutral-500">views</span>
          </div>
          <div className="flex items-center gap-2">
            <ChevronUpIcon size="md" className="text-primary-400" />
            <span className="text-white font-medium">{voteCount}</span>
            <span className="text-neutral-500">votes</span>
          </div>
        </div>

        {/* Primary Buttons - GitHub, View Source, Give a Star (if voting) */}
        <div className="flex flex-wrap gap-3 mb-5">
          {/* GitHub Button */}
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg transition-colors font-medium"
              aria-label="View on GitHub"
            >
              <GitHubIcon />
              GitHub
            </a>
          )}

          {/* View Source Code Button */}
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg transition-colors font-medium"
              aria-label="View source code"
            >
              <ExternalLinkIcon size="md" />
              View source code
            </a>
          )}

          {/* Live Demo Button */}
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2.5 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors font-medium"
              aria-label="View live demo"
            >
              <ExternalLinkIcon size="md" />
              Live Demo
            </a>
          )}

          {/* Give a Star Button - Only shown during voting period */}
          {isVotingEnabled && onVote && (
            <button
              onClick={handleVoteClick}
              disabled={isVoteDisabled && !isVoted}
              className={cn(
                'flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all',
                isVoted
                  ? 'bg-amber-500/20 text-amber-400 hover:bg-amber-500/30'
                  : isVoteDisabled
                    ? 'bg-neutral-800 text-neutral-500 cursor-not-allowed'
                    : 'bg-amber-500 hover:bg-amber-600 text-black'
              )}
              aria-label={
                isVoted
                  ? `Remove star from ${project.title}`
                  : `Give a star to ${project.title}`
              }
              title={isVoteDisabled && !isVoted ? voteDisabledReason : undefined}
            >
              {isVoted ? (
                <>
                  <StarSolidIcon size="md" />
                  <span>Starred</span>
                </>
              ) : (
                <>
                  <StarIcon size="md" />
                  <span>Give a star</span>
                </>
              )}
            </button>
          )}
        </div>

        {/* Actions Row - Heart, Comment, Share */}
        <div className="flex items-center gap-2 mb-6 pb-5 border-b border-neutral-800">
          {/* Heart/Like Button */}
          <button
            onClick={onLike}
            className={cn(
              'flex items-center gap-1.5 px-3 py-2 rounded-lg transition-colors',
              isLiked
                ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                : 'bg-neutral-800 text-neutral-400 hover:bg-neutral-700 hover:text-white'
            )}
            aria-label={isLiked ? 'Unlike this project' : 'Like this project'}
          >
            {isLiked ? <HeartSolidIcon size="md" /> : <HeartIcon size="md" />}
            <span className="text-sm font-medium">Like</span>
          </button>

          {/* Comment Button */}
          <button
            onClick={onComment}
            className="flex items-center gap-1.5 px-3 py-2 bg-neutral-800 text-neutral-400 hover:bg-neutral-700 hover:text-white rounded-lg transition-colors"
            aria-label="Comment on this project"
          >
            <ChatBubbleIcon size="md" />
            <span className="text-sm font-medium">Comment</span>
          </button>

          {/* Share Button */}
          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 px-3 py-2 bg-neutral-800 text-neutral-400 hover:bg-neutral-700 hover:text-white rounded-lg transition-colors"
            aria-label="Share this project"
          >
            <ShareIcon size="md" />
            <span className="text-sm font-medium">Share</span>
          </button>
        </div>

        {/* Tech Stack */}
        {project.techStack && project.techStack.length > 0 && (
          <div className="mb-6">
            <h3 className="text-sm font-medium text-neutral-500 mb-3">Tech Stack</h3>
            <div className="flex flex-wrap gap-2">
              {project.techStack.map((tech) => (
                <span
                  key={tech}
                  className="px-3 py-1.5 text-sm bg-neutral-800 text-neutral-300 rounded-lg border border-neutral-700"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Markdown Article Content */}
        {content ? (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-white mb-4">About this project</h3>
            <MarkdownContent content={content} className="text-sm" />
          </div>
        ) : (
          /* Empty state when no content */
          <div className="mb-6 py-8 text-center border border-dashed border-neutral-700 rounded-xl">
            <p className="text-neutral-500">No detailed description available for this project.</p>
          </div>
        )}
      </div>
    </Modal>
  );
}
