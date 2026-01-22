# Nuva's Checkout Modal - PRD Execution Plan

> **STATUS: IMPLEMENTED** - This checkout system has been fully built in `src/features/checkout/`.
> See [checkout.md](./shop/checkout.md) for current documentation.

## Executive Summary

This document outlines the complete implementation plan for building Nuva's multi-step checkout modal. The checkout will be a **modal-based** experience with **dynamic steps** based on cart contents, featuring a **horizontal stepper**, **two-column layout**, and comprehensive form validation.

---

## 1. Current State Analysis

### 1.1 Implementation Status

| Component | Status | Location |
|-----------|--------|----------|
| Cart Provider | ✅ Working | `/src/features/shop/components/cart/CartProvider.tsx` |
| Cart Drawer | ✅ Working | `/src/features/shop/components/cart/CartDrawer.tsx` |
| Cart Item | ✅ Working | `/src/features/shop/components/cart/CartItem.tsx` |
| Checkout Modal | ✅ **Implemented** | `/src/features/checkout/components/CheckoutModal.tsx` |
| Checkout Page | ✅ **Implemented** | `/src/app/(public)/checkout/page.tsx` |
| Checkout Demo | ✅ **Implemented** | `/src/app/checkout-demo/page.tsx` |

### 1.2 Resolved Problems

All previously identified issues have been addressed:

1. ~~Single-page flow~~ → ✅ Multi-step wizard with dynamic steps
2. ~~No customer information~~ → ✅ Purchaser info step with name, email, phone
3. ~~No payment selection~~ → ✅ Credit card and ATM transfer options
4. ~~No conditional steps~~ → ✅ Steps vary based on product type
5. ~~No form validation~~ → ✅ Real-time validation with error messages
6. ~~No modal implementation~~ → ✅ Can be used as modal or full page
7. ~~Price format wrong~~ → ✅ Uses `NT$` format throughout

### 1.3 Product Types & Conditional Logic

| Product Type | Type Value | Period Selection | Special Step Required |
|--------------|------------|------------------|----------------------|
| Digital Plan | `digital_plan` | None | Participant Info |
| Duo Go | `duo_go` | Monthly | Participant Info |
| Duo Run | `duo_run` | Quarterly | Participant Info |
| Duo Fly | `duo_fly` | Quarterly | Participant Info |
| Explorer Upgrade | `explorer_upgrade` | None | Plan Info (DOB) |
| Physical Course | `physical_course` | None | Course Participant Details |
| Merchandise | `merchandise` | None | Delivery Info (7-ELEVEN) |

---

## 2. Target Architecture

### 2.1 File Structure (Implemented)

```
/src/features/checkout/
├── index.ts                          # Public exports
├── types.ts                          # TypeScript interfaces & validation
├── context/
│   ├── index.ts
│   └── CheckoutContext.tsx           # State management (useReducer)
└── components/
    ├── index.ts
    ├── CheckoutModal.tsx             # Main modal container
    ├── ui/
    │   ├── index.ts
    │   ├── FormInput.tsx             # Input, RadioCard, Checkbox, QuantitySelector
    │   ├── Stepper.tsx               # Horizontal progress indicator
    │   └── OrderSummary.tsx          # Right column summary
    └── steps/
        ├── index.ts
        ├── ConfirmCartStep.tsx       # Step 1: Always present
        ├── PurchaserInfoStep.tsx     # Step 2: Always present
        ├── PaymentInfoStep.tsx       # Step 3: Always present (auto-focus enabled)
        ├── PlanInfoStep.tsx          # Conditional: Explorer upgrade (NOT Duo)
        ├── CourseParticipantStep.tsx # Conditional: Physical course
        ├── DeliveryInfoStep.tsx      # Conditional: Merchandise
        ├── ParticipantInfoStep.tsx   # Conditional: Digital plans
        └── ReviewStep.tsx            # Final: Always present
```

### 2.2 State Management

