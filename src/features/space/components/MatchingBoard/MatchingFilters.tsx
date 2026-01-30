'use client';

import { useState, useCallback } from 'react';
import { cn } from '@/lib/utils';
import type { MatchingPostSortBy } from '../../hooks';

interface MatchingFiltersProps {
  priceRange: [number, number];
  onPriceRangeChange: (range: [number, number]) => void;
  sortBy: MatchingPostSortBy;
  onSortChange: (sort: MatchingPostSortBy) => void;
  showVerifiedOnly: boolean;
  onVerifiedOnlyChange: (show: boolean) => void;
}

const MIN_PRICE = 0;
const MAX_PRICE = 100000;
const STEP = 500;

export function MatchingFilters({
  priceRange,
  onPriceRangeChange,
  sortBy,
  onSortChange,
  showVerifiedOnly,
  onVerifiedOnlyChange,
}: MatchingFiltersProps) {
  const sortOptions: { value: MatchingPostSortBy; label: string }[] = [
    { value: 'rating', label: 'Rating (Stars)' },
    { value: 'reviews', label: 'Most Reviews' },
    { value: 'level', label: 'Nunu Level' },
    { value: 'newest', label: 'Most Recent' },
    { value: 'mostViews', label: 'Most Views' },
    { value: 'mostComments', label: 'Most Comments' },
  ];

  const [localMin, setLocalMin] = useState(priceRange[0]);
  const [localMax, setLocalMax] = useState(priceRange[1]);

  const handleMinChange = useCallback((value: number) => {
    const newMin = Math.min(value, localMax - STEP);
    setLocalMin(newMin);
  }, [localMax]);

  const handleMaxChange = useCallback((value: number) => {
    const newMax = Math.max(value, localMin + STEP);
    setLocalMax(newMax);
  }, [localMin]);

  const handleMinCommit = useCallback(() => {
    onPriceRangeChange([localMin, localMax]);
  }, [localMin, localMax, onPriceRangeChange]);

  const handleMaxCommit = useCallback(() => {
    onPriceRangeChange([localMin, localMax]);
  }, [localMin, localMax, onPriceRangeChange]);

  const formatPrice = (price: number) => {
    if (price >= 1000) {
      return `NT$${(price / 1000).toFixed(price % 1000 === 0 ? 0 : 1)}k`;
    }
    return `NT$${price}`;
  };

  // Calculate thumb positions as percentages
  const minPercent = ((localMin - MIN_PRICE) / (MAX_PRICE - MIN_PRICE)) * 100;
  const maxPercent = ((localMax - MIN_PRICE) / (MAX_PRICE - MIN_PRICE)) * 100;

  return (
    <div className="flex flex-col gap-4 mb-6">
      {/* Price Range Slider */}
      <div className="bg-neutral-800/50 rounded-xl p-4 border border-neutral-700">
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-medium text-white">Price Range (per month)</label>
          <span className="text-sm text-primary-400 font-medium">
            {formatPrice(localMin)} - {formatPrice(localMax)}
          </span>
        </div>

        {/* Dual Range Slider */}
        <div className="relative h-6 flex items-center">
          {/* Track background */}
          <div className="absolute w-full h-2 bg-neutral-700 rounded-full" />

          {/* Active range track */}
          <div
            className="absolute h-2 bg-primary-500 rounded-full"
            style={{
              left: `${minPercent}%`,
              width: `${maxPercent - minPercent}%`,
            }}
          />

          {/* Min thumb */}
          <input
            type="range"
            min={MIN_PRICE}
            max={MAX_PRICE}
            step={STEP}
            value={localMin}
            onChange={(e) => handleMinChange(Number(e.target.value))}
            onMouseUp={handleMinCommit}
            onTouchEnd={handleMinCommit}
            className="absolute w-full h-2 appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-primary-500 [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:shadow-lg [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-primary-500"
            style={{ zIndex: localMin > MAX_PRICE - STEP * 10 ? 5 : 3 }}
          />

          {/* Max thumb */}
          <input
            type="range"
            min={MIN_PRICE}
            max={MAX_PRICE}
            step={STEP}
            value={localMax}
            onChange={(e) => handleMaxChange(Number(e.target.value))}
            onMouseUp={handleMaxCommit}
            onTouchEnd={handleMaxCommit}
            className="absolute w-full h-2 appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-primary-500 [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:shadow-lg [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-primary-500"
            style={{ zIndex: 4 }}
          />
        </div>

        {/* Price labels */}
        <div className="flex justify-between mt-2 text-xs text-neutral-500">
          <span>NT$0</span>
          <span>NT$25k</span>
          <span>NT$50k</span>
          <span>NT$75k</span>
          <span>NT$100k</span>
        </div>
      </div>

      {/* Secondary Filters Row */}
      <div className="flex flex-col sm:flex-row gap-4">
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
              Verified Only
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
