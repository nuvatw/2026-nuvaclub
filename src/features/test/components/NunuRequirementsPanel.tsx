'use client';

import { useMemo } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/atoms';
import {
  CheckCircleIcon,
  XCircleIcon,
  InformationCircleIcon,
  SparklesIcon,
  ClockIcon,
  BookOpenIcon,
  TrendingUpIcon,
} from '@/components/icons';
import {
  NUNU_LEVEL_CONFIGS,
  NUNU_APPLICATION_REQUIREMENTS,
  NUNU_LEVEL_PROGRESSION,
  SPRINT_SPECIAL_MONTHS,
  MISSION_STREAK_REQUIRED,
  calculateEligibility,
  calculateMissionProgress,
  checkVerifiedEligibility,
  formatDiscount,
  getNunuLevelColor,
  getNunuLevelBgColor,
  type NunuLevel,
  type NunuUserStats,
} from '../data/nunu-rules';

interface NunuRequirementsPanelProps {
  /** The level being viewed */
  selectedLevel: NunuLevel | 'verified';
  /** User stats (null if not logged in) */
  userStats: NunuUserStats | null;
  /** Callback when user clicks Start Exam */
  onStartExam?: () => void;
}

/**
 * Panel showing Monthly Missions and Application Requirements for Nunu levels
 */
export function NunuRequirementsPanel({
  selectedLevel,
  userStats,
  onStartExam,
}: NunuRequirementsPanelProps) {
  // For verified, show verified-specific content
  if (selectedLevel === 'verified') {
    return (
      <VerifiedPanel userStats={userStats} onStartExam={onStartExam} />
    );
  }

  // Regular level content
  return (
    <LevelPanel
      level={selectedLevel}
      userStats={userStats}
      onStartExam={onStartExam}
    />
  );
}

// ==================== LEVEL PANEL ====================

