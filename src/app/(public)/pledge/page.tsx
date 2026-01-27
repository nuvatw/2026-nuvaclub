'use client';

import { useState, useEffect, useMemo, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import { Button, Card, CardContent, Badge } from '@/components/atoms';
import {
  CheckIcon,
  ShoppingCartIcon,
  UserIcon,
  CreditCardIcon,
  UsersIcon,
  CheckCircleIcon,
  LockIcon,
} from '@/components/icons';
import { cn } from '@/lib/utils';
import {
  CAMPAIGN_CONFIG,
  FUNDING_TIERS,
  CUSTOM_TIER_CONFIG,
  CROWDFUNDING_CHECKOUT,
} from '@/Database/content/home-content';

// ==========================================
// TYPES
// ==========================================

interface Participant {
  name: string;
  email: string;
  phone: string;
}

interface PurchaserInfo {
  name: string;
  email: string;
  phone: string;
}

interface PaymentInfo {
  cardholderName: string;
  cardNumber: string;
  cardExpiry: string;
  cardCvc: string;
}

interface InvoiceInfo {
  type: 'personal' | 'company';
  companyName: string;
  taxId: string;
}

type CheckoutStep = 'confirm' | 'purchaser' | 'payment' | 'participants' | 'complete';

type StepIconType = 'cart' | 'user' | 'card' | 'users' | 'check';

const CHECKOUT_STEPS: { id: CheckoutStep; label: string; iconType: StepIconType }[] = [
  { id: 'confirm', label: '確認訂單', iconType: 'cart' },
  { id: 'purchaser', label: '訂購人資訊', iconType: 'user' },
  { id: 'payment', label: '付款方式', iconType: 'card' },
  { id: 'participants', label: '參加者資訊', iconType: 'users' },
  { id: 'complete', label: '完成', iconType: 'check' },
];

function StepIcon({ type, className }: { type: StepIconType; className?: string }) {
  const iconClass = cn('w-4 h-4 sm:w-5 sm:h-5', className);
  switch (type) {
    case 'cart':
      return <ShoppingCartIcon className={iconClass} />;
    case 'user':
      return <UserIcon className={iconClass} />;
    case 'card':
      return <CreditCardIcon className={iconClass} />;
    case 'users':
      return <UsersIcon className={iconClass} />;
    case 'check':
      return <CheckIcon className={iconClass} />;
  }
}

// ==========================================
// STEPPER COMPONENT
// ==========================================

function PledgeStepper({ currentStep }: { currentStep: CheckoutStep }) {
  const currentIndex = CHECKOUT_STEPS.findIndex((s) => s.id === currentStep);

  return (
    <div className="w-full py-4 sm:py-6 px-3 sm:px-4 overflow-x-auto">
      <div className="flex items-center justify-between min-w-[420px] sm:min-w-[500px] max-w-3xl mx-auto">
        {CHECKOUT_STEPS.map((step, index) => {
          const isCompleted = index < currentIndex;
          const isActive = index === currentIndex;

          return (
            <div key={step.id} className="flex items-center flex-1 last:flex-none">
              {/* Step circle and label */}
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    'w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all duration-300',
                    isCompleted && 'bg-green-500 text-white',
                    isActive && 'bg-primary-500 text-white shadow-lg shadow-primary-500/30',
                    !isCompleted && !isActive && 'bg-neutral-800 text-neutral-500 border border-neutral-700'
                  )}
                >
                  {isCompleted ? (
                    <CheckIcon size="sm" className="sm:w-5 sm:h-5" />
                  ) : (
                    <StepIcon type={step.iconType} />
                  )}
                </div>
                <span
                  className={cn(
                    'mt-1.5 sm:mt-2 text-[10px] sm:text-xs font-medium whitespace-nowrap',
                    isCompleted && 'text-green-400',
                    isActive && 'text-primary-400',
                    !isCompleted && !isActive && 'text-neutral-600'
                  )}
                >
                  {step.label}
                </span>
              </div>

              {/* Connector line */}
              {index < CHECKOUT_STEPS.length - 1 && (
                <div
                  className={cn(
                    'h-0.5 flex-1 mx-2 sm:mx-3 mt-[-16px] sm:mt-[-20px] transition-colors duration-300',
                    index < currentIndex ? 'bg-green-500' : 'bg-neutral-800'
                  )}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ==========================================
// FORM INPUT COMPONENT
// ==========================================

function FormInput({
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  error,
  className,
  inputRef,
  name,
  autoComplete,
}: {
  label: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
  className?: string;
  inputRef?: React.RefObject<HTMLInputElement | null>;
  name?: string;
  autoComplete?: string;
}) {
  return (
    <div className={className}>
      <label className="block text-sm text-neutral-400 mb-1.5">{label}</label>
      <input
        ref={inputRef}
        type={type}
        name={name}
        autoComplete={autoComplete}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={cn(
          'w-full px-4 py-3 bg-neutral-800 border rounded-lg text-white placeholder-neutral-500',
          'focus:outline-none focus:ring-2 focus:ring-primary-500/50',
          error ? 'border-red-500' : 'border-neutral-700 focus:border-primary-500'
        )}
      />
      {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
    </div>
  );
}

// ==========================================
// STEP 1: CONFIRM ORDER
// ==========================================

function ConfirmOrderStep({
  tierName,
  amount,
  months,
  attendeeCount,
  avgMonthlyPrice,
  onContinue,
  onBack,
}: {
  tierName: string;
  amount: number;
  months: number;
  attendeeCount: number;
  avgMonthlyPrice: number;
  onContinue: () => void;
  onBack: () => void;
}) {
  const totalAmount = amount * attendeeCount;

  return (
    <div>
      <h2 className="text-xl font-bold text-white mb-6">確認訂單內容</h2>

      {/* Order Item */}
      <Card className="mb-6 bg-neutral-800/50 border-neutral-700">
        <CardContent className="p-5">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-lg font-semibold text-white">{tierName}</h3>
              <p className="text-neutral-400 text-sm">nuvaClub 早鳥贊助方案</p>
            </div>
            <Badge variant="primary">{months} 個月會員</Badge>
          </div>

          <div className="space-y-3 text-sm border-t border-neutral-700 pt-4">
            <div className="flex justify-between">
              <span className="text-neutral-400">單價</span>
              <span className="text-white font-medium">NT${amount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-400">數量</span>
              <span className="text-white font-medium">{attendeeCount} 位</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-400">平均每月</span>
              <div className="text-right">
                <span className="text-neutral-500 line-through text-xs mr-2">NT$990</span>
                <span className="text-green-400 font-medium">NT${avgMonthlyPrice}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Total - Premium two-blue gradient */}
      <div className="relative rounded-xl p-5 mb-8 overflow-hidden">
        {/* Background gradient - two blues only for premium look */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-blue-500/15 to-sky-400/20" />
        {/* Subtle texture overlay */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }} />
        {/* Soft highlight sheen */}
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent" />
        {/* Border */}
        <div className="absolute inset-0 rounded-xl border border-blue-400/30" />
        {/* Content */}
        <div className="relative flex justify-between items-center">
          <span className="text-blue-100 font-medium">訂單總額</span>
          <span className="text-3xl font-bold text-white">
            NT${totalAmount.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <Button variant="outline" onClick={onBack} className="flex-1">
          返回修改
        </Button>
        <Button onClick={onContinue} className="flex-1">
          下一步
        </Button>
      </div>
    </div>
  );
}

// ==========================================
// STEP 2: PURCHASER INFO
// ==========================================

function PurchaserInfoStep({
  purchaser,
  setPurchaser,
  onContinue,
  onBack,
}: {
  purchaser: PurchaserInfo;
  setPurchaser: (p: PurchaserInfo) => void;
  onContinue: () => void;
  onBack: () => void;
}) {
  const isValid = purchaser.name.trim() && purchaser.email.includes('@') && purchaser.phone.length >= 10;

  return (
    <div>
      <h2 className="text-xl font-bold text-white mb-2">訂購人資訊</h2>
      <p className="text-neutral-400 text-sm mb-6">請填寫訂購人的聯絡資訊</p>

      <div className="space-y-4 mb-8">
        <FormInput
          label="姓名"
          name="name"
          autoComplete="name"
          value={purchaser.name}
          onChange={(v) => setPurchaser({ ...purchaser, name: v })}
          placeholder="請輸入姓名"
        />
        <FormInput
          label="電子信箱"
          type="email"
          name="email"
          autoComplete="email"
          value={purchaser.email}
          onChange={(v) => setPurchaser({ ...purchaser, email: v })}
          placeholder="example@email.com"
        />
        <FormInput
          label="手機號碼"
          type="tel"
          name="tel"
          autoComplete="tel"
          value={purchaser.phone}
          onChange={(v) => setPurchaser({ ...purchaser, phone: v })}
          placeholder="0912345678"
        />
      </div>

      <div className="flex gap-3">
        <Button variant="outline" onClick={onBack} className="flex-1">
          上一步
        </Button>
        <Button onClick={onContinue} disabled={!isValid} className="flex-1">
          下一步
        </Button>
      </div>
    </div>
  );
}

// ==========================================
// STEP 3: PAYMENT + INVOICE
// ==========================================

function PaymentInfoStep({
  payment,
  setPayment,
  invoice,
  setInvoice,
  onContinue,
  onBack,
}: {
  payment: PaymentInfo;
  setPayment: (p: PaymentInfo) => void;
  invoice: InvoiceInfo;
  setInvoice: (i: InvoiceInfo) => void;
  onContinue: () => void;
  onBack: () => void;
}) {
  // Refs for auto-focus
  const cardholderNameRef = useRef<HTMLInputElement>(null);
  const cardNumberRef = useRef<HTMLInputElement>(null);
  const cardExpiryRef = useRef<HTMLInputElement>(null);
  const cardCvcRef = useRef<HTMLInputElement>(null);
  const nextButtonRef = useRef<HTMLButtonElement>(null);

  const formatCardNumber = (value: string) => {
    return value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim().slice(0, 19);
  };

  const formatExpiry = (value: string) => {
    return value.replace(/\D/g, '').replace(/(\d{2})(\d)/, '$1/$2').slice(0, 5);
  };

  // Auto-focus handlers
  const handleTaxIdChange = (value: string) => {
    const cleanValue = value.replace(/\D/g, '').slice(0, 8);
    setInvoice({ ...invoice, taxId: cleanValue });
    // When 8 digits complete, focus cardholder name
    if (cleanValue.length === 8) {
      setTimeout(() => cardholderNameRef.current?.focus(), 50);
    }
  };

  const handleCardholderNameChange = (value: string) => {
    setPayment({ ...payment, cardholderName: value });
  };

  const handleCardNumberChange = (value: string) => {
    const formatted = formatCardNumber(value);
    setPayment({ ...payment, cardNumber: formatted });
    // When 16 digits complete, focus expiry
    if (formatted.replace(/\s/g, '').length >= 16) {
      setTimeout(() => cardExpiryRef.current?.focus(), 50);
    }
  };

  const handleExpiryChange = (value: string) => {
    const formatted = formatExpiry(value);
    setPayment({ ...payment, cardExpiry: formatted });
    // When MM/YY complete (5 chars), focus CVC
    if (formatted.length === 5) {
      setTimeout(() => cardCvcRef.current?.focus(), 50);
    }
  };

  const handleCvcChange = (value: string) => {
    const cleanValue = value.replace(/\D/g, '').slice(0, 4);
    setPayment({ ...payment, cardCvc: cleanValue });
    // When 3+ digits complete, highlight next button
    if (cleanValue.length >= 3) {
      setTimeout(() => nextButtonRef.current?.focus(), 50);
    }
  };

  const isPaymentValid =
    payment.cardholderName.trim().length > 0 &&
    payment.cardNumber.replace(/\s/g, '').length >= 16 &&
    payment.cardExpiry.length === 5 &&
    payment.cardCvc.length >= 3;

  const isInvoiceValid =
    invoice.type === 'personal' ||
    (invoice.companyName.trim() && invoice.taxId.length === 8);

  const isValid = isPaymentValid && isInvoiceValid;

  return (
    <div>
      {/* Invoice Section */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-white mb-2">發票資訊</h2>
        <p className="text-neutral-400 text-sm mb-4">選擇發票類型</p>

        <div className="flex gap-3 mb-4">
          <button
            onClick={() => setInvoice({ ...invoice, type: 'personal' })}
            className={cn(
              'flex-1 px-4 py-3 rounded-lg border-2 text-sm font-medium transition-all',
              invoice.type === 'personal'
                ? 'border-primary-500 bg-primary-500/10 text-primary-400'
                : 'border-neutral-700 text-neutral-400 hover:border-neutral-600'
            )}
          >
            個人發票（二聯式）
          </button>
          <button
            onClick={() => setInvoice({ ...invoice, type: 'company' })}
            className={cn(
              'flex-1 px-4 py-3 rounded-lg border-2 text-sm font-medium transition-all',
              invoice.type === 'company'
                ? 'border-primary-500 bg-primary-500/10 text-primary-400'
                : 'border-neutral-700 text-neutral-400 hover:border-neutral-600'
            )}
          >
            公司發票（三聯式）
          </button>
        </div>

        <AnimatePresence>
          {invoice.type === 'company' && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="grid gap-4 sm:grid-cols-2 p-4 bg-neutral-800/50 rounded-lg border border-neutral-700">
                <FormInput
                  label="公司名稱"
                  value={invoice.companyName}
                  onChange={(v) => setInvoice({ ...invoice, companyName: v })}
                  placeholder="請輸入公司名稱"
                />
                <FormInput
                  label="統一編號"
                  value={invoice.taxId}
                  onChange={handleTaxIdChange}
                  placeholder="請輸入 8 位統一編號"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Payment Section */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-white mb-2">付款方式</h2>
        <p className="text-neutral-400 text-sm mb-4">輸入信用卡資訊</p>

        <div className="p-4 bg-neutral-800/50 rounded-lg border border-neutral-700">
          <div className="flex items-center gap-3 mb-4 p-3 bg-primary-500/10 rounded-lg border border-primary-500/30">
            <CreditCardIcon size="lg" className="text-primary-400" />
            <span className="text-primary-400 font-medium">信用卡付款</span>
          </div>

          <div className="space-y-4">
            <FormInput
              label="持卡人姓名"
              name="cc-name"
              autoComplete="cc-name"
              value={payment.cardholderName}
              onChange={handleCardholderNameChange}
              placeholder="請輸入持卡人姓名"
              inputRef={cardholderNameRef}
            />
            <FormInput
              label="信用卡號"
              name="cc-number"
              autoComplete="cc-number"
              value={payment.cardNumber}
              onChange={handleCardNumberChange}
              placeholder="1234 5678 9012 3456"
              inputRef={cardNumberRef}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormInput
                label="有效期限"
                name="cc-exp"
                autoComplete="cc-exp"
                value={payment.cardExpiry}
                onChange={handleExpiryChange}
                placeholder="MM/YY"
                inputRef={cardExpiryRef}
              />
              <FormInput
                label="安全碼"
                name="cc-csc"
                autoComplete="cc-csc"
                value={payment.cardCvc}
                onChange={handleCvcChange}
                placeholder="CVC"
                inputRef={cardCvcRef}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Validation hints */}
      {!isValid && (
        <div className="mb-4 p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg">
          <p className="text-amber-400 text-sm">請確認以下資料：</p>
          <ul className="text-amber-400/70 text-xs mt-1 space-y-0.5">
            {!payment.cardholderName.trim() && (
              <li>• 請輸入持卡人姓名</li>
            )}
            {payment.cardNumber.replace(/\s/g, '').length < 16 && (
              <li>• 信用卡號需要 16 位數字（目前 {payment.cardNumber.replace(/\s/g, '').length} 位）</li>
            )}
            {payment.cardExpiry.length !== 5 && (
              <li>• 請輸入有效期限 (MM/YY)</li>
            )}
            {payment.cardCvc.length < 3 && (
              <li>• 請輸入安全碼 (3-4 位)</li>
            )}
            {invoice.type === 'company' && !invoice.companyName.trim() && (
              <li>• 請輸入公司名稱</li>
            )}
            {invoice.type === 'company' && invoice.taxId.length !== 8 && (
              <li>• 統一編號需要 8 位數字</li>
            )}
          </ul>
        </div>
      )}

      <div className="flex gap-3">
        <Button variant="outline" onClick={onBack} className="flex-1">
          上一步
        </Button>
        <Button
          ref={nextButtonRef}
          onClick={onContinue}
          disabled={!isValid}
          className={cn('flex-1', isValid && 'ring-2 ring-primary-500/50')}
        >
          下一步
        </Button>
      </div>
    </div>
  );
}

// ==========================================
// STEP 4: PARTICIPANTS INFO
// ==========================================

function ParticipantsInfoStep({
  attendeeCount,
  participants,
  setParticipants,
  purchaser,
  onSubmit,
  onBack,
  isSubmitting,
}: {
  attendeeCount: number;
  participants: Participant[];
  setParticipants: (p: Participant[]) => void;
  purchaser: PurchaserInfo;
  onSubmit: () => void;
  onBack: () => void;
  isSubmitting: boolean;
}) {
  const updateParticipant = (index: number, field: keyof Participant, value: string) => {
    const updated = [...participants];
    updated[index] = { ...updated[index], [field]: value };
    setParticipants(updated);
  };

  const autofillFromPurchaser = () => {
    const updated = [...participants];
    updated[0] = {
      name: purchaser.name,
      email: purchaser.email,
      phone: purchaser.phone,
    };
    setParticipants(updated);
  };

  const isValid = participants.every(
    (p) => p.name.trim() && p.email.includes('@') && p.phone.length >= 10
  );

  return (
    <div>
      <h2 className="text-xl font-bold text-white mb-2">參加者資訊</h2>
      <p className="text-neutral-400 text-sm mb-6">
        請填寫每位參加者的資料，這些資料將用於會員帳號建立
      </p>

      <div className="space-y-4 sm:space-y-6 mb-6 sm:mb-8">
        {participants.map((participant, index) => (
          <Card key={index} className="bg-neutral-800/50 border-neutral-700">
            <CardContent className="p-3 sm:p-4">
              {/* Header - stacks on mobile */}
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-primary-500/20 text-primary-400 text-xs sm:text-sm flex items-center justify-center font-semibold flex-shrink-0">
                    {index + 1}
                  </span>
                  <span className="text-white font-medium text-sm sm:text-base">
                    參加者 {index + 1}
                    {index === 0 && <span className="text-neutral-500 text-xs sm:text-sm ml-1 sm:ml-2">（主要聯絡人）</span>}
                  </span>
                </div>
                {index === 0 && (
                  <button
                    type="button"
                    onClick={autofillFromPurchaser}
                    className="w-full sm:w-auto text-xs sm:text-sm text-primary-400 hover:text-primary-300 transition-colors px-3 py-2 rounded-lg bg-primary-500/10 hover:bg-primary-500/20 border border-primary-500/30"
                  >
                    自動填入訂購人資料
                  </button>
                )}
              </div>
              <div className="grid gap-3 sm:gap-4 sm:grid-cols-2">
                <FormInput
                  label="姓名"
                  value={participant.name}
                  onChange={(v) => updateParticipant(index, 'name', v)}
                  placeholder="請輸入姓名"
                  className="sm:col-span-2"
                />
                <FormInput
                  label="電子信箱"
                  type="email"
                  value={participant.email}
                  onChange={(v) => updateParticipant(index, 'email', v)}
                  placeholder="example@email.com"
                />
                <FormInput
                  label="手機號碼"
                  type="tel"
                  value={participant.phone}
                  onChange={(v) => updateParticipant(index, 'phone', v)}
                  placeholder="0912345678"
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex gap-2 sm:gap-3">
        <Button variant="outline" onClick={onBack} className="flex-1 text-sm sm:text-base py-2.5 sm:py-3" disabled={isSubmitting}>
          上一步
        </Button>
        <Button onClick={onSubmit} disabled={!isValid || isSubmitting} className="flex-1 text-sm sm:text-base py-2.5 sm:py-3">
          {isSubmitting ? '處理中...' : '確認付款'}
        </Button>
      </div>
    </div>
  );
}


// ==========================================
// ORDER SUMMARY SIDEBAR
// ==========================================

function OrderSummarySidebar({
  tierName,
  amount,
  months,
  attendeeCount,
}: {
  tierName: string;
  amount: number;
  months: number;
  attendeeCount: number;
}) {
  const totalAmount = amount * attendeeCount;
  const avgMonthly = Math.round(amount / months);

  return (
    <Card className="sticky top-8 bg-neutral-900 border-neutral-800">
      <CardContent className="p-5">
        <h3 className="text-lg font-semibold text-white mb-4">訂單摘要</h3>

        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-neutral-400">方案</span>
            <span className="text-white font-medium">{tierName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-neutral-400">會員期間</span>
            <span className="text-white">{months} 個月</span>
          </div>
          <div className="flex justify-between">
            <span className="text-neutral-400">人數</span>
            <span className="text-white">{attendeeCount} 位</span>
          </div>
          <div className="flex justify-between">
            <span className="text-neutral-400">單價</span>
            <span className="text-white">NT${amount.toLocaleString()}</span>
          </div>

          <div className="border-t border-neutral-700 pt-4 mt-4">
            <div className="flex justify-between items-center mb-1">
              <span className="text-neutral-300 font-medium">總計</span>
              <span className="text-2xl font-bold text-white">
                NT${totalAmount.toLocaleString()}
              </span>
            </div>
            <p className="text-xs text-neutral-500 text-right">
              平均每月 NT${avgMonthly}
            </p>
          </div>
        </div>

        {/* Trust badges */}
        <div className="mt-6 pt-4 border-t border-neutral-700">
          <div className="space-y-2 text-xs text-neutral-500">
            <div className="flex items-center gap-2">
              <LockIcon size="sm" />
              <span>SSL 加密安全付款</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircleIcon size="sm" />
              <span>14 天無條件退款保證</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ==========================================
// MAIN CHECKOUT CONTENT
// ==========================================

function PledgeCheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get tier info from URL params
  const tierId = searchParams.get('tier') || 'tier-1';
  const attendeeCountParam = parseInt(searchParams.get('count') || '1', 10);
  const customAmountParam = parseInt(searchParams.get('amount') || '0', 10);

  // Find tier info
  const tier = FUNDING_TIERS.find((t) => t.id === tierId);
  const isCustomTier = tierId === 'tier-custom';

  const tierName = isCustomTier ? CUSTOM_TIER_CONFIG.name : (tier?.name || '');
  const amount = isCustomTier ? customAmountParam : (tier?.price || 0);
  // Custom tier: ceil(amount / 400) so average never exceeds 400
  const months = isCustomTier
    ? Math.ceil(customAmountParam / CAMPAIGN_CONFIG.customTierMonthlyPrice)
    : (tier?.getMonths || 0);
  const avgMonthlyPrice = months > 0 ? Math.round(amount / months) : 0;

  // Checkout state
  const [currentStep, setCurrentStep] = useState<CheckoutStep>('confirm');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [participants, setParticipants] = useState<Participant[]>(() =>
    Array(attendeeCountParam).fill(null).map(() => ({ name: '', email: '', phone: '' }))
  );
  const [purchaser, setPurchaser] = useState<PurchaserInfo>({ name: '', email: '', phone: '' });
  const [payment, setPayment] = useState<PaymentInfo>({ cardholderName: '', cardNumber: '', cardExpiry: '', cardCvc: '' });
  const [invoice, setInvoice] = useState<InvoiceInfo>({ type: 'personal', companyName: '', taxId: '' });

  // Navigation handlers
  const goToStep = (step: CheckoutStep) => setCurrentStep(step);

  const handleSubmitOrder = () => {
    setIsSubmitting(true);
    // Simulate processing delay then complete
    setTimeout(() => {
      // Store pledge info in sessionStorage for the homepage to read
      // Include all participant names for multi-card download
      const pledgeInfo = {
        amount: amount * attendeeCountParam,
        tierName,
        months,
        attendeeCount: attendeeCountParam,
        purchaserName: purchaser.name,
        participantNames: participants.map(p => p.name),
        timestamp: Date.now(),
      };
      sessionStorage.setItem('nuvaclub_pledge_success', JSON.stringify(pledgeInfo));
      // Redirect to homepage with success flag
      router.push('/?pledge=success');
    }, 800);
  };

  // Invalid tier check
  if (!tier && !isCustomTier) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
        <div className="text-center">
          <p className="text-neutral-400 mb-4">找不到該方案</p>
          <Button onClick={() => router.push('/')}>返回首頁</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950">
      {/* Stepper */}
      <div className="bg-neutral-900/50 border-b border-neutral-800">
        <PledgeStepper currentStep={currentStep} />
      </div>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Form */}
          <div className="lg:col-span-2">
            <Card className="bg-neutral-900 border-neutral-800">
              <CardContent className="p-6">
                <AnimatePresence mode="wait">
                  {currentStep === 'confirm' && (
                    <motion.div
                      key="confirm"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                    >
                      <ConfirmOrderStep
                        tierName={tierName}
                        amount={amount}
                        months={months}
                        attendeeCount={attendeeCountParam}
                        avgMonthlyPrice={avgMonthlyPrice}
                        onContinue={() => goToStep('purchaser')}
                        onBack={() => router.push('/')}
                      />
                    </motion.div>
                  )}

                  {currentStep === 'purchaser' && (
                    <motion.div
                      key="purchaser"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                    >
                      <PurchaserInfoStep
                        purchaser={purchaser}
                        setPurchaser={setPurchaser}
                        onContinue={() => goToStep('payment')}
                        onBack={() => goToStep('confirm')}
                      />
                    </motion.div>
                  )}

                  {currentStep === 'payment' && (
                    <motion.div
                      key="payment"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                    >
                      <PaymentInfoStep
                        payment={payment}
                        setPayment={setPayment}
                        invoice={invoice}
                        setInvoice={setInvoice}
                        onContinue={() => goToStep('participants')}
                        onBack={() => goToStep('purchaser')}
                      />
                    </motion.div>
                  )}

                  {currentStep === 'participants' && (
                    <motion.div
                      key="participants"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                    >
                      <ParticipantsInfoStep
                        attendeeCount={attendeeCountParam}
                        participants={participants}
                        setParticipants={setParticipants}
                        purchaser={purchaser}
                        onSubmit={handleSubmitOrder}
                        onBack={() => goToStep('payment')}
                        isSubmitting={isSubmitting}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-1">
            <OrderSummarySidebar
              tierName={tierName}
              amount={amount}
              months={months}
              attendeeCount={attendeeCountParam}
            />
          </div>
        </div>
      </main>
    </div>
  );
}

// ==========================================
// PAGE COMPONENT
// ==========================================

export default function PledgeCheckoutPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
          <div className="animate-pulse text-neutral-400">Loading...</div>
        </div>
      }
    >
      <PledgeCheckoutContent />
    </Suspense>
  );
}
