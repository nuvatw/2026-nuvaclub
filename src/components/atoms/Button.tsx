'use client';

import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { SpinnerIcon } from '@/components/icons';

/**
 * Button Component
 *
 * Design System Standards:
 * - Heights: sm=32px, md=40px, lg=48px (fixed)
 * - Active state: scale-[0.98] for tactile feedback
 * - Focus: visible ring with offset
 * - Loading: spinner replaces left icon, text preserved
 */

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  fullWidth?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      fullWidth = false,
      className,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles = cn(
      'inline-flex items-center justify-center font-medium',
      'rounded-lg transition-all duration-200',
      // Focus state - accessible and works on any background
      'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950',
      // Active/pressed state for tactile feedback
      'active:scale-[0.98]',
      // Disabled state
      'disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100'
    );

    const variantStyles = {
      primary: cn(
        'bg-primary-600 text-white',
        'hover:bg-primary-500',
        'active:bg-primary-700'
      ),
      secondary: cn(
        'bg-neutral-800 text-white border border-neutral-700',
        'hover:bg-neutral-700 hover:border-neutral-600',
        'active:bg-neutral-800'
      ),
      outline: cn(
        'bg-transparent border border-neutral-700 text-neutral-200',
        'hover:bg-neutral-800 hover:border-neutral-600',
        'active:bg-neutral-900'
      ),
      ghost: cn(
        'text-neutral-300 bg-transparent',
        'hover:bg-neutral-800 hover:text-white',
        'active:bg-neutral-900'
      ),
      danger: cn(
        'bg-red-600 text-white',
        'hover:bg-red-500',
        'active:bg-red-700'
      ),
    };

    // Fixed heights for consistency across the app
    const sizeStyles = {
      sm: 'h-8 px-3 text-sm gap-1.5',      // 32px height
      md: 'h-10 px-4 text-sm gap-2',        // 40px height
      lg: 'h-12 px-6 text-base gap-2',      // 48px height
    };

    const iconSizeMap = {
      sm: 'sm' as const,
      md: 'sm' as const,
      lg: 'md' as const,
    };

    return (
      <button
        ref={ref}
        className={cn(
          baseStyles,
          variantStyles[variant],
          sizeStyles[size],
          fullWidth && 'w-full',
          className
        )}
        disabled={disabled || isLoading}
        aria-busy={isLoading}
        aria-disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <SpinnerIcon size={iconSizeMap[size]} />
        ) : (
          leftIcon
        )}
        {children}
        {!isLoading && rightIcon}
      </button>
    );
  }
);

Button.displayName = 'Button';
