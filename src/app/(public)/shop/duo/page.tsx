'use client';

import { useState, useMemo, useCallback } from 'react';
import { Button } from '@/components/atoms';
import {
  InformationCircleIcon,
  QuestionMarkCircleIcon,
  ClockIcon,
} from '@/components/icons';
import {
  DuoPurchaseTimeline,
  DuoMonthSelectorModal,
  type MonthEntitlement,
  type PurchasePricing,
} from '@/features/shop/components';
import { useDuoMonthPasses, type TimelineMonth } from '@/features/duo/hooks/useDuoMonthPasses';
import type { DuoTier } from '@/features/duo/types';
import { DUO_TIER_CONFIG } from '@/features/duo/types';
import { cn } from '@/lib/utils';

/**
 * Detailed tier descriptions for the "What's the difference?" section.
 * Aligned with the platform's course taxonomy:
 * - Course (basic)
 * - Nunu Course (mentor training)
 * - Nunu Verified Course (official certification)
 */
const DUO_TIER_DESCRIPTIONS: Record<
  DuoTier,
  {
    name: string;
    tagline: string;
    color: string;
    bgColor: string;
    borderColor: string;
    features: string[];
    requirement?: string;
  }
> = {
  go: {
    name: 'Go',
    tagline: 'Start your mentorship journey',
    color: 'text-green-400',
    bgColor: 'bg-green-500/10',
    borderColor: 'border-green-500/30',
    features: [
      'Match with a Nunu mentor in Space',
      'Nunu actively checks in and tracks your progress',
      'Receive guidance and support throughout your learning',
      'Produce a tangible project output each quarter',
    ],
  },
  run: {
    name: 'Run',
    tagline: 'Access verified professionals',
    color: 'text-amber-400',
    bgColor: 'bg-amber-500/10',
    borderColor: 'border-amber-500/30',
    features: [
      'Match with regular Nunu mentors',
      'Match with Verified Nunu mentors',
      'Verified Nunus have completed the official Nunu Verified Course',
      'Verified Nunus have a Domain expertise + seasonal Domain know-how',
    ],
    requirement: 'Verified Nunu requires official qualification via Nunu Verified Course',
  },
  fly: {
    name: 'Fly',
    tagline: 'Premium special mentor access',
    color: 'text-red-400',
    bgColor: 'bg-red-500/10',
    borderColor: 'border-red-500/30',
    features: [
      'Match with Special Nunu mentors (founders & experts)',
      'Special Nunus are officially certified via Nunu Verified Course',
      'Unlimited companion slots for multiple mentorship tracks',
      '1:1 career consulting and AI strategy planning',
    ],
    requirement: 'Special Nunu requires official certification',
  },
};

// Category info for Duo
const DUO_INFO = {
  introduction: {
    title: 'About Duo Passes',
    description: 'Duo passes unlock mentorship matching in Space. Choose Go (NT$990/mo) for regular Nunu mentors, Run (NT$2,490/mo) for certified professionals with more matches, or Fly (NT$4,990/mo) for unlimited access including special mentors. Purchase specific months and upgrade anytime - you only pay the difference!',
  },
  faq: [
    { question: 'What\'s the difference between Go, Run, and Fly?', answer: 'Go (NT$990/mo) lets you match with 1 regular Nunu mentor. Run (NT$2,490/mo) gives you Verified Nunu mentors who completed official certification. Fly (NT$4,990/mo) provides unlimited matches including access to Special Nunu mentors (founders) with 1:1 career consulting.' },
    { question: 'Can I upgrade between tiers?', answer: 'Yes! You can upgrade Go→Run, Go→Fly, or Run→Fly and only pay the difference. Your existing companion slots are preserved.' },
    { question: 'What happens if I buy the same month twice?', answer: 'You cannot purchase the same tier for a month you already own. The system prevents duplicate purchases automatically.' },
    { question: 'Can I downgrade to a lower tier?', answer: 'No, downgrades are not allowed. Once you have a higher tier (Run or Fly) for a month, you cannot switch to a lower tier. No refunds are provided.' },
  ],
};

// Tier Card Component
function TierCard({ tier }: { tier: DuoTier }) {
  const desc = DUO_TIER_DESCRIPTIONS[tier];
  const config = DUO_TIER_CONFIG[tier];

  return (
    <div
      className={cn(
        'rounded-xl border p-4',
        desc.bgColor,
        desc.borderColor,
        'transition-all duration-200 hover:scale-[1.02]',
      )}
    >
      <div className="flex items-center gap-2 mb-2">
        <div className={cn('w-3 h-3 rounded-full', config.bgColor.replace('/10', ''))} />
        <h4 className={cn('font-semibold', desc.color)}>{desc.name}</h4>
        <span className="text-neutral-400 text-sm ml-auto">
          NT${config.price.toLocaleString()}/mo
        </span>
      </div>
      <p className="text-sm text-neutral-400 mb-3">{desc.tagline}</p>
      <ul className="space-y-1.5">
        {desc.features.map((feature, idx) => (
          <li key={idx} className="flex items-start gap-2 text-sm text-neutral-300">
            <svg className={cn('w-4 h-4 flex-shrink-0 mt-0.5', desc.color)} fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            <span>{feature}</span>
          </li>
        ))}
      </ul>
      {desc.requirement && (
        <div className="mt-3 pt-3 border-t border-neutral-700/50">
          <p className="text-xs text-neutral-500 italic">{desc.requirement}</p>
        </div>
      )}
    </div>
  );
}

