'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, Badge } from '@/components/atoms';
import { StarSolidIcon } from '@/components/icons';
import type { ProjectWithRelations } from '@/features/sprint/types';
import { cn } from '@/lib/utils';

interface SprintWorkCardProps {
  project: ProjectWithRelations & { seasonName?: string };
  showSeason?: boolean;
  className?: string;
}

export function SprintWorkCard({
  project,
  showSeason = false,
  className,
}: SprintWorkCardProps) {
  return (
    <Link href={`/sprint/project/${project.id}`}>
      <Card hover padding="none" className={cn('overflow-hidden group cursor-pointer', className)}>
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
              <Badge
                variant={
                  project.rank === 1
                    ? 'warning'
                    : project.rank === 2
                      ? 'default'
                      : 'outline'
                }
              >
                #{project.rank}
              </Badge>
            </div>
          )}
          {showSeason && project.seasonName && (
            <div className="absolute top-3 right-3">
              <Badge variant="primary">{project.seasonName}</Badge>
            </div>
          )}
        </div>
        <CardContent className="p-4">
          <h3 className="text-base font-semibold text-white mb-1.5 group-hover:text-primary-400 transition-colors line-clamp-1">
            {project.title}
          </h3>
          <p className="text-sm text-neutral-400 line-clamp-2 mb-3">
            {project.description}
          </p>

          {/* Author */}
          <div className="flex items-center gap-2 mb-3">
            {project.author?.avatar && (
              <Image
                src={project.author.avatar}
                alt={project.author.name}
                width={20}
                height={20}
                className="rounded-full"
              />
            )}
            <span className="text-xs text-neutral-500">{project.author?.name ?? 'Anonymous'}</span>
          </div>

          {/* Stats - Star icon now represents votes */}
          <div className="flex items-center gap-4 text-xs text-neutral-500">
            <div className="flex items-center gap-1">
              <svg
                className="w-3.5 h-3.5"
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
              <span>{project.stats?.viewCount?.toLocaleString() ?? '0'}</span>
            </div>
            {/* Star icon = Votes */}
            <div className="flex items-center gap-1" title="Votes">
              <StarSolidIcon size="sm" className="text-amber-400 w-3.5 h-3.5" />
              <span>{project.stats?.voteCount?.toLocaleString() ?? '0'}</span>
            </div>
          </div>

          {/* Tech Stack */}
          <div className="flex flex-wrap gap-1.5 mt-3">
            {project.techStack?.slice(0, 3).map((tech) => (
              <span
                key={tech}
                className="px-1.5 py-0.5 text-xs bg-neutral-800 text-neutral-400 rounded"
              >
                {tech}
              </span>
            ))}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
