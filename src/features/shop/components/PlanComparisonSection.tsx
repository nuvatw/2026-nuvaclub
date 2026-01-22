'use client';

import { motion } from 'motion/react';
import { Button, Badge, Card, CardContent } from '@/components/atoms';
import { usePlanStatus } from '../hooks/usePlanStatus';
import { PLAN_COMPARISON, PLAN_INFO } from '../data/comparisons';
import { cn } from '@/lib/utils';

const CheckIcon = () => (
  <svg
    className="w-5 h-5 text-green-500"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M5 13l4 4L19 7"
    />
  </svg>
);

const XIcon = () => (
  <svg
    className="w-5 h-5 text-neutral-500"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M6 18L18 6M6 6l12 12"
    />
  </svg>
);

export function PlanComparisonSection() {
  const { currentPlan, isGuest, isPlanExplorer, isTraveler } = usePlanStatus();

  return (
    <div className="space-y-8">
      {/* Current Status */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h2 className="text-2xl font-bold text-white mb-2">Choose Your Plan</h2>
        <p className="text-neutral-400 mb-4">
          Select the plan that fits you and start your learning journey
        </p>
        {currentPlan && (
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-neutral-800">
            <span className="text-neutral-400">Current Plan:</span>
            <Badge variant={isTraveler ? 'primary' : 'default'}>
              {currentPlan === 'explorer' ? 'Explorer' : 'Traveler'}
            </Badge>
          </div>
        )}
        {isGuest && (
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-neutral-800">
            <span className="text-neutral-400">Not logged in</span>
          </div>
        )}
      </motion.div>

      {/* Plan Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {/* Explorer Plan */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card
            className={cn(
              'h-full relative',
              isPlanExplorer && 'ring-2 ring-primary-500'
            )}
          >
            {isPlanExplorer && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <Badge variant="primary">Current Plan</Badge>
              </div>
            )}
            <CardContent className="pt-6">
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-white mb-1">
                  {PLAN_INFO.explorer.name}
                </h3>
                <div className="text-3xl font-bold text-primary-400 mb-2">
                  {PLAN_INFO.explorer.priceLabel}
                </div>
                <p className="text-sm text-neutral-400">
                  {PLAN_INFO.explorer.description}
                </p>
              </div>

              <div className="space-y-3 mb-6">
                {PLAN_COMPARISON.map((item) => (
                  <div
                    key={item.feature}
                    className="flex items-center gap-3"
                  >
                    {item.explorer ? <CheckIcon /> : <XIcon />}
                    <span
                      className={cn(
                        'text-sm',
                        item.explorer ? 'text-white' : 'text-neutral-500'
                      )}
                    >
                      {item.feature}
                    </span>
                  </div>
                ))}
              </div>

              {isGuest && (
                <Button className="w-full" variant="secondary">
                  Log in to start
                </Button>
              )}
              {isPlanExplorer && (
                <Button className="w-full" variant="secondary" disabled>
                  Current Plan
                </Button>
              )}
              {isTraveler && (
                <Button className="w-full" variant="ghost" disabled>
                  Upgraded
                </Button>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Traveler Plan */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card
            className={cn(
              'h-full relative',
              isTraveler && 'ring-2 ring-primary-500'
            )}
          >
            {isTraveler && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <Badge variant="primary">Current Plan</Badge>
              </div>
            )}
            {!isTraveler && (
              <div className="absolute -top-3 right-4">
                <Badge variant="warning">Recommended</Badge>
              </div>
            )}
            <CardContent className="pt-6">
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-white mb-1">
                  {PLAN_INFO.traveler.name}
                </h3>
                <div className="text-3xl font-bold text-accent-400 mb-2">
                  {PLAN_INFO.traveler.priceLabel}
                </div>
                <p className="text-sm text-neutral-400">
                  {PLAN_INFO.traveler.description}
                </p>
              </div>

              <div className="space-y-3 mb-6">
                {PLAN_COMPARISON.map((item) => (
                  <div
                    key={item.feature}
                    className="flex items-center gap-3"
                  >
                    {item.traveler ? <CheckIcon /> : <XIcon />}
                    <span
                      className={cn(
                        'text-sm',
                        item.traveler ? 'text-white' : 'text-neutral-500'
                      )}
                    >
                      {item.feature}
                    </span>
                  </div>
                ))}
              </div>

              {isGuest && (
                <Button className="w-full">
                  Log in to upgrade
                </Button>
              )}
              {isPlanExplorer && (
                <Button className="w-full">
                  Upgrade to Traveler
                </Button>
              )}
              {isTraveler && (
                <Button className="w-full" variant="secondary" disabled>
                  Current Plan
                </Button>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
