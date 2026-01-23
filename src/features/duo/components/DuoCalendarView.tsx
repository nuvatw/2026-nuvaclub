'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { useDuoMonthPasses } from '../hooks/useDuoMonthPasses';
import type { DuoTier } from '../types';
import { DUO_TIER_CONFIG } from '../types';
import {
  getNextMonths,
  formatMonthCompact,
  formatMonthLong,
  groupMonthsByYear,
  getCurrentMonth,
} from '../utils/month-utils';

interface DuoCalendarViewProps {
  onMonthSelect?: (month: string) => void;
  selectedMonth?: string | null;
}

export function DuoCalendarView({
  onMonthSelect,
  selectedMonth,
}: DuoCalendarViewProps) {
  const { passesWithMeta, getPassForMonth } = useDuoMonthPasses();
  const [internalSelectedMonth, setInternalSelectedMonth] = useState<string | null>(
    selectedMonth ?? null
  );

  const activeMonth = selectedMonth ?? internalSelectedMonth;
  const currentMonth = getCurrentMonth();
  const availableMonths = useMemo(() => getNextMonths(12), []);
  const monthsByYear = useMemo(
    () => groupMonthsByYear(availableMonths),
    [availableMonths]
  );

  const handleMonthClick = (month: string) => {
    setInternalSelectedMonth(month);
    onMonthSelect?.(month);
  };

  const selectedPass = activeMonth ? getPassForMonth(activeMonth) : null;
  const selectedPassMeta = activeMonth
    ? passesWithMeta.find((p) => p.month === activeMonth)
    : null;

  return (
    <div className="bg-neutral-900 rounded-xl border border-neutral-800 overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-neutral-800">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-white">My Duo Passes</h2>
            <p className="text-sm text-neutral-400 mt-0.5">
              Your monthly access calendar
            </p>
          </div>
          <Link
            href="/shop?category=duo"
            className="px-4 py-2 rounded-lg bg-primary-500 text-white text-sm font-medium hover:bg-primary-600 transition-colors flex items-center gap-2"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Buy Months
          </Link>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="p-6">
        {Object.entries(monthsByYear).map(([year, months]) => (
          <div key={year} className="mb-6 last:mb-0">
            <h3 className="text-sm font-medium text-neutral-400 mb-3">{year}</h3>
            <div className="grid grid-cols-6 gap-2">
              {months.map((month) => {
                const pass = getPassForMonth(month);
                const isActive = month === activeMonth;
                const isCurrent = month === currentMonth;
                const tierConfig = pass
                  ? DUO_TIER_CONFIG[pass.tier]
                  : null;

                return (
                  <button
                    key={month}
                    onClick={() => handleMonthClick(month)}
                    className={cn(
                      'relative p-3 rounded-lg text-center transition-all',
                      'border-2',
                      isActive
                        ? 'ring-2 ring-primary-500 ring-offset-2 ring-offset-neutral-900'
                        : '',
                      pass
                        ? `${tierConfig!.bgColor} ${tierConfig!.borderColor}`
                        : 'bg-neutral-800/50 border-neutral-700/50 hover:border-neutral-600'
                    )}
                  >
                    <span
                      className={cn(
                        'block text-sm font-medium',
                        pass ? tierConfig!.color : 'text-neutral-500'
                      )}
                    >
                      {formatMonthCompact(month)}
                    </span>
                    {pass && (
                      <>
                        <span
                          className={cn(
                            'block text-[10px] mt-0.5 uppercase font-bold',
                            tierConfig!.color
                          )}
                        >
                          {pass.tier}
                        </span>
                        <span className="block text-[10px] text-neutral-400 mt-0.5">
                          {pass.currentCompanions}/
                          {pass.maxCompanions >= 999 ? '∞' : pass.maxCompanions}
                        </span>
                      </>
                    )}
                    {isCurrent && (
                      <div className="absolute -top-1 -left-1 w-2 h-2 bg-primary-500 rounded-full" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="px-6 py-3 bg-neutral-800/50 border-t border-neutral-800">
        <div className="flex items-center gap-4 text-xs text-neutral-400">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded bg-green-500/10 border border-green-500/30" />
            <span className="text-green-400">Go</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded bg-amber-500/10 border border-amber-500/30" />
            <span className="text-amber-400">Run</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded bg-purple-500/10 border border-purple-500/30" />
            <span className="text-purple-400">Fly</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded bg-neutral-800/50 border border-neutral-700/50" />
            <span>No Pass</span>
          </div>
        </div>
      </div>

      {/* Selected Month Details */}
      {activeMonth && (
        <div className="p-6 border-t border-neutral-800">
          <h3 className="text-sm font-medium text-neutral-400 mb-3">
            {formatMonthLong(activeMonth)}
          </h3>

          {selectedPass && selectedPassMeta ? (
            <div
              className={cn(
                'p-4 rounded-lg border',
                selectedPassMeta.tierConfig.bgColor,
                selectedPassMeta.tierConfig.borderColor
              )}
            >
              <div className="flex items-center justify-between mb-3">
                <div>
                  <span
                    className={cn(
                      'text-lg font-bold',
                      selectedPassMeta.tierConfig.color
                    )}
                  >
                    {selectedPassMeta.tierConfig.name}
                  </span>
                </div>
                <div className="text-right">
                  <div className="text-sm text-neutral-400">Companion Slots</div>
                  <div className="text-white font-bold">
                    {selectedPass.currentCompanions} /{' '}
                    {selectedPass.maxCompanions >= 999
                      ? '∞'
                      : selectedPass.maxCompanions}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-neutral-400">Access Level:</span>
                  <span className={cn('font-medium', selectedPassMeta.tierConfig.color)}>
                    {selectedPass.tier === 'go'
                      ? 'Regular Nunu'
                      : selectedPass.tier === 'run'
                        ? 'Certified Nunu'
                        : 'Shangzhe (Founders)'}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-neutral-400">Slots Available:</span>
                  <span className="text-white font-medium">
                    {selectedPassMeta.slotsAvailable >= 999
                      ? 'Unlimited'
                      : selectedPassMeta.slotsAvailable}
                  </span>
                </div>
              </div>

              {selectedPassMeta.slotsAvailable > 0 && (
                <Link
                  href={`/space?month=${activeMonth}`}
                  className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-white/10 text-white font-medium hover:bg-white/20 transition-colors"
                >
                  Find Nunus for {formatMonthCompact(activeMonth)}
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </Link>
              )}
            </div>
          ) : (
            <div className="p-4 rounded-lg bg-neutral-800/50 border border-neutral-700/50 text-center">
              <p className="text-neutral-400 mb-3">
                No pass for this month
              </p>
              <Link
                href="/shop?category=duo"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary-500 text-white text-sm font-medium hover:bg-primary-600 transition-colors"
              >
                Buy {formatMonthCompact(activeMonth)} Pass
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default DuoCalendarView;
