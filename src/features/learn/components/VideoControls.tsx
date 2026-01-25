'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';
import { XIcon as CloseIcon } from '@/components/icons';
import { FlagIcon } from './VideoPlayerIcons';
import type { PlaybackSpeed } from '../types/video-player';
import { PLAYBACK_SPEEDS } from '../types/video-player';

// Close Button with Tooltip
export function CloseButton({ onClick }: { onClick: () => void }) {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className="absolute top-5 left-5">
      <button
        onClick={onClick}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className="p-3 rounded-full bg-neutral-900/50 hover:bg-neutral-800 transition-colors"
      >
        <CloseIcon size="lg" className="w-7 h-7 text-white" />
      </button>
      <AnimatePresence>
        {showTooltip && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-3 py-1.5 bg-neutral-800 text-white text-base rounded-lg whitespace-nowrap pointer-events-none z-50"
          >
            Close (Esc)
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 border-4 border-transparent border-b-neutral-800" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Control Button Component with Tooltip
export function ControlButton({
  children,
  onClick,
  label,
  size = 'md',
  active = false,
  disabled = false,
}: {
  children: React.ReactNode;
  onClick: () => void;
  label: string;
  size?: 'md' | 'lg';
  active?: boolean;
  disabled?: boolean;
}) {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={(e) => {
          e.stopPropagation();
          if (!disabled) onClick();
        }}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        disabled={disabled}
        aria-label={label}
        className={cn(
          'rounded-full transition-all text-white',
          size === 'lg'
            ? 'p-5 bg-white/20 hover:bg-white/30'
            : 'p-3 hover:bg-white/10',
          active && 'text-primary-400',
          disabled
            ? 'opacity-40 cursor-not-allowed'
            : 'hover:scale-110 active:scale-95'
        )}
      >
        {children}
      </button>
      <AnimatePresence>
        {showTooltip && !disabled && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.15 }}
            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-neutral-800 text-white text-base rounded-lg whitespace-nowrap pointer-events-none z-50"
          >
            {label}
            <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-neutral-800" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Report Button (Top Right)
export function ReportButton({ onClick }: { onClick: () => void }) {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className="absolute top-5 right-5">
      <button
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        aria-label="Report issue"
        className="p-3 rounded-full bg-neutral-900/50 hover:bg-neutral-800 transition-colors"
      >
        <FlagIcon className="w-6 h-6 text-white" />
      </button>
      <AnimatePresence>
        {showTooltip && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full right-0 mt-2 px-3 py-1.5 bg-neutral-800 text-white text-base rounded-lg whitespace-nowrap pointer-events-none z-50"
          >
            Report issue
            <div className="absolute bottom-full right-4 border-4 border-transparent border-b-neutral-800" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Speed Button with Popover
export function SpeedButton({
  speed,
  isOpen,
  onToggle,
  onSelect,
}: {
  speed: PlaybackSpeed;
  isOpen: boolean;
  onToggle: () => void;
  onSelect: (speed: PlaybackSpeed) => void;
}) {
  return (
    <div className="relative">
      <button
        onClick={(e) => {
          e.stopPropagation();
          onToggle();
        }}
        aria-label={`Playback speed: ${speed}x`}
        className={cn(
          'px-3 py-2 rounded-lg text-base font-medium transition-all',
          'hover:bg-white/10 active:scale-95',
          isOpen ? 'bg-white/20 text-primary-400' : 'text-white'
        )}
      >
        {speed}x
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute bottom-full right-0 mb-3 bg-neutral-900 border border-neutral-700 rounded-xl shadow-xl overflow-hidden z-50"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="py-2">
              {PLAYBACK_SPEEDS.map((s) => (
                <button
                  key={s}
                  onClick={() => onSelect(s)}
                  className={cn(
                    'w-full px-5 py-2.5 text-base text-left transition-colors',
                    s === speed
                      ? 'bg-primary-500/20 text-primary-400'
                      : 'text-white hover:bg-white/10'
                  )}
                >
                  {s}x {s === 1 && <span className="text-neutral-500 ml-1">(Normal)</span>}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
