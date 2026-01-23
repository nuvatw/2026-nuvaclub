'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/atoms';
import { SearchIcon, XIcon, SpinnerIcon } from '@/components/icons';
import { cn } from '@/lib/utils';

/**
 * SearchBar Component
 *
 * Design System Standards:
 * - Border radius: rounded-lg (consistent with inputs)
 * - Uses neutral tokens (no CSS variables)
 * - Includes loading state
 */

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSearch?: () => void;
  placeholder?: string;
  isLoading?: boolean;
  size?: 'md' | 'lg';
  /** Whether to show the search button */
  showButton?: boolean;
  className?: string;
}

export function SearchBar({
  value,
  onChange,
  onSearch,
  placeholder = 'Search...',
  isLoading = false,
  size = 'md',
  showButton = true,
  className,
}: SearchBarProps) {
  const [localValue, setLocalValue] = useState(value);

  // Sync with external value
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onChange(localValue);
    onSearch?.();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalValue(e.target.value);
    // Instant filtering as user types
    onChange(e.target.value);
  };

  const handleClear = () => {
    setLocalValue('');
    onChange('');
  };

  const sizeStyles = {
    md: 'h-10 px-4 pl-10 text-sm',
    lg: 'h-12 px-5 pl-12 text-base',
  };

  const iconSizes = {
    md: 'sm' as const,
    lg: 'md' as const,
  };

  return (
    <form onSubmit={handleSubmit} className={cn('flex items-center gap-2', className)}>
      <div className="relative flex-1">
        {/* Search Icon */}
        <div className={cn(
          'absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 pointer-events-none',
          size === 'lg' && 'left-4'
        )}>
          {isLoading ? (
            <SpinnerIcon size={iconSizes[size]} />
          ) : (
            <SearchIcon size={iconSizes[size]} />
          )}
        </div>

        <input
          type="text"
          value={localValue}
          onChange={handleChange}
          placeholder={placeholder}
          className={cn(
            'w-full rounded-lg',
            'bg-neutral-800 border border-neutral-700',
            'text-white placeholder-neutral-500',
            'focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500',
            'transition-all duration-200',
            sizeStyles[size],
            localValue && 'pr-10'
          )}
        />

        {/* Clear Button */}
        {localValue && !isLoading && (
          <button
            type="button"
            onClick={handleClear}
            className={cn(
              'absolute right-3 top-1/2 -translate-y-1/2',
              'text-neutral-500 hover:text-white transition-colors',
              'p-0.5 rounded hover:bg-neutral-700'
            )}
            aria-label="Clear search"
          >
            <XIcon size="sm" />
          </button>
        )}
      </div>

      {showButton && (
        <Button type="submit" size={size} isLoading={isLoading}>
          Search
        </Button>
      )}
    </form>
  );
}
