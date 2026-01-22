'use client';

import { cn } from '@/lib/utils';
import { useCheckout } from '../../context/CheckoutContext';
import { FormInput } from '../ui/FormInput';
import type { CourseParticipantInfo } from '../../types';

export function CourseParticipantStep() {
  const {
    state,
    setCourseParticipant,
    usePurchaserInfoForCourseParticipant,
    getCurrentStep,
  } = useCheckout();
  const step = getCurrentStep();
  const { courseParticipants, quantity } = state;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-gray-900">
          {step?.number} · Course Participant Details
        </h2>
        <p className="text-gray-500 mt-1">
          Enter the participant&apos;s information for the in-person course.
        </p>
      </div>

      {/* Participant Forms */}
      {Array.from({ length: quantity }, (_, index) => (
        <ParticipantBlock
          key={index}
          index={index}
          participant={courseParticipants[index]}
          onUpdate={(info) => setCourseParticipant(index, info)}
          onUsePurchaserInfo={() => usePurchaserInfoForCourseParticipant(index)}
          showDivider={index < quantity - 1}
        />
      ))}
    </div>
  );
}

interface ParticipantBlockProps {
  index: number;
  participant: CourseParticipantInfo;
  onUpdate: (info: Partial<CourseParticipantInfo>) => void;
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
          <h4 className="font-medium text-gray-900">
            Course Participant {index + 1}
          </h4>
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
          label="Date of Birth"
          required
          type="date"
          value={participant.dateOfBirth}
          onChange={(e) => onUpdate({ dateOfBirth: e.target.value })}
          max={new Date().toISOString().split('T')[0]}
        />

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

        <FormInput
          label="Dietary Restrictions"
          type="text"
          value={participant.dietaryRestrictions || ''}
          onChange={(e) => onUpdate({ dietaryRestrictions: e.target.value })}
          placeholder="e.g., Vegetarian, No peanuts, etc. (optional)"
          helperText="Leave blank if no dietary restrictions."
        />
      </div>
    </div>
  );
}
