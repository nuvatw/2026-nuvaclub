'use client';

import { use, useState, useMemo, useCallback, useRef } from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import { Button, Badge } from '@/components/atoms';
import {
  ChevronLeftIcon,
  PlusIcon,
} from '@/components/icons';
import { Gate } from '@/features/auth/components/Gate';
import { useAuth } from '@/features/auth';
import { Dropdown } from '@/components/molecules';
import {
  VotingCountdown,
  MyVotesSection,
  VotableProjectCard,
  ProjectDetailModal,
} from '@/features/sprint/components';
import { useSprintVoting, useSprints, useSprint, useSeason } from '@/features/sprint/hooks';
import { getSprintPhase } from '@/features/sprint/utils';
import type { ProjectWithRelations } from '@/features/sprint/types';

type VotingSortOption = 'latest' | 'most-popular';

interface SprintDetailPageProps {
  params: Promise<{ sprintId: string }>;
}

export default function SprintDetailPage({ params }: SprintDetailPageProps) {
  const { sprintId } = use(params);
  const { user } = useAuth();

  // Use hooks via BFF
  const sprint = useSprint(sprintId);
  const season = useSeason(sprint?.seasonId || '');
  const sprintProjects = sprint?.projects || [];

  const [sortBy, setSortBy] = useState<VotingSortOption>('most-popular');

  // Modal state
  const [selectedProject, setSelectedProject] = useState<ProjectWithRelations | null>(null);
  const [selectedProjectContent, setSelectedProjectContent] = useState<string | undefined>(undefined);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Ref for My Votes section scroll
  const myVotesRef = useRef<HTMLDivElement>(null);

  // Get project IDs for voting scope
  const projectIds = useMemo(() => sprintProjects.map((p) => p.id), [sprintProjects]);

  // Use voting hook
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
    projectIds: projectIds,
    isVotingOpenOverride: sprint?.isVotingOpen,
  });

  // Merge projects with real vote counts
  const projectsWithVotes = useMemo(() => {
    return sprintProjects.map((project) => ({
      ...project,
      voteCount: getProjectVoteCount(project.id) || (project as any).voteCount || 0,
    }));
  }, [sprintProjects, getProjectVoteCount]);

  // Sort projects
  const sortedProjects = useMemo(() => {
    const sorted = [...projectsWithVotes];
    if (sortBy === 'latest') {
      sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else {
      sorted.sort((a, b) => {
        if (b.voteCount !== a.voteCount) {
          return b.voteCount - a.voteCount;
        }
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
    }
    return sorted;
  }, [projectsWithVotes, sortBy]);

  // Convert to ProjectWithRelations format
  const convertedProjects: ProjectWithRelations[] = useMemo(() => {
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
      author: p.author as any,
      rank: p.rank,
      createdAt: new Date(p.createdAt),
      updatedAt: new Date(p.updatedAt),
      authorId: (p.author as any)?.id || '',
      status: 'approved' as const,
      visibility: 'public' as const,
      visibilityAcknowledged: true,
      isWinner: p.rank === 1,
      stats: {
        voteCount: p.voteCount,
        viewCount: (p as any).viewCount || 0,
        starCount: (p as any).starCount || 0,
        commentCount: 0,
      },
    }));
  }, [sortedProjects]);

  const handleVote = useCallback(async (projectId: string) => {
    if (!user) return;
    const result = await toggleVote(projectId);
    if (result.success && isModalOpen) {
      setIsModalOpen(false);
      setSelectedProject(null);
      setTimeout(() => {
        document.getElementById('my-votes-section')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }, [user, toggleVote, isModalOpen]);

  const handleUnvote = useCallback((projectId: string) => {
    toggleVote(projectId);
  }, [toggleVote]);

  const handleOpenProjectModal = useCallback((project: ProjectWithRelations) => {
    setSelectedProject(project);
    // Project in convertedProjects already has most info, but we might fetch full content if needed
    // For now we'll assume the sprint projects include content or we handle it in the modal
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedProject(null);
    setSelectedProjectContent(undefined);
  }, []);

  const sortOptions = [
    { value: 'most-popular', label: 'Most Popular' },
    { value: 'latest', label: 'Latest' },
  ];

  if (!sprint) {
    return (
      <div className="min-h-screen flex items-center justify-center text-neutral-500">
        Loading sprint details...
      </div>
    );
  }

  const sprintPhase = getSprintPhase(sprint);
  const isVotingSprint = sprint.isVotingOpen || sprintPhase.isVotingPeriod;

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
            {season && <Badge variant="primary">{season.name}</Badge>}
            <Badge variant="outline">{sprint.theme}</Badge>
            <Badge variant={sprintPhase.badgeVariant}>{sprintPhase.label}</Badge>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">{sprint.title}</h1>
          <p className="text-neutral-400 mb-4">{sprint.description}</p>

          {/* Voting Countdown */}
          {isVotingSprint && <VotingCountdown className="mb-4" />}
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-wrap items-center gap-4 mb-8"
        >
          {!isVotingSprint && (
            <Gate permission="sprint:submit_project">
              <Link href={`/sprint/${sprintId}/submit`}>
                <Button>
                  <PlusIcon size="sm" className="mr-2" />
                  Upload Project
                </Button>
              </Link>
            </Gate>
          )}
        </motion.div>

        {/* Voting Layout */}
        {isVotingSprint && (
          <>
            <motion.div
              ref={myVotesRef}
              id="my-votes-section"
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

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <h2 className="text-xl font-bold text-white">Browse Projects</h2>
                <Dropdown
                  label="Sort by"
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
                        voteCount={project.stats.voteCount}
                        onVote={() => handleVote(project.id)}
                        isVotingEnabled={canVote && !isDeadlinePassed}
                        isDisabled={isDisabled}
                        disabledReason={isDisabled ? 'You have used all 5 stars for this sprint' : undefined}
                        onOpenModal={() => handleOpenProjectModal(project)}
                      />
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          </>
        )}

        {/* Non-Voting Sprint */}
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
                  voteCount={project.stats.voteCount}
                  isVotingEnabled={false}
                  onOpenModal={() => handleOpenProjectModal(project)}
                />
              </motion.div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {sprintProjects.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🚀</div>
            <h3 className="text-xl font-semibold text-white mb-2">No projects yet</h3>
            <p className="text-neutral-400 mb-6">Be the first to upload a project!</p>
          </div>
        )}

        {/* Project Detail Modal */}
        <ProjectDetailModal
          project={selectedProject}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          isVoted={selectedProject ? hasVotedFor(selectedProject.id) : false}
          voteCount={selectedProject ? selectedProject.stats.voteCount : 0}
          onVote={selectedProject ? () => handleVote(selectedProject.id) : undefined}
          isVotingEnabled={isVotingSprint && canVote && !isDeadlinePassed}
          isVoteDisabled={selectedProject ? (remainingVotes <= 0 && !hasVotedFor(selectedProject.id)) : false}
          voteDisabledReason="You have used all 5 stars for this sprint"
          seasonName={season?.name || ''}
          sprintTheme={sprint.theme}
          content={selectedProject?.description} // Or fetch full content if available
        />
      </div>
    </div>
  );
}