// Duo Purchase History Section
function DuoPurchaseHistorySection({
  timelineMonths,
}: {
  timelineMonths: TimelineMonth[];
}) {
  return (
    <div className="bg-neutral-800/50 rounded-xl p-6">
      <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
        <ClockIcon size="md" className="text-neutral-400" />
        Your Duo Pass History
      </h3>
      <DuoPurchaseTimeline timelineMonths={timelineMonths} />
    </div>
  );
}

export default function DuoPage() {
  // Use the real DB hook for duo month passes
  const { passes, timelineMonths, createPasses, refresh } = useDuoMonthPasses();

  // Duo month selector modal state
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Convert all passes to entitlements for the modal (including refunded for display)
  const entitlements = useMemo((): MonthEntitlement[] => {
    return passes.map((pass) => ({
      month: pass.month,
      tier: pass.tier,
      status: pass.status as 'active' | 'expired' | 'upgraded' | 'refunded',
    }));
  }, [passes]);

  // Handle direct purchase - no cart for Duo
  const handleDuoPurchase = useCallback(async (months: string[], tier: DuoTier, pricing: PurchasePricing) => {
    // Create the passes and transactions in the database
    await createPasses(months, tier);

    // Refresh to show updated data
    refresh();

    // Log success (modal stays open to show updated state)
    const totalMonths = pricing.newPurchases.length + pricing.upgrades.length;
    console.log(`Successfully purchased ${totalMonths} month(s) of Duo ${tier.toUpperCase()}!`);
  }, [createPasses, refresh]);

  // Handle modal close
  const handleModalClose = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  // Open duo modal
  const handleDuoSelectMonths = useCallback(() => {
    setIsModalOpen(true);
  }, []);

  return (
    <>
      <div className="rounded-2xl p-6 md:p-8 border border-neutral-700 bg-neutral-800/30">
        {/* Section 1: Duo Passes */}
        <div className="mb-10">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">
              Duo Passes
            </h2>
            <p className="text-neutral-400 max-w-lg mx-auto">
              Select specific months and tier for your Duo mentorship access. You can mix different months across years and upgrade anytime.
            </p>
          </div>

          {/* Tier Chips */}
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            <div className="flex items-center gap-2 px-4 py-2 bg-green-500/10 border border-green-500/30 rounded-lg">
              <span className="w-3 h-3 rounded-full bg-green-500" />
              <span className="text-green-400 font-medium">Go</span>
              <span className="text-neutral-400 text-sm">NT${DUO_TIER_CONFIG.go.price.toLocaleString()}/mo</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-amber-500/10 border border-amber-500/30 rounded-lg">
              <span className="w-3 h-3 rounded-full bg-amber-500" />
              <span className="text-amber-400 font-medium">Run</span>
              <span className="text-neutral-400 text-sm">NT${DUO_TIER_CONFIG.run.price.toLocaleString()}/mo</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-red-500/10 border border-red-500/30 rounded-lg">
              <span className="w-3 h-3 rounded-full bg-red-500" />
              <span className="text-red-400 font-medium">Fly</span>
              <span className="text-neutral-400 text-sm">NT${DUO_TIER_CONFIG.fly.price.toLocaleString()}/mo</span>
            </div>
          </div>

          {/* CTA Button */}
          <div className="text-center mb-10">
            <Button
              variant="primary"
              size="lg"
              onClick={handleDuoSelectMonths}
              className="bg-gradient-to-r from-green-500 via-amber-500 to-red-500 hover:opacity-90 shadow-[0_0_20px_rgba(34,197,94,0.3),0_0_40px_rgba(245,158,11,0.2),0_0_60px_rgba(239,68,68,0.15)] hover:shadow-[0_0_25px_rgba(34,197,94,0.4),0_0_50px_rgba(245,158,11,0.3),0_0_75px_rgba(239,68,68,0.2)] transition-all duration-200 hover:-translate-y-0.5"
            >
              Select Months & Tier
            </Button>
          </div>

          {/* What's the difference? Section */}
          <div className="bg-neutral-800/50 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <QuestionMarkCircleIcon size="md" className="text-neutral-400" />
              What&apos;s the difference?
            </h3>
            <div className="grid gap-4 md:grid-cols-3">
              <TierCard tier="go" />
              <TierCard tier="run" />
              <TierCard tier="fly" />
            </div>
          </div>
        </div>

        {/* Section 2: Duo Pass History */}
        <div className="mb-8">
          <DuoPurchaseHistorySection timelineMonths={timelineMonths} />
        </div>

        {/* Introduction Section */}
        <div className="mb-8 bg-neutral-800/50 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
            <InformationCircleIcon size="md" className="text-neutral-400" />
            {DUO_INFO.introduction.title}
          </h3>
          <p className="text-neutral-400 leading-relaxed">
            {DUO_INFO.introduction.description}
          </p>
        </div>

        {/* FAQ Section */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <QuestionMarkCircleIcon size="md" className="text-neutral-400" />
            Frequently Asked Questions
          </h3>
          <div className="space-y-3">
            {DUO_INFO.faq.map((item, index) => (
              <div key={index} className="bg-neutral-800/50 rounded-xl p-4">
                <h4 className="font-medium text-white mb-1">{item.question}</h4>
                <p className="text-sm text-neutral-400">{item.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Duo Month Selector Modal */}
      <DuoMonthSelectorModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        entitlements={entitlements}
        onPurchase={handleDuoPurchase}
        onRefreshEntitlements={refresh}
      />
    </>
  );
}
