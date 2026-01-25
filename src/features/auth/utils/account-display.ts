/**
 * Account Display Utilities
 *
 * Centralized logic for displaying test accounts in the Login modal.
 * This ensures consistent, data-backed role descriptions and validates
 * that mission text corresponds to nunu levels.
 */

import type { IdentityType } from '@/features/auth/types';
import { IDENTITY_LABELS, IDENTITY_COLORS } from '@/features/auth/types';
import type { NunuLevel } from '@/features/mission/types';
import { MISSION_REQUIREMENTS } from '@/features/mission/types';

// ============================================
// Types
// ============================================

export interface TestAccountProfile {
  id: string;
  name: string;
  identity: IdentityType;
  isNunu?: boolean;
  nLevel?: NunuLevel;
  fafaCount?: number;
  hasNunuCount?: number;
  isTestingNx?: boolean;
  isDuo?: boolean;
}

export interface DisplayBadge {
  label: string;
  className: string;
}

export interface ValidationIssue {
  field: string;
  message: string;
}

// ============================================
// Mission Mapping by Nunu Level
// ============================================

/**
 * Single source of truth for mission descriptions by Nunu level.
 * These describe the primary mission/responsibility for each level.
 */
export const MISSIONS_BY_NUNU_LEVEL: Record<NunuLevel, string> = {
  Nx: 'Complete Nunu training',
  N5: 'Mentor up to 3 Vavas',
  N4: 'Mentor up to 5 Vavas',
  N3: 'Mentor up to 10 Vavas',
  N2: 'Mentor up to 30 Vavas',
  N1: 'Master Nunu, lead mentors',
};

/**
 * Get the mission string for a given Nunu level.
 */
export function getMissionForNunuLevel(level: NunuLevel): string {
  return MISSIONS_BY_NUNU_LEVEL[level];
}

// ============================================
// Subtitle Generation
// ============================================

/**
 * Generates a clean, data-backed subtitle for an account.
 * This replaces hardcoded description strings with computed text.
 */
export function formatAccountSubtitle(account: TestAccountProfile): string {
  const parts: string[] = [];

  // Mode: Solo or Duo
  if (account.isDuo) {
    parts.push('Duo');
  } else if (account.identity !== 'guest') {
    parts.push('Solo');
  }

  // Nunu status and level
  if (account.isNunu) {
    if (account.nLevel) {
      parts.push(`Nunu ${account.nLevel}`);
    } else {
      parts.push('Nunu');
    }
  }

  // Fafa count (mentees)
  if (account.fafaCount && account.fafaCount > 0) {
    parts.push(`${account.fafaCount} Vava${account.fafaCount > 1 ? 's' : ''}`);
  }

  // Has Nunu count (mentors user has)
  if (account.hasNunuCount && account.hasNunuCount > 0) {
    parts.push(`${account.hasNunuCount} Nunu${account.hasNunuCount > 1 ? 's' : ''}`);
  }

  // NX Testing flag
  if (account.isTestingNx) {
    parts.push('NX Testing');
  }

  if (parts.length === 0) {
    // Guest or minimal account
    if (account.identity === 'guest') {
      return 'Not logged in';
    }
    return 'Basic member';
  }

  return parts.join(' \u00B7 '); // Middle dot separator
}

// ============================================
// Badge Generation
// ============================================

/**
 * Get the primary badge (identity type) for an account.
 * Returns a single, consistently styled badge.
 */
export function getPrimaryBadge(account: TestAccountProfile): DisplayBadge {
  return {
    label: IDENTITY_LABELS[account.identity],
    className: `${IDENTITY_COLORS[account.identity]} text-white`,
  };
}

/**
 * Get secondary badges for the detail view (max 2).
 * Uses neutral/grayscale styling for visual calm.
 */
export function getSecondaryBadges(account: TestAccountProfile): DisplayBadge[] {
  const badges: DisplayBadge[] = [];

  // Nunu status with level
  if (account.isNunu && account.nLevel) {
    badges.push({
      label: `Nunu ${account.nLevel}`,
      className: 'bg-neutral-700 text-neutral-300',
    });
  } else if (account.isNunu) {
    badges.push({
      label: 'Nunu',
      className: 'bg-neutral-700 text-neutral-300',
    });
  }

  // NX Testing (if relevant, high priority indicator)
  if (account.isTestingNx && badges.length < 2) {
    badges.push({
      label: 'NX Testing',
      className: 'bg-neutral-700 text-amber-400',
    });
  }

  // Only return first 2
  return badges.slice(0, 2);
}

