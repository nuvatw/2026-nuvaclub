'use client';

import { useState, useCallback, useEffect, useMemo } from 'react';
import { getLevelDuration } from '@/features/test/constants';

// Local types (avoid infra imports)
export interface QuestionRecord {
  id: string;
  levelId: string;
  type: 'true-false' | 'multiple-choice' | 'short-answer' | 'essay';
  content: string;
  level: number;
  question: string;
  options?: string[];
  correctAnswer: string;
  points: number;
  difficulty: 'easy' | 'medium' | 'hard';
  isRandomized: boolean;
  isActive: boolean;
  explanation?: string;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface TestSessionRecord {
  id: string;
  userId: string;
  levelId: number;
  status: 'in_progress' | 'completed' | 'abandoned';
  score: number | null;
  startedAt: string | Date;
  completedAt: string | Date | null;
  expiresAt: string | Date;
  maxScore?: number;
  passed?: boolean;
  timeSpentSeconds?: number;
  passingScore?: number;
}

export interface UserTestProgressRecord {
  userId: string;
  currentLevel: number;
  highestUnlockedLevel: number;
  highestPassedLevel?: number; // Alias for compatibility
  totalAttempts: number;
  passedLevels: number[];
}

export interface LevelStats {
  attempts: number;
  bestScore: number | null;
  passed: boolean;
  averageTime: number | null;
}

export interface LevelConfig {
  level: number;
  durationMinutes: number;
  questionTypes: string;
  questionCount: number;
}

/**
 * Hook to access test data and operations via BFF
 */
export function useTests() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setIsReady(typeof window !== 'undefined');
  }, []);

  const getQuestionsForLevel = useCallback(async (level: number): Promise<QuestionRecord[]> => {
    try {
      const res = await fetch(`/api/bff/test/tests?level=${level}`);
      if (!res.ok) return [];
      return res.json();
    } catch (err) {
      console.error('Failed to fetch questions:', err);
      return [];
    }
  }, []);

  const getUserProgress = useCallback(async (userId: string): Promise<UserTestProgressRecord | null> => {
    try {
      const res = await fetch(`/api/bff/test/progress?userId=${userId}`);
      if (!res.ok) return null;
      return res.json();
    } catch (err) {
      console.error('Failed to fetch user progress:', err);
      return null;
    }
  }, []);

  const getLevelStats = useCallback(async (userId: string, level: number): Promise<LevelStats> => {
    try {
      const res = await fetch(`/api/bff/test/progress?userId=${userId}&level=${level}`);
      if (!res.ok) {
        return { attempts: 0, bestScore: null, passed: false, averageTime: null };
      }
      return res.json();
    } catch (err) {
      console.error('Failed to fetch level stats:', err);
      return { attempts: 0, bestScore: null, passed: false, averageTime: null };
    }
  }, []);

  return {
    isReady,
    getQuestionsForLevel,
    getUserProgress,
    getOrCreateUserProgress: getUserProgress,
    getLevelHistory: async () => [],
    getUserHistory: async () => [],
    canTakeLevel: async () => true,
    getLevelStats,
    getQuestion: async () => null,
    getLevelDuration,
  };
}

/**
 * Hook to manage a test session via BFF
 */
