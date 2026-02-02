'use client';

import { cn } from '@/lib/utils';
import { useCheckout } from '../../context/CheckoutContext';
import { formatCurrency } from '../../types';
import { QuantitySelector } from '../ui/FormInput';

export function ConfirmCartStep() {
  const { state, setQuantity, getUnitPrice, getTotalPrice } = useCheckout();
  const item = state.items[0];

  if (!item) return null;

  const isDuo = item.type === 'duo_go' || item.type === 'duo_run' || item.type === 'duo_fly';
  const selectedPeriods = item.selectedPeriods || [];
  const periodCount = selectedPeriods.length || 1;

  // For Duo: total = price per period × number of periods × quantity
  const duoTotalPrice = isDuo ? item.price * periodCount * state.quantity : getTotalPrice();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-gray-900">1 · Confirm Cart</h2>
        <p className="text-gray-500 mt-1">
          {isDuo ? 'Review your selected Duo plan and periods.' : 'Review your selected plan and quantity.'}
        </p>
      </div>

      {/* Plan Card */}
      <div className="bg-gray-50 rounded-xl border border-gray-200 p-4">
        <div className="flex gap-4">
          {/* Icon placeholder */}
          <div className={cn(
            'w-14 h-14 rounded-lg flex items-center justify-center flex-shrink-0',
            isDuo ? 'bg-purple-100' : 'bg-blue-100'
          )}>
            <svg
              className={cn('w-7 h-7', isDuo ? 'text-purple-600' : 'text-blue-600')}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isDuo ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              )}
            </svg>
          </div>

          {/* Plan Details */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="font-semibold text-gray-900">{item.name}</h3>
                <p className="text-sm text-gray-500 mt-0.5">{item.description}</p>
              </div>
              <button
                type="button"
                className="text-sm text-blue-600 hover:text-blue-700 font-medium whitespace-nowrap"
              >
                Edit plan
              </button>
            </div>

            {/* Price */}
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-lg font-bold text-gray-900">
                {formatCurrency(item.price)}
              </span>
              {isDuo && (
                <span className="text-sm text-gray-500">
                  / {item.duoPeriodType === 'month' ? 'month' : 'quarter'}
                </span>
              )}
              {!isDuo && item.monthlyAverage && (
                <span className="text-sm text-gray-500">
                  Avg {formatCurrency(item.monthlyAverage)} / month
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Selected Periods for Duo */}
      {isDuo && selectedPeriods.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-900">
              Selected {item.duoPeriodType === 'month' ? 'Months' : 'Quarters'}
            </label>
            <button
              type="button"
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              Edit selection
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {selectedPeriods.map((period) => (
              <span
                key={period.id}
                className="inline-flex items-center px-3 py-1.5 rounded-lg bg-purple-100 text-purple-700 text-sm font-medium"
              >
                {period.label}
              </span>
            ))}
          </div>
          <p className="text-sm text-gray-500">
            {periodCount} {item.duoPeriodType === 'month' ? 'month' : 'quarter'}{periodCount > 1 ? 's' : ''} selected
          </p>
        </div>
      )}

      {/* Quantity Selector */}
      <QuantitySelector
        label="Quantity"
        helperText={isDuo ? 'Select number of Duo participants.' : 'Select number of participants.'}
        value={state.quantity}
        onChange={setQuantity}
        min={1}
        max={isDuo ? 2 : 20}
      />

      {/* Cost Preview Bar */}
      <div className={cn(
        'flex items-center justify-between',
        'bg-blue-50 border border-blue-100 rounded-lg px-4 py-3'
      )}>
        <span className="text-gray-700">
          {isDuo ? (
            <>
              {formatCurrency(item.price)} × {periodCount} {item.duoPeriodType === 'month' ? 'month' : 'quarter'}{periodCount > 1 ? 's' : ''} × {state.quantity} {state.quantity === 1 ? 'person' : 'persons'}
            </>
          ) : (
            <>
              {formatCurrency(getUnitPrice())} × {state.quantity} {state.quantity === 1 ? 'person' : 'persons'}
            </>
          )}
        </span>
        <span className="text-lg font-bold text-blue-600">
          {formatCurrency(isDuo ? duoTotalPrice : getTotalPrice())}
        </span>
      </div>
    </div>
  );
}
