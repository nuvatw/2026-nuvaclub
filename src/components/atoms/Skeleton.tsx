'use client';

import { cn } from '@/lib/utils';

interface SkeletonProps {
  className?: string;
  shimmer?: boolean;
}

/**
 * Basic skeleton block with pulse or shimmer animation
 */
export function Skeleton({ className, shimmer = false }: SkeletonProps) {
  return (
    <div
      className={cn(
        'rounded',
        shimmer ? 'animate-shimmer' : 'bg-neutral-800 animate-pulse',
        className
      )}
    />
  );
}

interface SkeletonTextProps {
  className?: string;
  width?: 'full' | '3/4' | '2/3' | '1/2' | '2/5' | '1/3' | '1/4' | '1/5' | '1/6' | '1/8' | '1/12' | '1/16' | '1/24';
  size?: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl';
}

/**
 * Text line skeleton with configurable width
 */
export function SkeletonText({
  className,
  width = 'full',
  size = 'base'
}: SkeletonTextProps) {
  const widthClasses = {
    full: 'w-full',
    '3/4': 'w-3/4',
    '2/3': 'w-2/3',
    '1/2': 'w-1/2',
    '2/5': 'w-2/5',
    '1/3': 'w-1/3',
    '1/4': 'w-1/4',
    '1/5': 'w-1/5',
    '1/6': 'w-1/6',
    '1/8': 'w-1/6',
    '1/12': 'w-12',
    '1/16': 'w-16',
    '1/24': 'w-24',
  };

  const sizeClasses = {
    xs: 'h-3',
    sm: 'h-4',
    base: 'h-5',
    lg: 'h-6',
    xl: 'h-7',
    '2xl': 'h-8',
    '3xl': 'h-10',
  };

  return (
    <div
      className={cn(
        'bg-neutral-800 animate-pulse rounded',
        widthClasses[width],
        sizeClasses[size],
        className
      )}
    />
  );
}

interface SkeletonCircleProps {
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

/**
 * Circular skeleton for avatars
 */
export function SkeletonCircle({ className, size = 'md' }: SkeletonCircleProps) {
  const sizeClasses = {
    xs: 'w-6 h-6',
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };

  return (
    <div
      className={cn(
        'bg-neutral-800 animate-pulse rounded-full',
        sizeClasses[size],
        className
      )}
    />
  );
}

interface SkeletonImageProps {
  className?: string;
  aspect?: '16/9' | '4/3' | '1/1' | '3/4' | '9/16';
}

/**
 * Image placeholder skeleton with aspect ratio
 */
export function SkeletonImage({ className, aspect = '16/9' }: SkeletonImageProps) {
  const aspectClasses = {
    '16/9': 'aspect-video',
    '4/3': 'aspect-[4/3]',
    '1/1': 'aspect-square',
    '3/4': 'aspect-[3/4]',
    '9/16': 'aspect-[9/16]',
  };

  return (
    <div
      className={cn(
        'bg-neutral-800 animate-pulse rounded-lg w-full',
        aspectClasses[aspect],
        className
      )}
    />
  );
}

interface SkeletonCardProps {
  className?: string;
  children?: React.ReactNode;
}

/**
 * Card container skeleton matching the Card component style
 */
export function SkeletonCard({ className, children }: SkeletonCardProps) {
  return (
    <div
      className={cn(
        'bg-neutral-900 rounded-xl border border-neutral-800 p-4',
        className
      )}
    >
      {children}
    </div>
  );
}

interface SkeletonButtonProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

/**
 * Button placeholder skeleton
 */
export function SkeletonButton({
  className,
  size = 'md',
  fullWidth = false
}: SkeletonButtonProps) {
  const sizeClasses = {
    sm: 'h-8 w-20',
    md: 'h-10 w-28',
    lg: 'h-12 w-36',
  };

  return (
    <div
      className={cn(
        'bg-neutral-800 animate-pulse rounded-lg',
        sizeClasses[size],
        fullWidth && 'w-full',
        className
      )}
    />
  );
}

interface SkeletonBadgeProps {
  className?: string;
  width?: 'sm' | 'md' | 'lg';
}

/**
 * Badge placeholder skeleton
 */
export function SkeletonBadge({ className, width = 'md' }: SkeletonBadgeProps) {
  const widthClasses = {
    sm: 'w-12',
    md: 'w-16',
    lg: 'w-24',
  };

  return (
    <div
      className={cn(
        'bg-neutral-800 animate-pulse rounded-full h-5',
        widthClasses[width],
        className
      )}
    />
  );
}

/**
 * Video hero section skeleton
 */
export function SkeletonVideoHero({ className }: SkeletonProps) {
  return (
    <div className={cn('relative w-full', className)}>
      <SkeletonImage aspect="16/9" className="rounded-none" />
      <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/50 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-8">
        <SkeletonBadge className="mb-4" />
        <SkeletonText size="3xl" width="2/3" className="mb-4" />
        <SkeletonText size="base" width="1/2" className="mb-6" />
        <div className="flex gap-4">
          <SkeletonButton size="lg" />
          <SkeletonButton size="lg" />
        </div>
      </div>
    </div>
  );
}

/**
 * Course card skeleton
 */
export function SkeletonCourseCard({ className }: SkeletonProps) {
  return (
    <SkeletonCard className={cn('w-72 flex-shrink-0', className)}>
      <SkeletonImage aspect="16/9" className="mb-4" />
      <SkeletonText size="lg" width="3/4" className="mb-2" />
      <SkeletonText size="sm" width="1/2" className="mb-3" />
      <div className="flex items-center justify-between">
        <SkeletonBadge width="sm" />
        <SkeletonText size="xs" width="1/4" />
      </div>
    </SkeletonCard>
  );
}

/**
 * Product card skeleton
 */
export function SkeletonProductCard({ className }: SkeletonProps) {
  return (
    <SkeletonCard className={cn(className)}>
      <SkeletonImage aspect="1/1" className="mb-4" />
      <SkeletonText size="base" width="3/4" className="mb-2" />
      <SkeletonText size="lg" width="1/3" className="mb-3" />
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="w-4 h-4 rounded" />
        ))}
      </div>
    </SkeletonCard>
  );
}

