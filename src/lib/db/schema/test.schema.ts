// ==========================================
// Question Types
// ==========================================
export type QuestionType = 'true-false' | 'multiple-choice' | 'short-answer' | 'essay';

// ==========================================
// Test Status
// ==========================================
export type TestStatus = 'not-started' | 'in-progress' | 'completed' | 'expired';

// ==========================================
// Questions Table
// ==========================================
export interface QuestionRecord {
  id: string;
  level: number; // 1-12
  type: QuestionType;
  content: string; // Question content
  options?: string[]; // Options (for true/false and multiple choice)
  correctAnswer?: string; // Correct answer (for true/false, multiple choice, short answer)
  rubric?: string; // Grading rubric (for essay questions)
  points: number; // Points
  category?: string; // Question category (e.g., AI Fundamentals, Prompt Techniques, etc.)
  difficulty: 'easy' | 'medium' | 'hard';
  createdAt: Date;
  updatedAt: Date;
}

// ==========================================
// Test Sessions Table
// ==========================================
export interface TestSessionRecord {
  id: string;
  userId: string;
  level: number;
  status: TestStatus;
  startedAt?: Date;
  completedAt?: Date;
  expiredAt?: Date; // Expiration time = startedAt + duration
  score?: number; // Total score
  maxScore: number; // Maximum score
  passingScore: number; // Passing score (usually 60%)
  passed?: boolean;
  timeSpentSeconds?: number; // Actual time spent
  createdAt: Date;
  updatedAt: Date;
}

// ==========================================
// Test Answers Table
// ==========================================
export interface TestAnswerRecord {
  id: string;
  sessionId: string;
  questionId: string;
  answer: string; // User's answer
  isCorrect?: boolean; // System auto-graded (true/false, multiple choice)
  score?: number; // Score earned
  feedback?: string; // Feedback (for short answer, essay questions)
  answeredAt: Date;
}

// ==========================================
// User Test Progress Table
// ==========================================
export interface UserTestProgressRecord {
  id: string;
  userId: string;
  currentLevel: number; // Current unlocked level (initial value is 1)
  highestPassedLevel: number; // Highest passed level (initial value is 0)
  totalAttempts: number; // Total number of attempts
  totalPassed: number; // Total number of passes
  lastAttemptAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// ==========================================
// Level Attempt History Table
// ==========================================
export interface LevelAttemptRecord {
  id: string;
  userId: string;
  level: number;
  sessionId: string;
  attemptNumber: number; // Attempt number for this level
  score: number;
  passed: boolean;
  attemptedAt: Date;
}
