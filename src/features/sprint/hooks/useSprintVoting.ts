'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';

// Constants
export const MAX_VOTES_PER_SPRINT = 5;
export const VOTING_DEADLINE = new Date('2026-02-28T23:59:59');

export interface VotingState {
  votedProjectIds: string[];
  remainingVotes: number;
  totalVotes: number;
  isVotingOpen: boolean;
  isDeadlinePassed: boolean;
  canVote: boolean;
  hasVotedFor: (projectId: string) => boolean;
}

export interface UseSprintVotingReturn extends VotingState {
  toggleVote: (projectId: string) => Promise<{ success: boolean; message: string }>;
  getProjectVoteCount: (projectId: string) => number;
  isLoading: boolean;
}

interface UseSprintVotingOptions {
  projectIds?: string[];
  isVotingOpenOverride?: boolean;
}

/**
 * Hook to manage voting for a sprint via BFF
 */
export function useSprintVoting(
  sprintId: string,
  options: UseSprintVotingOptions = {}
): UseSprintVotingReturn {
  const { projectIds: projectIdsOverride, isVotingOpenOverride } = options;
  const [votedProjectIds, setVotedProjectIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Hardcoded user ID (would come from auth in real app)
  const userId = 'user-1';

  // Check if voting deadline has passed
  const isDeadlinePassed = useMemo(() => {
    return new Date() > VOTING_DEADLINE;
  }, []);

  // Determine if voting is open
  const isVotingOpen = useMemo(() => {
    if (typeof isVotingOpenOverride === 'boolean') {
      return isVotingOpenOverride && !isDeadlinePassed;
    }
    return !isDeadlinePassed;
  }, [isVotingOpenOverride, isDeadlinePassed]);

  // Fetch user's votes
  useEffect(() => {
    if (!userId) return;

    fetch(`/api/bff/sprint/vote?userId=${userId}&sprintId=${sprintId}`)
      .then(res => res.json())
      .then(data => {
        const projectIds = Array.isArray(data) ? data.map((v: any) => v.projectId) : [];
        setVotedProjectIds(projectIds);
        setIsLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch votes:', err);
        setIsLoading(false);
      });
  }, [userId, sprintId]);

  const totalVotes = votedProjectIds.length;
  const remainingVotes = MAX_VOTES_PER_SPRINT - totalVotes;
  const canVote = !!userId && isVotingOpen && !isDeadlinePassed;

  const hasVotedFor = useCallback(
    (projectId: string) => {
      return votedProjectIds.includes(projectId);
    },
    [votedProjectIds]
  );

  const getProjectVoteCount = useCallback(
    (projectId: string) => {
      // Would fetch from BFF in real implementation
      return 0;
    },
    []
  );

  const toggleVote = useCallback(
    async (projectId: string): Promise<{ success: boolean; message: string }> => {
      if (!userId) {
        return { success: false, message: 'Please sign in first' };
      }

      if (isDeadlinePassed) {
        return { success: false, message: 'Voting has ended' };
      }

      if (!isVotingOpen) {
        return { success: false, message: 'Voting is not open' };
      }

      const isAlreadyVoted = hasVotedFor(projectId);

      if (!isAlreadyVoted && remainingVotes <= 0) {
        return { success: false, message: 'You have used all 5 votes. Remove a vote first.' };
      }

      try {
        const res = await fetch('/api/bff/sprint/vote', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ projectId, sprintId }),
        });

        if (res.ok) {
          const data = await res.json();

          // Update local state
          if (data.action === 'added') {
            setVotedProjectIds(prev => [...prev, projectId]);
            return { success: true, message: 'Vote submitted!' };
          } else {
            setVotedProjectIds(prev => prev.filter(id => id !== projectId));
            return { success: true, message: 'Vote removed' };
          }
        } else {
          return { success: false, message: 'Failed to toggle vote' };
        }
      } catch (err) {
        console.error('Failed to toggle vote:', err);
        return { success: false, message: 'Failed to toggle vote' };
      }
    },
    [userId, isDeadlinePassed, isVotingOpen, hasVotedFor, remainingVotes, sprintId]
  );

  return {
    votedProjectIds,
    remainingVotes,
    totalVotes,
    isVotingOpen,
    isDeadlinePassed,
    canVote,
    hasVotedFor,
    toggleVote,
    getProjectVoteCount,
    isLoading,
  };
}
