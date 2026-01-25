# PRD: Sprint Project Visibility, Voyager Tier & Yearly Subscription Plans

## Executive Summary

This PRD covers three interconnected feature enhancements for NuvaClub:

1. **Sprint Project Visibility Controls** - Inform users about project publicity and provide post-sprint sharing options
2. **Voyager Tier** - New premium tier with full access to Test, Space, and Sprint systems
3. **Yearly Subscription Plans** - 9+3 offer (pay for 9 months, get 12) with monthly/yearly toggle

---

## 1. Sprint Project Visibility Controls

### 1.1 Problem Statement

#### Current State
- Users upload sprint projects without clear visibility expectations
- No control over project visibility after the sprint ends
- Projects remain publicly viewable indefinitely

#### Desired State
- Users are informed upfront that sprint projects are public during the sprint
- After sprint ends, users can choose visibility:
  - **NuvaClub Only** - Private to platform members
  - **Public** - Visible to everyone (shareable externally)

### 1.2 User Stories

**As a Sprint Participant:**
1. **US-1**: When uploading a project, I see a clear notice that my project will be publicly visible during the sprint
2. **US-2**: Before submitting, I must acknowledge the visibility terms
3. **US-3**: After the sprint ends, I receive a prompt to choose my project's visibility
4. **US-4**: I can change my project visibility at any time from my project settings

### 1.3 Data Model Changes

#### 1.3.1 Updated `ProjectRecord`

```typescript
// src/lib/db/schema/sprint.schema.ts

export type ProjectVisibility = 'sprint-public' | 'nuvaclub-only' | 'public';

export interface ProjectRecord {
  // ... existing fields ...

  // NEW: Visibility Settings
  visibility: ProjectVisibility;
  visibilityChosenAt?: Date;  // When user made post-sprint choice

  // Privacy Acknowledgment
  visibilityAcknowledged: boolean;  // User acknowledged public visibility at upload
  acknowledgedAt?: Date;
}
```

#### 1.3.2 New Collection: `ProjectVisibilityPrompt`

```typescript
// Track users who need to choose post-sprint visibility
export interface ProjectVisibilityPromptRecord {
  id: string;
  projectId: string;       // FK -> projects.id
  userId: string;          // FK -> users.id
  sprintId: string;        // FK -> sprints.id

  // Status
  status: 'pending' | 'completed' | 'dismissed';

  // Choice (once made)
  chosenVisibility?: ProjectVisibility;

  // Timestamps
  promptedAt: Date;        // When sprint ended
  respondedAt?: Date;
  createdAt: Date;
}
```

### 1.4 Feature Specifications

#### 1.4.1 Upload Flow - Visibility Notice

**Location**: Sprint project submission form

**UI Design**:
```
┌─────────────────────────────────────────────────────────────────────────┐
│  Submit Your Project                                                     │
│                                                                          │
│  ┌─ Project Details ─────────────────────────────────────────────────┐  │
│  │  Title: [_______________________]                                  │  │
│  │  Description: [_______________________________________________]   │  │
│  │  ...                                                               │  │
│  └────────────────────────────────────────────────────────────────────┘  │
│                                                                          │
│  ┌─────────────────────────────────────────────────────────────────────┐ │
│  │  ⚠️  PUBLIC PROJECT NOTICE                                          │ │
│  │                                                                      │ │
│  │  Your project will be publicly visible to all NuvaClub users and    │ │
│  │  visitors during the sprint period. This enables:                   │ │
│  │                                                                      │ │
│  │  • Community voting on your submission                              │ │
│  │  • Feedback and comments from other members                         │ │
│  │  • Visibility in sprint rankings and showcases                      │ │
│  │                                                                      │ │
│  │  After the sprint ends, you can choose to:                          │ │
│  │  • Keep it public for everyone                                      │ │
│  │  • Make it private (NuvaClub members only)                          │ │
│  │                                                                      │ │
│  │  ☑️ I understand my project will be publicly visible during the     │ │
│  │     sprint and I consent to these terms.                            │ │
│  └─────────────────────────────────────────────────────────────────────┘ │
│                                                                          │
│  [Cancel]                                        [Submit Project]        │
└──────────────────────────────────────────────────────────────────────────┘
```

