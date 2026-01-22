import { BaseRepository } from './BaseRepository';
import type { MockDB } from '../core/MockDB';
import type {
  SeasonRecord,
  SprintRecord,
  ProjectRecord,
} from '../schema';

export interface SeasonWithSprints extends SeasonRecord {
  sprints?: SprintRecord[];
  isActive?: boolean;
}

export interface SprintWithProjects extends SprintRecord {
  projects?: ProjectWithRelations[];
  season?: SeasonRecord;
  isVotingOpen?: boolean;
  status?: 'upcoming' | 'active' | 'voting' | 'ended';
}

export interface ProjectWithRelations extends ProjectRecord {
  techStack?: string[];
  author?: {
    id: string;
    name: string;
    avatar?: string;
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
    const now = new Date();
    const seasons = this.db.seasons.findMany({
      where: (s) => s.startDate <= now && s.endDate >= now,
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
    const now = new Date();
    const sprints = this.findMany({
      where: (s) => s.votingStartDate <= now && (!s.votingEndDate || s.votingEndDate >= now),
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
      orderBy: { field: 'voteCount', direction: 'desc' },
    });
    return projects.map((p) => this.enrichProject(p));
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

    if (existingVote) {
      // Remove vote
      this.db.projectVotes.delete(existingVote.id);
      const project = this.db.projects.findById(projectId);
      if (project) {
        this.db.projects.update(projectId, {
          voteCount: project.voteCount - 1,
        });
      }
      this.persist();
      return false; // Vote removed
    } else {
      // Add vote
      this.db.projectVotes.create({
        projectId,
        userId,
        createdAt: new Date(),
      });
      const project = this.db.projects.findById(projectId);
      if (project) {
        this.db.projects.update(projectId, {
          voteCount: project.voteCount + 1,
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
    const now = new Date();
    const isActive = season.startDate <= now && season.endDate >= now;

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
    const now = new Date();
    const season = this.db.seasons.findById(sprint.seasonId);

    // Determine status
    let status: 'upcoming' | 'active' | 'voting' | 'ended' = 'upcoming';
    if (sprint.endDate < now) {
      status = 'ended';
    } else if (sprint.votingStartDate <= now) {
      status = 'voting';
    } else if (sprint.startDate <= now) {
      status = 'active';
    }

    const isVotingOpen = status === 'voting';

    const projects = this.db.projects.findMany({
      where: { sprintId: sprint.id },
      orderBy: { field: 'voteCount', direction: 'desc' },
    });

    return {
      ...sprint,
      season,
      projects: projects.map((p) => this.enrichProject(p)),
      isVotingOpen,
      status,
    };
  }

  private enrichProject(project: ProjectRecord): ProjectWithRelations {
    const techStackRecords = this.db.projectTechStack.findMany({
      where: { projectId: project.id },
    });
    const techStack = techStackRecords.map((t) => t.technology);

    const user = this.db.users.findById(project.authorId);
    const author = user
      ? { id: user.id, name: user.name, avatar: user.avatar }
      : undefined;

    return {
      ...project,
      techStack,
      author,
    };
  }
}
