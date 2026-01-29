'use client';

import { use, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import { motion } from 'motion/react';
import { Button, Badge, Card, CardContent } from '@/components/atoms';
import {
  ChevronLeftIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  BookmarkIcon,
  BookmarkSolidIcon,
  ShareIcon,
} from '@/components/icons';
import { Gate } from '@/features/auth/components/Gate';
import { useAuth } from '@/features/auth/components/AuthProvider';
import { usePost } from '@/lib/db/hooks/usePosts';
import { useTrackView, useBookmark, useShare } from '@/lib/db/hooks';
import { POST_CATEGORY_LABELS, POST_CATEGORY_COLORS } from '@/features/forum/types';
import { IDENTITY_LABELS, IDENTITY_COLORS, type IdentityType } from '@/features/auth/types';
import { cn } from '@/lib/utils';
import { formatDateWithTime } from '@/lib/utils/date';
import { PageTransition } from '@/components/molecules/PageTransition';
import { PostDetailSkeleton } from '@/components/skeletons';

interface PostPageProps {
  params: Promise<{ postId: string }>;
}

function LoadingState() {
  return <PostDetailSkeleton />;
}

function NotFoundState() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-white mb-4">Post Not Found</h1>
        <Link href="/forum">
          <Button>Back to Forum</Button>
        </Link>
      </div>
    </div>
  );
}