```typescript
// /src/features/shop/components/checkout/types.ts

export type CheckoutStepId =
  | 'confirm-cart'
  | 'purchaser-info'
  | 'payment-info'
  | 'plan-info'
  | 'course-participant'
  | 'delivery-info'
  | 'participant-info'
  | 'review';

export interface CheckoutStep {
  id: CheckoutStepId;
  label: string;
  component: React.ComponentType<StepProps>;
  isRequired: (cart: Cart, form: CheckoutFormData) => boolean;
}

export interface CheckoutFormData {
  // Purchaser
  purchaserName: string;
  purchaserEmail: string;
  purchaserPhone: string;

  // Invoice
  invoiceType: 'personal' | 'company';
  vatNumber?: string;
  companyName?: string;

  // Payment
  paymentMethod: 'credit-card' | 'atm-transfer';
  cardholderName?: string;
  cardNumber?: string;
  expiryDate?: string;
  cvc?: string;

  // Plan Info (for Traveler upgrade)
  dateOfBirth?: string;

  // Participants (for quantity-based)
  participants: ParticipantInfo[];

  // Course Participants (for in-person events)
  courseParticipants: CourseParticipantInfo[];

  // Delivery (for merchandise)
  deliveryRecipient: {
    name: string;
    email: string;
    phone: string;
  };
  selectedStore?: SevenElevenStore;

  // Terms
  agreedToTerms: boolean;
}

export interface ParticipantInfo {
  name: string;
  email: string;
  phone: string;
}

export interface CourseParticipantInfo extends ParticipantInfo {
  dateOfBirth: string;
  dietaryRestrictions?: string;
}

export interface SevenElevenStore {
  id: string;
  name: string;
  address: string;
}
```

---

## 3. Component Specifications

### 3.1 CheckoutModal (Container)

**Purpose:** Main modal wrapper that orchestrates the checkout flow

```typescript
interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}
```

**Layout Structure:**
```
┌─────────────────────────────────────────────────────────┐
│  nuva                   Checkout                    [X] │  ← Top bar
├─────────────────────────────────────────────────────────┤
│  ① ─── ② ─── ③ ─── ④ ─── ⑤                             │  ← Stepper
├───────────────────────────────────┬─────────────────────┤
│                                   │                     │
│     LEFT COLUMN                   │   RIGHT COLUMN      │
│     (Form Content)                │   (Order Summary)   │
│                                   │                     │
│     [ Step Content Here ]         │   Plan Name         │
│                                   │   Description       │
│                                   │   ─────────────     │
│                                   │   Unit price        │
│                                   │   Quantity          │
│                                   │   ─────────────     │
│                                   │   Total: NT$9,600   │
│                                   │                     │
│                                   │   [info pill]       │
├───────────────────────────────────┴─────────────────────┤
│  [Back]                                     [Continue]  │  ← Navigation
└─────────────────────────────────────────────────────────┘
```

**Styling:**
- Modal: `max-w-4xl` or custom width ~900px
- Background: Light gray page background (`bg-neutral-100` or similar)
- Modal container: White background with rounded corners
- Two-column grid: `grid-cols-[1fr_320px]` on desktop, stack on mobile

### 3.2 CheckoutStepper

**Purpose:** Horizontal progress indicator with dynamic steps

**Visual States:**
| State | Circle | Line |
|-------|--------|------|
| Completed | Blue bg + white checkmark | Blue line |
| Active | Blue bg + white number | Gray line |
| Upcoming | Gray bg + gray number | Gray line |

**Implementation Notes:**
- Steps are dynamically generated based on cart contents
- Must support 3-8 steps depending on products
- Circle size: `w-8 h-8`
- Label below each circle
- Connecting lines between circles

### 3.3 CheckoutOrderSummary (Right Column)

**Purpose:** Persistent order summary visible on all steps

**Content Structure:**
```
Order Summary
─────────────
[Icon] Product Name (bold)
       Short description

Unit price         NT$9,600
Quantity           1
─────────────────────────
Total              NT$9,600 (bold, large)

┌─────────────────────────────────┐
│ ℹ After payment, the           │
│   confirmation email will be    │
│   sent to your inbox.           │
└─────────────────────────────────┘
```

**Styling:**
- Card: White background, rounded corners, shadow
- Info pill: Light blue background tint (`bg-blue-50`)
- Currency format: `NT$X,XXX` (always use NT$)

### 3.4 CheckoutNavigation

