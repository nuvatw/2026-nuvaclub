// ============================================================================
// TEST MODULE - Database Schema
// Skill assessment tests with leveled progression
// Following 3NF Normalization Principles
// ============================================================================

// ==========================================
// ENUMS & TYPES
// ==========================================
export type QuestionType = 'true-false' | 'multiple-choice' | 'short-answer' | 'essay';
export type QuestionDifficulty = 'easy' | 'medium' | 'hard';
export type TestSessionStatus = 'not-started' | 'in-progress' | 'completed' | 'expired' | 'grading';

// Level configuration
export const TEST_LEVELS = {
  MIN_LEVEL: 1,
  MAX_LEVEL: 12,
  PASSING_PERCENTAGE: 60,
} as const;

// ==========================================
// TEST LEVELS TABLE
// Configuration for each test level
// ==========================================
export interface TestLevelRecord {
  // Primary Key
  id: string;

  // Level Information
  level: number; // 1-12
  name: string; // e.g., "AI Fundamentals"
  description: string;

  // Requirements
  passingPercentage: number; // Default 60
  timeLimit: number; // Seconds allowed for test
  questionCount: number; // Number of questions per test

  // Unlock Requirements
  prerequisiteLevel?: number; // Must pass this level first

  // Status
  isActive: boolean;

  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

// Unique Index: level
// Index: isActive

// ==========================================
// QUESTION CATEGORIES TABLE
// Categories for organizing questions
// ==========================================
export interface QuestionCategoryRecord {
  // Primary Key
  id: string;

  // Category Information
  name: string;
  slug: string;
  description?: string;

  // Hierarchy
  parentId?: string; // FK -> question_categories.id

  // Order
  sortOrder: number;

  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

// Unique Index: slug
// Index: parentId, sortOrder

// ==========================================
// QUESTIONS TABLE
// Test questions for all levels
// ==========================================
export interface QuestionRecord {
  // Primary Key
  id: string;

  // Foreign Keys
  levelId: string; // FK -> test_levels.id
  categoryId?: string; // FK -> question_categories.id

  // Question Details
  type: QuestionType;
  content: string; // Question text (supports markdown)
  explanation?: string; // Explanation shown after answering

  // For objective questions (true-false, multiple-choice)
  correctAnswer?: string; // The correct answer

  // For essay questions
  rubric?: string; // Grading rubric

  // Scoring
  points: number;
  difficulty: QuestionDifficulty;

  // Randomization
  isRandomized: boolean; // Shuffle options order

  // Status
  isActive: boolean;

  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

// Index: levelId, categoryId, type, difficulty, isActive

// ==========================================
// QUESTION OPTIONS TABLE
// Answer options for multiple-choice questions - 1NF compliance
// ==========================================
export interface QuestionOptionRecord {
  // Primary Key
  id: string;

  // Foreign Keys
  questionId: string; // FK -> questions.id

  // Option Details
  optionKey: string; // e.g., "A", "B", "C", "D" or "true", "false"
  optionText: string;
  isCorrect: boolean;

  // Order
  sortOrder: number;
}

// Index: questionId, sortOrder

// ==========================================
// QUESTION MEDIA TABLE
// Images, diagrams, code snippets for questions
// ==========================================
export interface QuestionMediaRecord {
  // Primary Key
  id: string;

  // Foreign Keys
  questionId: string; // FK -> questions.id

  // Media Details
  type: 'image' | 'code' | 'diagram' | 'audio';
  url: string;
  caption?: string;
  language?: string; // For code snippets

  // Order
  sortOrder: number;

  // Timestamps
  createdAt: Date;
}

// Index: questionId, type

// ==========================================
// TEST SESSIONS TABLE
// Individual test attempts
// ==========================================
export interface TestSessionRecord {
  // Primary Key
  id: string;

  // Foreign Keys
  userId: string; // FK -> users.id
  levelId: string; // FK -> test_levels.id

  // Session Configuration
  questionCount: number;
  timeLimit: number; // Seconds
  passingScore: number; // Points needed to pass

  // Status
  status: TestSessionStatus;

  // Timing
  startedAt?: Date;
  completedAt?: Date;
  expiresAt?: Date; // startedAt + timeLimit

