'use client';

import { useState, useMemo, useCallback, useEffect } from 'react';
import { Modal, ModalActions } from '@/components/atoms/Modal';
import { Button } from '@/components/atoms/Button';
import { cn } from '@/lib/utils';
import type { DuoTier } from '@/features/duo/types';
import { DUO_TIER_CONFIG, DUO_TIER_RANK, calculateUpgradePrice } from '@/features/duo/types';
import { getCurrentMonth } from '@/features/duo/utils/month-utils';
import {
  CheckIcon,
  TrendingUpIcon,
  LockIcon,
  InformationCircleIcon,
} from '@/components/icons';

// ============================================================================
// TYPES
// ============================================================================

export interface MonthEntitlement {
  month: string; // YYYY-MM
  tier: DuoTier;
  status: 'active' | 'expired' | 'upgraded' | 'refunded';
}

interface DuoMonthSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  entitlements: MonthEntitlement[];
  onPurchase: (months: string[], tier: DuoTier, pricing: PurchasePricing) => Promise<void>;
  onRefreshEntitlements?: () => void;
}

export interface PurchasePricing {
  newPurchases: string[];
  upgrades: Array<{ month: string; fromTier: DuoTier }>;
  newPurchaseTotal: number;
  upgradeTotal: number;
  totalPrice: number;
}

// ============================================================================
// CONSTANTS
// ============================================================================

const TIERS: DuoTier[] = ['go', 'run', 'fly'];

