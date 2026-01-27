'use client';

import { cn } from '@/lib/utils';
import {
  TagIcon,
  ShoppingBagIcon,
  GiftIcon,
  BookOpenIcon,
  AcademicCapIcon,
  ChatBubbleIcon,
  UsersIcon,
  FireIcon,
  ShoppingCartIcon,
  SparklesIcon,
} from '@/components/icons';

// Helper to render perk icons (replacing emojis)
export function PerkIcon({ icon, className }: { icon: string; className?: string }) {
  const iconClass = cn('w-5 h-5', className);
  // Map emoji to icon
  if (icon.includes('🎟') || icon.includes('票') || icon.includes('派對')) {
    return <TagIcon className={iconClass} />;
  }
  if (icon.includes('🎒') || icon.includes('背包') || icon.includes('包')) {
    return <ShoppingBagIcon className={iconClass} />;
  }
  return <GiftIcon className={iconClass} />;
}

// Helper to render module icons (replacing emojis)
export function ModuleIcon({ title, className }: { title: string; className?: string }) {
  const iconClass = cn('w-10 h-10', className);
  switch (title) {
    case 'Learn':
      return <BookOpenIcon className={iconClass} />;
    case 'Test':
      return <AcademicCapIcon className={iconClass} />;
    case 'Forum':
      return <ChatBubbleIcon className={iconClass} />;
    case 'Space':
      return <UsersIcon className={iconClass} />;
    case 'Sprint':
      return <FireIcon className={iconClass} />;
    case 'Shop':
      return <ShoppingCartIcon className={iconClass} />;
    default:
      return <SparklesIcon className={iconClass} />;
  }
}
