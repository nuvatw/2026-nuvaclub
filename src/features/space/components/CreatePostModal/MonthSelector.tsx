'use client';

import { useMemo } from 'react';
import { cn } from '@/lib/utils';

interface MonthSelectorProps {
  selectedMonths: string[];
  onMonthsChange: (months: string[]) => void;
  maxMonths?: number;
}

/**
 * Generate next N months in YYYY-MM format
 */
function getUpcomingMonths(count: number = 6): { value: string; label: string }[] {
  const months: { value: string; label: string }[] = [];
  const now = new Date();

  for (let i = 0; i < count; i++) {
    const date = new Date(now.getFullYear(), now.getMonth() + i, 1);
    const value = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    const label = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    months.push({ value, label });
  }

  return months;
}

export function MonthSelector({ selectedMonths, onMonthsChange, maxMonths = 6 }: MonthSelectorProps) {
  const availableMonths = useMemo(() => getUpcomingMonths(maxMonths), [maxMonths]);

  const toggleMonth = (monthValue: string) => {
    if (selectedMonths.includes(monthValue)) {
      onMonthsChange(selectedMonths.filter(m => m !== monthValue));
    } else {
      onMonthsChange([...selectedMonths, monthValue].sort());
    }
  };

  return (
    <div>
      <label className="text-sm text-neutral-400 mb-2 block">Available Months</label>
      <div className="grid grid-cols-3 gap-2">
        {availableMonths.map((month) => {
          const isSelected = selectedMonths.includes(month.value);
          return (
            <button
              key={month.value}
              type="button"
              onClick={() => toggleMonth(month.value)}
              className={cn(
                'px-3 py-2 rounded-lg text-sm font-medium transition-all',
                'border',
                isSelected
                  ? 'bg-primary-500/20 border-primary-500 text-primary-400'
                  : 'bg-neutral-800 border-neutral-700 text-neutral-400 hover:border-neutral-600'
              )}
            >
              {month.label}
            </button>
          );
        })}
      </div>
      {selectedMonths.length === 0 && (
        <p className="text-xs text-amber-400 mt-2">Please select at least one month</p>
      )}
    </div>
  );
}
