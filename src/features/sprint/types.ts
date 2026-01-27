/**
 * Sprint Feature Types
 *
 * Re-exports entity types from Database (canonical source)
 * and defines feature-specific types for sprint functionality.
 */

// Re-export entity types from Database (canonical source)
export type { Season, Sprint, Project } from '@/Database/schema';

// Feature-specific types
// Note: 'most-starred' now represents "Most Voted" (votes, not favorites)
// The star icon in the UI represents votes, not stars/favorites
export type SortOption = 'most-viewed' | 'most-starred';
export type SeasonFilter = 'all' | string;

// Sprint voting modes
export type SprintMode = 'voting' | 'upload' | 'ended';

// Rank display constants
const RANK_LABELS: Record<number, string> = {
  1: '1st Place',
  2: '2nd Place',
  3: '3rd Place',
};

const RANK_STYLES: Record<number, string> = {
  1: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  2: 'bg-neutral-400/20 text-neutral-300 border-neutral-400/30',
  3: 'bg-amber-700/20 text-amber-500 border-amber-700/30',
};

export function getRankLabel(rank: number): string {
  return RANK_LABELS[rank] ?? '';
}

export function getRankStyle(rank: number): string {
  return RANK_STYLES[rank] ?? '';
}
