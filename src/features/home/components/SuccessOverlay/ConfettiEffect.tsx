'use client';

import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';

// Confetti component with proper fade-out and cleanup
export function ConfettiEffect() {
  const [confettiItems, setConfettiItems] = useState<Array<{ id: number; x: number; color: string; delay: number; duration: number }>>([]);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Generate confetti items only on client
    const items = Array.from({ length: 60 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      color: ['bg-primary-400', 'bg-accent-400', 'bg-green-400', 'bg-yellow-400', 'bg-pink-400'][Math.floor(Math.random() * 5)],
      delay: Math.random() * 0.5,
      duration: 3 + Math.random() * 2,
    }));
    setConfettiItems(items);

    // Fade out and cleanup after 5 seconds
    const fadeTimer = setTimeout(() => {
      setIsVisible(false);
    }, 4500);

    const cleanupTimer = setTimeout(() => {
      setConfettiItems([]);
    }, 6000);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(cleanupTimer);
    };
  }, []);

  if (confettiItems.length === 0) return null;

  return (
    <motion.div
      className="absolute inset-0 overflow-hidden pointer-events-none"
      initial={{ opacity: 1 }}
      animate={{ opacity: isVisible ? 1 : 0 }}
      transition={{ duration: 1.5, ease: 'easeOut' }}
    >
      {confettiItems.map((item) => (
        <motion.div
          key={item.id}
          initial={{
            opacity: 1,
            x: `${item.x}vw`,
            y: -20,
            rotate: 0,
          }}
          animate={{
            y: '100vh',
            rotate: Math.random() * 720,
            opacity: [1, 1, 0.5, 0],
          }}
          transition={{
            duration: item.duration,
            delay: item.delay,
            ease: [0.25, 0.1, 0.25, 1], // Smooth cubic bezier
          }}
          className={cn('absolute w-3 h-3 rounded-sm', item.color)}
        />
      ))}
    </motion.div>
  );
}
