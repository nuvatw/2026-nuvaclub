'use client';

import { type HTMLAttributes, type ReactNode, forwardRef } from 'react';
import { cn } from '@/lib/utils';

/**
 * Card Component
 *
 * Design System Standards:
 * - Border radius: rounded-xl (12px) - consistent across all cards
 * - Background: neutral-900
 * - Border: neutral-800
 * - Variants: default, elevated, interactive
 */

type CardVariant = 'default' | 'elevated' | 'interactive';
type CardPadding = 'none' | 'sm' | 'md' | 'lg';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  /** @deprecated Use variant="interactive" instead */
  hover?: boolean;
  variant?: CardVariant;
  padding?: CardPadding;
  as?: 'div' | 'article' | 'section';
}

const PADDING_STYLES: Record<CardPadding, string> = {
  none: '',
  sm: 'p-3',      // 12px
  md: 'p-4',      // 16px
  lg: 'p-6',      // 24px
};

export const Card = forwardRef<HTMLDivElement, CardProps>(function Card(
  {
    children,
    hover = false,
    variant = 'default',
    padding = 'md',
    as: Component = 'div',
    className,
    ...props
  },
  ref
) {
  // Support legacy hover prop
  const effectiveVariant = hover ? 'interactive' : variant;

  const variantStyles: Record<CardVariant, string> = {
    default: '',
    elevated: 'shadow-lg shadow-black/20',
    interactive: cn(
      'cursor-pointer transition-all duration-200',
      'hover:border-neutral-700 hover:shadow-lg hover:shadow-black/10',
      'active:scale-[0.99]'
    ),
  };

  return (
    <Component
      ref={ref as React.Ref<HTMLDivElement>}
      className={cn(
        // Base styles - consistent across all cards
        'bg-neutral-900 rounded-xl border border-neutral-800',
        PADDING_STYLES[padding],
        variantStyles[effectiveVariant],
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
});

// Re-export for backward compatibility
export { Card as default };

interface CardHeaderProps {
  children: ReactNode;
  className?: string;
}

export function CardHeader({ children, className }: CardHeaderProps) {
  return (
    <div className={cn('mb-4', className)}>
      {children}
    </div>
  );
}

interface CardTitleProps {
  children: ReactNode;
  className?: string;
}

export function CardTitle({ children, className }: CardTitleProps) {
  return (
    <h3 className={cn('text-lg font-semibold text-white', className)}>
      {children}
    </h3>
  );
}

interface CardDescriptionProps {
  children: ReactNode;
  className?: string;
}

export function CardDescription({ children, className }: CardDescriptionProps) {
  return (
    <p className={cn('text-sm text-neutral-400 mt-1', className)}>
      {children}
    </p>
  );
}

interface CardContentProps {
  children: ReactNode;
  className?: string;
}

export function CardContent({ children, className }: CardContentProps) {
  return <div className={cn(className)}>{children}</div>;
}

interface CardFooterProps {
  children: ReactNode;
  className?: string;
}

export function CardFooter({ children, className }: CardFooterProps) {
  return (
    <div className={cn('mt-4 pt-4 border-t border-neutral-800', className)}>
      {children}
    </div>
  );
}