**Purpose:** Bottom navigation with Back/Continue buttons

**Behavior:**
| Step | Left Button | Right Button |
|------|-------------|--------------|
| Step 1 | None | Continue |
| Steps 2-N-1 | Back | Continue |
| Final Step | Back | Place Order |

**Button States:**
- Continue/Place Order: Primary blue, disabled until step is valid
- Back: Text button (ghost/link style)

---

## 4. Step Specifications

### 4.1 Step 1: Confirm Cart (Always Present)

**Header:** "1 · Confirm Cart"
**Subheader:** "Review your selected plan and quantity."

**Content:**
```
┌─────────────────────────────────────────────────────┐
│ [Icon]  Plan Name                     "Edit plan" → │
│         Description text                            │
│         NT$9,600  Avg NT$800 / month               │
└─────────────────────────────────────────────────────┘

Quantity
Select number of participants.
[ - ]  1  [ + ]

┌─────────────────────────────────────────────────────┐
│ NT$9,600 × 1 person              NT$9,600 (blue)   │
└─────────────────────────────────────────────────────┘
```

**Validation:**
- Quantity must be ≥ 1

### 4.2 Step 2: Purchaser Information (Always Present)

**Header:** "2 · Purchaser Information"
**Subheader:** "Enter the purchaser's contact details."

**Fields:**
| Field | Type | Required | Validation |
|-------|------|----------|------------|
| Full Name | text | Yes* | Min 2 chars |
| Email | email | Yes* | Valid email format |
| Mobile Phone | tel | Yes* | Digits + separators |

**Helper Text:** "Order confirmation will be sent to this email."

**Invoice Type (Radio Cards):**
- Option A (default): "Personal (2-part invoice)" - "E-invoice will be sent to your email."
- Option B: "Company (3-part invoice)" - "Requires VAT number and company name."

**Company Invoice Fields (shown when Option B selected):**
| Field | Type | Required | Validation |
|-------|------|----------|------------|
| VAT Number | text | Yes* | Exactly 8 digits |
| Company Name | text | Yes* | Min 2 chars |

### 4.3 Step 3: Payment Information (Always Present)

**Header:** "3 · Payment Information"
**Subheader:** "Choose your payment method and enter details."

**Payment Method (Radio Cards):**
- Option A (default): "Credit / Debit Card" - "Pay instantly."
- Option B: "ATM Bank Transfer" - "Complete payment within 3 days."

**Credit Card Fields (shown when Option A selected):**
```
Card Details
─────────────
Cardholder Name*    [Same as on card        ]
Card Number*        [0000 0000 0000 0000    ]
Expiry (MM/YY)*     [MM/YY]    CVC*  [•••]

┌─────────────────────────────────────────────────────┐
│ ✉ The e-invoice will be emailed after successful   │
│   payment.                                          │
└─────────────────────────────────────────────────────┘
```

**ATM Transfer Details (shown when Option B selected):**
```
Bank Account Details
────────────────────
Bank Name      Bank of Taiwan (004)
Branch         Longtan Branch (2260)
Bank Code      0042260
Account Name   Nuva Co., Ltd.
Account Number 22600 1009 861

⚠ Transfer Notes
─────────────────
• Please complete the transfer within 72 hours after
  placing the order. Orders will be canceled after
  the deadline.
• We recommend taking a screenshot of the bank
  details above.
• After placing the order, the transfer details will
  also be sent to your email.
```

### 4.4 Step: Plan Information (Conditional - Explorer→Traveler)

**Trigger:** Cart contains `plan-traveler` upgrade
**NOT shown for:** Duo Ticket purchases

**Header:** "4 · Plan Information"
**Subheader:** "Provide additional information for your subscription."

**Fields:**
| Field | Type | Required | Validation |
|-------|------|----------|------------|
| Date of Birth | date | Yes* | Valid date, user must be 13+ |

### 4.5 Step: Course Participant Details (Conditional - In-person Events)

**Trigger:** Cart contains any `event` with `eventType: 'in-person'`

**Header:** "X · Course Participant Details"
**Subheader:** "Enter the participant's information for the course."

