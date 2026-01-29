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
} from '@/lib/legacy-db-shim';
import type { SortOption, SeasonFilter } from '@/features/sprint/types';
import { getSprintPhase } from '@/features/sprint/utils';
import { PageTransition } from '@/components/molecules/PageTransition';
import { SprintPageSkeleton } from '@/components/skeletons';
import { formatDateCompact, formatDateRange } from '@/lib/utils/date';
import { FolderIcon } from '@/components/icons';

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
    // Note: "most-starred" now means "Most Voted" - sort by voteCount
    return projects.sort((a, b) => {
      if (sortBy === 'most-viewed') {
        return b.viewCount - a.viewCount;
      } else {
        // Sort by voteCount (votes), not starCount (favorites)
        return b.voteCount - a.voteCount;
      }
    });
  }, [allProjectsWithSeasonInfo, pastSeasons, selectedSeason, selectedSprint, sortBy]);

  return (
    <PageTransition skeleton={<SprintPageSkeleton />}>
      <div className="min-h-screen py-8">
        {/* Section 1: Ongoing Sprint - Clickable Cards */}
        {currentSeason && (
          <section className="mb-12 border-b border-neutral-800 pb-12">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                {/* Current Season Header */}
                <div className="flex flex-col items-center text-center mb-8">
                  <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                    Current Sprint
                  </h2>
                  <div className="flex flex-wrap items-center justify-center gap-3">
                    <span className="text-sm text-neutral-400">
                      {formatDateRange(currentSeason.startDate, currentSeason.endDate)}
                    </span>
                    <Badge variant="success">Active</Badge>
                  </div>
                </div>

                {/* Current Sprints Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {currentSprints.map((sprint, index) => {
                    const sprintPhase = getSprintPhase(sprint);
                    return (
                      <motion.div
                        key={sprint.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.25 + index * 0.05 }}
                      >
                        <Link href={`/sprint/${sprint.id}`}>
                          <div className="relative group rounded-xl overflow-hidden bg-neutral-900 border border-neutral-800 hover:border-neutral-700 transition-colors">
                            {/* Sprint Card Header */}
                            <div className="relative aspect-video overflow-hidden">
                              <div
                                className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-300"
                                style={{ backgroundImage: `url(${sprint.thumbnailUrl})` }}
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-neutral-900/50 to-transparent" />
                              <div className="absolute top-3 right-3 flex gap-2">
                                <Badge variant={sprintPhase.badgeVariant}>{sprintPhase.label}</Badge>
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
                              <p className="text-sm text-neutral-400 line-clamp-2 mb-3">
                                {sprint.description}
                              </p>
                              {/* Phase description */}
                              <p className="text-xs text-neutral-500 mb-3 italic">
                                {sprintPhase.description}
                              </p>
                              <div className="flex items-center justify-between text-xs text-neutral-500">
                                <span>{sprint.projectCount} projects</span>
                                <span>{formatDateRange(sprint.startDate, sprint.endDate)}</span>
                              </div>
                            </div>
                          </div>
                        </Link>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            </div>
          </section>
        )}

        {/* Section 2: Project Library - Grid with Filters */}
        <section>
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Library Header with Search and Filters */}
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
                  Browse {archivedProjects.length} projects from previous seasons
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
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
              </div>
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
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="w-16 h-16 rounded-full bg-neutral-800 flex items-center justify-center mb-4">
                  <FolderIcon size="lg" className="text-neutral-500" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  No projects found
                </h3>
                <p className="text-neutral-400 max-w-md mb-4">
                  No projects match the selected filters. Try adjusting your criteria.
                </p>
                {(selectedSeason !== 'all' || selectedSprint !== 'all') && (
                  <button
                    onClick={() => {
                      setSelectedSeason('all');
                      setSelectedSprint('all');
                    }}
                    className="text-primary-400 hover:text-primary-300 transition-colors font-medium"
                  >
                    Clear all filters
                  </button>
                )}
              </div>
            )}
          </div>
        </section>
      </div>
    </PageTransition>
  );
}
