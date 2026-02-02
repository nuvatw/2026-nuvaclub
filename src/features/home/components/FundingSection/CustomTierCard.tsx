'use client';

import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Button, Card, CardContent } from '@/components/atoms';
import { CheckIcon } from '@/components/icons';
import { cn } from '@/lib/utils';
import { CUSTOM_TIER_CONFIG, CAMPAIGN_CONFIG } from '@/content/home-content';
import { PerkIcon } from '../../utils/icons';
import { CampaignBenefitDTO } from '@/application/dtos/CampaignBenefitDTO';

interface CustomTierCardProps {
  onSelect: (amount: number) => void;
  minPrice: number;
}

export function CustomTierCard({ onSelect, minPrice }: CustomTierCardProps) {
  const [customAmount, setCustomAmount] = useState<string>(minPrice.toString());
  const [benefits, setBenefits] = useState<CampaignBenefitDTO>({
    totalMonths: 0,
    avgMonthlyPrice: CAMPAIGN_CONFIG.customTierMonthlyPrice,
    isValid: true,
  });
  const [error, setError] = useState<string>('');
  const [callMeDaddy, setCallMeDaddy] = useState(false);

  const amount = parseInt(customAmount, 10) || 0;

  useEffect(() => {
    const fetchBenefits = async () => {
      try {
        const response = await fetch(`/api/bff/campaign/calculate?amount=${amount}`);
        const data = await response.json();
        setBenefits(data);
        setError(data.error || '');
      } catch (err) {
        console.error('Failed to fetch benefits:', err);
      }
    };

    fetchBenefits();
  }, [amount]);

  const handleAmountChange = (value: string) => {
    // Only allow numbers
    const numericValue = value.replace(/\D/g, '');
    setCustomAmount(numericValue);
  };

  const handleSelect = () => {
    if (benefits.isValid) {
      onSelect(amount);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="h-full"
    >
      <Card className="h-full relative overflow-hidden border-neutral-700 hover:border-neutral-600 transition-all duration-300">
        <CardContent className="p-6">
          {/* Header */}
          <div className="mb-4">
            <h3 className="text-2xl font-bold text-white">{CUSTOM_TIER_CONFIG.name}</h3>
            <p className="text-neutral-400 text-sm">{CUSTOM_TIER_CONFIG.subtitle}</p>
          </div>

          {/* Custom Amount Input */}
          <div className="mb-4">
            <label className="block text-sm text-neutral-400 mb-2">輸入金額</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400">
                NT$
              </span>
              <input
                type="text"
                value={customAmount}
                onChange={(e) => handleAmountChange(e.target.value)}
                className={cn(
                  'w-full pl-14 pr-4 py-3 bg-neutral-800 border rounded-lg text-white text-xl font-bold focus:outline-none',
                  error
                    ? 'border-red-500 focus:border-red-500'
                    : 'border-neutral-700 focus:border-primary-500'
                )}
              />
            </div>
            {error && <p className="text-red-400 text-sm mt-1">{error}</p>}
            <p className="text-neutral-500 text-xs mt-1">
              最低 NT${minPrice.toLocaleString()}
            </p>
          </div>

          {/* Calculated Benefits */}
          {benefits.isValid && (
            <div className="bg-neutral-800 rounded-lg p-3 mb-4">
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-neutral-400">獲得會員</span>
                <span className="text-green-400 font-semibold">{benefits.totalMonths} 個月</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-neutral-500">平均每月</span>
                <div className="flex items-center gap-2">
                  <span className="text-neutral-600 line-through text-xs">NT$990</span>
                  <span className="text-green-400 font-semibold">NT${benefits.avgMonthlyPrice}</span>
                </div>
              </div>
            </div>
          )}

          {/* Perks */}
          <ul className="space-y-2 mb-4">
            {CUSTOM_TIER_CONFIG.perks.map((perk) => (
              <li key={perk} className="flex items-start gap-2 text-sm">
                <CheckIcon size="sm" className="text-green-500 mt-0.5 flex-shrink-0" />
                <span className="text-neutral-300">{perk}</span>
              </li>
            ))}
          </ul>

          {/* Special Checkbox Option */}
          <div className="mb-4">
            <label className="flex items-center gap-3 cursor-pointer group">
              <div className="relative flex-shrink-0">
                <input
                  type="checkbox"
                  checked={callMeDaddy}
                  onChange={(e) => setCallMeDaddy(e.target.checked)}
                  className="sr-only"
                />
                <div className={cn(
                  'w-5 h-5 rounded border-2 flex items-center justify-center transition-colors',
                  callMeDaddy
                    ? 'bg-primary-500 border-primary-500'
                    : 'bg-neutral-800 border-neutral-600 group-hover:border-neutral-500'
                )}>
                  {callMeDaddy && (
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
              </div>
              <span className="text-sm text-neutral-300 group-hover:text-neutral-200 transition-colors">
                上哲會叫你一聲爸爸
              </span>
            </label>
          </div>

          {/* Exclusive Perks */}
          <div className="mt-4 pt-4 border-t border-neutral-700">
            <p className="text-xs text-amber-400 font-semibold mb-3 uppercase tracking-wide">
              限定贈品
            </p>
            <div className="space-y-2">
              {CUSTOM_TIER_CONFIG.exclusivePerks.map((perk) => {
                const isRed = 'color' in perk && perk.color === 'red';
                return (
                  <div
                    key={perk.title}
                    className={cn(
                      'flex items-center gap-2 rounded-lg px-3 py-2',
                      isRed
                        ? 'bg-red-500/10 border border-red-500/30'
                        : 'bg-amber-500/10 border border-amber-500/30'
                    )}
                  >
                    <PerkIcon icon={perk.icon} className={cn('flex-shrink-0', isRed ? 'text-red-400' : 'text-amber-400')} />
                    <p className={cn('font-medium text-sm', isRed ? 'text-red-300' : 'text-amber-300')}>
                      {perk.title}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* CTA Button */}
          <div className="mt-4">
            <Button
              variant="primary"
              className="w-full font-semibold"
              onClick={handleSelect}
              disabled={!benefits.isValid}
            >
              選擇此金額
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
