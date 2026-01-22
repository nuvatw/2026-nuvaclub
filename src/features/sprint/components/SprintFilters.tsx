'use client';

import { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import type { SortOption, SeasonFilter } from '@/features/sprint/types';
import type { Season, Sprint } from '@/features/sprint/types';
import { formatSeasonDateRange } from '@/features/sprint/data/sprints';

interface DropdownProps {
  label: string;
  value: string;
  options: { value: string; label: string; sublabel?: string }[];
  onChange: (value: string) => void;
}

function Dropdown({ label, value, options, onChange }: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedOption = options.find((o) => o.value === value);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'flex items-center gap-2 px-3 py-2 rounded-lg text-sm',
          'bg-neutral-800 border border-neutral-700 text-neutral-200',
          'hover:bg-neutral-700 hover:border-neutral-600 transition-colors'
        )}
      >
        <span className="text-neutral-400">{label}:</span>
        <span className="font-medium truncate max-w-[150px]">{selectedOption?.label}</span>
        <svg
          className={cn(
            'w-4 h-4 text-neutral-400 transition-transform flex-shrink-0',
            isOpen && 'rotate-180'
          )}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 min-w-[280px] max-h-[400px] overflow-y-auto py-1 bg-neutral-800 border border-neutral-700 rounded-lg shadow-xl z-10">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
              className={cn(
                'w-full px-3 py-2 text-left text-sm transition-colors',
                option.value === value
                  ? 'bg-primary-600/20 text-primary-400'
                  : 'text-neutral-300 hover:bg-neutral-700'
              )}
            >
              <div className="flex flex-col">
                <span className="font-medium">{option.label}</span>
                {option.sublabel && (
                  <span className="text-xs text-neutral-500">{option.sublabel}</span>
                )}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export type SprintFilter = 'all' | string;

interface SprintFiltersProps {
  seasons: Season[];
  sprints?: Sprint[];
  selectedSeason: SeasonFilter;
  onSeasonChange: (season: SeasonFilter) => void;
  selectedSprint?: SprintFilter;
  onSprintChange?: (sprint: SprintFilter) => void;
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
}

export function SprintFilters({
  seasons,
  sprints,
  selectedSeason,
  onSeasonChange,
  selectedSprint,
  onSprintChange,
  sortBy,
  onSortChange,
}: SprintFiltersProps) {
  const seasonOptions = [
    { value: 'all', label: 'All Seasons' },
    ...seasons.map((s) => ({
      value: s.id,
      label: s.name,
      sublabel: formatSeasonDateRange(s),
    })),
  ];

  // Filter sprints based on selected season
  const filteredSprints = sprints
    ? selectedSeason === 'all'
      ? sprints
      : sprints.filter((s) => s.seasonId === selectedSeason)
    : [];

  const sprintOptions = [
    { value: 'all', label: 'All Sprints' },
    ...filteredSprints.map((s) => ({ value: s.id, label: s.title })),
  ];

  const sortOptions: { value: SortOption; label: string }[] = [
    { value: 'most-viewed', label: 'Most Viewed' },
    { value: 'most-starred', label: 'Most Starred' },
  ];

  return (
    <div className="flex flex-wrap items-center gap-3">
      <Dropdown
        label="Season"
        value={selectedSeason}
        options={seasonOptions}
        onChange={(value) => {
          onSeasonChange(value as SeasonFilter);
          // Reset sprint filter when season changes
          if (onSprintChange) {
            onSprintChange('all');
          }
        }}
      />
      {sprints && onSprintChange && (
        <Dropdown
          label="Sprint"
          value={selectedSprint || 'all'}
          options={sprintOptions}
          onChange={(value) => onSprintChange(value as SprintFilter)}
        />
      )}
      <Dropdown
        label="Sort"
        value={sortBy}
        options={sortOptions}
        onChange={(value) => onSortChange(value as SortOption)}
      />
    </div>
  );
}
