'use client';

import { useRouter } from 'next/navigation';
import { useMemo, useState, useEffect } from 'react';
import { useAuth } from '@/features/auth/components/AuthProvider';
import { useLevelConfigs, useUserTestProgress, useTests, useLevelStats, useActiveTestSession } from '@/lib/db/hooks';
import { TestLevelProgressBar } from '@/features/test/components';
import { Button } from '@/components/atoms';
import { ClipboardIcon, TagIcon, LightBulbIcon, CheckIcon } from '@/components/icons';
import type { LevelInfo, LevelStatus } from '@/features/test/types';
import {
  TOTAL_LEVELS,
  LEVEL_DETAILS,
  LEVEL_CONFIGS,
  getLevelTier,
  getLevelColor,
  getLevelBgColor,
  formatDuration,
} from '@/features/test/constants';
import { cn } from '@/lib/utils';
import { PageTransition } from '@/components/molecules/PageTransition';
import { TestPageSkeleton } from '@/components/skeletons';

export default function TestPage() {
  const router = useRouter();
  const { user } = useAuth();
  const levelConfigs = useLevelConfigs();
  const progress = useUserTestProgress(user?.id ?? null);
  const { getLevelStats, getQuestionsForLevel } = useTests();

  // Selected level state - will auto-select next level on mount
  const [selectedLevel, setSelectedLevel] = useState<number | null>(null);

  // Auto-select next level based on progress
  useEffect(() => {
    const highestPassed = progress?.highestPassedLevel ?? 0;
    const nextLevel = Math.min(highestPassed + 1, TOTAL_LEVELS);
    setSelectedLevel(nextLevel);
  }, [progress]);

  const levels = useMemo<LevelInfo[]>(() => {
    const highestPassed = progress?.highestPassedLevel ?? 0;

    return Array.from({ length: TOTAL_LEVELS }, (_, i) => {
      const level = i + 1;
      const config = levelConfigs.find((c) => c.level === level);
      const stats = user ? getLevelStats(user.id, level) : null;

      // Users can freely choose any level - no locking
      const status: LevelStatus = level <= highestPassed ? 'passed' : 'available';

      return {
        level,
        status,
        bestScore: stats?.bestScore ?? null,
        attempts: stats?.attempts ?? 0,
        durationMinutes: config?.durationMinutes ?? 5,
        questionTypes: config?.questionTypes ?? '',
        questionCount: config?.questionCount ?? 0,
        passed: stats?.passed ?? false,
      };
    });
  }, [levelConfigs, progress, user, getLevelStats]);

  // Handle level selection from progress bar (inline display)
  const handleProgressBarSelect = (level: number) => {
    setSelectedLevel(level);
  };

  // Get selected level details
  const selectedLevelInfo = selectedLevel ? levels.find((l) => l.level === selectedLevel) : null;
  const selectedLevelDetail = selectedLevel ? LEVEL_DETAILS[selectedLevel] : null;
  const selectedTier = selectedLevel ? getLevelTier(selectedLevel) : null;
  const selectedConfig = selectedTier ? LEVEL_CONFIGS[selectedTier] : null;
  const selectedQuestions = selectedLevel ? getQuestionsForLevel(selectedLevel) : [];
  const selectedStats = useLevelStats(user?.id ?? null, selectedLevel ?? 1);
  const activeSession = useActiveTestSession(user?.id ?? null);
  const hasActiveSession = activeSession && activeSession.levelInfo?.level === selectedLevel;

  const handleStartExam = () => {
    if (selectedLevel) {
      router.push(`/test/${selectedLevel}/exam`);
    }
  };

  const handleContinueExam = () => {
    if (activeSession && selectedLevel) {
      router.push(`/test/${selectedLevel}/exam?session=${activeSession.id}`);
    }
  };

  return (
    <PageTransition skeleton={<TestPageSkeleton />}>
      <div className="min-h-screen bg-neutral-950 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Page Title */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">AI Skills Test</h1>
            <p className="text-neutral-400">
              Complete 12 levels of tests to verify your AI application skills
            </p>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <TestLevelProgressBar
              levels={levels}
              onSelectLevel={handleProgressBarSelect}
              currentViewLevel={selectedLevel ?? undefined}
            />
          </div>

          {/* Selected Level Details Section */}
          {selectedLevel && selectedLevelDetail && selectedConfig && (
            <div className={cn('rounded-2xl p-6 md:p-8 border mb-8', getLevelBgColor(selectedLevel))}>
              {/* Level Header */}
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 mb-6">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className={cn('text-4xl font-bold', getLevelColor(selectedLevel))}>
                      Level {selectedLevel}
                    </span>
                    {selectedLevelInfo?.passed && (
                      <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs font-medium rounded-full">
                        Passed
                      </span>
                    )}
                  </div>
                  <h2 className="text-xl font-semibold text-white mb-1">{selectedLevelDetail.title}</h2>
                  <p className="text-neutral-400">{selectedLevelDetail.description}</p>
                </div>

                {/* Quick Stats */}
                <div className="flex gap-4 md:gap-6">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-white">{selectedQuestions.length}</p>
                    <p className="text-xs text-neutral-400">Questions</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-white">{formatDuration(selectedConfig.durationMinutes)}</p>
                    <p className="text-xs text-neutral-400">Time</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-white">60%</p>
                    <p className="text-xs text-neutral-400">Pass</p>
                  </div>
                </div>
              </div>

              {/* Content Grid */}
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                {/* What You'll Be Tested On */}
                <div className="bg-neutral-800/50 rounded-xl p-5">
                  <h3 className="text-base font-semibold text-white mb-3 flex items-center gap-2">
                    <ClipboardIcon size="md" className="text-primary-400" />
                    What You&apos;ll Be Tested On
                  </h3>
                  <ul className="space-y-2">
                    {selectedLevelDetail.whatYouWillLearn.map((item, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-neutral-300">
                        <span className={cn('mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0', getLevelColor(selectedLevel).replace('text-', 'bg-'))} />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Topics & Skills */}
                <div className="space-y-4">
                  {/* Topics */}
                  <div className="bg-neutral-800/50 rounded-xl p-5">
                    <h3 className="text-base font-semibold text-white mb-3 flex items-center gap-2">
                      <TagIcon size="md" className="text-blue-400" />
                      Topics
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedLevelDetail.topics.map((topic, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-neutral-700/50 text-neutral-300 rounded-full text-xs"
                        >
                          {topic}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Skills */}
                  <div className="bg-neutral-800/50 rounded-xl p-5">
                    <h3 className="text-base font-semibold text-white mb-3 flex items-center gap-2">
                      <LightBulbIcon size="md" className="text-green-400" />
                      Skills Assessed
                    </h3>
                    <ul className="space-y-1">
                      {selectedLevelDetail.skills.map((skill, index) => (
                        <li key={index} className="flex items-center gap-2 text-xs text-neutral-300">
                          <CheckIcon size="sm" className="text-green-500 flex-shrink-0 w-3 h-3" />
                          {skill}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Your Record (if has attempts) */}
              {selectedStats.attempts > 0 && (
                <div className="bg-neutral-800/50 rounded-xl p-5 mb-6">
                  <h3 className="text-base font-semibold text-white mb-3">Your Record</h3>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className={cn('text-xl font-bold', selectedStats.passed ? 'text-green-400' : 'text-neutral-300')}>
                        {selectedStats.bestScore ?? '-'}
                      </p>
                      <p className="text-xs text-neutral-500">Best Score</p>
                    </div>
                    <div>
                      <p className="text-xl font-bold text-neutral-300">{selectedStats.attempts}</p>
                      <p className="text-xs text-neutral-500">Attempts</p>
                    </div>
                    <div>
                      <p className={cn('text-xl font-bold', selectedStats.passed ? 'text-green-400' : 'text-red-400')}>
                        {selectedStats.passed ? 'Passed' : 'Not Passed'}
                      </p>
                      <p className="text-xs text-neutral-500">Status</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                {!user ? (
                  <div className="text-center py-2 w-full">
                    <p className="text-neutral-400 text-sm">Please log in to take the test</p>
                  </div>
                ) : hasActiveSession ? (
                  <>
                    <Button
                      variant="primary"
                      size="lg"
                      className="flex-1"
                      onClick={handleContinueExam}
                    >
                      Continue Test
                    </Button>
                    <Button
                      variant="outline"
                      size="lg"
                      className="flex-1"
                      onClick={handleStartExam}
                    >
                      Start Over
                    </Button>
                  </>
                ) : (
                  <Button
                    variant="primary"
                    size="lg"
                    className="flex-1 sm:flex-none sm:min-w-[200px]"
                    onClick={handleStartExam}
                  >
                    Start Test
                  </Button>
                )}
              </div>

              {/* Notice */}
              <div className="mt-4 p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg">
                <p className="text-xs text-amber-400">
                  <strong>Note:</strong> The timer starts once you begin. Leaving the page will not pause the timer.
                </p>
              </div>
            </div>
          )}

        </div>
      </div>
    </PageTransition>
  );
}
