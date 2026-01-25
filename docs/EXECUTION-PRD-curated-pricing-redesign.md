# Execution PRD: Dark Curated Pricing Structure Redesign

**Author:** Engineering
**Date:** 2026-01-24
**Status:** PENDING APPROVAL

---

## Executive Summary

Redesign the existing pricing section in `/shop` from a 3-plan layout with full feature comparison table to a **curated, card-based 4-plan layout** with minimal visual noise. Keep the dark theme. Make **Voyager** the clearly promoted default plan.

---

## A) Scope & Non-Scope

### In Scope

| Change | Description |
|--------|-------------|
| Add Enterprise plan | New 4th plan at NT$8,500/mo with LINE contact CTA |
| Update pricing | Traveler: NT$990 → NT$790, Voyager: NT$1,990 → NT$990 |
| Voyager promotion | Change badge from "Best Value" → "⚡ Most Recommended", add visual emphasis |
| Curated header | Add "Pricing" pill tag, "Curated Pricing Structure" title, subtitle |
| Card-based layout | 4-column grid on desktop, responsive on smaller screens |
| Remove comparison table | Default view shows only plan cards, hide the 18-row feature table |
| Update feature bullets | Each card gets 5-6 curated feature bullets (not a full comparison) |
| Update yearly logic | Display yearly as "billed yearly" amount (monthly × 10) |
| Enterprise LINE CTA | Button links to `https://lin.ee/BS8W6qU` (new tab) |

### Out of Scope (No Changes)

| Item | Reason |
|------|--------|
| Cart system | Unrelated to pricing section |
| Event/Merchandise tabs | Different categories, not affected |
| User identity/auth | Permission system unchanged |
| FAQ section below plans | Can remain as-is |
| Database schema | Frontend-only changes |

### Removed/Hidden

| Item | Action |
|------|--------|
| `PLAN_COMPARISON` feature table | Remove from default view (optionally add collapsed "Compare features" toggle) |
| Voyager "Best Value" badge | Replace with "Most Recommended" |
| Current plan status footer | Can be simplified or removed |

---

## B) UI Blueprint

### B.1 Section Structure (Top to Bottom)

```
┌─────────────────────────────────────────────────────────────┐
│                    Full-width Dark Section                   │
│                     bg-neutral-900 / #0a0a0b                 │
│                     py-[72px] / container max-w-[1200px]     │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│            ┌─────────────────────────────┐                   │
│            │  ⚡ Pricing  (pill badge)   │                   │
│            └─────────────────────────────┘                   │
│                                                              │
│              Curated Pricing Structure                       │
│                   (h1, 3xl, bold)                            │
│                                                              │
│           Start free and upgrade as you grow.                │
│                 (subtitle, neutral-400)                      │
│                                                              │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│       ┌──────────────────────────────────────────┐           │
│       │  [ Monthly ]  [ Yearly  Save 17% ]       │           │
│       └──────────────────────────────────────────┘           │
│                      (Billing Toggle)                        │
│                                                              │
│     ┌────────────────────────────────────────────┐           │
│     │  🎁 Buy 10 months, get 2 FREE!            │            │
│     └────────────────────────────────────────────┘           │
│          (YearlyOfferBanner - only when yearly)              │
│                                                              │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌───────────┐ ┌───────────┐ ┌───────────┐ ┌───────────┐     │
│  │ Explorer  │ │ Traveler  │ │ Voyager   │ │Enterprise │     │
│  │           │ │ "Popular" │ │⚡Most Rec │ │           │     │
│  │   FREE    │ │  NT$790   │ │  NT$990   │ │ NT$8,500  │     │
│  │           │ │   /mo     │ │   /mo     │ │   /mo     │     │
│  │           │ │           │ │           │ │           │     │
│  │ • feat 1  │ │ • feat 1  │ │ • feat 1  │ │ • feat 1  │     │
│  │ • feat 2  │ │ • feat 2  │ │ • feat 2  │ │ • feat 2  │     │
│  │ • feat 3  │ │ • feat 3  │ │ • feat 3  │ │ • feat 3  │     │
│  │ • feat 4  │ │ • feat 4  │ │ • feat 4  │ │ • feat 4  │     │
│  │ • feat 5  │ │ • feat 5  │ │ • feat 5  │ │ • feat 5  │     │
│  │           │ │           │ │ • feat 6  │ │ • feat 6  │     │
│  │[Start Free│ │[Get Start │ │[Get Start │ │[Contact   │     │
│  │   Now]    │ │   ed]     │ │   ed]     │ │ LINE]     │     │
│  └───────────┘ └───────────┘ └───────────┘ └───────────┘     │
│                                                              │
│            (4-column grid, 24px gap)                         │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### B.2 Component Breakdown

| Component | File | Purpose |
|-----------|------|---------|
| `PricingSection` | `src/features/shop/components/PricingSection.tsx` | New main container (replaces `PlanComparisonSection` for pricing) |
| `PricingHeader` | Inside `PricingSection` or extracted | Pill + title + subtitle |
| `BillingToggle` | `src/features/shop/components/BillingToggle.tsx` | Existing, minor style updates |
| `YearlyOfferBanner` | `src/features/shop/components/YearlyOfferBanner.tsx` | Existing, minor style updates |
| `PlanCard` | New sub-component in `PricingSection.tsx` | Individual plan card with all content |

### B.3 Responsive Behavior

| Breakpoint | Grid | Notes |
|------------|------|-------|
| Desktop (≥1024px) | 4 columns | `grid-cols-4`, 24px gap |
| Tablet (768-1023px) | 2 columns | `grid-cols-2`, Row 1: Explorer + Traveler, Row 2: Voyager + Enterprise |
| Mobile (≤767px) | 1 column | Stack in order: Explorer, **Voyager**, Traveler, Enterprise (Voyager promoted early) |

---

## C) Data Model

### C.1 Updated Plan Schema

```typescript
// src/features/shop/types.ts

