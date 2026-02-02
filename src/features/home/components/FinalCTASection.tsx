'use client';

import { motion } from 'motion/react';
import { Button } from '@/components/atoms';
import { ArrowRightIcon, CheckCircleIcon } from '@/components/icons';
import { useHomeContent } from '../hooks/useHomeContent';

interface FinalCTASectionProps {
  onScrollToTiers: () => void;
}

export function FinalCTASection({ onScrollToTiers }: FinalCTASectionProps) {
  const { finalCta: FINAL_CTA_CONTENT } = useHomeContent();
  return (
    <section className="py-12 sm:py-20 bg-gradient-to-b from-neutral-900 to-neutral-950">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
            {FINAL_CTA_CONTENT.headline}
            <br />
            <span className="text-primary-400">
              {FINAL_CTA_CONTENT.headlineHighlight}
            </span>
          </h2>
          <p className="text-lg sm:text-xl text-neutral-300 mb-8 max-w-2xl mx-auto">
            {FINAL_CTA_CONTENT.subheadline}
          </p>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <Button
              size="lg"
              className="text-base sm:text-lg px-6 sm:px-10 py-4 sm:py-5 h-auto w-full sm:w-auto"
              onClick={onScrollToTiers}
            >
              {FINAL_CTA_CONTENT.primaryCta}
              <ArrowRightIcon size="md" className="ml-2" />
            </Button>
          </motion.div>

          {/* Trust Points */}
          <div className="flex flex-wrap justify-center gap-6 mt-8">
            {FINAL_CTA_CONTENT.trustPoints.map((point) => (
              <div
                key={point}
                className="flex items-center gap-2 text-neutral-400 text-sm"
              >
                <CheckCircleIcon size="sm" className="text-green-500" />
                {point}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
