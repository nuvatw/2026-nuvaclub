'use client';

import { useParams, useRouter } from 'next/navigation';
import { useMemo } from 'react';
import { useDB } from '@/lib/db/provider/DBProvider';
import { TestRepository } from '@/lib/db/repositories';
import { QuestionRenderer } from '@/features/test/components';
import { Button, Badge } from '@/components/atoms';
import { formatTime, getLevelColor } from '@/features/test/constants';
import { cn } from '@/lib/utils';
import { PageTransition } from '@/components/molecules/PageTransition';
import { TestResultsSkeleton } from '@/components/skeletons';

export default function ResultsPage() {
  const params = useParams();
  const router = useRouter();
  const db = useDB();

  const sessionId = params.sessionId as string;

  const sessionData = useMemo(() => {
    if (!db) return null;
    const repo = new TestRepository(db);
    return repo.getSessionWithDetails(sessionId);
  }, [db, sessionId]);

  if (!sessionData) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
        <div className="text-center">
          <p className="text-neutral-400 mb-4">Test record not found</p>
          <Button onClick={() => router.push('/test')}>Back to Level List</Button>
        </div>
      </div>
    );
  }

  const { questions, answers, ...session } = sessionData;
  const percentage = session.maxScore > 0 ? Math.round((session.score ?? 0) / session.maxScore * 100) : 0;

  // Build answer lookup map
  const answerMap = new Map(answers.map((a) => [a.questionId, a]));

  return (
    <PageTransition skeleton={<TestResultsSkeleton />}>
    <div className="min-h-screen bg-neutral-950 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button
          onClick={() => router.push('/test')}
          className="flex items-center gap-2 text-neutral-400 hover:text-neutral-200 mb-6 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Level List
        </button>

        {/* Result Summary */}
        <div className={cn(
          'rounded-2xl p-8 mb-8 border',
          session.passed ? 'bg-green-500/10 border-green-500/30' : 'bg-red-500/10 border-red-500/30'
        )}>
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <div className="flex items-center gap-3 mb-2">
                <span className={cn('text-3xl font-bold', getLevelColor(session.level))}>
                  Level {session.level}
                </span>
                <Badge variant={session.passed ? 'success' : 'error'}>
                  {session.passed ? 'Passed' : 'Failed'}
                </Badge>
              </div>
              <p className="text-neutral-400">
                {session.completedAt ? new Date(session.completedAt).toLocaleString('en-US') : ''}
              </p>
            </div>

            <div className="flex gap-8 text-center">
              <div>
                <p className={cn('text-4xl font-bold', session.passed ? 'text-green-400' : 'text-red-400')}>
                  {session.score ?? 0}
                </p>
                <p className="text-sm text-neutral-500">Score / {session.maxScore}</p>
              </div>
              <div>
                <p className="text-4xl font-bold text-neutral-300">{percentage}%</p>
                <p className="text-sm text-neutral-500">Percentage</p>
              </div>
              <div>
                <p className="text-4xl font-bold text-neutral-300">
                  {formatTime(session.timeSpentSeconds ?? 0)}
                </p>
                <p className="text-sm text-neutral-500">Time Spent</p>
              </div>
            </div>
          </div>
        </div>

        {/* Answer Details */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-white">Answer Details</h2>

          {questions.map((question, index) => {
            const answer = answerMap.get(question.id);
            const isCorrect = answer?.isCorrect;
            const userAnswer = answer?.answer ?? '';

            return (
              <div
                key={question.id}
                className={cn(
                  'bg-neutral-900 rounded-xl p-6 border',
                  isCorrect === true && 'border-green-500/30',
                  isCorrect === false && 'border-red-500/30',
                  isCorrect === undefined && 'border-neutral-800'
                )}
              >
                {/* Question Result Mark */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    {isCorrect === true && (
                      <div className="flex items-center gap-2 text-green-400">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                        </svg>
                        <span className="text-sm font-medium">Correct</span>
                      </div>
                    )}
                    {isCorrect === false && (
                      <div className="flex items-center gap-2 text-red-400">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        <span className="text-sm font-medium">Incorrect</span>
                      </div>
                    )}
                    {isCorrect === undefined && (
                      <div className="flex items-center gap-2 text-amber-400">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-sm font-medium">Pending Review</span>
                      </div>
                    )}
                  </div>
                  {answer?.score !== undefined && (
                    <span className="text-sm text-neutral-400">
                      Score: {answer.score} / {question.points}
                    </span>
                  )}
                </div>

                {/* Question Content */}
                <QuestionRenderer
                  question={question}
                  questionNumber={index + 1}
                  answer={userAnswer}
                  onAnswer={() => {}}
                  showResult={true}
                  disabled={true}
                />
              </div>
            );
          })}
        </div>

        {/* Bottom Actions */}
        <div className="mt-8 flex gap-4 justify-center">
          <Button
            variant="outline"
            onClick={() => router.push('/test')}
          >
            Back to Level List
          </Button>
          <Button
            variant="primary"
            onClick={() => router.push(`/test/${session.level}`)}
          >
            Try Again
          </Button>
        </div>
      </div>
    </div>
    </PageTransition>
  );
}
