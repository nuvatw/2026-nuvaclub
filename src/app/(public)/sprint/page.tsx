'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import { Badge } from '@/components/atoms';
import {
  SprintWorkCard,
  SprintFilters,
} from '@/features/sprint/components';
import type { SprintFilter } from '@/features/sprint/components';
import {
  MOCK_SEASONS,
  MOCK_SPRINTS,
  getCurrentSeason,
  getSprintsBySeasonId,
  getProjectsWithSeasonInfo,
} from '@/features/sprint/data/sprints';
import type { SortOption, SeasonFilter } from '@/features/sprint/types';
import { PageTransition } from '@/components/molecules/PageTransition';
import { SprintPageSkeleton } from '@/components/skeletons';
import { formatDateCompact, formatDateRange } from '@/lib/utils/date';

export default function SprintPage() {
  const [selectedSeason, setSelectedSeason] = useState<SeasonFilter>('all');
  const [selectedSprint, setSelectedSprint] = useState<SprintFilter>('all');
  const [sortBy, setSortBy] = useState<SortOption>('most-viewed');

  // Get current season
  const currentSeason = getCurrentSeason();
  const currentSprints = currentSeason
    ? getSprintsBySeasonId(currentSeason.id)
    : [];

  // Get all projects with season info
  const allProjectsWithSeasonInfo = getProjectsWithSeasonInfo();

  // Get all past seasons for the filter
  const pastSeasons = MOCK_SEASONS.filter((s) => !s.isActive);

  // Get all past sprints for the filter
  const pastSprints = MOCK_SPRINTS.filter((s) =>
    pastSeasons.some((season) => season.id === s.seasonId)
  );

  // Filter and sort archived projects
  const archivedProjects = useMemo(() => {
    // Get past season IDs
    const pastSeasonIds = pastSeasons.map((s) => s.id);

    // Get sprint IDs that belong to past seasons
    const pastSprintIds = MOCK_SPRINTS.filter((s) =>
      pastSeasonIds.includes(s.seasonId)
    ).map((s) => s.id);

    // Filter projects from past sprints
    let projects = allProjectsWithSeasonInfo.filter((p) =>
      pastSprintIds.includes(p.sprintId)
    );

    // Apply season filter
    if (selectedSeason !== 'all') {
      const seasonSprintIds = MOCK_SPRINTS.filter(
        (s) => s.seasonId === selectedSeason
      ).map((s) => s.id);
      projects = projects.filter((p) => seasonSprintIds.includes(p.sprintId));
    }

    // Apply sprint filter
    if (selectedSprint !== 'all') {
      projects = projects.filter((p) => p.sprintId === selectedSprint);
    }

    // Apply sorting
    return projects.sort((a, b) => {
      if (sortBy === 'most-viewed') {
        return b.viewCount - a.viewCount;
      } else {
        return b.starCount - a.starCount;
      }
    });
  }, [allProjectsWithSeasonInfo, pastSeasons, selectedSeason, selectedSprint, sortBy]);

  return (
    <PageTransition skeleton={<SprintPageSkeleton />}>
      <div className="min-h-screen">
        {/* Hero Section with Countdown */}
        <div className="py-12 sm:py-16 bg-gradient-to-b from-neutral-900 to-neutral-950">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-10"
            >
              <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
                Sprint
              </h1>
              <p className="text-lg text-neutral-400 max-w-2xl mx-auto">
                Turn learning into creations. Join Sprint challenges and showcase your skills.
              </p>
            </motion.div>

          </div>
        </div>

        {/* Section 1: Ongoing Sprint - Clickable Cards */}
        {currentSeason && (
          <section className="py-12 border-b border-neutral-800">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                {/* Current Season Header */}
                <div className="flex flex-wrap items-baseline gap-3 mb-8">
                  <h2 className="text-2xl sm:text-3xl font-bold text-white">
                    Current Sprint
                  </h2>
                  <span className="text-sm text-neutral-400">
                    {formatDateRange(currentSeason.startDate, currentSeason.endDate)}
                  </span>
                  <Badge variant="success">Active</Badge>
                </div>

                {/* Current Sprints Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {currentSprints.map((sprint, index) => (
                    <motion.div
                      key={sprint.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.25 + index * 0.05 }}
                    >
                      <Link href={`/sprint/${currentSeason.id}/${sprint.id}`}>
                        <div className="relative group rounded-xl overflow-hidden bg-neutral-900 border border-neutral-800 hover:border-neutral-700 transition-colors">
                          {/* Sprint Card Header */}
                          <div className="relative aspect-video overflow-hidden">
                            <div
                              className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-300"
                              style={{ backgroundImage: `url(${sprint.thumbnailUrl})` }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-neutral-900/50 to-transparent" />
                            <div className="absolute top-3 right-3 flex gap-2">
                              {index === 0 && (
                                <Badge variant="primary">Official</Badge>
                              )}
                              {sprint.isVotingOpen && (
                                <Badge variant="warning">Voting Open</Badge>
                              )}
                            </div>
                          </div>

                          {/* Sprint Card Content */}
                          <div className="p-4">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-xs text-primary-400 font-medium">
                                {sprint.theme}
                              </span>
                            </div>
                            <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-primary-400 transition-colors">
                              {sprint.title}
                            </h3>
                            <p className="text-sm text-neutral-400 line-clamp-2 mb-4">
                              {sprint.description}
                            </p>
                            <div className="flex items-center justify-between text-xs text-neutral-500">
                              <span>{sprint.projectCount} projects</span>
                              <span>{formatDateRange(sprint.startDate, sprint.endDate)}</span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </section>
        )}

        {/* Section 2: Project Library - Grid with Filters */}
        <section className="py-12">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Library Header with Filters */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex flex-col gap-4 mb-8"
            >
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                  Project Library
                </h2>
                <p className="text-neutral-400">
                  Browse {archivedProjects.length} projects from previous seasons (2024 Q1 - 2025 Q4)
                </p>
              </div>
              <SprintFilters
                seasons={pastSeasons}
                sprints={pastSprints}
                selectedSeason={selectedSeason}
                onSeasonChange={setSelectedSeason}
                selectedSprint={selectedSprint}
                onSprintChange={setSelectedSprint}
                sortBy={sortBy}
                onSortChange={setSortBy}
              />
            </motion.div>

            {/* Projects Grid */}
            {archivedProjects.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {archivedProjects.map((project, index) => (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: Math.min(index * 0.03, 0.3) }}
                  >
                    <SprintWorkCard project={project} showSeason />
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 text-neutral-500">
                <svg
                  className="w-16 h-16 mx-auto mb-4 text-neutral-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  />
                </svg>
                <p className="text-lg">No projects match the selected filters</p>
                <p className="text-sm mt-2">Try adjusting your filter criteria</p>
              </div>
            )}
          </div>
        </section>
      </div>
    </PageTransition>
  );
}
