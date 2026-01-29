'use client';

import { useMemo, useState, useCallback, useEffect } from 'react';
import { useDB } from '../provider/DBProvider';
import { TestRepository, type TestSessionWithDetails } from '@/infra/mock/repositories';
import type {
  QuestionRecord,
  TestSessionRecord,
  TestLevelRecord,
  UserTestProgressRecord,
  LevelAttemptRecord,
} from '@/infra/mock/schema';
import { getLevelDuration } from '@/features/test/constants';

/**
 * Hook to access test data and operations
 */
export function useTests() {
  const db = useDB();

  const repo = useMemo(() => {
    if (!db) return null;
    return new TestRepository(db);
  }, [db]);

  return {
    isReady: !!db,
    getQuestionsForLevel: (level: number) => repo?.getQuestionsForLevel(level) ?? [],
    getQuestion: (questionId: string) => repo?.getQuestion(questionId),
    getUserProgress: (userId: string) => repo?.getUserProgress(userId),
    getOrCreateUserProgress: (userId: string) => repo?.getOrCreateUserProgress(userId),
    getLevelHistory: (userId: string, level: number) =>
      repo?.getLevelHistory(userId, level) ?? [],
    getUserHistory: (userId: string) => repo?.getUserHistory(userId) ?? [],
    canTakeLevel: (userId: string, level: number) => repo?.canTakeLevel(userId, level) ?? false,
    getLevelStats: (userId: string, level: number) =>
      repo?.getLevelStats(userId, level) ?? {
        attempts: 0,
        bestScore: null,
        passed: false,
        averageTime: null,
      },
    getLevelDuration,
  };
}

/**
 * Hook to manage a test session
 */
