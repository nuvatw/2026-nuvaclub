'use client';

import { useState } from 'react';
import Image from 'next/image';
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
  getNunuLevelConfig,
  formatPrice,
  formatAvailableMonths,
} from '@/features/space/types';
import type { NunuLevel, PriceType } from '@/features/space/types';

interface MatchingPostDetailProps {
  post: MatchingPostWithRelations;
  comments: MatchingCommentWithRelations[];
  currentUserId?: string;
  currentUserName?: string;
  currentUserAvatar?: string;
  isOpen: boolean;
  onClose: () => void;
  onSendRequest?: (message: string) => void;
  onAddComment: (content: string, isPrivate: boolean, parentId?: string) => void;
  hidePrice?: boolean;
}

export function MatchingPostDetail({
  post,
  comments,
  currentUserId,
  currentUserName,
  currentUserAvatar,
  isOpen,
  onClose,
  onSendRequest,
  onAddComment,
  hidePrice = false,
}: MatchingPostDetailProps) {
  const [showMessageForm, setShowMessageForm] = useState(false);
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);

  const levelConfig = post.author?.nunuLevel
    ? getNunuLevelConfig(post.author.nunuLevel as NunuLevel)
    : null;

  const handleSendRequest = async () => {
    if (!message.trim() || !onSendRequest) return;
    setIsSending(true);
    onSendRequest(message.trim());
    setIsSending(false);
    setMessage('');
    setShowMessageForm(false);
    onClose();
  };

  const handleClose = () => {
    setShowMessageForm(false);
    setMessage('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="lg">
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
              onClick={handleClose}
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
                </div>
              </div>
            </>
          )}
        </div>

        {/* Pricing & Availability (only if not hidden) */}
        {!hidePrice && (
          <div className="grid grid-cols-2 gap-4 mb-6 p-4 rounded-lg bg-neutral-800/30 border border-neutral-800">
            <div>
              <div className="text-xs text-neutral-500 uppercase tracking-wider mb-1">Price</div>
              <div className="text-lg font-semibold text-primary-400">
                {formatPrice(post.priceType as PriceType, post.priceAmount, post.priceMin, post.priceMax, post.priceCurrency)}
              </div>
            </div>
            <div>
              <div className="text-xs text-neutral-500 uppercase tracking-wider mb-1">Available</div>
              <div className="text-sm text-white">
                {formatAvailableMonths(post.availableMonths || [])}
              </div>
            </div>
            {post.maxSlots !== undefined && post.type === 'nunu-looking-for-vava' && (
              <div className="col-span-2">
                <div className="text-xs text-neutral-500 uppercase tracking-wider mb-1">Slots</div>
                <div className="text-sm text-white">
                  {(post.maxSlots ?? 0) - (post.currentSlots ?? 0)} of {post.maxSlots} available
                </div>
              </div>
            )}
          </div>
        )}

        {/* Availability only (when price is hidden) */}
        {hidePrice && (
          <div className="mb-6 p-4 rounded-lg bg-neutral-800/30 border border-neutral-800">
            <div className="text-xs text-neutral-500 uppercase tracking-wider mb-1">Available</div>
            <div className="text-sm text-white">
              {formatAvailableMonths(post.availableMonths || [])}
            </div>
          </div>
        )}

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

        {/* Mentored Months Badge */}
        {post.author?.mentoredMonths !== undefined && post.author.mentoredMonths > 0 && (
          <div className="mb-6 pb-6 border-b border-neutral-800">
            <div className="flex items-center gap-2 text-sm">
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-500/10 text-blue-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {post.author.mentoredMonths} months mentored
              </span>
            </div>
          </div>
        )}

        {/* Action Button / Message Form */}
        {onSendRequest && (
          <div className="mb-6">
            {!showMessageForm ? (
              <Button className="w-full" onClick={() => setShowMessageForm(true)}>
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
                Send Request
              </Button>
            ) : (
              <div className="space-y-4 p-4 rounded-xl bg-neutral-800/50 border border-neutral-700">
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Write a message to {post.author?.name}
                  </label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Introduce yourself and explain why you'd like to connect..."
                    rows={4}
                    className={cn(
                      'w-full px-3 py-2 rounded-lg text-sm',
                      'bg-neutral-900 border border-neutral-700 text-white placeholder-neutral-500',
                      'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent',
                      'resize-none'
                    )}
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="secondary"
                    className="flex-1"
                    onClick={() => {
                      setShowMessageForm(false);
                      setMessage('');
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    className="flex-1"
                    onClick={handleSendRequest}
                    disabled={!message.trim() || isSending}
                  >
                    {isSending ? 'Sending...' : 'Send Request'}
                  </Button>
                </div>
              </div>
            )}
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
