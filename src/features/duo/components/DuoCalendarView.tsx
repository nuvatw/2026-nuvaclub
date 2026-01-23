'use client';

import { useDuoMonthPasses } from '../hooks/useDuoMonthPasses';
import { formatMonthLong } from '../utils/month-utils';
import { cn } from '@/lib/utils';

interface DuoCalendarViewProps {
  onMonthSelect: (month: string | null) => void;
  selectedMonth: string | null;
}

export function DuoCalendarView({ onMonthSelect, selectedMonth }: DuoCalendarViewProps) {
  const { passesWithMeta } = useDuoMonthPasses();

  if (passesWithMeta.length === 0) {
    return null;
  }

  return (
    <div className="bg-neutral-900 rounded-xl border border-neutral-800 p-6">
      <h3 className="text-lg font-semibold text-white mb-4">Monthly Duo Passes</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {passesWithMeta.map((pass) => (
          <button
            key={pass.id}
            onClick={() => onMonthSelect(selectedMonth === pass.month ? null : pass.month)}
            className={cn(
              'p-4 rounded-lg border text-left transition-all',
              selectedMonth === pass.month
                ? 'bg-primary-500/20 border-primary-500/50'
                : 'bg-neutral-800/50 border-neutral-700 hover:border-neutral-600'
            )}
          >
            <p className="text-sm font-medium text-white">
              {formatMonthLong(pass.month)}
            </p>
            <p className="text-xs text-neutral-400 mt-1 capitalize">
              {pass.tier} Pass
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}
