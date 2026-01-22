'use client';

import { use } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'motion/react';
import { Button, Badge, Card, CardContent } from '@/components/atoms';
import { Gate } from '@/features/auth/components/Gate';
import {
  getSeasonById,
  getSprintById,
  getProjectsBySprintId,
} from '@/features/sprint/data/sprints';
import { cn } from '@/lib/utils';

interface SprintDetailPageProps {
  params: Promise<{ seasonId: string; sprintId: string }>;
}

export default function SprintDetailPage({ params }: SprintDetailPageProps) {
  const { seasonId, sprintId } = use(params);
  const season = getSeasonById(seasonId);
  const sprint = getSprintById(sprintId);
  const projects = getProjectsBySprintId(sprintId);

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

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Link
          href="/sprint"
          className="inline-flex items-center gap-2 text-neutral-400 hover:text-white transition-colors mb-6"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to Sprint list
        </Link>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="primary">{season.name}</Badge>
            <Badge variant="outline">{sprint.theme}</Badge>
            {sprint.isVotingOpen && <Badge variant="warning">Voting Open</Badge>}
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">{sprint.title}</h1>
          <p className="text-neutral-400">{sprint.description}</p>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex items-center gap-4 mb-8"
        >
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
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Upload Project
              </Button>
            </Link>
          </Gate>

          {sprint.isVotingOpen && (
            <Gate
              permission="sprint:vote"
              fallback={
                <Button variant="secondary" disabled>
                  Traveler+ can vote
                </Button>
              }
            >
              <Button variant="secondary">
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                Cast Vote
              </Button>
            </Gate>
          )}
        </motion.div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + index * 0.05 }}
            >
              <Card hover className="h-full overflow-hidden group">
                <div className="relative aspect-video">
                  <Image
                    src={project.thumbnailUrl}
                    alt={project.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-transparent to-transparent" />
                  {project.rank && project.rank <= 3 && (
                    <div className="absolute top-3 left-3">
                      <div
                        className={cn(
                          'w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm',
                          project.rank === 1 && 'bg-amber-500 text-black',
                          project.rank === 2 && 'bg-neutral-400 text-black',
                          project.rank === 3 && 'bg-amber-700 text-white'
                        )}
                      >
                        {project.rank}
                      </div>
                    </div>
                  )}
                </div>
                <CardContent>
                  <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-primary-400 transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-sm text-neutral-400 line-clamp-2 mb-4">
                    {project.description}
                  </p>

                  {/* Tech Stack */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {project.techStack.map((tech) => (
                      <span
                        key={tech}
                        className="px-2 py-0.5 rounded text-xs bg-neutral-800 text-neutral-300"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {project.author.avatar && (
                        <Image
                          src={project.author.avatar}
                          alt={project.author.name}
                          width={24}
                          height={24}
                          className="rounded-full"
                        />
                      )}
                      <span className="text-sm text-neutral-400">
                        {project.author.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-neutral-400">
                      <svg
                        className="w-4 h-4"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {project.voteCount}
                    </div>
                  </div>

                  {/* Links */}
                  {(project.githubUrl || project.liveUrl) && (
                    <div className="flex items-center gap-2 mt-4 pt-4 border-t border-neutral-800">
                      {project.githubUrl && (
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-neutral-400 hover:text-white transition-colors"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <svg
                            className="w-5 h-5"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                          </svg>
                        </a>
                      )}
                      {project.liveUrl && (
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-neutral-400 hover:text-white transition-colors"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                            />
                          </svg>
                        </a>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {projects.length === 0 && (
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
