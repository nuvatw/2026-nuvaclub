
'use client';

import { Button } from '@/components/atoms';
import { cn } from '@/lib/utils';

interface EmptySprintStateProps {
    title?: string;
    description?: string;
    onAction?: () => void;
    actionLabel?: string;
    className?: string;
}

export function EmptySprintState({
    title = 'No Sprints Found',
    description = 'There are no active or past sprints that match your current filters.',
    onAction,
    actionLabel = 'Clear Filters',
    className,
}: EmptySprintStateProps) {
    return (
        <div className={cn('flex flex-col items-center justify-center p-12 text-center rounded-2xl border-2 border-dashed border-neutral-800 bg-neutral-900/50', className)}>
            <div className="w-16 h-16 bg-neutral-800 rounded-full flex items-center justify-center mb-6">
                <svg
                    className="w-8 h-8 text-neutral-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
            <p className="text-neutral-400 max-w-sm mb-8">
                {description}
            </p>
            {onAction && (
                <Button variant="primary" onClick={onAction}>
                    {actionLabel}
                </Button>
            )}
        </div>
    );
}
