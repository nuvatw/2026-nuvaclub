export interface Season {
  id: string;
  name: string;
  description: string;
  startDate: Date;
  endDate: Date;
  isActive: boolean;
}

export interface Sprint {
  id: string;
  seasonId: string;
  title: string;
  description: string;
  theme: string;
  thumbnailUrl: string;
  startDate: Date;
  endDate: Date;
  votingStartDate: Date;
  projectCount: number;
  isVotingOpen: boolean;
}

export interface Project {
  id: string;
  sprintId: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  videoUrl?: string;
  githubUrl?: string;
  liveUrl?: string;
  techStack: string[];
  author: {
    id: string;
    name: string;
    avatar?: string;
  };
  voteCount: number;
  viewCount: number;
  starCount: number;
  rank?: number;
  createdAt: Date;
  updatedAt: Date;
}

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
