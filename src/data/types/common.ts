// Re-export core types from the canonical source
export type { BaseEntity, Timestamps } from '@/lib/db/core/types';

export interface Authored {
  author: {
    id: string;
    name: string;
    avatar?: string;
  };
}

export interface Categorized {
  category: string;
  tags: string[];
}

export type ModuleType = 'learn' | 'forum' | 'space' | 'sprint' | 'shop';

export type ItemType = 'course' | 'lesson' | 'post' | 'project' | 'companion' | 'product';
