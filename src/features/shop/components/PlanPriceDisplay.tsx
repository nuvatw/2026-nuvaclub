'use client';

import type { PlanProduct } from '@/features/shop/types';
import type { BillingCycle } from './BillingToggle';
import { getYearlySavings, getYearlyMonthlyEquivalent, formatPrice } from '../data/plans';

interface PlanPriceDisplayProps {
  plan: PlanProduct;
  billingCycle: BillingCycle;
  colorClass?: string;
}

export function PlanPriceDisplay({
  plan,
  billingCycle,
  colorClass = 'text-primary-400',
}: PlanPriceDisplayProps) {
  // Free plan
  if (plan.price === 0) {
    return (
      <div className="text-center">
        <div className={`text-3xl font-bold ${colorClass}`}>FREE</div>
        <div className="text-sm text-neutral-400">Forever</div>
      </div>
    );
  }

  // Yearly billing
  if (billingCycle === 'yearly') {
    const monthlyEquivalent = getYearlyMonthlyEquivalent(plan);
    const savings = getYearlySavings(plan);

    return (
      <div className="text-center">
        <div className={`text-3xl font-bold ${colorClass}`}>
          {formatPrice(monthlyEquivalent)}
        </div>
        <div className="text-sm text-neutral-400">/month</div>
        <div className="mt-2 text-sm">
          <span className="font-medium text-white">{formatPrice(plan.yearlyPrice)}</span>
          <span className="text-neutral-400"> billed yearly</span>
        </div>
        <div className="mt-1 text-xs text-green-400 font-medium">
          Save {formatPrice(savings)}/year
        </div>
      </div>
    );
  }

  // Monthly billing
  return (
    <div className="text-center">
      <div className={`text-3xl font-bold ${colorClass}`}>
        {formatPrice(plan.price)}
      </div>
      <div className="text-sm text-neutral-400">/month</div>
    </div>
  );
}
