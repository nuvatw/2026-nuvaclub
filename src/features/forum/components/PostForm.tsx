'use client';

import {
  useState,
  useCallback,
  useMemo,
  type FormEvent,
  type ChangeEvent,
} from 'react';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import { Button } from '@/components/atoms';
import { useCreatePost } from '@/features/forum/hooks/useCreatePost';
import {
  POST_CATEGORY_LABELS,
  POST_CATEGORY_COLORS,
  type PostCategory,
  type CreatePostInput,
} from '@/features/forum/types';
import { cn } from '@/lib/utils';

// ==========================================
// Types
// ==========================================

interface PostFormProps {
  authorId: string;
  onSuccess: (postId: string) => void;
  onCancel: () => void;
}

interface FormState {
  title: string;
  content: string;
  category: PostCategory;
  tagsInput: string;
}

interface FormErrors {
  title?: string;
  content?: string;
  category?: string;
  tags?: string;
}

// ==========================================
// Constants
// ==========================================

const INITIAL_FORM_STATE: FormState = {
  title: '',
  content: '',
  category: 'discussion',
  tagsInput: '',
};

const TITLE_MIN_LENGTH = 5;
const TITLE_MAX_LENGTH = 100;
const CONTENT_MIN_LENGTH = 20;
const CONTENT_MAX_LENGTH = 10000;
const MAX_TAGS = 5;
const TAG_MAX_LENGTH = 20;

const CATEGORIES: PostCategory[] = ['question', 'resource', 'announcement', 'discussion'];

// ==========================================
// Validation
// ==========================================

function validateForm(form: FormState): FormErrors {
  const errors: FormErrors = {};

  const trimmedTitle = form.title.trim();
  if (!trimmedTitle) {
    errors.title = 'Please enter a title';
  } else if (trimmedTitle.length < TITLE_MIN_LENGTH) {
    errors.title = `Title must be at least ${TITLE_MIN_LENGTH} characters`;
  } else if (trimmedTitle.length > TITLE_MAX_LENGTH) {
    errors.title = `Title cannot exceed ${TITLE_MAX_LENGTH} characters`;
  }

  const trimmedContent = form.content.trim();
  if (!trimmedContent) {
    errors.content = 'Please enter content';
  } else if (trimmedContent.length < CONTENT_MIN_LENGTH) {
    errors.content = `Content must be at least ${CONTENT_MIN_LENGTH} characters`;
  } else if (trimmedContent.length > CONTENT_MAX_LENGTH) {
    errors.content = `Content cannot exceed ${CONTENT_MAX_LENGTH} characters`;
  }

  if (!CATEGORIES.includes(form.category)) {
    errors.category = 'Please select a valid category';
  }

  const tags = parseTags(form.tagsInput);
  if (tags.length > MAX_TAGS) {
    errors.tags = `Maximum of ${MAX_TAGS} tags allowed`;
  }
  const invalidTag = tags.find((tag) => tag.length > TAG_MAX_LENGTH);
  if (invalidTag) {
    errors.tags = `Tag "${invalidTag}" exceeds ${TAG_MAX_LENGTH} characters`;
  }

  return errors;
}

function parseTags(input: string): string[] {
  return input
    .split(/[,，、\s]+/)
    .map((tag) => tag.trim())
    .filter((tag) => tag.length > 0);
}

// ==========================================
// Component
// ==========================================

