'use client';

import { motion } from 'motion/react';
import { cn } from '@/lib/utils';
import { XIcon as CloseIcon } from '@/components/icons';
import type { ReportCategory } from '../types/video-player';

interface ReportModalProps {
  categories: readonly ReportCategory[];
  selectedCategory: string;
  description: string;
  onCategoryChange: (category: string) => void;
  onDescriptionChange: (desc: string) => void;
  onSubmit: () => void;
  onClose: () => void;
}

export function ReportModal({
  categories,
  selectedCategory,
  description,
  onCategoryChange,
  onDescriptionChange,
  onSubmit,
  onClose,
}: ReportModalProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 flex items-center justify-center bg-black/70 z-50"
      onClick={(e) => {
        e.stopPropagation();
        onClose();
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.2 }}
        className="w-full max-w-md bg-neutral-900 border border-neutral-700 rounded-xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-neutral-700">
          <h3 className="text-lg font-semibold text-white">Report an Issue</h3>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-neutral-800 rounded-full transition-colors"
          >
            <CloseIcon size="md" className="text-neutral-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          {/* Category Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-neutral-300">What&apos;s the issue?</label>
            <div className="space-y-1">
              {categories.map((cat) => (
                <label
                  key={cat.id}
                  className={cn(
                    'flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors',
                    selectedCategory === cat.id
                      ? 'bg-primary-500/20 border border-primary-500/50'
                      : 'bg-neutral-800/50 hover:bg-neutral-800 border border-transparent'
                  )}
                >
                  <input
                    type="radio"
                    name="report-category"
                    value={cat.id}
                    checked={selectedCategory === cat.id}
                    onChange={() => onCategoryChange(cat.id)}
                    className="sr-only"
                  />
                  <div
                    className={cn(
                      'w-4 h-4 rounded-full border-2 flex items-center justify-center',
                      selectedCategory === cat.id
                        ? 'border-primary-500'
                        : 'border-neutral-500'
                    )}
                  >
                    {selectedCategory === cat.id && (
                      <div className="w-2 h-2 bg-primary-500 rounded-full" />
                    )}
                  </div>
                  <span className="text-sm text-white">{cat.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-neutral-300">
              Additional details <span className="text-neutral-500">(optional)</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => onDescriptionChange(e.target.value)}
              placeholder="Describe the issue..."
              rows={3}
              className="w-full px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 resize-none focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-4 border-t border-neutral-700">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-neutral-300 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onSubmit}
            disabled={!selectedCategory}
            className={cn(
              'px-4 py-2 text-sm font-medium rounded-lg transition-all',
              selectedCategory
                ? 'bg-primary-500 text-white hover:bg-primary-600 active:scale-95'
                : 'bg-neutral-700 text-neutral-400 cursor-not-allowed'
            )}
          >
            Submit Report
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
