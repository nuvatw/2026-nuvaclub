/**
 * Sprint Feature Types
 *
 * Re-exports entity types from Database (canonical source)
 * and defines feature-specific types for sprint functionality.
 */

// Redefined locally to match BFF response (Date -> string)
export type SeasonStatus = 'upcoming' | 'active' | 'ended';
export type SprintStatus = 'upcoming' | 'active' | 'voting' | 'ended';
export type ProjectStatus = 'draft' | 'submitted' | 'approved' | 'rejected';
export type ProjectVisibility = 'sprint-public' | 'nuvaclub-only' | 'public';

export interface Season {
  id: string;
  name: string;
  description: string;
  theme?: string;
  startDate: string;
  endDate: string;
  status: SeasonStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Sprint {
  id: string;
  seasonId: string;
  title: string;
  description: string;
  theme: string;
  thumbnailUrl: string;
  bannerUrl?: string;
  startDate: string;
  endDate: string;
  submissionDeadline: string;
  votingStartDate: string;
  votingEndDate: string;
  status: SprintStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Project {
  id: string;
  sprintId: string;
  authorId: string;
  title: string;
  description: string;
  summary?: string;
  thumbnailUrl: string;
  videoUrl?: string;
  demoVideoUrl?: string;
  githubUrl?: string;
  liveUrl?: string;
  documentationUrl?: string;
  status: ProjectStatus;
  visibility: ProjectVisibility;
  visibilityChosenAt?: string;
  visibilityAcknowledged: boolean;
  acknowledgedAt?: string;
  rank?: number;
  isWinner: boolean;
  awardType?: string;
  submittedAt?: string;
  approvedAt?: string;
  createdAt: string;
  updatedAt: string;
}

// Relation-enriched types for UI display
export interface SeasonWithSprints extends Season {
  sprints?: Sprint[];
  isActive?: boolean;
}

export interface SprintWithProjects extends Sprint {
  projects?: ProjectWithRelations[];
  season?: Season;
  isVotingOpen: boolean;
  projectCount: number;
  participantCount?: number;
  totalVotes?: number;
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

// Feature-specific types
// Note: 'most-starred' now represents "Most Voted" (votes, not favorites)
// The star icon in the UI represents votes, not stars/favorites
export type SortOption = 'most-viewed' | 'most-starred';
export type SeasonFilter = 'all' | string;

// Sprint voting modes
export type SprintMode = 'voting' | 'upload' | 'ended';

// Rank display constants
const RANK_LABELS: Record<number, string> = {
  1: '1st Place',
  2: '2nd Place',
  3: '3rd Place',
};

const RANK_STYLES: Record<number, string> = {
  1: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  2: 'bg-neutral-400/20 text-neutral-300 border-neutral-400/30',
  3: 'bg-amber-700/20 text-amber-500 border-amber-700/30',
};

export function getRankLabel(rank: number): string {
  return RANK_LABELS[rank] ?? '';
}

export function getRankStyle(rank: number): string {
  return RANK_STYLES[rank] ?? '';
}