**Validation**:
- Checkbox must be checked before submission is enabled
- Store acknowledgment timestamp in project record

#### 1.4.2 Post-Sprint Visibility Prompt

**Trigger**: When sprint status changes from `voting` to `ended`

**Notification Banner** (shown on member dashboard):
```
┌─────────────────────────────────────────────────────────────────────────┐
│  🎉 Q1 Sprint has ended! Choose your project visibility                 │
│                                                                          │
│  Your project "AI Chat Assistant" is awaiting your visibility choice.   │
│                                                                          │
│  [Choose Now →]                                              [Dismiss]  │
└──────────────────────────────────────────────────────────────────────────┘
```

**Visibility Selection Modal**:
```
┌─────────────────────────────────────────────────────────────────────────┐
│  Choose Project Visibility                                               │
│                                                                          │
│  "AI Chat Assistant"                                                     │
│  Sprint: Q1 2026 - AI Innovation                                        │
│                                                                          │
│  ─────────────────────────────────────────────────────────────────────  │
│                                                                          │
│  Who can view your project after the sprint?                            │
│                                                                          │
│  ○ NuvaClub Members Only                                                │
│    Only logged-in NuvaClub members can view your project.              │
│    Perfect for portfolio pieces you want to keep within the community.  │
│                                                                          │
│  ○ Public for Everyone (Recommended)                                    │
│    Anyone can view your project, even without logging in.              │
│    Great for sharing on social media, portfolios, and job applications. │
│    Includes shareable link for external promotion.                      │
│                                                                          │
│  ─────────────────────────────────────────────────────────────────────  │
│                                                                          │
│  ℹ️ You can change this anytime from your project settings.             │
│                                                                          │
│  [Cancel]                                          [Save Visibility]    │
└──────────────────────────────────────────────────────────────────────────┘
```

#### 1.4.3 Project Settings - Visibility Control

**Location**: Project detail page (for project owner)

```
┌─────────────────────────────────────────────────────────────────────────┐
│  Project Settings                                             [⚙️]      │
│                                                                          │
│  ┌─ Visibility ─────────────────────────────────────────────────────┐   │
│  │                                                                   │   │
│  │  Current: 🌍 Public for Everyone                                  │   │
│  │                                                                   │   │
│  │  [🔒 Make NuvaClub Only]  [🌍 Keep Public]                       │   │
│  │                                                                   │   │
│  │  Share Link: https://nuvaclub.com/project/abc123                 │   │
│  │  [📋 Copy Link]                                                   │   │
│  │                                                                   │   │
│  └───────────────────────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────────────────────┘
```

### 1.5 Access Control Logic

```typescript
function canViewProject(
  project: ProjectRecord,
  viewer: User | null,
  sprint: SprintRecord
): boolean {
  // During active sprint or voting: always visible
  if (['active', 'voting'].includes(sprint.status)) {
    return true;
  }

  // After sprint ends:
  switch (project.visibility) {
    case 'public':
      return true;  // Anyone can view

    case 'nuvaclub-only':
      return viewer !== null;  // Must be logged in

    case 'sprint-public':
      // Default before user makes choice - treat as NuvaClub only
      return viewer !== null;

    default:
      return false;
  }
}
```

---

## 2. Voyager Tier - Full Platform Access

### 2.1 Problem Statement

#### Current State
- **Explorer** (Free): Limited access - first chapter courses, forum read, basic space
- **Traveler** (NT$990/mo): Full courses, forum posting, sprint submission
- No tier offers full access to ALL premium features including Test system

#### Desired State
- New **Voyager** tier provides complete platform access:
  - Full video courses (same as Traveler)
  - Test system access (skill assessments)
  - Space system (full marketplace access)
  - Sprint system (submissions + enhanced features)

### 2.2 Tier Comparison Matrix

