'use client';

import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import { SearchIcon, XIcon, QuestionMarkCircleIcon } from '@/components/icons';
import { cn } from '@/lib/utils';
import { useKeyboardShortcuts } from '@/features/keyboard-shortcuts';

// Import data sources for each scope
// Search functionality delegated to useGlobalSearch and domain hooks
import { useGlobalSearch } from '@/lib/hooks/domain/useGlobalSearch';
import { usePosts } from '@/features/forum/hooks';
import { useMatchingPosts } from '@/features/space/hooks';

// Types for search results
interface SearchResult {
  id: string;
  title: string;
  subtitle?: string;
  href?: string;
  category?: string;
  action?: () => void; // For commands that aren't navigation
}

type SearchScope = 'learn' | 'shop' | 'test' | 'forum' | 'space' | 'sprint' | 'global';

interface HeaderSearchProps {
  isOpen: boolean;
  onClose: () => void;
}

// Get scope from pathname
function getScopeFromPathname(pathname: string): SearchScope {
  if (pathname.startsWith('/learn')) return 'learn';
  if (pathname.startsWith('/shop')) return 'shop';
  if (pathname.startsWith('/test')) return 'test';
  if (pathname.startsWith('/forum')) return 'forum';
  if (pathname.startsWith('/space')) return 'space';
  if (pathname.startsWith('/sprint')) return 'sprint';
  return 'global';
}

// Scope labels for placeholder
const SCOPE_LABELS: Record<SearchScope, string> = {
  learn: 'Search courses...',
  shop: 'Search products...',
  test: 'Search tests...',
  forum: 'Search discussions...',
  space: 'Search mentors & learners...',
  sprint: 'Search projects...',
  global: 'Search...',
};

// Search functions moved inside component to access hook data

// Quick navigation commands shown when no search query
const QUICK_COMMANDS: SearchResult[] = [
  { id: 'nav-learn', title: 'Go to Learn', subtitle: 'Browse courses', href: '/learn', category: 'Navigation' },
  { id: 'nav-test', title: 'Go to Test', subtitle: 'Take tests', href: '/test', category: 'Navigation' },
  { id: 'nav-forum', title: 'Go to Forum', subtitle: 'Join discussions', href: '/forum', category: 'Navigation' },
  { id: 'nav-space', title: 'Go to Space', subtitle: 'Find mentors', href: '/space', category: 'Navigation' },
  { id: 'nav-sprint', title: 'Go to Sprint', subtitle: 'View projects', href: '/sprint', category: 'Navigation' },
  { id: 'nav-shop', title: 'Go to Shop', subtitle: 'Browse products', href: '/shop', category: 'Navigation' },
];

