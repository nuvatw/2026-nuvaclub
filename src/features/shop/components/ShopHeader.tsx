'use client';

import { SearchBar } from '@/components/molecules';

interface ShopHeaderProps {
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  tagline?: string;
  showSearch?: boolean;
}

export function ShopHeader({
  searchQuery = '',
  onSearchChange,
  tagline = 'Give All You Need',
  showSearch = false,
}: ShopHeaderProps) {
  return (
    <div className="bg-[var(--shop-card)] border-b border-[var(--shop-border)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          {/* Tagline */}
          <h2 className="text-xl sm:text-2xl font-semibold text-[var(--shop-text)]">
            {tagline}
          </h2>

          {/* Search (optional) */}
          {showSearch && onSearchChange && (
            <div className="w-full sm:w-auto sm:min-w-[320px] md:min-w-[400px]">
              <SearchBar
                value={searchQuery}
                onChange={onSearchChange}
                placeholder="Search on nuvaClub"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