export function useTestSession(userId: string | null) {
  const [session, setSession] = useState<TestSessionRecord | null>(null);
  const [questions, setQuestions] = useState<QuestionRecord[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  // Start a new test
  const startSession = useCallback(
    async (level: number) => {
      if (!userId) return null;
      setIsLoading(true);

      try {
        const sessionRes = await fetch('/api/bff/test/session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ level }),
        });

        if (sessionRes.ok) {
          const newSession = await sessionRes.json();
          setSession(newSession);

          const questionsRes = await fetch(`/api/bff/test/tests?level=${level}`);
          if (questionsRes.ok) {
            const levelQuestions = await questionsRes.json();
            setQuestions(levelQuestions);
          }

          setCurrentQuestionIndex(0);
          setAnswers({});
          setIsLoading(false);
          return newSession;
        }
      } catch (err) {
        console.error('Failed to start session:', err);
      }

      setIsLoading(false);
      return null;
    },
    [userId]
  );

  // Load an existing test
  const loadSession = useCallback(
    async (sessionId: string) => {
      setIsLoading(true);

      try {
        const res = await fetch(`/api/bff/test/session?sessionId=${sessionId}`);
        if (res.ok) {
          const data = await res.json();
          setSession(data);
          setAnswers(data.answers || {});

          const questionsRes = await fetch(`/api/bff/test/tests?level=${data.level}`);
          if (questionsRes.ok) {
            const levelQuestions = await questionsRes.json();
            setQuestions(levelQuestions);
          }

          setIsLoading(false);
          return data;
        }
      } catch (err) {
        console.error('Failed to load session:', err);
      }

      setIsLoading(false);
      return null;
    },
    []
  );

  // Submit an answer
  const submitAnswer = useCallback(
    async (questionId: string, answer: string) => {
      if (!session) return;

      try {
        await fetch('/api/bff/test/session', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sessionId: session.id,
            action: 'answer',
            questionId,
            answer,
          }),
        });

        setAnswers((prev) => ({ ...prev, [questionId]: answer }));
      } catch (err) {
        console.error('Failed to submit answer:', err);
      }
    },
    [session]
  );

  // Complete the test
  const completeSession = useCallback(async () => {
    if (!session) return null;

    try {
      const res = await fetch('/api/bff/test/session', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: session.id,
          action: 'complete',
        }),
      });

      if (res.ok) {
        const completedSession = await res.json();
        setSession(completedSession);
        return completedSession;
      }
    } catch (err) {
      console.error('Failed to complete session:', err);
    }

    return null;
  }, [session]);

  // Get session details (same as current session)
  const getSessionDetails = useCallback(() => session, [session]);

  // Check if expired
  const isExpired = useMemo(() => {
    if (!session?.expiresAt) return false;
    return new Date() > new Date(session.expiresAt);
  }, [session]);

  // Remaining time (seconds)
  const remainingTime = useMemo(() => {
    if (!session?.expiresAt) return 0;
    const now = new Date();
    const remaining = Math.max(0, new Date(session.expiresAt).getTime() - now.getTime());
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
    isReady: typeof window !== 'undefined',
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
 * Hook to get user's test progress via BFF
 */
export function useUserTestProgress(userId: string | null): UserTestProgressRecord | null {
  const [progress, setProgress] = useState<UserTestProgressRecord | null>(null);

  useEffect(() => {
    if (!userId) return;

    fetch(`/api/bff/test/progress?userId=${userId}`)
      .then(res => res.json())
      .then(data => setProgress(data))
      .catch(err => console.error('Failed to fetch progress:', err));
  }, [userId]);

  return progress;
}

/**
 * Hook to get level statistics via BFF
 */
export function useLevelStats(userId: string | null, level: number): LevelStats {
  const [stats, setStats] = useState<LevelStats>({
    attempts: 0,
    bestScore: null,
    passed: false,
    averageTime: null,
  });

  useEffect(() => {
    if (!userId) return;

    fetch(`/api/bff/test/progress?userId=${userId}&level=${level}`)
      .then(res => res.json())
      .then(data => setStats(data))
      .catch(err => console.error('Failed to fetch level stats:', err));
  }, [userId, level]);

  return stats;
}

/**
 * Hook to check if user has an active session via BFF
 */
export function useActiveTestSession(userId: string | null): TestSessionRecord | null {
  const [activeSession, setActiveSession] = useState<TestSessionRecord | null>(null);

  useEffect(() => {
    if (!userId) return;

    fetch(`/api/bff/test/session?userId=${userId}&active=true`)
      .then(res => res.json())
      .then(data => setActiveSession(data))
      .catch(err => console.error('Failed to fetch active session:', err));
  }, [userId]);

  return activeSession;
}

/**
 * Hook to get level configurations via BFF
 */
export function useLevelConfigs(): LevelConfig[] {
  const [configs, setConfigs] = useState<LevelConfig[]>([]);

  useEffect(() => {
    fetch('/api/bff/test/tests')
      .then(res => res.json())
      .then(data => setConfigs(data))
      .catch(err => console.error('Failed to fetch level configs:', err));
  }, []);

  return configs;
}
