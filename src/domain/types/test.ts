export type QuestionType = 'true-false' | 'multiple-choice' | 'short-answer' | 'essay';
export type QuestionDifficulty = 'easy' | 'medium' | 'hard';
export type TestSessionStatus = 'not-started' | 'in-progress' | 'completed' | 'expired' | 'grading';

export interface TestLevel {
    id: string;
    level: number;
    name: string;
    description: string;
    passingPercentage: number;
    timeLimit: number;
    questionCount: number;
    prerequisiteLevel?: number;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface QuestionCategory {
    id: string;
    name: string;
    slug: string;
    description?: string;
    parentId?: string;
    sortOrder: number;
    createdAt: Date;
    updatedAt: Date;
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
    createdAt: Date;
    updatedAt: Date;
}

export interface QuestionOption {
    id: string;
    questionId: string;
    optionKey: string;
    optionText: string;
    isCorrect: boolean;
    sortOrder: number;
}

export interface QuestionMedia {
    id: string;
    questionId: string;
    type: 'image' | 'code' | 'diagram' | 'audio';
    url: string;
    caption?: string;
    language?: string;
    sortOrder: number;
    createdAt: Date;
}

export interface TestSession {
    id: string;
    userId: string;
    levelId: string;
    questionCount: number;
    timeLimit: number;
    passingScore: number;
    status: TestSessionStatus;
    startedAt?: Date;
    completedAt?: Date;
    expiresAt?: Date;
    score?: number;
    maxScore: number;
    passed?: boolean;
    timeSpentSeconds?: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface TestSessionQuestion {
    id: string;
    sessionId: string;
    questionId: string;
    sortOrder: number;
    questionContent: string;
    questionType: QuestionType;
    points: number;
}

export interface TestAnswer {
    id: string;
    sessionId: string;
    sessionQuestionId: string;
    questionId: string;
    answer: string;
    isCorrect?: boolean;
    score?: number;
    feedback?: string;
    gradedBy?: string;
    gradedAt?: Date;
    answeredAt: Date;
    timeSpentSeconds?: number;
}

export interface UserTestProgress {
    id: string;
    userId: string;
    currentLevel: number;
    highestPassedLevel: number;
    totalAttempts: number;
    totalPassed: number;
    totalFailed: number;
    averageScore?: number;
    lastAttemptAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}

export interface LevelAttempt {
    id: string;
    userId: string;
    levelId: string;
    sessionId: string;
    attemptNumber: number;
    score: number;
    maxScore: number;
    percentage: number;
    passed: boolean;
    timeSpentSeconds: number;
    attemptedAt: Date;
}

export interface UserLevelStats {
    id: string;
    userId: string;
    levelId: string;
    totalAttempts: number;
    passCount: number;
    bestScore: number;
    bestPercentage: number;
    averageScore: number;
    averageTimeSeconds: number;
    fastestTimeSeconds?: number;
    isUnlocked: boolean;
    isPassed: boolean;
    firstPassedAt?: Date;
    lastAttemptAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}

export interface QuestionStats {
    id: string;
    questionId: string;
    timesAsked: number;
    timesCorrect: number;
    correctRate: number;
    averageTimeSeconds: number;
    lastUpdatedAt: Date;
}