const TIER_COLORS: Record<DuoTier, {
  bg: string;
  bgLight: string;
  text: string;
  border: string;
  ring: string;
  hoverBorder: string;
}> = {
  go: {
    bg: 'bg-green-500',
    bgLight: 'bg-green-500/15',
    text: 'text-green-400',
    border: 'border-green-500/50',
    ring: 'ring-green-500/50',
    hoverBorder: 'hover:border-green-500/70',
  },
  run: {
    bg: 'bg-amber-500',
    bgLight: 'bg-amber-500/15',
    text: 'text-amber-400',
    border: 'border-amber-500/50',
    ring: 'ring-amber-500/50',
    hoverBorder: 'hover:border-amber-500/70',
  },
  fly: {
    bg: 'bg-red-500',
    bgLight: 'bg-red-500/15',
    text: 'text-red-400',
    border: 'border-red-500/50',
    ring: 'ring-red-500/50',
    hoverBorder: 'hover:border-red-500/70',
  },
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function getMonthsForYear(year: number): string[] {
  return Array.from({ length: 12 }, (_, i) => {
    const month = String(i + 1).padStart(2, '0');
    return `${year}-${month}`;
  });
}

function getMonthLabel(month: string): string {
  const [, monthNum] = month.split('-').map(Number);
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return monthNames[monthNum - 1];
}

function formatPrice(price: number): string {
  return `NT$${price.toLocaleString()}`;
}

function isMonthPurchasable(month: string): boolean {
  const currentMonth = getCurrentMonth();
  return month > currentMonth;
}

// ============================================================================
// TIER EXPLANATION COMPONENT
// ============================================================================

function TierExplanation() {
  return (
    <div className="flex items-start gap-2 p-3 bg-neutral-800/40 rounded-lg text-sm">
      <InformationCircleIcon size="md" className="text-primary-400 flex-shrink-0 mt-0.5" />
      <div className="space-y-1.5">
        <p className="text-neutral-300">
          <span className="text-green-400 font-medium">Go</span>: Match with <span className="text-green-300">Nunu</span> mentors in Space
        </p>
        <p className="text-neutral-300">
          <span className="text-amber-400 font-medium">Run</span>: Match with <span className="text-amber-300">Nunu + Certified Nunu</span> mentors in Space
        </p>
        <p className="text-neutral-300">
          <span className="text-red-400 font-medium">Fly</span>: Match with <span className="text-red-300">All tiers + Shangzhe (Founders)</span> + unlimited slots
        </p>
      </div>
    </div>
  );
}

// ============================================================================
// MONTH CHIP COMPONENT
// ============================================================================

type MonthChipState =
  | 'available'
  | 'selected'
  | 'selected-upgrade'
  | 'owned-go'
  | 'owned-run'
  | 'owned-fly'
  | 'upgraded'
  | 'refunded'
  | 'disabled-past'
  | 'disabled-current'
  | 'disabled-downgrade';

interface MonthChipProps {
  month: string;
  state: MonthChipState;
  selectedTier: DuoTier;
  onClick: () => void;
  disabled: boolean;
  disabledReason?: string;
}

function MonthChip({ month, state, selectedTier, onClick, disabled, disabledReason }: MonthChipProps) {
  const colors = TIER_COLORS[selectedTier];
  const label = getMonthLabel(month);

  const getStateStyles = () => {
    switch (state) {
      case 'selected':
        return cn(
          colors.bgLight,
          colors.text,
          'ring-2',
          colors.ring,
        );
      case 'selected-upgrade':
        return cn(
          'bg-gradient-to-br from-green-500/20 via-amber-500/20 to-red-500/20',
          colors.text,
          'ring-2',
          colors.ring,
        );
      case 'owned-go':
        return cn(
          'bg-green-500/15',
          'text-green-400',
          'border-green-500/40',
        );
      case 'owned-run':
        return cn(
          'bg-amber-500/15',
          'text-amber-400',
          'border-amber-500/40',
        );
      case 'owned-fly':
        return cn(
          'bg-red-500/15',
          'text-red-400',
          'border-red-500/40',
        );
      case 'upgraded':
        return cn(
          'bg-gradient-to-br from-green-500/10 to-amber-500/10',
          'text-amber-400/70',
          'border-amber-500/30',
        );
      case 'refunded':
        return cn(
          'bg-neutral-800/40',
          'text-neutral-500',
          'border-neutral-600/30',
          'line-through decoration-neutral-500/50',
        );
      case 'disabled-past':
      case 'disabled-current':
        return cn(
          'bg-neutral-800/20',
          'text-neutral-600',
          'border-neutral-700/40',
          'cursor-not-allowed',
        );
      case 'disabled-downgrade':
        return cn(
          'bg-amber-500/10',
          'text-amber-400/50',
          'border-amber-500/20',
          'cursor-not-allowed',
        );
      case 'available':
      default:
        return cn(
          'bg-neutral-800/50',
          'text-neutral-300',
          'border-neutral-700',
          colors.hoverBorder,
          'hover:text-white',
        );
    }
  };

  const getStatusBadge = (): { text: string; className: string } | null => {
    switch (state) {
      case 'owned-go':
        return { text: 'Go', className: 'text-green-400' };
      case 'owned-run':
        return { text: 'Run', className: 'text-amber-400' };
      case 'owned-fly':
      case 'disabled-downgrade':
        return { text: 'Fly', className: 'text-red-400' };
      case 'upgraded':
        return { text: 'Upgraded', className: 'text-amber-400/70' };
      case 'refunded':
        return { text: 'Refunded', className: 'text-neutral-500' };
      case 'disabled-past':
        return { text: 'Past', className: 'text-neutral-600' };
      case 'disabled-current':
        return { text: 'Current', className: 'text-neutral-500' };
      default:
        return null;
    }
  };

  const isSelected = state === 'selected' || state === 'selected-upgrade';
  const badge = getStatusBadge();

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={disabledReason}
      aria-label={`${label} - ${disabledReason || state}`}
      className={cn(
        'relative flex flex-col items-center justify-center',
        'w-full aspect-square rounded-lg',
        'border transition-all duration-150',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-900',
        getStateStyles(),
      )}
    >
      {/* Month label */}
      <span className="text-sm font-medium">{label}</span>

      {/* Status badge */}
      {badge && (
        <span className={cn('text-[10px] font-semibold uppercase tracking-wide mt-0.5', badge.className)}>
          {badge.text}
        </span>
      )}

      {/* Selection indicator */}
      {isSelected && (
        <span className={cn(
          'absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full flex items-center justify-center',
          state === 'selected-upgrade' ? 'bg-amber-500' : colors.bg,
        )}>
          {state === 'selected-upgrade' ? (
            <TrendingUpIcon size="sm" className="w-3 h-3 text-white" />
          ) : (
            <CheckIcon size="sm" className="w-3 h-3 text-white" />
          )}
        </span>
      )}

      {/* Lock icon for disabled states */}
      {(state === 'disabled-past' || state === 'disabled-current' || state === 'disabled-downgrade') && (
        <LockIcon size="sm" className="absolute bottom-1 right-1 w-3 h-3 text-neutral-600" />
      )}
    </button>
  );
}

