// ============================================================================
// SPACE MODULE - Database Schema
// Companion matching, mentorships, and community features
// Following 3NF Normalization Principles
// ============================================================================

// ==========================================
// ENUMS & TYPES
// ==========================================
export type CompanionType = 'nunu' | 'certified-nunu' | 'shangzhe';
export type MatchStatus = 'pending' | 'accepted' | 'active' | 'completed' | 'cancelled';
export type MentorshipStatus = 'active' | 'completed' | 'paused';
export type NunuApplicationStatus = 'pending' | 'approved' | 'rejected';
export type NunuLevel = 'N5' | 'N4' | 'N3' | 'N2' | 'N1';
export type NunuType = 'regular' | 'verified';
export type MatchingPostType = 'nunu-looking-for-vava' | 'vava-looking-for-nunu';
export type TimeSelectionType = 'monthly' | 'seasonal';

// Nunu level configuration
export const NUNU_LEVEL_CONFIG: Record<NunuLevel, { maxVavas: number; label: string }> = {
  N5: { maxVavas: 3, label: 'Beginner' },
  N4: { maxVavas: 5, label: 'Intermediate' },
  N3: { maxVavas: 10, label: 'Advanced' },
  N2: { maxVavas: 30, label: 'Expert' },
  N1: { maxVavas: 50, label: 'Master' },
};

// ==========================================
// COMPANIONS TABLE
// External companion profiles (not regular users)
// ==========================================
export interface CompanionRecord {
  // Primary Key
  id: string;

  // Optional User Link (if companion is also a platform user)
  userId?: string; // FK -> users.id

  // Profile Information
  name: string;
  avatar: string;
  bio: string;
  type: CompanionType;

  // Contact
  discordId: string;

  // Availability
  isAvailable: boolean;

  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

// Index: type, isAvailable, userId

// ==========================================
// COMPANION EXPERTISE TABLE (Junction)
// Normalized expertise list - 1NF compliance
// ==========================================
export interface CompanionExpertiseRecord {
  // Primary Key
  id: string;

  // Foreign Keys
  companionId: string; // FK -> companions.id

  // Data
  expertise: string;
  sortOrder: number;
}

// Unique Index: (companionId, expertise)
// Index: companionId

// ==========================================
// COMPANION STATS TABLE
// Denormalized statistics (computed periodically)
// Separate table to avoid update contention on main table
// ==========================================
export interface CompanionStatsRecord {
  // Primary Key
  id: string; // Same as companionId for 1:1 relationship

  // Foreign Keys
  companionId: string; // FK -> companions.id

  // Statistics
  matchCount: number;
  completedMatchCount: number;
  totalRatings: number;
  sumRatings: number; // Sum of all ratings for avg calculation
  avgRating: number; // Computed: sumRatings / totalRatings

  // Timestamps
  lastUpdatedAt: Date;
}

// Primary Key: companionId

// ==========================================
// MATCHES TABLE
// User-to-companion matching records
// ==========================================
export interface MatchRecord {
  // Primary Key
  id: string;

  // Foreign Keys
  userId: string; // FK -> users.id
  companionId: string; // FK -> companions.id
  ticketId: string; // FK -> user_duo_tickets.id

  // Month this match is for (YYYY-MM format)
  forMonth?: string; // e.g., "2026-03"

  // Match Status
  status: MatchStatus;

  // Lifecycle Timestamps
  requestedAt: Date; // When user requested match
  acceptedAt?: Date; // When companion accepted
  activatedAt?: Date; // When match became active
  completedAt?: Date;
  cancelledAt?: Date;
  cancelReason?: string;

  // Notes
  userNotes?: string; // User's notes about goals
  companionNotes?: string; // Companion's notes

  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

// Index: userId, companionId, ticketId, status, createdAt

// ==========================================
// MATCH RATINGS TABLE
// Ratings submitted after match completion
// ==========================================
export interface MatchRatingRecord {
  // Primary Key
  id: string;

  // Foreign Keys
  matchId: string; // FK -> matches.id
  raterId: string; // FK -> users.id (who gave the rating)
  rateeId: string; // FK -> companions.id or users.id

  // Rating Content
  rating: number; // 1-5
  feedback?: string;

  // Timestamps
  createdAt: Date;
}

// Unique Index: (matchId, raterId) - one rating per rater per match
// Index: rateeId, rating

// ==========================================
// NUNU APPLICATIONS TABLE
// Applications to become a Nunu mentor
// ==========================================
export interface NunuApplicationRecord {
  // Primary Key
  id: string;

  // Foreign Keys
  userId: string; // FK -> users.id

  // Application Status
  status: NunuApplicationStatus;

  // Basic Information
  applicationText: string; // Why they want to become Nunu
  discordId: string;

  // Video Introduction
  introVideoUrl?: string;
  introVideoFileName?: string;
  introVideoDurationSeconds?: number;

  // Review Information
  reviewedAt?: Date;
  reviewedBy?: string; // FK -> users.id (admin)
  rejectionReason?: string;

  // Timestamps
  submittedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Unique Index: (userId, status='pending') - one pending application per user
// Index: userId, status, submittedAt

// ==========================================
// NUNU APPLICATION EXPERTISE TABLE (Junction)
// Areas the applicant can help with - 1NF compliance
// ==========================================
export interface NunuApplicationExpertiseRecord {
  // Primary Key
  id: string;

  // Foreign Keys
  applicationId: string; // FK -> nunu_applications.id

  // Data
  expertise: string;
  sortOrder: number;
}

// Unique Index: (applicationId, expertise)
// Index: applicationId

// ==========================================
// NUNU APPLICATION ANSWERS TABLE
// Situational question responses - 1NF compliance
// Normalized from embedded JSON
// ==========================================
export interface NunuApplicationAnswerRecord {
  // Primary Key
  id: string;

