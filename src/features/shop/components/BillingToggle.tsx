'use client';

import { cn } from '@/lib/utils';

export type BillingCycle = 'monthly' | 'yearly';

interface BillingToggleProps {
  value: BillingCycle;
  onChange: (value: BillingCycle) => void;
  className?: string;
}

export function BillingToggle({ value, onChange, className }: BillingToggleProps) {
  return (
    <div className={cn('inline-flex rounded-lg bg-neutral-800 p-1', className)}>
      <button
        type="button"
        className={cn(
          'px-4 py-2 rounded-md text-sm font-medium transition-colors',
          value === 'monthly'
            ? 'bg-neutral-700 text-white shadow'
            : 'text-neutral-400 hover:text-white'
        )}
        onClick={() => onChange('monthly')}
      >
        Monthly
      </button>
      <button
        type="button"
        className={cn(
          'px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2',
          value === 'yearly'
            ? 'bg-neutral-700 text-white shadow'
            : 'text-neutral-400 hover:text-white'
        )}
        onClick={() => onChange('yearly')}
      >
        Yearly
        <span className="text-xs font-bold text-green-400 bg-green-400/10 px-1.5 py-0.5 rounded">
          Save 17%
        </span>
      </button>
    </div>
  );
}
