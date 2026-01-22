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
