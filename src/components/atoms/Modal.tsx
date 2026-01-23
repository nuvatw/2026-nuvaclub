'use client';

import { type ReactNode, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';
import { useEscapeKey, useBodyScrollLock, useFocusTrap } from '@/hooks';
import { XIcon } from '@/components/icons';

/**
 * Modal Component
 *
 * Design System Standards:
 * - Border radius: rounded-xl (12px)
 * - Background: neutral-900
 * - Shadow: shadow-xl for elevation
 * - Includes header, content, and optional footer slots
 *
 * Accessibility:
 * - Focus trap: Tab cycles within modal
 * - Escape key: Closes modal
 * - Body scroll lock: Prevents background scroll
 * - Focus restored: Returns to trigger element on close
 */

type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';
type ModalPadding = 'sm' | 'md' | 'lg';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
  description?: string;
  size?: ModalSize;
  padding?: ModalPadding;
  closeOnOverlayClick?: boolean;
  showCloseButton?: boolean;
  footer?: ReactNode;
}

const SIZE_STYLES: Record<ModalSize, string> = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  full: 'max-w-4xl',
};

const PADDING_STYLES: Record<ModalPadding, string> = {
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
};

export function Modal({
  isOpen,
  onClose,
  children,
  title,
  description,
  size = 'md',
  padding = 'md',
  closeOnOverlayClick = true,
  showCloseButton = true,
  footer,
}: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEscapeKey(onClose, isOpen);
  useBodyScrollLock(isOpen);
  useFocusTrap(modalRef, isOpen);

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby={title ? 'modal-title' : undefined}
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={closeOnOverlayClick ? onClose : undefined}
            aria-hidden="true"
          />

          {/* Modal Panel */}
          <motion.div
            ref={modalRef}
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className={cn(
              'relative w-full bg-neutral-900 rounded-xl border border-neutral-800 shadow-xl shadow-black/30',
              SIZE_STYLES[size]
            )}
          >
            {/* Header */}
            {(title || showCloseButton) && (
              <div className={cn(
                'flex items-start justify-between gap-4 border-b border-neutral-800',
                title ? 'px-6 py-4' : 'p-2 border-b-0 absolute top-0 right-0 z-10'
              )}>
                {title && (
                  <div className="flex-1 min-w-0">
                    <h2 id="modal-title" className="text-lg font-semibold text-white">
                      {title}
                    </h2>
                    {description && (
                      <p className="text-sm text-neutral-400 mt-1">{description}</p>
                    )}
                  </div>
                )}
                {showCloseButton && (
                  <button
                    onClick={onClose}
                    className={cn(
                      'flex-shrink-0 p-2 rounded-lg text-neutral-400',
                      'hover:text-white hover:bg-neutral-800',
                      'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500',
                      'transition-colors'
                    )}
                    aria-label="Close modal"
                  >
                    <XIcon size="md" />
                  </button>
                )}
              </div>
            )}

            {/* Content */}
            <div className={cn(PADDING_STYLES[padding])}>
              {children}
            </div>

            {/* Footer */}
            {footer && (
              <div className="px-6 py-4 border-t border-neutral-800 flex items-center justify-end gap-3">
                {footer}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

// Convenience components for modal content structure
interface ModalActionsProps {
  children: ReactNode;
  className?: string;
}

export function ModalActions({ children, className }: ModalActionsProps) {
  return (
    <div className={cn('flex items-center justify-end gap-3 mt-6', className)}>
      {children}
    </div>
  );
}