export function useTestSession(userId: string | null) {
  const db = useDB();
  const [session, setSession] = useState<TestSessionRecord | null>(null);
  const [questions, setQuestions] = useState<QuestionRecord[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const repo = useMemo(() => {
    if (!db) return null;
    return new TestRepository(db);
  }, [db]);

  // Start a new test
  const startSession = useCallback(
    (level: number) => {
      if (!repo || !userId) return null;
      setIsLoading(true);

      const newSession = repo.createSession(userId, level);
      const levelQuestions = repo.getQuestionsForLevel(level);

      setSession(newSession);
      setQuestions(levelQuestions);
      setCurrentQuestionIndex(0);
      setAnswers({});
      setIsLoading(false);

      return newSession;
    },
    [repo, userId]
  );

  // Load an existing test
  const loadSession = useCallback(
    (sessionId: string) => {
      if (!repo) return null;
      setIsLoading(true);

      const existingSession = repo.findById(sessionId);
      if (existingSession) {
        setSession(existingSession);
        // Resolve level from levelId
        const levelRecord = repo.getTestLevel(1); // Get level 1 as fallback
        const levelFromId = db?.testLevels.findById(existingSession.levelId);
        const level = levelFromId?.level ?? 1;
        const levelQuestions = repo.getQuestionsForLevel(level);
        setQuestions(levelQuestions);

        // Load existing answers
        const existingAnswers = repo.getAnswersForSession(sessionId);
        const answersMap: Record<string, string> = {};
        existingAnswers.forEach((a) => {
          answersMap[a.questionId] = a.answer;
        });
        setAnswers(answersMap);
      }

      setIsLoading(false);
      return existingSession;
    },
    [repo]
  );

  // Submit an answer
  const submitAnswer = useCallback(
    (questionId: string, answer: string) => {
      if (!repo || !session) return;

      repo.submitAnswer(session.id, questionId, answer);
      setAnswers((prev) => ({ ...prev, [questionId]: answer }));
    },
    [repo, session]
  );

  // Complete the test
  const completeSession = useCallback(() => {
    if (!repo || !session) return null;

    const completedSession = repo.completeSession(session.id);
    if (completedSession) {
      setSession(completedSession);
    }
    return completedSession;
  }, [repo, session]);

  // Get session details
  const getSessionDetails = useCallback(() => {
    if (!repo || !session) return null;
    return repo.getSessionWithDetails(session.id);
  }, [repo, session]);

  // Check if expired
  const isExpired = useMemo(() => {
    if (!session?.expiresAt) return false;
    return new Date() > session.expiresAt;
  }, [session]);

  // Remaining time (seconds)
  const remainingTime = useMemo(() => {
    if (!session?.expiresAt) return 0;
    const now = new Date();
    const remaining = Math.max(0, session.expiresAt.getTime() - now.getTime());
    return Math.floor(remaining / 1000);
  }, [session]);

  // Current question
  const currentQuestion = questions[currentQuestionIndex] ?? null;

  // Navigation
  const goToQuestion = useCallback(
    (index: number) => {
      if (index >= 0 && index < questions.length) {
        setCurrentQuestionIndex(index);
      }
    },
    [questions.length]
  );

  const nextQuestion = useCallback(() => {
    goToQuestion(currentQuestionIndex + 1);
  }, [currentQuestionIndex, goToQuestion]);

  const prevQuestion = useCallback(() => {
    goToQuestion(currentQuestionIndex - 1);
  }, [currentQuestionIndex, goToQuestion]);

  // Calculate answered question count
  const answeredCount = Object.keys(answers).length;
  const totalQuestions = questions.length;
  const progress = totalQuestions > 0 ? (answeredCount / totalQuestions) * 100 : 0;

  return {
    session,
    questions,
    currentQuestion,
    currentQuestionIndex,
    answers,
    isLoading,
    isExpired,
    remainingTime,
    answeredCount,
    totalQuestions,
    progress,
    isReady: !!db,
    startSession,
    loadSession,
    submitAnswer,
    completeSession,
    getSessionDetails,
    goToQuestion,
    nextQuestion,
    prevQuestion,
  };
}

/**
 * Hook to get user's test progress
 */
export function useUserTestProgress(userId: string | null): UserTestProgressRecord | null {
  const db = useDB();

  return useMemo(() => {
    if (!db || !userId) return null;
    const repo = new TestRepository(db);
    return repo.getUserProgress(userId) ?? null;
  }, [db, userId]);
}

/**
 * Hook to get level statistics
 */
export function useLevelStats(userId: string | null, level: number) {
  const db = useDB();

  return useMemo(() => {
    if (!db || !userId) {
      return {
        attempts: 0,
        bestScore: null,
        passed: false,
        averageTime: null,
      };
    }
    const repo = new TestRepository(db);
    return repo.getLevelStats(userId, level);
  }, [db, userId, level]);
}

/**
 * Active session with level info
 */
export interface ActiveTestSession extends TestSessionRecord {
  levelInfo?: TestLevelRecord;
}

/**
 * Hook to check if user has an active session
 */
export function useActiveTestSession(userId: string | null): ActiveTestSession | null {
  const db = useDB();

  return useMemo(() => {
    if (!db || !userId) return null;
    const repo = new TestRepository(db);
    const session = repo.getActiveSession(userId);
    if (!session) return null;

    // Enrich with level info
    const levelInfo = db.testLevels.findById(session.levelId);
    return {
      ...session,
      levelInfo: levelInfo ?? undefined,
    };
  }, [db, userId]);
}

/**
 * Level configuration information
 */
export interface LevelConfig {
  level: number;
  durationMinutes: number;
  questionTypes: string;
  questionCount: number;
}

/**
 * Hook to get level configurations
 */
export function useLevelConfigs(): LevelConfig[] {
  const db = useDB();

  return useMemo(() => {
    if (!db) return [];

    const repo = new TestRepository(db);
    const configs: LevelConfig[] = [];

    for (let level = 1; level <= 12; level++) {
      const questions = repo.getQuestionsForLevel(level);
      const duration = getLevelDuration(level);

      let questionTypes: string;
      if (level <= 3) {
        questionTypes = 'True/False + Multiple Choice';
      } else if (level <= 6) {
        questionTypes = 'Multiple Choice + Short Answer';
      } else if (level <= 9) {
        questionTypes = 'Short Answer + Essay';
      } else {
        questionTypes = 'Essay';
      }

      configs.push({
        level,
        durationMinutes: duration,
        questionTypes,
        questionCount: questions.length,
      });
    }

    return configs;
  }, [db]);
}