| Feature | Explorer (Free) | Traveler (NT$990/mo) | Voyager (NT$1,990/mo) |
|---------|-----------------|----------------------|----------------------|
| **Learn** | | | |
| First chapter access | ✅ | ✅ | ✅ |
| Full course videos | ❌ | ✅ | ✅ |
| Course certificates | ❌ | ❌ | ✅ |
| **Test** | | | |
| Level 1-3 (Basic) | ✅ | ✅ | ✅ |
| Level 4-8 (Intermediate) | ❌ | ❌ | ✅ |
| Level 9-12 (Advanced) | ❌ | ❌ | ✅ |
| Skill badges | ❌ | ❌ | ✅ |
| **Space** | | | |
| Browse marketplace | ✅ | ✅ | ✅ |
| Create posts | ✅ | ✅ | ✅ |
| View Nunu profiles | ✅ | ✅ | ✅ |
| View Certified Nunu | ❌ | ✅ | ✅ |
| View Shangzhe | ❌ | ❌ | ✅ |
| Priority matching | ❌ | ❌ | ✅ |
| **Sprint** | | | |
| View projects | ✅ | ✅ | ✅ |
| Submit projects | ❌ | ✅ | ✅ |
| Vote on projects | ❌ | ✅ | ✅ |
| Featured submission slot | ❌ | ❌ | ✅ |
| Early access to themes | ❌ | ❌ | ✅ |
| **Forum** | | | |
| Read posts | ✅ | ✅ | ✅ |
| Like/comment | ✅ | ✅ | ✅ |
| Create posts | ❌ | ✅ | ✅ |
| Voyager badge | ❌ | ❌ | ✅ |
| **Support** | | | |
| Community support | ✅ | ✅ | ✅ |
| Email support | ❌ | ✅ | ✅ |
| Priority support | ❌ | ❌ | ✅ |

### 2.3 Pricing Strategy

**Voyager Monthly**: NT$1,990/month
- ~2x Traveler price
- Positioned as "professional learner" tier
- Full platform access

**Voyager Yearly**: NT$17,910/year (9+3 offer)
- Pay for 9 months, get 12
- Effective monthly: NT$1,492.50/month
- Savings: NT$5,970/year (25% discount)

### 2.4 Data Model Changes

#### 2.4.1 Updated Identity Types

```typescript
// src/features/auth/types.ts

export type IdentityType = 'guest' | 'explorer' | 'traveler' | 'voyager';

// For backwards compatibility
export type PlanType = 'explorer' | 'traveler' | 'voyager';
```

#### 2.4.2 Updated Permission Matrix

```typescript
// src/features/auth/permissions.ts

export type Permission =
  // ... existing permissions ...
  // NEW: Test permissions
  | 'test:basic_levels'      // Levels 1-3
  | 'test:intermediate_levels'  // Levels 4-8
  | 'test:advanced_levels'   // Levels 9-12
  | 'test:skill_badges'
  // NEW: Enhanced Sprint permissions
  | 'sprint:featured_slot'
  | 'sprint:early_access'
  // NEW: Enhanced Space permissions
  | 'space:priority_matching'
  // NEW: Certificates
  | 'learn:certificates';

const VOYAGER_PERMISSIONS: Permission[] = [
  ...SOLO_TRAVELER_PERMISSIONS,
  // Full Test access
  'test:intermediate_levels',
  'test:advanced_levels',
  'test:skill_badges',
  // Full Space access
  'space:view_shangzhe',
  'space:priority_matching',
  // Enhanced Sprint
  'sprint:featured_slot',
  'sprint:early_access',
  // Certificates
  'learn:certificates',
];

export const PERMISSION_MATRIX: Record<IdentityType, Permission[]> = {
  guest: [...],
  explorer: [..., 'test:basic_levels'],
  'solo-traveler': [...SOLO_TRAVELER_PERMISSIONS, 'test:basic_levels'],
  voyager: VOYAGER_PERMISSIONS,
};
```

#### 2.4.3 Updated Plans Data

