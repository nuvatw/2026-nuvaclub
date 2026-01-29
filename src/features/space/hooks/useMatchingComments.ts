'use client';

import { useState, useEffect, useMemo } from 'react';

// Local types
export interface MatchingComment {
  id: string;
  postId: string;
  authorId: string;
  content: string;
  isPrivate: boolean;
  parentId?: string;
  createdAt: string;
}

export interface MatchingCommentWithRelations extends MatchingComment {
  author?: {
    id: string;
    name: string;
    avatar?: string;
  };
  replies?: MatchingCommentWithRelations[];
}

/**
 * Hook to access matching post comments via BFF
 */
export function useMatchingComments(postId: string, currentUserId?: string) {
  const [allComments, setAllComments] = useState<MatchingCommentWithRelations[]>([]);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!postId) return;

    fetch(`/api/bff/space/matching/comments?postId=${postId}`)
      .then(res => res.json())
      .then(data => {
        setAllComments(data);
        setIsReady(true);
      })
      .catch(err => {
        console.error('Failed to fetch comments:', err);
        setIsReady(true);
      });
  }, [postId]);

  // Filter visible comments (privacy logic)
  const visibleComments = useMemo(() => {
    return allComments.filter(comment => {
      if (!comment.isPrivate) return true;
      // Private comments visible to post author or comment author
      // Note: We don't have postAuthorId from BFF, so simplified
      return currentUserId === comment.authorId;
    });
  }, [allComments, currentUserId]);

  // Build threaded comments
  const threadedComments = useMemo((): MatchingCommentWithRelations[] => {
    const topLevel = visibleComments.filter(c => !c.parentId);

    return topLevel.map(comment => {
      const replies = visibleComments
        .filter(c => c.parentId === comment.id)
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

  // Stats
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
    isReady,
    getCommentById: (id: string) => visibleComments.find(c => c.id === id) ?? null,
    getReplies: (parentId: string) => visibleComments.filter(c => c.parentId === parentId),
  };
}

/**
 * Hook to get user's comments across all posts
 */
export function useUserMatchingComments(userId?: string) {
  const [comments, setComments] = useState<MatchingCommentWithRelations[]>([]);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!userId) return;

    // In real implementation, would have a BFF endpoint for user comments
    // For now, return empty array
    setComments([]);
    setIsReady(true);
  }, [userId]);

  const sortedComments = useMemo(() => {
    return [...comments].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }, [comments]);

  return {
    comments: sortedComments,
    totalComments: comments.length,
    isReady,
  };
}
