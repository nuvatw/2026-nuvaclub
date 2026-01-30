'use client';

import { useState, useMemo, useCallback } from 'react';
import Image from 'next/image';
import { Modal, Button } from '@/components/atoms';
import { cn } from '@/lib/utils';
import type { MatchingPostWithRelations } from '../../hooks';
import { formatPrice, getNunuLevelConfig } from '@/features/space/types';
import type { NunuLevel, PriceType } from '@/features/space/types';

interface PurchaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  post: MatchingPostWithRelations;
  onConfirm: (selectedMonths: string[]) => void;
}

export function PurchaseModal({ isOpen, onClose, post, onConfirm }: PurchaseModalProps) {
  const [selectedMonths, setSelectedMonths] = useState<string[]>([]);
  const [step, setStep] = useState<'select' | 'confirm'>('select');
  const [isProcessing, setIsProcessing] = useState(false);

  const levelConfig = post.author?.nunuLevel
    ? getNunuLevelConfig(post.author.nunuLevel as NunuLevel)
    : null;

  // Filter available months (only show months that still have slots)
  const availableMonths = useMemo(() => {
    const slotsRemaining = (post.maxSlots ?? 0) - (post.currentSlots ?? 0);
    if (slotsRemaining <= 0) return [];
    return post.availableMonths || [];
  }, [post]);

  // Calculate total
  const totalAmount = useMemo(() => {
    if (post.priceType === 'negotiable' || !post.priceAmount) return 0;
    return post.priceAmount * selectedMonths.length;
  }, [post.priceType, post.priceAmount, selectedMonths.length]);

  const toggleMonth = useCallback((month: string) => {
    setSelectedMonths(prev => {
      if (prev.includes(month)) {
        return prev.filter(m => m !== month);
      }
      return [...prev, month].sort();
    });
  }, []);

  const handleContinue = useCallback(() => {
    if (selectedMonths.length > 0) {
      setStep('confirm');
    }
  }, [selectedMonths.length]);

  const handleBack = useCallback(() => {
    setStep('select');
  }, []);

  const handleConfirm = useCallback(async () => {
    setIsProcessing(true);
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 1000));
    onConfirm(selectedMonths);
    setIsProcessing(false);
    setSelectedMonths([]);
    setStep('select');
    onClose();
  }, [selectedMonths, onConfirm, onClose]);

  const handleClose = useCallback(() => {
    setSelectedMonths([]);
    setStep('select');
    onClose();
  }, [onClose]);

  const slotsAvailable = (post.maxSlots ?? 0) - (post.currentSlots ?? 0);

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="md">
      {step === 'select' ? (
        <div>
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">Purchase Mentorship</h2>
            <button
              onClick={handleClose}
              className="p-2 rounded-lg hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Nunu Info */}
          <div className="flex items-center gap-4 p-4 rounded-xl bg-neutral-800/50 mb-6">
            {post.author && (
              <>
                <Image
                  src={post.author.avatar || 'https://api.dicebear.com/9.x/avataaars/png?seed=default'}
                  alt={post.author.name}
                  width={56}
                  height={56}
                  className="rounded-full"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-white">{post.author.name}</span>
                    {levelConfig && (
                      <span className={cn('px-2 py-0.5 rounded text-xs font-medium', levelConfig.color)}>
                        {levelConfig.level}
                      </span>
                    )}
                  </div>
                  {post.author.rating && (
                    <div className="flex items-center gap-1 text-sm text-neutral-400">
                      <svg className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      {post.author.rating.toFixed(1)}
                    </div>
                  )}
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-primary-400">
                    {formatPrice(post.priceType as PriceType, post.priceAmount, post.priceMin, post.priceMax, post.priceCurrency)}
                  </div>
                  <div className="text-xs text-neutral-500">
                    {slotsAvailable} slot{slotsAvailable !== 1 ? 's' : ''} available
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Post Title */}
          <h3 className="text-lg font-medium text-white mb-4">{post.title}</h3>

          {/* Month Selection */}
          <div className="mb-6">
            <label className="text-sm text-neutral-400 mb-3 block">Select months to purchase</label>
            {availableMonths.length === 0 ? (
              <div className="text-center py-6 text-neutral-500">
                No slots available for this post
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-2">
                {availableMonths.map((month) => {
                  const isSelected = selectedMonths.includes(month);
                  const date = new Date(month + '-01');
                  const label = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });

                  return (
                    <button
                      key={month}
                      type="button"
                      onClick={() => toggleMonth(month)}
                      className={cn(
                        'px-3 py-3 rounded-lg text-sm font-medium transition-all border',
                        isSelected
                          ? 'bg-primary-500/20 border-primary-500 text-primary-400'
                          : 'bg-neutral-800 border-neutral-700 text-neutral-400 hover:border-neutral-600'
                      )}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Total */}
          {selectedMonths.length > 0 && post.priceAmount && (
            <div className="p-4 rounded-xl bg-neutral-800/30 border border-neutral-700 mb-6">
              <div className="flex items-center justify-between">
                <span className="text-neutral-400">
                  {selectedMonths.length} month{selectedMonths.length !== 1 ? 's' : ''} × NT${post.priceAmount.toLocaleString()}
                </span>
                <span className="text-xl font-bold text-white">NT${totalAmount.toLocaleString()}</span>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3">
            <Button variant="secondary" onClick={handleClose} className="flex-1">
              Cancel
            </Button>
            <Button
              onClick={handleContinue}
              disabled={selectedMonths.length === 0 || availableMonths.length === 0}
              className="flex-1"
            >
              Continue
            </Button>
          </div>
        </div>
      ) : (
        <div>
          {/* Confirmation Step */}
          <div className="text-center mb-6">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary-500/20 flex items-center justify-center">
              <svg className="w-8 h-8 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-white mb-2">Confirm Purchase</h2>
            <p className="text-neutral-400">You are about to purchase mentorship from</p>
          </div>

          {/* Summary */}
          <div className="bg-neutral-800/50 rounded-xl p-4 mb-6">
            <div className="flex items-center gap-3 mb-4">
              {post.author && (
                <>
                  <Image
                    src={post.author.avatar || 'https://api.dicebear.com/9.x/avataaars/png?seed=default'}
                    alt={post.author.name}
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                  <span className="font-medium text-white">{post.author.name}</span>
                </>
              )}
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-neutral-400">Months</span>
                <span className="text-white">
                  {selectedMonths.map(m => {
                    const date = new Date(m + '-01');
                    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
                  }).join(', ')}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400">Price per month</span>
                <span className="text-white">NT${post.priceAmount?.toLocaleString()}</span>
              </div>
              <div className="border-t border-neutral-700 pt-2 mt-2 flex justify-between">
                <span className="font-medium text-white">Total</span>
                <span className="font-bold text-primary-400">NT${totalAmount.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Warning */}
          <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 mb-6">
            <svg className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <div>
              <p className="text-sm text-amber-400 font-medium">You will be charged immediately</p>
              <p className="text-xs text-amber-400/70 mt-1">
                The Nunu will receive payment and you'll be connected via Discord.
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button variant="secondary" onClick={handleBack} className="flex-1" disabled={isProcessing}>
              Back
            </Button>
            <Button onClick={handleConfirm} className="flex-1" disabled={isProcessing}>
              {isProcessing ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Processing...
                </>
              ) : (
                <>Confirm & Pay NT${totalAmount.toLocaleString()}</>
              )}
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
}