```typescript
// src/features/shop/data/plans.ts

export const PLANS: PlanProduct[] = [
  {
    id: 'plan-explorer',
    type: 'plan',
    planType: 'explorer',
    name: 'Explorer',
    description: 'Start your journey with free access to basic features.',
    price: 0,
    yearlyPrice: 0,
    billingCycle: 'monthly',
    features: [
      'Access first chapter of all courses',
      'Basic Test levels (1-3)',
      'Browse forum discussions',
      'View Sprint projects',
      'Space marketplace access',
    ],
    // ...
  },
  {
    id: 'plan-traveler',
    type: 'plan',
    planType: 'traveler',
    name: 'Traveler',
    description: 'Unlock full course videos and community participation.',
    price: 990,
    yearlyPrice: 8910,  // 9 months price for 12 months
    billingCycle: 'monthly',
    features: [
      'Full access to all course videos',
      'Post and comment in forum',
      'Submit Sprint projects',
      'Vote on Sprint submissions',
      'View Certified Nunus in Space',
      'Email support',
    ],
    isPopular: true,
    // ...
  },
  {
    id: 'plan-voyager',
    type: 'plan',
    planType: 'voyager',
    name: 'Voyager',
    description: 'Complete platform access with Test, Space & Sprint mastery.',
    price: 1990,
    yearlyPrice: 17910,  // 9 months price for 12 months
    billingCycle: 'monthly',
    features: [
      'Everything in Traveler, plus:',
      'Full Test system access (all 12 levels)',
      'Earn skill badges & certificates',
      'Access Shangzhe (founder mentors)',
      'Priority matching in Space',
      'Featured Sprint submission slot',
      'Early access to Sprint themes',
      'Voyager badge on profile',
      'Priority support',
    ],
    badge: 'Best Value',
    // ...
  },
];
```

### 2.5 Test System Access Control

```typescript
// src/features/test/utils/access-control.ts

function canAccessLevel(
  identity: IdentityType,
  level: number
): boolean {
  // Basic levels (1-3): All users
  if (level <= 3) {
    return true;
  }

  // Intermediate levels (4-8): Voyager only
  if (level >= 4 && level <= 8) {
    return identity === 'voyager';
  }

  // Advanced levels (9-12): Voyager only
  if (level >= 9 && level <= 12) {
    return identity === 'voyager';
  }

  return false;
}

function getLockedLevelMessage(level: number): string {
  if (level >= 4 && level <= 8) {
    return 'Upgrade to Voyager to unlock intermediate levels (4-8)';
  }
  if (level >= 9) {
    return 'Upgrade to Voyager to unlock advanced levels (9-12)';
  }
  return '';
}
```

---

## 3. Yearly Subscription Plans (9+3 Offer)

### 3.1 Problem Statement

#### Current State
- Only monthly billing available
- No incentive for longer commitments
- Higher churn due to monthly renewal friction

#### Desired State
- Yearly option with significant discount
- "Buy 9 months, get 3 free" (25% discount)
- Easy toggle between monthly/yearly pricing display

### 3.2 Pricing Structure

| Plan | Monthly | Yearly (9+3) | Monthly Equivalent | Savings |
|------|---------|--------------|--------------------|---------|
| Explorer | NT$0 | NT$0 | NT$0 | - |
| Traveler | NT$990 | NT$8,910 | NT$742.50 | NT$2,970 (25%) |
| Voyager | NT$1,990 | NT$17,910 | NT$1,492.50 | NT$5,970 (25%) |

### 3.3 Data Model Changes

#### 3.3.1 Updated Subscription Record

```typescript
// src/lib/db/schema/user.schema.ts

export type BillingCycle = 'monthly' | 'yearly';

export interface UserSubscriptionRecord {
  // ... existing fields ...

  // Billing
  billingCycle: BillingCycle;

  // For yearly subscriptions
  yearlyStartDate?: Date;
  yearlyEndDate?: Date;
  monthsIncluded?: number;  // 12 for yearly

  // Renewal tracking
  autoRenew: boolean;
  renewalPrice: number;
  nextBillingDate?: Date;
}
```

#### 3.3.2 Updated Plan Product Type

```typescript
// src/features/shop/types.ts

export interface PlanProduct extends BaseProduct {
  type: 'plan';
  planType: PlanType;
  price: number;           // Monthly price
  yearlyPrice: number;     // Yearly price (9 months)
  billingCycle: 'monthly' | 'yearly';
  features: string[];
  isPopular?: boolean;
  badge?: string;          // e.g., "Best Value", "Most Popular"
}
```

