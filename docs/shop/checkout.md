# Checkout System

Complete multi-step checkout flow with dynamic steps based on cart contents.

## Overview

The checkout system is a modal-based experience featuring:
- **Horizontal stepper** with dynamic steps
- **Two-column layout** (form + order summary)
- **Conditional steps** based on product types
- **Form validation** with real-time feedback
- **Auto-focus** behavior for credit card inputs

## Architecture

### File Structure

```
src/features/checkout/
├── index.ts                    # Public exports
├── types.ts                    # TypeScript interfaces & validation
├── context/
│   ├── index.ts
│   └── CheckoutContext.tsx     # State management (useReducer)
└── components/
    ├── index.ts
    ├── CheckoutModal.tsx       # Main modal container
    ├── ui/
    │   ├── index.ts
    │   ├── FormInput.tsx       # Input, RadioCard, Checkbox, QuantitySelector
    │   ├── Stepper.tsx         # Progress indicator
    │   └── OrderSummary.tsx    # Right column summary
    └── steps/
        ├── index.ts
        ├── ConfirmCartStep.tsx       # Step 1: Always
        ├── PurchaserInfoStep.tsx     # Step 2: Always
        ├── PaymentInfoStep.tsx       # Step 3: Always
        ├── PlanInfoStep.tsx          # Conditional: Explorer upgrade
        ├── CourseParticipantStep.tsx # Conditional: Physical course
        ├── DeliveryInfoStep.tsx      # Conditional: Merchandise
        ├── ParticipantInfoStep.tsx   # Conditional: Digital plans
        └── ReviewStep.tsx            # Final: Always
```

## Product Types

| Type | Description | Period Selection | Special Steps |
|------|-------------|------------------|---------------|
| `digital_plan` | Subscription plan | None | Participant Info |
| `duo_go` | Duo Go membership | Monthly | Participant Info |
| `duo_run` | Duo Run membership | Quarterly | Participant Info |
| `duo_fly` | Duo Fly membership | Quarterly | Participant Info |
| `explorer_upgrade` | Explorer→Traveler | None | Plan Info (DOB) |
| `physical_course` | In-person course | None | Course Participant Details |
| `merchandise` | Physical goods | None | Delivery Info (7-ELEVEN) |

## Duo Products

Duo products allow users to select specific time periods:

### Duo Go (Monthly)
- Users select specific **months** (can select multiple)
- Price: per month × selected months × quantity
- Example: NT$1,200/month × 3 months × 2 persons = NT$7,200

### Duo Run (Quarterly)
- Users select specific **quarters** (2026 Q1, Q2, Q3, Q4...)
- Price: per quarter × selected quarters × quantity
- Example: NT$3,200/quarter × 2 quarters × 2 persons = NT$12,800

### Duo Fly (Quarterly)
- Users select specific **quarters** (like Duo Run)
- Premium tier with all features
- Price: per quarter × selected quarters × quantity

### CartItem Structure for Duo

```typescript
interface CartItem {
  id: string;
  name: string;
  description: string;
  price: number;              // Price per period
  quantity: number;           // Number of participants (max 2)
  type: 'duo_go' | 'duo_run' | 'duo_fly';
  duoPeriodType: 'month' | 'quarter';
  selectedPeriods: DuoPeriod[];
}

interface DuoPeriod {
  id: string;           // e.g., "2026-01" or "2026-q1"
  label: string;        // e.g., "January 2026" or "2026 Q1"
  year: number;
  month?: number;       // 1-12 for monthly
  quarter?: number;     // 1-4 for quarterly
}
```

## Checkout Steps

### Base Steps (Always Present)

1. **Confirm Cart** - Review plan, adjust quantity
2. **Purchaser Information** - Contact details, invoice type
3. **Payment Information** - Credit card or ATM transfer
4. **Review** - Final confirmation with terms

### Conditional Steps

| Condition | Step Added | Position |
|-----------|------------|----------|
| Explorer upgrade (NOT Duo) | Plan Information | After Payment |
| Physical course | Course Participant Details | After Payment/Plan |
| Merchandise | Delivery Information | After Course |
| Digital plan (any) | Participant Information | Before Review |

### Step Order (when all present)

1. Confirm Cart
2. Purchaser Information
3. Payment Information
4. Plan Information *(Explorer upgrade only)*
5. Course Participant Details *(Physical course only)*
6. Delivery Information *(Merchandise only)*
7. Participant Information *(Digital plans)*
8. Review

## Usage

### Basic Usage

