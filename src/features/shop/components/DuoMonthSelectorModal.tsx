'use client';

import { useState, useMemo, useCallback, useEffect } from 'react';
import { Modal, ModalActions } from '@/components/atoms/Modal';
import { Button } from '@/components/atoms/Button';
import { cn } from '@/lib/utils';
import { DuoMonthOptionDTO, DuoPurchaseOptionsDTO, DuoTier, DUO_TIER_INFO } from '@/application/dtos/DuoPurchaseOptionsDTO';
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
  entitlements: MonthEntitlement[]; // Keep for legacy if needed, but we mainly use options
  onPurchase: (months: string[], tier: DuoTier, pricing: PurchasePricing) => Promise<void>;
  onRefreshEntitlements?: () => void;
  userId: string;
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

function getMonthLabel(month: string): string {
  const [, monthNum] = month.split('-').map(Number);
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return monthNames[monthNum - 1];
}

function formatPrice(price: number): string {
  return `NT$${price.toLocaleString()}`;
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
  option: DuoMonthOptionDTO;
  isSelected: boolean;
  selectedTier: DuoTier;
  onClick: () => void;
}

function MonthChip({ month, option, isSelected, selectedTier, onClick }: MonthChipProps) {
  const colors = TIER_COLORS[selectedTier];
  const label = getMonthLabel(month);

  const getInternalState = (): MonthChipState => {
    if (option.state === 'disabled') {
      if (option.reason?.includes('past')) return 'disabled-past';
      if (option.reason?.includes('current')) return 'disabled-current';
      if (option.reason?.includes('downgrade')) return 'disabled-downgrade';
      return 'disabled-past';
    }

    if (option.state === 'owned' && !isSelected) {
      if (option.currentTier === 'go') return 'owned-go';
      if (option.currentTier === 'run') return 'owned-run';
      if (option.currentTier === 'fly') return 'owned-fly';
    }

    if (option.state === 'upgrade' && !isSelected) {
      if (option.currentTier === 'go') return 'owned-go';
      if (option.currentTier === 'run') return 'owned-run';
      if (option.currentTier === 'fly') return 'owned-fly';
    }

    if (option.state === 'upgrade' && isSelected) return 'selected-upgrade';
    if (isSelected) return 'selected';

    return 'available';
  };

  const state = getInternalState();

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
      case 'disabled-past':
        return { text: 'Past', className: 'text-neutral-600' };
      case 'disabled-current':
        return { text: 'Current', className: 'text-neutral-500' };
      default:
        return null;
    }
  };

  const badge = getStatusBadge();
  const disabled = option.state === 'disabled' || (option.state === 'owned' && option.currentTier === selectedTier);

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={option.reason}
      className={cn(
        'relative flex flex-col items-center justify-center',
        'w-full aspect-square rounded-lg',
        'border transition-all duration-150',
        getStateStyles(),
      )}
    >
      <span className="text-sm font-medium">{label}</span>
      {badge && (
        <span className={cn('text-[10px] font-semibold uppercase tracking-wide mt-0.5', badge.className)}>
          {badge.text}
        </span>
      )}
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
      {option.state === 'disabled' && (
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
        const config = DUO_TIER_INFO[tier];
        const colors = TIER_COLORS[tier];
        const isSelected = selectedTier === tier;

        return (
          <button
            key={tier}
            onClick={() => onSelectTier(tier)}
            className={cn(
              'flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-md',
              'transition-all duration-150',
              isSelected
                ? cn(colors.bg, 'text-white shadow-lg')
                : 'text-neutral-400 hover:text-white hover:bg-neutral-700/50',
            )}
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
// MAIN MODAL COMPONENT
// ============================================================================

export function DuoMonthSelectorModal({
  isOpen,
  onClose,
  onPurchase,
  onRefreshEntitlements,
  userId,
}: DuoMonthSelectorModalProps) {
  const currentYear = new Date().getFullYear();

  // State
  const [selectedTier, setSelectedTier] = useState<DuoTier>('go');
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [selectedMonths, setSelectedMonths] = useState<Set<string>>(new Set());
  const [optionsDTO, setOptionsDTO] = useState<DuoPurchaseOptionsDTO | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Fetch Options from BFF
  useEffect(() => {
    if (!isOpen) return;

    const fetchOptions = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/bff/shop/duo/options?userId=${userId}&year=${selectedYear}&tier=${selectedTier}`);
        const data = await res.json();
        setOptionsDTO(data);
      } catch (err) {
        console.error('Failed to fetch duo options', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOptions();
  }, [isOpen, userId, selectedYear, selectedTier]);

  // Pricing computed from DTO
  const pricing = useMemo((): PurchasePricing => {
    if (!optionsDTO) return { newPurchases: [], upgrades: [], newPurchaseTotal: 0, upgradeTotal: 0, totalPrice: 0 };

    const newPurchases: string[] = [];
    const upgrades: Array<{ month: string; fromTier: DuoTier }> = [];
    let newPurchaseTotal = 0;
    let upgradeTotal = 0;

    selectedMonths.forEach(month => {
      const option = optionsDTO.options.find(o => o.month === month);
      if (!option) return;

      if (option.state === 'available') {
        newPurchases.push(month);
        newPurchaseTotal += option.price;
      } else if (option.state === 'upgrade') {
        upgrades.push({ month, fromTier: option.currentTier! });
        upgradeTotal += option.price;
      }
    });

    return {
      newPurchases,
      upgrades,
      newPurchaseTotal,
      upgradeTotal,
      totalPrice: newPurchaseTotal + upgradeTotal
    };
  }, [selectedMonths, optionsDTO]);

  const toggleMonth = useCallback((month: string) => {
    setSelectedMonths(prev => {
      const next = new Set(prev);
      if (next.has(month)) next.delete(month);
      else next.add(month);
      return next;
    });
  }, []);

  const handlePurchaseClick = () => {
    if (selectedMonths.size === 0) return;
    setShowConfirmation(true);
  };

  const handleConfirmedPurchase = async () => {
    setIsProcessing(true);
    try {
      await onPurchase(Array.from(selectedMonths), selectedTier, pricing);
      setSelectedMonths(new Set());
      setShowConfirmation(false);
      onRefreshEntitlements?.();
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  const colors = TIER_COLORS[selectedTier];

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} title="Purchase Duo Pass" size="lg">
        <div className="space-y-5">
          <TierToggle selectedTier={selectedTier} onSelectTier={setSelectedTier} />
          <TierExplanation />

          <div className="flex gap-2 p-1 bg-neutral-800/30 rounded-lg">
            {[currentYear, currentYear + 1].map(year => (
              <button
                key={year}
                onClick={() => setSelectedYear(year)}
                className={cn(
                  'flex-1 px-4 py-1.5 rounded-md text-sm font-medium transition-all',
                  selectedYear === year ? 'bg-neutral-700 text-white' : 'text-neutral-400 hover:text-white'
                )}
              >
                {year}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
            {optionsDTO?.options.map((option) => (
              <MonthChip
                key={option.month}
                month={option.month}
                option={option}
                isSelected={selectedMonths.has(option.month)}
                selectedTier={selectedTier}
                onClick={() => toggleMonth(option.month)}
              />
            ))}
            {isLoading && <div className="col-span-full text-center py-4 text-neutral-500">Loading options...</div>}
          </div>

          <div className="pt-4 border-t border-neutral-800 flex justify-between items-center">
            <div className="text-neutral-400">Total</div>
            <div className={cn('text-xl font-bold', colors.text)}>{formatPrice(pricing.totalPrice)}</div>
          </div>
        </div>

        <ModalActions>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button
            variant="primary"
            onClick={handlePurchaseClick}
            disabled={selectedMonths.size === 0 || isLoading}
            className={cn(colors.bg, 'hover:opacity-90')}
          >
            Purchase
          </Button>
        </ModalActions>
      </Modal>

      {/* Simplified Confirmation */}
      <Modal isOpen={showConfirmation} onClose={() => setShowConfirmation(false)} title="Confirm Order">
        <div className="py-4 text-center">
          <div className="text-3xl font-bold mb-2">{formatPrice(pricing.totalPrice)}</div>
          <div className="text-neutral-400">for {selectedMonths.size} months of {selectedTier.toUpperCase()}</div>
        </div>
        <ModalActions>
          <Button onClick={() => setShowConfirmation(false)}>Back</Button>
          <Button onClick={handleConfirmedPurchase} disabled={isProcessing}>
            {isProcessing ? 'Processing...' : 'Confirm'}
          </Button>
        </ModalActions>
      </Modal>
    </>
  );
}