### 3.4 Feature Specifications

#### 3.4.1 Pricing Toggle Component

**Location**: `/shop/plan` page

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         Choose Your Plan                                 │
│                                                                          │
│                    ┌────────────────────────────┐                        │
│                    │  Monthly  │  Yearly        │                        │
│                    │           │  Save 25%  ⭐  │                        │
│                    └────────────────────────────┘                        │
│                                                                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐                   │
│  │   Explorer   │  │   Traveler   │  │   Voyager    │                   │
│  │              │  │   POPULAR    │  │  BEST VALUE  │                   │
│  │    FREE      │  │              │  │              │                   │
│  │              │  │   NT$742     │  │   NT$1,492   │                   │
│  │              │  │   /month     │  │   /month     │                   │
│  │              │  │              │  │              │                   │
│  │              │  │  NT$8,910    │  │  NT$17,910   │                   │
│  │              │  │  billed      │  │  billed      │                   │
│  │              │  │  yearly      │  │  yearly      │                   │
│  │              │  │              │  │              │                   │
│  │  • First     │  │  • Full      │  │  • All       │                   │
│  │    chapters  │  │    courses   │  │    Traveler  │                   │
│  │  • Basic     │  │  • Forum     │  │  • Full Test │                   │
│  │    tests     │  │    posting   │  │    system    │                   │
│  │  • Forum     │  │  • Sprint    │  │  • Shangzhe  │                   │
│  │    read      │  │    submit    │  │    access    │                   │
│  │  • Space     │  │  • Certified │  │  • Priority  │                   │
│  │    browse    │  │    Nunus     │  │    matching  │                   │
│  │              │  │              │  │  • Badges    │                   │
│  │              │  │              │  │              │                   │
│  │ [Current]    │  │ [Upgrade]    │  │ [Upgrade]    │                   │
│  └──────────────┘  └──────────────┘  └──────────────┘                   │
│                                                                          │
│             ┌─────────────────────────────────────────┐                  │
│             │  🎁 Yearly Offer: Buy 9 months,         │                  │
│             │     get 3 months FREE!                  │                  │
│             └─────────────────────────────────────────┘                  │
└──────────────────────────────────────────────────────────────────────────┘
```

#### 3.4.2 Billing Cycle Toggle Component

```typescript
// src/features/shop/components/BillingToggle.tsx

interface BillingToggleProps {
  value: 'monthly' | 'yearly';
  onChange: (value: 'monthly' | 'yearly') => void;
}

export function BillingToggle({ value, onChange }: BillingToggleProps) {
  return (
    <div className="inline-flex rounded-lg bg-gray-100 p-1">
      <button
        className={cn(
          "px-4 py-2 rounded-md text-sm font-medium transition-colors",
          value === 'monthly'
            ? "bg-white shadow text-gray-900"
            : "text-gray-600 hover:text-gray-900"
        )}
        onClick={() => onChange('monthly')}
      >
        Monthly
      </button>
      <button
        className={cn(
          "px-4 py-2 rounded-md text-sm font-medium transition-colors",
          value === 'yearly'
            ? "bg-white shadow text-gray-900"
            : "text-gray-600 hover:text-gray-900"
        )}
        onClick={() => onChange('yearly')}
      >
        Yearly
        <span className="ml-1 text-xs text-green-600 font-bold">
          Save 25%
        </span>
      </button>
    </div>
  );
}
```

#### 3.4.3 Price Display Component

```typescript
// src/features/shop/components/PlanPriceDisplay.tsx

interface PlanPriceDisplayProps {
  plan: PlanProduct;
  billingCycle: 'monthly' | 'yearly';
}

