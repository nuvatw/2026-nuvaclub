'use client';

import { useState, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { useDuoMonthPasses } from '../hooks/useDuoMonthPasses';
import type { DuoTier } from '../types';
import { DUO_TIER_CONFIG, calculateUpgradePrice } from '../types';
import {
  getNextMonths,
  formatMonthCompact,
  formatMonthLong,
  groupMonthsByYear,
  getYearFromMonth,
} from '../utils/month-utils';

interface DuoMonthSelectorProps {
  tier: DuoTier;
  onConfirm: (months: string[]) => void;
  onCancel: () => void;
}

export function DuoMonthSelector({
  tier,
  onConfirm,
  onCancel,
}: DuoMonthSelectorProps) {
  const { getPassForMonth, checkDuplicatePurchase } = useDuoMonthPasses();
  const [selectedMonths, setSelectedMonths] = useState<string[]>([]);
  const [showUpgradeModal, setShowUpgradeModal] = useState<string | null>(null);

  const tierConfig = DUO_TIER_CONFIG[tier];
  const availableMonths = useMemo(() => getNextMonths(12), []);
  const monthsByYear = useMemo(
    () => groupMonthsByYear(availableMonths),
    [availableMonths]
  );

  // Check for conflicts
  const duplicateCheck = useMemo(() => {
    return checkDuplicatePurchase(selectedMonths, tier);
  }, [selectedMonths, tier, checkDuplicatePurchase]);

  // Calculate total price
  const totalPrice = useMemo(() => {
    let price = 0;
    for (const month of selectedMonths) {
      const existing = getPassForMonth(month);
      if (existing) {
        // Upgrade price
        price += calculateUpgradePrice(existing.tier, tier);
      } else {
        // Full price
        price += tierConfig.price;
      }
    }
    return price;
  }, [selectedMonths, tier, tierConfig.price, getPassForMonth]);

  const handleMonthClick = (month: string) => {
    const existing = getPassForMonth(month);

    if (existing) {
      // Check if can upgrade
      const currentConfig = DUO_TIER_CONFIG[existing.tier];
      if (tierConfig.price <= currentConfig.price) {
        // Can't downgrade or buy same tier
        return;
      }
      // Show upgrade prompt
      setShowUpgradeModal(month);
      return;
    }

    // Toggle selection
    setSelectedMonths((prev) =>
      prev.includes(month)
        ? prev.filter((m) => m !== month)
        : [...prev, month]
    );
  };

  const handleUpgradeConfirm = (month: string) => {
    setSelectedMonths((prev) =>
      prev.includes(month) ? prev : [...prev, month]
    );
    setShowUpgradeModal(null);
  };

  const handleConfirm = () => {
    if (selectedMonths.length === 0) return;
    onConfirm(selectedMonths);
  };

  const getMonthStatus = (month: string) => {
    const existing = getPassForMonth(month);
    const isSelected = selectedMonths.includes(month);

    if (existing) {
      const canUpgrade = tierConfig.price > DUO_TIER_CONFIG[existing.tier].price;
      return {
        owned: true,
        tier: existing.tier,
        canUpgrade,
        isSelected: isSelected && canUpgrade,
      };
    }

    return {
      owned: false,
      tier: null,
      canUpgrade: false,
      isSelected,
    };
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-lg bg-neutral-900 rounded-2xl border border-neutral-800 overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-neutral-800">
          <h2 className="text-xl font-bold text-white">
            Select Your {tierConfig.name} Months
          </h2>
          <p className="text-sm text-neutral-400 mt-1">
            Choose which months you want to purchase
          </p>
        </div>

        {/* Calendar Grid */}
        <div className="p-6 max-h-[400px] overflow-y-auto">
          {Object.entries(monthsByYear).map(([year, months]) => (
            <div key={year} className="mb-6 last:mb-0">
              <h3 className="text-sm font-medium text-neutral-400 mb-3">
                {year}
              </h3>
              <div className="grid grid-cols-6 gap-2">
                {months.map((month) => {
                  const status = getMonthStatus(month);
                  const monthNum = parseInt(month.split('-')[1], 10);

                  return (
                    <button
                      key={month}
                      onClick={() => handleMonthClick(month)}
                      disabled={status.owned && !status.canUpgrade}
                      className={cn(
                        'relative p-3 rounded-lg text-center transition-all',
                        'border-2',
                        status.isSelected
                          ? `${tierConfig.bgColor} ${tierConfig.borderColor} ${tierConfig.color}`
                          : status.owned
                            ? status.canUpgrade
                              ? 'bg-neutral-800/50 border-neutral-700 hover:border-neutral-600'
                              : 'bg-neutral-800/30 border-neutral-800 cursor-not-allowed opacity-60'
                            : 'bg-neutral-800 border-neutral-700 hover:border-neutral-600 text-white'
                      )}
                    >
                      <span className="block text-sm font-medium">
                        {formatMonthCompact(month)}
                      </span>
                      {status.owned && (
                        <span
                          className={cn(
                            'block text-[10px] mt-0.5 uppercase font-medium',
                            DUO_TIER_CONFIG[status.tier!].color
                          )}
                        >
                          {status.tier}
                        </span>
                      )}
                      {status.isSelected && (
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-white rounded-full flex items-center justify-center">
                          <svg
                            className={cn('w-3 h-3', tierConfig.color)}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="px-6 py-3 bg-neutral-800/50 border-t border-neutral-800">
          <div className="flex items-center gap-4 text-xs text-neutral-400">
            <div className="flex items-center gap-1.5">
              <div className={cn('w-3 h-3 rounded', tierConfig.bgColor)} />
              <span>Selected</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded bg-neutral-800 border border-neutral-700" />
              <span>Available</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded bg-neutral-800/30 opacity-60" />
              <span>Already Owned</span>
            </div>
          </div>
        </div>

        {/* Summary & Actions */}
        <div className="p-6 border-t border-neutral-800 bg-neutral-900">
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="text-neutral-400">Selected: </span>
              <span className="text-white font-medium">
                {selectedMonths.length} month{selectedMonths.length !== 1 ? 's' : ''}
              </span>
            </div>
            <div className="text-right">
              <span className="text-neutral-400">Total: </span>
              <span className="text-white font-bold text-lg">
                {totalPrice.toLocaleString()} TWD
              </span>
            </div>
          </div>

          {/* Selected months preview */}
          {selectedMonths.length > 0 && (
            <div className="mb-4 flex flex-wrap gap-2">
              {selectedMonths.sort().map((month) => {
                const existing = getPassForMonth(month);
                return (
                  <span
                    key={month}
                    className={cn(
                      'px-2 py-1 rounded text-xs font-medium',
                      tierConfig.bgColor,
                      tierConfig.color
                    )}
                  >
                    {formatMonthLong(month)}
                    {existing && (
                      <span className="ml-1 opacity-70">
                        (upgrade from {existing.tier})
                      </span>
                    )}
                  </span>
                );
              })}
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={onCancel}
              className="flex-1 px-4 py-3 rounded-lg bg-neutral-800 text-white font-medium hover:bg-neutral-700 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={selectedMonths.length === 0}
              className={cn(
                'flex-1 px-4 py-3 rounded-lg font-medium transition-colors',
                selectedMonths.length > 0
                  ? 'bg-primary-500 text-white hover:bg-primary-600'
                  : 'bg-neutral-800 text-neutral-500 cursor-not-allowed'
              )}
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>

      {/* Upgrade Modal */}
      {showUpgradeModal && (
        <UpgradeModal
          month={showUpgradeModal}
          currentTier={getPassForMonth(showUpgradeModal)!.tier}
          newTier={tier}
          onConfirm={() => handleUpgradeConfirm(showUpgradeModal)}
          onCancel={() => setShowUpgradeModal(null)}
        />
      )}
    </div>
  );
}

// Upgrade confirmation modal
function UpgradeModal({
  month,
  currentTier,
  newTier,
  onConfirm,
  onCancel,
}: {
  month: string;
  currentTier: DuoTier;
  newTier: DuoTier;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  const currentConfig = DUO_TIER_CONFIG[currentTier];
  const newConfig = DUO_TIER_CONFIG[newTier];
  const priceDiff = calculateUpgradePrice(currentTier, newTier);

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60">
      <div className="w-full max-w-md bg-neutral-900 rounded-xl border border-neutral-800 overflow-hidden">
        <div className="p-6">
          <h3 className="text-lg font-bold text-white mb-2">
            Upgrade {formatMonthLong(month)}
          </h3>
          <p className="text-neutral-400 text-sm mb-4">
            You already have {currentConfig.name} for this month.
            Would you like to upgrade to {newConfig.name}?
          </p>

          {/* Comparison */}
          <div className="flex items-center gap-4 mb-6">
            <div
              className={cn(
                'flex-1 p-3 rounded-lg border',
                currentConfig.bgColor,
                currentConfig.borderColor
              )}
            >
              <div className={cn('text-sm font-medium', currentConfig.color)}>
                Current
              </div>
              <div className="text-white font-bold">{currentConfig.name}</div>
            </div>
            <svg
              className="w-5 h-5 text-neutral-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
            <div
              className={cn(
                'flex-1 p-3 rounded-lg border',
                newConfig.bgColor,
                newConfig.borderColor
              )}
            >
              <div className={cn('text-sm font-medium', newConfig.color)}>
                Upgrade to
              </div>
              <div className="text-white font-bold">{newConfig.name}</div>
            </div>
          </div>

          {/* Price */}
          <div className="p-3 bg-neutral-800 rounded-lg mb-6">
            <div className="flex items-center justify-between">
              <span className="text-neutral-400">Upgrade price:</span>
              <span className="text-white font-bold">
                {priceDiff.toLocaleString()} TWD
              </span>
            </div>
            <div className="text-xs text-neutral-500 mt-1">
              ({newConfig.price.toLocaleString()} - {currentConfig.price.toLocaleString()} already paid)
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={onCancel}
              className="flex-1 px-4 py-2.5 rounded-lg bg-neutral-800 text-white font-medium hover:bg-neutral-700 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 px-4 py-2.5 rounded-lg bg-primary-500 text-white font-medium hover:bg-primary-600 transition-colors"
            >
              Add Upgrade
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DuoMonthSelector;