**For each participant (based on quantity):**
```
Course Participant 1            "Use purchaser info" →
─────────────────────────────────────────────────────
Full Name*          [                              ]
Email*              [                              ]
Mobile Phone*       [                              ]
Date of Birth*      [                              ]
Dietary Restrictions [                             ] (optional)
```

**"Use purchaser info"** auto-fills: name, email, phone (NOT DOB)

### 4.6 Step: Delivery Information (Conditional - Merchandise)

**Trigger:** Cart contains any `merchandise` item

**Header:** "X · Delivery Information"
**Subheader:** "Enter shipping details for your merchandise."

**Recipient Fields:**
| Field | Type | Required |
|-------|------|----------|
| Full Name | text | Yes* |
| Email | email | Yes* |
| Mobile Phone | tel | Yes* |

**"Use purchaser info"** link available

**Shipping Method:**
- Only option: "7-ELEVEN Store Pickup" (radio, pre-selected)

**Store Selection:**
```
7-ELEVEN Store*
[ Select 7-ELEVEN store ]  ← Opens store selector

When selected:
┌─────────────────────────────────────────────────────┐
│ ✓ 7-ELEVEN Xinyi Branch                            │
│   Store #123456 · No. 100, Xinyi Rd, Taipei       │
└─────────────────────────────────────────────────────┘
```

### 4.7 Step: Participant Information (Conditional - Quantity > 1)

**Trigger:** Quantity-based products where each unit needs participant info

**Header:** "X · Participant Information"
**Subheader:** "Enter the participant's basic information."

**For each participant:**
```
Participant 1                   "Use purchaser info" →
─────────────────────────────────────────────────────
Full Name*          [                              ]
Email*              [                              ]
Mobile Phone*       [                              ]
```

### 4.8 Final Step: Review & Confirm (Always Present)

**Header:** "X · Review"
**Subheader:** "Please confirm the details below before placing your order."

**Summary Cards:**
```
┌─────────────────────────────────────────────────────┐
│ Plan                                    "Change" → │
│ Traveler                                           │
│ 1 person × NT$9,600                               │
│ NT$9,600 (blue)                                    │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│ Purchaser                               "Change" → │
│ John Doe                                           │
│ john@example.com                                   │
│ +886 912 345 678                                   │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│ Payment Method                          "Change" → │
│ ATM Bank Transfer                                  │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│ Participants                            "Change" → │
│ Participant 1: John Doe                            │
│ john@example.com                                   │
└─────────────────────────────────────────────────────┘
```

**Terms Checkbox:**
```
[ ] I have read and agree to the Terms & Conditions ←(link)
```

**Final Button:** "Place Order" (disabled until terms checked)

---

## 5. Step Flow Logic

### 5.1 Dynamic Step Calculation

```typescript
function getCheckoutSteps(cart: Cart): CheckoutStep[] {
  const steps: CheckoutStep[] = [
    { id: 'confirm-cart', label: 'Confirm Cart', always: true },
    { id: 'purchaser-info', label: 'Purchaser Information', always: true },
    { id: 'payment-info', label: 'Payment Information', always: true },
  ];

  // Check for Traveler upgrade (NOT for duo-tickets)
  const hasTravelerUpgrade = cart.items.some(
    item => item.productType === 'plan' && item.productId === 'plan-traveler'
  );
  const hasDuoTicket = cart.items.some(
    item => item.productType === 'duo-ticket'
  );

  if (hasTravelerUpgrade && !hasDuoTicket) {
    steps.push({ id: 'plan-info', label: 'Plan Information' });
  }

  // Check for in-person course
  const hasInPersonCourse = cart.items.some(
    item => item.productType === 'event' && item.eventType === 'in-person'
  );

  if (hasInPersonCourse) {
    steps.push({ id: 'course-participant', label: 'Course Participant Details' });
  }

  // Check for merchandise
  const hasMerchandise = cart.items.some(
    item => item.productType === 'merchandise'
  );

  if (hasMerchandise) {
    steps.push({ id: 'delivery-info', label: 'Delivery Information' });
  }

  // Check for participant info (if product requires per-person details)
  const needsParticipantInfo = cart.items.some(
    item => item.quantity > 1 && requiresParticipantInfo(item)
  );

  if (needsParticipantInfo) {
    steps.push({ id: 'participant-info', label: 'Participant Information' });
  }

  // Always end with review
  steps.push({ id: 'review', label: 'Review' });

  return steps;
}
```

