'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth, TEST_ACCOUNTS, type TestAccount } from './AuthProvider';
import { IDENTITY_LABELS, IDENTITY_COLORS } from '@/features/auth/types';
import {
  formatAccountSubtitle,
  getAccountDetails,
  validateAllTestAccounts,
} from '@/features/auth/utils';
import { cn } from '@/lib/utils';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Clean, minimal account row for the account list.
 * Shows: Name (left) + Identity pill (right) + Subtitle below
 */
function AccountRow({
  account,
  isSelected,
  onClick,
}: {
  account: TestAccount;
  isSelected: boolean;
  onClick: () => void;
}) {
  const identityLabel = IDENTITY_LABELS[account.identity];
  const identityColor = IDENTITY_COLORS[account.identity];
  const subtitle = formatAccountSubtitle(account);

  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full px-4 py-3 rounded-lg transition-all text-left',
        'border',
        isSelected
          ? 'border-primary-500 bg-primary-500/10'
          : 'border-transparent hover:bg-neutral-800/60'
      )}
    >
      <div className="flex items-center justify-between gap-3">
        {/* Name */}
        <span className="font-medium text-white truncate">{account.name}</span>

        {/* Identity pill - single, subtle badge */}
        <span
          className={cn(
            'px-2.5 py-0.5 rounded-full text-xs font-medium shrink-0',
            identityColor,
            'text-white/90'
          )}
        >
          {identityLabel}
        </span>
      </div>

      {/* Subtitle - derived from structured data */}
      <p className="mt-1 text-sm text-neutral-400 truncate">{subtitle}</p>
    </button>
  );
}

/**
 * Detail panel shown for the selected account.
 * Displays structured account information in a clean format.
 */
function AccountDetailPanel({ account }: { account: TestAccount }) {
  const details = getAccountDetails(account);
  const identityColor = IDENTITY_COLORS[account.identity];

  return (
    <div className="p-4 bg-neutral-800/50 rounded-lg border border-neutral-700/50">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4 pb-3 border-b border-neutral-700/50">
        <div
          className={cn('w-10 h-10 rounded-full flex items-center justify-center', identityColor)}
        >
          <span className="text-lg font-semibold text-white">
            {account.name.charAt(0).toUpperCase()}
          </span>
        </div>
        <div>
          <h3 className="font-semibold text-white">{account.name}</h3>
          <p className="text-sm text-neutral-400">{IDENTITY_LABELS[account.identity]}</p>
        </div>
      </div>

      {/* Details list */}
      <div className="space-y-2">
        {details.map((detail, idx) => (
          <div key={idx} className="flex justify-between text-sm">
            <span className="text-neutral-500">{detail.label}</span>
            <span className="text-neutral-300">{detail.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const { switchAccount, isLoading } = useAuth();
  const [selectedAccountId, setSelectedAccountId] = useState<string | null>(null);

  // Run validation on mount (dev only)
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      validateAllTestAccounts(TEST_ACCOUNTS, true);
    }
  }, []);

  // Filter out guest from selectable accounts for login
  const selectableAccounts = TEST_ACCOUNTS.filter((a) => a.identity !== 'guest');

  // Get selected account for detail panel
  const selectedAccount = selectableAccounts.find((a) => a.id === selectedAccountId);

  const handleLogin = () => {
    if (selectedAccountId) {
      switchAccount(selectedAccountId);
      onClose();
      setSelectedAccountId(null);
    }
  };

  const handleAccountClick = (accountId: string) => {
    setSelectedAccountId(accountId);
  };

  const handleClose = () => {
    onClose();
    setSelectedAccountId(null);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div
              className={cn(
                'w-full bg-neutral-900 rounded-2xl border border-neutral-700 shadow-2xl overflow-hidden',
                selectedAccount ? 'max-w-2xl' : 'max-w-md'
              )}
            >
              {/* Header */}
              <div className="px-6 py-4 border-b border-neutral-800">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-white">Login</h2>
                  <button
                    onClick={handleClose}
                    className="p-2 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
                <p className="mt-1 text-sm text-neutral-400">Select an account to continue</p>
              </div>

              {/* Content - Account List + Detail Panel */}
              <div className={cn('flex', selectedAccount ? 'divide-x divide-neutral-800' : '')}>
                {/* Account List */}
                <div
                  className={cn(
                    'px-4 py-4 max-h-[400px] overflow-y-auto',
                    selectedAccount ? 'w-1/2' : 'w-full'
                  )}
                >
                  <div className="space-y-1">
                    {selectableAccounts.map((account) => (
                      <AccountRow
                        key={account.id}
                        account={account}
                        isSelected={selectedAccountId === account.id}
                        onClick={() => handleAccountClick(account.id)}
                      />
                    ))}
                  </div>
                </div>

                {/* Detail Panel (shown when account selected) */}
                <AnimatePresence mode="wait">
                  {selectedAccount && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="w-1/2 p-4"
                    >
                      <AccountDetailPanel account={selectedAccount} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Footer */}
              <div className="px-6 py-4 border-t border-neutral-800 bg-neutral-900/50">
                <div className="flex gap-3 justify-end">
                  <button
                    onClick={handleClose}
                    className="px-4 py-2 rounded-lg text-sm font-medium text-neutral-300 hover:text-white hover:bg-neutral-800 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleLogin}
                    disabled={!selectedAccountId || isLoading}
                    className={cn(
                      'px-6 py-2 rounded-lg text-sm font-medium transition-colors',
                      selectedAccountId && !isLoading
                        ? 'bg-primary-600 text-white hover:bg-primary-500'
                        : 'bg-neutral-700 text-neutral-400 cursor-not-allowed'
                    )}
                  >
                    {isLoading ? 'Logging in...' : 'Login'}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
