'use client';

import { motion } from 'motion/react';
import { Button, Badge, Card, CardContent } from '@/components/atoms';
import { usePlanStatus } from '../hooks/usePlanStatus';
import { DUO_COMPARISON, DUO_INFO } from '../data/comparisons';
import type { DuoType } from '../types';
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

const DUO_COLORS: Record<DuoType, { bg: string; text: string; ring: string }> = {
  solo: {
    bg: 'bg-neutral-700',
    text: 'text-neutral-300',
    ring: 'ring-neutral-500',
  },
  go: {
    bg: 'bg-green-600/20',
    text: 'text-green-400',
    ring: 'ring-green-500',
  },
  run: {
    bg: 'bg-purple-600/20',
    text: 'text-purple-400',
    ring: 'ring-purple-500',
  },
  fly: {
    bg: 'bg-amber-600/20',
    text: 'text-amber-400',
    ring: 'ring-amber-500',
  },
};

interface DuoCardProps {
  duoType: DuoType;
  isCurrentDuo: boolean;
  isGuest: boolean;
  delay: number;
}

function DuoCard({ duoType, isCurrentDuo, isGuest, delay }: DuoCardProps) {
  const info = DUO_INFO[duoType];
  const colors = DUO_COLORS[duoType];

  const getFeatureValue = (feature: { solo: boolean; go: boolean; run: boolean; fly: boolean }) => {
    return feature[duoType];
  };

  const canPurchase = duoType !== 'solo';
  const isRecommended = duoType === 'run';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="flex-1 min-w-[200px]"
    >
      <Card
        className={cn(
          'h-full relative',
          isCurrentDuo && `ring-2 ${colors.ring}`
        )}
      >
        {isCurrentDuo && (
          <div className="absolute -top-3 left-1/2 -translate-x-1/2">
            <Badge variant="primary">Current Status</Badge>
          </div>
        )}
        {isRecommended && !isCurrentDuo && (
          <div className="absolute -top-3 right-4">
            <Badge variant="warning">Recommended</Badge>
          </div>
        )}
        <CardContent className="pt-6">
          <div className="text-center mb-4">
            <div
              className={cn(
                'w-12 h-12 mx-auto rounded-full flex items-center justify-center mb-3',
                colors.bg
              )}
            >
              <span className={cn('font-bold text-lg', colors.text)}>
                {duoType === 'solo' ? 'S' : duoType.charAt(0).toUpperCase()}
              </span>
            </div>
            <h3 className="text-lg font-bold text-white mb-1">{info.name}</h3>
            <div className={cn('text-2xl font-bold mb-1', colors.text)}>
              {info.priceLabel}
            </div>
            {info.period && (
              <div className="text-sm text-neutral-400">{info.period}</div>
            )}
            <p className="text-xs text-neutral-500 mt-2">{info.description}</p>
          </div>

          <div className="space-y-2 mb-4">
            {DUO_COMPARISON.map((item) => (
              <div key={item.feature} className="flex items-center gap-2">
                {getFeatureValue(item) ? (
                  <CheckIcon />
                ) : (
                  <XIcon />
                )}
                <span
                  className={cn(
                    'text-xs',
                    getFeatureValue(item) ? 'text-white' : 'text-neutral-500'
                  )}
                >
                  {item.feature}
                </span>
              </div>
            ))}
          </div>

          {duoType === 'solo' ? (
            <Button className="w-full" variant="ghost" disabled size="sm">
              Default Status
            </Button>
          ) : isCurrentDuo ? (
            <Button className="w-full" variant="secondary" disabled size="sm">
              Current Status
            </Button>
          ) : isGuest ? (
            <Button className="w-full" size="sm">
              Log in to purchase
            </Button>
          ) : (
            <Button className="w-full" size="sm">
              Buy {info.name}
            </Button>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

export function DuoComparisonSection() {
  const { currentDuo, isGuest, isSolo, hasDuoAccess } = usePlanStatus();

  const duoTypes: DuoType[] = ['solo', 'go', 'run', 'fly'];

  return (
    <div className="space-y-8">
      {/* Current Status */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h2 className="text-2xl font-bold text-white mb-2">Duo Ticket</h2>
        <p className="text-neutral-400 mb-4">
          Choose your companion plan and enter Space to find your partner
        </p>
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-neutral-800">
          <span className="text-neutral-400">Current Status:</span>
          <Badge
            variant={hasDuoAccess ? 'primary' : 'default'}
            className={cn(hasDuoAccess && DUO_COLORS[currentDuo].bg)}
          >
            {DUO_INFO[currentDuo].name}
          </Badge>
        </div>
      </motion.div>

      {/* Duo Cards */}
      <div className="flex flex-col lg:flex-row gap-4 max-w-5xl mx-auto">
        {duoTypes.map((duoType, index) => (
          <DuoCard
            key={duoType}
            duoType={duoType}
            isCurrentDuo={currentDuo === duoType}
            isGuest={isGuest}
            delay={0.1 + index * 0.1}
          />
        ))}
      </div>

      {/* Info Box */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="max-w-2xl mx-auto"
      >
        <Card className="bg-neutral-800/30 border-neutral-700">
          <CardContent>
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-primary-600/20 flex items-center justify-center flex-shrink-0">
                <svg
                  className="w-5 h-5 text-primary-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div>
                <h4 className="font-medium text-white mb-1">
                  What is a Duo Ticket?
                </h4>
                <p className="text-sm text-neutral-400">
                  Duo Ticket lets you enter Space and match with a companion for learning together.
                  Different ticket levels match you with different companion types: Nunu, Certified Nunu, or founder Shang-Zhe.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
