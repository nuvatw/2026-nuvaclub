'use client';

import { cn } from '@/lib/utils';
import { useCheckout } from '../../context/CheckoutContext';
import { formatCurrency } from '../../types';
import { Checkbox } from '../ui/FormInput';

export function ReviewStep() {
  const { state, goToStep, setAgreedToTerms, getUnitPrice, getTotalPrice, getCurrentStep } = useCheckout();
  const step = getCurrentStep();
  const {
    items,
    quantity,
    purchaserInfo,
    paymentInfo,
    participants,
    courseParticipants,
    deliveryInfo,
    agreedToTerms,
    steps,
  } = state;

  const item = items[0];
  const hasParticipantStep = steps.some((s) => s.id === 'participant_info');
  const hasCourseStep = steps.some((s) => s.id === 'course_participant_details');
  const hasDeliveryStep = steps.some((s) => s.id === 'delivery_info');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-gray-900">{step?.number} · Review</h2>
        <p className="text-gray-500 mt-1">
          Please confirm the details below before placing your order.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="space-y-4">
        {/* Plan Summary */}
        <SummaryCard
          title="Plan"
          onChangeClick={() => goToStep('confirm_cart')}
        >
          <p className="text-gray-900 font-medium">{item?.name}</p>
          <p className="text-sm text-gray-500 mt-1">
            {quantity} {quantity === 1 ? 'person' : 'persons'} × {formatCurrency(getUnitPrice())}
          </p>
          <p className="text-blue-600 font-semibold mt-2">
            {formatCurrency(getTotalPrice())}
          </p>
        </SummaryCard>

        {/* Purchaser Summary */}
        <SummaryCard
          title="Purchaser"
          onChangeClick={() => goToStep('purchaser_info')}
        >
          <p className="text-gray-900">{purchaserInfo.fullName}</p>
          <p className="text-sm text-gray-500">{purchaserInfo.email}</p>
          <p className="text-sm text-gray-500">{purchaserInfo.phone}</p>
          {purchaserInfo.invoiceType === 'company' && (
            <p className="text-sm text-gray-500 mt-1">
              Company: {purchaserInfo.companyName} ({purchaserInfo.companyVatNumber})
            </p>
          )}
        </SummaryCard>

        {/* Payment Method Summary */}
        <SummaryCard
          title="Payment Method"
          onChangeClick={() => goToStep('payment_info')}
        >
          <p className="text-gray-900">
            {paymentInfo.method === 'credit_card'
              ? 'Credit / Debit Card'
              : 'ATM Bank Transfer'}
          </p>
          {paymentInfo.method === 'credit_card' && paymentInfo.cardDetails && (
            <p className="text-sm text-gray-500 mt-1">
              •••• •••• •••• {paymentInfo.cardDetails.cardNumber.slice(-4)}
            </p>
          )}
        </SummaryCard>

        {/* Course Participants Summary (if applicable) */}
        {hasCourseStep && courseParticipants.length > 0 && (
          <SummaryCard
            title="Course Participants"
            onChangeClick={() => goToStep('course_participant_details')}
          >
            {courseParticipants.map((p, i) => (
              <div key={i} className={cn(i > 0 && 'mt-3 pt-3 border-t border-gray-100')}>
                <p className="text-gray-900">Course Participant {i + 1}: {p.fullName}</p>
                <p className="text-sm text-gray-500">{p.email}</p>
                {p.dietaryRestrictions && (
                  <p className="text-sm text-gray-500">Diet: {p.dietaryRestrictions}</p>
                )}
              </div>
            ))}
          </SummaryCard>
        )}

        {/* Delivery Summary (if applicable) */}
        {hasDeliveryStep && deliveryInfo.storeId && (
          <SummaryCard
            title="Delivery"
            onChangeClick={() => goToStep('delivery_info')}
          >
            <p className="text-gray-900">{deliveryInfo.fullName}</p>
            <p className="text-sm text-gray-500">{deliveryInfo.email}</p>
            <p className="text-sm text-gray-500 mt-2">
              <span className="font-medium">Pickup:</span> {deliveryInfo.storeName}
            </p>
            <p className="text-sm text-gray-500">{deliveryInfo.storeAddress}</p>
          </SummaryCard>
        )}

        {/* Participants Summary (if applicable) */}
        {hasParticipantStep && participants.length > 0 && (
          <SummaryCard
            title="Participants"
            onChangeClick={() => goToStep('participant_info')}
          >
            {participants.map((p, i) => (
              <div key={i} className={cn(i > 0 && 'mt-3 pt-3 border-t border-gray-100')}>
                <p className="text-gray-900">Participant {i + 1}: {p.fullName}</p>
                <p className="text-sm text-gray-500">{p.email}</p>
              </div>
            ))}
          </SummaryCard>
        )}
      </div>

      {/* Terms Checkbox */}
      <div className="pt-4 border-t border-gray-200">
        <Checkbox
          id="agree-terms"
          checked={agreedToTerms}
          onChange={setAgreedToTerms}
          label={
            <span className="text-gray-700">
              I have read and agree to the{' '}
              <a
                href="/terms"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-700 underline"
              >
                Terms &amp; Conditions
              </a>
            </span>
          }
        />
      </div>
    </div>
  );
}

interface SummaryCardProps {
  title: string;
  onChangeClick: () => void;
  children: React.ReactNode;
}

function SummaryCard({ title, onChangeClick, children }: SummaryCardProps) {
  return (
    <div className="bg-gray-50 rounded-xl border border-gray-200 p-4">
      <div className="flex items-start justify-between mb-2">
        <h4 className="font-medium text-gray-700">{title}</h4>
        <button
          type="button"
          onClick={onChangeClick}
          className="text-sm text-blue-600 hover:text-blue-700 font-medium"
        >
          Change
        </button>
      </div>
      {children}
    </div>
  );
}
