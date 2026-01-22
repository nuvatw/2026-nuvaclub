'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { TABLE_OF_CONTENTS } from '../data/playbook-content';
import { ChevronDownIcon } from '@/components/icons';
import { cn } from '@/lib/utils';
import type { TOCItem } from '../types';

interface TOCItemComponentProps {
  item: TOCItem;
  activeId: string;
  expandedSections: Set<string>;
  toggleSection: (id: string) => void;
  onItemClick: (id: string) => void;
}

function TOCItemComponent({
  item,
  activeId,
  expandedSections,
  toggleSection,
  onItemClick,
}: TOCItemComponentProps) {
  const hasChildren = item.children && item.children.length > 0;
  const isExpanded = expandedSections.has(item.id);
  const isActive = activeId === item.id;
  const hasActiveChild = item.children?.some((child) => child.id === activeId);

  return (
    <div>
      <button
        onClick={() => {
          if (hasChildren) {
            toggleSection(item.id);
          }
          onItemClick(item.id);
        }}
        className={cn(
          'w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors',
          isActive || hasActiveChild
            ? 'bg-primary-500/10 text-primary-400 border-l-2 border-primary-500'
            : 'text-neutral-400 hover:text-white hover:bg-neutral-800/50'
        )}
      >
        <span className="truncate">{item.title}</span>
        {hasChildren && (
          <ChevronDownIcon
            className={cn(
              'w-4 h-4 flex-shrink-0 transition-transform',
              isExpanded && 'rotate-180'
            )}
          />
        )}
      </button>

      {/* Children */}
      <AnimatePresence>
        {hasChildren && isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="ml-4 mt-1 space-y-1 border-l border-neutral-800 pl-2"
          >
            {item.children!.map((child) => (
              <button
                key={child.id}
                onClick={() => onItemClick(child.id)}
                className={cn(
                  'w-full text-left px-3 py-1.5 rounded text-sm transition-colors',
                  activeId === child.id
                    ? 'text-primary-400 bg-primary-500/10'
                    : 'text-neutral-500 hover:text-neutral-300'
                )}
              >
                {child.title}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

interface PlaybookSidebarProps {
  activeId: string;
}

export function PlaybookSidebar({ activeId }: PlaybookSidebarProps) {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set()
  );
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Auto-expand parent of active section
  useEffect(() => {
    TABLE_OF_CONTENTS.forEach((item) => {
      if (item.children?.some((child) => child.id === activeId)) {
        setExpandedSections((prev) => new Set(prev).add(item.id));
      }
    });
  }, [activeId]);

  const toggleSection = (id: string) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleItemClick = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - offset;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    }
    setIsMobileOpen(false);
  };

  const sidebarContent = (
    <nav className="space-y-1">
      <div className="px-3 py-2 text-xs font-semibold text-neutral-500 uppercase tracking-wider">
        Contents
      </div>
      {TABLE_OF_CONTENTS.map((item) => (
        <TOCItemComponent
          key={item.id}
          item={item}
          activeId={activeId}
          expandedSections={expandedSections}
          toggleSection={toggleSection}
          onItemClick={handleItemClick}
        />
      ))}
    </nav>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-64 flex-shrink-0">
        <div className="sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto pr-4 pb-8">
          {sidebarContent}
        </div>
      </aside>

      {/* Mobile Toggle Button */}
      <button
        onClick={() => setIsMobileOpen(true)}
        className="lg:hidden fixed bottom-6 left-6 z-40 p-4 rounded-full bg-neutral-800 border border-neutral-700 shadow-lg hover:bg-neutral-700 transition-colors"
        aria-label="Open table of contents"
      >
        <svg
          className="w-5 h-5 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16M4 18h7"
          />
        </svg>
      </button>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileOpen(false)}
              className="lg:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="lg:hidden fixed top-0 left-0 bottom-0 z-50 w-72 bg-neutral-900 border-r border-neutral-800 overflow-y-auto"
            >
              <div className="sticky top-0 flex items-center justify-between p-4 border-b border-neutral-800 bg-neutral-900">
                <span className="font-semibold text-white">Contents</span>
                <button
                  onClick={() => setIsMobileOpen(false)}
                  className="p-2 rounded-lg hover:bg-neutral-800 transition-colors"
                >
                  <svg
                    className="w-5 h-5 text-neutral-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
              <div className="p-4">{sidebarContent}</div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
