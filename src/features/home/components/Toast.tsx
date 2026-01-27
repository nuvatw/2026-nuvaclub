'use client';

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircleIcon } from '@/components/icons';

interface ToastProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description: string;
}

export function Toast({
  isOpen,
  onClose,
  title,
  description,
}: ToastProps) {
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(onClose, 5000);
      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 50, x: '-50%' }}
          animate={{ opacity: 1, y: 0, x: '-50%' }}
          exit={{ opacity: 0, y: 50, x: '-50%' }}
          className="fixed bottom-8 left-1/2 z-50 bg-green-600 text-white px-6 py-4 rounded-xl shadow-xl max-w-md"
        >
          <div className="flex items-start gap-3">
            <CheckCircleIcon size="md" className="flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">{title}</p>
              <p className="text-sm text-green-100">{description}</p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
