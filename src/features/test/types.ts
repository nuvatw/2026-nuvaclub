
export type QuestionType = 'true-false' | 'multiple-choice' | 'short-answer' | 'essay';
export type QuestionDifficulty = 'easy' | 'medium' | 'hard';
export type TestSessionStatus = 'not-started' | 'in-progress' | 'completed' | 'expired' | 'grading';

export interface QuestionOption {
  id: string;
  questionId: string;
  optionKey: string;
  optionText: string;
  isCorrect: boolean;
  sortOrder: number;
}

export interface Question {
  id: string;
  levelId: string;
  categoryId?: string;
  type: QuestionType;
  content: string;
  explanation?: string;
  correctAnswer?: string;
  rubric?: string;
  points: number;
  difficulty: QuestionDifficulty;
  isRandomized: boolean;
  isActive: boolean;
  options?: QuestionOption[];
  createdAt: string; // ISO Date string from BFF
  updatedAt: string; // ISO Date string from BFF
}

export interface TestSession {
  id: string;
  userId: string;
  levelId: string;
  questionCount: number;
  timeLimit: number;
  passingScore: number;
  status: TestSessionStatus;
  startedAt?: string;
  completedAt?: string;
  expiresAt?: string;
  score?: number;
  maxScore: number;
  passed?: boolean;
  timeSpentSeconds?: number;
  createdAt: string;
  updatedAt: string;
}

export interface UserProgress {
  id: string;
  userId: string;
  currentLevel: number;
  highestPassedLevel: number;
  totalAttempts: number;
  totalPassed: number;
  totalFailed: number;
  averageScore?: number;
  lastAttemptAt?: string;
  createdAt: string;
  updatedAt: string;
}

export type LevelStatus = 'locked' | 'available' | 'passed';

// ==================== NUNU RANK SYSTEM ====================
// Nunu ranks are distinct from course levels
// They represent mentor experience and contribution

// Nunu Rank (1-5, where 5 is highest/most experienced)
export type NunuRank = 1 | 2 | 3 | 4 | 5;

// Nunu Exam type
export type NunuExamType = 'rank' | 'verified';

// Nunu Exam info
export interface NunuExamInfo {
  id: string;
  type: NunuExamType;
  rank?: NunuRank; // For rank exams
  title: string;
  description: string;
  topics: string[];
  skills: string[];
  durationMinutes: number;
  questionCount: number;
  passingScore: number;
}

// Nunu Exam status
export interface NunuExamStatus {
  examId: string;
  status: LevelStatus;
  bestScore: number | null;
  attempts: number;
  passed: boolean;
}

export interface LevelInfo {
  level: number;
  status: LevelStatus;
  bestScore: number | null;
  attempts: number;
  durationMinutes: number;
  questionTypes: string;
  questionCount: number;
  passed: boolean;
}

export interface TestResult {
  session: TestSession;
  score: number;
  maxScore: number;
  passed: boolean;
  timeSpent: number;
  correctAnswers: number;
  totalQuestions: number;
}

export interface AnswerState {
  questionId: string;
  answer: string;
  isCorrect?: boolean;
  score?: number;
}

export interface LevelStats {
  attempts: number;
  bestScore: number | null;
  passed: boolean;
  averageTime: number | null;
}

export interface LevelConfig {
  level: number;
  durationMinutes: number;
  questionTypes: string;
  questionCount: number;
}