export type PlanType = 'explorer' | 'traveler' | 'voyager' | 'enterprise';

export interface PlanProduct {
  id: string;
  type: 'plan';
  planType: PlanType;
  name: string;
  description: string;
  price: number;           // Monthly price in NT$
  yearlyPrice: number;     // Yearly billed amount (price × 10)
  billingCycle: 'monthly' | 'yearly';
  features: string[];      // Card-level feature bullets
  imageUrl: string;
  rating: number;
  reviewCount: number;
  isPopular?: boolean;     // Traveler = true
  badge?: string;          // Voyager = "Most Recommended"
  promoted?: boolean;      // Voyager = true (visual emphasis)
  ctaText: string;         // Button text
  ctaLink?: string;        // Enterprise LINE link
  ctaExternal?: boolean;   // Open in new tab
}
```

### C.2 Updated Plans Data

```typescript
// src/features/shop/data/plans.ts

export const PLANS: PlanProduct[] = [
  {
    id: 'plan-explorer',
    type: 'plan',
    planType: 'explorer',
    name: 'Explorer',
    description: 'Start learning AI for free.',
    price: 0,
    yearlyPrice: 0,
    billingCycle: 'monthly',
    features: [
      'Free courses (Level 1)',
      'Community access',
      'Basic quizzes & checkpoints',
      'Starter learning roadmap',
      'Standard support',
    ],
    imageUrl: '...',
    rating: 4.5,
    reviewCount: 234,
    ctaText: 'Start Free Now',
  },
  {
    id: 'plan-traveler',
    type: 'plan',
    planType: 'traveler',
    name: 'Traveler',
    description: 'Unlock the full learning experience.',
    price: 790,
    yearlyPrice: 7900,  // 790 × 10
    billingCycle: 'monthly',
    features: [
      'Everything in Explorer',
      'Full premium courses access',
      'Expanded practice sets',
      'Progress tracking',
      'Faster support response',
    ],
    imageUrl: '...',
    rating: 4.8,
    reviewCount: 156,
    isPopular: true,
    ctaText: 'Get Started',
  },
  {
    id: 'plan-voyager',
    type: 'plan',
    planType: 'voyager',
    name: 'Voyager',
    description: 'Connect with mentors & lead — the fastest path to real growth.',
    price: 990,
    yearlyPrice: 9900,  // 990 × 10
    billingCycle: 'monthly',
    features: [
      'Everything in Traveler',
      'Mentor support & guidance',
      'Priority feedback loop',
      'Advanced projects & challenges',
      'Certificates / completion proof',
      'Priority support',
    ],
    imageUrl: '...',
    rating: 4.9,
    reviewCount: 89,
    badge: 'Most Recommended',
    promoted: true,
    ctaText: 'Get Started',
  },
  {
    id: 'plan-enterprise',
    type: 'plan',
    planType: 'enterprise',
    name: 'Enterprise',
    description: 'For teams and organizations that need customization, admin control, and direct support.',
    price: 8500,
    yearlyPrice: 0,  // Custom / Contact
    billingCycle: 'monthly',
    features: [
      'Team management & admin controls',
      'Custom onboarding & training plan',
      'Dedicated support channel',
      'SLA / priority troubleshooting',
      'Custom integrations (if applicable)',
      'Scalable seats & access control',
    ],
    imageUrl: '...',
    rating: 5.0,
    reviewCount: 12,
    ctaText: 'Contact us on LINE',
    ctaLink: 'https://lin.ee/BS8W6qU',
    ctaExternal: true,
  },
];
```

### C.3 Yearly Calculation Logic

```typescript
// Calculate yearly billed amount (10 months for 12)
function getYearlyBilled(plan: PlanProduct): number {
  if (plan.planType === 'enterprise') return 0; // Custom
  if (plan.price === 0) return 0;
  return plan.price * 10;
}

