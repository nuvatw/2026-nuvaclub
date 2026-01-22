'use client';

import { useRef } from 'react';
import { cn } from '@/lib/utils';
import { useCheckout } from '../../context/CheckoutContext';
import { RadioCardGroup } from '../ui/FormInput';
import type { PaymentMethod, CardDetails } from '../../types';

export function PaymentInfoStep() {
  const { state, setPaymentInfo, getCurrentStep } = useCheckout();
  const step = getCurrentStep();
  const { paymentInfo } = state;

  // Refs for auto-focus
  const expiryRef = useRef<HTMLInputElement>(null);
  const cvcRef = useRef<HTMLInputElement>(null);

  const handleMethodChange = (value: string) => {
    setPaymentInfo({ method: value as PaymentMethod });
  };

  const handleCardDetailChange = (field: keyof CardDetails, value: string) => {
    setPaymentInfo({
      cardDetails: {
        ...(paymentInfo.cardDetails || {
          cardholderName: '',
          cardNumber: '',
          expiryDate: '',
          cvc: '',
        }),
        [field]: value,
      },
    });
  };

  // Format card number with spaces and auto-focus
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const cleaned = e.target.value.replace(/\D/g, '').slice(0, 16);
    const groups = cleaned.match(/.{1,4}/g);
    const formatted = groups ? groups.join(' ') : cleaned;
    handleCardDetailChange('cardNumber', formatted);

    // Auto-focus to expiry when 16 digits entered
    if (cleaned.length === 16) {
      expiryRef.current?.focus();
    }
  };

  // Format expiry date and auto-focus
  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const cleaned = e.target.value.replace(/\D/g, '').slice(0, 4);
    let formatted = cleaned;
    if (cleaned.length >= 2) {
      formatted = cleaned.slice(0, 2) + '/' + cleaned.slice(2, 4);
    }
    handleCardDetailChange('expiryDate', formatted);

    // Auto-focus to CVC when expiry is complete (4 digits = MM/YY)
    if (cleaned.length === 4) {
      cvcRef.current?.focus();
    }
  };

  // Handle CVC input
  const handleCvcChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const cleaned = e.target.value.replace(/\D/g, '').slice(0, 4);
    handleCardDetailChange('cvc', cleaned);
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
        <label className="text-sm font-medium text-gray-700">
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

          {/* Cardholder Name */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="cardholder-name" className="text-sm font-medium text-gray-700">
              Cardholder Name<span className="text-red-500 ml-0.5">*</span>
            </label>
            <input
              id="cardholder-name"
              type="text"
              value={paymentInfo.cardDetails?.cardholderName || ''}
              onChange={(e) => handleCardDetailChange('cardholderName', e.target.value)}
              placeholder="Same as on card"
              className="w-full px-3 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-gray-400 transition-colors"
            />
          </div>

          {/* Card Number */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="card-number" className="text-sm font-medium text-gray-700">
              Card Number<span className="text-red-500 ml-0.5">*</span>
            </label>
            <input
              id="card-number"
              type="text"
              inputMode="numeric"
              value={paymentInfo.cardDetails?.cardNumber || ''}
              onChange={handleCardNumberChange}
              placeholder="0000 0000 0000 0000"
              maxLength={19}
              className="w-full px-3 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-gray-400 transition-colors font-mono tracking-wider"
            />
          </div>

          {/* Expiry and CVC Row */}
          <div className="grid grid-cols-2 gap-4">
            {/* Expiry Date */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="expiry-date" className="text-sm font-medium text-gray-700">
                Expiry Date (MM/YY)<span className="text-red-500 ml-0.5">*</span>
              </label>
              <input
                ref={expiryRef}
                id="expiry-date"
                type="text"
                inputMode="numeric"
                value={paymentInfo.cardDetails?.expiryDate || ''}
                onChange={handleExpiryChange}
                placeholder="MM/YY"
                maxLength={5}
                className="w-full px-3 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-gray-400 transition-colors font-mono"
              />
            </div>

            {/* CVC */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="cvc" className="text-sm font-medium text-gray-700">
                CVC<span className="text-red-500 ml-0.5">*</span>
              </label>
              <input
                ref={cvcRef}
                id="cvc"
                type="text"
                inputMode="numeric"
                value={paymentInfo.cardDetails?.cvc || ''}
                onChange={handleCvcChange}
                placeholder="123"
                maxLength={4}
                className="w-full px-3 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-gray-400 transition-colors font-mono"
              />
            </div>
          </div>

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
