'use client';

import { useCheckout } from '../../context/CheckoutContext';
import { FormInput, RadioCardGroup } from '../ui/FormInput';

export function PurchaserInfoStep() {
  const { state, setPurchaserInfo, getCurrentStep } = useCheckout();
  const step = getCurrentStep();
  const { purchaserInfo } = state;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-gray-900">
          {step?.number} · Purchaser Information
        </h2>
        <p className="text-gray-500 mt-1">Enter the purchaser&apos;s contact details.</p>
      </div>

      {/* Contact Fields */}
      <div className="space-y-4">
        <FormInput
          label="Full Name"
          required
          type="text"
          value={purchaserInfo.fullName}
          onChange={(e) => setPurchaserInfo({ fullName: e.target.value })}
          placeholder="Enter your full name"
        />

        <FormInput
          label="Email"
          required
          type="email"
          value={purchaserInfo.email}
          onChange={(e) => setPurchaserInfo({ email: e.target.value })}
          placeholder="email@example.com"
          helperText="Order confirmation will be sent to this email."
        />

        <FormInput
          label="Mobile Phone"
          required
          type="tel"
          value={purchaserInfo.phone}
          onChange={(e) => setPurchaserInfo({ phone: e.target.value })}
          placeholder="0912 345 678"
        />
      </div>

      {/* Invoice Type Section */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-gray-700">
          Invoice Type<span className="text-red-500 ml-0.5">*</span>
        </label>
        <RadioCardGroup
          name="invoice-type"
          value={purchaserInfo.invoiceType}
          onChange={(value) =>
            setPurchaserInfo({ invoiceType: value as 'personal' | 'company' })
          }
          options={[
            {
              value: 'personal',
              title: 'Personal (2-part invoice)',
              subtitle: 'E-invoice will be sent to your email.',
            },
            {
              value: 'company',
              title: 'Company (3-part invoice)',
              subtitle: 'Requires VAT number and company name.',
            },
          ]}
        />
      </div>

      {/* Company Invoice Details (conditional) */}
      {purchaserInfo.invoiceType === 'company' && (
        <div className="bg-gray-50 rounded-xl border border-gray-200 p-4 space-y-4">
          <h4 className="font-medium text-gray-900">Company Invoice Details</h4>
          <FormInput
            label="VAT Number"
            required
            type="text"
            value={purchaserInfo.companyVatNumber || ''}
            onChange={(e) =>
              setPurchaserInfo({ companyVatNumber: e.target.value.replace(/\D/g, '').slice(0, 8) })
            }
            placeholder="12345678"
            maxLength={8}
          />
          <FormInput
            label="Company Name"
            required
            type="text"
            value={purchaserInfo.companyName || ''}
            onChange={(e) => setPurchaserInfo({ companyName: e.target.value })}
            placeholder="Company name"
          />
        </div>
      )}
    </div>
  );
}
