'use client';

import { useState, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { useDuoMonthPasses } from '../hooks/useDuoMonthPasses';
import type { DuoTier } from '../types';
import { DUO_TIER_CONFIG } from '../types';
import {
  formatMonthLong,
  formatMonthCompact,
} from '../utils/month-utils';

interface NunuInfo {
  id: string;
  name: string;
  avatar?: string;
  type: 'nunu' | 'certified-nunu' | 'shangzhe';
  expertise?: string[];
}

interface InviteModalProps {
  nunu: NunuInfo;
  onConfirm: (month: string, message?: string) => void;
  onCancel: () => void;
}

export function InviteModal({ nunu, onConfirm, onCancel }: InviteModalProps) {
  const { getMonthsForCompanionType, getPassForMonth, activePasses } = useDuoMonthPasses();
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);
  const [message, setMessage] = useState('');

  // Get months where user can invite this type of nunu
  const availableMonths = useMemo(() => {
    return getMonthsForCompanionType(nunu.type);
  }, [nunu.type, getMonthsForCompanionType]);

  // Get required tier for this nunu type
  const requiredTier = useMemo((): DuoTier => {
    if (nunu.type === 'shangzhe') return 'fly';
    if (nunu.type === 'certified-nunu') return 'run';
    return 'go';
  }, [nunu.type]);

  const requiredConfig = DUO_TIER_CONFIG[requiredTier];

  // Check if user has any active passes
  const hasAnyPasses = activePasses.length > 0;

  // Check if user has passes but none for this nunu type
  const hasPassesButWrongTier =
    hasAnyPasses && availableMonths.length === 0;

  const handleConfirm = () => {
    if (!selectedMonth) return;
    onConfirm(selectedMonth, message.trim() || undefined);
  };

  // No passes at all
  if (!hasAnyPasses) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <div className="w-full max-w-md bg-neutral-900 rounded-xl border border-neutral-800 overflow-hidden">
          <div className="p-6">
            <div className="text-center mb-6">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-neutral-800 flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-neutral-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">
                No Active Passes
              </h3>
              <p className="text-neutral-400 text-sm">
                You need a Duo pass to invite Nunus. Purchase a pass to get started.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={onCancel}
                className="flex-1 px-4 py-2.5 rounded-lg bg-neutral-800 text-white font-medium hover:bg-neutral-700 transition-colors"
              >
                Cancel
              </button>
              <a
                href="/shop?category=duo"
                className="flex-1 px-4 py-2.5 rounded-lg bg-primary-500 text-white font-medium hover:bg-primary-600 transition-colors text-center"
              >
                Buy Pass
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Has passes but wrong tier for this nunu
  if (hasPassesButWrongTier) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <div className="w-full max-w-md bg-neutral-900 rounded-xl border border-neutral-800 overflow-hidden">
          <div className="p-6">
            <div className="text-center mb-6">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full overflow-hidden">
                {nunu.avatar ? (
                  <img
                    src={nunu.avatar}
                    alt={nunu.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-purple-500 to-amber-500 flex items-center justify-center text-white text-2xl font-bold">
                    {nunu.name.charAt(0)}
                  </div>
                )}
              </div>
              <h3 className="text-lg font-bold text-white mb-1">{nunu.name}</h3>
              <span
                className={cn(
                  'inline-block px-2 py-0.5 rounded text-xs font-medium',
                  requiredConfig.bgColor,
                  requiredConfig.color
                )}
              >
                {nunu.type === 'nunu'
                  ? 'Regular Nunu'
                  : nunu.type === 'certified-nunu'
                    ? 'Certified Nunu'
                    : 'Shangzhe'}
              </span>
            </div>

            <div
              className={cn(
                'p-4 rounded-lg border mb-6',
                'bg-amber-500/10 border-amber-500/30'
              )}
            >
              <div className="flex items-start gap-3">
                <svg
                  className="w-5 h-5 text-amber-400 mt-0.5 shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
                <div>
                  <p className="text-white font-medium mb-1">Tier Upgrade Needed</p>
                  <p className="text-sm text-neutral-400">
                    {nunu.name} requires {requiredConfig.name} or higher.
                    Your current passes don't have the required tier for any available months.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={onCancel}
                className="flex-1 px-4 py-2.5 rounded-lg bg-neutral-800 text-white font-medium hover:bg-neutral-700 transition-colors"
              >
                Cancel
              </button>
              <a
                href="/shop?category=duo"
                className="flex-1 px-4 py-2.5 rounded-lg bg-primary-500 text-white font-medium hover:bg-primary-600 transition-colors text-center"
              >
                Upgrade Pass
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Has available months - show selection
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-lg bg-neutral-900 rounded-xl border border-neutral-800 overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-neutral-800">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full overflow-hidden shrink-0">
              {nunu.avatar ? (
                <img
                  src={nunu.avatar}
                  alt={nunu.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-purple-500 to-amber-500 flex items-center justify-center text-white text-xl font-bold">
                  {nunu.name.charAt(0)}
                </div>
              )}
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Invite {nunu.name}</h3>
              <div className="flex items-center gap-2 mt-1">
                <span
                  className={cn(
                    'px-2 py-0.5 rounded text-xs font-medium',
                    requiredConfig.bgColor,
                    requiredConfig.color
                  )}
                >
                  {nunu.type === 'nunu'
                    ? 'Regular Nunu'
                    : nunu.type === 'certified-nunu'
                      ? 'Certified Nunu'
                      : 'Shangzhe'}
                </span>
                {nunu.expertise && nunu.expertise.length > 0 && (
                  <span className="text-xs text-neutral-400">
                    {nunu.expertise.slice(0, 2).join(' • ')}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Month Selection */}
        <div className="p-6">
          <h4 className="text-sm font-medium text-neutral-400 mb-3">
            Select Month for Mentorship
          </h4>
          <p className="text-xs text-neutral-500 mb-4">
            Choose which month you want to start this mentorship
          </p>

          <div className="space-y-2 max-h-48 overflow-y-auto">
            {availableMonths.map((month) => {
              const pass = getPassForMonth(month);
              if (!pass) return null;

              const tierConfig = DUO_TIER_CONFIG[pass.tier];
              const slotsAvailable = pass.maxCompanions - pass.currentCompanions;
              const isSelected = selectedMonth === month;

              return (
                <button
                  key={month}
                  onClick={() => setSelectedMonth(month)}
                  className={cn(
                    'w-full p-3 rounded-lg border-2 text-left transition-all',
                    isSelected
                      ? `${tierConfig.bgColor} ${tierConfig.borderColor}`
                      : 'bg-neutral-800 border-neutral-700 hover:border-neutral-600'
                  )}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-medium text-white">
                        {formatMonthLong(month)}
                      </span>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span
                          className={cn(
                            'text-xs font-medium uppercase',
                            tierConfig.color
                          )}
                        >
                          {tierConfig.name}
                        </span>
                        <span className="text-xs text-neutral-400">
                          {slotsAvailable >= 999
                            ? 'Unlimited slots'
                            : `${slotsAvailable} slot${slotsAvailable !== 1 ? 's' : ''} available`}
                        </span>
                      </div>
                    </div>
                    {isSelected && (
                      <div
                        className={cn(
                          'w-5 h-5 rounded-full flex items-center justify-center',
                          tierConfig.bgColor
                        )}
                      >
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
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Message */}
        <div className="px-6 pb-6">
          <label className="block text-sm font-medium text-neutral-400 mb-2">
            Message (optional)
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={`Hi ${nunu.name}! I'd love to learn from you...`}
            className="w-full px-3 py-2 rounded-lg bg-neutral-800 border border-neutral-700 text-white placeholder-neutral-500 focus:outline-none focus:border-primary-500 resize-none"
            rows={3}
          />
        </div>

        {/* Actions */}
        <div className="p-6 border-t border-neutral-800 bg-neutral-800/30">
          <div className="flex gap-3">
            <button
              onClick={onCancel}
              className="flex-1 px-4 py-2.5 rounded-lg bg-neutral-800 text-white font-medium hover:bg-neutral-700 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={!selectedMonth}
              className={cn(
                'flex-1 px-4 py-2.5 rounded-lg font-medium transition-colors',
                selectedMonth
                  ? 'bg-primary-500 text-white hover:bg-primary-600'
                  : 'bg-neutral-700 text-neutral-500 cursor-not-allowed'
              )}
            >
              Send Invite
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default InviteModal;