function LevelPanel({
  level,
  userStats,
  onStartExam,
}: {
  level: NunuLevel;
  userStats: NunuUserStats | null;
  onStartExam?: () => void;
}) {
  const levelConfig = NUNU_LEVEL_CONFIGS[level];
  // Application requirements for THIS level (not next level)
  const appReqs = NUNU_APPLICATION_REQUIREMENTS[level];

  // Calculate eligibility for next level if user is logged in
  const eligibility = useMemo(() => {
    if (!userStats) return null;
    // Only calculate if this is the current level or the next level user would apply for
    const targetLevel = userStats.currentNunuLevel
      ? NUNU_LEVEL_PROGRESSION[userStats.currentNunuLevel]
      : 'Nx';
    if (targetLevel === level || userStats.currentNunuLevel === level) {
      return calculateEligibility(userStats);
    }
    return null;
  }, [userStats, level]);

  // Calculate monthly mission progress
  const missionProgress = useMemo(() => {
    if (!userStats) return null;
    // Show mission progress for the user's current level
    if (userStats.currentNunuLevel === level) {
      return calculateMissionProgress(userStats, level);
    }
    return null;
  }, [userStats, level]);

  const isCurrentLevel = userStats?.currentNunuLevel === level;
  const isPastLevel =
    userStats?.currentNunuLevel &&
    compareLevels(userStats.currentNunuLevel, level) > 0;

  return (
    <div className={cn('rounded-2xl p-6 md:p-8 border', getNunuLevelBgColor(level))}>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className={cn('text-3xl font-bold', getNunuLevelColor(level))}>
              {level}
            </span>
            {isCurrentLevel && (
              <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs font-medium rounded-full">
                Current Level
              </span>
            )}
            {isPastLevel && (
              <span className="px-2 py-1 bg-neutral-500/20 text-neutral-400 text-xs font-medium rounded-full">
                Completed
              </span>
            )}
          </div>
          <h2 className="text-xl font-semibold text-white mb-1">
            {getLevelTitle(level)}
          </h2>
          <p className="text-neutral-400">{getLevelDescription(level)}</p>
        </div>
      </div>

      {/* 1. Application Requirements Section (for THIS level) */}
      {appReqs && (
        <div className="bg-neutral-800/50 rounded-xl p-5 mb-6">
          <h3 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
            <TrendingUpIcon size="md" className="text-purple-400" />
            Application Requirements for {level}
          </h3>
          <p className="text-sm text-neutral-400 mb-4">
            Eligibility gates to apply for {level}. Meet these to unlock the certification exam.
          </p>
          <ApplicationRequirementsTable
            requirements={appReqs}
            userStats={userStats}
          />
        </div>
      )}

      {/* 2. Monthly Missions Section */}
      <div className="bg-neutral-800/50 rounded-xl p-5 mb-6">
        <h3 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
          <ClockIcon size="md" className="text-blue-400" />
          Monthly Missions for {level}
        </h3>
        <p className="text-sm text-neutral-400 mb-4">
          Tasks you must complete each month while at this level.
        </p>
        <MonthlyMissionsTable
          missions={levelConfig.monthlyMissions}
          userStats={userStats}
          missionProgress={missionProgress}
        />
      </div>

      {/* 3. Benefits Section */}
      <div className="bg-neutral-800/50 rounded-xl p-5 mb-6">
        <h3 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
          <SparklesIcon size="md" className="text-amber-400" />
          Benefits at {level}
        </h3>
        <BenefitsGrid config={levelConfig} />
      </div>

      {/* Sprint Mission Info */}
      <div className="bg-neutral-800/50 rounded-xl p-5 mb-6">
        <h3 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
          <InformationCircleIcon size="md" className="text-neutral-400" />
          Sprint Mission Requirements
        </h3>
        <div className="text-sm text-neutral-300 space-y-2">
          <p>
            <strong>Special Months:</strong>{' '}
            {SPRINT_SPECIAL_MONTHS.map((m) => getMonthName(m)).join(', ')}
          </p>
          <p>
            <strong>Mission:</strong> Upload a project in Sprint during special months.
          </p>
          <p>
            <strong>Advancement:</strong> Complete missions for{' '}
            <span className="text-purple-400 font-semibold">
              {MISSION_STREAK_REQUIRED} consecutive months
            </span>{' '}
            to apply for the next level.
          </p>
        </div>
      </div>

      {/* Eligibility Check (if logged in) */}
      {eligibility && appReqs && (
        <EligibilityPanel eligibility={eligibility} level={level} />
      )}

      {/* Not logged in message */}
      {!userStats && (
        <div className="bg-neutral-800/50 rounded-xl p-5 mb-6">
          <p className="text-neutral-400 text-center">
            Log in to see your progress and eligibility status.
          </p>
        </div>
      )}

      {/* Action Button */}
      {onStartExam && userStats && (
        <div className="flex gap-3">
          <Button
            variant="primary"
            size="lg"
            className="flex-1 sm:flex-none sm:min-w-[200px]"
            onClick={onStartExam}
            disabled={eligibility ? !eligibility.eligible : false}
          >
            {eligibility?.eligible ? 'Start Exam' : 'Requirements Not Met'}
          </Button>
        </div>
      )}
    </div>
  );
}

// ==================== VERIFIED PANEL ====================