```tsx
import { CheckoutModal } from '@/features/checkout';

function MyComponent() {
  const [isOpen, setIsOpen] = useState(false);

  const cartItems = [
    {
      id: 'plan-001',
      name: 'Traveler Annual Plan',
      description: '12-month membership',
      price: 9600,
      quantity: 1,
      type: 'digital_plan',
    },
  ];

  return (
    <>
      <button onClick={() => setIsOpen(true)}>Checkout</button>
      <CheckoutModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        items={cartItems}
        onPlaceOrder={() => {
          console.log('Order placed!');
          setIsOpen(false);
        }}
      />
    </>
  );
}
```

### Duo Product Example

```tsx
const duoGoItem = {
  id: 'duo-go-001',
  name: 'Duo Go',
  description: 'Monthly duo membership',
  price: 1200,
  quantity: 2,
  type: 'duo_go',
  duoPeriodType: 'month',
  selectedPeriods: [
    { id: '2026-01', label: 'January 2026', year: 2026, month: 1 },
    { id: '2026-02', label: 'February 2026', year: 2026, month: 2 },
    { id: '2026-03', label: 'March 2026', year: 2026, month: 3 },
  ],
};
```

## Form Components

### FormInput

```tsx
<FormInput
  label="Email"
  required
  type="email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  placeholder="email@example.com"
  helperText="Order confirmation will be sent here."
  error={emailError}
/>
```

### RadioCardGroup

```tsx
<RadioCardGroup
  name="payment-method"
  value={paymentMethod}
  onChange={setPaymentMethod}
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
```

### QuantitySelector

```tsx
<QuantitySelector
  label="Quantity"
  helperText="Select number of participants."
  value={quantity}
  onChange={setQuantity}
  min={1}
  max={20}
/>
```

## Validation

### Field Validation Rules

| Field | Rules |
|-------|-------|
| Full Name | Required, non-empty |
| Email | Required, valid email format |
| Phone | Required, 8-15 digits |
| VAT Number | Required if company, exactly 8 digits |
| Card Number | Required if credit card, 13-19 digits |
| Expiry Date | Required if credit card, MM/YY format, not expired |
| CVC | Required if credit card, 3-4 digits |
| Date of Birth | Required where applicable, valid date |
| Store Selection | Required for merchandise |
| Terms Agreement | Required on review step |

### Validation Functions

```typescript
import {
  isValidEmail,
  isValidPhone,
  isValidVatNumber,
  isValidCardNumber,
  isValidExpiryDate,
  isValidCvc,
  isValidDateOfBirth,
} from '@/features/checkout/types';
```

## Payment Methods

### Credit Card

- Auto-focus: Card Number → Expiry → CVC
- Card number formatting: `0000 0000 0000 0000`
- Expiry formatting: `MM/YY`
- Numeric keyboard on mobile (`inputMode="numeric"`)

### ATM Bank Transfer

Displays bank details:
- Bank: Bank of Taiwan (004)
- Branch: Longtan Branch (2260)
- Account: Nuva Co., Ltd.
- Account Number: 22600 1009 861

Warning notes about 72-hour transfer deadline.

## State Management

### CheckoutContext

```typescript
const {
  state,
  goToStep,
  goToNextStep,
  goToPreviousStep,
  setQuantity,
  setPurchaserInfo,
  setPaymentInfo,
  setParticipant,
  isCurrentStepValid,
  getTotalPrice,
  getCurrentStep,
  isFirstStep,
  isLastStep,
} = useCheckout();
```

### State Structure

```typescript
interface CheckoutState {
  items: CartItem[];
  quantity: number;
  purchaserInfo: PurchaserInfo;
  paymentInfo: PaymentInfo;
  planInfo: PlanInfo;
  participants: ParticipantInfo[];
  courseParticipants: CourseParticipantInfo[];
  deliveryInfo: DeliveryInfo;
  currentStepIndex: number;
  steps: CheckoutStep[];
  completedSteps: Set<CheckoutStepId>;
  agreedToTerms: boolean;
}
```

## Demo Page

Visit `/checkout-demo` to test different scenarios:

- **Digital Plan** - Standard 5-step flow
- **Duo Go** - Monthly selection with 3 months
- **Duo Run** - Quarterly selection with 2 quarters
- **Duo Fly** - Quarterly premium with 1 quarter
- **Explorer Upgrade** - Includes Plan Info (DOB) step
- **Physical Course** - Includes Course Participant Details
- **Merchandise** - Includes Delivery with 7-ELEVEN selector

## Currency

All prices use **NT$** format:
- Display: `NT$9,600`
- Use `formatCurrency(amount)` helper

```typescript
import { formatCurrency } from '@/features/checkout/types';

formatCurrency(9600); // "NT$9,600"
```
