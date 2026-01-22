'use client';

import { cn } from '@/lib/utils';
import { useCheckout } from '../../context/CheckoutContext';
import { formatCurrency } from '../../types';

export function OrderSummary() {
  const { state, getUnitPrice, getTotalPrice } = useCheckout();
  const item = state.items[0];

  if (!item) return null;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 h-fit">
      {/* Header */}
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>

      {/* Product Info */}
      <div className="flex gap-3 mb-4">
        {/* Icon placeholder */}
        <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
          <svg
            className="w-6 h-6 text-blue-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-gray-900 truncate">{item.name}</p>
          <p className="text-sm text-gray-500 truncate">{item.description}</p>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-100 my-4" />

      {/* Price breakdown */}
      <div className="space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Unit price</span>
          <span className="text-gray-900">{formatCurrency(getUnitPrice())}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Quantity</span>
          <span className="text-gray-900">{state.quantity}</span>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-200 my-4" />

      {/* Total */}
      <div className="flex justify-between items-baseline">
        <span className="text-gray-700 font-medium">Total</span>
        <span className="text-xl font-bold text-gray-900">
          {formatCurrency(getTotalPrice())}
        </span>
      </div>

      {/* Info pill */}
      <div className={cn(
        'mt-6 p-3 rounded-lg bg-blue-50 border border-blue-100',
        'flex items-start gap-2'
      )}>
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
            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
          />
        </svg>
        <p className="text-sm text-blue-700">
          After payment, the confirmation email will be sent to your inbox.
        </p>
      </div>
    </div>
  );
}
