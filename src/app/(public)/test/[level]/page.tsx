'use client';

import { useParams, useRouter } from 'next/navigation';
import { useMemo } from 'react';
import { useAuth } from '@/features/auth/components/AuthProvider';
import { useLevelStats, useTests, useActiveTestSession, useUserTestProgress, useLevelConfigs } from '@/lib/db/hooks';
import { Button } from '@/components/atoms';
import {
  getLevelTier,
  getLevelColor,
  getLevelBgColor,
  formatDuration,
  LEVEL_CONFIGS,
  LEVEL_DETAILS,
  TOTAL_LEVELS,
} from '@/features/test/constants';
import { TestLevelProgressBar } from '@/features/test/components';
import type { LevelInfo, LevelStatus } from '@/features/test/types';
import { cn } from '@/lib/utils';
import { PageTransition } from '@/components/molecules/PageTransition';
import { TestLevelSkeleton } from '@/components/skeletons';

export default function LevelDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();

  const level = parseInt(params.level as string, 10);
  const { getQuestionsForLevel, canTakeLevel, getLevelStats } = useTests();
  const stats = useLevelStats(user?.id ?? null, level);
  const activeSession = useActiveTestSession(user?.id ?? null);
  const progress = useUserTestProgress(user?.id ?? null);
  const levelConfigs = useLevelConfigs();

  const questions = useMemo(() => getQuestionsForLevel(level), [getQuestionsForLevel, level]);
  const tier = getLevelTier(level);
  const config = LEVEL_CONFIGS[tier];
  const levelDetail = LEVEL_DETAILS[level];

  // Build levels array for progress bar
  const levels = useMemo<LevelInfo[]>(() => {
    const highestPassed = progress?.highestPassedLevel ?? 0;

    return Array.from({ length: TOTAL_LEVELS }, (_, i) => {
      const lvl = i + 1;
      const cfg = levelConfigs.find((c) => c.level === lvl);
      const lvlStats = user ? getLevelStats(user.id, lvl) : null;

      const status: LevelStatus = lvl <= highestPassed ? 'passed' : 'available';

      return {
        level: lvl,
        status,
        bestScore: lvlStats?.bestScore ?? null,
        attempts: lvlStats?.attempts ?? 0,
        durationMinutes: cfg?.durationMinutes ?? 5,
        questionTypes: cfg?.questionTypes ?? '',
        questionCount: cfg?.questionCount ?? 0,
        passed: lvlStats?.passed ?? false,
      };
    });
  }, [levelConfigs, progress, user, getLevelStats]);

  const canTake = user ? canTakeLevel(user.id, level) : false;

  // If there's an active exam, show continue option
  const hasActiveSession = activeSession && activeSession.level === level;

  const handleStartExam = () => {
    router.push(`/test/${level}/exam`);
  };

  const handleContinueExam = () => {
    if (activeSession) {
      router.push(`/test/${level}/exam?session=${activeSession.id}`);
    }
  };

  const handleSelectLevel = (selectedLevel: number) => {
    router.push(`/test/${selectedLevel}`);
  };

  if (!config || !levelDetail) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
        <p className="text-neutral-400">Invalid level</p>
      </div>
    );
  }

  return (
    <PageTransition skeleton={<TestLevelSkeleton />}>
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

          {/* Progress Bar */}
          <div className="mb-8">
            <TestLevelProgressBar
              levels={levels}
              onSelectLevel={handleSelectLevel}
              currentViewLevel={level}
            />
          </div>

          {/* Main Content */}
          <div className={cn('rounded-2xl p-8 border', getLevelBgColor(level))}>
            {/* Level Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-3 mb-2">
                <span className={cn('text-5xl font-bold', getLevelColor(level))}>
                  Level {level}
                </span>
              </div>
              <h1 className="text-2xl font-semibold text-white mb-2">{levelDetail.title}</h1>
              <p className="text-neutral-400">{levelDetail.description}</p>
            </div>

            {/* Test Info Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-neutral-800/50 rounded-xl p-4 text-center">
                <p className="text-2xl font-bold text-white">{questions.length}</p>
                <p className="text-sm text-neutral-400">Questions</p>
              </div>
              <div className="bg-neutral-800/50 rounded-xl p-4 text-center">
                <p className="text-2xl font-bold text-white">{formatDuration(config.durationMinutes)}</p>
                <p className="text-sm text-neutral-400">Time Limit</p>
              </div>
              <div className="bg-neutral-800/50 rounded-xl p-4 text-center">
                <p className="text-2xl font-bold text-white">60%</p>
                <p className="text-sm text-neutral-400">Pass Score</p>
              </div>
              <div className="bg-neutral-800/50 rounded-xl p-4 text-center">
                <p className="text-2xl font-bold text-white">{config.questionTypes.split('+')[0].trim()}</p>
                <p className="text-sm text-neutral-400">Question Type</p>
              </div>
            </div>

            {/* What You'll Be Tested On */}
            <div className="bg-neutral-800/50 rounded-xl p-6 mb-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
                What You&apos;ll Be Tested On
              </h3>
              <ul className="space-y-2">
                {levelDetail.whatYouWillLearn.map((item, index) => (
                  <li key={index} className="flex items-start gap-3 text-neutral-300">
                    <span className={cn('mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0', getLevelColor(level).replace('text-', 'bg-'))} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Topics & Skills */}
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              {/* Topics */}
              <div className="bg-neutral-800/50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                  Topics Covered
                </h3>
                <div className="flex flex-wrap gap-2">
                  {levelDetail.topics.map((topic, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-neutral-700/50 text-neutral-300 rounded-full text-sm"
                    >
                      {topic}
                    </span>
                  ))}
                </div>
              </div>

              {/* Skills */}
              <div className="bg-neutral-800/50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                  Skills Assessed
                </h3>
                <ul className="space-y-2">
                  {levelDetail.skills.map((skill, index) => (
                    <li key={index} className="flex items-center gap-2 text-neutral-300 text-sm">
                      <svg className="w-4 h-4 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      {skill}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* History */}
            {stats.attempts > 0 && (
              <div className="bg-neutral-800/50 rounded-xl p-6 mb-6">
                <h3 className="text-lg font-semibold text-white mb-4">Your Record</h3>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className={cn('text-2xl font-bold', stats.passed ? 'text-green-400' : 'text-neutral-300')}>
                      {stats.bestScore ?? '-'}
                    </p>
                    <p className="text-sm text-neutral-500">Best Score</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-neutral-300">{stats.attempts}</p>
                    <p className="text-sm text-neutral-500">Attempts</p>
                  </div>
                  <div>
                    <p className={cn('text-2xl font-bold', stats.passed ? 'text-green-400' : 'text-red-400')}>
                      {stats.passed ? 'Passed' : 'Not Passed'}
                    </p>
                    <p className="text-sm text-neutral-500">Status</p>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-3">
              {!canTake ? (
                <div className="text-center py-4">
                  <p className="text-neutral-400">Please log in to take the test</p>
                </div>
              ) : hasActiveSession ? (
                <>
                  <Button
                    variant="primary"
                    size="lg"
                    className="w-full"
                    onClick={handleContinueExam}
                  >
                    Continue Test
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full"
                    onClick={handleStartExam}
                  >
                    Start Over
                  </Button>
                </>
              ) : (
                <Button
                  variant="primary"
                  size="lg"
                  className="w-full"
                  onClick={handleStartExam}
                >
                  Start Test
                </Button>
              )}
            </div>

            {/* Notice */}
            <div className="mt-6 p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg">
              <p className="text-sm text-amber-400">
                <strong>Note:</strong> The timer will start once you begin the test. Please ensure you have enough time to complete it.
                Leaving the page will not pause the timer.
              </p>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