### 5.2 Step Order Priority

When multiple conditional steps are present, follow this order:

1. Confirm Cart
2. Purchaser Information
3. Payment Information
4. Plan Information *(if Explorer→Traveler upgrade)*
5. Course Participant Details *(if in-person event)*
6. Delivery Information *(if merchandise)*
7. Participant Information *(if quantity-based)*
8. Review

---

## 6. Implementation Phases

> **All phases completed.** Implementation located at `/src/features/checkout/`.

### Phase 1: Foundation ✅ COMPLETE

**Goal:** Basic checkout modal structure with navigation

- ✅ Created `/src/features/checkout/` directory structure
- ✅ Implemented `CheckoutModal.tsx` with two-column layout
- ✅ Implemented `Stepper.tsx` for progress indicator
- ✅ Implemented `OrderSummary.tsx`
- ✅ Created `types.ts` with all TypeScript interfaces
- ✅ Created `CheckoutContext.tsx` for state management

### Phase 2: Core Steps ✅ COMPLETE

**Goal:** Implement the 3 base steps that always appear

- ✅ Implemented `ConfirmCartStep.tsx` with quantity selector
- ✅ Implemented `PurchaserInfoStep.tsx` with form fields
- ✅ Implemented `PaymentInfoStep.tsx` with payment method selection
- ✅ State management via `useReducer` in CheckoutContext
- ✅ Validation helpers in `types.ts`

### Phase 3: Review & Order Placement ✅ COMPLETE

**Goal:** Complete the checkout flow with review and order submission

- ✅ Implemented `ReviewStep.tsx` with summary cards
- ✅ Added "Change" link navigation (jump to specific step)
- ✅ Implemented terms checkbox
- ✅ Order placement with callback

### Phase 4: Conditional Steps ✅ COMPLETE

**Goal:** Add dynamic steps based on cart contents

- ✅ Dynamic step calculation in `calculateSteps()` function
- ✅ Implemented `PlanInfoStep.tsx` (DOB for Explorer upgrade)
- ✅ Implemented `CourseParticipantStep.tsx` (physical courses)
- ✅ Implemented `DeliveryInfoStep.tsx` (merchandise with 7-ELEVEN)
- ✅ Implemented `ParticipantInfoStep.tsx` (digital plans)
- ✅ Stepper dynamically shows correct step count

### Phase 5: Polish & Edge Cases ✅ COMPLETE

**Goal:** Handle all edge cases and improve UX

- ✅ Form autofill for "Use purchaser info" buttons
- ✅ Credit card number formatting (auto-spacing)
- ✅ Expiry date formatting (auto-slash)
- ✅ Auto-focus: Card Number → Expiry → CVC
- ✅ Keyboard navigation (Tab through fields)
- ✅ Focus management when changing steps

---

## 7. Component Dependencies

```
CheckoutModal
├── CheckoutStepper (steps array)
├── CheckoutOrderSummary (cart, totals)
├── Step Components
│   ├── ConfirmCartStep
│   ├── PurchaserInfoStep
│   ├── PaymentInfoStep
│   ├── PlanInfoStep
│   ├── CourseParticipantStep
│   ├── DeliveryInfoStep
│   ├── ParticipantInfoStep
│   └── ReviewStep
├── CheckoutNavigation (onBack, onNext, isValid)
└── Hooks
    ├── useCheckoutFlow (step management)
    ├── useCheckoutForm (form state)
    └── useCheckoutValidation (validation)
```

---

## 8. UI Components to Create/Extend

### 8.1 New Shared Components

| Component | Purpose | Location |
|-----------|---------|----------|
| `RadioCard` | Selectable card with radio button | `/src/components/atoms/RadioCard.tsx` |
| `FormField` | Labeled input with error state | `/src/components/atoms/FormField.tsx` |
| `StepperCircle` | Individual step indicator | Inline in CheckoutStepper |
| `InfoPill` | Tinted info message box | `/src/components/atoms/InfoPill.tsx` |
| `SummaryCard` | Review step summary block | Inline in ReviewStep |