export function PlanPriceDisplay({ plan, billingCycle }: PlanPriceDisplayProps) {
  if (plan.price === 0) {
    return <div className="text-3xl font-bold">FREE</div>;
  }

  if (billingCycle === 'yearly') {
    const monthlyEquivalent = Math.round(plan.yearlyPrice / 12);
    const savings = (plan.price * 12) - plan.yearlyPrice;

    return (
      <div className="text-center">
        <div className="text-3xl font-bold">
          NT${monthlyEquivalent.toLocaleString()}
        </div>
        <div className="text-sm text-gray-500">/month</div>
        <div className="mt-2 text-sm">
          <span className="font-medium">NT${plan.yearlyPrice.toLocaleString()}</span>
          <span className="text-gray-500"> billed yearly</span>
        </div>
        <div className="mt-1 text-xs text-green-600 font-medium">
          Save NT${savings.toLocaleString()}/year
        </div>
      </div>
    );
  }

  return (
    <div className="text-center">
      <div className="text-3xl font-bold">
        NT${plan.price.toLocaleString()}
      </div>
      <div className="text-sm text-gray-500">/month</div>
    </div>
  );
}
```

#### 3.4.4 Checkout Flow Updates

**Cart Item for Yearly Plan**:
```
┌─────────────────────────────────────────────────────────────────────────┐
│  🛒 Your Cart                                                            │
│                                                                          │
│  ┌───────────────────────────────────────────────────────────────────┐  │
│  │  Voyager Plan - Yearly Subscription                                │  │
│  │                                                                    │  │
│  │  📅 Jan 2026 - Dec 2026 (12 months)                               │  │
│  │  🎁 Includes 3 bonus months (9+3 offer)                           │  │
│  │                                                                    │  │
│  │  Regular price: NT$23,880                                         │  │
│  │  Your price:    NT$17,910                                         │  │
│  │  You save:      NT$5,970 (25%)                          [Remove]  │  │
│  └───────────────────────────────────────────────────────────────────┘  │
│                                                                          │
│  ───────────────────────────────────────────────────────────────────    │
│                                                                          │
│  Subtotal:                                         NT$17,910            │
│                                                                          │
│  [Proceed to Checkout]                                                  │
└──────────────────────────────────────────────────────────────────────────┘
```

### 3.5 Subscription Management

#### 3.5.1 Member Settings - Subscription Section

```
┌─────────────────────────────────────────────────────────────────────────┐
│  Your Subscription                                                       │
│                                                                          │
│  ┌─────────────────────────────────────────────────────────────────┐    │
│  │  Current Plan: Voyager (Yearly)                                  │    │
│  │                                                                   │    │
│  │  Status: Active                                                   │    │
│  │  Billing Period: Jan 1, 2026 - Dec 31, 2026                      │    │
│  │  Months Remaining: 11                                            │    │
│  │                                                                   │    │
│  │  Next Billing: Dec 15, 2026                                      │    │
│  │  Renewal Amount: NT$17,910                                       │    │
│  │  Auto-Renew: ✅ On                                                │    │
│  │                                                                   │    │
│  │  [Manage Subscription]  [View Invoice History]                   │    │
│  └─────────────────────────────────────────────────────────────────┘    │
└──────────────────────────────────────────────────────────────────────────┘
```

#### 3.5.2 Upgrade/Downgrade Logic

```typescript
function calculateUpgradePrice(
  currentPlan: PlanType,
  currentCycle: BillingCycle,
  currentRemainingDays: number,
  newPlan: PlanType,
  newCycle: BillingCycle
): number {
  // Calculate prorated credit for remaining time
  const dailyRate = currentCycle === 'yearly'
    ? getPlanYearlyPrice(currentPlan) / 365
    : getPlanMonthlyPrice(currentPlan) / 30;

  const credit = dailyRate * currentRemainingDays;

  // Calculate new plan price
  const newPrice = newCycle === 'yearly'
    ? getPlanYearlyPrice(newPlan)
    : getPlanMonthlyPrice(newPlan);

  return Math.max(0, newPrice - credit);
}
```

---

## 4. Technical Implementation

### 4.1 New Files to Create

```
src/
├── features/
│   ├── sprint/
│   │   └── components/
│   │       └── VisibilityNotice.tsx       # Upload form notice
│   │       └── VisibilitySelector.tsx     # Post-sprint modal
│   │       └── VisibilitySettings.tsx     # Project settings panel
│   │
│   ├── shop/
│   │   └── components/
│   │       └── BillingToggle.tsx          # Monthly/Yearly toggle
│   │       └── PlanPriceDisplay.tsx       # Price with savings
│   │       └── YearlyOfferBanner.tsx      # 9+3 offer banner
│   │       └── PlanComparisonTable.tsx    # Full feature comparison
│   │
│   └── test/
│       └── components/
│           └── LevelAccessGate.tsx        # Level access control
│           └── UpgradePrompt.tsx          # Voyager upgrade prompt
│
├── lib/
│   └── db/
│       └── schema/
│           └── sprint.schema.ts           # Add visibility fields
│           └── user.schema.ts             # Add yearly billing fields
│
└── hooks/
    └── useSubscription.ts                 # Subscription management hook
