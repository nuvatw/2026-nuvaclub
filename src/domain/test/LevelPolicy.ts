import { TestDifficulty } from './types';

export class LevelPolicy {
    calculateLevel(score: number, difficulty: TestDifficulty): number {
        // Logic for determining level based on score/difficulty
        if (score < 50) return 0;

        let baseLevel = 1;
        if (difficulty === 'medium') baseLevel = 3;
        if (difficulty === 'hard') baseLevel = 5;

        return baseLevel + Math.floor((score - 50) / 10);
    }
}

export const levelPolicy = new LevelPolicy();
