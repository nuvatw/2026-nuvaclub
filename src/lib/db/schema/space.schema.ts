// ==========================================
// Companions Table
// ==========================================
export type CompanionType = 'nunu' | 'certified-nunu' | 'shangzhe';

export interface CompanionRecord {
  id: string;
  userId?: string; // FK to users if companion is a user
  name: string;
  avatar: string;
  type: CompanionType;
  bio: string;
  discordId: string;
  isAvailable: boolean;
  matchCount: number; // denormalized
  avgRating: number; // 0-5
  totalRatings: number;
  createdAt: Date;
  updatedAt: Date;
}

// ==========================================
// Companion Expertise Table (junction)
// ==========================================
export interface CompanionExpertiseRecord {
  id: string;
  companionId: string;
  expertise: string;
}

// ==========================================
// Matches Table
// ==========================================
export type MatchStatus = 'pending' | 'accepted' | 'active' | 'completed' | 'cancelled';

export interface MatchRecord {
  id: string;
  userId: string;
  companionId: string;
  ticketId: string; // FK to duo_tickets
  status: MatchStatus;
  matchedAt: Date;
  acceptedAt?: Date;
  completedAt?: Date;
  cancelledAt?: Date;
  cancelReason?: string;
  createdAt: Date;
}

// ==========================================
// Match Ratings Table
// ==========================================
export interface MatchRatingRecord {
  id: string;
  matchId: string;
  rating: number; // 1-5
  feedback?: string;
  createdAt: Date;
}

// ==========================================
// User Mentorships Table (Nunu-Vava relationships)
// ==========================================
export type MentorshipStatus = 'active' | 'completed' | 'paused';

export interface UserMentorshipRecord {
  id: string;
  nunuId: string; // Mentor user ID (the one who teaches/helps)
  vavaId: string; // Learner user ID (the one being helped)
  status: MentorshipStatus;
  startedAt: Date;
  lastSessionAt?: Date;
  sessionCount: number;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

// ==========================================
// Nunu Application Table
// ==========================================
export type NunuApplicationStatus = 'pending' | 'approved' | 'rejected';

export interface NunuApplicationSituationalAnswers {
  // Q1: How would you handle a Vava who is struggling and feeling discouraged?
  question1: string;
  // Q2: What would you do if a Vava disagrees with your teaching approach?
  question2: string;
  // Q3: How would you manage your time if multiple Vavas need help at the same time?
  question3: string;
}

export interface NunuApplicationRecord {
  id: string;
  userId: string;
  status: NunuApplicationStatus;
  applicationText: string; // Why they want to become Nunu
  expertise: string[]; // Areas they can help with
  discordId: string;
  // Video introduction
  introVideoUrl?: string; // URL to uploaded video
  introVideoFileName?: string; // Original file name
  introVideoDuration?: number; // Duration in seconds
  // Situational questions
  situationalAnswers?: NunuApplicationSituationalAnswers;
  submittedAt: Date;
  reviewedAt?: Date;
  reviewedBy?: string; // Admin user ID
  rejectionReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Situational questions for Nunu application
export const NUNU_APPLICATION_QUESTIONS = [
  {
    id: 'question1',
    question: 'How would you handle a Vava who is struggling and feeling discouraged about their progress?',
    placeholder: 'Describe your approach to motivating and supporting a struggling learner...',
    minLength: 100,
  },
  {
    id: 'question2',
    question: 'What would you do if a Vava disagrees with your teaching approach or feedback?',
    placeholder: 'Explain how you would handle disagreements while maintaining a positive relationship...',
    minLength: 100,
  },
  {
    id: 'question3',
    question: 'How would you manage your time if multiple Vavas need help at the same time?',
    placeholder: 'Describe your strategy for prioritizing and balancing multiple mentees...',
    minLength: 100,
  },
] as const;

// ==========================================
// Nunu Profile Table (for approved Nunus)
// ==========================================
export type NunuLevel = 'N5' | 'N4' | 'N3' | 'N2' | 'N1';

export const NUNU_LEVEL_MAX_VAVAS: Record<NunuLevel, number> = {
  N5: 3,
  N4: 5,
  N3: 10,
  N2: 30,
  N1: 50,
};

export type NunuType = 'regular' | 'verified';

export interface NunuProfileRecord {
  id: string;
  userId: string;
  applicationId: string; // FK to nunu_applications
  level: NunuLevel;
  type: NunuType; // regular = monthly, verified = seasonal
  bio: string;
  expertise: string[];
  discordId: string;
  currentVavaCount: number; // denormalized count
  totalMentorships: number; // lifetime count
  avgRating: number; // 0-5
  totalRatings: number;
  isAvailable: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// ==========================================
// Matching Board Posts Table
// ==========================================
export type MatchingPostType = 'nunu-looking-for-vava' | 'vava-looking-for-nunu';
export type TimeSelectionType = 'monthly' | 'seasonal';

export interface MatchingPostRecord {
  id: string;
  authorId: string; // FK to users
  type: MatchingPostType;
  title: string;
  content: string;
  timeSelection: TimeSelectionType; // monthly for regular, seasonal for verified
  timePeriod: string; // e.g., "2026-01" for monthly, "2026-Q1" for seasonal
  isVerifiedNunuOnly: boolean; // If true, only Duo Run+ can see
  viewCount: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// ==========================================
// Matching Post Tags Table (junction)
// ==========================================
export interface MatchingPostTagRecord {
  id: string;
  postId: string;
  tag: string;
}

// ==========================================
// Matching Comments Table
// ==========================================
export interface MatchingCommentRecord {
  id: string;
  postId: string;
  authorId: string;
  content: string;
  isPrivate: boolean; // If true, only post author and commenter can see
  parentId?: string; // For nested replies
  createdAt: Date;
  updatedAt: Date;
}
