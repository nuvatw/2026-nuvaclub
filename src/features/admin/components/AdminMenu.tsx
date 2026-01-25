'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import {
  ShieldIcon,
  ChevronDownIcon,
  ShoppingBagIcon,
  BookOpenIcon,
  UsersIcon,
  ChatBubbleIcon,
  TrashIcon,
} from '@/components/icons';

interface AdminMenuItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string; size?: 'sm' | 'md' | 'lg' }>;
  description: string;
}

const ADMIN_MENU_ITEMS: AdminMenuItem[] = [
  {
    label: 'Manage Products',
    href: '/admin/products',
    icon: ShoppingBagIcon,
    description: 'Create, edit, and manage products',
  },
  {
    label: 'Manage Courses',
    href: '/admin/courses',
    icon: BookOpenIcon,
    description: 'Create, edit, and manage courses',
  },
  {
    label: 'User Directory',
    href: '/admin/users',
    icon: UsersIcon,
    description: 'View users and relationships',
  },
  {
    label: 'Moderate Matching Board',
    href: '/admin/matching-posts',
    icon: TrashIcon,
    description: 'Review and delete matching posts',
  },
  {
    label: 'Moderate Forum',
    href: '/admin/forum-posts',
    icon: ChatBubbleIcon,
    description: 'Review and delete forum posts',
  },
];

export function AdminMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close menu on escape
  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    }

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors',
          'bg-amber-600/20 text-amber-400 hover:bg-amber-600/30',
          'focus:outline-none focus:ring-2 focus:ring-amber-500/50'
        )}
        aria-label="Admin menu"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <ShieldIcon size="sm" />
        <span>Admin</span>
        <ChevronDownIcon
          size="sm"
          className={cn('transition-transform', isOpen && 'rotate-180')}
        />
      </button>

      {isOpen && (
        <div
          className={cn(
            'absolute right-0 top-full mt-2 w-72 rounded-lg',
            'bg-zinc-900 border border-zinc-700 shadow-xl',
            'py-2 z-50'
          )}
          role="menu"
        >
          <div className="px-3 py-2 border-b border-zinc-700">
            <div className="flex items-center gap-2 text-amber-400">
              <ShieldIcon size="sm" />
              <span className="text-sm font-semibold">Admin Tools</span>
            </div>
          </div>

          <div className="py-1">
            {ADMIN_MENU_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={cn(
                  'flex items-start gap-3 px-3 py-2.5 transition-colors',
                  'hover:bg-zinc-800 group'
                )}
                role="menuitem"
              >
                <item.icon
                  size="md"
                  className="text-zinc-400 group-hover:text-zinc-200 mt-0.5 shrink-0"
                />
                <div>
                  <div className="text-sm font-medium text-zinc-200 group-hover:text-white">
                    {item.label}
                  </div>
                  <div className="text-xs text-zinc-500 group-hover:text-zinc-400">
                    {item.description}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
