'use client';

import { motion } from 'motion/react';
import { Button, Card, CardContent, Badge } from '@/components/atoms';
import { ArrowRightIcon, CheckIcon } from '@/components/icons';
import { cn } from '@/lib/utils';
import { useHomeContent } from '../../hooks/useHomeContent';
import { PerkIcon } from '../../utils/icons';

interface TierCardProps {
  tier: any; // Using any for now to avoid literal type mismatch with localized data
  onSelect: () => void;
}

export function TierCard({ tier, onSelect }: TierCardProps) {
  const { funding } = useHomeContent();
  const { tierCard: labels } = funding;

  const savings = tier.originalValue - tier.price;
  const savingsPercent = Math.round((savings / tier.originalValue) * 100);
  const avgMonthlyPrice = Math.round(tier.price / tier.getMonths);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="h-full"
    >
      {/* Container with subtle glow that respects rounded corners */}
      <div className={cn(
        'h-full relative rounded-2xl',
        tier.highlight && 'shadow-[0_0_25px_rgba(59,130,246,0.15),0_0_50px_rgba(59,130,246,0.08)]'
      )}>
        <Card
          className={cn(
            'h-full relative overflow-hidden transition-all duration-300 cursor-pointer rounded-2xl',
            tier.highlight
              ? 'border-2 border-primary-500/60 bg-gradient-to-b from-primary-500/8 to-transparent'
              : 'border-neutral-700 hover:border-neutral-600'
          )}
          onClick={onSelect}
        >
          {/* Best Value Badge */}
          {tier.badge && (
            <div
              className={cn(
                'absolute top-0 right-0 px-4 py-1 text-xs font-bold rounded-bl-lg',
                tier.highlight
                  ? 'bg-primary-500 text-white'
                  : 'bg-amber-500 text-black'
              )}
            >
              {tier.badge}
            </div>
          )}

          <CardContent className="p-6">
            {/* Header */}
            <div className="mb-4">
              <h3 className="text-2xl font-bold text-white">{tier.name}</h3>
              <p className="text-neutral-400 text-sm">{tier.subtitle}</p>
            </div>

            {/* Price */}
            <div className="mb-4">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl sm:text-4xl font-bold text-white">
                  NT${tier.price.toLocaleString()}
                </span>
              </div>
              Line 67:               <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold text-white">
                  NT${tier.price.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-neutral-500 line-through text-sm">
                  NT${tier.originalValue.toLocaleString()}
                </span>
                <Badge variant="success" size="sm">
                  {labels.save} {savingsPercent}%
                </Badge>
              </div>
            </div>

            {/* Months Math */}
            <div className="bg-neutral-800 rounded-lg p-3 mb-4">
              <div className="flex items-center justify-between text-[11px] sm:text-sm">
                <span className="text-neutral-400">
                  {labels.payMonths} {tier.payMonths} {labels.months}
                </span>
                <ArrowRightIcon size="sm" className="text-neutral-500 mx-1" />
                <span className="text-green-400 font-semibold">
                  {labels.getMonths} {tier.getMonths} {labels.months}
                </span>
              </div>
              <div className="mt-2 pt-2 border-t border-neutral-700 flex items-center justify-between text-[11px] sm:text-sm">
                <span className="text-neutral-500">{labels.avgMonthly}</span>
                <div className="flex items-center gap-1.5">
                  <span className="text-neutral-600 line-through text-[10px] sm:text-xs">NT$990</span>
                  <span className="text-green-400 font-semibold text-xs sm:text-sm">NT${avgMonthlyPrice}</span>
                </div>
              </div>
            </div>

            {/* Perks */}
            <ul className="space-y-2 mb-4">
              {tier.perks.map((perk: string) => (
                <li key={perk} className="flex items-start gap-2 text-sm">
                  <CheckIcon size="sm" className="text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-neutral-300">{perk}</span>
                </li>
              ))}
            </ul>

            {/* Exclusive Perks */}
            {'exclusivePerks' in tier && tier.exclusivePerks && (
              <div className="mt-4 pt-4 border-t border-neutral-700">
                <p className="text-xs text-amber-400 font-semibold mb-3 uppercase tracking-wide">
                  {labels.exclusivePerks}
                </p>
                <div className="space-y-2">
                  {tier.exclusivePerks.map((perk: { icon: string; title: string }) => (
                    <div
                      key={perk.title}
                      className="flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 rounded-lg px-3 py-2"
                    >
                      <PerkIcon icon={perk.icon} className="text-amber-400 flex-shrink-0" />
                      <p className="text-amber-300 font-medium text-sm">
                        {perk.title}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Limited Qty */}
            {tier.limitedQty && (
              <div className="mt-4 text-center">
                <Badge variant="error" size="sm">
                  {labels.limited} {tier.limitedQty} {labels.limitedUnit}
                </Badge>
              </div>
            )}

            {/* CTA Button */}
            <div className="mt-4">
              <Button
                variant={tier.highlight ? 'primary' : 'outline'}
                className={cn(
                  'w-full font-semibold',
                  tier.highlight && 'shadow-lg shadow-primary-500/30'
                )}
                onClick={(e) => {
                  e.stopPropagation();
                  onSelect();
                }}
              >
                {labels.selectPlan}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}
