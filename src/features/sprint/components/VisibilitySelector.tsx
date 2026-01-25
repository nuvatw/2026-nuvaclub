'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button, Card, CardContent } from '@/components/atoms';
import type { ProjectVisibility } from '@/lib/db/schema/sprint.schema';
import { cn } from '@/lib/utils';

interface VisibilitySelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (visibility: ProjectVisibility) => void;
  projectTitle: string;
  sprintName: string;
}

const visibilityOptions: {
  value: ProjectVisibility;
  label: string;
  description: string;
  icon: string;
  recommended?: boolean;
}[] = [
  {
    value: 'nuvaclub-only',
    label: 'NuvaClub Members Only',
    description:
      'Only logged-in NuvaClub members can view your project. Perfect for portfolio pieces you want to keep within the community.',
    icon: '🔒',
  },
  {
    value: 'public',
    label: 'Public for Everyone',
    description:
      'Anyone can view your project, even without logging in. Great for sharing on social media, portfolios, and job applications. Includes shareable link for external promotion.',
    icon: '🌍',
    recommended: true,
  },
];

export function VisibilitySelector({
  isOpen,
  onClose,
  onSelect,
  projectTitle,
  sprintName,
}: VisibilitySelectorProps) {
  const [selected, setSelected] = useState<ProjectVisibility | null>(null);

  const handleSave = () => {
    if (selected) {
      onSelect(selected);
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <Card className="w-full max-w-lg">
              <CardContent className="p-6">
                <h2 className="text-xl font-bold text-white mb-1">
                  Choose Project Visibility
                </h2>
                <p className="text-sm text-neutral-400 mb-1">
                  &ldquo;{projectTitle}&rdquo;
                </p>
                <p className="text-xs text-neutral-500 mb-6">
                  Sprint: {sprintName}
                </p>

                <div className="border-t border-neutral-700 my-4" />

                <p className="text-sm text-neutral-300 mb-4">
                  Who can view your project after the sprint?
                </p>

                <div className="space-y-3 mb-6">
                  {visibilityOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setSelected(option.value)}
                      className={cn(
                        'w-full text-left p-4 rounded-lg border transition-all',
                        selected === option.value
                          ? 'border-primary-500 bg-primary-500/10'
                          : 'border-neutral-700 bg-neutral-800/50 hover:border-neutral-600'
                      )}
                    >
                      <div className="flex items-start gap-3">
                        <div className="text-xl">{option.icon}</div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-white">
                              {option.label}
                            </span>
                            {option.recommended && (
                              <span className="text-xs px-2 py-0.5 rounded bg-green-500/20 text-green-400">
                                Recommended
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-neutral-400 mt-1">
                            {option.description}
                          </p>
                        </div>
                        <div
                          className={cn(
                            'w-5 h-5 rounded-full border-2 flex items-center justify-center',
                            selected === option.value
                              ? 'border-primary-500'
                              : 'border-neutral-600'
                          )}
                        >
                          {selected === option.value && (
                            <div className="w-2.5 h-2.5 rounded-full bg-primary-500" />
                          )}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>

                <div className="border-t border-neutral-700 my-4" />

                <p className="text-xs text-neutral-500 mb-4">
                  &#8505;&#65039; You can change this anytime from your project settings.
                </p>

                <div className="flex gap-3 justify-end">
                  <Button variant="ghost" onClick={onClose}>
                    Cancel
                  </Button>
                  <Button onClick={handleSave} disabled={!selected}>
                    Save Visibility
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
