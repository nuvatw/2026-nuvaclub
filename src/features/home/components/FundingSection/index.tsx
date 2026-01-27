'use client';

import { useState } from 'react';
import { motion } from 'motion/react';
import { Badge, Card, CardContent } from '@/components/atoms';
import {
  CAMPAIGN_CONFIG,
  FUNDING_CONTENT,
  FUNDING_TIERS,
  CUSTOM_TIER_CONFIG,
} from '@/Database/content/home-content';
import { AnimatedCounter } from './AnimatedCounter';
import { TierCard } from './TierCard';
import { CustomTierCard } from './CustomTierCard';
import { AttendeeSelectionModal } from '../AttendeeSelectionModal';

interface SelectedTier {
  id: string;
  name: string;
  amount: number;
  months: number;
}

interface FundingSectionProps {
  tiersRef: React.RefObject<HTMLElement | null>;
  progressRef: React.RefObject<HTMLDivElement | null>;
  raisedAmount: number;
  goalAmount: number;
  currency: string;
  resetCampaign: () => void;
  isHydrated: boolean;
}

export function FundingSection({
  tiersRef,
  progressRef,
  raisedAmount,
  goalAmount,
  currency,
  resetCampaign,
  isHydrated,
}: FundingSectionProps) {
  const [showAttendeeModal, setShowAttendeeModal] = useState(false);
  const [selectedTier, setSelectedTier] = useState<SelectedTier | null>(null);

  const progressPercent = Math.min((raisedAmount / goalAmount) * 100, 100);
  const remaining = goalAmount - raisedAmount;

  // Handle tier selection - show attendee modal
  const handleSelectTier = (tier: (typeof FUNDING_TIERS)[number]) => {
    setSelectedTier({
      id: tier.id,
      name: tier.name,
      amount: tier.price,
      months: tier.getMonths,
    });
    setShowAttendeeModal(true);
  };

  // Handle custom amount selection
  const handleSelectCustom = (amount: number) => {
    // ceil(amount / 400) so average never exceeds 400
    const totalMonths = Math.ceil(amount / CAMPAIGN_CONFIG.customTierMonthlyPrice);

    setSelectedTier({
      id: 'tier-custom',
      name: CUSTOM_TIER_CONFIG.name,
      amount,
      months: totalMonths,
    });
    setShowAttendeeModal(true);
  };

  const handleCloseAttendeeModal = () => {
    setShowAttendeeModal(false);
    setSelectedTier(null);
  };

  return (
    <section ref={tiersRef} className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <Badge variant="warning" className="mb-4">
            {FUNDING_CONTENT.badge}
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            {FUNDING_CONTENT.headline}
          </h2>
          <p className="text-neutral-400 text-lg max-w-2xl mx-auto">
            {FUNDING_CONTENT.subheadline}
          </p>
        </motion.div>

        {/* Progress Bar */}
        <motion.div
          ref={progressRef}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto mb-12"
        >
          <Card className="bg-neutral-900/80">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-neutral-400 text-sm">募資進度</p>
                  <p className="text-3xl font-bold text-white">
                    {isHydrated ? (
                      <AnimatedCounter
                        value={raisedAmount}
                        currency={currency}
                      />
                    ) : (
                      `${currency}0`
                    )}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-neutral-400 text-sm">目標</p>
                  <p className="text-xl font-semibold text-neutral-300">
                    {currency}
                    {goalAmount.toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Progress Bar */}
              <div
                className="h-4 bg-neutral-800 rounded-full overflow-hidden mb-3"
                role="progressbar"
                aria-valuenow={raisedAmount}
                aria-valuemin={0}
                aria-valuemax={goalAmount}
                aria-label={`募資進度: ${currency}${raisedAmount.toLocaleString()} / ${currency}${goalAmount.toLocaleString()}`}
              >
                <motion.div
                  className="h-full bg-gradient-to-r from-primary-500 to-accent-500 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercent}%` }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                />
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-primary-400 font-semibold">
                  {progressPercent.toFixed(1)}% 達成
                </span>
                <span className="text-neutral-500">
                  還差 {currency}
                  {remaining.toLocaleString()}
                </span>
              </div>

              {/* Dev Reset Button */}
              {process.env.NODE_ENV !== 'production' && (
                <button
                  onClick={resetCampaign}
                  className="mt-4 text-xs text-neutral-600 hover:text-neutral-400 underline"
                >
                  [DEV] Reset Demo
                </button>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Tier Cards - 3 fixed tiers + 1 custom */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {FUNDING_TIERS.map((tier, index) => (
            <motion.div
              key={tier.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <TierCard tier={tier} onSelect={() => handleSelectTier(tier)} />
            </motion.div>
          ))}

          {/* Custom Tier Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <CustomTierCard
              onSelect={handleSelectCustom}
              minPrice={CUSTOM_TIER_CONFIG.minPrice}
            />
          </motion.div>
        </div>

        {/* Attendee Selection Modal */}
        {selectedTier && (
          <AttendeeSelectionModal
            isOpen={showAttendeeModal}
            onClose={handleCloseAttendeeModal}
            tierName={selectedTier.name}
            amount={selectedTier.amount}
            months={selectedTier.months}
            tierId={selectedTier.id}
            onConfirm={() => {}}
          />
        )}
      </div>
    </section>
  );
}
