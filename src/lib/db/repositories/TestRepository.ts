import { BaseRepository } from './BaseRepository';
import type { MockDB } from '../core/MockDB';
import type {
  QuestionRecord,
  TestSessionRecord,
  TestAnswerRecord,
  UserTestProgressRecord,
  LevelAttemptRecord,
  TestLevelRecord,
  QuestionOptionRecord,
} from '../schema';
import { getLevelDuration } from '../seed/test.seed';

export interface QuestionWithOptions extends QuestionRecord {
  options?: QuestionOptionRecord[];
  level?: number; // Resolved from levelId
}

export interface TestSessionWithDetails extends TestSessionRecord {
  questions: QuestionWithOptions[];
  answers: TestAnswerRecord[];
  levelInfo?: TestLevelRecord;
}

export class TestRepository extends BaseRepository<TestSessionRecord> {
  constructor(db: MockDB) {
    super(db.testSessions, db);
  }

  /**
   * Get test level info by level number
   */
  getTestLevel(level: number): TestLevelRecord | undefined {
    return this.db.testLevels.findFirst({
      where: { level },
    });
  }

  /**
   * Get all questions for a specific level
   */
  getQuestionsForLevel(level: number): QuestionWithOptions[] {
    // Find the level record
    const levelRecord = this.getTestLevel(level);
    if (!levelRecord) return [];

    const questions = this.db.questions.findMany({
      where: { levelId: levelRecord.id, isActive: true },
      orderBy: { field: 'id', direction: 'asc' },
    });

    return questions.map((q) => this.enrichQuestion(q, level));
  }

  /**
   * Get a single question
   */
  getQuestion(questionId: string): QuestionWithOptions | undefined {
    const question = this.db.questions.findById(questionId);
    if (!question) return undefined;

    // Resolve level from levelId
    const levelRecord = this.db.testLevels.findById(question.levelId);
    return this.enrichQuestion(question, levelRecord?.level);
  }

  /**
   * Enrich question with options
   */
  private enrichQuestion(question: QuestionRecord, level?: number): QuestionWithOptions {
    const options = this.db.questionOptions.findMany({
      where: { questionId: question.id },
      orderBy: { field: 'sortOrder', direction: 'asc' },
    });

    return {
      ...question,
      options,
      level,
    };
  }

