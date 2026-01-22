import type { IdentityType } from '@/features/auth/types';
import type { ModuleType } from '@/data/types';

export type SectionType = 'continue-watching' | 'free-content' | 'recommendations' | 'category';

export interface SectionVisibilityRule {
  allowedIdentities?: IdentityType[];
  excludedIdentities?: IdentityType[];
  condition?: () => boolean;
  hideWhenEmpty?: boolean;
}

export interface SectionConfig<T = unknown> {
  id: string;
  type: SectionType;
  title: string;
  titleByModule?: Partial<Record<ModuleType, string>>;
  order: number;
  visibility: SectionVisibilityRule;
  getData: () => T[] | Promise<T[]>;
  href?: string;
}

export const SECTION_ORDER = {
  CONTINUE_WATCHING: 1,
  FREE_CONTENT: 2,
  RECOMMENDATIONS: 3,
  CATEGORIES_START: 4,
} as const;

export const FREE_CONTENT_IDENTITIES: IdentityType[] = ['guest', 'explorer'];
