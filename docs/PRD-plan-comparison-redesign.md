# PRD: Plan Comparison Table Redesign

## Overview
Redesign the subscription plan comparison table at `/shop` to clearly communicate value propositions for each tier, improve UI/UX, and update pricing structure.

## Goals
1. Make it instantly clear what value each plan provides
2. Simplify feature comparison for quick decision-making
3. Update yearly billing to 10+2 offer (~17% discount)
4. Optimize button CTAs based on user state

---

## Plan Tier Value Propositions

### Explorer (FREE)
**Target:** New users exploring the platform
**Core Value:** "Start learning AI for free"

**Key Features:**
- Access all free courses (Level 1 courses)
- Browse first chapter of premium courses
- Basic Test system (Levels 1-3)
- Read and comment in Forum
- Browse Sprint projects
- View Space marketplace

### Traveler (NT$990/month | NT$9,900/year)
**Target:** Serious learners wanting full content access
**Core Value:** "Unlock full learning experience"

**Key Features:**
- Full access to ALL courses (60+ courses, Levels 1-10)
- Complete Test system (all 12 levels)
- Create posts in Forum
- Submit projects to Sprint
- Vote on Sprint submissions
- View Certified Nunus in Space
- Email support

### Voyager (NT$1,990/month | NT$19,900/year)
**Target:** Power users wanting mentorship and community leadership
**Core Value:** "Connect with mentors & lead the community"

**Key Features:**
- Everything in Traveler, plus:
- Meet Shangzhe mentors in Space (1:1 guidance)
- Featured Sprint submission slot
- Early access to Sprint themes
- Monthly AI Learning Report
- Skill badges & certificates
- Priority matching in Space
- Voyager profile badge
- Priority support

---

## Yearly Billing: 10+2 Offer

**Formula:** Pay for 10 months, get 12 months (2 months free)
**Discount:** ~17% off

| Plan | Monthly | Yearly (10+2) | Monthly Equivalent | Savings |
|------|---------|---------------|-------------------|---------|
| Explorer | FREE | FREE | FREE | - |
| Traveler | NT$990 | NT$9,900 | NT$825/mo | NT$1,980/year |
| Voyager | NT$1,990 | NT$19,900 | NT$1,658/mo | NT$3,980/year |

---

## UI/UX Design Specifications

### 1. Layout Structure
```
┌─────────────────────────────────────────────────────────────┐
│  [Monthly] [Yearly - Save 17%]     ← Billing Toggle         │
├─────────────────────────────────────────────────────────────┤
│  "Buy 10 months, get 2 FREE!"      ← Banner (yearly only)   │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐           │
│  │  EXPLORER   │ │  TRAVELER   │ │   VOYAGER   │           │
│  │    FREE     │ │   NT$990    │ │  NT$1,990   │           │
│  │             │ │   Popular   │ │  Best Value │           │
│  │  [Start     │ │ [Get        │ │ [Get        │           │
│  │   Free Now] │ │  Started]   │ │  Started]   │           │
│  └─────────────┘ └─────────────┘ └─────────────┘           │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│  FEATURE COMPARISON TABLE (grouped by category)             │
│                                                             │
│  📚 LEARN                                                   │
│  ├─ Free courses (Level 1)      ✓       ✓       ✓          │
│  ├─ All premium courses         ✗       ✓       ✓          │
│  └─ Course certificates         ✗       ✗       ✓          │
│                                                             │
│  📝 TEST                                                    │
│  ├─ Basic levels (1-3)          ✓       ✓       ✓          │
│  ├─ All 12 levels               ✗       ✓       ✓          │
│  └─ Skill badges                ✗       ✗       ✓          │
│                                                             │
│  💬 FORUM                                                   │
│  ├─ Read & comment              ✓       ✓       ✓          │
│  └─ Create posts                ✗       ✓       ✓          │
│                                                             │
│  🚀 SPRINT                                                  │
│  ├─ Browse projects             ✓       ✓       ✓          │
│  ├─ Upload & vote               ✗       ✓       ✓          │
│  ├─ Featured slot               ✗       ✗       ✓          │
│  └─ Early theme access          ✗       ✗       ✓          │
│                                                             │
│  🌌 SPACE                                                   │
│  ├─ Browse marketplace          ✓       ✓       ✓          │
│  ├─ View Certified Nunus        ✗       ✓       ✓          │
│  ├─ Meet Shangzhe mentors       ✗       ✗       ✓          │
│  └─ Priority matching           ✗       ✗       ✓          │
│                                                             │
│  ⭐ EXTRAS                                                  │
│  ├─ Monthly AI Learning Report  ✗       ✗       ✓          │
│  ├─ Voyager profile badge       ✗       ✗       ✓          │
│  └─ Priority support            ✗       Email   Priority   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 2. Visual Design

**Color Scheme:**
- Explorer: Blue (primary-400/500)
- Traveler: Gold/Amber (accent-400/500)
- Voyager: Purple (purple-400/500)

**Card Headers:**
- Plan name with tier color
- Price (large, bold)
- Short tagline describing core value
- Badge for Popular/Best Value

**Feature Table:**
- Grouped by category with emoji icons
- Category headers in semi-bold
- Alternating row backgrounds for readability
- Green checkmarks, muted X marks
- Text values where applicable (e.g., "Email" vs "Priority")

### 3. Button States

| User State | Explorer | Traveler | Voyager |
|------------|----------|----------|---------|
| Guest | "Start Free Now" | "Get Started" | "Get Started" |
| Explorer | "Current Plan" (disabled) | "Upgrade" | "Upgrade" |
| Traveler | "Downgrade" (ghost) | "Current Plan" (disabled) | "Upgrade" |
| Voyager | "Downgrade" (ghost) | "Downgrade" (ghost) | "Current Plan" (disabled) |

### 4. Responsive Behavior

**Desktop (≥1024px):**
- Full table with all columns visible
- Plan headers in single row

**Tablet (768px-1023px):**
- Horizontal scroll for table
- Sticky first column (feature names)

**Mobile (<768px):**
- Stack plans vertically as cards
- Each card shows its features
- Swipe between plans or accordion

---

## Implementation Checklist

### Files to Update:

1. **`/src/features/shop/data/plans.ts`**
   - Update yearlyPrice: Traveler = 9900, Voyager = 19900
   - Update helper functions for new discount calculation

2. **`/src/features/shop/data/comparisons.ts`**
   - Reorganize features by category
   - Add new features: Monthly AI Learning Report
   - Update feature descriptions for clarity

3. **`/src/features/shop/components/PlanComparisonSection.tsx`**
   - Redesign table layout with category groupings
   - Update button logic for guest vs logged-in states
   - Add category icons/headers
   - Update yearly banner text to "10+2"
   - Change "Save 25%" to "Save 17%"

4. **`/src/mocks/config/comparisons.mock.ts`**
   - Mirror updates from comparisons.ts

5. **`/src/mocks/entities/plans.mock.ts`**
   - Update yearlyPrice values

6. **`/src/app/(public)/shop/page.tsx`**
   - Update FAQ about yearly offer

---

## Success Metrics
- Clear visual hierarchy showing value progression
- Users can identify their ideal plan within 10 seconds
- Feature groupings make comparison intuitive
- CTA buttons clearly indicate next action

---

## Timeline
Single implementation session - all changes in one commit.
