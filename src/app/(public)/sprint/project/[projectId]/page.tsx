'use client';

import { use } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'motion/react';
import { Badge } from '@/components/atoms';
import {
  getProjectById,
  getSprintById,
  getSeasonById,
} from '@/features/sprint/data/sprints';
import { PageTransition } from '@/components/molecules/PageTransition';

function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export default function ProjectDetailPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = use(params);
  const project = getProjectById(projectId);

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Project Not Found</h1>
          <Link href="/sprint" className="text-primary-400 hover:text-primary-300">
            Back to Sprint
          </Link>
        </div>
      </div>
    );
  }

  const sprint = getSprintById(project.sprintId);
  const season = sprint ? getSeasonById(sprint.seasonId) : undefined;

  const getRankLabel = (rank: number) => {
    switch (rank) {
      case 1:
        return '1st Place';
      case 2:
        return '2nd Place';
      case 3:
        return '3rd Place';
      default:
        return '';
    }
  };

  const getRankStyle = (rank: number) => {
    switch (rank) {
      case 1:
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 2:
        return 'bg-neutral-400/20 text-neutral-300 border-neutral-400/30';
      case 3:
        return 'bg-amber-700/20 text-amber-500 border-amber-700/30';
      default:
        return '';
    }
  };

  return (
    <PageTransition skeleton={<div className="min-h-screen bg-neutral-900 animate-pulse" />}>
      <div className="min-h-screen py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Navigation */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-8"
          >
            <Link
              href="/sprint"
              className="inline-flex items-center gap-2 text-neutral-400 hover:text-white transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Sprint
            </Link>
          </motion.div>

          {/* Project Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            {/* Thumbnail */}
            <div className="relative aspect-video rounded-2xl overflow-hidden mb-6">
              <Image
                src={project.thumbnailUrl}
                alt={project.title}
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/80 via-transparent to-transparent" />

              {/* Rank Badge */}
              {project.rank && project.rank <= 3 && (
                <div className="absolute top-4 left-4">
                  <div
                    className={`px-4 py-2 rounded-full border font-bold text-lg ${getRankStyle(project.rank)}`}
                  >
                    {getRankLabel(project.rank)}
                  </div>
                </div>
              )}

              {/* Season/Sprint Info */}
              <div className="absolute top-4 right-4 flex gap-2">
                {season && (
                  <Badge variant="primary">{season.name}</Badge>
                )}
                {sprint && (
                  <Badge variant="outline">{sprint.theme}</Badge>
                )}
              </div>
            </div>

            {/* Title and Meta */}
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              {project.title}
            </h1>

            <p className="text-lg text-neutral-400 mb-6">
              {project.description}
            </p>

            {/* Author Info */}
            <div className="flex items-center gap-4 mb-6">
              {project.author.avatar && (
                <Image
                  src={project.author.avatar}
                  alt={project.author.name}
                  width={56}
                  height={56}
                  className="rounded-full"
                />
              )}
              <div>
                <p className="text-white font-medium text-lg">{project.author.name}</p>
                <p className="text-neutral-500">
                  Submitted on {formatDate(project.createdAt)}
                </p>
              </div>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap items-center gap-6 mb-6 pb-6 border-b border-neutral-800">
              <div className="flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-neutral-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
                <span className="text-white font-medium">{project.viewCount.toLocaleString()}</span>
                <span className="text-neutral-500">views</span>
              </div>
              <div className="flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-yellow-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                  />
                </svg>
                <span className="text-white font-medium">{project.starCount.toLocaleString()}</span>
                <span className="text-neutral-500">stars</span>
              </div>
              <div className="flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-primary-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 15l7-7 7 7"
                  />
                </svg>
                <span className="text-white font-medium">{project.voteCount}</span>
                <span className="text-neutral-500">votes</span>
              </div>
            </div>

            {/* Tech Stack */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-neutral-500 mb-3">Tech Stack</h3>
              <div className="flex flex-wrap gap-2">
                {project.techStack.map((tech) => (
                  <span
                    key={tech}
                    className="px-3 py-1.5 text-sm bg-neutral-800 text-neutral-300 rounded-lg border border-neutral-700"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Links */}
            <div className="flex flex-wrap gap-4 mb-8">
              {project.githubUrl && (
                <Link
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-5 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path
                      fillRule="evenodd"
                      d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                      clipRule="evenodd"
                    />
                  </svg>
                  View Source Code
                </Link>
              )}
              {project.liveUrl && (
                <Link
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-5 py-2.5 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                  Live Demo
                </Link>
              )}
            </div>
          </motion.div>

          {/* Project Content */}
          {project.content && (
            <motion.article
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="prose prose-invert prose-lg max-w-none"
            >
              <h2 className="text-2xl font-bold text-white mb-6">About This Project</h2>
              <div className="text-neutral-300 leading-relaxed whitespace-pre-line">
                {project.content}
              </div>
            </motion.article>
          )}

          {/* Sprint Info */}
          {sprint && season && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-12 pt-8 border-t border-neutral-800"
            >
              <h3 className="text-lg font-semibold text-white mb-4">Part of Sprint</h3>
              <div className="bg-neutral-900 rounded-xl p-6 border border-neutral-800">
                <div className="flex items-start gap-4">
                  <div className="flex-1">
                    <p className="text-primary-400 text-sm font-medium mb-1">{season.name} - {sprint.theme}</p>
                    <h4 className="text-xl font-semibold text-white mb-2">{sprint.title}</h4>
                    <p className="text-neutral-400">{sprint.description}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </PageTransition>
  );
}
