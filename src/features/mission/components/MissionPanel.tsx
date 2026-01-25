'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '@/features/auth/components/AuthProvider';
import {
  FireIcon,
  BookOpenIcon,
  ClipboardIcon,
  ChatBubbleIcon,
  EditIcon,
  UsersIcon,
  CheckCircleIcon,
  XIcon,
  SparklesIcon,
} from '@/components/icons';
import { cn } from '@/lib/utils';
import {
  MISSION_REQUIREMENTS,
  NUNU_LEVEL_LABELS,
  NUNU_LEVEL_COLORS,
  type NunuLevel,
  type MissionItem,
} from '../types';

// Mock progress data - in real app, this would come from a hook
function useMissionProgress(nunuLevel: NunuLevel) {
  const requirements = MISSION_REQUIREMENTS[nunuLevel];

  // Mock current progress
  const progress = {
    coursesCompleted: 1,
    testLevelsGained: 0,
    forumPostsCreated: 1,
    forumCommentsCreated: 2,
    sprintProjectsSubmitted: 0,
    activeVavaCount: 1,
  };

  const missions: MissionItem[] = [
    {
      id: 'courses',
      title: 'Complete Courses',
      description: `Finish ${requirements.coursesPerMonth} course${requirements.coursesPerMonth > 1 ? 's' : ''} this month`,
      current: progress.coursesCompleted,
      target: requirements.coursesPerMonth,
      completed: progress.coursesCompleted >= requirements.coursesPerMonth,
      icon: 'book',
    },
    {
      id: 'test',
      title: 'Level Up in Test',
      description: 'Upgrade one level in the AI Skills Test',
      current: progress.testLevelsGained,
      target: requirements.testLevelsPerMonth,
      completed: progress.testLevelsGained >= requirements.testLevelsPerMonth,
      icon: 'test',
    },
    {
      id: 'forum-posts',
      title: 'Forum Posts',
      description: `Create ${requirements.forumPostsPerMonth} post${requirements.forumPostsPerMonth > 1 ? 's' : ''} in the forum`,
      current: progress.forumPostsCreated,
      target: requirements.forumPostsPerMonth,
      completed: progress.forumPostsCreated >= requirements.forumPostsPerMonth,
      icon: 'forum-post',
    },
    {
      id: 'forum-comments',
      title: 'Forum Comments',
      description: `Leave ${requirements.forumCommentsPerMonth} comment${requirements.forumCommentsPerMonth > 1 ? 's' : ''} in discussions`,
      current: progress.forumCommentsCreated,
      target: requirements.forumCommentsPerMonth,
      completed: progress.forumCommentsCreated >= requirements.forumCommentsPerMonth,
      icon: 'forum-comment',
    },
  ];

  // Add sprint mission if required
  if (requirements.sprintProjectsPerSeason > 0) {
    missions.push({
      id: 'sprint',
      title: 'Sprint Project',
      description: `Submit ${requirements.sprintProjectsPerSeason} project per season`,
      current: progress.sprintProjectsSubmitted,
      target: requirements.sprintProjectsPerSeason,
      completed: progress.sprintProjectsSubmitted >= requirements.sprintProjectsPerSeason,
      icon: 'sprint',
    });
  }

  const completedCount = missions.filter((m) => m.completed).length;
  const totalCount = missions.length;
  const progressPercent = Math.round((completedCount / totalCount) * 100);

  return { missions, completedCount, totalCount, progressPercent, requirements };
}

function MissionIcon({ icon }: { icon: MissionItem['icon'] }) {
  switch (icon) {
    case 'book':
      return <BookOpenIcon size="sm" />;
    case 'test':
      return <ClipboardIcon size="sm" />;
    case 'forum-post':
      return <EditIcon size="sm" />;
    case 'forum-comment':
      return <ChatBubbleIcon size="sm" />;
    case 'sprint':
      return <SparklesIcon size="sm" />;
    case 'users':
      return <UsersIcon size="sm" />;
    case 'fire':
    default:
      return <FireIcon size="sm" />;
  }
}

