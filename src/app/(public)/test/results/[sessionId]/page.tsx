import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { QuestionRenderer } from '@/features/test/components';
import { Button, Badge } from '@/components/atoms';
import { ChevronLeftIcon, CheckIcon, XIcon, ExclamationCircleIcon } from '@/components/icons';
import { formatTime, getLevelColor } from '@/features/test/constants';
import { cn } from '@/lib/utils';
import { PageTransition } from '@/components/molecules/PageTransition';
import { TestResultsSkeleton } from '@/components/skeletons';

export default function ResultsPage() {
  const params = useParams();
  const router = useRouter();
  const [sessionData, setSessionData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const sessionId = params.sessionId as string;

  useEffect(() => {
    let mounted = true;
    fetch(`/api/bff/test/results/${sessionId}`)
      .then(res => res.json())
      .then(data => {
        if (mounted) {
          setSessionData(data);
          setIsLoading(false);
        }
      })
      .catch(err => {
        console.error('Failed to fetch test results', err);
        if (mounted) setIsLoading(false);
      });
    return () => { mounted = false; };
  }, [sessionId]);

  if (isLoading) {
    return <TestResultsSkeleton />;
  }

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
  const answerMap = new Map<string, any>(session.answers.map((a: any) => [a.questionId, a]));

  return (
    <PageTransition skeleton={<TestResultsSkeleton />}>
      <div className="min-h-screen bg-neutral-950 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <button
            onClick={() => router.push('/test')}
            className="flex items-center gap-2 text-neutral-400 hover:text-neutral-200 mb-6 transition-colors"
          >
            <ChevronLeftIcon size="md" />
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
                  <span className={cn('text-3xl font-bold', getLevelColor(session.levelInfo?.level ?? 1))}>
                    Level {session.levelInfo?.level ?? 1}
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

            {session.questions.map((question: any, index: number) => {
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
                          <CheckIcon size="md" />
                          <span className="text-sm font-medium">Correct</span>
                        </div>
                      )}
                      {isCorrect === false && (
                        <div className="flex items-center gap-2 text-red-400">
                          <XIcon size="md" />
                          <span className="text-sm font-medium">Incorrect</span>
                        </div>
                      )}
                      {isCorrect === undefined && (
                        <div className="flex items-center gap-2 text-amber-400">
                          <ExclamationCircleIcon size="md" />
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
                    onAnswer={() => { }}
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
              onClick={() => router.push(`/test/${session.levelInfo?.level ?? 1}`)}
            >
              Try Again
            </Button>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
