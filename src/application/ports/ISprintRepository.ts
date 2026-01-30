import { Season, Sprint, Project } from '@/domain/types/sprint';
import { IBaseRepository } from './IBaseRepository';

export interface SeasonWithSprints extends Season {
    sprints?: Sprint[];
    isActive?: boolean;
}

export interface SprintWithProjects extends Sprint {
    projects?: ProjectWithRelations[];
    season?: Season;
    isVotingOpen?: boolean;
    stats?: {
        projectCount: number;
        participantCount: number;
        totalVotes: number;
    };
}

export interface ProjectWithRelations extends Project {
    techStack?: string[];
    screenshots?: { imageUrl: string; caption?: string }[];
    author?: {
        id: string;
        name: string;
        avatar?: string;
    };
    stats?: {
        voteCount: number;
        viewCount: number;
        starCount: number;
        commentCount: number;
    };
}

export interface ISprintRepository extends IBaseRepository<Sprint> {
    // Seasons
    findAllSeasons(): SeasonWithSprints[];
    findActiveSeasons(): SeasonWithSprints[];
    findSeasonById(id: string): SeasonWithSprints | undefined;

    // Sprints
    findByIdWithRelations(id: string): SprintWithProjects | undefined;
    findBySeasonId(seasonId: string): SprintWithProjects[];
    findVotingOpen(): SprintWithProjects[];

    // Projects
    findProjectsBySprintId(sprintId: string): ProjectWithRelations[];
    findProjectById(id: string): ProjectWithRelations | undefined;
    voteForProject(projectId: string, userId: string): boolean;
    hasUserVoted(projectId: string, userId: string): boolean;
}
