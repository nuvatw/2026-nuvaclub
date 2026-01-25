import type {
  QuestionRecord,
  TestSessionRecord,
  UserTestProgressRecord,
  QuestionType,
} from '@/lib/db/schema';

export type { QuestionType };

export interface Question extends QuestionRecord {}

export interface TestSession extends TestSessionRecord {}

export interface UserProgress extends UserTestProgressRecord {}

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
