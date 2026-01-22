'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/atoms';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSearch?: () => void;
  placeholder?: string;
}

export function SearchBar({
  value,
  onChange,
  onSearch,
  placeholder = 'Search products...',
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

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2">
      <div className="relative flex-1">
        <input
          type="text"
          value={localValue}
          onChange={handleChange}
          placeholder={placeholder}
          className="w-full px-4 py-2.5 pr-10 rounded-full bg-[var(--shop-card)] border border-[var(--shop-border)] text-[var(--shop-text)] placeholder-[var(--shop-text-muted)] focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all"
        />
        {localValue && (
          <button
            type="button"
            onClick={() => {
              setLocalValue('');
              onChange('');
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--shop-text-muted)] hover:text-[var(--shop-text)] transition-colors"
            aria-label="Clear search"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
      <Button type="submit" className="rounded-full px-6">
        Search
      </Button>
    </form>
  );
}
