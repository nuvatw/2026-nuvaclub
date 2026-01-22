'use client';

import { useMemo, useCallback } from 'react';
import { useDB, useDBContext } from '../provider/DBProvider';
import {
  SprintRepository,
  type SeasonWithSprints,
  type SprintWithProjects,
  type ProjectWithRelations,
} from '../repositories';

/**
 * Hook to access sprint data from the database
 */
export function useSprints() {
  const db = useDB();
  const { refresh } = useDBContext();

  const repo = useMemo(() => {
    if (!db) return null;
    return new SprintRepository(db);
  }, [db]);

  const seasons = useMemo(() => {
    if (!repo) return [];
    return repo.findAllSeasons();
  }, [repo]);

  const activeSeasons = useMemo(() => {
    if (!repo) return [];
    return repo.findActiveSeasons();
  }, [repo]);

  const votingOpenSprints = useMemo(() => {
    if (!repo) return [];
    return repo.findVotingOpen();
  }, [repo]);

  const voteForProject = useCallback(
    (projectId: string, userId: string) => {
      if (!repo) return false;
      const result = repo.voteForProject(projectId, userId);
      refresh();
      return result;
    },
    [repo, refresh]
  );

  return {
    seasons,
    activeSeasons,
    votingOpenSprints,
    isReady: !!db,
    getSeasonById: (id: string) => repo?.findSeasonById(id),
    getSprintById: (id: string) => repo?.findByIdWithRelations(id),
    getSprintsBySeasonId: (seasonId: string) => repo?.findBySeasonId(seasonId) ?? [],
    getProjectsBySprintId: (sprintId: string) => repo?.findProjectsBySprintId(sprintId) ?? [],
    getProjectById: (id: string) => repo?.findProjectById(id),
    voteForProject,
    hasUserVoted: (projectId: string, userId: string) =>
      repo?.hasUserVoted(projectId, userId) ?? false,
  };
}

/**
 * Hook to get a single season by ID
 */
export function useSeason(seasonId: string): SeasonWithSprints | null {
  const db = useDB();

  return useMemo(() => {
    if (!db) return null;
    const repo = new SprintRepository(db);
    return repo.findSeasonById(seasonId) ?? null;
  }, [db, seasonId]);
}

/**
 * Hook to get a single sprint by ID
 */
export function useSprint(sprintId: string): SprintWithProjects | null {
  const db = useDB();

  return useMemo(() => {
    if (!db) return null;
    const repo = new SprintRepository(db);
    return repo.findByIdWithRelations(sprintId) ?? null;
  }, [db, sprintId]);
}
