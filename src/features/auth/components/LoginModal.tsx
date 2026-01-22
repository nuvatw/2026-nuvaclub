'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth, TEST_ACCOUNTS, type TestAccount } from './AuthProvider';
import { cn } from '@/lib/utils';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function getRoleLabel(identity: string): string {
  if (identity === 'guest') return 'Guest';
  if (identity === 'explorer') return 'Explorer';
  return 'Traveler';
}

function getPlanLabel(identity: string): string | null {
  if (identity === 'guest' || identity === 'explorer') return null;
  if (identity === 'solo-traveler') return 'Solo';
  if (identity === 'duo-go') return 'Duo Go';
  if (identity === 'duo-run') return 'Duo Run';
  if (identity === 'duo-fly') return 'Duo Fly';
  return null;
}

function getRoleColor(identity: string): string {
  if (identity === 'guest') return 'bg-neutral-600';
  if (identity === 'explorer') return 'bg-primary-600';
  return 'bg-accent-500';
}

function getPlanColor(identity: string): string {
  if (identity === 'solo-traveler') return 'bg-blue-500';
  if (identity === 'duo-go') return 'bg-green-500';
  if (identity === 'duo-run') return 'bg-purple-500';
  if (identity === 'duo-fly') return 'bg-amber-500';
  return 'bg-neutral-500';
}

function AccountCard({
  account,
  isSelected,
  onClick,
}: {
  account: TestAccount;
  isSelected: boolean;
  onClick: () => void;
}) {
  const roleLabel = getRoleLabel(account.identity);
  const planLabel = getPlanLabel(account.identity);

  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full p-4 rounded-lg border-2 transition-all text-left',
        isSelected
          ? 'border-primary-500 bg-primary-500/10'
          : 'border-neutral-700 bg-neutral-800/50 hover:border-neutral-600 hover:bg-neutral-800'
      )}
    >
      <div className="flex items-start justify-between mb-2">
        <span className="font-medium text-white">{account.name}</span>
        <div className="flex gap-1.5">
          <span
            className={cn(
              'px-2 py-0.5 rounded text-xs font-medium text-white',
              getRoleColor(account.identity)
            )}
          >
            {roleLabel}
          </span>
          {planLabel && (
            <span
              className={cn(
                'px-2 py-0.5 rounded text-xs font-medium text-white',
                getPlanColor(account.identity)
              )}
            >
              {planLabel}
            </span>
          )}
        </div>
      </div>
      <p className="text-sm text-neutral-400">{account.description}</p>
    </button>
  );
}

export function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const { switchAccount, currentAccountId, isLoading } = useAuth();
  const [selectedAccountId, setSelectedAccountId] = useState<string | null>(
    null
  );

  // Filter out guest from selectable accounts for login
  const selectableAccounts = TEST_ACCOUNTS.filter((a) => a.id !== 'guest');

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

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="w-full max-w-lg bg-neutral-900 rounded-2xl border border-neutral-700 shadow-2xl overflow-hidden">
              {/* Header */}
              <div className="px-6 py-4 border-b border-neutral-800">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-white">
                    Login
                  </h2>
                  <button
                    onClick={onClose}
                    className="p-2 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
                <p className="mt-1 text-sm text-neutral-400">
                  Select a test account to log in
                </p>
              </div>

              {/* Account List */}
              <div className="px-6 py-4 max-h-[400px] overflow-y-auto">
                <div className="space-y-3">
                  {selectableAccounts.map((account) => (
                    <AccountCard
                      key={account.id}
                      account={account}
                      isSelected={selectedAccountId === account.id}
                      onClick={() => handleAccountClick(account.id)}
                    />
                  ))}
                </div>
              </div>

              {/* Footer */}
              <div className="px-6 py-4 border-t border-neutral-800 bg-neutral-900/50">
                <div className="flex gap-3 justify-end">
                  <button
                    onClick={onClose}
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
