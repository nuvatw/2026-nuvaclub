'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'motion/react';
import { Badge } from '@/components/atoms';
import {
  HoverPreviewTrigger,
  useHoverPreviewContext,
} from '@/components/organisms/HoverPreviewPanel';
import type { Course } from '@/features/learn/types';
import { cn } from '@/lib/utils';

interface CourseCardProps {
  course: Course;
  index?: number;
}

const ACCESS_LABELS = {
  'first-chapter': 'First Chapter Free',
  free: 'Free',
  paid: 'Premium',
};

const ACCESS_VARIANTS = {
  'first-chapter': 'default' as const,
  free: 'success' as const,
  paid: 'warning' as const,
};

export function CourseCard({ course, index = 0 }: CourseCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const { state } = useHoverPreviewContext<Course>();
  const isExpanded = state.data?.id === course.id;

  return (
    <HoverPreviewTrigger
      id={course.id}
      item={course}
      className="relative flex-shrink-0 w-[180px] sm:w-[200px] md:w-[220px] lg:w-[240px]"
    >
      {/* Base Card */}
      <motion.div
        className={cn(
          'relative aspect-[16/9] rounded-lg overflow-hidden cursor-pointer',
          'transition-shadow duration-200',
          isHovered && 'shadow-lg shadow-black/40'
        )}
        animate={{
          scale: isExpanded ? 1.03 : 1,
          opacity: isExpanded ? 0.7 : 1,
        }}
        transition={{ duration: 0.15 }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Link href={`/learn/${course.id}`} className="block w-full h-full">
          <Image
            src={course.thumbnailUrl}
            alt={course.title}
            fill
            className="object-cover transition-transform duration-300"
            sizes="(max-width: 640px) 180px, (max-width: 768px) 200px, (max-width: 1024px) 220px, 240px"
          />

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

          {/* Access Badge */}
          <div className="absolute top-2 right-2">
            <Badge variant={ACCESS_VARIANTS[course.accessLevel]} size="sm">
              {ACCESS_LABELS[course.accessLevel]}
            </Badge>
          </div>

          {/* Title on card */}
          <div className="absolute bottom-0 left-0 right-0 p-3">
            <h3 className="text-sm font-semibold text-white line-clamp-2">{course.title}</h3>
          </div>
        </Link>
      </motion.div>
    </HoverPreviewTrigger>
  );
}