// ============================================================================
// TIER TOGGLE COMPONENT
// ============================================================================

interface TierToggleProps {
  selectedTier: DuoTier;
  onSelectTier: (tier: DuoTier) => void;
}

function TierToggle({ selectedTier, onSelectTier }: TierToggleProps) {
  return (
    <div className="flex gap-2 p-1 bg-neutral-800/50 rounded-lg">
      {TIERS.map((tier) => {
        const config = DUO_TIER_CONFIG[tier];
        const colors = TIER_COLORS[tier];
        const isSelected = selectedTier === tier;

        return (
          <button
            key={tier}
            onClick={() => onSelectTier(tier)}
            className={cn(
              'flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-md',
              'transition-all duration-150',
              'focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-900',
              isSelected
                ? cn(colors.bg, 'text-white shadow-lg')
                : 'text-neutral-400 hover:text-white hover:bg-neutral-700/50',
            )}
            aria-pressed={isSelected}
          >
            <span className={cn(
              'w-2.5 h-2.5 rounded-full',
              isSelected ? 'bg-white/30' : colors.bg,
            )} />
            <div className="text-left">
              <div className="text-sm font-semibold">{config.name}</div>
              <div className={cn(
                'text-xs',
                isSelected ? 'text-white/70' : 'text-neutral-500',
              )}>
                {formatPrice(config.price)}/mo
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}

// ============================================================================
// YEAR TABS COMPONENT
// ============================================================================

interface YearTabsProps {
  currentYear: number;
  selectedYear: number;
  onSelectYear: (year: number) => void;
}

function YearTabs({ currentYear, selectedYear, onSelectYear }: YearTabsProps) {
  const years = [currentYear, currentYear + 1];

  return (
    <div className="flex gap-1 p-1 bg-neutral-800/30 rounded-lg">
      {years.map((year) => (
        <button
          key={year}
          onClick={() => onSelectYear(year)}
          className={cn(
            'flex-1 px-4 py-1.5 rounded-md text-sm font-medium transition-all',
            'focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-900',
            selectedYear === year
              ? 'bg-neutral-700 text-white'
              : 'text-neutral-400 hover:text-white hover:bg-neutral-700/50',
          )}
        >
          {year}
        </button>
      ))}
    </div>
  );
}

// ============================================================================
// PRICING SUMMARY COMPONENT
// ============================================================================

interface PricingSummaryProps {
  pricing: PurchasePricing;
  selectedTier: DuoTier;
}

function PricingSummary({ pricing, selectedTier }: PricingSummaryProps) {
  const tierConfig = DUO_TIER_CONFIG[selectedTier];
  const colors = TIER_COLORS[selectedTier];

  const hasNewPurchases = pricing.newPurchases.length > 0;
  const hasUpgrades = pricing.upgrades.length > 0;

  if (!hasNewPurchases && !hasUpgrades) {
    return (
      <div className="text-center py-4 text-neutral-500">
        Select months to see pricing
      </div>
    );
  }

  return (
    <div className="space-y-3 pt-4 border-t border-neutral-800">
      {/* New purchases */}
      {hasNewPurchases && (
        <div className="flex items-center justify-between text-sm">
          <div className="text-neutral-400">
            <span className={colors.text}>{pricing.newPurchases.length}</span>
            {' '}new {pricing.newPurchases.length === 1 ? 'month' : 'months'} × {formatPrice(tierConfig.price)}
          </div>
          <div className="text-neutral-300 font-medium">
            {formatPrice(pricing.newPurchaseTotal)}
          </div>
        </div>
      )}

      {/* Upgrades */}
      {hasUpgrades && (
        <div className="flex items-center justify-between text-sm">
          <div className="text-neutral-400">
            <span className={colors.text}>{pricing.upgrades.length}</span>
            {' '}upgrade{pricing.upgrades.length === 1 ? '' : 's'} → {selectedTier.charAt(0).toUpperCase() + selectedTier.slice(1)}
          </div>
          <div className="text-neutral-300 font-medium">
            {formatPrice(pricing.upgradeTotal)}
          </div>
        </div>
      )}

      {/* Total */}
      <div className="flex items-center justify-between pt-2 border-t border-neutral-800">
        <div className="text-neutral-300 font-medium">Total</div>
        <div className={cn('text-xl font-bold', colors.text)}>
          {formatPrice(pricing.totalPrice)}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// CONFIRMATION DIALOG
// ============================================================================

interface ConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  pricing: PurchasePricing;
  tier: DuoTier;
  isProcessing: boolean;
}

function ConfirmationDialog({
  isOpen,
  onClose,
  onConfirm,
  pricing,
  tier,
  isProcessing,
}: ConfirmationDialogProps) {
  const colors = TIER_COLORS[tier];
  const totalMonths = pricing.newPurchases.length + pricing.upgrades.length;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Confirm Purchase"
      size="sm"
    >
      <div className="space-y-4">
        <p className="text-neutral-300">
          You are about to be charged:
        </p>

        <div className={cn('text-3xl font-bold text-center py-4', colors.text)}>
          {formatPrice(pricing.totalPrice)}
        </div>

        <div className="text-sm text-neutral-400 text-center">
          for <span className={colors.text}>{totalMonths}</span> month{totalMonths === 1 ? '' : 's'} of{' '}
          <span className={colors.text}>Duo {tier.toUpperCase()}</span>
          {pricing.upgrades.length > 0 && (
            <span className="text-amber-400">
              {' '}(including {pricing.upgrades.length} upgrade{pricing.upgrades.length === 1 ? '' : 's'})
            </span>
          )}
        </div>

        <div className="p-3 bg-neutral-800/50 rounded-lg text-xs text-neutral-400">
          <strong className="text-neutral-300">Note:</strong> If you don&apos;t match with a mentor before a purchased month begins, you will receive an automatic full refund for that month.
        </div>
      </div>

      <ModalActions>
        <Button variant="ghost" onClick={onClose} disabled={isProcessing}>
          Cancel
        </Button>
        <Button
          variant="primary"
          onClick={onConfirm}
          disabled={isProcessing}
          className={cn(colors.bg, 'hover:opacity-90')}
        >
          {isProcessing ? 'Processing...' : 'Confirm & Charge'}
        </Button>
      </ModalActions>
    </Modal>
  );
}

// ============================================================================
// MAIN MODAL COMPONENT
// ============================================================================

export function DuoMonthSelectorModal({
  isOpen,
  onClose,
  entitlements,
  onPurchase,
  onRefreshEntitlements,
}: DuoMonthSelectorModalProps) {
  // Current year for dynamic tabs
  const currentYear = new Date().getFullYear();
  const currentMonth = getCurrentMonth();

  // State
  const [selectedTier, setSelectedTier] = useState<DuoTier>('go');
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [selectedMonths, setSelectedMonths] = useState<Set<string>>(new Set());
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Build entitlement map for quick lookup
  const entitlementMap = useMemo(() => {
    const map = new Map<string, MonthEntitlement>();
    for (const ent of entitlements) {
      // Store all statuses for display
      const existing = map.get(ent.month);
      // Prefer active over other statuses
      if (!existing || ent.status === 'active') {
        map.set(ent.month, ent);
      }
    }
    return map;
  }, [entitlements]);

  // Get months for selected year
  const monthsForYear = useMemo(() => getMonthsForYear(selectedYear), [selectedYear]);

  // Determine state for each month
  const getMonthState = useCallback((month: string): { state: MonthChipState; disabled: boolean; reason?: string } => {
    const entitlement = entitlementMap.get(month);
    const isSelected = selectedMonths.has(month);
    const isPurchasable = isMonthPurchasable(month);

    // Check if past or current month
    if (month < currentMonth) {
      return { state: 'disabled-past', disabled: true, reason: 'Cannot purchase past months' };
    }
    if (month === currentMonth) {
      return { state: 'disabled-current', disabled: true, reason: 'Cannot purchase current month' };
    }

    if (entitlement) {
      // Handle refunded status
      if (entitlement.status === 'refunded') {
        return { state: 'refunded', disabled: true, reason: 'Refunded' };
      }

      // Handle upgraded status
      if (entitlement.status === 'upgraded') {
        return { state: 'upgraded', disabled: true, reason: 'Already upgraded' };
      }

      const existingRank = DUO_TIER_RANK[entitlement.tier];
      const selectedRank = DUO_TIER_RANK[selectedTier];

      // Helper to get the owned state for any tier
      const getOwnedState = (tier: DuoTier): MonthChipState => {
        if (tier === 'go') return 'owned-go';
        if (tier === 'run') return 'owned-run';
        return 'owned-fly';
      };

      // Check for downgrade attempt (e.g., Fly → Run/Go or Run → Go)
      // Show the owned tier state but disabled
      if (selectedRank < existingRank) {
        return {
          state: getOwnedState(entitlement.tier),
          disabled: true,
          reason: `Cannot downgrade from ${entitlement.tier.toUpperCase()} to ${selectedTier.toUpperCase()}`,
        };
      }

      // Same tier already owned
      if (selectedRank === existingRank) {
        return {
          state: getOwnedState(entitlement.tier),
          disabled: true,
          reason: `Already have ${entitlement.tier.toUpperCase()} for this month`,
        };
      }

      // Can upgrade (selectedTier is higher)
      if (isSelected) {
        return { state: 'selected-upgrade', disabled: false };
      }
      return {
        state: getOwnedState(entitlement.tier),
        disabled: false,
        reason: `Click to upgrade to ${selectedTier.toUpperCase()}`,
      };
    }

    // No existing entitlement
    if (isSelected) {
      return { state: 'selected', disabled: false };
    }
    return { state: 'available', disabled: false };
  }, [entitlementMap, selectedMonths, selectedTier, currentMonth]);

  // Handle month toggle
  const toggleMonth = useCallback((month: string) => {
    const { disabled } = getMonthState(month);
    if (disabled) return;

    setSelectedMonths((prev) => {
      const next = new Set(prev);
      if (next.has(month)) {
        next.delete(month);
      } else {
        next.add(month);
      }
      return next;
    });
  }, [getMonthState]);

  // Handle tier change - clear incompatible selections
  const handleTierChange = useCallback((tier: DuoTier) => {
    setSelectedTier(tier);
    // Clear selections that would become invalid with new tier
    setSelectedMonths((prev) => {
      const next = new Set<string>();
      for (const month of prev) {
        const ent = entitlementMap.get(month);
        if (ent) {
          // Keep selection only if it's a valid upgrade
          const existingRank = DUO_TIER_RANK[ent.tier];
          const newRank = DUO_TIER_RANK[tier];
          if (newRank > existingRank) {
            next.add(month);
          }
        } else {
          // No entitlement - check if purchasable
          if (isMonthPurchasable(month)) {
            next.add(month);
          }
        }
      }
      return next;
    });
  }, [entitlementMap]);

  // Compute pricing
  const pricing = useMemo((): PurchasePricing => {
    const tierConfig = DUO_TIER_CONFIG[selectedTier];
    const newPurchases: string[] = [];
    const upgrades: Array<{ month: string; fromTier: DuoTier }> = [];

    for (const month of selectedMonths) {
      // Only include purchasable months
      if (!isMonthPurchasable(month)) continue;

      const ent = entitlementMap.get(month);
      if (ent && ent.status === 'active') {
        upgrades.push({ month, fromTier: ent.tier });
      } else {
        newPurchases.push(month);
      }
    }

    const newPurchaseTotal = newPurchases.length * tierConfig.price;
    const upgradeTotal = upgrades.reduce((sum, u) => sum + calculateUpgradePrice(u.fromTier, selectedTier), 0);

    return {
      newPurchases,
      upgrades,
      newPurchaseTotal,
      upgradeTotal,
      totalPrice: newPurchaseTotal + upgradeTotal,
    };
  }, [selectedMonths, selectedTier, entitlementMap]);

  // Handle purchase button click
  const handlePurchaseClick = useCallback(() => {
    if (selectedMonths.size === 0) return;
    setShowConfirmation(true);
  }, [selectedMonths.size]);

  // Handle confirmed purchase
  const handleConfirmedPurchase = useCallback(async () => {
    setIsProcessing(true);
    try {
      const monthsArray = Array.from(selectedMonths).sort();
      await onPurchase(monthsArray, selectedTier, pricing);
      setShowConfirmation(false);
      setSelectedMonths(new Set());
      // Don't close the modal - show updated state
    } catch (error) {
      console.error('Purchase failed:', error);
    } finally {
      setIsProcessing(false);
    }
  }, [selectedMonths, selectedTier, pricing, onPurchase]);

  // Handle close - reset state
  const handleClose = useCallback(() => {
    setSelectedMonths(new Set());
    setSelectedTier('go');
    setSelectedYear(currentYear);
    setShowConfirmation(false);
    onClose();
  }, [onClose, currentYear]);

  // Select all available months for current year
  const selectAllAvailable = useCallback(() => {
    const available = monthsForYear.filter((month) => {
      const { disabled } = getMonthState(month);
      return !disabled && isMonthPurchasable(month);
    });
    setSelectedMonths(new Set(available));
  }, [monthsForYear, getMonthState]);

  // Clear all selections
  const clearAll = useCallback(() => {
    setSelectedMonths(new Set());
  }, []);

  // Refresh entitlements when modal opens
  useEffect(() => {
    if (isOpen && onRefreshEntitlements) {
      onRefreshEntitlements();
    }
  }, [isOpen, onRefreshEntitlements]);

  const colors = TIER_COLORS[selectedTier];

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={handleClose}
        title="Purchase Duo Pass"
        description="Select months and tier for your Duo mentorship access"
        size="lg"
      >
        <div className="space-y-5">
          {/* Tier Toggle */}
          <div>
            <label className="block text-sm font-medium text-neutral-400 mb-2">
              Select Tier
            </label>
            <TierToggle selectedTier={selectedTier} onSelectTier={handleTierChange} />
          </div>

          {/* Tier Explanation */}
          <TierExplanation />

          {/* Year Tabs */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-neutral-400">
                Select Months <span className="text-neutral-500">(starting next month)</span>
              </label>
              <YearTabs
                currentYear={currentYear}
                selectedYear={selectedYear}
                onSelectYear={setSelectedYear}
              />
            </div>

            {/* Quick actions */}
            <div className="flex justify-end gap-2 mb-3">
              <button
                onClick={selectAllAvailable}
                className="text-xs text-neutral-400 hover:text-white transition-colors"
              >
                Select all available
              </button>
              <span className="text-neutral-600">|</span>
              <button
                onClick={clearAll}
                className="text-xs text-neutral-400 hover:text-white transition-colors"
              >
                Clear
              </button>
            </div>

            {/* Month Grid - Unified view showing owned + selection states */}
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
              {monthsForYear.map((month) => {
                const { state, disabled, reason } = getMonthState(month);
                return (
                  <MonthChip
                    key={month}
                    month={month}
                    state={state}
                    selectedTier={selectedTier}
                    onClick={() => toggleMonth(month)}
                    disabled={disabled}
                    disabledReason={reason}
                  />
                );
              })}
            </div>
          </div>

          {/* Selection Summary */}
          <div className="text-sm text-neutral-400">
            {selectedMonths.size === 0 ? (
              'No months selected'
            ) : (
              <>
                <span className={colors.text}>{selectedMonths.size}</span>
                {' '}{selectedMonths.size === 1 ? 'month' : 'months'} selected
                {pricing.upgrades.length > 0 && (
                  <span className="text-amber-400 ml-2">
                    ({pricing.upgrades.length} upgrade{pricing.upgrades.length === 1 ? '' : 's'})
                  </span>
                )}
              </>
            )}
          </div>

          {/* Pricing Summary */}
          <PricingSummary pricing={pricing} selectedTier={selectedTier} />
        </div>

        <ModalActions>
          <Button variant="ghost" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handlePurchaseClick}
            disabled={selectedMonths.size === 0 || pricing.totalPrice === 0}
            className={cn(colors.bg, 'hover:opacity-90', 'disabled:opacity-50')}
          >
            Purchase
          </Button>
        </ModalActions>
      </Modal>

      {/* Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={showConfirmation}
        onClose={() => setShowConfirmation(false)}
        onConfirm={handleConfirmedPurchase}
        pricing={pricing}
        tier={selectedTier}
        isProcessing={isProcessing}
      />
    </>
  );
}
