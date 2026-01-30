
'use client';

import { Card, CardContent } from '@/components/atoms';
import { cn } from '@/lib/utils';

interface SprintSkeletonProps {
    className?: string;
}

export function SprintSkeleton({ className }: SprintSkeletonProps) {
    return (
        <Card padding="none" className={cn('overflow-hidden animate-pulse', className)}>
            <div className="relative aspect-video bg-neutral-800" />
            <CardContent className="p-4 space-y-3">
                <div className="h-5 bg-neutral-800 rounded w-3/4" />
                <div className="space-y-2">
                    <div className="h-4 bg-neutral-800 rounded w-full" />
                    <div className="h-4 bg-neutral-800 rounded w-5/6" />
                </div>

                {/* Author */}
                <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-neutral-800" />
                    <div className="h-3 bg-neutral-800 rounded w-20" />
                </div>

                {/* Stats */}
                <div className="flex items-center gap-4">
                    <div className="h-3 bg-neutral-800 rounded w-12" />
                    <div className="h-3 bg-neutral-800 rounded w-12" />
                </div>

                {/* Tech Stack */}
                <div className="flex gap-1.5 pt-1">
                    <div className="h-5 bg-neutral-800 rounded w-12" />
                    <div className="h-5 bg-neutral-800 rounded w-12" />
                    <div className="h-5 bg-neutral-800 rounded w-12" />
                </div>
            </CardContent>
        </Card>
    );
}
