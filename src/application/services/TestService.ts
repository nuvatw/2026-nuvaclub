import { ITestRepository, QuestionWithOptions } from '../ports';
import { TestSessionAggregate, TestSessionStatus } from '@/domain/test/TestSessionAggregate';

export class TestService {
    constructor(private testRepository: ITestRepository) { }

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
