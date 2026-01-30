
export interface SeasonDTO {
    id: string;
    name: string;
    description: string;
    theme?: string;
    startDate: string; // ISO string
    endDate: string;   // ISO string
    status: string;
}

export interface SprintDTO {
    id: string;
    seasonId: string;
    title: string;
    description: string;
    theme: string;
    thumbnailUrl: string;
    bannerUrl?: string;
    startDate: string;        // ISO string
    endDate: string;          // ISO string
    submissionDeadline: string; // ISO string
    votingStartDate: string;   // ISO string
    votingEndDate: string;     // ISO string
    status: string;
}

export interface ProjectDTO {
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
    status: string;
    visibility: string;
    isWinner: boolean;
    rank?: number;
    submittedAt?: string;    // ISO string
    createdAt: string;       // ISO string
}