```

### 4.2 Files to Modify

```
src/features/auth/types.ts
  - Add 'voyager' to IdentityType

src/features/auth/permissions.ts
  - Add Voyager permissions
  - Add test level permissions

src/features/shop/data/plans.ts
  - Add Voyager plan
  - Add yearlyPrice to all plans

src/features/shop/types.ts
  - Add yearlyPrice to PlanProduct
  - Update BillingCycle type

src/app/(public)/shop/plan/page.tsx
  - Add billing toggle
  - Add Voyager plan card

src/app/(public)/sprint/[seasonId]/[sprintId]/submit/page.tsx
  - Add visibility notice component
  - Add acknowledgment checkbox

src/app/(public)/sprint/project/[projectId]/page.tsx
  - Add visibility settings for owner
  - Implement access control

src/app/(public)/test/[level]/page.tsx
  - Add level access gate
  - Show upgrade prompt for locked levels

src/app/(public)/member/settings/page.tsx
  - Add subscription management section
```

### 4.3 API Endpoints / Repository Methods

```typescript
// Sprint Visibility
class ProjectRepository {
  updateVisibility(projectId: string, visibility: ProjectVisibility): void;
  getProjectsNeedingVisibilityChoice(userId: string): ProjectRecord[];
}

// Subscription Management
class SubscriptionRepository {
  createSubscription(userId: string, plan: PlanType, cycle: BillingCycle): UserSubscriptionRecord;
  upgradeSubscription(userId: string, newPlan: PlanType, newCycle: BillingCycle): UserSubscriptionRecord;
  toggleAutoRenew(userId: string, enabled: boolean): void;
  getSubscription(userId: string): UserSubscriptionRecord | null;
  calculateUpgradePrice(userId: string, newPlan: PlanType, newCycle: BillingCycle): number;
}

