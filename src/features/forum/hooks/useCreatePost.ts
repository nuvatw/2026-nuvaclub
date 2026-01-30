'use client';

import { useState, useCallback } from 'react';
import type { PostWithRelations } from '@/features/forum/types';
import type { CreatePostInput } from '@/features/forum/types';

interface UseCreatePostResult {
  createPost: (input: CreatePostInput) => Promise<PostWithRelations | null>;
  isLoading: boolean;
  error: string | null;
  reset: () => void;
}

export function useCreatePost(): UseCreatePostResult {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createPost = useCallback(
    async (input: CreatePostInput): Promise<PostWithRelations | null> => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch('/api/bff/forum/posts', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(input),
        });

        if (!response.ok) {
          throw new Error('Failed to create post');
        }

        const data = await response.json();
        return data as PostWithRelations;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'An error occurred while creating the post';
        setError(message);
        console.error('Failed to create post:', err);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const reset = useCallback(() => {
    setError(null);
    setIsLoading(false);
  }, []);

  return {
    createPost,
    isLoading,
    error,
    reset,
  };
}
