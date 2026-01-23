/**
 * Playbook Content - Backward Compatibility Layer
 *
 * This file re-exports the current version's content for backward compatibility
 * with existing components. New components should import from versions/index.ts
 * directly for full version support.
 */

import {
  CURRENT_VERSION,
  VERSION_LIST,
  getPlaybookVersion,
  getLatestVersion,
  isLatestVersion,
  getAllVersionStrings,
} from './versions';

// Re-export version utilities
export {
  CURRENT_VERSION,
  VERSION_LIST,
  getPlaybookVersion,
  getLatestVersion,
  isLatestVersion,
  getAllVersionStrings,
};

// Backward compatibility exports (from current version)
export const QUICK_START_ITEMS = CURRENT_VERSION.quickStartItems;
export const IDENTITY_INFO = CURRENT_VERSION.identityInfo;
export const IDENTITY_CAPABILITIES = CURRENT_VERSION.identityCapabilities;
export const TABLE_OF_CONTENTS = CURRENT_VERSION.tableOfContents;
export const PLAYBOOK_CONTENT = CURRENT_VERSION.content;
