'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { cn } from '@/lib/utils';

interface MarkdownContentProps {
  content: string;
  className?: string;
}

export function MarkdownContent({ content, className }: MarkdownContentProps) {
  return (
    <div
      className={cn(
        'prose prose-invert max-w-none',
        // Headings
        'prose-headings:text-white prose-headings:font-semibold',
        'prose-h1:text-2xl prose-h1:border-b prose-h1:border-neutral-800 prose-h1:pb-3 prose-h1:mb-4',
        'prose-h2:text-xl prose-h2:mt-8 prose-h2:mb-4',
        'prose-h3:text-lg prose-h3:mt-6 prose-h3:mb-3',
        // Paragraphs
        'prose-p:text-neutral-300 prose-p:leading-relaxed',
        // Links
        'prose-a:text-primary-400 prose-a:no-underline hover:prose-a:underline',
        // Lists
        'prose-ul:text-neutral-300 prose-ol:text-neutral-300',
        'prose-li:marker:text-neutral-500',
        // Code
        'prose-code:text-primary-300 prose-code:bg-neutral-800 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:before:content-none prose-code:after:content-none',
        'prose-pre:bg-neutral-900 prose-pre:border prose-pre:border-neutral-800',
        // Blockquotes
        'prose-blockquote:border-l-primary-500 prose-blockquote:bg-neutral-800/50 prose-blockquote:py-1 prose-blockquote:px-4 prose-blockquote:rounded-r-lg',
        'prose-blockquote:text-neutral-300 prose-blockquote:not-italic',
        // Tables
        'prose-table:border prose-table:border-neutral-800',
        'prose-th:bg-neutral-800/80 prose-th:text-neutral-200 prose-th:px-4 prose-th:py-2',
        'prose-td:border-t prose-td:border-neutral-800 prose-td:px-4 prose-td:py-2 prose-td:text-neutral-300',
        // Strong/emphasis
        'prose-strong:text-white prose-strong:font-semibold',
        'prose-em:text-neutral-200',
        // Hr
        'prose-hr:border-neutral-800',
        className
      )}
    >
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
    </div>
  );
}