// Test Access
class TestAccessService {
  canAccessLevel(userId: string, level: number): boolean;
  getAccessibleLevels(userId: string): number[];
  getLevelLockReason(userId: string, level: number): string | null;
}
```

---

## 5. Migration Strategy

### Phase 1: Data Model Updates (Week 1)
1. Add visibility fields to ProjectRecord schema
2. Add voyager to IdentityType and permissions
3. Add yearlyPrice to plan products
4. Add billing cycle fields to subscription records

### Phase 2: Voyager Tier (Week 2)
1. Create Voyager plan in plans.ts
2. Update permission matrix
3. Implement test level access control
4. Add Voyager badge component

### Phase 3: Yearly Plans (Week 2-3)
1. Implement BillingToggle component
2. Update plan page with toggle
3. Update checkout flow for yearly billing
4. Add subscription management UI

### Phase 4: Sprint Visibility (Week 3-4)
1. Add visibility notice to upload form
2. Create post-sprint visibility prompt
3. Implement visibility settings panel
4. Add access control for project viewing

### Phase 5: Testing & Polish (Week 4)
1. End-to-end testing
2. Edge case handling
3. UI polish and animations
4. Documentation updates

---

## 6. Edge Cases & Validation

### 6.1 Sprint Visibility
- **Project deleted**: Remove from visibility prompt queue
- **Sprint cancelled**: All projects default to "nuvaclub-only"
- **User never chooses**: Defaults to "nuvaclub-only" after 30 days

### 6.2 Subscription Upgrades
- **Upgrade within trial**: Full price, no proration
- **Downgrade not allowed**: Must wait for renewal period
- **Mid-cycle upgrade**: Prorate remaining time as credit

### 6.3 Yearly Billing
- **Cancellation**: Access continues until period ends
- **Refunds**: Pro-rated based on months used (minimum 1 month charge)
- **Auto-renewal failure**: 7-day grace period with notifications

---

## 7. Success Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| **Sprint Visibility** | | |
| Visibility acknowledgment rate | >95% | Users who check the box |
| Post-sprint choice completion | >80% | Users who make visibility choice |
| Public share rate | >60% | Projects set to public |
| **Voyager Adoption** | | |
| Voyager conversion rate | >5% | New signups choosing Voyager |
| Traveler to Voyager upgrade | >10% | Existing Travelers upgrading |
| Test engagement (Voyager) | >70% | Voyagers attempting levels 4+ |
| **Yearly Plans** | | |
| Yearly selection rate | >40% | New subscribers choosing yearly |
| Yearly retention rate | >85% | Yearly subscribers renewing |
| LTV increase | >30% | Compared to monthly subscribers |

---

## 8. Open Questions

1. **Visibility inheritance**: If a user uploads to multiple sprints, should visibility choice apply to all or individually?
   - **Recommendation**: Individual per project

2. **Voyager early adopter discount**: Offer launch discount for first 100 subscribers?
   - **Recommendation**: Yes, 20% off first year

3. **Test certificates**: Should certificates be downloadable PDFs or digital badges?
   - **Recommendation**: Both - PDF and shareable digital badge

4. **Yearly refund policy**: Full refund within 14 days or prorated only?
   - **Recommendation**: Full refund within 14 days, prorated after

5. **Gift subscriptions**: Allow buying yearly plans as gifts?
   - **Recommendation**: Phase 2 feature

---

## 9. Appendix

### 9.1 Pricing Summary Table

| Plan | Monthly | Yearly Total | Yearly Monthly Eq. | Savings |
|------|---------|--------------|--------------------|---------|
| Explorer | NT$0 | NT$0 | NT$0 | - |
| Traveler | NT$990 | NT$8,910 | NT$742.50 | 25% |
| Voyager | NT$1,990 | NT$17,910 | NT$1,492.50 | 25% |

### 9.2 Permission Reference

```typescript
// Complete permission matrix
PERMISSION_MATRIX = {
  guest: [
    'learn:view_first_chapter',
    'forum:read',
    'sprint:view_projects',
    'shop:browse',
  ],
  explorer: [
    'learn:view_first_chapter',
    'learn:view_free_courses',
    'forum:read',
    'forum:like_comment',
    'sprint:view_projects',
    'shop:browse',
    'shop:purchase',
    'space:enter',
    'space:match',
    'space:create_post',
    'space:view_nunu',
    'test:basic_levels',
  ],
  'solo-traveler': [
    // All explorer permissions, plus:
    'learn:view_all_courses',
    'forum:post',
    'sprint:submit_project',
    'sprint:vote',
    'space:view_certified_nunu',
  ],
  voyager: [
    // All traveler permissions, plus:
    'test:intermediate_levels',
    'test:advanced_levels',
    'test:skill_badges',
    'space:view_shangzhe',
    'space:priority_matching',
    'sprint:featured_slot',
    'sprint:early_access',
    'learn:certificates',
  ],
};
```

### 9.3 Visibility State Diagram

```
┌─────────────┐     Upload      ┌──────────────────┐
│   Draft     │ ───────────────▶│  sprint-public   │
└─────────────┘                 └──────────────────┘
                                        │
                                        │ Sprint Ends
                                        ▼
                                ┌──────────────────┐
                                │  Prompt User     │
                                └──────────────────┘
                                   │         │
                     ┌─────────────┘         └─────────────┐
                     ▼                                     ▼
            ┌──────────────────┐               ┌──────────────────┐
            │  nuvaclub-only   │               │     public       │
            │  (Members only)  │               │  (Everyone)      │
            └──────────────────┘               └──────────────────┘
                     │                                     │
                     └──────────── Can Switch ─────────────┘
```

---

*Document Version: 1.0*
*Created: January 2026*
*Status: Draft - Pending Review*
