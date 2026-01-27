'use client';

import { useMemo, useCallback } from 'react';
import { useDB, useDBContext } from '@/lib/db';
import { useAuth } from '@/features/auth';

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
  toggleVote: (projectId: string) => { success: boolean; message: string };
  getProjectVoteCount: (projectId: string) => number;
  isLoading: boolean;
}

interface UseSprintVotingOptions {
  /** Project IDs that belong to this sprint (from mock data) */
  projectIds?: string[];
  /** Whether voting is open for this sprint (from mock data) */
  isVotingOpenOverride?: boolean;
}

/**
 * Hook to manage voting for a sprint with 5-vote limit
 *
 * The hook tracks votes per sprint using the provided project IDs as the scope.
 * Votes are stored in localStorage via the MockDB.
 */
export function useSprintVoting(
  sprintId: string,
  options: UseSprintVotingOptions = {}
): UseSprintVotingReturn {
  const { projectIds: projectIdsOverride, isVotingOpenOverride } = options;

  const db = useDB();
  const { refresh } = useDBContext();
  const { user } = useAuth();
  const userId = user?.id;

  // Check if voting deadline has passed
  const isDeadlinePassed = useMemo(() => {
    return new Date() > VOTING_DEADLINE;
  }, []);

  // Determine if voting is open
  // Prefer override from mock data, otherwise check DB sprint status
  const isVotingOpen = useMemo(() => {
    if (typeof isVotingOpenOverride === 'boolean') {
      return isVotingOpenOverride && !isDeadlinePassed;
    }
    // Fallback: check DB
    if (!db) return false;
    const sprint = db.sprints.findById(sprintId);
    if (!sprint) return true; // Default to open if sprint not found in DB
    return sprint.status === 'voting' && !isDeadlinePassed;
  }, [isVotingOpenOverride, isDeadlinePassed, db, sprintId]);

  // Use provided project IDs or fallback to DB lookup
  const sprintProjectIds = useMemo(() => {
    if (projectIdsOverride && projectIdsOverride.length > 0) {
      return projectIdsOverride;
    }
    if (!db) return [];
    const projects = db.projects.findMany({ where: { sprintId } });
    return projects.map((p) => p.id);
  }, [projectIdsOverride, db, sprintId]);

  // Get user's votes for projects in this sprint
  // We use sprintId as part of a virtual "vote scope" key in localStorage
  const userVotesInSprint = useMemo(() => {
    if (!db || !userId) return [];
    const allUserVotes = db.projectVotes.findMany({ where: { userId } });
    // Filter to only include votes for projects in this sprint
    return allUserVotes.filter((v) => sprintProjectIds.includes(v.projectId));
  }, [db, userId, sprintProjectIds]);

  const votedProjectIds = useMemo(() => {
    return userVotesInSprint.map((v) => v.projectId);
  }, [userVotesInSprint]);

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
      if (!db) return 0;
      const stats = db.projectStats.findFirst({ where: { projectId } });
      return stats?.voteCount ?? 0;
    },
    [db]
  );

  const toggleVote = useCallback(
    (projectId: string): { success: boolean; message: string } => {
      if (!db || !userId) {
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

      // Check if project belongs to this sprint
      if (!sprintProjectIds.includes(projectId)) {
        return { success: false, message: 'This project does not belong to this sprint' };
      }

      // Get existing vote
      const existingVote = db.projectVotes.findFirst({
        where: { projectId, userId },
      });

      // Get or create project stats
      let projectStats = db.projectStats.findFirst({
        where: { projectId },
      });

      if (existingVote) {
        // Remove vote
        db.projectVotes.delete(existingVote.id);
        if (projectStats) {
          db.projectStats.update(projectStats.id, {
            voteCount: Math.max(0, projectStats.voteCount - 1),
            lastUpdatedAt: new Date(),
          });
        }
        db.persist();
        refresh();
        return { success: true, message: 'Vote removed' };
      } else {
        // Add vote
        db.projectVotes.create({
          projectId,
          userId,
          weight: 1,
          createdAt: new Date(),
        });

        // Create or update stats
        if (projectStats) {
          db.projectStats.update(projectStats.id, {
            voteCount: projectStats.voteCount + 1,
            lastUpdatedAt: new Date(),
          });
        } else {
          // Create new stats record for this project
          db.projectStats.create({
            projectId,
            voteCount: 1,
            viewCount: 0,
            starCount: 0,
            commentCount: 0,
            lastUpdatedAt: new Date(),
          });
        }

        db.persist();
        refresh();
        return { success: true, message: 'Vote submitted!' };
      }
    },
    [db, userId, isDeadlinePassed, isVotingOpen, hasVotedFor, remainingVotes, sprintProjectIds, refresh]
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
    isLoading: !db,
  };
}
