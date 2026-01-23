'use client';

import type { SortOption, SeasonFilter } from '@/features/sprint/types';
import type { Season, Sprint } from '@/features/sprint/types';
import { formatSeasonDateRange } from '@/mocks';
import { Dropdown } from '@/components/molecules';

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
        menuMinWidth={280}
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
