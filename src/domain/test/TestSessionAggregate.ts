export type TestSessionStatus = 'IN_PROGRESS' | 'COMPLETED' | 'EXPIRED';

export interface TestSessionProps {
    id: string;
    userId: string;
    level: number;
    status: TestSessionStatus;
    answers: Record<string, string>;
    startedAt: Date;
    expiresAt: Date;
    score?: number;
    passed?: boolean;
}

export interface DomainQuestion {
    id: string;
    correctAnswer: string;
    points: number;
}

export class TestSessionAggregate {
    private constructor(private props: TestSessionProps) { }

    static create(id: string, userId: string, level: number, durationMinutes: number): TestSessionAggregate {
        const now = new Date();
        return new TestSessionAggregate({
            id,
            userId,
            level,
            status: 'IN_PROGRESS',
            answers: {},
            startedAt: now,
            expiresAt: new Date(now.getTime() + durationMinutes * 60 * 1000),
        });
    }

    static reconstitute(props: TestSessionProps): TestSessionAggregate {
        return new TestSessionAggregate(props);
    }

    answerQuestion(questionId: string, answer: string): void {
        this.ensureInProgress();
        this.ensureNotExpired();
        this.props.answers[questionId] = answer;
    }

    complete(questions: DomainQuestion[]): void {
        this.ensureInProgress();

        // Invariant: Cannot complete without minimum answers (let's say all must be answered)
        const answeredIds = Object.keys(this.props.answers);
        const unaskedIds = questions.filter(q => !answeredIds.includes(q.id));

        if (unaskedIds.length > 0 && !this.isExpired()) {
            // Optional: Enforce all questions answered. For now let's just score what we have.
        }

        this.props.status = 'COMPLETED';
        this.props.score = this.calculateScore(questions);
        this.props.passed = this.props.score >= 70; // Hardcoded threshold per original logic
    }

    calculateScore(questions: DomainQuestion[]): number {
        if (questions.length === 0) return 0;

        let totalPoints = 0;
        let earnedPoints = 0;

        for (const q of questions) {
            totalPoints += q.points;
            if (this.props.answers[q.id] === q.correctAnswer) {
                earnedPoints += q.points;
            }
        }

        return totalPoints > 0 ? (earnedPoints / totalPoints) * 100 : 0;
    }

    private isExpired(): boolean {
        return new Date() > this.props.expiresAt;
    }

    private ensureInProgress(): void {
        if (this.props.status !== 'IN_PROGRESS') {
            throw new Error('Action only allowed for in-progress sessions');
        }
    }

    private ensureNotExpired(): void {
        if (this.isExpired()) {
            this.props.status = 'EXPIRED';
            throw new Error('Session has expired');
        }
    }

    toJSON() {
        return { ...this.props };
    }

    getStatus() { return this.props.status; }
    getScore() { return this.props.score; }
    isPassed() { return this.props.passed; }
}
