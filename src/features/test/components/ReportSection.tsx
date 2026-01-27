'use client';

import { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/atoms';
import {
  ChartBarIcon,
  CalendarIcon,
  TrendingUpIcon,
  SparklesIcon,
  CheckCircleIcon,
  ChevronRightIcon,
  ClockIcon,
  BookOpenIcon,
  FireIcon,
  StarIcon,
  MailIcon,
} from '@/components/icons';

// ==================== TYPES ====================

/** Report month in YYYY-MM format */
export type ReportMonth = `${number}-${string}`;

/** Role type for report */
export type ReportRole = 'nunu' | 'vava';

/** A metric in the report */
export interface ReportMetric {
  label: string;
  value: number | string;
  delta?: number;
  deltaLabel?: string;
  icon?: React.ReactNode;
}

/** A highlight in the report */
export interface ReportHighlight {
  title: string;
  description: string;
  icon?: React.ReactNode;
}

/** A recommendation in the report */
export interface ReportRecommendation {
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
}

/** Full AI Report structure */
export interface AIReport {
  id: string;
  month: ReportMonth;
  role: ReportRole;
  generatedAt: Date;
  highlights: ReportHighlight[];
  metrics: ReportMetric[];
  recommendations: ReportRecommendation[];
  praise: string;
}

/** Report list item (for past reports) */
export interface ReportListItem {
  id: string;
  month: ReportMonth;
  role: ReportRole;
  generatedAt: Date;
  status: 'ready' | 'pending';
}

// ==================== HELPERS ====================

/**
 * Get the latest completed month for reports
 * If today is Feb 15 -> return January (01)
 * If today is Jan 10 -> return December of previous year
 */
function getLatestReportMonth(): ReportMonth {
  const now = new Date();
  const year = now.getMonth() === 0 ? now.getFullYear() - 1 : now.getFullYear();
  const month = now.getMonth() === 0 ? 12 : now.getMonth();
  return `${year}-${month.toString().padStart(2, '0')}` as ReportMonth;
}

/**
 * Format report month for display
 */
function formatReportMonth(month: ReportMonth): string {
  const [year, monthNum] = month.split('-');
  const monthNames = ['', 'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];
  return `${monthNames[parseInt(monthNum, 10)]} ${year}`;
}

// ==================== MOCK DATA ====================

function getMockLatestReport(): AIReport {
  const latestMonth = getLatestReportMonth();
  return {
    id: 'report-latest',
    month: latestMonth,
    role: 'vava',
    generatedAt: new Date(),
    highlights: [
      {
        title: 'Course Completion',
        description: 'You completed 3 courses this month, a 50% increase from last month!',
        icon: <BookOpenIcon size="md" className="text-green-400" />,
      },
      {
        title: 'Streak Maintained',
        description: 'You maintained a 15-day learning streak. Keep it up!',
        icon: <FireIcon size="md" className="text-orange-400" />,
      },
      {
        title: 'Forum Engagement',
        description: 'Your forum post received 12 helpful votes from the community.',
        icon: <StarIcon size="md" className="text-amber-400" />,
      },
    ],
    metrics: [
      { label: 'Courses Completed', value: 3, delta: 1, deltaLabel: 'vs last month' },
      { label: 'Learning Hours', value: 24, delta: 8, deltaLabel: 'vs last month' },
      { label: 'Forum Posts', value: 5, delta: 2, deltaLabel: 'vs last month' },
      { label: 'Current Streak', value: '15 days', delta: 5, deltaLabel: 'vs last month' },
    ],
    recommendations: [
      {
        title: 'Continue with Advanced AI Prompting',
        description: 'Based on your recent progress, we recommend starting the Advanced AI Prompting course next.',
        actionLabel: 'View Course',
        actionHref: '/learn',
      },
      {
        title: 'Join a Sprint Challenge',
        description: 'Participate in this month\'s Sprint to apply what you\'ve learned and earn badges.',
        actionLabel: 'View Sprints',
        actionHref: '/sprint',
      },
      {
        title: 'Connect with a Nunu Mentor',
        description: 'Consider finding a mentor in Space to accelerate your learning journey.',
        actionLabel: 'Find Mentor',
        actionHref: '/space',
      },
    ],
    praise: 'Amazing progress this month! Your dedication to learning is truly inspiring. You\'re on track to reach your goals and making the nuvaClub community stronger every day.',
  };
}

function getMockPastReports(): ReportListItem[] {
  const reports: ReportListItem[] = [];
  const now = new Date();

  // Generate last 6 months of reports
  for (let i = 1; i <= 6; i++) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    reports.push({
      id: `report-${year}-${month}`,
      month: `${year}-${month.toString().padStart(2, '0')}` as ReportMonth,
      role: 'vava',
      generatedAt: new Date(year, month, 0, 12, 0, 0), // Last day of month at noon
      status: 'ready',
    });
  }

  return reports;
}

// ==================== SUB-COMPONENTS ====================

function MetricCard({ metric }: { metric: ReportMetric }) {
  return (
    <div className="bg-neutral-800/50 rounded-xl p-4 text-center">
      <p className="text-2xl font-bold text-white mb-1">{metric.value}</p>
      <p className="text-sm text-neutral-400">{metric.label}</p>
      {metric.delta !== undefined && (
        <p className={cn(
          'text-xs mt-1 font-medium',
          metric.delta > 0 ? 'text-green-400' : metric.delta < 0 ? 'text-red-400' : 'text-neutral-500'
        )}>
          {metric.delta > 0 ? '+' : ''}{metric.delta} {metric.deltaLabel}
        </p>
      )}
    </div>
  );
}

function HighlightCard({ highlight }: { highlight: ReportHighlight }) {
  return (
    <div className="flex items-start gap-3 p-4 bg-neutral-800/30 rounded-xl">
      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-neutral-700/50 flex items-center justify-center">
        {highlight.icon || <SparklesIcon size="md" className="text-purple-400" />}
      </div>
      <div>
        <h4 className="font-medium text-white mb-1">{highlight.title}</h4>
        <p className="text-sm text-neutral-400">{highlight.description}</p>
      </div>
    </div>
  );
}

function RecommendationCard({ recommendation }: { recommendation: ReportRecommendation }) {
  return (
    <div className="p-4 bg-neutral-800/30 rounded-xl border border-neutral-700/50">
      <h4 className="font-medium text-white mb-2">{recommendation.title}</h4>
      <p className="text-sm text-neutral-400 mb-3">{recommendation.description}</p>
      {recommendation.actionLabel && (
        <Button
          variant="secondary"
          size="sm"
          className="text-xs"
          onClick={() => {
            if (recommendation.actionHref) {
              window.location.href = recommendation.actionHref;
            }
          }}
        >
          {recommendation.actionLabel}
          <ChevronRightIcon size="sm" className="ml-1" />
        </Button>
      )}
    </div>
  );
}

function PastReportItem({
  report,
  onSelect,
}: {
  report: ReportListItem;
  onSelect: (report: ReportListItem) => void;
}) {
  return (
    <button
      onClick={() => onSelect(report)}
      className={cn(
        'w-full flex items-center justify-between p-4 rounded-xl transition-colors',
        'bg-neutral-800/30 hover:bg-neutral-800/50 border border-neutral-700/50',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500/50'
      )}
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center">
          <CalendarIcon size="md" className="text-green-400" />
        </div>
        <div className="text-left">
          <p className="font-medium text-white">{formatReportMonth(report.month)} Report</p>
          <p className="text-xs text-neutral-500">
            Generated {new Date(report.generatedAt).toLocaleDateString()}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-500/10 text-green-400">
          Ready
        </span>
        <ChevronRightIcon size="md" className="text-neutral-500" />
      </div>
    </button>
  );
}

// ==================== LOADING/EMPTY STATES ====================

function ReportSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="bg-neutral-800/50 rounded-xl p-6">
        <div className="h-6 w-48 bg-neutral-700 rounded mb-4" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-neutral-700/50 rounded-xl p-4 h-24" />
          ))}
        </div>
      </div>
      <div className="bg-neutral-800/50 rounded-xl p-6">
        <div className="h-6 w-32 bg-neutral-700 rounded mb-4" />
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-neutral-700/50 rounded-xl p-4 h-20" />
          ))}
        </div>
      </div>
    </div>
  );
}

