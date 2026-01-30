'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/features/auth/components/AuthProvider';
import { cn } from '@/lib/utils';
import { formatDateCompact } from '@/lib/utils/date';

type FilterType = 'all' | 'in-progress' | 'completed';

interface CourseProgressItem {
  id: string;
  courseId: string;
  progressPercent: number;
  completedAt?: Date | string;
  lastAccessedAt: Date | string;
  courseTitle: string;
  courseSubtitle: string;
  thumbnailUrl: string;
  instructorName: string;
  instructorAvatar: string;
  categoryName: string;
  totalDurationSeconds: number; // Added this back as it's used in formatDuration and stats
}

function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
}

export default function MyCoursesPage() {
  const { user } = useAuth();
  const [coursesWithProgress, setCoursesWithProgress] = useState<CourseProgressItem[]>([]);
  const [filter, setFilter] = useState<FilterType>('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    let mounted = true;
    setIsLoading(true);
    fetch(`/api/bff/member/enrollments?userId=${user.id}`)
      .then(res => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then(data => {
        if (mounted) {
          // Ensure dates are Date objects if formatDateCompact expects them
          const processedData = data.map((item: any) => ({
            ...item,
            completedAt: item.completedAt ? new Date(item.completedAt) : undefined,
            lastAccessedAt: new Date(item.lastAccessedAt),
          }));
          setCoursesWithProgress(processedData);
          setIsLoading(false);
        }
      })
      .catch(err => {
        console.error('Failed to fetch enrollments', err);
        if (mounted) setIsLoading(false);
      });

    return () => { mounted = false; };
  }, [user]);

  // Filter courses
  const filteredCourses = useMemo(() => {
    switch (filter) {
      case 'in-progress':
        return coursesWithProgress.filter((p) => !p.completedAt && p.progressPercent > 0);
      case 'completed':
        return coursesWithProgress.filter((p) => p.completedAt);
      default:
        return coursesWithProgress;
    }
  }, [coursesWithProgress, filter]);

  // Stats
  const stats = useMemo(() => {
    const completed = coursesWithProgress.filter((p) => p.completedAt).length;
    const inProgress = coursesWithProgress.filter((p) => !p.completedAt && p.progressPercent > 0).length;
    const totalWatchTime = coursesWithProgress.reduce((sum, p) => {
      return sum + (p.totalDurationSeconds * p.progressPercent / 100);
    }, 0);

    return { completed, inProgress, totalWatchTime };
  }, [coursesWithProgress]);

  if (!user) return null;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">My Courses</h1>
        <p className="text-neutral-400 mt-1">Track your learning progress and continue where you left off.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-neutral-900 rounded-xl border border-neutral-800 p-4">
          <div className="text-3xl font-bold text-green-400">{stats.completed}</div>
          <div className="text-sm text-neutral-400 mt-1">Completed</div>
        </div>
        <div className="bg-neutral-900 rounded-xl border border-neutral-800 p-4">
          <div className="text-3xl font-bold text-primary-400">{stats.inProgress}</div>
          <div className="text-sm text-neutral-400 mt-1">In Progress</div>
        </div>
        <div className="bg-neutral-900 rounded-xl border border-neutral-800 p-4">
          <div className="text-3xl font-bold text-white">{formatDuration(stats.totalWatchTime)}</div>
          <div className="text-sm text-neutral-400 mt-1">Watch Time</div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 border-b border-neutral-800 pb-4">
        {[
          { key: 'all', label: 'All Courses' },
          { key: 'in-progress', label: 'In Progress' },
          { key: 'completed', label: 'Completed' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key as FilterType)}
            className={cn(
              'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
              filter === tab.key
                ? 'bg-primary-500/10 text-primary-400'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Course List */}
      {filteredCourses.length === 0 ? (
        <div className="bg-neutral-900 rounded-xl border border-neutral-800 p-12 text-center">
          <svg className="w-16 h-16 text-neutral-700 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
          <h3 className="text-lg font-semibold text-white mb-2">No courses yet</h3>
          <p className="text-neutral-400 mb-4">
            {filter === 'completed'
              ? "You haven't completed any courses yet. Keep learning!"
              : filter === 'in-progress'
                ? "You don't have any courses in progress."
                : "Start your learning journey by exploring our courses."}
          </p>
          <Link
            href="/learn"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary-500 text-white text-sm font-medium hover:bg-primary-600 transition-colors"
          >
            Browse Courses
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredCourses.map((item) => (
            <Link
              key={item.id}
              href={`/learn/${item.courseId}`}
              className="block bg-neutral-900 rounded-xl border border-neutral-800 overflow-hidden hover:border-neutral-700 transition-colors group"
            >
              <div className="flex flex-col sm:flex-row">
                {/* Thumbnail */}
                <div className="sm:w-48 h-32 sm:h-auto relative">
                  <img
                    src={item.thumbnailUrl}
                    alt={item.courseTitle}
                    className="w-full h-full object-cover"
                  />
                  {item.completedAt && (
                    <div className="absolute inset-0 bg-green-500/20 flex items-center justify-center">
                      <div className="bg-green-500 rounded-full p-2">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs text-neutral-500">{item.categoryName}</span>
                        {item.completedAt && (
                          <span className="px-2 py-0.5 rounded text-xs font-medium bg-green-500/10 text-green-400">
                            Completed
                          </span>
                        )}
                      </div>
                      <h3 className="text-lg font-semibold text-white group-hover:text-primary-400 transition-colors">
                        {item.courseTitle}
                      </h3>
                      <p className="text-sm text-neutral-400 mt-1">{item.courseSubtitle}</p>

                      {/* Instructor */}
                      <div className="flex items-center gap-2 mt-3">
                        <img
                          src={item.instructorAvatar}
                          alt={item.instructorName}
                          className="w-6 h-6 rounded-full"
                        />
                        <span className="text-sm text-neutral-400">{item.instructorName}</span>
                      </div>
                    </div>

                    {/* Progress */}
                    <div className="text-right">
                      <div className="text-2xl font-bold text-white">{Math.round(item.progressPercent)}%</div>
                      <div className="text-xs text-neutral-500">Progress</div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mt-4">
                    <div className="h-2 bg-neutral-800 rounded-full overflow-hidden">
                      <div
                        className={cn(
                          'h-full rounded-full transition-all',
                          item.completedAt ? 'bg-green-500' : 'bg-primary-500'
                        )}
                        style={{ width: `${item.progressPercent}%` }}
                      />
                    </div>
                    <div className="flex items-center justify-between mt-2 text-xs text-neutral-500">
                      <span>{formatDuration(item.totalDurationSeconds)}</span>
                      <span>
                        {item.completedAt
                          ? `Completed on ${formatDateCompact(new Date(item.completedAt))}`
                          : `Last accessed ${formatDateCompact(new Date(item.lastAccessedAt))}`}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Recommended Courses */}
      {filteredCourses.length > 0 && (
        <div className="pt-6 border-t border-neutral-800">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">Continue Learning</h2>
            <Link href="/learn" className="text-sm text-primary-400 hover:text-primary-300">
              View all courses
            </Link>
          </div>
          <p className="text-neutral-400 text-sm">
            Pick up where you left off or explore new courses to expand your skills.
          </p>
        </div>
      )}
    </div>
  );
}
