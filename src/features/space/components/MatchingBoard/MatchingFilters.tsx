'use client';

import { cn } from '@/lib/utils';
import type { MatchingPostType, PriceType } from '@/features/space/types';
import { PRICE_TYPE_LABELS } from '@/features/space/types';
import type { MatchingPostSortBy } from '@/lib/db/hooks/useMatchingPosts';

interface MatchingFiltersProps {
  selectedType: MatchingPostType | 'all';
  onTypeChange: (type: MatchingPostType | 'all') => void;
  selectedPriceType: PriceType | 'all';
  onPriceTypeChange: (priceType: PriceType | 'all') => void;
  sortBy: MatchingPostSortBy;
  onSortChange: (sort: MatchingPostSortBy) => void;
  showVerifiedOnly: boolean;
  onVerifiedOnlyChange: (show: boolean) => void;
}

export function MatchingFilters({
  selectedType,
  onTypeChange,
  selectedPriceType,
  onPriceTypeChange,
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
    <div className="flex flex-col gap-4 mb-6">
      {/* Type Switch - Find Nunu / Find Vava */}
      <div className="flex items-center justify-center">
        <div className="inline-flex rounded-xl bg-neutral-800/50 p-1 border border-neutral-700">
          <button
            onClick={() => onTypeChange('vava-looking-for-nunu')}
            className={cn(
              'px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-200',
              selectedType === 'vava-looking-for-nunu'
                ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/25'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-700/50'
            )}
          >
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Find Nunu
            </span>
          </button>
          <button
            onClick={() => onTypeChange('nunu-looking-for-vava')}
            className={cn(
              'px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-200',
              selectedType === 'nunu-looking-for-vava'
                ? 'bg-green-500 text-white shadow-lg shadow-green-500/25'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-700/50'
            )}
          >
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
              Find Vava
            </span>
          </button>
        </div>
      </div>

      {/* Secondary Filters Row */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Price Type Filter */}
        <div className="flex-1">
          <label className="text-xs text-neutral-500 mb-1.5 block">Price Type</label>
          <select
            value={selectedPriceType}
            onChange={(e) => onPriceTypeChange(e.target.value as PriceType | 'all')}
            className={cn(
              'w-full px-3 py-2 rounded-lg',
              'bg-neutral-800 border border-neutral-700',
              'text-white text-sm',
              'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent'
            )}
          >
            <option value="all">All Prices</option>
            {(Object.keys(PRICE_TYPE_LABELS) as PriceType[]).map((type) => (
              <option key={type} value={type}>
                {PRICE_TYPE_LABELS[type]}
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
    </div>
  );
}
