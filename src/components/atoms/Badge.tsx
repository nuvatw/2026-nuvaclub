'use client';

import { type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'error' | 'outline';
  size?: 'sm' | 'md';
  children: ReactNode;
}

export function Badge({
  variant = 'default',
  size = 'sm',
  children,
  className,
  ...props
}: BadgeProps) {
  const variantStyles = {
    default: 'bg-neutral-700 text-neutral-200',
    primary: 'bg-primary-600/20 text-primary-400',
    success: 'bg-green-600/20 text-green-400',
    warning: 'bg-amber-600/20 text-amber-400',
    error: 'bg-red-600/20 text-red-400',
    outline: 'bg-transparent border border-neutral-600 text-neutral-300',
  };

  const sizeStyles = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center font-medium rounded-full',
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
