'use client';

import { cn } from '@/lib/utils';
import type { MatchingPostType, TimeSelectionType } from '@/features/space/types';
import { MATCHING_POST_TYPE_LABELS, TIME_SELECTION_LABELS } from '@/features/space/types';
import type { MatchingPostSortBy } from '@/lib/db/hooks/useMatchingPosts';

interface MatchingFiltersProps {
  selectedType: MatchingPostType | 'all';
  onTypeChange: (type: MatchingPostType | 'all') => void;
  selectedTimeSelection: TimeSelectionType | 'all';
  onTimeSelectionChange: (timeSelection: TimeSelectionType | 'all') => void;
  sortBy: MatchingPostSortBy;
  onSortChange: (sort: MatchingPostSortBy) => void;
  showVerifiedOnly: boolean;
  onVerifiedOnlyChange: (show: boolean) => void;
}

export function MatchingFilters({
  selectedType,
  onTypeChange,
  selectedTimeSelection,
  onTimeSelectionChange,
  sortBy,
  onSortChange,
  showVerifiedOnly,
  onVerifiedOnlyChange,
}: MatchingFiltersProps) {
  const sortOptions: { value: MatchingPostSortBy; label: string }[] = [
    { value: 'newest', label: 'Most Recent' },
    { value: 'oldest', label: 'Oldest' },
    { value: 'mostViews', label: 'Most Views' },
    { value: 'mostComments', label: 'Most Comments' },
  ];

  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      {/* Post Type Filter */}
      <div className="flex-1">
        <label className="text-xs text-neutral-500 mb-1.5 block">Type</label>
        <select
          value={selectedType}
          onChange={(e) => onTypeChange(e.target.value as MatchingPostType | 'all')}
          className={cn(
            'w-full px-3 py-2 rounded-lg',
            'bg-neutral-800 border border-neutral-700',
            'text-white text-sm',
            'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent'
          )}
        >
          <option value="all">All Types</option>
          {(Object.keys(MATCHING_POST_TYPE_LABELS) as MatchingPostType[]).map((type) => (
            <option key={type} value={type}>
              {MATCHING_POST_TYPE_LABELS[type]}
            </option>
          ))}
        </select>
      </div>

      {/* Time Selection Filter */}
      <div className="flex-1">
        <label className="text-xs text-neutral-500 mb-1.5 block">Matching Period</label>
        <select
          value={selectedTimeSelection}
          onChange={(e) => onTimeSelectionChange(e.target.value as TimeSelectionType | 'all')}
          className={cn(
            'w-full px-3 py-2 rounded-lg',
            'bg-neutral-800 border border-neutral-700',
            'text-white text-sm',
            'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent'
          )}
        >
          <option value="all">All Periods</option>
          {(Object.keys(TIME_SELECTION_LABELS) as TimeSelectionType[]).map((time) => (
            <option key={time} value={time}>
              {TIME_SELECTION_LABELS[time]}
            </option>
          ))}
        </select>
      </div>

      {/* Sort */}
      <div className="flex-1">
        <label className="text-xs text-neutral-500 mb-1.5 block">Sort By</label>
        <select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value as MatchingPostSortBy)}
          className={cn(
            'w-full px-3 py-2 rounded-lg',
            'bg-neutral-800 border border-neutral-700',
            'text-white text-sm',
            'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent'
          )}
        >
          {sortOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Verified Only Toggle */}
      <div className="flex items-end">
        <button
          onClick={() => onVerifiedOnlyChange(!showVerifiedOnly)}
          className={cn(
            'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
            'border',
            showVerifiedOnly
              ? 'bg-purple-600/20 border-purple-600/50 text-purple-400'
              : 'bg-neutral-800 border-neutral-700 text-neutral-400 hover:bg-neutral-700'
          )}
        >
          <span className="flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
              />
            </svg>
            Verified
          </span>
        </button>
      </div>
    </div>
  );
}
