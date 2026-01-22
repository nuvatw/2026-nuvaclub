// ==========================================
// Seasons Table
// ==========================================
export type SeasonStatus = 'upcoming' | 'active' | 'ended';

export interface SeasonRecord {
  id: string;
  name: string; // e.g., "2026 Q1"
  description: string;
  startDate: Date;
  endDate: Date;
  createdAt: Date;
}

// ==========================================
// Sprints Table
// ==========================================
export type SprintStatus = 'upcoming' | 'active' | 'voting' | 'ended';

export interface SprintRecord {
  id: string;
  seasonId: string;
  title: string;
  description: string;
  theme: string;
  thumbnailUrl: string;
  startDate: Date;
  endDate: Date;
  votingStartDate: Date;
  votingEndDate?: Date;
  projectCount: number; // denormalized
  createdAt: Date;
}

// ==========================================
// Projects Table
// ==========================================
export interface ProjectRecord {
  id: string;
  sprintId: string;
  authorId: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  videoUrl?: string;
  githubUrl?: string;
  liveUrl?: string;
  voteCount: number; // denormalized
  viewCount: number; // denormalized
  starCount: number; // denormalized
  rank?: number; // set after voting ends
  isWinner: boolean;
  submittedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

// ==========================================
// Project Tech Stack Table (junction)
// ==========================================
export interface ProjectTechStackRecord {
  id: string;
  projectId: string;
  technology: string;
}

// ==========================================
// Project Votes Table
// ==========================================
export interface ProjectVoteRecord {
  id: string;
  projectId: string;
  userId: string;
  createdAt: Date;
}
