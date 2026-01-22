'use client';

import { type ReactNode } from 'react';
import { motion } from 'motion/react';
import { useAuth } from './AuthProvider';
import { type Permission } from '@/features/auth/permissions';
import { cn } from '@/lib/utils';

interface UpgradePrompt {
  title: string;
  description: string;
  ctaText: string;
  ctaLink: string;
}

interface GateProps {
  permission: Permission | Permission[];
  children: ReactNode;
  fallback?: ReactNode;
  blurPreview?: boolean;
  upgradePrompt?: UpgradePrompt;
  requireAll?: boolean;
}

export function Gate({
  permission,
  children,
  fallback,
  blurPreview = false,
  upgradePrompt,
  requireAll = true,
}: GateProps) {
  const { hasPermission, hasAllPermissions, hasAnyPermission } = useAuth();

  const permissions = Array.isArray(permission) ? permission : [permission];
  const hasAccess = requireAll
    ? hasAllPermissions(permissions)
    : hasAnyPermission(permissions);

  if (hasAccess) {
    return <>{children}</>;
  }

  if (fallback) {
    return <>{fallback}</>;
  }

  if (blurPreview && upgradePrompt) {
    return (
      <div className="relative">
        <div className="blur-sm pointer-events-none select-none">
          {children}
        </div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={cn(
            'absolute inset-0 flex items-center justify-center',
            'bg-neutral-950/80 backdrop-blur-sm rounded-lg'
          )}
        >
          <div className="text-center p-6 max-w-sm">
            <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-neutral-800 flex items-center justify-center">
              <svg
                className="w-6 h-6 text-neutral-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">
              {upgradePrompt.title}
            </h3>
            <p className="text-sm text-neutral-400 mb-4">
              {upgradePrompt.description}
            </p>
            <a
              href={upgradePrompt.ctaLink}
              className={cn(
                'inline-flex items-center justify-center',
                'px-6 py-2 rounded-lg',
                'bg-primary-600 hover:bg-primary-500',
                'text-white font-medium text-sm',
                'transition-colors'
              )}
            >
              {upgradePrompt.ctaText}
            </a>
          </div>
        </motion.div>
      </div>
    );
  }

  return null;
}