### 8.2 RadioCard Specification

```typescript
interface RadioCardProps {
  selected: boolean;
  onSelect: () => void;
  title: string;
  subtitle?: string;
  disabled?: boolean;
}
```

**Visual:**
```
┌─────────────────────────────────────────────────────┐
│ (○)  Title Text                                     │
│      Subtitle/description text                      │
└─────────────────────────────────────────────────────┘
```

Selected state: Blue border, filled radio, light blue tint

### 8.3 FormField Specification

```typescript
interface FormFieldProps {
  label: string;
  required?: boolean;
  error?: string;
  helperText?: string;
  children: ReactNode; // The actual input
}
```

**Visual:**
```
Label Name*
[Input field                    ]
Helper text or error message
```

---

## 9. Cart Type Updates

The current `CartItem` type needs to be extended to support conditional step logic:

```typescript
// /src/features/shop/types.ts - ADDITIONS

export interface CartItem {
  productId: string;
  productType: ProductType;
  name: string;
  price: number;
  imageUrl: string;
  quantity: number;
  selectedVariant?: string;
  selectedPeriod?: string;

  // NEW: Additional metadata for checkout logic
  eventType?: 'in-person' | 'online';  // For events
  planType?: 'explorer' | 'traveler';   // For plans
}
```

The `addToCart` function in `CartProvider.tsx` should be updated to include this metadata when adding items.

---

## 10. Validation Rules

### 10.1 Field Validators

| Field | Rules |
|-------|-------|
| Full Name | Required, min 2 chars, max 100 chars |
| Email | Required, valid email format (regex) |
| Mobile Phone | Required, min 8 digits (after stripping non-digits) |
| VAT Number | Required if company invoice, exactly 8 digits |
| Company Name | Required if company invoice, min 2 chars |
| Card Number | Required if credit card, 13-19 digits |
| Expiry Date | Required if credit card, MM/YY format, not expired |
| CVC | Required if credit card, 3-4 digits |
| Date of Birth | Required where applicable, valid date, age 13+ |
| Store Selection | Required for merchandise delivery |
| Terms | Required, must be checked |

### 10.2 Step Validation

Each step is valid only when ALL required fields pass validation.

```typescript
function isStepValid(stepId: CheckoutStepId, form: CheckoutFormData): boolean {
  switch (stepId) {
    case 'confirm-cart':
      return cart.totalItems > 0;

    case 'purchaser-info':
      const purchaserValid =
        isValidName(form.purchaserName) &&
        isValidEmail(form.purchaserEmail) &&
        isValidPhone(form.purchaserPhone);

      if (form.invoiceType === 'company') {
        return purchaserValid &&
          isValidVAT(form.vatNumber) &&
          isValidName(form.companyName);
      }
      return purchaserValid;

    case 'payment-info':
      if (form.paymentMethod === 'credit-card') {
        return isValidName(form.cardholderName) &&
          isValidCardNumber(form.cardNumber) &&
          isValidExpiry(form.expiryDate) &&
          isValidCVC(form.cvc);
      }
      return true; // ATM transfer needs no additional validation

    // ... other steps

    case 'review':
      return form.agreedToTerms;
  }
}
```

---

## 11. State Flow Diagram

```
                    ┌─────────────┐
                    │  Cart Open  │
                    └──────┬──────┘
                           │ Click "Checkout"
                           ▼
                    ┌─────────────┐
                    │ Open Modal  │
                    └──────┬──────┘
                           │
                           ▼
              ┌────────────────────────┐
              │  Calculate Steps       │
              │  based on cart items   │
              └───────────┬────────────┘
                          │
                          ▼
              ┌────────────────────────┐
              │  Initialize Form State │
              │  (empty or from draft) │
              └───────────┬────────────┘
                          │
         ┌────────────────┴────────────────┐
         ▼                                 ▼
┌─────────────────┐               ┌─────────────────┐
│  currentStep=0  │──Continue───▶│  currentStep++  │
│  (Confirm Cart) │               │  (Next Step)    │
└─────────────────┘               └────────┬────────┘
         ▲                                 │
         │                                 │
         └─────────Back────────────────────┘
                          │
                          │ On Review step + valid
                          ▼
              ┌────────────────────────┐
              │  Click "Place Order"   │
              └───────────┬────────────┘
                          │
                          ▼
              ┌────────────────────────┐
              │  Submit Order          │
              │  (API call / mock)     │
              └───────────┬────────────┘
                          │
            ┌─────────────┴─────────────┐
            ▼                           ▼
    ┌───────────────┐          ┌───────────────┐
    │    Success    │          │    Error      │
    │  Clear cart   │          │  Show message │
    │  Show confirm │          │  Retry option │
    └───────────────┘          └───────────────┘
```

