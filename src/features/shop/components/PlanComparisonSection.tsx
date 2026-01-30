'use client';

import { useState } from 'react';
import { motion } from 'motion/react';
import { Button, Badge } from '@/components/atoms';
import { CheckIcon } from '@/components/icons';
import { usePlanStatus } from '../hooks/usePlanStatus';
import { PLAN_INFO } from '../data/comparisons';
import { PLANS, formatPrice, getYearlySavings } from '../data/plans';
import { cn } from '@/lib/utils';
import type { PlanType } from '../types';

type BillingCycle = 'monthly' | 'yearly';

// Plan styling configuration
const PLAN_STYLES: Record<PlanType, {
  color: string;
  border: string;
  gradient: string;
}> = {
  explorer: {
    color: 'text-primary-400',
    border: 'border-primary-500/30',
    gradient: 'from-primary-500/10 to-transparent',
  },
  traveler: {
    color: 'text-accent-400',
    border: 'border-accent-500/30',
    gradient: 'from-accent-500/10 to-transparent',
  },
  voyager: {
    color: 'text-purple-400',
    border: 'border-purple-500/50',
    gradient: 'from-purple-500/15 to-transparent',
  },
  enterprise: {
    color: 'text-emerald-400',
    border: 'border-emerald-500/30',
    gradient: 'from-emerald-500/10 to-transparent',
  },
};

