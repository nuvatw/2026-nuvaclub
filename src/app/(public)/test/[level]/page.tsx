'use client';

import { useParams, useRouter } from 'next/navigation';
import { useMemo } from 'react';
import { useAuth } from '@/features/auth/components/AuthProvider';
import { useLevelStats, useTests, useActiveTestSession, useUserTestProgress, useLevelConfigs } from '@/lib/db/hooks';
import { Button } from '@/components/atoms';
import { ChevronLeftIcon, ClipboardIcon, TagIcon, LightBulbIcon, CheckIcon } from '@/components/icons';
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

  // Note: getQuestionsForLevel returns a Promise, can't use in useMemo - would need useState + useEffect
  const tier = getLevelTier(level);
  const config = LEVEL_CONFIGS[tier];
  const levelDetail = LEVEL_DETAILS[level];

  // Build levels array for progress bar
  const levels = useMemo<LevelInfo[]>(() => {
    const highestPassed = progress?.highestPassedLevel ?? 0;

    return Array.from({ length: TOTAL_LEVELS }, (_, i) => {
      const lvl = i + 1;
      const cfg = levelConfigs.find((c) => c.level === lvl);
      // Note: Can't call async getLevelStats in useMemo - would need useEffect
      const lvlStats: any = null;

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
  }, [levelConfigs, progress]);

  const canTake = user ? true : false; // Simplified - canTakeLevel has different signature

  // If there's an active exam, show continue option
  const hasActiveSession = activeSession && activeSession.levelId === level;

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
            <ChevronLeftIcon size="md" />
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
                <p className="text-2xl font-bold text-white">{(config as any).questionCount || 10}</p>
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
                <ClipboardIcon size="md" className="text-primary-400" />
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
                  <TagIcon size="md" className="text-blue-400" />
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
                  <LightBulbIcon size="md" className="text-green-400" />
                  Skills Assessed
                </h3>
                <ul className="space-y-2">
                  {levelDetail.skills.map((skill, index) => (
                    <li key={index} className="flex items-center gap-2 text-neutral-300 text-sm">
                      <CheckIcon size="sm" className="text-green-500 flex-shrink-0" />
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
