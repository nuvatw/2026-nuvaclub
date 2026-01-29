'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import type { Season, Sprint, Project } from '@/lib/legacy-db-shim';

export type SeasonWithSprints = Season & { sprints?: Sprint[] };
export type SprintWithProjects = Sprint & { projects?: Project[] };

/**
 * Hook to access sprint data via BFF
 */
export function useSprints() {
  const [seasons, setSeasons] = useState<Season[]>([]);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let mounted = true;
    fetch('/api/bff/sprint/sprints')
      .then(res => res.json())
      .then(data => {
        if (mounted) {
          setSeasons(Array.isArray(data) ? data : []);
          setIsReady(true);
        }
      })
      .catch(err => {
        console.error('Failed to fetch sprints', err);
        if (mounted) setIsReady(true);
      });
    return () => { mounted = false; };
  }, []);

  const activeSeasons = useMemo(() =>
    seasons.filter(s => s.isActive),
    [seasons]
  );

  const votingOpenSprints = useMemo(() => {
    // TODO: Determine voting status from sprint phase
    return [];
  }, []);

  // Vote mutation - should use POST endpoint
  const voteForProject = useCallback(
    (projectId: string, userId: string) => {
      // TODO: Implement POST /api/bff/sprint/vote
      console.warn('Vote endpoint not yet implemented');
      return false;
    },
    []
  );

  const getSeasonById = useCallback((id: string) => {
    return seasons.find(s => s.id === id);
  }, [seasons]);

  const getSprintById = useCallback((id: string) => {
    // Would need to fetch or derive from seasons
    // Simplified: return null for now, use useSprint for details
    return null;
  }, []);

  const getSprintsBySeasonId = useCallback((seasonId: string) => {
    // Simplified: return empty, use useSeason for enriched data
    return [];
  }, []);

  const getProjectsBySprintId = useCallback((_sprintId: string) => {
    // Simplified: return empty, use useSprint for enriched data
    return [];
  }, []);

  const getProjectById = useCallback((_id: string) => {
    return null;
  }, []);

  const hasUserVoted = useCallback((_projectId: string, _userId: string) => {
    // TODO: Fetch from user votes endpoint
    return false;
  }, []);

  return {
    seasons,
    activeSeasons,
    votingOpenSprints,
    isReady,
    getSeasonById,
    getSprintById,
    getSprintsBySeasonId,
    getProjectsBySprintId,
    getProjectById,
    voteForProject,
    hasUserVoted,
  };
}

/**
 * Hook to get a single season by ID via BFF
 */
export function useSeason(seasonId: string) {
  const [season, setSeason] = useState<SeasonWithSprints | null>(null);

  useEffect(() => {
    if (!seasonId) return;
    let mounted = true;

    fetch(`/api/bff/sprint/sprints?seasonId=${seasonId}`)
      .then(res => {
        if (!res.ok) return null;
        return res.json();
      })
      .then(data => {
        if (mounted && data) setSeason(data);
      })
      .catch(err => console.error(err));
    return () => { mounted = false; };
  }, [seasonId]);

  return season;
}

/**
 * Hook to get a single sprint by ID via BFF
 */
export function useSprint(sprintId: string) {
  const [sprint, setSprint] = useState<SprintWithProjects | null>(null);

  useEffect(() => {
    if (!sprintId) return;
    let mounted = true;

    fetch(`/api/bff/sprint/sprints?sprintId=${sprintId}`)
      .then(res => {
        if (!res.ok) return null;
        return res.json();
      })
      .then(data => {
        if (mounted && data) setSprint(data);
      })
      .catch(err => console.error(err));
    return () => { mounted = false; };
  }, [sprintId]);

  return sprint;
}
