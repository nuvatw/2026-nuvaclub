export interface TestResult {
    score: number;
    maxScore: number;
    passed: boolean;
    level?: number;
}

export type TestDifficulty = 'easy' | 'medium' | 'hard';
