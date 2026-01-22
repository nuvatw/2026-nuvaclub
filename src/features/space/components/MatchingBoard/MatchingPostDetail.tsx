'use client';

import Image from 'next/image';
import { motion } from 'motion/react';
import { Badge, Button, Modal } from '@/components/atoms';
import { cn } from '@/lib/utils';
import { formatTimeAgo } from '@/lib/utils/date';
import { MatchingCommentList } from './MatchingCommentList';
import type { MatchingPostWithRelations } from '@/lib/db/hooks/useMatchingPosts';
import type { MatchingCommentWithRelations } from '@/lib/db/hooks/useMatchingComments';
import {
  MATCHING_POST_TYPE_LABELS,
  MATCHING_POST_TYPE_COLORS,
  MATCHING_POST_TYPE_ICONS,
  TIME_SELECTION_LABELS,
  getNunuLevelConfig,
} from '@/features/space/types';
import type { NunuLevel } from '@/features/space/types';

interface MatchingPostDetailProps {
  post: MatchingPostWithRelations;
  comments: MatchingCommentWithRelations[];
  currentUserId?: string;
  isOpen: boolean;
  onClose: () => void;
  onRequestMatch?: () => void;
  onAddComment: (content: string, isPrivate: boolean, parentId?: string) => void;
}

export function MatchingPostDetail({
  post,
  comments,
  currentUserId,
  isOpen,
  onClose,
  onRequestMatch,
  onAddComment,
}: MatchingPostDetailProps) {
  const levelConfig = post.author?.nunuLevel
    ? getNunuLevelConfig(post.author.nunuLevel as NunuLevel)
    : null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <div className="max-h-[80vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-neutral-900 border-b border-neutral-800 p-4 -mx-6 -mt-6 mb-6 px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xl">{MATCHING_POST_TYPE_ICONS[post.type]}</span>
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
                  Verified Only
                </Badge>
              )}
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-white mb-4">{post.title}</h2>

        {/* Author Info */}
        <div className="flex items-center gap-4 mb-6 p-4 rounded-lg bg-neutral-800/50">
          {post.author && (
            <>
              <Image
                src={post.author.avatar || 'https://i.pravatar.cc/150?u=default'}
                alt={post.author.name}
                width={48}
                height={48}
                className="rounded-full"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-white">{post.author.name}</span>
                  {levelConfig && (
                    <span
                      className={cn(
                        'px-2 py-0.5 rounded text-xs font-medium border',
                        levelConfig.color
                      )}
                    >
                      {levelConfig.level} - {levelConfig.name}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3 text-sm text-neutral-400">
                  {post.author.rating && (
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      {post.author.rating.toFixed(1)}
                    </span>
                  )}
                  <span>
                    {TIME_SELECTION_LABELS[post.timeSelection]} - {post.timePeriod}
                  </span>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Content */}
        <div className="prose prose-invert prose-sm max-w-none mb-6">
          <p className="text-neutral-300 whitespace-pre-wrap">{post.content}</p>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-6">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 rounded-lg text-sm bg-neutral-800 text-neutral-300"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Stats */}
        <div className="flex items-center gap-6 text-sm text-neutral-500 mb-6 pb-6 border-b border-neutral-800">
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
            {post.viewCount} views
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
            {post.commentCount} comments
          </span>
          <span>Posted {formatTimeAgo(post.createdAt, 'en-US')}</span>
        </div>

        {/* Request Match Button */}
        {onRequestMatch && (
          <div className="mb-6">
            <Button className="w-full" onClick={onRequestMatch}>
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              Request Match
            </Button>
          </div>
        )}

        {/* Comments Section */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">
            Comments ({comments.length})
          </h3>
          <MatchingCommentList
            comments={comments}
            onAddComment={onAddComment}
            currentUserId={currentUserId}
          />
        </div>
      </div>
    </Modal>
  );
}
