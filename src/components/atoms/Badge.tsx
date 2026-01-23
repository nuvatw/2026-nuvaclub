'use client';

import { type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '@/lib/utils';

/**
 * Badge Component
 *
 * Design System Standards:
 * - Border radius: rounded-full (pill shape)
 * - Min height: sm=20px, md=24px
 * - Variants: default, primary, success, warning, error, info, outline
 */

type BadgeVariant = 'default' | 'primary' | 'success' | 'warning' | 'error' | 'info' | 'outline';
type BadgeSize = 'sm' | 'md';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: BadgeSize;
  children: ReactNode;
  /** Optional dot indicator before text */
  dot?: boolean;
}

const VARIANT_STYLES: Record<BadgeVariant, string> = {
  default: 'bg-neutral-700 text-neutral-200',
  primary: 'bg-primary-600/20 text-primary-400',
  success: 'bg-green-600/20 text-green-400',
  warning: 'bg-amber-600/20 text-amber-400',
  error: 'bg-red-600/20 text-red-400',
  info: 'bg-blue-600/20 text-blue-400',
  outline: 'bg-transparent border border-neutral-600 text-neutral-300',
};

const DOT_COLORS: Record<BadgeVariant, string> = {
  default: 'bg-neutral-400',
  primary: 'bg-primary-400',
  success: 'bg-green-400',
  warning: 'bg-amber-400',
  error: 'bg-red-400',
  info: 'bg-blue-400',
  outline: 'bg-neutral-400',
};

const SIZE_STYLES: Record<BadgeSize, string> = {
  sm: 'px-2 py-1 text-xs min-h-[20px]',     // Increased py-0.5 to py-1
  md: 'px-2.5 py-1 text-sm min-h-[24px]',
};

export function Badge({
  variant = 'default',
  size = 'sm',
  children,
  dot = false,
  className,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 font-medium rounded-full whitespace-nowrap',
        VARIANT_STYLES[variant],
        SIZE_STYLES[size],
        className
      )}
      {...props}
    >
      {dot && (
        <span className={cn('w-1.5 h-1.5 rounded-full', DOT_COLORS[variant])} />
      )}
      {children}
    </span>
  );
}
