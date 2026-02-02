import { ITestRepository, QuestionWithOptions } from '../ports';
import { TestSessionAggregate, TestSessionStatus } from '@/domain/test/TestSessionAggregate';
import { TestLevelDTO, LevelStatus } from '../dtos/TestLevelDTO';

export class TestService {
    constructor(private testRepository: ITestRepository) { }

    /**
     * Get all test levels for a user with precomputed display state
     */
    async getLevelsForUser(userId: string): Promise<TestLevelDTO[]> {
        const configs = this.getLevelConfigs();
        // In a real app, this would fetch from a database or use a repository
        // For now, we'll simulate fetching progress
        const levels: TestLevelDTO[] = [];

        for (const config of configs) {
            // Simulate progress lookup - in real app use userRepository or testRepository
            // For now we assume user 1 has passed levels 1-2
            const passed = userId === 'user-1' && config.level <= 2;
            const available = config.level === 1 || (userId === 'user-1' && config.level <= 3);
            const status: LevelStatus = passed ? 'passed' : (available ? 'available' : 'locked');

            // Dummy stats
            const bestScore = passed ? 85 : null;
            const attempts = passed ? 1 : (available ? 0 : 0);

            levels.push({
                ...config,
                status,
                bestScore,
                attempts,
                passed,
                isLocked: status === 'locked',
                isAvailable: status === 'available',
                isPassed: status === 'passed',
                actionLabel: status === 'passed' ? 'Try Again' : 'Start Test',
                buttonVariant: status === 'passed' ? 'outline' : 'primary',
            });
        }

        return levels;
    }

    private getLevelConfigs() {
        const configs = [];
        for (let lvl = 1; lvl <= 12; lvl++) {
            let questionTypes: string;
            let duration: number;

            if (lvl <= 3) {
                questionTypes = 'True/False + Multiple Choice';
                duration = 5;
            } else if (lvl <= 6) {
                questionTypes = 'Multiple Choice + Short Answer';
                duration = 15;
            } else if (lvl <= 9) {
                questionTypes = 'Short Answer + Essay';
                duration = 30;
            } else {
                questionTypes = 'Essay';
                duration = 60;
            }

            configs.push({
                level: lvl,
                durationMinutes: duration,
                questionTypes,
                questionCount: 10,
            });
        }
        return configs;
    }

    /**
     * Get test session details with questions and answers
     */
    async getSessionResults(sessionId: string) {
        return this.testRepository.getSessionWithDetails(sessionId);
    }

    async startSession(userId: string, level: number) {
        const sessionRecord = this.testRepository.createSession(userId, level);
        // Duration is 30 mins by default in repository, we just mirror for now
        const aggregate = TestSessionAggregate.create(sessionRecord.id, userId, level, 30);
        return aggregate.toJSON();
    }

    async submitAnswer(sessionId: string, questionId: string, answer: string) {
        const sessionDetails = this.testRepository.getSessionWithDetails(sessionId);
        if (!sessionDetails) throw new Error('Session not found');

        const aggregate = TestSessionAggregate.reconstitute({
            id: sessionDetails.id,
            userId: sessionDetails.userId,
            level: sessionDetails.levelId.includes('-') ? parseInt(sessionDetails.levelId.split('-')[1]) : 1,
            status: this.mapStatus(sessionDetails.status),
            answers: this.mapAnswers(sessionDetails.answers),
            startedAt: sessionDetails.startedAt!,
            expiresAt: sessionDetails.expiresAt!,
        });

        aggregate.answerQuestion(questionId, answer);
        return this.testRepository.submitAnswer(sessionId, questionId, answer);
    }

    async completeSession(sessionId: string) {
        const sessionDetails = this.testRepository.getSessionWithDetails(sessionId);
        if (!sessionDetails) throw new Error('Session not found');

        const aggregate = TestSessionAggregate.reconstitute({
            id: sessionDetails.id,
            userId: sessionDetails.userId,
            level: sessionDetails.levelId.includes('-') ? parseInt(sessionDetails.levelId.split('-')[1]) : 1,
            status: this.mapStatus(sessionDetails.status),
            answers: this.mapAnswers(sessionDetails.answers),
            startedAt: sessionDetails.startedAt!,
            expiresAt: sessionDetails.expiresAt!,
        });

        const domainQuestions = sessionDetails.questions.map((q: QuestionWithOptions) => ({
            id: q.id,
            correctAnswer: q.correctAnswer || '',
            points: q.points
        }));

        aggregate.complete(domainQuestions);
        const result = aggregate.toJSON();

        // Sync back to infrastructure
        return this.testRepository.update(sessionId, {
            status: 'completed',
            score: result.score,
            passed: result.passed,
            completedAt: new Date()
        });
    }

    private mapStatus(status: string): TestSessionStatus {
        if (status === 'in-progress') return 'IN_PROGRESS';
        if (status === 'completed') return 'COMPLETED';
        if (status === 'expired') return 'EXPIRED';
        return 'IN_PROGRESS';
    }

    private mapAnswers(answers: any[]): Record<string, string> {
        return answers.reduce((acc, a) => {
            acc[a.questionId] = a.answer;
            return acc;
        }, {} as Record<string, string>);
    }
}
