'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { SearchIcon, XIcon } from '@/components/icons';
import { cn } from '@/lib/utils';

interface AnimatedSearchIconProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function AnimatedSearchIcon({
  value,
  onChange,
  placeholder = 'Search...',
  className,
}: AnimatedSearchIconProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const blurTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-focus when expanded
  useEffect(() => {
    if (isExpanded && inputRef.current) {
      // Small delay to allow animation to start
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isExpanded]);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        if (!value) {
          setIsExpanded(false);
        }
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [value]);

  // Close on Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isExpanded) {
        setIsExpanded(false);
        onChange('');
        inputRef.current?.blur();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isExpanded, onChange]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (blurTimeoutRef.current) {
        clearTimeout(blurTimeoutRef.current);
      }
    };
  }, []);

  const handleIconClick = () => {
    if (!isExpanded) {
      setIsExpanded(true);
    } else {
      inputRef.current?.focus();
    }
  };

  const handleClear = () => {
    onChange('');
    inputRef.current?.focus();
  };

  const handleBlur = () => {
    // Delay collapse to allow clicking clear button
    blurTimeoutRef.current = setTimeout(() => {
      if (!value) {
        setIsExpanded(false);
      }
    }, 150);
  };

  const handleFocus = () => {
    // Cancel any pending collapse
    if (blurTimeoutRef.current) {
      clearTimeout(blurTimeoutRef.current);
      blurTimeoutRef.current = null;
    }
  };

  return (
    <motion.div
      ref={containerRef}
      role="search"
      aria-label="Search courses"
      className={cn('relative', className)}
      initial={false}
      animate={{
        width: isExpanded ? 320 : 48,
      }}
      transition={{
        type: 'spring',
        stiffness: 200,
        damping: 25,
      }}
    >
      <div
        className={cn(
          'flex items-center h-12 overflow-hidden',
          'bg-neutral-950/80 backdrop-blur-md border border-neutral-800',
          'rounded-full transition-colors duration-300',
          isExpanded && 'bg-neutral-900 border-neutral-700'
        )}
      >
        {/* Search Icon / Button */}
        <button
          type="button"
          onClick={handleIconClick}
          aria-label={isExpanded ? 'Search input focused' : 'Open search'}
          aria-expanded={isExpanded}
          aria-controls="animated-search-input"
          className={cn(
            'flex-shrink-0 w-12 h-12 flex items-center justify-center',
            'text-neutral-400 hover:text-white transition-colors duration-200'
          )}
        >
          <SearchIcon size="lg" />
        </button>

        {/* Input */}
        <AnimatePresence mode="wait">
          {isExpanded && (
            <motion.div
              className="flex-1 flex items-center pr-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25, delay: 0.15 }}
            >
              <input
                ref={inputRef}
                id="animated-search-input"
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                onBlur={handleBlur}
                onFocus={handleFocus}
                placeholder={placeholder}
                aria-label="Search courses"
                className={cn(
                  'flex-1 bg-transparent border-none outline-none',
                  'text-white placeholder-neutral-500 text-base',
                  'min-w-0'
                )}
              />

              {/* Clear Button */}
              <AnimatePresence>
                {value && (
                  <motion.button
                    type="button"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.15 }}
                    onClick={handleClear}
                    onMouseDown={(e) => e.preventDefault()} // Prevent blur
                    className={cn(
                      'flex-shrink-0 w-8 h-8 flex items-center justify-center',
                      'text-neutral-500 hover:text-white transition-colors duration-200',
                      'hover:bg-neutral-700 rounded-full mr-2'
                    )}
                    aria-label="Clear search"
                  >
                    <XIcon size="md" />
                  </motion.button>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