// Calculate savings percentage
const YEARLY_SAVINGS_PERCENT = 17; // ~16.67% rounded

// Display logic
if (billingCycle === 'yearly' && plan.price > 0 && plan.planType !== 'enterprise') {
  // Show: NT$790/mo
  // Below: NT$7,900 billed yearly
  // Small: Buy 10 months, get 2 FREE!
}
```

---

## D) Copy & Content

### D.1 Header Copy

| Element | Text |
|---------|------|
| Pill Badge | "Pricing" (with optional ⚡ icon) |
| Main Title | "Curated Pricing Structure" |
| Subtitle | "Start free and upgrade as you grow." |

### D.2 Toggle Copy

| Element | Text |
|---------|------|
| Left Option | "Monthly" |
| Right Option | "Yearly" |
| Yearly Badge | "Save 17%" |
| Yearly Banner | "🎁 Buy 10 months, get 2 FREE!" |

### D.3 Plan Cards Copy

#### Explorer - NT$0
- **Name:** Explorer
- **Description:** "Start learning AI for free."
- **CTA:** "Start Free Now" (secondary style)
- **Features:**
  - ✅ Free courses (Level 1)
  - ✅ Community access
  - ✅ Basic quizzes & checkpoints
  - ✅ Starter learning roadmap
  - ✅ Standard support

#### Traveler - NT$790 (Popular)
- **Name:** Traveler
- **Badge:** "Popular" (subtle)
- **Description:** "Unlock the full learning experience."
- **CTA:** "Get Started" (primary, medium emphasis)
- **Features:**
  - ✅ Everything in Explorer
  - ✅ Full premium courses access
  - ✅ Expanded practice sets
  - ✅ Progress tracking
  - ✅ Faster support response
- **Yearly Display:**
  - NT$790/mo
  - NT$7,900 billed yearly
  - Buy 10 months, get 2 FREE!

#### Voyager - NT$990 (⚡ Most Recommended)
- **Name:** Voyager
- **Badge:** "⚡ Most Recommended"
- **Description:** "Connect with mentors & lead — the fastest path to real growth."
- **CTA:** "Get Started" (primary, strongest emphasis)
- **Features:**
  - ✅ Everything in Traveler
  - ✅ Mentor support & guidance
  - ✅ Priority feedback loop
  - ✅ Advanced projects & challenges
  - ✅ Certificates / completion proof
  - ✅ Priority support
- **Yearly Display:**
  - NT$990/mo
  - NT$9,900 billed yearly
  - Buy 10 months, get 2 FREE!

#### Enterprise - NT$8,500 (Contact)
- **Name:** Enterprise
- **Description:** "For teams and organizations that need customization, admin control, and direct support."
- **CTA:** "Contact us on LINE" → https://lin.ee/BS8W6qU (opens new tab)
- **Features:**
  - ✅ Team management & admin controls
  - ✅ Custom onboarding & training plan
  - ✅ Dedicated support channel
  - ✅ SLA / priority troubleshooting
  - ✅ Custom integrations (if applicable)
  - ✅ Scalable seats & access control

---

## E) Edge Cases

| Scenario | Handling |
|----------|----------|
| Very small screens (<320px) | Single column, cards stack vertically, text may wrap |
| Yearly toggle with Explorer (free) | Still shows "FREE" and "Forever", no yearly calculation |
| Enterprise yearly toggle | Continue showing "NT$8,500/mo", CTA remains "Contact us on LINE" |
| User already on a plan | Show "Current Plan" badge, disable CTA button, muted style |
| Guest user | All CTAs active, no "Current" state |
| Keyboard navigation | All buttons focusable, toggle accessible, visible focus rings |

---

## F) Tracking Events

| Event Name | Trigger | Properties |
|------------|---------|------------|
| `pricing_toggle_monthly` | User clicks Monthly toggle | `{ previous: 'yearly' }` |
| `pricing_toggle_yearly` | User clicks Yearly toggle | `{ previous: 'monthly' }` |
| `pricing_click_explorer` | User clicks Explorer CTA | `{ billing: 'monthly' \| 'yearly' }` |
| `pricing_click_traveler` | User clicks Traveler CTA | `{ billing: 'monthly' \| 'yearly' }` |
| `pricing_click_voyager` | User clicks Voyager CTA | `{ billing: 'monthly' \| 'yearly' }` |
| `pricing_click_enterprise_line` | User clicks Enterprise LINE CTA | `{}` |

---

## G) Acceptance Criteria

### Visual Checks

- [ ] Dark theme preserved (page remains dark, premium)
- [ ] Curated layout achieved: Pill → Title → Subtitle → Toggle → Cards
- [ ] 4 plans shown correctly: Explorer / Traveler / Voyager / Enterprise
- [ ] Prices correct: 0 / 790 / 990 / 8500
- [ ] Voyager is clearly "Most Recommended" with visual emphasis
- [ ] Voyager card has subtle accent border/background
- [ ] No feature comparison table in default view
- [ ] Cards have generous padding and rounded corners

### Functional Checks

- [ ] Toggle works: Monthly ↔ Yearly updates pricing display
- [ ] Yearly messaging appears: "Save 17%" badge, "Buy 10 months, get 2 FREE!" banner
- [ ] Yearly billed amounts: Traveler NT$7,900, Voyager NT$9,900
- [ ] Enterprise CTA opens LINE: https://lin.ee/BS8W6qU in new tab
- [ ] Explorer shows "FREE" with "Forever" label
- [ ] Current plan indicator works for logged-in users

### Responsive Checks

- [ ] Desktop (≥1024px): 4-column grid
- [ ] Tablet (768-1023px): 2-column grid (2×2)
- [ ] Mobile (≤767px): 1-column stack with Voyager second (promoted)

### Accessibility Checks

- [ ] Toggle is keyboard operable
- [ ] Buttons have visible focus states
- [ ] Text meets readable contrast on dark background
- [ ] ARIA labels on CTAs

---

## H) Files to Modify

| File | Action | Description |
|------|--------|-------------|
| `src/features/shop/types.ts` | MODIFY | Add `'enterprise'` to `PlanType`, add new fields to `PlanProduct` |
| `src/features/shop/data/plans.ts` | MODIFY | Update pricing, add Enterprise plan, update features |
| `src/features/shop/data/comparisons.ts` | MODIFY | Add Enterprise column to `PLAN_INFO`, optionally update `PLAN_COMPARISON` |
| `src/features/shop/components/PlanComparisonSection.tsx` | MAJOR REWRITE | Rename or replace with curated layout, remove comparison table |
| `src/features/shop/components/BillingToggle.tsx` | MINOR | Style updates for curated look |
| `src/features/shop/components/YearlyOfferBanner.tsx` | MINOR | Style consistency |
| `src/features/shop/components/index.ts` | MODIFY | Update exports if needed |
| `src/features/shop/hooks/usePlanStatus.ts` | MODIFY | Add enterprise mapping |
| `src/app/(public)/shop/page.tsx` | MINOR | Ensure it uses updated component, update FAQ |

---

## I) Implementation Order

1. **Phase 1: Data Layer**
   - Update `types.ts` with Enterprise plan type
   - Update `plans.ts` with new pricing and Enterprise plan
   - Update `comparisons.ts` with Enterprise info

2. **Phase 2: Component Rewrite**
   - Rewrite `PlanComparisonSection.tsx` as curated card layout
   - Add PricingHeader sub-component
   - Update card styling (Voyager emphasis)

3. **Phase 3: Integration**
   - Update shop page if needed
   - Update FAQ content for new plans
   - Update `usePlanStatus.ts` hook

4. **Phase 4: Polish**
   - Add analytics events
   - Test responsive layouts
   - Accessibility pass
   - Final visual QA

---

## J) Risk Mitigation

| Risk | Mitigation |
|------|------------|
| Breaking existing plan selection logic | Keep plan IDs consistent, add enterprise as new |
| Cart system incompatibility | Enterprise uses external LINE link, no cart action |
| Identity mapping breaks | Add explicit enterprise handling in usePlanStatus |
| Mobile layout too cramped with 4 cards | Use Voyager-second ordering to prioritize key plan |

---

## Approval Request

**Please review this Execution PRD and confirm:**

1. Are the pricing amounts correct? (Explorer: 0, Traveler: 790, Voyager: 990, Enterprise: 8500)
2. Is the yearly calculation correct? (Pay 10 months, get 12 = 17% savings)
3. Is the Enterprise LINE link correct? (https://lin.ee/BS8W6qU)
4. Should the feature comparison table be completely removed, or hidden behind a toggle?
5. Any other changes to the copy or feature bullets?

---

**Status: AWAITING APPROVAL**

Once approved, I will proceed with implementation following the phases outlined above.
