'use client';

import { useCheckout } from '../../context/CheckoutContext';
import { FormInput } from '../ui/FormInput';

export function PlanInfoStep() {
  const { state, setPlanInfo, getCurrentStep } = useCheckout();
  const step = getCurrentStep();
  const { planInfo } = state;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-gray-900">
          {step?.number} · Plan Information
        </h2>
        <p className="text-gray-500 mt-1">
          Please provide your date of birth for plan verification.
        </p>
      </div>

      {/* DOB Field */}
      <div className="bg-gray-50 rounded-xl border border-gray-200 p-4">
        <FormInput
          label="Date of Birth"
          required
          type="date"
          value={planInfo.dateOfBirth}
          onChange={(e) => setPlanInfo({ dateOfBirth: e.target.value })}
          max={new Date().toISOString().split('T')[0]}
        />
        <p className="text-sm text-gray-500 mt-2">
          This information is required for Explorer to Traveler upgrade verification.
        </p>
      </div>
    </div>
  );
}
