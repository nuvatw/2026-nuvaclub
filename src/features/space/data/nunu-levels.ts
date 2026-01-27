import type { NunuLevel, NunuLevelConfig } from '../types';

/**
 * Nunu Level System Configuration
 *
 * Levels from N5 (entry) to N1 (master)
 * Each level determines:
 * - maxVavas: Maximum number of Vavas a Nunu can mentor
 * - minVavas: Minimum expected Vavas for this level (for validation/display)
 */
export const NUNU_LEVELS: NunuLevelConfig[] = [
  {
    level: 'N5',
    name: 'Beginner Nunu',
    maxVavas: 3,
    minVavas: 1,
    color: 'bg-gray-600/20 text-gray-400 border-gray-600/30',
    description: 'Entry level, can mentor 1-3 Vavas',
  },
  {
    level: 'N4',
    name: 'Intermediate Nunu',
    maxVavas: 5,
    minVavas: 2,
    color: 'bg-green-600/20 text-green-400 border-green-600/30',
    description: 'Mid-level mentor, can mentor 2-5 Vavas',
  },
  {
    level: 'N3',
    name: 'Senior Nunu',
    maxVavas: 10,
    minVavas: 3,
    color: 'bg-blue-600/20 text-blue-400 border-blue-600/30',
    description: 'Advanced mentor, can mentor 3-10 Vavas',
  },
  {
    level: 'N2',
    name: 'Expert Nunu',
    maxVavas: 30,
    minVavas: 5,
    color: 'bg-purple-600/20 text-purple-400 border-purple-600/30',
    description: 'Expert-level mentor, can mentor 5-30 Vavas',
  },
  {
    level: 'N1',
    name: 'Master Nunu',
    maxVavas: 50,
    minVavas: 10,
    color: 'bg-amber-600/20 text-amber-400 border-amber-600/30',
    description: 'Highest level, can mentor 10-50 Vavas',
  },
];

/**
 * Get configuration for a specific Nunu level
 */
export const getNunuLevelConfig = (level: NunuLevel): NunuLevelConfig => {
  return NUNU_LEVELS.find((config) => config.level === level) || NUNU_LEVELS[0];
};

/**
 * Get max Vavas allowed for a level
 */
export const getMaxVavasForLevel = (level: NunuLevel): number => {
  return getNunuLevelConfig(level).maxVavas;
};

/**
 * Get min Vavas expected for a level
 */
export const getMinVavasForLevel = (level: NunuLevel): number => {
  return getNunuLevelConfig(level).minVavas;
};

/**
 * Check if a Nunu meets the minimum Vava requirement for their level
 */
export const meetsMinVavaRequirement = (level: NunuLevel, currentCount: number): boolean => {
  return currentCount >= getMinVavasForLevel(level);
};

/**
 * Check if a Nunu can accept more Vavas
 */
export const canAcceptMoreVavas = (level: NunuLevel, currentCount: number): boolean => {
  return currentCount < getMaxVavasForLevel(level);
};

/**
 * Get progress percentage towards max Vavas
 */
export const getVavaProgress = (level: NunuLevel, currentCount: number): number => {
  const max = getMaxVavasForLevel(level);
  return Math.min((currentCount / max) * 100, 100);
};

/**
 * Get available slots for more Vavas
 */
export const getAvailableSlots = (level: NunuLevel, currentCount: number): number => {
  return Math.max(getMaxVavasForLevel(level) - currentCount, 0);
};
