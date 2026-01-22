'use client';

import { cn } from '@/lib/utils';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages: (number | 'ellipsis')[] = [];
    const delta = 1; // Pages to show on each side of current page

    // Always show first page
    pages.push(1);

    // Calculate range around current page
    const rangeStart = Math.max(2, currentPage - delta);
    const rangeEnd = Math.min(totalPages - 1, currentPage + delta);

    // Add ellipsis after first page if needed
    if (rangeStart > 2) {
      pages.push('ellipsis');
    }

    // Add pages in range
    for (let i = rangeStart; i <= rangeEnd; i++) {
      pages.push(i);
    }

    // Add ellipsis before last page if needed
    if (rangeEnd < totalPages - 1) {
      pages.push('ellipsis');
    }

    // Always show last page if more than 1 page
    if (totalPages > 1) {
      pages.push(totalPages);
    }

    return pages;
  };

  const pages = getPageNumbers();

  return (
    <nav className="flex items-center justify-center gap-1" aria-label="Pagination">
      {/* Previous Button */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={cn(
          'px-4 py-2 text-sm font-medium rounded-lg transition-colors',
          currentPage === 1
            ? 'text-[var(--shop-text-muted)] cursor-not-allowed'
            : 'text-[var(--shop-text)] hover:bg-[var(--shop-border)]'
        )}
        aria-label="Go to previous page"
      >
        Previous
      </button>

      {/* Page Numbers */}
      <div className="flex items-center gap-1">
        {pages.map((page, index) =>
          page === 'ellipsis' ? (
            <span
              key={`ellipsis-${index}`}
              className="px-3 py-2 text-[var(--shop-text-muted)]"
            >
              ...
            </span>
          ) : (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={cn(
                'min-w-[40px] px-3 py-2 text-sm font-medium rounded-lg transition-colors',
                page === currentPage
                  ? 'bg-primary-500 text-white'
                  : 'text-[var(--shop-text)] hover:bg-[var(--shop-border)]'
              )}
              aria-label={`Go to page ${page}`}
              aria-current={page === currentPage ? 'page' : undefined}
            >
              {page}
            </button>
          )
        )}
      </div>

      {/* Next Button */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={cn(
          'px-4 py-2 text-sm font-medium rounded-lg transition-colors',
          currentPage === totalPages
            ? 'text-[var(--shop-text-muted)] cursor-not-allowed'
            : 'text-[var(--shop-text)] hover:bg-[var(--shop-border)]'
        )}
        aria-label="Go to next page"
      >
        Next
      </button>
    </nav>
  );
}
