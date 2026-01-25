'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { XIcon, SearchIcon, ChevronLeftIcon, ChevronRightIcon, QuestionMarkCircleIcon } from '@/components/icons';
import { isMacOS, formatShortcut } from '@/lib/utils/platform';
import { cn } from '@/lib/utils';

interface KeyboardShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ShortcutItem {
  label: string;
  keys: { mod?: boolean; alt?: boolean; shift?: boolean; key: string };
  icon?: React.ReactNode;
}

const SHORTCUTS: { category: string; items: ShortcutItem[] }[] = [
  {
    category: 'Navigation',
    items: [
      {
        label: 'Open search',
        keys: { mod: true, key: 'K' },
        icon: <SearchIcon size="sm" />,
      },
      {
        label: 'Previous section',
        keys: { mod: true, alt: true, key: 'ArrowLeft' },
        icon: <ChevronLeftIcon size="sm" />,
      },
      {
        label: 'Next section',
        keys: { mod: true, alt: true, key: 'ArrowRight' },
        icon: <ChevronRightIcon size="sm" />,
      },
    ],
  },
  {
    category: 'General',
    items: [
      {
        label: 'Show keyboard shortcuts',
        keys: { mod: true, key: '/' },
        icon: <QuestionMarkCircleIcon size="sm" />,
      },
      {
        label: 'Close dialog',
        keys: { key: 'Escape' },
      },
    ],
  },
];

function ShortcutKey({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <kbd
      className={cn(
        'inline-flex items-center justify-center min-w-[24px] h-6 px-1.5',
        'bg-neutral-800 border border-neutral-700 rounded',
        'text-xs font-mono text-neutral-300',
        className
      )}
    >
      {children}
    </kbd>
  );
}

export function KeyboardShortcutsModal({ isOpen, onClose }: KeyboardShortcutsModalProps) {
  const [isMac, setIsMac] = useState(true);

  // Detect platform on mount
  useEffect(() => {
    setIsMac(isMacOS());
  }, []);

  // Handle escape key
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  const formatKeys = (keys: ShortcutItem['keys']) => {
    return formatShortcut(keys, isMac ? 'mac' : 'windows');
  };

  // Render shortcut as individual keys
  const renderShortcut = (keys: ShortcutItem['keys']) => {
    const parts: React.ReactNode[] = [];
    const isMacPlatform = isMac;

    if (keys.mod) {
      parts.push(<ShortcutKey key="mod">{isMacPlatform ? '⌘' : 'Ctrl'}</ShortcutKey>);
    }
    if (keys.alt) {
      parts.push(<ShortcutKey key="alt">{isMacPlatform ? '⌥' : 'Alt'}</ShortcutKey>);
    }
    if (keys.shift) {
      parts.push(<ShortcutKey key="shift">{isMacPlatform ? '⇧' : 'Shift'}</ShortcutKey>);
    }

    // Format the key
    let keyDisplay = keys.key;
    if (keys.key === 'ArrowLeft') keyDisplay = '←';
    else if (keys.key === 'ArrowRight') keyDisplay = '→';
    else if (keys.key === 'ArrowUp') keyDisplay = '↑';
    else if (keys.key === 'ArrowDown') keyDisplay = '↓';
    else if (keys.key === 'Escape') keyDisplay = 'Esc';
    else if (keys.key === 'Enter') keyDisplay = '↵';
    else keyDisplay = keys.key;

    parts.push(<ShortcutKey key="key">{keyDisplay}</ShortcutKey>);

    return (
      <div className="flex items-center gap-1">
        {parts.map((part, i) => (
          <span key={i}>{part}</span>
        ))}
      </div>
    );
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
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md"
            role="dialog"
            aria-modal="true"
            aria-labelledby="shortcuts-title"
            data-keyboard-shortcut-modal="true"
          >
            <div className="mx-4 bg-neutral-900 border border-neutral-700 rounded-xl shadow-2xl overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-800">
                <h2 id="shortcuts-title" className="text-lg font-semibold text-white">
                  Keyboard Shortcuts
                </h2>
                <button
                  onClick={onClose}
                  className="p-1.5 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors"
                  aria-label="Close"
                >
                  <XIcon size="md" />
                </button>
              </div>

              {/* Content */}
              <div className="px-5 py-4 space-y-6 max-h-[60vh] overflow-y-auto">
                {SHORTCUTS.map((category) => (
                  <div key={category.category}>
                    <h3 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-3">
                      {category.category}
                    </h3>
                    <div className="space-y-2">
                      {category.items.map((item) => (
                        <div
                          key={item.label}
                          className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-neutral-800/50 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            {item.icon && (
                              <span className="text-neutral-400">{item.icon}</span>
                            )}
                            <span className="text-sm text-neutral-200">{item.label}</span>
                          </div>
                          {renderShortcut(item.keys)}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="px-5 py-3 border-t border-neutral-800 bg-neutral-900/50">
                <p className="text-xs text-neutral-500 text-center">
                  {isMac ? 'Showing Mac shortcuts' : 'Showing Windows/Linux shortcuts'}
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
