import { TestSession, TestLevel, Question, TestAnswer, UserTestProgress, LevelAttempt } from '@/domain/types/test';
import { IBaseRepository } from './IBaseRepository';

export interface QuestionWithOptions extends Question {
    options?: any[]; // Simplified for port, concrete impl will handle
    level?: number;
}

export interface TestSessionWithDetails extends TestSession {
    questions: QuestionWithOptions[];
    answers: TestAnswer[];
    levelInfo?: TestLevel;
}

export interface ITestRepository extends IBaseRepository<TestSession> {
    getTestLevel(level: number): TestLevel | undefined;
    getQuestionsForLevel(level: number): QuestionWithOptions[];
    getQuestion(questionId: string): QuestionWithOptions | undefined;
    createSession(userId: string, level: number): TestSession;
    getSessionWithDetails(sessionId: string): TestSessionWithDetails | undefined;
    getUserProgress(userId: string): UserTestProgress | undefined;
    getOrCreateUserProgress(userId: string): UserTestProgress;
    getLevelHistory(userId: string, level: number): LevelAttempt[];
    getUserHistory(userId: string): TestSession[];
    getAnswersForSession(sessionId: string): TestAnswer[];
    submitAnswer(sessionId: string, questionId: string, answer: string): TestAnswer;
    completeSession(sessionId: string): TestSession | undefined;
    isSessionExpired(sessionId: string): boolean;
    expireSession(sessionId: string): TestSession | undefined;
    getActiveSession(userId: string): TestSession | undefined;
    canTakeLevel(userId: string, level: number): boolean;
    getLevelStats(userId: string, level: number): {
        attempts: number;
        bestScore: number | null;
        passed: boolean;
        averageTime: number | null;
    };
}
