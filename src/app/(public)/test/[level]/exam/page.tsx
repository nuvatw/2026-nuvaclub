'use client';

import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from '@/features/auth/components/AuthProvider';
import { useTestSession } from '@/lib/db/hooks';
import {
  TestTimer,
  TestProgressBar,
  QuestionNavigator,
  QuestionRenderer,
  TestNavigation,
  TestSubmitModal,
  TestResultSummary,
} from '@/features/test/components';
import { formatTime, getLevelDuration } from '@/features/test/constants';
import { PageTransition } from '@/components/molecules/PageTransition';
import { TestExamSkeleton } from '@/components/skeletons';

export default function ExamPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useAuth();

  const level = parseInt(params.level as string, 10);
  const sessionIdFromUrl = searchParams.get('session');

  const {
    session,
    questions,
    currentQuestion,
    currentQuestionIndex,
    answers,
    isLoading,
    remainingTime,
    answeredCount,
    totalQuestions,
    isReady,
    startSession,
    loadSession,
    submitAnswer,
    completeSession,
    goToQuestion,
    nextQuestion,
    prevQuestion,
  } = useTestSession(user?.id ?? null);

  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  // Initialize or load session
  useEffect(() => {
    if (!isReady || !user || session) return;

    if (sessionIdFromUrl) {
      loadSession(sessionIdFromUrl);
    } else {
      startSession(level);
    }
  }, [isReady, user, session, sessionIdFromUrl, level, loadSession, startSession]);

  // Auto-submit when time is up
  const handleTimeUp = useCallback(async () => {
    const result = await completeSession();
    if (result) {
      setIsCompleted(true);
    }
  }, [completeSession]);

  // Submit answer
  const handleAnswer = useCallback(
    (answer: string) => {
      if (!currentQuestion) return;
      submitAnswer(currentQuestion.id, answer);
    },
    [currentQuestion, submitAnswer]
  );

  // Confirm submit
  const handleConfirmSubmit = useCallback(async () => {
    setShowSubmitModal(false);
    const result = await completeSession();
    if (result) {
      setIsCompleted(true);
    }
  }, [completeSession]);

  // Retry
  const handleRetry = useCallback(() => {
    setIsCompleted(false);
    startSession(level);
  }, [level, startSession]);

  // Back to level list
  const handleBackToLevels = useCallback(() => {
    router.push('/test');
  }, [router]);

  // Review answer details
  const handleReviewAnswers = useCallback(() => {
    if (session) {
      router.push(`/test/results/${session.id}`);
    }
  }, [router, session]);

  // Question ID list
  const questionIds = useMemo(() => questions.map((q) => q.id), [questions]);

  // Answered question ID set
  const answeredQuestions = useMemo(() => new Set(Object.keys(answers)), [answers]);

  // Timer initial seconds
  const initialSeconds = useMemo(() => {
    if (session?.expiresAt) {
      const expiresDate = typeof session.expiresAt === 'string'
        ? new Date(session.expiresAt)
        : session.expiresAt;
      const remaining = Math.max(0, expiresDate.getTime() - Date.now());
      return Math.floor(remaining / 1000);
    }
    return getLevelDuration(level) * 60;
  }, [session, level]);

  // Loading state
  if (!isReady || isLoading || !session) {
    return <TestExamSkeleton />;
  }

  // Show results
  if (isCompleted && session.status === 'completed') {
    return (
      <div className="min-h-screen bg-neutral-950 py-8">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <TestResultSummary
            level={level}
            score={session.score ?? 0}
            maxScore={session.maxScore ?? 0}
            passed={session.passed ?? false}
            timeSpent={session.timeSpentSeconds ?? 0}
            passingScore={session.passingScore ?? 0}
            onRetry={handleRetry}
            onBackToLevels={handleBackToLevels}
            onReviewAnswers={handleReviewAnswers}
          />
        </div>
      </div>
    );
  }

  return (
    <PageTransition skeleton={<TestExamSkeleton />}>
      <div className="min-h-screen bg-neutral-950">
        {/* Top Navigation Bar */}
        <div className="sticky top-16 z-30 bg-neutral-900 border-b border-neutral-800">
          <div className="max-w-4xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <span className="text-lg font-bold text-primary-400">Level {level}</span>
                <TestTimer
                  initialSeconds={initialSeconds}
                  onTimeUp={handleTimeUp}
                />
              </div>
              <button
                onClick={() => setShowSubmitModal(true)}
                className="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors text-sm font-medium"
              >
                Submit Test
              </button>
            </div>
            <TestProgressBar
              current={currentQuestionIndex + 1}
              total={totalQuestions}
              answered={answeredCount}
              className="mt-4"
            />
          </div>
        </div>

        {/* Main Content Area */}
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Question Area */}
            <div className="lg:col-span-3">
              {currentQuestion && (
                <div className="bg-neutral-900 rounded-xl p-6 border border-neutral-800">
                  <QuestionRenderer
                    question={currentQuestion as any}
                    questionNumber={currentQuestionIndex + 1}
                    answer={answers[currentQuestion.id]}
                    onAnswer={handleAnswer}
                  />
                </div>
              )}

              {/* Bottom Navigation */}
              <TestNavigation
                currentIndex={currentQuestionIndex}
                totalQuestions={totalQuestions}
                onPrevious={prevQuestion}
                onNext={nextQuestion}
                onSubmit={() => setShowSubmitModal(true)}
                canSubmit={answeredCount > 0}
                className="mt-6"
              />
            </div>

            {/* Side Navigation */}
            <div className="lg:col-span-1">
              <div className="bg-neutral-900 rounded-xl p-4 border border-neutral-800 sticky top-40">
                <h3 className="text-sm font-medium text-neutral-400 mb-4">Question Navigator</h3>
                <QuestionNavigator
                  total={totalQuestions}
                  current={currentQuestionIndex}
                  answeredQuestions={answeredQuestions}
                  questionIds={questionIds}
                  onNavigate={goToQuestion}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Submit Confirmation Modal */}
        <TestSubmitModal
          isOpen={showSubmitModal}
          onClose={() => setShowSubmitModal(false)}
          onConfirm={handleConfirmSubmit}
          answeredCount={answeredCount}
          totalQuestions={totalQuestions}
          remainingTime={formatTime(remainingTime)}
        />
      </div>
    </PageTransition>
  );
}
