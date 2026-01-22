'use client';

import { cn } from '@/lib/utils';
import { useCheckout } from '../../context/CheckoutContext';
import { FormInput } from '../ui/FormInput';
import type { ParticipantInfo } from '../../types';

export function ParticipantInfoStep() {
  const {
    state,
    setParticipant,
    usePurchaserInfoForParticipant,
    getCurrentStep,
  } = useCheckout();
  const step = getCurrentStep();
  const { participants, quantity } = state;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-gray-900">
          {step?.number} · Participant Information
        </h2>
        <p className="text-gray-500 mt-1">
          Enter the participant&apos;s basic information.
        </p>
      </div>

      {/* Participant Forms */}
      {Array.from({ length: quantity }, (_, index) => (
        <ParticipantBlock
          key={index}
          index={index}
          participant={participants[index]}
          onUpdate={(info) => setParticipant(index, info)}
          onUsePurchaserInfo={() => usePurchaserInfoForParticipant(index)}
          showDivider={index < quantity - 1}
        />
      ))}
    </div>
  );
}

interface ParticipantBlockProps {
  index: number;
  participant: ParticipantInfo;
  onUpdate: (info: Partial<ParticipantInfo>) => void;
  onUsePurchaserInfo: () => void;
  showDivider: boolean;
}

function ParticipantBlock({
  index,
  participant,
  onUpdate,
  onUsePurchaserInfo,
  showDivider,
}: ParticipantBlockProps) {
  return (
    <div className={cn(showDivider && 'pb-6 border-b border-gray-200')}>
      <div className="bg-gray-50 rounded-xl border border-gray-200 p-4 space-y-4">
        {/* Section Header */}
        <div className="flex items-center justify-between">
          <h4 className="font-medium text-gray-900">Participant {index + 1}</h4>
          <button
            type="button"
            onClick={onUsePurchaserInfo}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            Use purchaser info
          </button>
        </div>

        {/* Form Fields */}
        <FormInput
          label="Full Name"
          required
          type="text"
          value={participant.fullName}
          onChange={(e) => onUpdate({ fullName: e.target.value })}
          placeholder="Enter full name"
        />

        <FormInput
          label="Email"
          required
          type="email"
          value={participant.email}
          onChange={(e) => onUpdate({ email: e.target.value })}
          placeholder="email@example.com"
        />

        <FormInput
          label="Mobile Phone"
          required
          type="tel"
          value={participant.phone}
          onChange={(e) => onUpdate({ phone: e.target.value })}
          placeholder="0912 345 678"
        />
      </div>
    </div>
  );
}