export function PostForm({ authorId, onSuccess, onCancel }: PostFormProps) {
  const [form, setForm] = useState<FormState>(INITIAL_FORM_STATE);
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [previewMode, setPreviewMode] = useState(false);

  const { createPost, isLoading, error: submitError } = useCreatePost();

  const previewTags = useMemo(() => parseTags(form.tagsInput), [form.tagsInput]);

  const isValid = useMemo(() => {
    const validationErrors = validateForm(form);
    return Object.keys(validationErrors).length === 0;
  }, [form]);

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      setForm((prev) => ({ ...prev, [name]: value }));

      if (errors[name as keyof FormErrors]) {
        setErrors((prev) => {
          const next = { ...prev };
          delete next[name as keyof FormErrors];
          return next;
        });
      }
    },
    [errors]
  );

  const handleBlur = useCallback(
    (field: keyof FormState) => {
      setTouched((prev) => ({ ...prev, [field]: true }));
      const validationErrors = validateForm(form);
      if (validationErrors[field as keyof FormErrors]) {
        setErrors((prev) => ({
          ...prev,
          [field]: validationErrors[field as keyof FormErrors],
        }));
      }
    },
    [form]
  );

  const handleSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();

      const validationErrors = validateForm(form);
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        setTouched({ title: true, content: true, category: true, tagsInput: true });
        return;
      }

      const input: CreatePostInput = {
        title: form.title.trim(),
        content: form.content.trim(),
        category: form.category,
        authorId,
        tags: previewTags,
      };

      const result = await createPost(input);
      if (result) {
        onSuccess(result.id);
      }
    },
    [form, authorId, previewTags, createPost, onSuccess]
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {submitError && (
        <div className="p-4 rounded-lg bg-red-900/20 border border-red-800 text-red-400">
          {submitError}
        </div>
      )}

      {/* Category Selection */}
      <div>
        <label className="block text-sm font-medium text-neutral-300 mb-3">
          Category <span className="text-red-400">*</span>
        </label>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => setForm((prev) => ({ ...prev, category }))}
              className={cn(
                'px-4 py-2 rounded-lg text-sm font-medium transition-all',
                form.category === category
                  ? cn(
                      POST_CATEGORY_COLORS[category],
                      'ring-2 ring-offset-2 ring-offset-neutral-900'
                    )
                  : 'bg-neutral-800 text-neutral-400 hover:bg-neutral-700'
              )}
            >
              {POST_CATEGORY_LABELS[category]}
            </button>
          ))}
        </div>
        {touched.category && errors.category && (
          <p className="mt-1 text-sm text-red-400">{errors.category}</p>
        )}
      </div>

      {/* Title */}
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-neutral-300 mb-2">
          Title <span className="text-red-400">*</span>
        </label>
        <input
          id="title"
          name="title"
          type="text"
          value={form.title}
          onChange={handleChange}
          onBlur={() => handleBlur('title')}
          placeholder="Enter a clear title"
          maxLength={TITLE_MAX_LENGTH}
          className={cn(
            'w-full bg-neutral-800 border rounded-lg px-4 py-3',
            'text-white placeholder-neutral-500',
            'focus:outline-none focus:ring-2 focus:ring-primary-500',
            'transition-colors',
            touched.title && errors.title
              ? 'border-red-500'
              : 'border-neutral-700 focus:border-primary-500'
          )}
        />
        <div className="flex justify-between mt-1">
          {touched.title && errors.title ? (
            <p className="text-sm text-red-400">{errors.title}</p>
          ) : (
            <span />
          )}
          <span className="text-sm text-neutral-500">
            {form.title.length}/{TITLE_MAX_LENGTH}
          </span>
        </div>
      </div>

      {/* Content with Preview Toggle */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label htmlFor="content" className="block text-sm font-medium text-neutral-300">
            Content <span className="text-red-400">*</span>
          </label>
          <div className="flex gap-1 bg-neutral-800 rounded-lg p-1">
            <button
              type="button"
              onClick={() => setPreviewMode(false)}
              className={cn(
                'px-3 py-1 text-sm rounded-md transition-colors',
                !previewMode
                  ? 'bg-neutral-700 text-white'
                  : 'text-neutral-400 hover:text-neutral-300'
              )}
            >
              Edit
            </button>
            <button
              type="button"
              onClick={() => setPreviewMode(true)}
              className={cn(
                'px-3 py-1 text-sm rounded-md transition-colors',
                previewMode
                  ? 'bg-neutral-700 text-white'
                  : 'text-neutral-400 hover:text-neutral-300'
              )}
            >
              Preview
            </button>
          </div>
        </div>

        {previewMode ? (
          <div
            className={cn(
              'w-full min-h-[280px] bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-3',
              'prose prose-invert prose-sm max-w-none',
              'prose-headings:text-white prose-p:text-neutral-300',
              'prose-a:text-primary-400 prose-strong:text-white',
              'prose-code:text-primary-400 prose-code:bg-neutral-900 prose-code:px-1 prose-code:rounded'
            )}
          >
            {form.content.trim() ? (
              <ReactMarkdown>{form.content}</ReactMarkdown>
            ) : (
              <p className="text-neutral-500 italic">No content to preview</p>
            )}
          </div>
        ) : (
          <textarea
            id="content"
            name="content"
            value={form.content}
            onChange={handleChange}
            onBlur={() => handleBlur('content')}
            placeholder="Describe your thoughts, questions, or share content in detail... Markdown supported"
            rows={12}
            maxLength={CONTENT_MAX_LENGTH}
            className={cn(
              'w-full bg-neutral-800 border rounded-lg px-4 py-3',
              'text-white placeholder-neutral-500',
              'focus:outline-none focus:ring-2 focus:ring-primary-500',
              'transition-colors resize-none',
              touched.content && errors.content
                ? 'border-red-500'
                : 'border-neutral-700 focus:border-primary-500'
            )}
          />
        )}

        <div className="flex justify-between mt-1">
          {touched.content && errors.content ? (
            <p className="text-sm text-red-400">{errors.content}</p>
          ) : (
            <p className="text-sm text-neutral-500">
              Markdown supported
              <Link
                href="/document"
                target="_blank"
                className="ml-1 text-primary-400 hover:text-primary-300 hover:underline"
              >
                Syntax Guide
              </Link>
            </p>
          )}
          <span className="text-sm text-neutral-500">
            {form.content.length}/{CONTENT_MAX_LENGTH}
          </span>
        </div>
      </div>

      {/* Tags */}
      <div>
        <label htmlFor="tagsInput" className="block text-sm font-medium text-neutral-300 mb-2">
          Tags <span className="text-neutral-500">(optional, max {MAX_TAGS})</span>
        </label>
        <input
          id="tagsInput"
          name="tagsInput"
          type="text"
          value={form.tagsInput}
          onChange={handleChange}
          placeholder="Separate with commas or spaces, e.g.: ChatGPT, AI Tools, Tutorial"
          className={cn(
            'w-full bg-neutral-800 border rounded-lg px-4 py-3',
            'text-white placeholder-neutral-500',
            'focus:outline-none focus:ring-2 focus:ring-primary-500',
            'transition-colors',
            errors.tags ? 'border-red-500' : 'border-neutral-700 focus:border-primary-500'
          )}
        />
        {errors.tags && <p className="mt-1 text-sm text-red-400">{errors.tags}</p>}
        {previewTags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {previewTags.map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 rounded text-sm bg-neutral-800 text-neutral-300 border border-neutral-700"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-4 pt-4 border-t border-neutral-800">
        <Button type="button" variant="ghost" onClick={onCancel} disabled={isLoading}>
          Cancel
        </Button>
        <Button type="submit" isLoading={isLoading} disabled={!isValid || isLoading}>
          Publish Post
        </Button>
      </div>
    </form>
  );
}