export function MissionPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const { user, identity } = useAuth();

  // For demo, use N5 level - in real app, this would come from user data
  const nunuLevel: NunuLevel = 'N5';
  const { missions, completedCount, totalCount, progressPercent, requirements } = useMissionProgress(nunuLevel);

  // Close panel when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  // Get current month name
  const currentMonth = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  // Check if user is logged in
  const isLoggedIn = identity !== 'guest';

  return (
    <div ref={panelRef} className="relative">
      {/* Mission Icon Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'relative p-2 transition-colors',
          isOpen ? 'text-white' : 'text-neutral-500 hover:text-white'
        )}
        title="Monthly Missions"
      >
        <FireIcon className="w-6 h-6" />
        {/* Progress indicator dot */}
        {isLoggedIn && completedCount < totalCount && (
          <span className="absolute top-1 right-1 w-2 h-2 bg-amber-500 rounded-full" />
        )}
      </button>

      {/* Mission Panel Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-neutral-900 border border-neutral-800 rounded-xl shadow-xl overflow-hidden z-50"
          >
            {/* Header */}
            <div className="px-4 py-3 bg-neutral-800/50 border-b border-neutral-800">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-white">Monthly Missions</h3>
                  <p className="text-xs text-neutral-400">{currentMonth}</p>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 text-neutral-500 hover:text-white transition-colors"
                >
                  <XIcon size="sm" />
                </button>
              </div>
            </div>

            {!isLoggedIn ? (
              /* Guest State */
              <div className="p-6 text-center">
                <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-neutral-800 flex items-center justify-center">
                  <FireIcon size="lg" className="text-neutral-500" />
                </div>
                <p className="text-neutral-400 text-sm mb-2">Sign in to view your missions</p>
                <p className="text-neutral-500 text-xs">Complete monthly missions to level up as a Nunu</p>
              </div>
            ) : (
              <>
                {/* Level Badge & Progress */}
                <div className="px-4 py-3 border-b border-neutral-800">
                  <div className="flex items-center justify-between mb-2">
                    <span className={cn('text-sm font-medium', NUNU_LEVEL_COLORS[nunuLevel])}>
                      {NUNU_LEVEL_LABELS[nunuLevel]}
                    </span>
                    <span className="text-xs text-neutral-400">
                      {completedCount}/{totalCount} completed
                    </span>
                  </div>
                  {/* Progress Bar */}
                  <div className="h-2 bg-neutral-800 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-primary-500 to-primary-400"
                      initial={{ width: 0 }}
                      animate={{ width: `${progressPercent}%` }}
                      transition={{ duration: 0.5, ease: 'easeOut' }}
                    />
                  </div>
                </div>

                {/* Mission List */}
                <div className="max-h-80 overflow-y-auto">
                  {missions.map((mission, index) => (
                    <motion.div
                      key={mission.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={cn(
                        'px-4 py-3 border-b border-neutral-800/50 last:border-b-0',
                        mission.completed && 'bg-green-500/5'
                      )}
                    >
                      <div className="flex items-start gap-3">
                        {/* Icon */}
                        <div
                          className={cn(
                            'w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0',
                            mission.completed
                              ? 'bg-green-500/20 text-green-400'
                              : 'bg-neutral-800 text-neutral-400'
                          )}
                        >
                          {mission.completed ? (
                            <CheckCircleIcon size="sm" />
                          ) : (
                            <MissionIcon icon={mission.icon} />
                          )}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <h4
                              className={cn(
                                'text-sm font-medium',
                                mission.completed ? 'text-green-400' : 'text-white'
                              )}
                            >
                              {mission.title}
                            </h4>
                            <span
                              className={cn(
                                'text-xs font-medium',
                                mission.completed ? 'text-green-400' : 'text-neutral-400'
                              )}
                            >
                              {mission.current}/{mission.target}
                            </span>
                          </div>
                          <p className="text-xs text-neutral-500 mt-0.5">{mission.description}</p>

                          {/* Mini Progress Bar */}
                          {!mission.completed && (
                            <div className="mt-2 h-1 bg-neutral-800 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-primary-500/50"
                                style={{
                                  width: `${Math.min((mission.current / mission.target) * 100, 100)}%`,
                                }}
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Footer */}
                <div className="px-4 py-3 bg-neutral-800/30 border-t border-neutral-800">
                  <p className="text-xs text-neutral-500 text-center">
                    Complete all missions to maintain your Nunu status
                  </p>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
