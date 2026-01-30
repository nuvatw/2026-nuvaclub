export type SeasonStatus = 'upcoming' | 'active' | 'ended';
export type SprintStatus = 'upcoming' | 'active' | 'voting' | 'ended';
export type ProjectStatus = 'draft' | 'submitted' | 'approved' | 'rejected';
export type ProjectVisibility = 'sprint-public' | 'nuvaclub-only' | 'public';

export interface Season {
    id: string;
    name: string;
    description: string;
    theme?: string;
    startDate: Date;
    endDate: Date;
    status: SeasonStatus;
    createdAt: Date;
    updatedAt: Date;
}

export interface Sprint {
    id: string;
    seasonId: string;
    title: string;
    description: string;
    theme: string;
    thumbnailUrl: string;
    bannerUrl?: string;
    startDate: Date;
    endDate: Date;
    submissionDeadline: Date;
    votingStartDate: Date;
    votingEndDate: Date;
    status: SprintStatus;
    createdAt: Date;
    updatedAt: Date;
}

export interface SprintStats {
    id: string;
    sprintId: string;
    projectCount: number;
    participantCount: number;
    totalVotes: number;
    lastUpdatedAt: Date;
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
    visibilityChosenAt?: Date;
    visibilityAcknowledged: boolean;
    acknowledgedAt?: Date;
    rank?: number;
    isWinner: boolean;
    awardType?: string;
    submittedAt?: Date;
    approvedAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}

export interface ProjectStats {
    id: string;
    projectId: string;
    voteCount: number;
    viewCount: number;
    starCount: number;
    commentCount: number;
    lastUpdatedAt: Date;
}

export interface ProjectTechStack {
    id: string;
    projectId: string;
    technology: string;
    category?: string;
    sortOrder: number;
}

export interface ProjectScreenshot {
    id: string;
    projectId: string;
    imageUrl: string;
    caption?: string;
    sortOrder: number;
    createdAt: Date;
}

export interface ProjectTeamMember {
    id: string;
    projectId: string;
    userId?: string;
    name: string;
    role: string;
    avatarUrl?: string;
    githubUsername?: string;
    sortOrder: number;
}

export interface ProjectVote {
    id: string;
    projectId: string;
    userId: string;
    weight: number;
    createdAt: Date;
}

export interface ProjectStar {
    id: string;
    projectId: string;
    userId: string;
    createdAt: Date;
}

export interface ProjectComment {
    id: string;
    projectId: string;
    authorId: string;
    parentId?: string;
    content: string;
    isDeleted: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface SprintAward {
    id: string;
    sprintId: string;
    name: string;
    description?: string;
    iconUrl?: string;
    sortOrder: number;
    createdAt: Date;
}

export interface ProjectAward {
    id: string;
    projectId: string;
    awardId: string;
    awardedAt: Date;
}
