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

export type SortOption = 'most-viewed' | 'most-starred';
export type SeasonFilter = 'all' | string;
