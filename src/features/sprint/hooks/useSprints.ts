'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import type { Season, Sprint, Project, SeasonWithSprints, SprintWithProjects } from '@/features/sprint/types';
import { getSprintPhase } from '../utils/getSprintPhase';

/**
 * Hook to access sprint data via BFF
 */
export function useSprints() {
    const [seasons, setSeasons] = useState<SeasonWithSprints[]>([]);
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
        const allSprints: Sprint[] = [];
        seasons.forEach(season => {
            if (season.sprints) {
                allSprints.push(...season.sprints);
            }
        });
        return allSprints.filter(s => getSprintPhase(s).phase === 'voting');
    }, [seasons]);

    // Vote mutation - should use POST endpoint
    const voteForProject = useCallback(
        async (projectId: string, userId: string) => {
            try {
                const res = await fetch('/api/bff/sprint/vote', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ projectId, userId }),
                });
                return res.ok;
            } catch (err) {
                console.error('Failed to vote:', err);
                return false;
            }
        },
        []
    );

    const getSeasonById = useCallback((id: string) => {
        return seasons.find(s => s.id === id);
    }, [seasons]);

    const getSprintById = useCallback((id: string) => {
        for (const season of seasons) {
            const sprint = season.sprints?.find(s => s.id === id);
            if (sprint) return sprint;
        }
        return null;
    }, [seasons]);

    const getSprintsBySeasonId = useCallback((seasonId: string) => {
        const season = seasons.find(s => s.id === seasonId);
        return season?.sprints || [];
    }, [seasons]);

    const getProjectsBySprintId = useCallback(async (sprintId: string) => {
        try {
            const res = await fetch(`/api/bff/sprint/projects?sprintId=${sprintId}`);
            if (!res.ok) return [];
            return await res.json();
        } catch (err) {
            console.error('Failed to fetch projects:', err);
            return [];
        }
    }, []);

    const getProjectById = useCallback(async (id: string) => {
        try {
            const res = await fetch(`/api/bff/sprint/sprints?projectId=${id}`);
            if (!res.ok) return null;
            return await res.json();
        } catch (err) {
            console.error('Failed to fetch project:', err);
            return null;
        }
    }, []);

    const hasUserVoted = useCallback(async (projectId: string, userId: string) => {
        try {
            const res = await fetch(`/api/bff/sprint/vote?userId=${userId}&projectId=${projectId}`);
            if (!res.ok) return false;
            const data = await res.json();
            return !!data.hasVoted;
        } catch (err) {
            console.error('Failed to check vote:', err);
            return false;
        }
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

/**
 * Hook to get a single project by ID via BFF
 */
export function useProject(projectId: string) {
    const [project, setProject] = useState<Project | null>(null);

    useEffect(() => {
        if (!projectId) return;
        let mounted = true;

        fetch(`/api/bff/sprint/sprints?projectId=${projectId}`)
            .then(res => {
                if (!res.ok) return null;
                return res.json();
            })
            .then(data => {
                if (mounted && data && !data.error) setProject(data);
            })
            .catch(err => console.error(err));
        return () => { mounted = false; };
    }, [projectId]);

    return project;
}
