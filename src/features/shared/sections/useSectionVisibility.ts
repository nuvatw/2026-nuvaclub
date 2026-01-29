'use client';

import { useMemo } from 'react';
import { useAuth } from '@/features/auth/components/AuthProvider';
import { useProgress } from '@/features/shared/progress/useProgress';
import type { SectionVisibilityRule } from './types';
import type { ModuleType } from '@/lib/types/legacy-user-state';
import { isGuestOrExplorer } from '@/features/auth/utils/role-gating';

/**
 * Hook for determining section visibility based on identity and progress.
 * @param moduleType - The module type (learn, forum, etc.)
 * @param userId - Optional user ID to check progress for (defaults to current account)
 */
export function useSectionVisibility(moduleType: ModuleType, userId?: string | null) {
  const { identity, currentAccountId } = useAuth();

  // Use provided userId or fall back to currentAccountId
  const effectiveAccountId = userId ?? currentAccountId;
  const { hasProgress, isHydrated, effectiveUserId } = useProgress(moduleType, effectiveAccountId);

  const checkVisibility = useMemo(() => {
    return (rule: SectionVisibilityRule, isEmpty: boolean): boolean => {
      // Check identity allowlist
      if (rule.allowedIdentities && !rule.allowedIdentities.includes(identity)) {
        return false;
      }

      // Check identity blocklist
      if (rule.excludedIdentities && rule.excludedIdentities.includes(identity)) {
        return false;
      }

      // Check custom condition
      if (rule.condition && !rule.condition()) {
        return false;
      }

      // Hide if empty and hideWhenEmpty is true
      if (rule.hideWhenEmpty && isEmpty) {
        return false;
      }

      return true;
    };
  }, [identity]);

  // Pre-built visibility checks for common patterns
  const shouldShowContinueWatching = useMemo(() => {
    return isHydrated && hasProgress(moduleType, effectiveAccountId);
  }, [isHydrated, hasProgress, moduleType, effectiveAccountId]);

  const shouldShowFreeContent = useMemo(() => {
    return isGuestOrExplorer(identity);
  }, [identity]);

  return {
    checkVisibility,
    shouldShowContinueWatching,
    shouldShowFreeContent,
    isHydrated,
    identity,
    effectiveUserId,
    currentAccountId: effectiveAccountId,
  };
}