function VerifiedPanel({
  userStats,
  onStartExam,
}: {
  userStats: NunuUserStats | null;
  onStartExam?: () => void;
}) {
  const verifiedStatus = useMemo(() => {
    if (!userStats) return null;
    return checkVerifiedEligibility(userStats);
  }, [userStats]);

  return (
    <div className="rounded-2xl p-6 md:p-8 border bg-amber-500/10 border-amber-500/30">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <SparklesIcon size="lg" className="text-amber-400" />
            <span className="text-3xl font-bold text-amber-400">Verified</span>
            {userStats?.isVerified && (
              <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs font-medium rounded-full">
                Achieved
              </span>
            )}
          </div>
          <h2 className="text-xl font-semibold text-white mb-1">
            Verified Nunu Certification
          </h2>
          <p className="text-neutral-400">
            An additional certification demonstrating expertise. Can be combined with any N-level
            (e.g., N-4 Verified, N-1 Verified).
          </p>
        </div>
      </div>

      {/* Verified Course Requirements */}
      <div className="bg-neutral-800/50 rounded-xl p-5 mb-6">
        <h3 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
          <BookOpenIcon size="md" className="text-amber-400" />
          Verification Requirements
        </h3>
        <p className="text-sm text-neutral-400 mb-4">
          Complete all required Verified courses to unlock the Verified exam. This is separate from
          N-level monthly missions and application requirements.
        </p>
        <div className="text-sm text-neutral-300 space-y-2">
          <p><strong>Requirement:</strong> Complete all 5 Verified Required courses in the Nunu Training series:</p>
          <ol className="list-decimal list-inside space-y-1 text-neutral-400 ml-2">
            <li>Mentorship Fundamentals</li>
            <li>Teaching AI Effectively</li>
            <li>Nunu Ethics &amp; Standards</li>
            <li>Building Vava Success</li>
            <li>Advanced Nunu Practices</li>
          </ol>
        </div>
        {verifiedStatus && (
          <div className="mt-4 flex items-center gap-2">
            {verifiedStatus.coursesCompleted >= verifiedStatus.coursesRequired ? (
              <CheckCircleIcon size="md" className="text-green-400" />
            ) : (
              <XCircleIcon size="md" className="text-red-400" />
            )}
            <span className={cn(
              'text-sm font-medium',
              verifiedStatus.coursesCompleted >= verifiedStatus.coursesRequired
                ? 'text-green-400'
                : 'text-red-400'
            )}>
              {verifiedStatus.coursesCompleted}/{verifiedStatus.coursesRequired} courses completed
            </span>
          </div>
        )}
      </div>

      {/* Exam Info */}
      <div className="bg-neutral-800/50 rounded-xl p-5 mb-6">
        <h3 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
          <InformationCircleIcon size="md" className="text-neutral-400" />
          Exam Details
        </h3>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-xl font-bold text-white">50</p>
            <p className="text-xs text-neutral-400">Questions</p>
          </div>
          <div>
            <p className="text-xl font-bold text-white">60 min</p>
            <p className="text-xs text-neutral-400">Duration</p>
          </div>
          <div>
            <p className="text-xl font-bold text-white">75%</p>
            <p className="text-xs text-neutral-400">Pass Score</p>
          </div>
        </div>
      </div>

      {/* Not logged in message */}
      {!userStats && (
        <div className="bg-neutral-800/50 rounded-xl p-5 mb-6">
          <p className="text-neutral-400 text-center">
            Log in to track your progress toward Verified certification.
          </p>
        </div>
      )}

      {/* Action Button */}
      {onStartExam && userStats && (
        <div className="flex gap-3">
          <Button
            variant="primary"
            size="lg"
            className="flex-1 sm:flex-none sm:min-w-[200px]"
            onClick={onStartExam}
            disabled={!verifiedStatus?.eligible}
          >
            {verifiedStatus?.eligible ? 'Start Verified Exam' : 'Complete Required Courses First'}
          </Button>
        </div>
      )}
    </div>
  );
}

// ==================== SUB-COMPONENTS ====================

/**
 * Table showing monthly missions with "Per Month" column header
 */