  // Foreign Keys
  applicationId: string; // FK -> nunu_applications.id

  // Question/Answer
  questionId: string; // Identifier for the question (e.g., 'question1')
  question: string; // The actual question text
  answer: string; // The applicant's answer

  // Ordering
  sortOrder: number;
}

// Unique Index: (applicationId, questionId)
// Index: applicationId

// Situational questions configuration
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
// NUNU PROFILES TABLE
// Approved Nunu mentor profiles
// ==========================================
export interface NunuProfileRecord {
  // Primary Key
  id: string;

  // Foreign Keys
  userId: string; // FK -> users.id
  applicationId: string; // FK -> nunu_applications.id

  // Profile Information
  level: NunuLevel;
  type: NunuType; // regular = monthly, verified = seasonal
  bio: string;
  discordId: string;

  // Availability
  isAvailable: boolean;
  maxVavas: number; // Based on level, but can be customized

  // Timestamps
  approvedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Unique Index: userId
// Index: level, type, isAvailable

// ==========================================
// NUNU PROFILE EXPERTISE TABLE (Junction)
// Expertise areas for approved Nunus - 1NF compliance
// ==========================================
export interface NunuProfileExpertiseRecord {
  // Primary Key
  id: string;

  // Foreign Keys
  profileId: string; // FK -> nunu_profiles.id

  // Data
  expertise: string;
  sortOrder: number;
}

// Unique Index: (profileId, expertise)
// Index: profileId

// ==========================================
// NUNU STATS TABLE
// Denormalized statistics for Nunu profiles
// ==========================================
export interface NunuStatsRecord {
  // Primary Key
  id: string; // Same as profileId for 1:1 relationship

  // Foreign Keys
  profileId: string; // FK -> nunu_profiles.id

  // Current State
  currentVavaCount: number;

  // Lifetime Statistics
  totalMentorships: number;
  completedMentorships: number;
  totalRatings: number;
  sumRatings: number;
  avgRating: number; // Computed: sumRatings / totalRatings

  // Timestamps
  lastUpdatedAt: Date;
}

// Primary Key: profileId

// ==========================================
// USER MENTORSHIPS TABLE
// Nunu-Vava relationships between users
// ==========================================
export interface UserMentorshipRecord {
  // Primary Key
  id: string;

  // Foreign Keys
  nunuId: string; // FK -> users.id (the mentor)
  vavaId: string; // FK -> users.id (the mentee)
  nunuProfileId: string; // FK -> nunu_profiles.id

  // Month(s) this mentorship covers (YYYY-MM format)
  months?: string[]; // e.g., ["2026-03", "2026-04"]

  // Status
  status: MentorshipStatus;

  // Session Tracking
  sessionCount: number;
  lastSessionAt?: Date;

  // Notes
  notes?: string;

  // Lifecycle Timestamps
  startedAt: Date;
  pausedAt?: Date;
  completedAt?: Date;

  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

// Unique Index: (nunuId, vavaId) - one active mentorship per pair
// Index: nunuId, vavaId, nunuProfileId, status

// ==========================================
// MENTORSHIP SESSIONS TABLE
// Individual session records (optional detailed tracking)
// ==========================================
export interface MentorshipSessionRecord {
  // Primary Key
  id: string;

  // Foreign Keys
  mentorshipId: string; // FK -> user_mentorships.id

  // Session Details
  sessionNumber: number;
  scheduledAt?: Date;
  occurredAt: Date;
  durationMinutes?: number;

  // Notes
  notes?: string;
  topics?: string;

  // Timestamps
  createdAt: Date;
}

// Index: mentorshipId, occurredAt

// ==========================================
// MATCHING POSTS TABLE
// Community board for finding mentors/mentees
// ==========================================
export interface MatchingPostRecord {
  // Primary Key
  id: string;

  // Foreign Keys
  authorId: string; // FK -> users.id

  // Post Content
  type: MatchingPostType;
  title: string;
  content: string;

  // Time Selection
  timeSelection: TimeSelectionType;
  timePeriod: string; // e.g., "2026-01" for monthly, "2026-Q1" for seasonal

  // Access Control
  isVerifiedNunuOnly: boolean; // If true, only Duo Run+ can see

  // Status
  isActive: boolean;

  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

// Index: authorId, type, timeSelection, isActive, createdAt

// ==========================================
// MATCHING POST STATS TABLE
// Denormalized statistics for posts
// ==========================================
export interface MatchingPostStatsRecord {
  // Primary Key
  id: string; // Same as postId for 1:1 relationship

  // Foreign Keys
  postId: string; // FK -> matching_posts.id

  // Statistics
  viewCount: number;
  commentCount: number;

  // Timestamps
  lastUpdatedAt: Date;
}

// Primary Key: postId

// ==========================================
// MATCHING POST TAGS TABLE (Junction)
// Tags for matching posts - 1NF compliance
// ==========================================
export interface MatchingPostTagRecord {
  // Primary Key
  id: string;

  // Foreign Keys
  postId: string; // FK -> matching_posts.id

  // Data
  tag: string;
}

// Unique Index: (postId, tag)
// Index: postId, tag

// ==========================================
// MATCHING COMMENTS TABLE
// Comments on matching posts
// ==========================================
export interface MatchingCommentRecord {
  // Primary Key
  id: string;

  // Foreign Keys
  postId: string; // FK -> matching_posts.id
  authorId: string; // FK -> users.id
  parentId?: string; // FK -> matching_comments.id (for nested replies)

  // Content
  content: string;

  // Privacy
  isPrivate: boolean; // If true, only post author and commenter can see

  // Soft Delete
  isDeleted: boolean;

  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

// Index: postId, authorId, parentId, isPrivate, createdAt
