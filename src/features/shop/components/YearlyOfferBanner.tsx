'use client';

import { motion } from 'motion/react';

export function YearlyOfferBanner() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30"
    >
      <span className="text-2xl">🎁</span>
      <div className="text-left">
        <div className="text-white font-medium">Yearly Offer: Buy 10 months, get 2 FREE!</div>
        <div className="text-sm text-green-400">Save 17% with annual billing</div>
      </div>
    </motion.div>
  );
}
