'use client';

import { use, useState, useMemo, useCallback } from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import { Button, Badge } from '@/components/atoms';
import {
  ChevronLeftIcon,
  PlusIcon,
} from '@/components/icons';
import { Gate } from '@/features/auth/components/Gate';
import { useAuth } from '@/features/auth';
import {
  getSeasonById,
  getSprintById,
  getProjectsBySprintId,
} from '@/mocks';
import { Dropdown } from '@/components/molecules';
import {
  VotingCountdown,
  MyVotesSection,
  VotableProjectCard,
} from '@/features/sprint/components';
import { useSprintVoting } from '@/features/sprint/hooks';
import type { Project } from '@/features/sprint/types';

type VotingSortOption = 'latest' | 'most-popular';

interface SprintDetailPageProps {
  params: Promise<{ seasonId: string; sprintId: string }>;
}

export default function SprintDetailPage({ params }: SprintDetailPageProps) {
  const { seasonId, sprintId } = use(params);
  const { user } = useAuth();
  const season = getSeasonById(seasonId);
  const sprint = getSprintById(sprintId);
  const mockProjects = getProjectsBySprintId(sprintId);

  const [sortBy, setSortBy] = useState<VotingSortOption>('most-popular');

  // Get project IDs from mock data for voting scope
  const mockProjectIds = useMemo(() => mockProjects.map((p) => p.id), [mockProjects]);

  // Use voting hook for real voting functionality
  // Pass mock project IDs and voting status to align with mock data
  const {
    votedProjectIds,
    remainingVotes,
    totalVotes,
    isVotingOpen,
    isDeadlinePassed,
    canVote,
    hasVotedFor,
    toggleVote,
    getProjectVoteCount,
    isLoading: votingLoading,
  } = useSprintVoting(sprintId, {
    projectIds: mockProjectIds,
    isVotingOpenOverride: sprint?.isVotingOpen,
  });

  // Merge mock projects with real vote counts from DB
  const projectsWithVotes = useMemo(() => {
    return mockProjects.map((project) => ({
      ...project,
      // Use real vote count from DB if available, fallback to mock
      voteCount: getProjectVoteCount(project.id) || project.voteCount,
    }));
  }, [mockProjects, getProjectVoteCount]);

  // Sort projects
  const sortedProjects = useMemo(() => {
    const sorted = [...projectsWithVotes];
    if (sortBy === 'latest') {
      sorted.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    } else {
      // most-popular: sort by voteCount desc, then by createdAt desc
      sorted.sort((a, b) => {
        if (b.voteCount !== a.voteCount) {
          return b.voteCount - a.voteCount;
        }
        return b.createdAt.getTime() - a.createdAt.getTime();
      });
    }
    return sorted;
  }, [projectsWithVotes, sortBy]);

  // Convert mock Project to the format expected by components
  const convertedProjects = useMemo(() => {
    return sortedProjects.map((p) => ({
      id: p.id,
      sprintId: p.sprintId,
      title: p.title,
      description: p.description,
      thumbnailUrl: p.thumbnailUrl,
      videoUrl: p.videoUrl,
      githubUrl: p.githubUrl,
      liveUrl: p.liveUrl,
      techStack: p.techStack,
      author: p.author,
      rank: p.rank,
      createdAt: p.createdAt,
      updatedAt: p.updatedAt,
      authorId: p.author.id,
      status: 'approved' as const,
      visibility: 'public' as const,
      visibilityAcknowledged: true,
      isWinner: p.rank === 1,
      stats: {
        voteCount: p.voteCount,
        viewCount: p.viewCount,
        starCount: p.starCount,
        commentCount: 0,
      },
    }));
  }, [sortedProjects]);

  const handleVote = useCallback((projectId: string) => {
    if (!user) {
      // Could show login modal here
      return;
    }
    const result = toggleVote(projectId);
    // Could show toast notification with result.message
  }, [user, toggleVote]);

  const handleUnvote = useCallback((projectId: string) => {
    toggleVote(projectId);
  }, [toggleVote]);

  const sortOptions: { value: VotingSortOption; label: string }[] = [
    { value: 'most-popular', label: '最熱門' },
    { value: 'latest', label: '最新' },
  ];

  if (!season || !sprint) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Sprint not found</h1>
          <Link href="/sprint">
            <Button>Back to Sprint list</Button>
          </Link>
        </div>
      </div>
    );
  }

  const isVotingSprint = sprint.isVotingOpen;

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Link
          href="/sprint"
          className="inline-flex items-center gap-2 text-neutral-400 hover:text-white transition-colors mb-6"
        >
          <ChevronLeftIcon size="sm" />
          Back to Sprint list
        </Link>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <Badge variant="primary">{season.name}</Badge>
            <Badge variant="outline">{sprint.theme}</Badge>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">{sprint.title}</h1>
          <p className="text-neutral-400 mb-4">{sprint.description}</p>

          {/* Voting Countdown (only for voting sprint) */}
          {isVotingSprint && (
            <VotingCountdown className="mb-4" />
          )}
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-wrap items-center gap-4 mb-8"
        >
          {/* Upload Project Button - shown for upload sprints or always */}
          {!isVotingSprint && (
            <Gate
              permission="sprint:submit_project"
              fallback={
                <Button variant="secondary" disabled>
                  Traveler+ can upload projects
                </Button>
              }
            >
              <Link href={`/sprint/${seasonId}/${sprintId}/submit`}>
                <Button>
                  <PlusIcon size="sm" className="mr-2" />
                  Upload Project
                </Button>
              </Link>
            </Gate>
          )}

          {/* Vote Permissions Info */}
          {isVotingSprint && !user && (
            <div className="text-sm text-neutral-400">
              <Gate
                permission="sprint:vote"
                fallback={
                  <span>Traveler+ can vote</span>
                }
              >
                <span>登入後即可投票</span>
              </Gate>
            </div>
          )}
        </motion.div>

        {/* Voting Layout (Two Sections) */}
        {isVotingSprint && (
          <>
            {/* Section 1: My Votes */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
            >
              <MyVotesSection
                votedProjectIds={votedProjectIds}
                projects={convertedProjects}
                remainingVotes={remainingVotes}
                totalVotes={totalVotes}
                onUnvote={handleUnvote}
                isVotingEnabled={canVote && !isDeadlinePassed}
              />
            </motion.div>

            {/* Section 2: Browse Projects */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <h2 className="text-xl font-bold text-white">逛逛大家的專案</h2>
                <Dropdown
                  label="排序"
                  value={sortBy}
                  options={sortOptions}
                  onChange={(value) => setSortBy(value as VotingSortOption)}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {convertedProjects.map((project, index) => {
                  const isVoted = hasVotedFor(project.id);
                  const isDisabled = remainingVotes <= 0 && !isVoted;

                  return (
                    <motion.div
                      key={project.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 + Math.min(index * 0.03, 0.3) }}
                    >
                      <VotableProjectCard
                        project={project}
                        isVoted={isVoted}
                        voteCount={sortedProjects.find(p => p.id === project.id)?.voteCount ?? 0}
                        onVote={() => handleVote(project.id)}
                        isVotingEnabled={canVote && !isDeadlinePassed}
                        isDisabled={isDisabled}
                        disabledReason={isDisabled ? '已用完 5 個星星' : undefined}
                      />
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          </>
        )}

        {/* Non-Voting Sprint: Simple Project Grid */}
        {!isVotingSprint && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {convertedProjects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + index * 0.05 }}
              >
                <VotableProjectCard
                  project={project}
                  isVoted={false}
                  voteCount={sortedProjects.find(p => p.id === project.id)?.voteCount ?? 0}
                  isVotingEnabled={false}
                />
              </motion.div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {mockProjects.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🚀</div>
            <h3 className="text-xl font-semibold text-white mb-2">
              No projects yet
            </h3>
            <p className="text-neutral-400 mb-6">Be the first to upload a project!</p>
            <Gate permission="sprint:submit_project">
              <Link href={`/sprint/${seasonId}/${sprintId}/submit`}>
                <Button>Upload Project</Button>
              </Link>
            </Gate>
          </div>
        )}
      </div>
    </div>
  );
}
