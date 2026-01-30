import { SeasonRecord, SprintRecord, ProjectRecord, SprintStatsRecord, ProjectStatsRecord } from '../schema/sprint.schema';

/**
 * Demo Season Records
 */
export const DEMO_SEASON_RECORDS: Record<string, SeasonRecord> = {
    'season-2026-q1': {
        id: 'season-2026-q1',
        name: '2026 Q1',
        description: '2026 First Quarter Sprint Season',
        theme: 'AI Agents & Automation',
        startDate: new Date('2026-01-01'),
        endDate: new Date('2026-03-31'),
        status: 'active',
        createdAt: new Date('2025-12-01'),
        updatedAt: new Date('2026-01-01'),
    },
    'season-2025-q4': {
        id: 'season-2025-q4',
        name: '2025 Q4',
        description: '2025 Fourth Quarter Sprint Season',
        theme: 'AI Video Generation',
        startDate: new Date('2025-10-01'),
        endDate: new Date('2025-12-31'),
        status: 'ended',
        createdAt: new Date('2025-09-01'),
        updatedAt: new Date('2025-12-31'),
    }
};

/**
 * Demo Sprint Records
 */
export const DEMO_SPRINT_RECORDS: Record<string, SprintRecord> = {
    'sprint-2026-q1-1': {
        id: 'sprint-2026-q1-1',
        seasonId: 'season-2026-q1',
        title: 'AI Agents & Automation',
        description: 'Build autonomous AI agents that can perform complex tasks',
        theme: 'Agents',
        thumbnailUrl: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800',
        startDate: new Date('2026-01-01'),
        endDate: new Date('2026-03-31'),
        submissionDeadline: new Date('2026-03-10'),
        votingStartDate: new Date('2026-03-15'),
        votingEndDate: new Date('2026-03-31'),
        status: 'active',
        createdAt: new Date('2025-12-15'),
        updatedAt: new Date('2026-01-01'),
    },
    'sprint-2025-q4-1': {
        id: 'sprint-2025-q4-1',
        seasonId: 'season-2025-q4',
        title: 'AI Video Generation',
        description: 'Build video creation and editing tools with AI',
        theme: 'Video',
        thumbnailUrl: 'https://images.unsplash.com/photo-1536240478700-b869070f9279?w=800',
        startDate: new Date('2025-10-01'),
        endDate: new Date('2025-11-15'),
        submissionDeadline: new Date('2025-10-25'),
        votingStartDate: new Date('2025-11-01'),
        votingEndDate: new Date('2025-11-15'),
        status: 'ended',
        createdAt: new Date('2025-09-15'),
        updatedAt: new Date('2025-11-15'),
    }
};

/**
 * Demo Project Records (Minimal set for verification)
 */
export const DEMO_PROJECT_RECORDS: Record<string, ProjectRecord> = {
    'project-demo-1': {
        id: 'project-demo-1',
        sprintId: 'sprint-2026-q1-1',
        authorId: 'user-1',
        title: 'Sora-Style Video Generator',
        description: 'Text-to-video generation platform inspired by OpenAI Sora',
        summary: 'AI-powered video generation tool',
        thumbnailUrl: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=800',
        status: 'approved',
        visibility: 'public',
        visibilityAcknowledged: true,
        isWinner: true,
        rank: 1,
        awardType: 'Best Overall',
        createdAt: new Date('2026-01-10'),
        updatedAt: new Date('2026-01-10'),
    }
};

/**
 * Demo Stats
 */
export const DEMO_SPRINT_STATS: Record<string, SprintStatsRecord> = {
    'sprint-2026-q1-1': {
        id: 'sprint-2026-q1-1',
        sprintId: 'sprint-2026-q1-1',
        projectCount: 8,
        participantCount: 8,
        totalVotes: 156,
        lastUpdatedAt: new Date(),
    }
};

export const DEMO_PROJECT_STATS: Record<string, ProjectStatsRecord> = {
    'project-demo-1': {
        id: 'project-demo-1',
        projectId: 'project-demo-1',
        voteCount: 45,
        viewCount: 1200,
        starCount: 67,
        commentCount: 12,
        lastUpdatedAt: new Date(),
    }
};
