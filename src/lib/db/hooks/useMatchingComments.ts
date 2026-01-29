'use client';

import { useMemo, useCallback } from 'react';
import { useDB } from '../provider/DBProvider';
import type { MatchingCommentRecord } from '@/infra/mock/schema';

export interface MatchingCommentWithRelations extends MatchingCommentRecord {
  author?: {
    id: string;
    name: string;
    avatar?: string;
  };
  replies?: MatchingCommentWithRelations[];
}

/**
 * Hook to access matching post comments
 */
export function useMatchingComments(postId: string, currentUserId?: string) {
  const db = useDB();

  // Get all comments for the post - optimized with batch user lookup
  const allComments = useMemo((): MatchingCommentWithRelations[] => {
    if (!db || !postId) return [];

    const comments = db.matchingComments.findMany({ where: { postId } });

    // Batch fetch all unique authors in one pass
    const authorIds = new Set(comments.map((c) => c.authorId));
    const authorsMap = new Map<string, { id: string; name: string; avatar?: string }>();

    for (const authorId of authorIds) {
      const user = db.users.findById(authorId);
      if (user) {
        authorsMap.set(authorId, { id: user.id, name: user.name, avatar: user.avatar });
      }
    }

    return comments.map((comment) => {
      const author = authorsMap.get(comment.authorId);
      return {
        ...comment,
        author,
      };
    });
  }, [db, postId]);

  // Get the post author ID (for private comment visibility)
  const postAuthorId = useMemo(() => {
    if (!db || !postId) return null;
    const post = db.matchingPosts.findById(postId);
    return post?.authorId ?? null;
  }, [db, postId]);

  // Filter visible comments based on user permissions
  const visibleComments = useMemo(() => {
    return allComments.filter((comment) => {
      // Public comments are always visible
      if (!comment.isPrivate) return true;

      // Private comments visible to post author
      if (currentUserId === postAuthorId) return true;

      // Private comments visible to comment author
      if (currentUserId === comment.authorId) return true;

      return false;
    });
  }, [allComments, currentUserId, postAuthorId]);

  // Build threaded comments (parent/child structure)
  const threadedComments = useMemo((): MatchingCommentWithRelations[] => {
    // Get top-level comments (no parent)
    const topLevel = visibleComments.filter((c) => !c.parentId);

    // Build replies for each top-level comment
    return topLevel.map((comment) => {
      const replies = visibleComments
        .filter((c) => c.parentId === comment.id)
        .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

      return {
        ...comment,
        replies,
      };
    });
  }, [visibleComments]);

  // Sort by newest first
  const sortedComments = useMemo(() => {
    return [...threadedComments].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }, [threadedComments]);

  // Stats - computed in single pass
  const stats = useMemo(() => {
    let publicCount = 0;
    let privateCount = 0;
    for (const c of allComments) {
      if (c.isPrivate) privateCount++;
      else publicCount++;
    }
    return {
      total: allComments.length,
      visible: visibleComments.length,
      public: publicCount,
      private: privateCount,
    };
  }, [allComments, visibleComments]);

  return {
    comments: sortedComments,
    allComments: visibleComments,
    stats,
    isReady: !!db,
    getCommentById: (id: string) => visibleComments.find((c) => c.id === id) ?? null,
    getReplies: (parentId: string) => visibleComments.filter((c) => c.parentId === parentId),
  };
}

/**
 * Hook to get user's comments across all posts
 */
export function useUserMatchingComments(userId?: string) {
  const db = useDB();

  const comments = useMemo((): MatchingCommentWithRelations[] => {
    if (!db || !userId) return [];

    const userComments = db.matchingComments.findMany({ where: { authorId: userId } });

    // Since all comments are from the same user, fetch once
    const author = db.users.findById(userId);
    const authorData = author
      ? { id: author.id, name: author.name, avatar: author.avatar }
      : undefined;

    return userComments.map((comment) => ({
      ...comment,
      author: authorData,
    }));
  }, [db, userId]);

  const sortedComments = useMemo(() => {
    return [...comments].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }, [comments]);

  return {
    comments: sortedComments,
    totalComments: comments.length,
    isReady: !!db,
  };
}
