import { BaseRepository } from './BaseRepository';
import type { MockDB } from '../core/MockDB';
import type {
  SeasonRecord,
  SprintRecord,
  ProjectRecord,
  SprintStatsRecord,
  ProjectStatsRecord,
} from '../schema';

export interface SeasonWithSprints extends SeasonRecord {
  sprints?: SprintRecord[];
  isActive?: boolean;
}

export interface SprintWithProjects extends SprintRecord {
  projects?: ProjectWithRelations[];
  season?: SeasonRecord;
  isVotingOpen?: boolean;
  stats?: {
    projectCount: number;
    participantCount: number;
    totalVotes: number;
  };
}

export interface ProjectWithRelations extends ProjectRecord {
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

export class SprintRepository extends BaseRepository<SprintRecord> {
  constructor(db: MockDB) {
    super(db.sprints, db);
  }

  // ==========================================
  // SEASONS
  // ==========================================

  /**
   * Find all seasons
   */
  findAllSeasons(): SeasonWithSprints[] {
    const seasons = this.db.seasons.findMany({
      orderBy: { field: 'startDate', direction: 'desc' },
    });
    return seasons.map((s) => this.enrichSeason(s));
  }

  /**
   * Find active seasons
   */
  findActiveSeasons(): SeasonWithSprints[] {
    const seasons = this.db.seasons.findMany({
      where: { status: 'active' },
    });
    return seasons.map((s) => this.enrichSeason(s));
  }

  /**
   * Find season by ID with sprints
   */
  findSeasonById(id: string): SeasonWithSprints | undefined {
    const season = this.db.seasons.findById(id);
    if (!season) return undefined;
    return this.enrichSeason(season);
  }

  // ==========================================
  // SPRINTS
  // ==========================================

  /**
   * Find sprint with all relations
   */
  findByIdWithRelations(id: string): SprintWithProjects | undefined {
    const sprint = this.findById(id);
    if (!sprint) return undefined;
    return this.enrichSprint(sprint);
  }

  /**
   * Find sprints by season
   */
  findBySeasonId(seasonId: string): SprintWithProjects[] {
    const sprints = this.findMany({
      where: { seasonId },
      orderBy: { field: 'startDate', direction: 'desc' },
    });
    return sprints.map((s) => this.enrichSprint(s));
  }

  /**
   * Find sprints with voting open
   */
  findVotingOpen(): SprintWithProjects[] {
    const sprints = this.findMany({
      where: { status: 'voting' },
    });
    return sprints.map((s) => this.enrichSprint(s));
  }

  // ==========================================
  // PROJECTS
  // ==========================================

  /**
   * Find projects by sprint
   */
  findProjectsBySprintId(sprintId: string): ProjectWithRelations[] {
    const projects = this.db.projects.findMany({
      where: { sprintId },
    });

    // Sort by vote count from stats
    const enrichedProjects = projects.map((p) => this.enrichProject(p));
    enrichedProjects.sort((a, b) => (b.stats?.voteCount ?? 0) - (a.stats?.voteCount ?? 0));

    return enrichedProjects;
  }

  /**
   * Find project by ID
   */
  findProjectById(id: string): ProjectWithRelations | undefined {
    const project = this.db.projects.findById(id);
    if (!project) return undefined;
    return this.enrichProject(project);
  }

  /**
   * Vote for a project
   */
  voteForProject(projectId: string, userId: string): boolean {
    // Check if user already voted
    const existingVote = this.db.projectVotes.findFirst({
      where: { projectId, userId },
    });

    const projectStats = this.db.projectStats.findFirst({
      where: { projectId },
    });

    if (existingVote) {
      // Remove vote
      this.db.projectVotes.delete(existingVote.id);
      if (projectStats) {
        this.db.projectStats.update(projectId, {
          voteCount: projectStats.voteCount - 1,
          lastUpdatedAt: new Date(),
        });
      }
      this.persist();
      return false; // Vote removed
    } else {
      // Add vote
      this.db.projectVotes.create({
        projectId,
        userId,
        weight: 1,
        createdAt: new Date(),
      });
      if (projectStats) {
        this.db.projectStats.update(projectId, {
          voteCount: projectStats.voteCount + 1,
          lastUpdatedAt: new Date(),
        });
      }
      this.persist();
      return true; // Vote added
    }
  }

  /**
   * Check if user voted for a project
   */
  hasUserVoted(projectId: string, userId: string): boolean {
    return this.db.projectVotes.exists(
      this.db.projectVotes.findFirst({
        where: { projectId, userId },
      })?.id ?? ''
    );
  }

  // ==========================================
  // Private Helpers
  // ==========================================

  private enrichSeason(season: SeasonRecord): SeasonWithSprints {
    const isActive = season.status === 'active';

    const sprints = this.db.sprints.findMany({
      where: { seasonId: season.id },
      orderBy: { field: 'startDate', direction: 'asc' },
    });

    return {
      ...season,
      sprints,
      isActive,
    };
  }

  private enrichSprint(sprint: SprintRecord): SprintWithProjects {
    const season = this.db.seasons.findById(sprint.seasonId);

    // Get status directly from sprint record
    const isVotingOpen = sprint.status === 'voting';

    // Get stats from separate table
    const sprintStats = this.db.sprintStats.findFirst({
      where: { sprintId: sprint.id },
    });

    const projects = this.db.projects.findMany({
      where: { sprintId: sprint.id },
    });

    const enrichedProjects = projects.map((p) => this.enrichProject(p));
    enrichedProjects.sort((a, b) => (b.stats?.voteCount ?? 0) - (a.stats?.voteCount ?? 0));

    return {
      ...sprint,
      season,
      projects: enrichedProjects,
      isVotingOpen,
      stats: sprintStats
        ? {
            projectCount: sprintStats.projectCount,
            participantCount: sprintStats.participantCount,
            totalVotes: sprintStats.totalVotes,
          }
        : undefined,
    };
  }

  private enrichProject(project: ProjectRecord): ProjectWithRelations {
    const techStackRecords = this.db.projectTechStack.findMany({
      where: { projectId: project.id },
      orderBy: { field: 'sortOrder', direction: 'asc' },
    });
    const techStack = techStackRecords.map((t) => t.technology);

    const screenshotRecords = this.db.projectScreenshots.findMany({
      where: { projectId: project.id },
      orderBy: { field: 'sortOrder', direction: 'asc' },
    });
    const screenshots = screenshotRecords.map((s) => ({
      imageUrl: s.imageUrl,
      caption: s.caption,
    }));

    const user = this.db.users.findById(project.authorId);
    const author = user
      ? { id: user.id, name: user.name, avatar: user.avatar }
      : undefined;

    // Get stats from separate table
    const projectStats = this.db.projectStats.findFirst({
      where: { projectId: project.id },
    });

    return {
      ...project,
      techStack,
      screenshots,
      author,
      stats: projectStats
        ? {
            voteCount: projectStats.voteCount,
            viewCount: projectStats.viewCount,
            starCount: projectStats.starCount,
            commentCount: projectStats.commentCount,
          }
        : undefined,
    };
  }
}