---

## 12. Testing Checklist

### 12.1 Functional Tests

- [ ] Modal opens from cart drawer
- [ ] Modal closes on X click
- [ ] Modal closes on Escape key
- [ ] Modal closes on overlay click
- [ ] Stepper shows correct number of steps
- [ ] Stepper updates on step change
- [ ] Back button navigates to previous step
- [ ] Back button hidden on first step
- [ ] Continue button disabled when step invalid
- [ ] Continue button navigates to next step
- [ ] Form fields show validation errors
- [ ] Form fields clear errors on valid input
- [ ] "Use purchaser info" copies data correctly
- [ ] Invoice type toggle shows/hides company fields
- [ ] Payment method toggle shows correct section
- [ ] Quantity selector updates cart
- [ ] "Change" links in Review navigate correctly
- [ ] Terms checkbox enables Place Order button
- [ ] Place Order submits and shows confirmation
- [ ] Cart clears after successful order

### 12.2 Conditional Step Tests

- [ ] Traveler upgrade shows Plan Information step
- [ ] Duo Ticket does NOT show Plan Information step
- [ ] In-person event shows Course Participant step
- [ ] Online event does NOT show Course Participant step
- [ ] Merchandise shows Delivery Information step
- [ ] Quantity > 1 shows Participant Information step

### 12.3 Edge Cases

- [ ] Empty cart shows appropriate message
- [ ] Multiple product types show all required steps
- [ ] Step count updates when cart changes
- [ ] Form data persists on step navigation
- [ ] Order fails gracefully with error message
- [ ] Very long names don't break layout
- [ ] Mobile layout works correctly

---

## 13. Estimated Effort

| Phase | Description | Complexity | Estimated Effort |
|-------|-------------|------------|------------------|
| 1 | Foundation | Medium | 1-2 days |
| 2 | Core Steps | High | 2-3 days |
| 3 | Review & Order | Medium | 1 day |
| 4 | Conditional Steps | High | 2-3 days |
| 5 | Polish & Edge Cases | Medium | 1-2 days |

**Total Estimated Effort:** 7-11 days

---

## 14. Open Questions

1. **7-ELEVEN Store Selector:**
   - Should we use a real API or mock data?
   - What fields are needed (store ID, name, address)?
   - How does the selector UI work (modal, dropdown, map)?

2. **Payment Processing:**
   - Is this fully mocked or integrated with a payment provider?
   - For ATM transfer, do we generate a virtual account?

3. **Order Storage:**
   - Should orders be saved to MockDB?
   - Is there an order history page?

4. **Email Notifications:**
   - Are these mocked or is there an email service?

5. **Terms & Conditions:**
   - Is there an existing T&C page to link to?

---

## 15. Success Criteria

The checkout implementation is complete when:

1. ✅ Modal-based checkout matches the design specification - **DONE**
2. ✅ Horizontal stepper shows dynamic steps - **DONE**
3. ✅ Two-column layout works on desktop - **DONE**
4. ✅ All 3 base steps are functional - **DONE**
5. ✅ Conditional steps appear based on cart contents - **DONE**
6. ✅ Form validation prevents invalid submissions - **DONE**
7. ✅ "Change" links allow editing previous steps - **DONE**
8. ✅ Order placement shows confirmation - **DONE**
9. ✅ Cart clears after successful order - **DONE**
10. ✅ All text is in English with NT$ currency - **DONE**

### Additional Features Implemented

- Auto-focus for credit card fields (card number → expiry → CVC)
- Duo product support with period selection (monthly/quarterly)
- Demo page at `/checkout-demo` for testing all scenarios