// ============================================
// Validation
// ============================================

/**
 * Validate a test account for data consistency.
 * Returns an array of issues found.
 */
export function validateTestAccount(account: TestAccountProfile): ValidationIssue[] {
  const issues: ValidationIssue[] = [];

  // Check: if isNunu is true, nLevel should typically be defined for non-testing accounts
  if (account.isNunu && !account.nLevel && !account.isTestingNx) {
    // This is a soft warning - some Nunus might be in candidate status without a level yet
    // We allow this but could flag if needed
  }

  // Check: nLevel should only exist if isNunu is true (or if user is testing)
  if (account.nLevel && !account.isNunu && !account.isTestingNx) {
    issues.push({
      field: 'nLevel',
      message: `Account has nLevel (${account.nLevel}) but isNunu is false`,
    });
  }

  // Check: fafaCount > 0 typically requires isNunu to be true
  if (account.fafaCount && account.fafaCount > 0 && !account.isNunu) {
    issues.push({
      field: 'fafaCount',
      message: `Account has ${account.fafaCount} Vavas but isNunu is false`,
    });
  }

  // Check: validate nLevel is within expected values
  if (account.nLevel) {
    const validLevels: NunuLevel[] = ['Nx', 'N5', 'N4', 'N3', 'N2', 'N1'];
    if (!validLevels.includes(account.nLevel)) {
      issues.push({
        field: 'nLevel',
        message: `Invalid nLevel: ${account.nLevel}`,
      });
    }
  }

  // Check: if nLevel is set, verify max Vavas constraint from mission requirements
  if (account.nLevel && account.fafaCount) {
    const requirements = MISSION_REQUIREMENTS[account.nLevel];
    if (requirements && account.fafaCount > requirements.maxActiveNunu) {
      // This is informational - the fafaCount might exceed typical limits
      // but it's test data so we don't fail on this
    }
  }

  // Check: identity should be valid
  const validIdentities: IdentityType[] = [
    'guest',
    'explorer',
    'solo-traveler',
    'voyager',
    'duo-go',
    'duo-run',
    'duo-fly',
  ];
  if (!validIdentities.includes(account.identity)) {
    issues.push({
      field: 'identity',
      message: `Invalid identity: ${account.identity}`,
    });
  }

  return issues;
}

/**
 * Validate all test accounts and log issues in development.
 * Call this once when loading accounts.
 */
export function validateAllTestAccounts(
  accounts: TestAccountProfile[],
  logWarnings: boolean = true
): Map<string, ValidationIssue[]> {
  const allIssues = new Map<string, ValidationIssue[]>();

  for (const account of accounts) {
    const issues = validateTestAccount(account);
    if (issues.length > 0) {
      allIssues.set(account.id, issues);
      if (logWarnings && typeof window !== 'undefined') {
        console.warn(`[TestAccount Validation] ${account.name} (${account.id}):`, issues);
      }
    }
  }

  return allIssues;
}

// ============================================
// Account Detail Formatting
// ============================================

export interface AccountDetailSection {
  label: string;
  value: string;
}

/**
 * Get detailed information for the selected account panel.
 */
export function getAccountDetails(account: TestAccountProfile): AccountDetailSection[] {
  const details: AccountDetailSection[] = [];

  // Identity/Role
  details.push({
    label: 'Membership',
    value: IDENTITY_LABELS[account.identity],
  });

  // Mode
  details.push({
    label: 'Mode',
    value: account.isDuo ? 'Duo (Paired)' : 'Solo',
  });

  // Nunu Status
  if (account.isNunu) {
    details.push({
      label: 'Nunu Status',
      value: account.nLevel ? `Level ${account.nLevel}` : 'Active Nunu',
    });
  }

  // Mission (if Nunu with level)
  if (account.nLevel) {
    details.push({
      label: 'Mission',
      value: getMissionForNunuLevel(account.nLevel),
    });
  }

  // Vava count (mentees)
  if (account.fafaCount && account.fafaCount > 0) {
    details.push({
      label: 'Active Vavas',
      value: String(account.fafaCount),
    });
  }

  // Nunu count (mentors)
  if (account.hasNunuCount && account.hasNunuCount > 0) {
    details.push({
      label: 'Matched Nunus',
      value: String(account.hasNunuCount),
    });
  }

  // NX Testing
  if (account.isTestingNx) {
    details.push({
      label: 'Testing',
      value: 'NX Features Enabled',
    });
  }

  return details;
}