export default function PostPage({ params }: PostPageProps) {
  const { postId } = use(params);
  const { user } = useAuth();
  const { post, isLoading } = usePost(postId);

  // Track view on mount
  useTrackView(postId, user?.id);

  // Share and bookmark hooks
  const { share, showCopied } = useShare(postId, user?.id);
  const { isBookmarked, toggleBookmark, canBookmark } = useBookmark(postId, user?.id ?? null);

  const handleShare = async () => {
    await share();
  };

  const handleBookmark = () => {
    toggleBookmark();
  };

  // Loading state
  if (isLoading) {
    return <LoadingState />;
  }

  // Not found state
  if (!post) {
    return <NotFoundState />;
  }

  const authorIdentity = (post.author?.identity || 'explorer') as IdentityType;

  return (
    <PageTransition skeleton={<PostDetailSkeleton />}>
      <div className="min-h-screen py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <Link
            href="/forum"
            className="inline-flex items-center gap-2 text-neutral-400 hover:text-white transition-colors mb-6"
          >
            <ChevronLeftIcon size="sm" />
            Back to Forum
          </Link>

          {/* Post Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card>
              <CardContent>
                {/* Header */}
                <div className="flex items-center gap-2 mb-4">
                  {post.isPinned && <Badge variant="warning">Pinned</Badge>}
                  <span
                    className={cn(
                      'px-2 py-0.5 rounded text-xs font-medium',
                      POST_CATEGORY_COLORS[post.category]
                    )}
                  >
                    {POST_CATEGORY_LABELS[post.category]}
                  </span>
                </div>

                {/* Title */}
                <h1 className="text-2xl sm:text-3xl font-bold text-white mb-4">{post.title}</h1>

                {/* Author Info */}
                <div className="flex items-center gap-4 mb-6 pb-6 border-b border-neutral-800">
                  <div className="flex items-center gap-3">
                    {post.author?.avatar && (
                      <Image
                        src={post.author.avatar}
                        alt={post.author.name}
                        width={40}
                        height={40}
                        className="rounded-full"
                      />
                    )}
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-white">
                          {post.author?.name || 'Anonymous User'}
                        </span>
                        <span className={cn('px-2 py-0.5 rounded text-xs', IDENTITY_COLORS[authorIdentity])}>
                          {IDENTITY_LABELS[authorIdentity]}
                        </span>
                      </div>
                      <span className="text-sm text-neutral-400">{formatDateWithTime(post.createdAt)}</span>
                    </div>
                  </div>
                </div>

                {/* Content - Markdown Rendered */}
                <div
                  className={cn(
                    'mb-6',
                    'prose prose-invert prose-neutral max-w-none',
                    'prose-headings:text-white prose-headings:font-bold',
                    'prose-h1:text-2xl prose-h1:mt-6 prose-h1:mb-4',
                    'prose-h2:text-xl prose-h2:mt-5 prose-h2:mb-3',
                    'prose-h3:text-lg prose-h3:mt-4 prose-h3:mb-2',
                    'prose-p:text-neutral-200 prose-p:leading-relaxed',
                    'prose-a:text-primary-400 prose-a:no-underline hover:prose-a:underline',
                    'prose-strong:text-white prose-strong:font-semibold',
                    'prose-code:text-primary-400 prose-code:bg-neutral-800 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm',
                    'prose-pre:bg-neutral-800 prose-pre:border prose-pre:border-neutral-700',
                    'prose-ul:text-neutral-200 prose-ol:text-neutral-200',
                    'prose-li:marker:text-neutral-500',
                    'prose-blockquote:border-l-primary-500 prose-blockquote:text-neutral-300'
                  )}
                >
                  <ReactMarkdown>{post.content}</ReactMarkdown>
                </div>

                {/* Tags */}
                {post.tags && post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-6">
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 rounded-full text-sm bg-neutral-800 text-neutral-300"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center justify-between pt-6 border-t border-neutral-800">
                  <div className="flex items-center gap-4">
                    <Gate
                      permission="forum:like_comment"
                      fallback={<span className="text-sm text-neutral-500">Login to interact</span>}
                    >
                      <div className="flex items-center gap-2">
                        <button className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 transition-colors">
                          <ChevronUpIcon size="sm" className="text-green-400" />
                          <span className="text-sm text-neutral-300">{post.stats?.upvotes ?? 0}</span>
                        </button>
                        <button className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 transition-colors">
                          <ChevronDownIcon size="sm" className="text-red-400" />
                          <span className="text-sm text-neutral-300">{post.stats?.downvotes ?? 0}</span>
                        </button>
                      </div>
                    </Gate>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-neutral-400">
                    <span>{post.stats?.viewCount ?? 0} views</span>
                    <span>•</span>
                    <span>{post.stats?.commentCount ?? 0} replies</span>
                    {canBookmark && (
                      <button
                        onClick={handleBookmark}
                        className={cn(
                          'flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 transition-colors',
                          isBookmarked && 'text-amber-400'
                        )}
                      >
                        {isBookmarked ? (
                          <BookmarkSolidIcon size="sm" />
                        ) : (
                          <BookmarkIcon size="sm" />
                        )}
                        <span className={isBookmarked ? 'text-amber-400' : 'text-neutral-300'}>
                          {isBookmarked ? 'Saved' : 'Save'}
                        </span>
                      </button>
                    )}
                    <button
                      onClick={handleShare}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 transition-colors relative"
                    >
                      <ShareIcon size="sm" />
                      <span className="text-neutral-300">{showCopied ? 'Copied!' : 'Share'}</span>
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Comments Section */}
          <div className="mt-8">
            <h2 className="text-xl font-semibold text-white mb-4">
              Replies ({post.comments?.length || 0})
            </h2>

            {/* Comment Input */}
            <Gate
              permission="forum:like_comment"
              fallback={
                <Card className="mb-6">
                  <CardContent>
                    <p className="text-center text-neutral-400">Login to comment</p>
                  </CardContent>
                </Card>
              }
            >
              <Card className="mb-6">
                <CardContent>
                  <textarea
                    placeholder="Share your thoughts..."
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-lg p-3 text-white placeholder-neutral-500 focus:outline-none focus:border-primary-500 resize-none"
                    rows={3}
                  />
                  <div className="flex justify-end mt-3">
                    <Button>Post Reply</Button>
                  </div>
                </CardContent>
              </Card>
            </Gate>

            {/* Comment List */}
            <div className="space-y-4">
              {post.comments?.map((comment, index) => (
                <motion.div
                  key={comment.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card>
                    <CardContent>
                      <div className="flex gap-3">
                        {comment.author?.avatar && (
                          <Image
                            src={comment.author.avatar}
                            alt={comment.author.name}
                            width={32}
                            height={32}
                            className="rounded-full flex-shrink-0"
                          />
                        )}
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="font-medium text-white">
                              {comment.author?.name || 'Anonymous User'}
                            </span>
                            <span className="text-sm text-neutral-500">
                              {formatDateWithTime(comment.createdAt)}
                            </span>
                          </div>
                          <p className="text-neutral-300">{comment.content}</p>
                          <div className="flex items-center gap-4 mt-3">
                            <Gate permission="forum:like_comment">
                              <button className="flex items-center gap-1 text-sm text-neutral-400 hover:text-white transition-colors">
                                <ChevronUpIcon size="sm" />
                                {comment.stats?.score ?? 0}
                              </button>
                            </Gate>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {(!post.comments || post.comments.length === 0) && (
              <div className="text-center py-12">
                <p className="text-neutral-400">No replies yet. Be the first to comment!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