function MonthlyMissionsTable({
  missions,
  userStats,
  missionProgress,
}: {
  missions: {
    coursesPerMonth: number;
    forumPostsPerMonth: number;
    forumCommentsPerMonth: number;
    mentoredActiveMin: number;
    mentoredActiveMax: number;
  };
  userStats: NunuUserStats | null;
  missionProgress: ReturnType<typeof calculateMissionProgress> | null;
}) {
  const rows = [
    {
      key: 'courses',
      label: 'Courses completed',
      target: missions.coursesPerMonth,
      current: userStats?.coursesCompletedThisMonth,
      tooltip: null,
    },
    {
      key: 'forumPosts',
      label: 'Forum posts',
      target: missions.forumPostsPerMonth,
      current: userStats?.forumPostsThisMonth,
      tooltip: null,
    },
    {
      key: 'forumComments',
      label: 'Forum comments',
      target: missions.forumCommentsPerMonth,
      current: userStats?.forumCommentsThisMonth,
      tooltip: null,
    },
    {
      key: 'mentoredMin',
      label: 'Active mentees (min)',
      target: missions.mentoredActiveMin,
      current: userStats?.activeMenteesCount,
      tooltip: 'Minimum number of active mentees you must be mentoring each month',
    },
    {
      key: 'mentoredMax',
      label: 'Active mentees (max)',
      target: missions.mentoredActiveMax,
      current: userStats?.activeMenteesCount,
      tooltip: 'Capacity cap: maximum number of active mentees allowed each month',
      isCapacity: true,
    },
  ];

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-neutral-700">
            <th className="text-left text-neutral-400 font-medium py-2 pr-4">Mission</th>
            <th className="text-center text-neutral-400 font-medium py-2 px-4">Per Month</th>
            {userStats && (
              <th className="text-center text-neutral-400 font-medium py-2 px-4">Your Progress</th>
            )}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => {
            const progressItem = missionProgress?.missions.find((m) => m.key === row.key);
            const met = progressItem?.completed ?? false;

            return (
              <tr key={row.key} className="border-b border-neutral-700/50">
                <td className="text-neutral-300 py-3 pr-4">
                  <span className="flex items-center gap-2">
                    {row.label}
                    {row.tooltip && (
                      <span
                        className="text-neutral-500 cursor-help"
                        title={row.tooltip}
                        aria-label={row.tooltip}
                      >
                        <InformationCircleIcon size="sm" />
                      </span>
                    )}
                  </span>
                </td>
                <td className="text-center text-white font-medium py-3 px-4">
                  {row.isCapacity ? `≤ ${row.target}` : row.target}
                </td>
                {userStats && (
                  <td className="text-center py-3 px-4">
                    {row.current !== undefined ? (
                      <span className={cn(
                        'font-medium',
                        row.isCapacity
                          ? 'text-neutral-400'
                          : met
                            ? 'text-green-400'
                            : 'text-amber-400'
                      )}>
                        {row.current}
                        {!row.isCapacity && (met ? ' ✓' : '')}
                      </span>
                    ) : (
                      <span className="text-neutral-500">-</span>
                    )}
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
      {missionProgress && (
        <div className="mt-4 text-sm">
          <span className={cn(
            'font-medium',
            missionProgress.allCompleted ? 'text-green-400' : 'text-amber-400'
          )}>
            {missionProgress.allCompleted
              ? '✓ All missions completed this month!'
              : `${missionProgress.missions.filter((m) => m.completed && !m.isCapacity).length} of ${missionProgress.missions.filter((m) => !m.isCapacity).length} missions completed`}
          </span>
        </div>
      )}
    </div>
  );
}

/**
 * Table showing application requirements for next level
 */
function ApplicationRequirementsTable({
  requirements,
  userStats,
}: {
  requirements: {
    minVavaLevel: number;
    totalMentoredMin?: number;
  };
  userStats: NunuUserStats | null;
}) {
  const rows = [
    {
      label: 'Minimum Vava Level',
      required: requirements.minVavaLevel,
      current: userStats?.vavaLevel,
    },
  ];

  if (requirements.totalMentoredMin !== undefined) {
    rows.push({
      label: 'Total Vavas Mentored (lifetime)',
      required: requirements.totalMentoredMin,
      current: userStats?.totalMentored,
    });
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-neutral-700">
            <th className="text-left text-neutral-400 font-medium py-2 pr-4">Requirement</th>
            <th className="text-center text-neutral-400 font-medium py-2 px-4">Required</th>
            {userStats && (
              <th className="text-center text-neutral-400 font-medium py-2 px-4">Your Status</th>
            )}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => {
            const met = row.current !== undefined && row.current >= row.required;
            return (
              <tr key={row.label} className="border-b border-neutral-700/50">
                <td className="text-neutral-300 py-3 pr-4">{row.label}</td>
                <td className="text-center text-white font-medium py-3 px-4">{row.required}</td>
                {userStats && (
                  <td className="text-center py-3 px-4">
                    {row.current !== undefined ? (
                      <span className={cn(
                        'font-medium',
                        met ? 'text-green-400' : 'text-red-400'
                      )}>
                        {row.current}
                        {met ? ' ✓' : ' ✗'}
                      </span>
                    ) : (
                      <span className="text-neutral-500">-</span>
                    )}
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function BenefitsGrid({ config }: { config: { shopPlanDiscount: number; shopEventDiscount: number; merchDiscount: number; testUpgradeLevel: number | null } }) {
  const benefits = [
    { label: 'Shop Plan', value: formatDiscount(config.shopPlanDiscount) },
    { label: 'Shop Event', value: formatDiscount(config.shopEventDiscount) },
    { label: 'Merchandise', value: formatDiscount(config.merchDiscount) },
    {
      label: 'Test Bonus',
      value: config.testUpgradeLevel ? `+${config.testUpgradeLevel} level` : '-',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {benefits.map((benefit) => (
        <div key={benefit.label} className="text-center">
          <p className="text-lg font-bold text-white">{benefit.value}</p>
          <p className="text-xs text-neutral-400">{benefit.label}</p>
        </div>
      ))}
    </div>
  );
}

function EligibilityPanel({
  eligibility,
  level,
}: {
  eligibility: ReturnType<typeof calculateEligibility>;
  level: NunuLevel;
}) {
  return (
    <div className={cn(
      'rounded-xl p-5 mb-6 border',
      eligibility.eligible
        ? 'bg-green-500/10 border-green-500/30'
        : 'bg-red-500/10 border-red-500/30'
    )}>
      <div className="flex items-start gap-3">
        {eligibility.eligible ? (
          <CheckCircleIcon size="lg" className="text-green-400 flex-shrink-0 mt-0.5" />
        ) : (
          <XCircleIcon size="lg" className="text-red-400 flex-shrink-0 mt-0.5" />
        )}
        <div className="flex-1">
          <h4 className={cn(
            'font-semibold mb-2',
            eligibility.eligible ? 'text-green-400' : 'text-red-400'
          )}>
            {eligibility.eligible
              ? `Eligible to apply for ${level}`
              : `Not yet eligible for ${level}`}
          </h4>
          {!eligibility.eligible && eligibility.missingRequirements.length > 0 && (
            <ul className="text-sm text-neutral-300 space-y-1">
              {eligibility.missingRequirements.map((req) => (
                <li key={req.key} className="flex items-center gap-2">
                  <XCircleIcon size="sm" className="text-red-400 flex-shrink-0" />
                  <span>
                    {req.label}: Need {req.required}, have {req.current}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

// ==================== HELPERS ====================

function getLevelTitle(level: NunuLevel): string {
  const titles: Record<NunuLevel, string> = {
    'Nx': 'Entry Level Certification',
    'N-5': 'Junior Nunu',
    'N-4': 'Intermediate Nunu',
    'N-3': 'Experienced Nunu',
    'N-2': 'Senior Nunu',
    'N-1': 'Master Nunu',
  };
  return titles[level];
}

function getLevelDescription(level: NunuLevel): string {
  const descriptions: Record<NunuLevel, string> = {
    'Nx': 'Begin your journey as a Nunu mentor. Complete this exam to start mentoring.',
    'N-5': 'Build your foundation as a mentor with basic Vava guidance skills.',
    'N-4': 'Expand your mentoring capabilities and support more learners.',
    'N-3': 'Lead by example with proven mentorship track record.',
    'N-2': 'Advanced mentor with significant community contribution.',
    'N-1': 'Elite mentor status with master-level expertise.',
  };
  return descriptions[level];
}

function getMonthName(month: number): string {
  const months = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return months[month];
}

function compareLevels(a: NunuLevel, b: NunuLevel): number {
  const order: NunuLevel[] = ['Nx', 'N-5', 'N-4', 'N-3', 'N-2', 'N-1'];
  return order.indexOf(a) - order.indexOf(b);
}
