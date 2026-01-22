'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion } from 'motion/react';
import { Badge } from '@/components/atoms';
import { cn } from '@/lib/utils';
import { formatTimeAgo } from '@/lib/utils/date';
import { MatchingCommentForm } from './MatchingCommentForm';
import type { MatchingCommentWithRelations } from '@/lib/db/hooks/useMatchingComments';

interface MatchingCommentListProps {
  comments: MatchingCommentWithRelations[];
  onAddComment: (content: string, isPrivate: boolean, parentId?: string) => void;
  currentUserId?: string;
}

function CommentItem({
  comment,
  onReply,
  currentUserId,
  depth = 0,
}: {
  comment: MatchingCommentWithRelations;
  onReply: (content: string, isPrivate: boolean, parentId: string) => void;
  currentUserId?: string;
  depth?: number;
}) {
  const [isReplying, setIsReplying] = useState(false);
  const isOwnComment = currentUserId === comment.authorId;

  return (
    <motion.div
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn('relative', depth > 0 && 'ml-8 pl-4 border-l border-neutral-800')}
    >
      <div className="flex gap-3">
        <Image
          src={comment.author?.avatar || 'https://i.pravatar.cc/150?u=default'}
          alt={comment.author?.name || 'User'}
          width={36}
          height={36}
          className="rounded-full flex-shrink-0"
        />

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-medium text-white text-sm">
              {comment.author?.name || 'Unknown User'}
            </span>
            {comment.isPrivate && (
              <Badge variant="default" size="sm" className="bg-neutral-700 text-neutral-400">
                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
                Private
              </Badge>
            )}
            <span className="text-xs text-neutral-500">
              {formatTimeAgo(comment.createdAt, 'en-US')}
            </span>
          </div>

          <p className="text-sm text-neutral-300 mb-2 whitespace-pre-wrap">{comment.content}</p>

          <div className="flex items-center gap-4">
            {depth < 2 && (
              <button
                onClick={() => setIsReplying(!isReplying)}
                className="text-xs text-neutral-500 hover:text-primary-400 transition-colors"
              >
                Reply
              </button>
            )}
            {isOwnComment && (
              <button className="text-xs text-neutral-500 hover:text-red-400 transition-colors">
                Delete
              </button>
            )}
          </div>

          {isReplying && (
            <div className="mt-3">
              <MatchingCommentForm
                isReply
                placeholder="Write a reply..."
                onSubmit={(content, isPrivate) => {
                  onReply(content, isPrivate, comment.id);
                  setIsReplying(false);
                }}
                onCancel={() => setIsReplying(false)}
              />
            </div>
          )}
        </div>
      </div>

      {/* Replies */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="mt-4 space-y-4">
          {comment.replies.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              onReply={onReply}
              currentUserId={currentUserId}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </motion.div>
  );
}

export function MatchingCommentList({
  comments,
  onAddComment,
  currentUserId,
}: MatchingCommentListProps) {
  return (
    <div className="space-y-6">
      {/* Comment Form */}
      <MatchingCommentForm
        onSubmit={(content, isPrivate) => onAddComment(content, isPrivate)}
        placeholder="Add a comment..."
      />

      {/* Comments List */}
      {comments.length === 0 ? (
        <div className="text-center py-8">
          <svg
            className="w-12 h-12 mx-auto mb-3 text-neutral-700"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
          <p className="text-neutral-500">No comments yet. Be the first to comment!</p>
        </div>
      ) : (
        <div className="space-y-6">
          {comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              onReply={onAddComment}
              currentUserId={currentUserId}
            />
          ))}
        </div>
      )}
    </div>
  );
}
