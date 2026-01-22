'use client';

import { cn } from '@/lib/utils';
import type { ProductCategory, CategoryCount } from '@/features/shop/types';

interface Filter {
  id: string;
  label: string;
  checked: boolean;
}

interface CategorySidebarProps {
  categories: CategoryCount[];
  selectedCategory: ProductCategory | 'all';
  onCategoryChange: (category: ProductCategory | 'all') => void;
  filters?: Filter[];
  onFilterChange?: (filterId: string, checked: boolean) => void;
  totalCount: number;
}

export function CategorySidebar({
  categories,
  selectedCategory,
  onCategoryChange,
  filters = [],
  onFilterChange,
  totalCount,
}: CategorySidebarProps) {
  return (
    <aside className="w-full lg:w-64 flex-shrink-0">
      <div className="sticky top-24">
        {/* Category Section */}
        <div className="bg-[var(--shop-card)] rounded-xl border border-[var(--shop-border)] p-4">
          <h3 className="text-sm font-semibold text-[var(--shop-text-muted)] uppercase tracking-wider mb-4">
            Category
          </h3>

          <nav className="space-y-1">
            {/* All Products */}
            <button
              onClick={() => onCategoryChange('all')}
              className={cn(
                'w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                selectedCategory === 'all'
                  ? 'bg-primary-500/10 text-primary-500'
                  : 'text-[var(--shop-text)] hover:bg-[var(--shop-border)]'
              )}
            >
              <span>All Products</span>
              <span
                className={cn(
                  'text-xs px-2 py-0.5 rounded-full',
                  selectedCategory === 'all'
                    ? 'bg-primary-500/20 text-primary-500'
                    : 'bg-[var(--shop-border)] text-[var(--shop-text-muted)]'
                )}
              >
                {totalCount}
              </span>
            </button>

            {/* Category Items */}
            {categories.map((cat) => (
              <button
                key={cat.category}
                onClick={() => onCategoryChange(cat.category)}
                className={cn(
                  'w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                  selectedCategory === cat.category
                    ? 'bg-primary-500/10 text-primary-500'
                    : 'text-[var(--shop-text)] hover:bg-[var(--shop-border)]'
                )}
              >
                <span>{cat.label}</span>
                <span
                  className={cn(
                    'text-xs px-2 py-0.5 rounded-full',
                    selectedCategory === cat.category
                      ? 'bg-primary-500/20 text-primary-500'
                      : 'bg-[var(--shop-border)] text-[var(--shop-text-muted)]'
                  )}
                >
                  {cat.count}
                </span>
              </button>
            ))}
          </nav>
        </div>

        {/* Filters Section */}
        {filters.length > 0 && (
          <div className="bg-[var(--shop-card)] rounded-xl border border-[var(--shop-border)] p-4 mt-4">
            <h3 className="text-sm font-semibold text-[var(--shop-text-muted)] uppercase tracking-wider mb-4">
              Filters
            </h3>

            <div className="space-y-2">
              {filters.map((filter) => (
                <label
                  key={filter.id}
                  className="flex items-center gap-3 cursor-pointer group"
                >
                  <input
                    type="checkbox"
                    checked={filter.checked}
                    onChange={(e) => onFilterChange?.(filter.id, e.target.checked)}
                    className="w-4 h-4 rounded border-[var(--shop-border)] text-primary-500 focus:ring-primary-500/50 focus:ring-offset-0"
                  />
                  <span className="text-sm text-[var(--shop-text)] group-hover:text-primary-500 transition-colors">
                    {filter.label}
                  </span>
                </label>
              ))}
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
