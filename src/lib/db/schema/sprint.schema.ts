// ============================================================================
// SPRINT MODULE - Database Schema
// Seasonal sprints, projects, and voting
// Following 3NF Normalization Principles
// ============================================================================

// ==========================================
// ENUMS & TYPES
// ==========================================
export type SeasonStatus = 'upcoming' | 'active' | 'ended';
export type SprintStatus = 'upcoming' | 'active' | 'voting' | 'ended';
export type ProjectStatus = 'draft' | 'submitted' | 'approved' | 'rejected';
export type ProjectVisibility = 'sprint-public' | 'nuvaclub-only' | 'public';

// ==========================================
// SEASONS TABLE
// Quarterly seasons for organizing sprints
// ==========================================
export interface SeasonRecord {
  // Primary Key
  id: string;

  // Season Information
  name: string; // e.g., "2026 Q1"
  description: string;
  theme?: string;

  // Dates
  startDate: Date;
  endDate: Date;

  // Status (derived from dates, but stored for queries)
  status: SeasonStatus;

  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

// Index: status, startDate, endDate

// ==========================================
// SPRINTS TABLE
// Individual sprints within a season
// ==========================================
export interface SprintRecord {
  // Primary Key
  id: string;

  // Foreign Keys
  seasonId: string; // FK -> seasons.id

  // Sprint Information
  title: string;
  description: string;
  theme: string;

  // Media
  thumbnailUrl: string;
  bannerUrl?: string;

  // Dates
  startDate: Date;
  endDate: Date;
  submissionDeadline: Date;
  votingStartDate: Date;
  votingEndDate: Date;

  // Status (derived from dates, but stored for queries)
  status: SprintStatus;

  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

// Index: seasonId, status, startDate

// ==========================================
// SPRINT STATS TABLE
// Denormalized statistics for sprints
// ==========================================
export interface SprintStatsRecord {
  // Primary Key
  id: string; // Same as sprintId for 1:1 relationship

  // Foreign Keys
  sprintId: string; // FK -> sprints.id

  // Statistics
  projectCount: number;
  participantCount: number;
  totalVotes: number;

  // Timestamps
  lastUpdatedAt: Date;
}

// Primary Key: sprintId

// ==========================================
// PROJECTS TABLE
// User-submitted projects for sprints
// ==========================================
export interface ProjectRecord {
  // Primary Key
  id: string;

  // Foreign Keys
  sprintId: string; // FK -> sprints.id
  authorId: string; // FK -> users.id

  // Project Information
  title: string;
  description: string;
  summary?: string; // Short description for cards

  // Media
  thumbnailUrl: string;
  videoUrl?: string;
  demoVideoUrl?: string;

  // Links
  githubUrl?: string;
  liveUrl?: string;
  documentationUrl?: string;

  // Submission Status
  status: ProjectStatus;

  // Visibility Settings
  visibility: ProjectVisibility;
  visibilityChosenAt?: Date; // When user made post-sprint choice
  visibilityAcknowledged: boolean; // User acknowledged public visibility at upload
  acknowledgedAt?: Date;

  // Results (set after voting ends)
  rank?: number;
  isWinner: boolean;
  awardType?: string; // e.g., "1st Place", "Best Design", etc.

  // Timestamps
  submittedAt?: Date;
  approvedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Index: sprintId, authorId, status, rank

// ==========================================
// PROJECT STATS TABLE
// Denormalized statistics for projects
// ==========================================
export interface ProjectStatsRecord {
  // Primary Key
  id: string; // Same as projectId for 1:1 relationship

  // Foreign Keys
  projectId: string; // FK -> projects.id

  // Statistics
  voteCount: number;
  viewCount: number;
  starCount: number; // Favorites/bookmarks
  commentCount: number;

  // Timestamps
  lastUpdatedAt: Date;
}

// Primary Key: projectId

// ==========================================
// PROJECT TECH STACK TABLE (Junction)
// Technologies used in projects - 1NF compliance
// ==========================================
export interface ProjectTechStackRecord {
  // Primary Key
  id: string;

  // Foreign Keys
  projectId: string; // FK -> projects.id

  // Data
  technology: string;
  category?: string; // e.g., "frontend", "backend", "database", "devops"
  sortOrder: number;
}

// Unique Index: (projectId, technology)
// Index: projectId, technology

// ==========================================
// PROJECT SCREENSHOTS TABLE
// Screenshot gallery for projects
// ==========================================
export interface ProjectScreenshotRecord {
  // Primary Key
  id: string;

  // Foreign Keys
  projectId: string; // FK -> projects.id

  // Screenshot Info
  imageUrl: string;
  caption?: string;
  sortOrder: number;

  // Timestamps
  createdAt: Date;
}

// Index: projectId, sortOrder

// ==========================================
// PROJECT TEAM MEMBERS TABLE
// Team members for group projects
// ==========================================
export interface ProjectTeamMemberRecord {
  // Primary Key
  id: string;

  // Foreign Keys
  projectId: string; // FK -> projects.id
  userId?: string; // FK -> users.id (if they're a platform user)

  // Member Info
  name: string;
  role: string; // e.g., "Frontend Developer", "Designer"
  avatarUrl?: string;
  githubUsername?: string;

  // Order
  sortOrder: number;
}

// Index: projectId, userId

// ==========================================
// PROJECT VOTES TABLE
// User votes on projects
// ==========================================
export interface ProjectVoteRecord {
  // Primary Key
  id: string;

  // Foreign Keys
  projectId: string; // FK -> projects.id
  userId: string; // FK -> users.id

  // Vote Weight (could vary by user tier)
  weight: number; // Default 1, higher for premium users

  // Timestamps
  createdAt: Date;
}

// Unique Index: (projectId, userId) - one vote per user per project
// Index: projectId, userId

// ==========================================
// PROJECT STARS TABLE
// User favorites/bookmarks for projects
// ==========================================
export interface ProjectStarRecord {
  // Primary Key
  id: string;

  // Foreign Keys
  projectId: string; // FK -> projects.id
  userId: string; // FK -> users.id

  // Timestamps
  createdAt: Date;
}

// Unique Index: (projectId, userId)
// Index: userId, createdAt

// ==========================================
// PROJECT COMMENTS TABLE
// Comments/feedback on projects
// ==========================================
export interface ProjectCommentRecord {
  // Primary Key
  id: string;

  // Foreign Keys
  projectId: string; // FK -> projects.id
  authorId: string; // FK -> users.id
  parentId?: string; // FK -> project_comments.id (for replies)

  // Content
  content: string;

  // Soft Delete
  isDeleted: boolean;

  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

// Index: projectId, authorId, parentId, createdAt

// ==========================================
// SPRINT AWARDS TABLE
// Award definitions for sprints
// ==========================================
export interface SprintAwardRecord {
  // Primary Key
  id: string;

  // Foreign Keys
  sprintId: string; // FK -> sprints.id

  // Award Info
  name: string; // e.g., "Best Overall", "Most Creative"
  description?: string;
  iconUrl?: string;

  // Order
  sortOrder: number;

  // Timestamps
  createdAt: Date;
}

// Index: sprintId, sortOrder

// ==========================================
// PROJECT AWARDS TABLE (Junction)
// Awards given to projects
// ==========================================
export interface ProjectAwardRecord {
  // Primary Key
  id: string;

  // Foreign Keys
  projectId: string; // FK -> projects.id
  awardId: string; // FK -> sprint_awards.id

  // Timestamps
  awardedAt: Date;
}

// Unique Index: (projectId, awardId)
// Index: awardId
