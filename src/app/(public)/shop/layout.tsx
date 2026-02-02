'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import {
  CheckCircleIcon,
  CalendarIcon,
  ShoppingBagIcon,
  UsersIcon,
} from '@/components/icons';
import { cn } from '@/lib/utils';

// Category types
type CategoryId = 'plan' | 'duo' | 'events' | 'merchandise';

interface CategoryConfig {
  id: CategoryId;
  title: string;
  href: string;
  icon: React.ReactNode;
}

// Category configurations with routes
const CATEGORIES: CategoryConfig[] = [
  {
    id: 'plan',
    title: 'Plan',
    href: '/shop/plan',
    icon: <CheckCircleIcon size="md" />,
  },
  {
    id: 'duo',
    title: 'Duo',
    href: '/shop/duo',
    icon: <UsersIcon />,
  },
  // {
  //   id: 'events',
  //   title: 'Event',
  //   href: '/shop/events',
  //   icon: <CalendarIcon size="md" />,
  // },
  // {
  //   id: 'merchandise',
  //   title: 'Merchandise',
  //   href: '/shop/merchandise',
  //   icon: <ShoppingBagIcon size="md" />,
  // },
];

function CategoryPill({
  config,
  isSelected,
}: {
  config: CategoryConfig;
  isSelected: boolean;
}) {
  return (
    <Link
      href={config.href}
      scroll={false}
      className={cn(
        'flex items-center gap-2 px-4 py-2 rounded-full border transition-all duration-200',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950',
        isSelected
          ? 'bg-white text-neutral-900 border-white'
          : 'bg-neutral-800/50 border-neutral-700 text-neutral-300 hover:border-neutral-500 hover:text-white'
      )}
      aria-current={isSelected ? 'page' : undefined}
    >
      <span className="w-4 h-4 [&>svg]:w-4 [&>svg]:h-4">
        {config.icon}
      </span>
      <span className="font-medium text-sm">
        {config.title}
      </span>
    </Link>
  );
}

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Determine active category from pathname
  const getActiveCategory = (): CategoryId => {
    if (pathname.startsWith('/shop/events')) return 'events';
    if (pathname.startsWith('/shop/merchandise')) return 'merchandise';
    if (pathname.startsWith('/shop/duo')) return 'duo';
    if (pathname.startsWith('/shop/plan')) return 'plan';
    // Default for /shop base route
    return 'plan';
  };

  const activeCategory = getActiveCategory();

  return (
    <div className="shop-page min-h-screen bg-[var(--shop-bg)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Category Header - Persists across all shop routes */}
        <div className="mb-6">
          <p className="text-neutral-400 text-center mb-4">
            Choose a category to explore our offerings
          </p>

          {/* Category Pills */}
          <nav
            className="flex flex-wrap justify-center gap-2 md:gap-3"
            role="tablist"
            aria-label="Shop categories"
          >
            {CATEGORIES.map((category) => (
              <CategoryPill
                key={category.id}
                config={category}
                isSelected={activeCategory === category.id}
              />
            ))}
          </nav>
        </div>

        {/* Content Area with subtle transition */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
