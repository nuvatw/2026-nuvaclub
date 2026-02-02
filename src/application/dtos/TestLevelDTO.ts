export type LevelStatus = 'locked' | 'available' | 'passed';

export interface TestLevelDTO {
    level: number;
    status: LevelStatus;
    bestScore: number | null;
    attempts: number;
    durationMinutes: number;
    questionTypes: string;
    questionCount: number;
    passed: boolean;

    // Precomputed UI flags (Decision tokens)
    isLocked: boolean;
    isAvailable: boolean;
    isPassed: boolean;
    actionLabel: string;
    buttonVariant: 'primary' | 'outline' | 'ghost';
}
