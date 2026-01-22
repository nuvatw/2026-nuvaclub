'use client';

import { useState, useCallback } from 'react';
import { useDB, useDBContext } from '@/lib/db/provider/DBProvider';
import { PostRepository, type PostWithRelations } from '@/lib/db/repositories';
import type { CreatePostInput } from '@/features/forum/types';

interface UseCreatePostResult {
  createPost: (input: CreatePostInput) => Promise<PostWithRelations | null>;
  isLoading: boolean;
  error: string | null;
  reset: () => void;
}

export function useCreatePost(): UseCreatePostResult {
  const db = useDB();
  const { refresh } = useDBContext();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createPost = useCallback(
    async (input: CreatePostInput): Promise<PostWithRelations | null> => {
      if (!db) {
        setError('Database is not ready yet');
        return null;
      }

      setIsLoading(true);
      setError(null);

      try {
        const repo = new PostRepository(db);
        const now = new Date();

        // Create post record
        const post = repo.create({
          title: input.title,
          content: input.content,
          category: input.category,
          authorId: input.authorId,
          upvotes: 0,
          downvotes: 0,
          score: 0,
          viewCount: 0,
          commentCount: 0,
          isPinned: false,
          isLocked: false,
          createdAt: now,
          updatedAt: now,
        });

        // Create tag records
        if (input.tags && input.tags.length > 0) {
          const tagRecords = input.tags.map((tag) => ({
            postId: post.id,
            tag,
          }));
          db.postTags.createMany(tagRecords);
          db.persist();
        }

        // Trigger re-render
        refresh();

        // Return post with relations
        return repo.findByIdWithRelations(post.id) ?? null;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'An error occurred while creating the post';
        setError(message);
        console.error('Failed to create post:', err);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [db, refresh]
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
