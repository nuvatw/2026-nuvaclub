'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Modal } from '@/components/atoms';
import { cn } from '@/lib/utils';
import { SpinnerIcon } from '@/components/icons';
import { ATTENDEE_SELECTION } from '@/Database/content/home-content';

interface AttendeeSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  tierName: string;
  amount: number;
  months: number;
  tierId: string;
  onConfirm: (count: number) => void;
}

export function AttendeeSelectionModal({
  isOpen,
  onClose,
  tierName,
  amount,
  months,
  tierId,
  onConfirm,
}: AttendeeSelectionModalProps) {
  const [count, setCount] = useState(1);
  const [customCount, setCustomCount] = useState('');
  const [isCustom, setIsCustom] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const effectiveCount = isCustom ? (parseInt(customCount, 10) || 1) : count;
  const totalAmount = amount * effectiveCount;
  const avgMonthlyPrice = Math.round(amount / months);

  const handleSelectPreset = (num: number) => {
    setCount(num);
    setIsCustom(false);
    setCustomCount('');
  };

  const handleCustomClick = () => {
    setIsCustom(true);
    if (!customCount) {
      setCustomCount('4');
    }
  };

  const handleCustomChange = (value: string) => {
    const num = value.replace(/\D/g, '');
    if (num === '' || (parseInt(num, 10) >= 1 && parseInt(num, 10) <= 99)) {
      setCustomCount(num);
    }
  };

  const handleConfirm = () => {
    setIsLoading(true);
    onConfirm(effectiveCount);
    // Navigate to checkout page
    const params = new URLSearchParams({
      tier: tierId,
      count: effectiveCount.toString(),
      ...(tierId === 'tier-custom' ? { amount: amount.toString() } : {}),
    });
    router.push(`/pledge?${params.toString()}`);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={ATTENDEE_SELECTION.title} size="md">
      <div>
        <p className="text-neutral-400 text-sm mb-6">{ATTENDEE_SELECTION.subtitle}</p>

        {/* Tier Info */}
        <div className="bg-neutral-800 rounded-lg p-4 mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-neutral-400">方案</span>
            <span className="text-white font-semibold">{tierName}</span>
          </div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-neutral-400">會員期間</span>
            <span className="text-white">{months} 個月</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-neutral-400">{ATTENDEE_SELECTION.labels.perPerson}</span>
            <span className="text-white font-semibold">NT${amount.toLocaleString()}</span>
          </div>
        </div>

        {/* Attendee Count Selector */}
        <div className="mb-6">
          <label className="block text-sm text-neutral-400 mb-3">選擇人數</label>
          <div className="flex gap-2">
            {[1, 2, 3].map((num) => (
              <button
                key={num}
                onClick={() => handleSelectPreset(num)}
                className={cn(
                  'flex-1 py-3 rounded-lg font-semibold transition-all',
                  !isCustom && count === num
                    ? 'bg-primary-500 text-white'
                    : 'bg-neutral-800 text-neutral-400 hover:bg-neutral-700'
                )}
              >
                {num} {ATTENDEE_SELECTION.labels.person}
              </button>
            ))}
            {/* Custom Input */}
            <div className="flex-1 relative">
              {isCustom ? (
                <input
                  type="text"
                  value={customCount}
                  onChange={(e) => handleCustomChange(e.target.value)}
                  autoFocus
                  className="w-full h-full py-3 px-3 rounded-lg font-semibold text-center bg-primary-500 text-white border-2 border-primary-400 focus:outline-none"
                  placeholder="4+"
                />
              ) : (
                <button
                  onClick={handleCustomClick}
                  className="w-full py-3 rounded-lg font-semibold transition-all bg-neutral-800 text-neutral-400 hover:bg-neutral-700"
                >
                  自訂
                </button>
              )}
            </div>
          </div>
          {isCustom && (
            <p className="text-xs text-neutral-500 mt-2">請輸入人數（1-99）</p>
          )}
        </div>

        {/* Total */}
        <div className="bg-gradient-to-r from-primary-500/10 to-accent-500/10 border border-primary-500/30 rounded-lg p-4 mb-6">
          <div className="flex justify-between items-center">
            <span className="text-neutral-300">{ATTENDEE_SELECTION.labels.total}</span>
            <span className="text-2xl font-bold text-white">
              NT${totalAmount.toLocaleString()}
            </span>
          </div>
          <p className="text-xs text-neutral-500 text-right mt-1">
            平均每月 NT${avgMonthlyPrice}
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Button variant="outline" onClick={onClose} disabled={isLoading} className="flex-1">
            取消
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={effectiveCount < 1 || isLoading}
            className="flex-1"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <SpinnerIcon size="sm" className="animate-spin" />
                處理中...
              </span>
            ) : (
              ATTENDEE_SELECTION.labels.continue
            )}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
