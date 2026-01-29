import { levelPolicy } from './LevelPolicy';
import { TestDifficulty, TestResult } from './types';

export class TestEngine {
    evaluateSubmission(score: number, maxScore: number, difficulty: TestDifficulty): TestResult {
        const percentage = (score / maxScore) * 100;
        const passed = percentage >= 70; // Pass threshold
        const level = passed ? levelPolicy.calculateLevel(percentage, difficulty) : undefined;

        return {
            score: percentage,
            maxScore: 100,
            passed,
            level
        };
    }
}

export const testEngine = new TestEngine();