  // Results (set after completion)
  score?: number;
  maxScore: number;
  passed?: boolean;
  timeSpentSeconds?: number;

  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

// Index: userId, levelId, status, createdAt

// ==========================================
// TEST SESSION QUESTIONS TABLE (Junction)
// Questions assigned to a test session
// Links specific questions to sessions for consistency
// ==========================================
export interface TestSessionQuestionRecord {
  // Primary Key
  id: string;

  // Foreign Keys
  sessionId: string; // FK -> test_sessions.id
  questionId: string; // FK -> questions.id

  // Order in test
  sortOrder: number;

  // Question Snapshot (for consistency if question is edited)
  questionContent: string;
  questionType: QuestionType;
  points: number;
}

// Index: sessionId, sortOrder

// ==========================================
// TEST ANSWERS TABLE
// User answers for each question in a session
// ==========================================
export interface TestAnswerRecord {
  // Primary Key
  id: string;

  // Foreign Keys
  sessionId: string; // FK -> test_sessions.id
  sessionQuestionId: string; // FK -> test_session_questions.id
  questionId: string; // FK -> questions.id

  // Answer Content
  answer: string; // User's answer

  // Grading
  isCorrect?: boolean; // Auto-graded for objective questions
  score?: number; // Points earned
  feedback?: string; // Grader feedback (for subjective questions)
  gradedBy?: string; // FK -> users.id (grader for subjective)
  gradedAt?: Date;

  // Timing
  answeredAt: Date;
  timeSpentSeconds?: number;
}

// Unique Index: (sessionId, questionId)
// Index: sessionId, isCorrect

// ==========================================
// USER TEST PROGRESS TABLE
// Overall test progress per user
// ==========================================
export interface UserTestProgressRecord {
  // Primary Key
  id: string;

  // Foreign Keys
  userId: string; // FK -> users.id

  // Progress
  currentLevel: number; // Currently unlocked level (starts at 1)
  highestPassedLevel: number; // Highest level passed (starts at 0)

  // Statistics
  totalAttempts: number;
  totalPassed: number;
  totalFailed: number;
  averageScore?: number; // Average score across all attempts

  // Timestamps
  lastAttemptAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Unique Index: userId
// Index: currentLevel, highestPassedLevel

// ==========================================
// LEVEL ATTEMPTS TABLE
// Detailed attempt history per level
// ==========================================
export interface LevelAttemptRecord {
  // Primary Key
  id: string;

  // Foreign Keys
  userId: string; // FK -> users.id
  levelId: string; // FK -> test_levels.id
  sessionId: string; // FK -> test_sessions.id

  // Attempt Details
  attemptNumber: number; // 1st, 2nd, 3rd attempt at this level
  score: number;
  maxScore: number;
  percentage: number; // score / maxScore * 100
  passed: boolean;
  timeSpentSeconds: number;

  // Timestamps
  attemptedAt: Date;
}

// Index: userId, levelId, attemptNumber

// ==========================================
// USER LEVEL STATS TABLE
// Aggregated statistics per user per level
// ==========================================
export interface UserLevelStatsRecord {
  // Primary Key
  id: string;

  // Foreign Keys
  userId: string; // FK -> users.id
  levelId: string; // FK -> test_levels.id

  // Statistics
  totalAttempts: number;
  passCount: number;
  bestScore: number;
  bestPercentage: number;
  averageScore: number;
  averageTimeSeconds: number;
  fastestTimeSeconds?: number;

  // Status
  isUnlocked: boolean;
  isPassed: boolean;
  firstPassedAt?: Date;

  // Timestamps
  lastAttemptAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Unique Index: (userId, levelId)
// Index: isUnlocked, isPassed

// ==========================================
// QUESTION STATS TABLE
// Analytics for questions (for difficulty tuning)
// ==========================================
export interface QuestionStatsRecord {
  // Primary Key
  id: string; // Same as questionId for 1:1 relationship

  // Foreign Keys
  questionId: string; // FK -> questions.id

  // Statistics
  timesAsked: number;
  timesCorrect: number;
  correctRate: number; // timesCorrect / timesAsked
  averageTimeSeconds: number;

  // Timestamps
  lastUpdatedAt: Date;
}

// Primary Key: questionId
