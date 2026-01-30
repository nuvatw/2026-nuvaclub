/**
 * Sprint Phase Utility
 *
 * Determines the current phase of a sprint based on its status and dates.
 *
 * Sprint Timeline:
 * - 45 days for project submissions/uploads
 * - 15 days for voting period
 * - Total: 60 days per sprint
 */

// Update import to use local feature types which match the BFF response (strings)
import type { Sprint } from '../types';

// Helper to ensure we have a Date object
const toDate = (d: string | Date | undefined): Date => {
  if (!d) return new Date();
  return typeof d === 'string' ? new Date(d) : d;
};

export type SprintPhase = 'submissions' | 'voting' | 'ended';

export interface SprintPhaseInfo {
  phase: SprintPhase;
  label: string;
  badgeVariant: 'success' | 'warning' | 'error' | 'default';
  description?: string;
  isVotingPeriod: boolean;
  votingStartDate?: Date;
  votingEndDate?: Date;
  daysRemaining?: number;
}

// Sprint timeline constants
const SUBMISSION_DAYS = 45;
const VOTING_DAYS = 15;

/**
 * Calculate voting dates from sprint start date
 * Voting period starts 45 days after sprint start and lasts 15 days
 */
export function calculateVotingDates(sprintStartDate: string | Date): {
  votingStartDate: Date;
  votingEndDate: Date;
} {
  const votingStartDate = new Date(sprintStartDate);
  votingStartDate.setDate(votingStartDate.getDate() + SUBMISSION_DAYS);

  const votingEndDate = new Date(votingStartDate);
  votingEndDate.setDate(votingEndDate.getDate() + VOTING_DAYS);

  return { votingStartDate, votingEndDate };
}

/**
 * Check if sprint is currently in voting period
 */
export function isInVotingPeriod(sprint: Sprint, now: Date = new Date()): boolean {
  // If sprint has explicit votingStartDate, use it
  if (sprint.votingStartDate) {
    const votingStart = toDate(sprint.votingStartDate);
    const votingEndDate = new Date(votingStart);
    votingEndDate.setDate(votingEndDate.getDate() + VOTING_DAYS);
    return now >= votingStart && now <= votingEndDate;
  }

  // Otherwise calculate from sprint start date using 45+15 rule
  const { votingStartDate, votingEndDate } = calculateVotingDates(sprint.startDate);
  return now >= votingStartDate && now <= votingEndDate;
}

/**
 * Check if sprint is in submission period
 */
export function isInSubmissionPeriod(sprint: Sprint, now: Date = new Date()): boolean {
  if (now < toDate(sprint.startDate)) return false;

  // If sprint has explicit votingStartDate, submissions are open until then
  if (sprint.votingStartDate) {
    return now < toDate(sprint.votingStartDate);
  }

  // Otherwise calculate from sprint start date
  const { votingStartDate } = calculateVotingDates(sprint.startDate);
  return now < votingStartDate;
}

/**
 * Get the current phase of a sprint
 *
 * @param sprint - The sprint to check
 * @param now - Optional current date for testing
 * @returns The phase info including label and badge variant
 */
export function getSprintPhase(sprint: Sprint, now: Date = new Date()): SprintPhaseInfo {
  // Calculate voting dates
  const { votingStartDate, votingEndDate } = sprint.votingStartDate
    ? {
      votingStartDate: toDate(sprint.votingStartDate),
      votingEndDate: new Date(
        toDate(sprint.votingStartDate).getTime() + VOTING_DAYS * 24 * 60 * 60 * 1000
      ),
    }
    : calculateVotingDates(sprint.startDate);

  // Check if sprint has ended (past voting end date or explicit end date)
  const sprintEndDate = toDate(sprint.endDate);
  const sprintEnded = now > votingEndDate || now > sprintEndDate;

  if (sprintEnded) {
    return {
      phase: 'ended',
      label: 'Ended',
      badgeVariant: 'default',
      description: 'This sprint has concluded',
      isVotingPeriod: false,
      votingStartDate,
      votingEndDate,
    };
  }

  // Check if we're in voting period
  const inVotingPeriod = now >= votingStartDate && now <= votingEndDate;
  const isVotingOpen = 'isVotingOpen' in sprint ? (sprint as any).isVotingOpen : false;

  if (inVotingPeriod || isVotingOpen) {
    const daysRemaining = Math.ceil(
      (votingEndDate.getTime() - now.getTime()) / (24 * 60 * 60 * 1000)
    );

    return {
      phase: 'voting',
      label: 'Voting Open',
      badgeVariant: 'warning',
      description: 'Vote for your favorite projects',
      isVotingPeriod: true,
      votingStartDate,
      votingEndDate,
      daysRemaining,
    };
  }

  // Default: submissions phase
  const daysUntilVoting = Math.ceil(
    (votingStartDate.getTime() - now.getTime()) / (24 * 60 * 60 * 1000)
  );

  return {
    phase: 'submissions',
    label: 'Submissions Open',
    badgeVariant: 'success',
    description: 'Submit your project now',
    isVotingPeriod: false,
    votingStartDate,
    votingEndDate,
    daysRemaining: daysUntilVoting,
  };
}

/**
 * Get a short status label for the sprint
 */
export function getSprintStatusLabel(sprint: Sprint): string {
  return getSprintPhase(sprint).label;
}

/**
 * Get the badge variant for the sprint phase
 */
export function getSprintBadgeVariant(sprint: Sprint): 'success' | 'warning' | 'error' | 'default' {
  return getSprintPhase(sprint).badgeVariant;
}
