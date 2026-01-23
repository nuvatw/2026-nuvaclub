/**
 * Playbook Versions Index
 *
 * This module manages all playbook versions and provides utilities
 * for accessing version information and switching between versions.
 */

import type { PlaybookVersion, VersionInfo } from '../../types';
import { PLAYBOOK_V1_0_0 } from './v1.0.0';
import { PLAYBOOK_V2_0_0 } from './v2.0.0';
import { PLAYBOOK_V3_0_0 } from './v3.0.0';

// All available versions (newest first)
export const PLAYBOOK_VERSIONS: PlaybookVersion[] = [
  PLAYBOOK_V3_0_0,
  PLAYBOOK_V2_0_0,
  PLAYBOOK_V1_0_0,
];

// Current/latest version
export const CURRENT_VERSION = PLAYBOOK_V3_0_0;

// Version info list for dropdown
export const VERSION_LIST: VersionInfo[] = PLAYBOOK_VERSIONS.map((v) => v.info);

// Get version by version string
export function getPlaybookVersion(version: string): PlaybookVersion | undefined {
  return PLAYBOOK_VERSIONS.find((v) => v.info.version === version);
}

// Get the latest version
export function getLatestVersion(): PlaybookVersion {
  return CURRENT_VERSION;
}

// Check if a version is the latest
export function isLatestVersion(version: string): boolean {
  return CURRENT_VERSION.info.version === version;
}

// Get all version strings
export function getAllVersionStrings(): string[] {
  return PLAYBOOK_VERSIONS.map((v) => v.info.version);
}

// Export individual versions for direct access
export { PLAYBOOK_V1_0_0, PLAYBOOK_V2_0_0, PLAYBOOK_V3_0_0 };