/**
 * Post card skeleton
 */
export function SkeletonPostCard({ className }: SkeletonProps) {
  return (
    <SkeletonCard className={cn(className)}>
      <div className="flex items-center gap-2 mb-3">
        <SkeletonBadge width="sm" />
        <SkeletonBadge width="lg" />
      </div>
      <SkeletonText size="xl" width="3/4" className="mb-2" />
      <div className="flex items-center gap-3 mb-4">
        <SkeletonCircle size="sm" />
        <SkeletonText size="sm" width="1/4" />
        <SkeletonText size="xs" width="1/6" />
      </div>
      <SkeletonText size="sm" width="full" className="mb-2" />
      <SkeletonText size="sm" width="full" className="mb-2" />
      <SkeletonText size="sm" width="2/3" className="mb-4" />
      <div className="flex items-center gap-2">
        <SkeletonBadge width="sm" />
        <SkeletonBadge width="md" />
        <SkeletonBadge width="sm" />
      </div>
    </SkeletonCard>
  );
}

/**
 * Companion card skeleton
 */
export function SkeletonCompanionCard({ className }: SkeletonProps) {
  return (
    <SkeletonCard className={cn(className)}>
      <div className="flex items-center gap-4 mb-4">
        <div className="relative">
          <SkeletonCircle size="xl" />
          <Skeleton className="absolute bottom-0 right-0 w-3 h-3 rounded-full" />
        </div>
        <div className="flex-1">
          <SkeletonText size="lg" width="2/3" className="mb-2" />
          <SkeletonBadge width="md" />
        </div>
      </div>
      <div className="flex items-center gap-2 mb-3">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="w-4 h-4 rounded" />
        ))}
        <SkeletonText size="xs" width="1/4" className="ml-2" />
      </div>
      <SkeletonText size="sm" width="full" className="mb-2" />
      <SkeletonText size="sm" width="3/4" className="mb-4" />
      <div className="flex flex-wrap gap-2 mb-4">
        <SkeletonBadge width="md" />
        <SkeletonBadge width="lg" />
        <SkeletonBadge width="sm" />
      </div>
      <div className="flex gap-2">
        <SkeletonButton className="flex-1" />
        <SkeletonButton size="sm" />
      </div>
    </SkeletonCard>
  );
}

/**
 * Sprint card skeleton
 */
export function SkeletonSprintCard({ className }: SkeletonProps) {
  return (
    <SkeletonCard className={cn(className)}>
      <div className="relative mb-4">
        <SkeletonImage aspect="16/9" />
        <div className="absolute top-2 right-2">
          <SkeletonBadge width="sm" />
        </div>
      </div>
      <SkeletonBadge width="sm" className="mb-2" />
      <SkeletonText size="lg" width="3/4" className="mb-2" />
      <SkeletonText size="sm" width="full" className="mb-2" />
      <SkeletonText size="sm" width="2/3" className="mb-4" />
      <div className="flex items-center gap-4">
        <SkeletonText size="xs" width="1/4" />
        <SkeletonText size="xs" width="1/3" />
      </div>
    </SkeletonCard>
  );
}

/**
 * Test level card skeleton
 */
export function SkeletonTestLevelCard({ className }: SkeletonProps) {
  return (
    <SkeletonCard className={cn('text-center', className)}>
      <Skeleton className="w-12 h-12 rounded-full mx-auto mb-3" />
      <SkeletonText size="lg" width="1/2" className="mx-auto mb-2" />
      <SkeletonText size="sm" width="3/4" className="mx-auto" />
    </SkeletonCard>
  );
}