export function HeaderSearch({ isOpen, onClose }: HeaderSearchProps) {
  const pathname = usePathname();
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { openHelp } = useKeyboardShortcuts();

  // Integrated Global Search Hook
  const {
    getAllCourses,
    getAllShopProducts,
    getProjectsWithSeasonInfo
  } = useGlobalSearch();

  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  const scope = getScopeFromPathname(pathname);
  const placeholder = SCOPE_LABELS[scope];

  // Get forum posts for searching
  const { posts: forumPosts } = usePosts();

  // Get matching posts for space searching
  const { posts: matchingPosts } = useMatchingPosts({ isActive: true });

  // Search functions using hook data
  const searchCourses = useCallback((query: string): SearchResult[] => {
    const courses = getAllCourses();
    const lowerQuery = query.toLowerCase();

    return courses
      .filter((course: any) =>
        course.title.toLowerCase().includes(lowerQuery) ||
        course.subtitle?.toLowerCase().includes(lowerQuery) ||
        course.description?.toLowerCase().includes(lowerQuery) ||
        course.instructor?.name?.toLowerCase().includes(lowerQuery) ||
        course.tags?.some((tag: string) => tag.toLowerCase().includes(lowerQuery))
      )
      .slice(0, 8)
      .map((course: any) => ({
        id: course.id,
        title: course.title,
        subtitle: course.instructor?.name,
        href: `/learn/${course.id}`,
        category: course.category,
      }));
  }, [getAllCourses]);

  const searchProducts = useCallback((query: string): SearchResult[] => {
    const products = getAllShopProducts();
    const lowerQuery = query.toLowerCase();

    return products
      .filter((product: any) =>
        product.name?.toLowerCase().includes(lowerQuery) ||
        product.title?.toLowerCase().includes(lowerQuery) || // Handles unified field
        product.description?.toLowerCase().includes(lowerQuery)
      )
      .slice(0, 8)
      .map((product: any) => ({
        id: product.id,
        title: product.name || product.title,
        subtitle: product.price ? `NT$${product.price.toLocaleString()}` : '',
        href: product.category === 'event' ? `/shop/events/${product.id}` : '/shop',
        category: product.category,
      }));
  }, [getAllShopProducts]);

  const searchProjects = useCallback((query: string): SearchResult[] => {
    const projects = getProjectsWithSeasonInfo();
    const lowerQuery = query.toLowerCase();

    return projects
      .filter((project: any) =>
        project.title.toLowerCase().includes(lowerQuery) ||
        project.author?.name?.toLowerCase().includes(lowerQuery) ||
        project.description?.toLowerCase().includes(lowerQuery)
      )
      .slice(0, 8)
      .map((project: any) => ({
        id: project.id,
        title: project.title,
        subtitle: project.author?.name,
        href: `/sprint/project/${project.id}`,
        category: 'Project',
      }));
  }, [getProjectsWithSeasonInfo]);

  // Keyboard shortcuts command
  const keyboardShortcutsCommand: SearchResult = useMemo(() => ({
    id: 'cmd-shortcuts',
    title: 'View keyboard shortcuts',
    subtitle: 'See all available shortcuts',
    category: 'Command',
    action: () => {
      onClose();
      openHelp();
    },
  }), [onClose, openHelp]);

  // Search forum posts by title and content
  const searchForumPosts = useCallback((searchQuery: string): SearchResult[] => {
    const lowerQuery = searchQuery.toLowerCase();

    return forumPosts
      .filter((post) =>
        post.title.toLowerCase().includes(lowerQuery) ||
        post.content.toLowerCase().includes(lowerQuery) ||
        post.author?.name?.toLowerCase().includes(lowerQuery) ||
        post.tags?.some((tag) => tag.toLowerCase().includes(lowerQuery))
      )
      .slice(0, 8)
      .map((post) => ({
        id: post.id,
        title: post.title,
        subtitle: post.author?.name ?? 'Unknown',
        href: `/forum/${post.id}`,
        category: post.category,
      }));
  }, [forumPosts]);

  // Search matching posts (space) by title and content
  const searchMatchingPosts = useCallback((searchQuery: string): SearchResult[] => {
    const lowerQuery = searchQuery.toLowerCase();

    return matchingPosts
      .filter((post) =>
        post.title.toLowerCase().includes(lowerQuery) ||
        post.content?.toLowerCase().includes(lowerQuery) ||
        post.author?.name?.toLowerCase().includes(lowerQuery) ||
        post.tags?.some((tag) => tag.toLowerCase().includes(lowerQuery))
      )
      .slice(0, 8)
      .map((post) => ({
        id: post.id,
        title: post.title,
        subtitle: post.author?.name ?? 'Unknown',
        href: `/space`, // Space posts don't have individual pages
        category: post.type === 'nunu-looking-for-vava' ? 'Nunu' : 'Vava',
      }));
  }, [matchingPosts]);

  // Search results based on scope
  const results = useMemo<SearchResult[]>(() => {
    // Show quick commands when no query
    if (!query.trim()) {
      return [...QUICK_COMMANDS, keyboardShortcutsCommand];
    }

    const lowerQuery = query.toLowerCase();

    // Check if query matches any quick commands
    const matchingCommands = [...QUICK_COMMANDS, keyboardShortcutsCommand].filter(
      (cmd) =>
        cmd.title.toLowerCase().includes(lowerQuery) ||
        cmd.subtitle?.toLowerCase().includes(lowerQuery)
    );

    let searchResults: SearchResult[];

    switch (scope) {
      case 'learn':
        searchResults = searchCourses(query);
        break;
      case 'shop':
        searchResults = searchProducts(query);
        break;
      case 'sprint':
        searchResults = searchProjects(query);
        break;
      case 'forum':
        searchResults = searchForumPosts(query);
        break;
      case 'space':
        searchResults = searchMatchingPosts(query);
        break;
      case 'test':
        // Test has no searchable content
        searchResults = [];
        break;
      default:
        // Global search: combine all
        searchResults = [
          ...searchCourses(query).slice(0, 3),
          ...searchProducts(query).slice(0, 3),
          ...searchProjects(query).slice(0, 3),
          ...searchForumPosts(query).slice(0, 2),
        ];
    }

    // Combine matching commands with search results
    return [...matchingCommands, ...searchResults];
  }, [query, scope, searchForumPosts, searchMatchingPosts, keyboardShortcutsCommand, searchCourses, searchProducts, searchProjects]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Reset state when closed
  useEffect(() => {
    if (!isOpen) {
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  // Handle keyboard navigation
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'Escape':
        onClose();
        break;
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex((prev) => Math.min(prev + 1, results.length - 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex((prev) => Math.max(prev - 1, 0));
        break;
      case 'Enter':
        if (results[selectedIndex]) {
          const result = results[selectedIndex];
          if (result.action) {
            result.action();
          } else if (result.href) {
            router.push(result.href);
            onClose();
          }
        }
        break;
    }
  }, [results, selectedIndex, router, onClose]);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  // Handle result click
  const handleResultClick = (result: SearchResult) => {
    if (result.action) {
      result.action();
    } else if (result.href) {
      router.push(result.href);
      onClose();
    }
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
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            aria-hidden="true"
          />

          {/* Search Modal */}
          <motion.div
            ref={containerRef}
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="fixed top-20 left-1/2 -translate-x-1/2 z-50 w-full max-w-xl px-4"
            role="dialog"
            aria-modal="true"
            aria-label="Search"
            data-keyboard-shortcut-modal="true"
          >
            <div className="bg-neutral-900 border border-neutral-700 rounded-2xl shadow-2xl overflow-hidden">
              {/* Search Input */}
              <div className="relative flex items-center border-b border-neutral-800">
                <SearchIcon size="md" className="absolute left-4 text-neutral-500" />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setSelectedIndex(0);
                  }}
                  onKeyDown={handleKeyDown}
                  placeholder={placeholder}
                  className={cn(
                    'w-full h-14 pl-12 pr-12 bg-transparent',
                    'text-white text-base placeholder-neutral-500',
                    'focus:outline-none'
                  )}
                  aria-label="Search input"
                  aria-autocomplete="list"
                  aria-controls="search-results"
                />
                {query && (
                  <button
                    type="button"
                    onClick={() => setQuery('')}
                    className="absolute right-4 p-1 text-neutral-500 hover:text-white transition-colors rounded-full hover:bg-neutral-800"
                    aria-label="Clear search"
                  >
                    <XIcon size="sm" />
                  </button>
                )}
              </div>

              {/* Results */}
              <div
                id="search-results"
                role="listbox"
                className="max-h-80 overflow-y-auto"
              >
                {query.trim() && results.length === 0 && (
                  <div className="px-4 py-8 text-center">
                    <p className="text-neutral-500">No results found for "{query}"</p>
                    <p className="text-sm text-neutral-600 mt-1">Try a different search term</p>
                  </div>
                )}

                {results.length > 0 && (
                  <ul className="py-2">
                    {/* Section header for quick commands */}
                    {!query.trim() && (
                      <li className="px-4 py-1.5">
                        <span className="text-xs font-medium text-neutral-500 uppercase tracking-wider">
                          Quick Actions
                        </span>
                      </li>
                    )}
                    {results.map((result, index) => (
                      <li key={result.id}>
                        <button
                          type="button"
                          onClick={() => handleResultClick(result)}
                          onMouseEnter={() => setSelectedIndex(index)}
                          className={cn(
                            'w-full px-4 py-3 flex items-center gap-3 text-left transition-colors',
                            index === selectedIndex
                              ? 'bg-neutral-800'
                              : 'hover:bg-neutral-800/50'
                          )}
                          role="option"
                          aria-selected={index === selectedIndex}
                        >
                          {result.id === 'cmd-shortcuts' && (
                            <QuestionMarkCircleIcon size="md" className="text-neutral-400 flex-shrink-0" />
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="text-white font-medium truncate">{result.title}</p>
                            {result.subtitle && (
                              <p className="text-sm text-neutral-500 truncate">{result.subtitle}</p>
                            )}
                          </div>
                          {result.category && (
                            <span className="flex-shrink-0 px-2 py-0.5 bg-neutral-700 text-neutral-400 text-xs rounded">
                              {result.category}
                            </span>
                          )}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Footer Hint */}
              <div className="px-4 py-2 border-t border-neutral-800 flex items-center justify-between text-xs text-neutral-600">
                <span>
                  <kbd className="px-1.5 py-0.5 bg-neutral-800 rounded mr-1">↑</kbd>
                  <kbd className="px-1.5 py-0.5 bg-neutral-800 rounded mr-1">↓</kbd>
                  to navigate
                </span>
                <span>
                  <kbd className="px-1.5 py-0.5 bg-neutral-800 rounded mr-1">Enter</kbd>
                  to select
                </span>
                <span>
                  <kbd className="px-1.5 py-0.5 bg-neutral-800 rounded">Esc</kbd>
                  to close
                </span>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
