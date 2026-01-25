'use client';

import { motion } from 'motion/react';
import { LockIcon } from '@/components/icons';
import { Button } from '@/components/atoms';

export function LockedMyVavaSection() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="mb-8"
    >
      <div className="rounded-xl border border-neutral-800 bg-neutral-900/50 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center">
              <LockIcon size="md" className="text-green-500/50" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                My Vava
                <LockIcon size="sm" className="text-neutral-500" />
              </h2>
              <p className="text-sm text-neutral-500">Sign in to view your learners</p>
            </div>
          </div>
          <Button variant="secondary" size="sm">Sign In</Button>
        </div>
      </div>
    </motion.div>
  );
}
