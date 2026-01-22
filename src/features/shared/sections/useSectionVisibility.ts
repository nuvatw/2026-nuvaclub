'use client';

import { useMemo } from 'react';
import { useAuth } from '@/features/auth/components/AuthProvider';
import { useProgress } from '@/features/shared/progress/useProgress';
import type { SectionVisibilityRule } from './types';
import type { ModuleType } from '@/data/types';
import { FREE_CONTENT_IDENTITIES } from './types';

export function useSectionVisibility(moduleType: ModuleType) {
  const { identity } = useAuth();
  const { hasProgress, isHydrated } = useProgress(moduleType);

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
    return isHydrated && hasProgress(moduleType);
  }, [isHydrated, hasProgress, moduleType]);

  const shouldShowFreeContent = useMemo(() => {
    return FREE_CONTENT_IDENTITIES.includes(identity);
  }, [identity]);

  return {
    checkVisibility,
    shouldShowContinueWatching,
    shouldShowFreeContent,
    isHydrated,
    identity,
  };
}