function EmptyReportState() {
  return (
    <div className="bg-neutral-900 rounded-2xl p-8 border border-neutral-800 text-center">
      <div className="w-16 h-16 rounded-full bg-neutral-800 flex items-center justify-center mx-auto mb-4">
        <ChartBarIcon size="lg" className="text-neutral-500" />
      </div>
      <h3 className="text-lg font-semibold text-white mb-2">No Reports Available Yet</h3>
      <p className="text-neutral-400 mb-4 max-w-md mx-auto">
        Your first AI report will be generated at the end of this month.
        Keep learning and engaging with the platform to see your progress!
      </p>
      <div className="flex items-center justify-center gap-2 text-sm text-neutral-500">
        <ClockIcon size="sm" />
        <span>Reports are generated on the last day of each month at noon</span>
      </div>
    </div>
  );
}

// ==================== MAIN COMPONENT ====================

interface ReportSectionProps {
  /** Currently logged in user ID */
  userId?: string | null;
}

export function ReportSection({ userId }: ReportSectionProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);

  // In production, these would come from API calls
  // GET /api/reports/latest?role=vava
  // GET /api/reports?role=vava (history list)
  const latestReport = useMemo(() => {
    if (!userId) return null;
    return getMockLatestReport();
  }, [userId]);

  const pastReports = useMemo(() => {
    if (!userId) return [];
    return getMockPastReports();
  }, [userId]);

  // If viewing a past report, get that report's data
  const viewingReport = useMemo(() => {
    if (!selectedReportId || selectedReportId === 'latest') {
      return latestReport;
    }
    // In production, fetch the specific report by ID
    // For now, return mock data
    return latestReport;
  }, [selectedReportId, latestReport]);

  const handleSelectPastReport = (report: ReportListItem) => {
    setSelectedReportId(report.id);
  };

  const handleBackToLatest = () => {
    setSelectedReportId(null);
  };

  // Not logged in state
  if (!userId) {
    return (
      <div className="bg-neutral-900 rounded-2xl p-8 border border-neutral-800 text-center">
        <div className="w-16 h-16 rounded-full bg-neutral-800 flex items-center justify-center mx-auto mb-4">
          <ChartBarIcon size="lg" className="text-neutral-500" />
        </div>
        <h3 className="text-lg font-semibold text-white mb-2">Sign In to View Your Reports</h3>
        <p className="text-neutral-400 max-w-md mx-auto">
          Log in to access your personalized monthly AI reports with growth insights,
          metrics, and recommendations.
        </p>
      </div>
    );
  }

  // Loading state
  if (isLoading) {
    return <ReportSkeleton />;
  }

  // No reports available
  if (!latestReport) {
    return <EmptyReportState />;
  }

  return (
    <div className="space-y-6">
      {/* Latest Report Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-neutral-900 rounded-2xl p-6 md:p-8 border border-neutral-800"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center">
              <ChartBarIcon size="lg" className="text-green-400" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-white">
                {selectedReportId ? formatReportMonth(viewingReport?.month ?? getLatestReportMonth()) : 'Latest'} Report
              </h3>
              <p className="text-sm text-neutral-400">
                {selectedReportId ? 'Viewing past report' : `${formatReportMonth(latestReport.month)} - Your monthly AI insights`}
              </p>
            </div>
          </div>
          {selectedReportId && (
            <Button variant="secondary" size="sm" onClick={handleBackToLatest}>
              Back to Latest
            </Button>
          )}
        </div>

        {/* Praise/Encouragement Callout */}
        <div className="bg-gradient-to-r from-green-500/10 to-purple-500/10 rounded-xl p-5 mb-6 border border-green-500/20">
          <div className="flex items-start gap-3">
            <SparklesIcon size="lg" className="text-amber-400 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-medium text-white mb-1">Great Work This Month!</h4>
              <p className="text-sm text-neutral-300">{viewingReport?.praise}</p>
            </div>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="mb-6">
          <h4 className="text-sm font-medium text-neutral-400 uppercase tracking-wider mb-3 flex items-center gap-2">
            <TrendingUpIcon size="sm" />
            Your Metrics
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {viewingReport?.metrics.map((metric, index) => (
              <MetricCard key={index} metric={metric} />
            ))}
          </div>
        </div>

        {/* Highlights */}
        <div className="mb-6">
          <h4 className="text-sm font-medium text-neutral-400 uppercase tracking-wider mb-3 flex items-center gap-2">
            <StarIcon size="sm" />
            Growth Highlights
          </h4>
          <div className="space-y-3">
            {viewingReport?.highlights.map((highlight, index) => (
              <HighlightCard key={index} highlight={highlight} />
            ))}
          </div>
        </div>

        {/* Recommendations */}
        <div className="mb-6">
          <h4 className="text-sm font-medium text-neutral-400 uppercase tracking-wider mb-3 flex items-center gap-2">
            <CheckCircleIcon size="sm" />
            AI Recommendations
          </h4>
          <div className="grid md:grid-cols-3 gap-3">
            {viewingReport?.recommendations.map((rec, index) => (
              <RecommendationCard key={index} recommendation={rec} />
            ))}
          </div>
        </div>

        {/* Action Button */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-neutral-800">
          <Button variant="primary" size="lg" className="flex-1 sm:flex-none">
            Review & Reflect
          </Button>
        </div>
      </motion.div>

      {/* Past Reports Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-neutral-900 rounded-2xl p-6 md:p-8 border border-neutral-800"
      >
        <div className="flex items-center gap-2 mb-4">
          <CalendarIcon size="md" className="text-neutral-400" />
          <h3 className="text-lg font-semibold text-white">Past AI Reports</h3>
          <span className="text-sm text-neutral-500">({pastReports.length})</span>
        </div>

        {pastReports.length === 0 ? (
          <p className="text-neutral-400 text-center py-4">No past reports available yet.</p>
        ) : (
          <div className="space-y-2">
            {pastReports.map((report) => (
              <PastReportItem
                key={report.id}
                report={report}
                onSelect={handleSelectPastReport}
              />
            ))}
          </div>
        )}

        {/* Email Reminder Note */}
        <div className="mt-6 pt-4 border-t border-neutral-800">
          <div className="flex items-center gap-2 text-sm text-neutral-500">
            <MailIcon size="sm" />
            <span>We&apos;ll email you when your monthly report is ready.</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
