'use client';

import { motion } from 'motion/react';
import { Button } from '@/components/atoms';

interface VisibilityPromptBannerProps {
  projectTitle: string;
  sprintName: string;
  onChooseClick: () => void;
  onDismiss: () => void;
}

export function VisibilityPromptBanner({
  projectTitle,
  sprintName,
  onChooseClick,
  onDismiss,
}: VisibilityPromptBannerProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="rounded-lg border border-green-500/30 bg-gradient-to-r from-green-500/10 to-emerald-500/10 p-4"
    >
      <div className="flex items-start gap-4">
        <div className="text-2xl">🎉</div>
        <div className="flex-1">
          <h4 className="font-semibold text-white mb-1">
            {sprintName} has ended! Choose your project visibility
          </h4>
          <p className="text-sm text-neutral-300">
            Your project &ldquo;{projectTitle}&rdquo; is awaiting your visibility choice.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={onChooseClick} size="sm">
            Choose Now
          </Button>
          <Button variant="ghost" size="sm" onClick={onDismiss}>
            Dismiss
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
