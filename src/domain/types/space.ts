export type CompanionType = 'nunu' | 'certified-nunu' | 'shangzhe';
export type MatchStatus = 'pending' | 'accepted' | 'active' | 'completed' | 'cancelled';
export type MentorshipStatus = 'active' | 'completed' | 'paused';
export type NunuApplicationStatus = 'pending' | 'approved' | 'rejected';
export type NunuLevel = 'N5' | 'N4' | 'N3' | 'N2' | 'N1';
export type NunuType = 'regular' | 'verified';
export type MatchingPostType = 'nunu-looking-for-vava' | 'vava-looking-for-nunu';
export type PriceType = 'fixed' | 'range' | 'negotiable';
export type MentorshipAgreementStatus = 'pending' | 'accepted' | 'active' | 'completed' | 'cancelled';
export type PaymentStatus = 'unpaid' | 'paid' | 'refunded';

export interface Companion {
    id: string;
    userId?: string;
    name: string;
    avatar: string;
    bio: string;
    type: CompanionType;
    discordId: string;
    isAvailable: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface CompanionExpertise {
    id: string;
    companionId: string;
    expertise: string;
    sortOrder: number;
}

export interface CompanionStats {
    id: string;
    companionId: string;
    matchCount: number;
    completedMatchCount: number;
    totalRatings: number;
    sumRatings: number;
    avgRating: number;
    lastUpdatedAt: Date;
}

export interface Match {
    id: string;
    userId: string;
    companionId: string;
    ticketId: string;
    forMonth?: string;
    status: MatchStatus;
    requestedAt: Date;
    acceptedAt?: Date;
    activatedAt?: Date;
    completedAt?: Date;
    cancelledAt?: Date;
    cancelReason?: string;
    userNotes?: string;
    companionNotes?: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface MatchRating {
    id: string;
    matchId: string;
    raterId: string;
    rateeId: string;
    rating: number;
    feedback?: string;
    createdAt: Date;
}

export interface NunuApplication {
    id: string;
    userId: string;
    status: NunuApplicationStatus;
    applicationText: string;
    discordId: string;
    introVideoUrl?: string;
    introVideoFileName?: string;
    introVideoDurationSeconds?: number;
    reviewedAt?: Date;
    reviewedBy?: string;
    rejectionReason?: string;
    submittedAt: Date;
    createdAt: Date;
    updatedAt: Date;
}

export interface NunuApplicationExpertise {
    id: string;
    applicationId: string;
    expertise: string;
    sortOrder: number;
}

export interface NunuApplicationAnswer {
    id: string;
    applicationId: string;
    questionId: string;
    question: string;
    answer: string;
    sortOrder: number;
}

export interface NunuProfile {
    id: string;
    userId: string;
    applicationId: string;
    level: NunuLevel;
    type: NunuType;
    bio: string;
    discordId: string;
    isAvailable: boolean;
    maxVavas: number;
    approvedAt: Date;
    createdAt: Date;
    updatedAt: Date;
}

export interface NunuProfileExpertise {
    id: string;
    profileId: string;
    expertise: string;
    sortOrder: number;
}

export interface NunuStats {
    id: string;
    profileId: string;
    currentVavaCount: number;
    totalMentorships: number;
    completedMentorships: number;
    totalRatings: number;
    sumRatings: number;
    avgRating: number;
    lastUpdatedAt: Date;
}

export interface UserMentorship {
    id: string;
    nunuId: string;
    vavaId: string;
    nunuProfileId: string;
    months?: string[];
    status: MentorshipStatus;
    sessionCount: number;
    lastSessionAt?: Date;
    notes?: string;
    startedAt: Date;
    pausedAt?: Date;
    completedAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}

export interface MentorshipSession {
    id: string;
    mentorshipId: string;
    sessionNumber: number;
    scheduledAt?: Date;
    occurredAt: Date;
    durationMinutes?: number;
    notes?: string;
    topics?: string;
    createdAt: Date;
}

export interface MatchingPost {
    id: string;
    authorId: string;
    type: MatchingPostType;
    title: string;
    content: string;
    priceType: PriceType;
    priceAmount?: number;
    priceMin?: number;
    priceMax?: number;
    priceCurrency: string;
    availableMonths: string[];
    maxSlots?: number;
    currentSlots?: number;
    isVerifiedNunuOnly: boolean;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface MatchingPostStats {
    id: string;
    postId: string;
    viewCount: number;
    commentCount: number;
    lastUpdatedAt: Date;
}

export interface MatchingPostTag {
    id: string;
    postId: string;
    tag: string;
}

export interface MatchingComment {
    id: string;
    postId: string;
    authorId: string;
    parentId?: string;
    content: string;
    isPrivate: boolean;
    isDeleted: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface MentorshipAgreement {
    id: string;
    postId: string;
    nunuId: string;
    vavaId: string;
    agreedPrice: number;
    agreedMonths: string[];
    totalAmount: number;
    status: MentorshipAgreementStatus;
    paymentStatus: PaymentStatus;
    paymentMethod?: string;
    paymentIntentId?: string;
    paidAt?: Date;
    createdAt: Date;
    acceptedAt?: Date;
    startedAt?: Date;
    completedAt?: Date;
    cancelledAt?: Date;
    cancelReason?: string;
}