  /**
   * Create a new test session
   */
  createSession(userId: string, level: number): TestSessionRecord {
    const questions = this.getQuestionsForLevel(level);
    const maxScore = questions.reduce((sum, q) => sum + q.points, 0);
    const passingScore = Math.ceil(maxScore * 0.6);

    const levelRecord = this.getTestLevel(level);
    const durationMinutes = getLevelDuration(level);
    const startedAt = new Date();
    const expiresAt = new Date(startedAt.getTime() + durationMinutes * 60 * 1000);

    const session = this.create({
      userId,
      levelId: levelRecord?.id ?? `level-${level}`,
      questionCount: questions.length,
      timeLimit: durationMinutes * 60, // Convert to seconds
      status: 'in-progress',
      startedAt,
      expiresAt,
      maxScore,
      passingScore,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Update user's attempt count
    const progress = this.getUserProgress(userId);
    if (progress) {
      this.db.userTestProgress.update(progress.id, {
        totalAttempts: progress.totalAttempts + 1,
        lastAttemptAt: new Date(),
        updatedAt: new Date(),
      });
    }

    return session;
  }

  /**
   * Get session details (including questions and answers)
   */
  getSessionWithDetails(sessionId: string): TestSessionWithDetails | undefined {
    const session = this.findById(sessionId);
    if (!session) return undefined;

    // Resolve level from levelId
    const levelRecord = this.db.testLevels.findById(session.levelId);
    const level = levelRecord?.level ?? 1;

    const questions = this.getQuestionsForLevel(level);
    const answers = this.getAnswersForSession(sessionId);

    return {
      ...session,
      questions,
      answers,
      levelInfo: levelRecord,
    };
  }

  /**
   * Get user's test progress
   */
  getUserProgress(userId: string): UserTestProgressRecord | undefined {
    return this.db.userTestProgress.findFirst({
      where: { userId },
    });
  }

  /**
   * Create or get user progress
   */
  getOrCreateUserProgress(userId: string): UserTestProgressRecord {
    let progress = this.getUserProgress(userId);
    if (!progress) {
      progress = this.db.userTestProgress.create({
        id: `utp-${userId}-${Date.now()}`,
        userId,
        currentLevel: 1,
        highestPassedLevel: 0,
        totalAttempts: 0,
        totalPassed: 0,
        totalFailed: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      this.persist();
    }
    return progress;
  }

  /**
   * Get user's history for a specific level
   */
  getLevelHistory(userId: string, level: number): LevelAttemptRecord[] {
    const levelRecord = this.getTestLevel(level);
    if (!levelRecord) return [];

    return this.db.levelAttempts.findMany({
      where: (r) => r.userId === userId && r.levelId === levelRecord.id,
      orderBy: { field: 'attemptedAt', direction: 'desc' },
    });
  }

  /**
   * Get all test history for a user
   */
  getUserHistory(userId: string): TestSessionRecord[] {
    return this.findMany({
      where: { userId },
      orderBy: { field: 'createdAt', direction: 'desc' },
    });
  }

  /**
   * Get all answers for a session
   */
  getAnswersForSession(sessionId: string): TestAnswerRecord[] {
    return this.db.testAnswers.findMany({
      where: { sessionId },
    });
  }

  /**
   * Submit an answer
   */
  submitAnswer(
    sessionId: string,
    questionId: string,
    answer: string
  ): TestAnswerRecord {
    // Check if answer already exists, update if so
    const existingAnswer = this.db.testAnswers.findFirst({
      where: (a) => a.sessionId === sessionId && a.questionId === questionId,
    });

    const question = this.db.questions.findById(questionId);
    let isCorrect: boolean | undefined;
    let score: number | undefined;

    // Auto-grade (true/false, multiple choice)
    if (question && (question.type === 'true-false' || question.type === 'multiple-choice')) {
      isCorrect = answer === question.correctAnswer;
      score = isCorrect ? question.points : 0;
    }

    if (existingAnswer) {
      // Update existing answer
      const updated = this.db.testAnswers.update(existingAnswer.id, {
        answer,
        isCorrect,
        score,
        answeredAt: new Date(),
      });
      this.persist();
      return updated!;
    }

    // Create new answer
    const newAnswer = this.db.testAnswers.create({
      id: `ans-${sessionId}-${questionId}`,
      sessionId,
      sessionQuestionId: `sq-${sessionId}-${questionId}`, // Link to session question
      questionId,
      answer,
      isCorrect,
      score,
      answeredAt: new Date(),
    });
    this.persist();
    return newAnswer;
  }

  /**
   * Complete the test
   */
  completeSession(sessionId: string): TestSessionRecord | undefined {
    const session = this.findById(sessionId);
    if (!session) return undefined;

    // Resolve level from levelId
    const levelRecord = this.db.testLevels.findById(session.levelId);
    const level = levelRecord?.level ?? 1;

    const answers = this.getAnswersForSession(sessionId);
    const questions = this.getQuestionsForLevel(level);

    // Calculate total score (only for auto-graded questions)
    let totalScore = 0;
    for (const answer of answers) {
      if (answer.score !== undefined) {
        totalScore += answer.score;
      } else {
        // Short answer and essay questions, temporarily score 0 (requires manual grading)
        // Here we can do simple keyword matching scoring
        const question = questions.find((q) => q.id === answer.questionId);
        if (question && question.type === 'short-answer' && question.correctAnswer) {
          // Simple keyword matching scoring
          const keywords = question.correctAnswer.split(/[，,、。；;]/).filter(Boolean);
          const matchedKeywords = keywords.filter((kw) =>
            answer.answer.toLowerCase().includes(kw.toLowerCase().trim())
          );
          const matchRatio = matchedKeywords.length / keywords.length;
          const partialScore = Math.round(question.points * matchRatio * 0.8); // Maximum 80%
          totalScore += partialScore;
          this.db.testAnswers.update(answer.id, { score: partialScore });
        }
      }
    }

    const passed = totalScore >= session.passingScore;

    const now = new Date();
    const timeSpent = session.startedAt
      ? Math.floor((now.getTime() - session.startedAt.getTime()) / 1000)
      : 0;

    const updated = this.update(sessionId, {
      status: 'completed',
      completedAt: now,
      score: totalScore,
      passed,
      timeSpentSeconds: timeSpent,
      updatedAt: now,
    });

    // Update user progress
    if (updated) {
      const progress = this.getUserProgress(session.userId);
      if (progress) {
        const updates: Partial<UserTestProgressRecord> = {
          lastAttemptAt: now,
          updatedAt: now,
        };

        if (passed) {
          updates.totalPassed = progress.totalPassed + 1;
          if (level > progress.highestPassedLevel) {
            updates.highestPassedLevel = level;
          }
          if (level >= progress.currentLevel && level < 12) {
            updates.currentLevel = level + 1;
          }
        } else {
          updates.totalFailed = (progress.totalFailed ?? 0) + 1;
        }

        this.db.userTestProgress.update(progress.id, updates);
      }

      // Record attempt history
      const previousAttempts = this.getLevelHistory(session.userId, level);
      this.db.levelAttempts.create({
        id: `la-${sessionId}`,
        userId: session.userId,
        levelId: session.levelId,
        sessionId,
        attemptNumber: previousAttempts.length + 1,
        score: totalScore,
        maxScore: session.maxScore,
        percentage: session.maxScore > 0 ? Math.round((totalScore / session.maxScore) * 100) : 0,
        passed,
        timeSpentSeconds: timeSpent,
        attemptedAt: now,
      });

      this.persist();
    }

    return updated;
  }

  /**
   * Check if test session has expired
   */
  isSessionExpired(sessionId: string): boolean {
    const session = this.findById(sessionId);
    if (!session || !session.expiresAt) return false;
    return new Date() > session.expiresAt;
  }

  /**
   * Mark test session as expired
   */
  expireSession(sessionId: string): TestSessionRecord | undefined {
    const session = this.findById(sessionId);
    if (!session) return undefined;

    return this.update(sessionId, {
      status: 'expired',
      updatedAt: new Date(),
    });
  }

  /**
   * Get user's active test session
   */
  getActiveSession(userId: string): TestSessionRecord | undefined {
    return this.findFirst({
      where: (s) => s.userId === userId && s.status === 'in-progress',
    });
  }

  /**
   * Check if user can take test at a specific level
   * Users can freely choose any level (1-12)
   */
  canTakeLevel(_userId: string, level: number): boolean {
    return level >= 1 && level <= 12;
  }

  /**
   * Get level statistics
   */
  getLevelStats(userId: string, level: number): {
    attempts: number;
    bestScore: number | null;
    passed: boolean;
    averageTime: number | null;
  } {
    const history = this.getLevelHistory(userId, level);

    if (history.length === 0) {
      return {
        attempts: 0,
        bestScore: null,
        passed: false,
        averageTime: null,
      };
    }

    const bestScore = Math.max(...history.map((h) => h.score));
    const passed = history.some((h) => h.passed);

    // Calculate average time from history
    const withTime = history.filter((h) => h.timeSpentSeconds != null);
    const averageTime =
      withTime.length > 0
        ? withTime.reduce((sum, h) => sum + (h.timeSpentSeconds ?? 0), 0) / withTime.length
        : null;

    return {
      attempts: history.length,
      bestScore,
      passed,
      averageTime,
    };
  }
}
