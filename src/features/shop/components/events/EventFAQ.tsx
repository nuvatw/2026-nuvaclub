'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import type { FAQ } from '@/features/shop/types';
import { cn } from '@/lib/utils';

interface EventFAQProps {
  faqs: FAQ[];
}

function FAQItem({ faq }: { faq: FAQ }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-[var(--shop-border)] last:border-b-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between py-4 text-left"
      >
        <span className="font-medium text-[var(--shop-text)] pr-4">
          {faq.question}
        </span>
        <svg
          className={cn(
            'w-5 h-5 text-[var(--shop-text-muted)] flex-shrink-0 transition-transform',
            isOpen && 'rotate-180'
          )}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <p className="pb-4 text-[var(--shop-text-muted)]">
              {faq.answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function EventFAQ({ faqs }: EventFAQProps) {
  if (!faqs || faqs.length === 0) return null;

  return (
    <section>
      <h2 className="text-xl font-semibold text-[var(--shop-text)] mb-4">
        Frequently Asked Questions
      </h2>

      <div className="bg-[var(--shop-card)] rounded-xl border border-[var(--shop-border)] px-6">
        {faqs.map((faq, index) => (
          <FAQItem key={index} faq={faq} />
        ))}
      </div>
    </section>
  );
}
