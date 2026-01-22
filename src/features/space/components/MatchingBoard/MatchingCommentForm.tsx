'use client';

import { useState } from 'react';
import { Button } from '@/components/atoms';
import { cn } from '@/lib/utils';

interface MatchingCommentFormProps {
  onSubmit: (content: string, isPrivate: boolean) => void;
  isReply?: boolean;
  onCancel?: () => void;
  placeholder?: string;
}

export function MatchingCommentForm({
  onSubmit,
  isReply = false,
  onCancel,
  placeholder = 'Write a comment...',
}: MatchingCommentFormProps) {
  const [content, setContent] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [isExpanded, setIsExpanded] = useState(isReply);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    onSubmit(content.trim(), isPrivate);
    setContent('');
    setIsPrivate(false);
    if (!isReply) setIsExpanded(false);
  };

  if (!isExpanded && !isReply) {
    return (
      <button
        onClick={() => setIsExpanded(true)}
        className={cn(
          'w-full p-3 rounded-lg text-left',
          'bg-neutral-800/50 border border-neutral-700',
          'text-neutral-500 hover:text-neutral-400 hover:border-neutral-600',
          'transition-colors'
        )}
      >
        {placeholder}
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder={placeholder}
        rows={3}
        className={cn(
          'w-full p-3 rounded-lg resize-none',
          'bg-neutral-800/50 border border-neutral-700',
          'text-white placeholder-neutral-500',
          'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent'
        )}
        autoFocus={isReply}
      />

      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={isPrivate}
            onChange={(e) => setIsPrivate(e.target.checked)}
            className="w-4 h-4 rounded border-neutral-600 bg-neutral-800 text-primary-500 focus:ring-primary-500"
          />
          <span className="text-sm text-neutral-400">
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
              Private (only visible to post author)
            </span>
          </span>
        </label>

        <div className="flex items-center gap-2">
          {(isReply || isExpanded) && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => {
                setContent('');
                setIsPrivate(false);
                if (!isReply) setIsExpanded(false);
                onCancel?.();
              }}
            >
              Cancel
            </Button>
          )}
          <Button type="submit" size="sm" disabled={!content.trim()}>
            {isReply ? 'Reply' : 'Comment'}
          </Button>
        </div>
      </div>
    </form>
  );
}
