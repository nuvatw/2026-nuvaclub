'use client';

import { useRef } from 'react';
import { cn } from '@/lib/utils';
import { useCheckout } from '../../context/CheckoutContext';
import { RadioCardGroup } from '../ui/FormInput';
import type { PaymentMethod, CardDetails } from '../../types';
import TapPayCardFields from '../payments/TapPayCardFields';

export function PaymentInfoStep() {
  const { state, setPaymentInfo, getCurrentStep, tappayRef } = useCheckout();
  const step = getCurrentStep();
  const { paymentInfo } = state;

  const handleMethodChange = (value: string) => {
    setPaymentInfo({ method: value as PaymentMethod });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-gray-900">
          {step?.number} · Payment Information
        </h2>
        <p className="text-gray-500 mt-1">Choose your payment method and enter details.</p>
      </div>

      {/* Payment Method Selection */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-gray-900">
          Payment Method<span className="text-red-500 ml-0.5">*</span>
        </label>
        <RadioCardGroup
          name="payment-method"
          value={paymentInfo.method}
          onChange={handleMethodChange}
          options={[
            {
              value: 'credit_card',
              title: 'Credit / Debit Card',
              subtitle: 'Pay instantly.',
            },
            {
              value: 'atm_transfer',
              title: 'ATM Bank Transfer',
              subtitle: 'Complete payment within 3 days.',
            },
          ]}
        />
      </div>

      {/* Credit Card Details */}
      {paymentInfo.method === 'credit_card' && (
        <div className="bg-gray-50 rounded-xl border border-gray-200 p-4 space-y-4">
          <h4 className="font-medium text-gray-900">Card Details</h4>

          <TapPayCardFields
            ref={tappayRef}
            onReady={(canGetPrime) => {
              setPaymentInfo({ canGetPrime });
            }}
            onUpdate={(update) => {
              setPaymentInfo({ canGetPrime: update.canGetPrime });
            }}
          />

          {/* Info strip */}
          <div className="flex items-center gap-2 bg-gray-100 rounded-lg px-3 py-2.5 mt-2">
            <svg
              className="w-5 h-5 text-gray-500 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
            <p className="text-sm text-gray-600">
              The e-invoice will be emailed after successful payment.
            </p>
          </div>
        </div>
      )}

      {/* Installment Options (only show if amount >= threshold and credit card selected) */}
      {paymentInfo.method === 'credit_card' && (() => {
        const { getTotalPrice } = useCheckout();
        const totalAmount = getTotalPrice();
        const threshold = Number(process.env.NEXT_PUBLIC_TAPPAY_INSTALLMENT_THRESHOLD) || 10000;
        const enableInstallment = totalAmount >= threshold;

        if (!enableInstallment) return null;

        return (
          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-900">
              分期付款選項
            </label>

            {/* Installment Info Banner */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <div className="flex items-start gap-2">
                <svg
                  className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <p className="text-sm text-blue-700">
                  💡 訂單金額達 <span className="font-semibold">NT${totalAmount.toLocaleString()}</span>，可選擇分期付款
                </p>
              </div>
            </div>

            <RadioCardGroup
              name="installment-option"
              value={
                paymentInfo.installment
                  ? `${paymentInfo.installment.bank}_${paymentInfo.installment.periods}`
                  : 'none'
              }
              onChange={(value) => {
                if (value === 'none') {
                  setPaymentInfo({ installment: undefined });
                } else {
                  const [bank, periods] = value.split('_');
                  setPaymentInfo({
                    installment: {
                      bank: bank as 'ctbc' | 'esun',
                      periods: Number(periods) as 3 | 6,
                    },
                  });
                }
              }}
              options={[
                {
                  value: 'none',
                  title: '💳 一次付清',
                  subtitle: `總金額 NT$${totalAmount.toLocaleString()}`,
                },
                {
                  value: 'ctbc_3',
                  title: '🏦 中信卡 3 期',
                  subtitle: `每期約 NT$${Math.ceil(totalAmount / 3).toLocaleString()} × 3 期`,
                },
                {
                  value: 'ctbc_6',
                  title: '🏦 中信卡 6 期',
                  subtitle: `每期約 NT$${Math.ceil(totalAmount / 6).toLocaleString()} × 6 期`,
                },
                {
                  value: 'esun_3',
                  title: '🏦 玉山卡 3 期',
                  subtitle: `每期約 NT$${Math.ceil(totalAmount / 3).toLocaleString()} × 3 期`,
                },
                {
                  value: 'esun_6',
                  title: '🏦 玉山卡 6 期',
                  subtitle: `每期約 NT$${Math.ceil(totalAmount / 6).toLocaleString()} × 6 期`,
                },
              ]}
            />

            {/* Installment Note */}
            {paymentInfo.installment && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                <div className="flex items-start gap-2">
                  <svg
                    className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5"
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
                  <div className="text-sm text-amber-700">
                    <p className="font-medium">分期付款注意事項</p>
                    <ul className="mt-1 space-y-1 list-disc list-inside">
                      <li>
                        {paymentInfo.installment.bank === 'ctbc' ? '中國信託' : '玉山銀行'}
                        信用卡專用分期方案
                      </li>
                      <li>實際分期利率與手續費以發卡銀行為準</li>
                      <li>分期金額可能因手續費而略有差異</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })()}

      {/* ATM Bank Transfer Details */}
      {paymentInfo.method === 'atm_transfer' && (
        <div className="space-y-4">
          {/* Bank Details Card */}
          <div className="bg-gray-50 rounded-xl border border-gray-200 p-4">
            <h4 className="font-medium text-gray-900 mb-4">Bank Account Details</h4>

            <div className="space-y-3">
              <BankDetailRow label="Bank Name" value="Bank of Taiwan (004)" />
              <BankDetailRow label="Branch" value="Longtan Branch (2260)" />
              <BankDetailRow label="Bank Code" value="0042260" />
              <BankDetailRow label="Account Name" value="Nuva Co., Ltd." />
              <BankDetailRow label="Account Number" value="22600 1009 861" />
            </div>
          </div>

          {/* Warning Callout */}
          <div className={cn(
            'rounded-xl border p-4',
            'bg-amber-50 border-amber-200'
          )}>
            <div className="flex items-start gap-3">
              <svg
                className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5"
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
                <h5 className="font-medium text-amber-800">Transfer Notes</h5>
                <ul className="mt-2 space-y-2 text-sm text-amber-700">
                  <li className="flex items-start gap-2">
                    <span className="w-1 h-1 rounded-full bg-amber-600 mt-2 flex-shrink-0" />
                    <span>
                      Please complete the transfer within 72 hours after placing the order.
                      Orders will be canceled after the deadline.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1 h-1 rounded-full bg-amber-600 mt-2 flex-shrink-0" />
                    <span>
                      We recommend taking a screenshot of the bank details above.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1 h-1 rounded-full bg-amber-600 mt-2 flex-shrink-0" />
                    <span>
                      After placing the order, the transfer details will also be sent to your email.
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Bank detail row helper component
function BankDetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center py-2 border-b border-gray-200 last:border-0">
      <span className="text-sm text-gray-500">{label}</span>
      <span className="text-sm font-medium text-gray-900">{value}</span>
    </div>
  );
}
