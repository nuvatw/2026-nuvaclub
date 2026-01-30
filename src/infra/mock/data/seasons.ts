/**
 * Seasons Table
 *
 * Contains sprint season definitions.
 * Seasons are quarterly periods during which sprints run.
 */

export interface Season {
  id: string;
  name: string;
  description: string;
  startDate: Date;
  endDate: Date;
  isActive: boolean;
}

export const SeasonsTable: Season[] = [
  // 2026 Q1 - Current/Active
  {
    id: 'season-2026-q1',
    name: '2026 Q1',
    description: '2026 First Quarter Sprint Season',
    startDate: new Date('2026-01-01'),
    endDate: new Date('2026-03-31'),
    isActive: true,
  },
  // 2025 Quarters
  {
    id: 'season-2025-q4',
    name: '2025 Q4',
    description: '2025 Fourth Quarter Sprint Season',
    startDate: new Date('2025-10-01'),
    endDate: new Date('2025-12-31'),
    isActive: false,
  },
  {
    id: 'season-2025-q3',
    name: '2025 Q3',
    description: '2025 Third Quarter Sprint Season',
    startDate: new Date('2025-07-01'),
    endDate: new Date('2025-09-30'),
    isActive: false,
  },
  {
    id: 'season-2025-q2',
    name: '2025 Q2',
    description: '2025 Second Quarter Sprint Season',
    startDate: new Date('2025-04-01'),
    endDate: new Date('2025-06-30'),
    isActive: false,
  },
  {
    id: 'season-2025-q1',
    name: '2025 Q1',
    description: '2025 First Quarter Sprint Season',
    startDate: new Date('2025-01-01'),
    endDate: new Date('2025-03-31'),
    isActive: false,
  },
  // 2024 Quarters
  {
    id: 'season-2024-q4',
    name: '2024 Q4',
    description: '2024 Fourth Quarter Sprint Season',
    startDate: new Date('2024-10-01'),
    endDate: new Date('2024-12-31'),
    isActive: false,
  },
  {
    id: 'season-2024-q3',
    name: '2024 Q3',
    description: '2024 Third Quarter Sprint Season',
    startDate: new Date('2024-07-01'),
    endDate: new Date('2024-09-30'),
    isActive: false,
  },
  {
    id: 'season-2024-q2',
    name: '2024 Q2',
    description: '2024 Second Quarter Sprint Season',
    startDate: new Date('2024-04-01'),
    endDate: new Date('2024-06-30'),
    isActive: false,
  },
  {
    id: 'season-2024-q1',
    name: '2024 Q1',
    description: '2024 First Quarter Sprint Season',
    startDate: new Date('2024-01-01'),
    endDate: new Date('2024-03-31'),
    isActive: false,
  },
  // 2023 Quarters
  {
    id: 'season-2023-q4',
    name: '2023 Q4',
    description: '2023 Fourth Quarter Sprint Season',
    startDate: new Date('2023-10-01'),
    endDate: new Date('2023-12-31'),
    isActive: false,
  },
  {
    id: 'season-2023-q3',
    name: '2023 Q3',
    description: '2023 Third Quarter Sprint Season',
    startDate: new Date('2023-07-01'),
    endDate: new Date('2023-09-30'),
    isActive: false,
  },
  {
    id: 'season-2023-q2',
    name: '2023 Q2',
    description: '2023 Second Quarter Sprint Season',
    startDate: new Date('2023-04-01'),
    endDate: new Date('2023-06-30'),
    isActive: false,
  },
  {
    id: 'season-2023-q1',
    name: '2023 Q1',
    description: '2023 First Quarter Sprint Season',
    startDate: new Date('2023-01-01'),
    endDate: new Date('2023-03-31'),
    isActive: false,
  },
];

// ============================================================
// Helper Functions
// ============================================================

export const getSeasonById = (id: string): Season | undefined =>
  SeasonsTable.find((s) => s.id === id);

export const getActiveSeason = (): Season | undefined =>
  SeasonsTable.find((s) => s.isActive);

export const getCurrentSeason = getActiveSeason;

export const getActiveSeasons = (): Season[] =>
  SeasonsTable.filter((s) => s.isActive);

export const getPastSeasons = (): Season[] =>
  SeasonsTable.filter((s) => !s.isActive);

export const getSeasonsByYear = (year: number): Season[] =>
  SeasonsTable.filter((s) => s.startDate.getFullYear() === year);

export const getRecentSeasons = (count: number = 4): Season[] =>
  [...SeasonsTable]
    .sort((a, b) => b.startDate.getTime() - a.startDate.getTime())
    .slice(0, count);

export const getAllSeasons = (): Season[] => SeasonsTable;

// ============================================================
// Legacy Exports (for backward compatibility)
// ============================================================

/** @deprecated Use SeasonsTable instead */
export const MOCK_SEASONS = SeasonsTable;