export function PlanComparisonSection() {
  const { currentPlan, isGuest } = usePlanStatus();
  const [billingCycle, setBillingCycle] = useState<BillingCycle>('yearly');

  // Plan order for desktop: explorer, traveler, voyager, enterprise
  // Plan order for mobile: explorer, voyager, traveler, enterprise (voyager promoted early)
  const desktopPlanOrder: PlanType[] = ['explorer', 'traveler', 'voyager', 'enterprise'];
  const mobilePlanOrder: PlanType[] = ['explorer', 'voyager', 'traveler', 'enterprise'];

  const currentPlanIndex = currentPlan ? desktopPlanOrder.indexOf(currentPlan as PlanType) : -1;

  function getPlanIndex(planType: PlanType): number {
    return desktopPlanOrder.indexOf(planType);
  }

  function isCurrent(planType: PlanType): boolean {
    return currentPlan === planType;
  }

  function getButtonText(planType: PlanType): string {
    // Enterprise always shows custom CTA
    const plan = PLANS.find((p) => p.planType === planType);
    if (plan?.ctaText && planType === 'enterprise') return plan.ctaText;

    if (isCurrent(planType)) return 'Current Plan';
    if (isGuest) {
      return planType === 'explorer' ? 'Start Free Now' : 'Get Started';
    }
    if (getPlanIndex(planType) > currentPlanIndex) return 'Upgrade';
    return 'Downgrade';
  }

  function getButtonVariant(planType: PlanType): 'primary' | 'secondary' | 'ghost' {
    // Current plan is gray (secondary)
    if (isCurrent(planType)) return 'secondary';
    // For guests: Explorer is primary (green), others are secondary (gray)
    if (isGuest && planType !== 'explorer') return 'secondary';
    return 'primary';
  }

  function isButtonDisabledForGuest(planType: PlanType): boolean {
    // For guests, disable all non-Explorer buttons to encourage free sign-up first
    return isGuest && planType !== 'explorer';
  }

  function handleCtaClick(planType: PlanType) {
    const plan = PLANS.find((p) => p.planType === planType);
    if (plan?.ctaLink) {
      window.open(plan.ctaLink, '_blank', 'noopener,noreferrer');
    }
    // TODO: Add analytics tracking
    // TODO: Handle plan selection/checkout for non-external links
  }

  function renderPlanCard(planType: PlanType, index: number) {
    const plan = PLANS.find((p) => p.planType === planType);
    const info = PLAN_INFO[planType];
    if (!plan || !info) return null;

    const isFree = plan.price === 0;
    const isEnterprise = planType === 'enterprise';
    const isPromoted = plan.promoted;
    const yearlySavings = getYearlySavings(plan);
    const isExplorerForGuest = isGuest && planType === 'explorer';

    return (
      <motion.div
        key={planType}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
        className={cn(
          'relative rounded-2xl p-6 border-2 bg-gradient-to-b transition-all flex flex-col',
          isCurrent(planType)
            ? `${PLAN_STYLES[planType].border} ${PLAN_STYLES[planType].gradient}`
            : 'border-neutral-700/50 hover:border-neutral-600',
          isPromoted && !isCurrent(planType) && !isGuest && 'border-purple-500/60 shadow-lg shadow-purple-500/10',
          // Special glowing effect for Explorer when guest
          isExplorerForGuest && 'animate-glow-pulse border-green-500 bg-gradient-to-b from-green-500/15 to-transparent scale-[1.02]',
          // Dim other cards when guest to draw attention to Explorer
          isGuest && planType !== 'explorer' && 'opacity-60'
        )}
      >
        {/* Badges */}
        {isCurrent(planType) && (
          <div className="absolute -top-3 left-1/2 -translate-x-1/2">
            <Badge variant="primary">Current</Badge>
          </div>
        )}
        {/* Special "Start Here" badge for Explorer when guest */}
        {isExplorerForGuest && (
          <div className="absolute -top-3 left-1/2 -translate-x-1/2">
            <Badge variant="default" className="bg-green-500 text-white font-bold">
              ✨ Start Here - FREE
            </Badge>
          </div>
        )}
        {!isCurrent(planType) && !isExplorerForGuest && isPromoted && !isGuest && (
          <div className="absolute -top-3 left-1/2 -translate-x-1/2">
            <Badge variant="default" className="bg-purple-600 text-white">
              <span className="mr-1">⚡</span>Most Recommended
            </Badge>
          </div>
        )}
        {!isCurrent(planType) && !isExplorerForGuest && plan.isPopular && !isPromoted && (
          <div className="absolute -top-3 left-1/2 -translate-x-1/2">
            <Badge variant="warning">Popular</Badge>
          </div>
        )}

        {/* Plan Name & Description */}
        <h3 className={cn('text-2xl font-bold mb-1', PLAN_STYLES[planType].color)}>
          {info.name}
        </h3>
        <p className="text-sm text-neutral-400 mb-4">{plan.description}</p>

        {/* Price */}
        <div className="mb-6 min-h-[80px]">
          {isFree ? (
            <>
              <div className="text-4xl font-bold text-white">FREE</div>
              <div className="text-sm text-neutral-500">Forever</div>
            </>
          ) : isEnterprise ? (
            <>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-white">
                  Custom Pricing
                </span>
              </div>
              <div className="text-sm text-neutral-500">Contact us for a quote</div>
            </>
          ) : billingCycle === 'yearly' ? (
            <>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold text-white">
                  {formatPrice(plan.yearlyPrice)}
                </span>
                <span className="text-neutral-400">/yr</span>
              </div>
              <div className="text-sm text-green-400 font-medium">
                Save {formatPrice(yearlySavings)} / year
              </div>
            </>
          ) : (
            <>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold text-white">
                  {formatPrice(plan.price)}
                </span>
                <span className="text-neutral-400">/mo</span>
              </div>
              <div className="text-sm text-neutral-500">Billed monthly</div>
            </>
          )}
        </div>

        {/* Feature Bullets */}
        <ul className="space-y-2 mb-6 flex-grow">
          {plan.features.map((feature, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-neutral-300">
              <CheckIcon size="sm" className="mt-0.5 flex-shrink-0 text-green-500" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>

        {/* CTA Button */}
        <Button
          variant={getButtonVariant(planType)}
          size="lg"
          className={cn(
            'w-full',
            // Special green styling for Explorer when guest
            isExplorerForGuest && 'bg-green-500 hover:bg-green-600 text-white font-bold'
          )}
          disabled={isCurrent(planType) || isButtonDisabledForGuest(planType)}
          onClick={() => handleCtaClick(planType)}
          aria-label={`${getButtonText(planType)} - ${info.name} plan`}
        >
          {getButtonText(planType)}
        </Button>
      </motion.div>
    );
  }

  return (
    <div className="space-y-8 py-8">
      {/* Pricing Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        {/* Pill Badge */}
        <div className="flex justify-center mb-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-800 border border-neutral-700 text-sm font-medium text-neutral-300">
            <span className="text-yellow-400">⚡</span>
            Pricing
          </span>
        </div>

        {/* Title */}
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
          Curated Pricing Structure
        </h2>

        {/* Subtitle */}
        <p className="text-neutral-400 mb-8">
          Start free and upgrade as you grow.
        </p>

        {/* Billing Toggle - Simplified: Monthly | Yearly (no Save 17% badge) */}
        <div className="flex justify-center">
          <div className="inline-flex rounded-xl bg-neutral-800/80 p-1.5 border border-neutral-700">
            <button
              type="button"
              className={cn(
                'px-6 py-2.5 rounded-lg text-sm font-semibold transition-all',
                billingCycle === 'monthly'
                  ? 'bg-white text-neutral-900 shadow-lg'
                  : 'text-neutral-400 hover:text-white'
              )}
              onClick={() => setBillingCycle('monthly')}
              aria-pressed={billingCycle === 'monthly'}
            >
              Monthly
            </button>
            <button
              type="button"
              className={cn(
                'px-6 py-2.5 rounded-lg text-sm font-semibold transition-all',
                billingCycle === 'yearly'
                  ? 'bg-white text-neutral-900 shadow-lg'
                  : 'text-neutral-400 hover:text-white'
              )}
              onClick={() => setBillingCycle('yearly')}
              aria-pressed={billingCycle === 'yearly'}
            >
              Yearly
            </button>
          </div>
        </div>
      </motion.div>

      {/* Plan Cards Grid */}
      {/* Desktop: 4-column grid */}
      <div className="hidden lg:grid lg:grid-cols-4 gap-6">
        {desktopPlanOrder.map((planType, index) => renderPlanCard(planType, index))}
      </div>

      {/* Tablet: 2-column grid */}
      <div className="hidden md:grid md:grid-cols-2 lg:hidden gap-6">
        {desktopPlanOrder.map((planType, index) => renderPlanCard(planType, index))}
      </div>

      {/* Mobile: 1-column stack with Voyager promoted to second position */}
      <div className="grid grid-cols-1 md:hidden gap-6">
        {mobilePlanOrder.map((planType, index) => renderPlanCard(planType, index))}
      </div>
    </div>
  );
}
