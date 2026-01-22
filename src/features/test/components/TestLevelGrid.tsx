'use client';

import { TestLevelCard } from './TestLevelCard';
import type { LevelInfo } from '../types';

interface TestLevelGridProps {
  levels: LevelInfo[];
  onSelectLevel: (level: number) => void;
}

export function TestLevelGrid({ levels, onSelectLevel }: TestLevelGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {levels.map((levelInfo) => (
        <TestLevelCard
          key={levelInfo.level}
          levelInfo={levelInfo}
          onClick={() => onSelectLevel(levelInfo.level)}
        />
      ))}
    </div>
  );
}
