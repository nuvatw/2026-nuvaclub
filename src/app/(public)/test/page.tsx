'use client';

import { useRouter } from 'next/navigation';
import { useMemo, useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import { useAuth } from '@/features/auth/components/AuthProvider';
import { useLevelConfigs, useUserTestProgress, useTests, useLevelStats, useActiveTestSession } from '@/lib/db/hooks';
import {
  TrackSwitcher,
  NunuProgressBar,
  VavaProgressBar,
  NunuRequirementsPanel,
  ReportSection,
  CourseListCard,
  StatusTabs,
  LevelFilters,
  type TestTrack,
} from '@/features/test/components';
import { Button } from '@/components/atoms';
import { ClipboardIcon, TagIcon, LightBulbIcon, CheckIcon, BookOpenIcon, ChevronRightIcon } from '@/components/icons';
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
import {
  type NunuLevel,
  type NunuUserStats,
  getMockNunuUserStats,
} from '@/features/test/data/nunu-rules';
import { cn } from '@/lib/utils';
import { getCourseStatus } from '@/lib/utils/level';
import type { CourseStatus } from '@/lib/utils/level';
import { PageTransition } from '@/components/molecules/PageTransition';
import { TestPageSkeleton } from '@/components/skeletons';
import { getAllCourses, getNunuCourses, getVerifiedRequiredCourses, getCoursesByLevel } from '@/Database';
import { useProgress } from '@/features/shared/progress/useProgress';
import type { CourseLevel, Course } from '@/features/learn/types';

export default function TestPage() {
  const router = useRouter();
  const { user, currentAccountId } = useAuth();
  const levelConfigs = useLevelConfigs();
  const testProgress = useUserTestProgress(user?.id ?? null);
  const { getLevelStats, getQuestionsForLevel } = useTests();

  // Track selection state (Nunu / Vava)
  const [activeTrack, setActiveTrack] = useState<TestTrack>('nunu');

  // Nunu state
  const [selectedNunuLevel, setSelectedNunuLevel] = useState<NunuLevel | 'verified'>('Nx');
  const [nunuUserStats, setNunuUserStats] = useState<NunuUserStats | null>(null);

  // Vava state - selected level and course filter
  const [selectedVavaLevel, setSelectedVavaLevel] = useState<number>(1);
  const [vavaStatusFilter, setVavaStatusFilter] = useState<'all' | CourseStatus>('all');

  // Get course progress for current user
  const { getItemProgress, getCompletedItems, getItemsInProgress } = useProgress('learn', currentAccountId);

  // Initialize user stats on mount (mock data for demo)
  useEffect(() => {
    if (user) {
      // In production, fetch real stats from API
      setNunuUserStats(getMockNunuUserStats());
    } else {
      setNunuUserStats(null);
    }
  }, [user]);

  // Set Vava level based on test progress
  useEffect(() => {
    const highestPassed = testProgress?.highestPassedLevel ?? 0;
    const nextLevel = Math.min(highestPassed + 1, TOTAL_LEVELS);
    setSelectedVavaLevel(nextLevel);
  }, [testProgress]);

  // Build levels info for Vava progress bar
  const vavaLevels = useMemo<LevelInfo[]>(() => {
    const highestPassed = testProgress?.highestPassedLevel ?? 0;

    return Array.from({ length: TOTAL_LEVELS }, (_, i) => {
      const level = i + 1;
      const config = levelConfigs.find((c) => c.level === level);
      const stats = user ? getLevelStats(user.id, level) : null;

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
  }, [levelConfigs, testProgress, user, getLevelStats]);

  // Get courses for the selected Vava level with status
  const vavaCoursesWithStatus = useMemo(() => {
    // Get courses for the selected level (1-10 maps to CourseLevel)
    const levelCourses = selectedVavaLevel <= 10
      ? getCoursesByLevel(selectedVavaLevel as CourseLevel)
      : getAllCourses().filter(c => c.level >= 9); // Levels 11-12 show advanced courses

    return levelCourses.map((course) => {
      const progress = getItemProgress(course.id, currentAccountId);
      const status = getCourseStatus(progress?.progressPercent);
      return { course, status };
    });
  }, [selectedVavaLevel, getItemProgress, currentAccountId]);

  // Filter Vava courses by status
  const filteredVavaCourses = useMemo(() => {
    if (vavaStatusFilter === 'all') {
      return vavaCoursesWithStatus;
    }
    return vavaCoursesWithStatus.filter(({ status }) => status === vavaStatusFilter);
  }, [vavaCoursesWithStatus, vavaStatusFilter]);

  // Count courses by status for Vava tabs
  const vavaStatusCounts = useMemo(() => {
    return {
      all: vavaCoursesWithStatus.length,
      not_started: vavaCoursesWithStatus.filter(({ status }) => status === 'not_started').length,
      ongoing: vavaCoursesWithStatus.filter(({ status }) => status === 'ongoing').length,
      completed: vavaCoursesWithStatus.filter(({ status }) => status === 'completed').length,
    };
  }, [vavaCoursesWithStatus]);

  // Get Nunu courses with status (for N-5 to N-1 - same courses)
  const nunuCoursesWithStatus = useMemo(() => {
    const nunuCourses = getNunuCourses();
    return nunuCourses.map((course) => {
      const progress = getItemProgress(course.id, currentAccountId);
      const status = getCourseStatus(progress?.progressPercent);
      return { course, status };
    });
  }, [getItemProgress, currentAccountId]);

  // Get Verified Required courses with status
  const verifiedCoursesWithStatus = useMemo(() => {
    const verifiedCourses = getVerifiedRequiredCourses();
    return verifiedCourses.map((course) => {
      const progress = getItemProgress(course.id, currentAccountId);
      const status = getCourseStatus(progress?.progressPercent);
      return { course, status };
    });
  }, [getItemProgress, currentAccountId]);

  // Vava level details for display
  const selectedVavaLevelDetail = LEVEL_DETAILS[selectedVavaLevel];
  const selectedVavaTier = getLevelTier(selectedVavaLevel);
  const selectedVavaConfig = LEVEL_CONFIGS[selectedVavaTier];
  const selectedVavaQuestions = getQuestionsForLevel(selectedVavaLevel);
  const selectedVavaStats = useLevelStats(user?.id ?? null, selectedVavaLevel);
  const activeSession = useActiveTestSession(user?.id ?? null);
  const hasActiveSession = activeSession && activeSession.levelInfo?.level === selectedVavaLevel;

  const handleStartVavaExam = () => {
    router.push(`/test/${selectedVavaLevel}/exam`);
  };

  const handleContinueExam = () => {
    if (activeSession) {
      router.push(`/test/${selectedVavaLevel}/exam?session=${activeSession.id}`);
    }
  };

  const handleStartNunuExam = () => {
    // TODO: Route to Nunu exam page
    console.log('Start Nunu exam for level:', selectedNunuLevel);
  };

  return (
    <PageTransition skeleton={<TestPageSkeleton />}>
      <div className="min-h-screen bg-neutral-950 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Page Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Certification & Progress</h1>
            <p className="text-neutral-400">
              Track your learning journey as a Vava or advance your mentorship as a Nunu.
            </p>
          </div>

          {/* Track Switcher (Shop-style pills with icons) */}
          <div className="mb-8">
            <TrackSwitcher
              activeTrack={activeTrack}
              onTrackChange={setActiveTrack}
            />
          </div>

          {/* NUNU TRACK CONTENT */}
          {activeTrack === 'nunu' && (
            <div className="space-y-8">
              {/* Nunu Progress Bar */}
              <NunuProgressBar
                currentLevel={nunuUserStats?.currentNunuLevel ?? null}
                isVerified={nunuUserStats?.isVerified ?? false}
                selectedLevel={selectedNunuLevel}
                onSelectLevel={setSelectedNunuLevel}
              />

              {/* Requirements Panel for Selected Level */}
              <NunuRequirementsPanel
                selectedLevel={selectedNunuLevel}
                userStats={nunuUserStats}
                onStartExam={handleStartNunuExam}
              />

              {/* Courses Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.3 }}
                className="rounded-2xl p-6 md:p-8 border border-neutral-800 bg-neutral-900/50"
              >
                <div className="flex items-center gap-2 mb-4">
                  <BookOpenIcon size="md" className="text-purple-400" />
                  <h3 className="text-lg font-semibold text-white">
                    {selectedNunuLevel === 'verified'
                      ? 'Verified Required Courses'
                      : 'Nunu Training Courses'}
                  </h3>
                  <span className="text-sm text-neutral-500">
                    ({selectedNunuLevel === 'verified'
                      ? verifiedCoursesWithStatus.length
                      : nunuCoursesWithStatus.length} courses)
                  </span>
                </div>
                <p className="text-sm text-neutral-400 mb-4">
                  {selectedNunuLevel === 'verified'
                    ? 'Complete all 5 courses below to unlock the Verified Nunu exam.'
                    : 'These courses prepare you for Nunu certification. The same courses apply to all N-levels (N-5 through N-1).'}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {(selectedNunuLevel === 'verified'
                    ? verifiedCoursesWithStatus
                    : nunuCoursesWithStatus
                  ).map(({ course, status }) => (
                    <CourseListCard key={course.id} course={course} status={status} />
                  ))}
                </div>

                {/* Link to Learn page */}
                <div className="mt-4 pt-4 border-t border-neutral-800">
                  <Link
                    href="/learn"
                    className="text-sm text-purple-400 hover:text-purple-300 transition-colors flex items-center gap-1"
                  >
                    View all courses in Learn
                    <ChevronRightIcon size="sm" />
                  </Link>
                </div>
              </motion.div>
            </div>
          )}

          {/* VAVA TRACK CONTENT */}
          {activeTrack === 'vava' && (
            <>
              {/* Progress Bar */}
              <div className="mb-8">
                <VavaProgressBar
                  currentLevel={testProgress?.highestPassedLevel ?? 0}
                  selectedLevel={selectedVavaLevel}
                  onSelectLevel={setSelectedVavaLevel}
                />
              </div>

              {/* Selected Level Details Section */}
              {selectedVavaLevel && selectedVavaLevelDetail && selectedVavaConfig && (
                <div className={cn('rounded-2xl p-6 md:p-8 border mb-8', getLevelBgColor(selectedVavaLevel))}>
                  {/* Level Header */}
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 mb-6">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <span className={cn('text-4xl font-bold', getLevelColor(selectedVavaLevel))}>
                          Level {selectedVavaLevel}
                        </span>
                        {vavaLevels[selectedVavaLevel - 1]?.passed && (
                          <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs font-medium rounded-full">
                            Passed
                          </span>
                        )}
                      </div>
                      <h2 className="text-xl font-semibold text-white mb-1">{selectedVavaLevelDetail.title}</h2>
                      <p className="text-neutral-400">{selectedVavaLevelDetail.description}</p>
                    </div>

                    {/* Quick Stats */}
                    <div className="flex gap-4 md:gap-6">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-white">{selectedVavaQuestions.length}</p>
                        <p className="text-xs text-neutral-400">Questions</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-white">{formatDuration(selectedVavaConfig.durationMinutes)}</p>
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
                        {selectedVavaLevelDetail.whatYouWillLearn.map((item, index) => (
                          <li key={index} className="flex items-start gap-2 text-sm text-neutral-300">
                            <span className={cn('mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0', getLevelColor(selectedVavaLevel).replace('text-', 'bg-'))} />
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
                          {selectedVavaLevelDetail.topics.map((topic, index) => (
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
                          {selectedVavaLevelDetail.skills.map((skill, index) => (
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
                  {selectedVavaStats.attempts > 0 && (
                    <div className="bg-neutral-800/50 rounded-xl p-5 mb-6">
                      <h3 className="text-base font-semibold text-white mb-3">Your Record</h3>
                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                          <p className={cn('text-xl font-bold', selectedVavaStats.passed ? 'text-green-400' : 'text-neutral-300')}>
                            {selectedVavaStats.bestScore ?? '-'}
                          </p>
                          <p className="text-xs text-neutral-500">Best Score</p>
                        </div>
                        <div>
                          <p className="text-xl font-bold text-neutral-300">{selectedVavaStats.attempts}</p>
                          <p className="text-xs text-neutral-500">Attempts</p>
                        </div>
                        <div>
                          <p className={cn('text-xl font-bold', selectedVavaStats.passed ? 'text-green-400' : 'text-red-400')}>
                            {selectedVavaStats.passed ? 'Passed' : 'Not Passed'}
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
                          onClick={handleStartVavaExam}
                        >
                          Start Over
                        </Button>
                      </>
                    ) : (
                      <Button
                        variant="primary"
                        size="lg"
                        className="flex-1 sm:flex-none sm:min-w-[200px]"
                        onClick={handleStartVavaExam}
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

              {/* Course Status & Level Filter Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.3 }}
                className="rounded-2xl p-6 md:p-8 border border-neutral-800 bg-neutral-900/50"
              >
                <div className="flex items-center gap-2 mb-6">
                  <BookOpenIcon size="md" className="text-blue-400" />
                  <h3 className="text-lg font-semibold text-white">
                    Level {selectedVavaLevel} Courses
                  </h3>
                  <span className="text-sm text-neutral-500">
                    ({vavaCoursesWithStatus.length} courses)
                  </span>
                </div>

                {/* Status Tabs */}
                <div className="mb-6">
                  <StatusTabs
                    value={vavaStatusFilter}
                    onChange={setVavaStatusFilter}
                    counts={vavaStatusCounts}
                  />
                </div>

                {/* Course List */}
                {filteredVavaCourses.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {filteredVavaCourses.slice(0, 12).map(({ course, status }) => (
                      <CourseListCard key={course.id} course={course} status={status} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="w-12 h-12 rounded-full bg-neutral-800 flex items-center justify-center mx-auto mb-3">
                      <BookOpenIcon size="lg" className="text-neutral-500" />
                    </div>
                    <p className="text-neutral-300 font-medium">No courses match this filter</p>
                    <p className="text-sm text-neutral-500 mt-1">
                      Try selecting a different status filter above.
                    </p>
                  </div>
                )}

                {/* View All Link */}
                {filteredVavaCourses.length > 12 && (
                  <div className="mt-4 pt-4 border-t border-neutral-800">
                    <Link
                      href="/learn"
                      className="text-sm text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1"
                    >
                      View all {filteredVavaCourses.length} courses
                      <ChevronRightIcon size="sm" />
                    </Link>
                  </div>
                )}
              </motion.div>
            </>
          )}

          {/* REPORT TRACK CONTENT */}
          {activeTrack === 'report' && (
            <ReportSection userId={user?.id ?? null} />
          )}
        </div>
      </div>
    </PageTransition>
  );
}
