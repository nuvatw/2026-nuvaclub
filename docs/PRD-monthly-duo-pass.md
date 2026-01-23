# PRD: Monthly Duo Pass System

## Executive Summary

Transform the current Duo ticket system from a simple duration-based model (monthly/quarterly) to a **month-specific pass system** where each Duo purchase is tagged to specific calendar months. This enables users to:
1. Purchase Duo passes for specific months (e.g., "March 2026")
2. View their Duo calendar showing which months they have access
3. Match with Nunus only during months where they have active passes
4. Prevent duplicate purchases with upgrade prompts

---

## 1. Problem Statement

### Current State
- Duo tickets have simple `validFrom` and `validUntil` dates
- Users purchase "1 month" or "3 months" without specifying which months
- No visibility into future month coverage
- No mechanism to prevent duplicate month purchases
- Matching doesn't consider month-specific validity

### Desired State
- Each Duo purchase is tied to specific calendar months (e.g., "2026-03", "2026-04")
- Users see a visual calendar of their Duo coverage
- Matching invitations require selecting a valid month
- System prevents duplicate purchases and offers upgrade paths

---

## 2. User Stories

### As a Vava (Learner)
1. **US-1**: When adding Duo to cart, I can select which specific month(s) I want to purchase
2. **US-2**: In my Space, I can see a calendar view showing which months I have Duo passes for
3. **US-3**: When inviting a Nunu, I must select which of my active months I want the relationship for
4. **US-4**: I can only see Nunus matching my tier for each specific month
5. **US-5**: If I try to buy a month I already own, I'm prompted to upgrade instead
6. **US-6**: I can see which Nunu types (Regular/Certified/Shangzhe) each of my monthly passes grants

### As a Nunu (Mentor)
1. **US-7**: When receiving an invite, I can see which month the Vava wants to match for
2. **US-8**: I can view my matched Vavas organized by month
3. **US-9**: I can see my availability slots per month based on my Nunu level limits

---

## 3. Data Model Changes

### 3.1 New Type: `DuoMonthPass`

```typescript
// src/lib/db/schema/user.schema.ts

interface DuoMonthPass {
  id: string;
  userId: string;

  // Month specification (YYYY-MM format)
  month: string;  // e.g., "2026-03"

  // Tier for this specific month
  tier: 'duo-go' | 'duo-run' | 'duo-fly';

  // Purchase tracking
  purchasedAt: Date;
  orderId: string;

  // Status
  status: 'active' | 'expired' | 'upgraded' | 'refunded';

  // If upgraded, reference to new pass
  upgradedToId?: string;

  // Matching capacity for this month
  maxCompanions: number;  // Based on tier: 1/5/unlimited
  currentCompanions: number;
}
```

### 3.2 Updated `CartItem` for Month Selection

```typescript
// src/features/shop/types.ts

interface CartItem {
  productId: string;
  productType: ProductType;
  name: string;
  price: number;
  imageUrl?: string;
  quantity: number;
  selectedVariant?: MerchandiseVariant;

  // NEW: For Duo tickets
  selectedMonths?: string[];  // Array of "YYYY-MM" strings

  // DEPRECATED: Remove selectedPeriod in favor of selectedMonths
  // selectedPeriod?: BillingCycle;
}
```

### 3.3 Updated `Match` / `Mentorship` Records

```typescript
// src/lib/db/schema/space.schema.ts

interface MatchRecord {
  id: string;
  companionId: string;
  userId: string;

  // NEW: Month this match is for
  forMonth: string;  // "YYYY-MM"

  status: 'pending' | 'accepted' | 'rejected' | 'expired';
  matchedAt?: Date;
  createdAt: Date;
}

interface UserMentorshipRecord {
  id: string;
  nunuId: string;
  vavaId: string;

  // NEW: Month(s) this mentorship covers
  months: string[];  // Array of "YYYY-MM"

  status: 'active' | 'completed' | 'paused';
  startedAt: Date;
  lastSessionAt?: Date;
  sessionCount: number;
}
```

### 3.4 New Collection: `DuoMonthPasses`

```typescript
// Add to MockDB collections

duoMonthPasses: Collection<DuoMonthPass>
```

---

## 4. Feature Specifications

### 4.1 Month Selection in Cart (Add to Cart Flow)

#### UI Component: `DuoMonthSelector`

**Location**: Modal/drawer that appears when clicking "Add to Cart" on a Duo product

**Layout**:
```
┌─────────────────────────────────────────────────┐
│  Select Your Duo {tier} Months                  │
│                                                 │
│  ┌─────────────────────────────────────────┐   │
│  │         2026                             │   │
│  │  Jan  Feb  Mar  Apr  May  Jun           │   │
│  │  [●]  [●]  [ ]  [ ]  [ ]  [ ]           │   │
│  │  Jul  Aug  Sep  Oct  Nov  Dec           │   │
│  │  [ ]  [ ]  [ ]  [ ]  [ ]  [ ]           │   │
│  │                                          │   │
│  │         2027                             │   │
│  │  Jan  Feb  Mar  Apr  May  Jun           │   │
│  │  [ ]  [ ]  [ ]  [ ]  [ ]  [ ]           │   │
│  └─────────────────────────────────────────┘   │
│                                                 │
│  ┌─ Already Owned ─────────────────────────┐   │
│  │ 🔒 Jan 2026 (Duo Go) - [Upgrade to Run] │   │
│  │ 🔒 Feb 2026 (Duo Go) - [Upgrade to Run] │   │
│  └─────────────────────────────────────────┘   │
│                                                 │
│  Selected: 0 months × 990 TWD = 0 TWD          │
│                                                 │
│  [Cancel]                    [Add to Cart]     │
└─────────────────────────────────────────────────┘
```

**Behavior**:
1. Show 12-month rolling calendar starting from current month
2. Already-owned months shown as locked with tier badge
3. Clicking owned month shows upgrade prompt
4. Multi-select allowed for purchasing multiple months at once
5. Price updates dynamically based on selections
6. Tier-specific pricing:
   - Duo Go: 990 TWD/month
   - Duo Run: 2,490 TWD/month (can buy 1-3 months)
   - Duo Fly: 4,990 TWD/month (can buy 1-3 months)

#### Upgrade Flow

When user clicks an already-owned month of a lower tier:

```
┌─────────────────────────────────────────────────┐
│  Upgrade March 2026                             │
│                                                 │
│  You already have Duo Go for this month.        │
│  Would you like to upgrade?                     │
│                                                 │
│  Current: Duo Go (Regular Nunu access)          │
│                                                 │
│  ↓ Upgrade to:                                  │
│                                                 │
│  ○ Duo Run - 1,500 TWD (difference)             │
│    • Access Certified Nunus                     │
│    • Up to 5 companion slots                    │
│                                                 │
│  ○ Duo Fly - 4,000 TWD (difference)             │
│    • Access Shangzhe (Founders)                 │
│    • Unlimited companion slots                  │
│    • 1:1 career consulting                      │
│                                                 │
│  [Cancel]                    [Upgrade]          │
└─────────────────────────────────────────────────┘
```

---

### 4.2 Space Section: Duo Calendar View

#### UI Component: `DuoCalendarView`

**Location**: `/member/space` - New section above companion lists

**Layout**:
```
┌─────────────────────────────────────────────────────────────┐
│  My Duo Passes                                    [+ Buy]   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  2026                                               │   │
│  │                                                     │   │
│  │  Jan        Feb        Mar        Apr        May    │   │
│  │  ┌────┐    ┌────┐    ┌────┐    ┌────┐    ┌────┐   │   │
│  │  │ GO │    │ GO │    │RUN │    │RUN │    │    │   │   │
│  │  │1/1 │    │1/1 │    │3/5 │    │0/5 │    │    │   │   │
│  │  └────┘    └────┘    └────┘    └────┘    └────┘   │   │
│  │   ↑          ↑          ↑         ↑                │   │
│  │ 1 Nunu    1 Nunu    3 Nunus   Available           │   │
│  │                                                     │   │
│  │  Jun        Jul        Aug        Sep        Oct    │   │
│  │  ┌────┐    ┌────┐    ┌────┐    ┌────┐    ┌────┐   │   │
│  │  │    │    │    │    │    │    │    │    │    │   │   │
│  │  │    │    │    │    │    │    │    │    │    │   │   │
│  │  └────┘    └────┘    └────┘    └────┘    └────┘   │   │
│  │                                                     │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  Legend: 🟢 GO  🟡 RUN  🟣 FLY  ⬜ No Pass                  │
│                                                             │
│  ─────────────────────────────────────────────────────────  │
│                                                             │
│  Click a month to see available Nunus for that period       │
└─────────────────────────────────────────────────────────────┘
```

**Features**:
1. Color-coded tiles by tier (Go=green, Run=yellow, Fly=purple)
2. Shows companion slots used vs available
3. Clicking a month filters the Nunu list to show only matching tier
4. Empty months show "Buy" button on hover
5. Shows next 12 months rolling window

#### Month Detail View

When clicking a month tile:

```
┌─────────────────────────────────────────────────────────────┐
│  March 2026 - Duo Run                           [Upgrade]   │
│                                                             │
│  Access Level: Certified Nunu                               │
│  Companion Slots: 3/5 used                                  │
│                                                             │
│  ┌─ Your Nunus This Month ─────────────────────────────┐   │
│  │                                                      │   │
│  │  [Avatar] Sarah Chen        Certified    Active     │   │
│  │           UX Research       Since Mar 1             │   │
│  │                                                      │   │
│  │  [Avatar] Mike Johnson      Certified    Active     │   │
│  │           Frontend Dev      Since Mar 5             │   │
│  │                                                      │   │
│  │  [Avatar] Lisa Wang         Certified    Pending    │   │
│  │           Product Design    Invited Mar 10          │   │
│  │                                                      │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                             │
│  [Find More Nunus for March]                                │
└─────────────────────────────────────────────────────────────┘
```

---

### 4.3 Nunu Filtering by Month & Tier

#### Updated Space Browse View

**Location**: `/space` - Main Nunu browsing page

**New Filter Bar**:
```
┌─────────────────────────────────────────────────────────────┐
│  Filter by Month:                                           │
│                                                             │
│  [Jan ▼] [Feb ▼] [Mar ●] [Apr ●] [May ▼] [Jun ▼] ...       │
│                                                             │
│  ● = You have a pass   ▼ = No pass (Buy to unlock)         │
│                                                             │
│  Currently viewing: March 2026 (Duo Run - Certified Nunus)  │
└─────────────────────────────────────────────────────────────┘
```

**Nunu List Filtering Logic**:

```typescript
function getAvailableNunus(userPasses: DuoMonthPass[], selectedMonth: string) {
  const pass = userPasses.find(p => p.month === selectedMonth);

  if (!pass) {
    return []; // No pass for this month - show "Buy" prompt
  }

  switch (pass.tier) {
    case 'duo-go':
      return nunus.filter(n => n.type === 'nunu');  // Regular only
    case 'duo-run':
      return nunus.filter(n => ['nunu', 'certified'].includes(n.type));
    case 'duo-fly':
      return nunus;  // All types including Shangzhe
  }
}
```

**Nunu Card Update**:
Add month availability indicator:
```
┌────────────────────────────────┐
│  [Avatar]                      │
│  Sarah Chen                    │
│  ⭐ Certified Nunu             │
│  UX Research • Product Design  │
│  Rating: 4.8 (23 reviews)      │
│                                │
│  Available: Mar, Apr, May      │
│                                │
│  [View Profile] [Invite →]    │
└────────────────────────────────┘
```

---

### 4.4 Invite Flow with Month Selection

#### Updated Invite Modal

When clicking "Invite" on a Nunu:

```
┌─────────────────────────────────────────────────────────────┐
│  Invite Sarah Chen                                          │
│  ⭐ Certified Nunu • UX Research                            │
│                                                             │
│  ─────────────────────────────────────────────────────────  │
│                                                             │
│  Select Month for Mentorship:                               │
│                                                             │
│  Your available months with Certified Nunu access:          │
│                                                             │
│  ○ March 2026 (Duo Run) - 2/5 slots used                   │
│  ● April 2026 (Duo Run) - 0/5 slots available              │
│                                                             │
│  ⚠️ January & February only have Duo Go (Regular Nunu)      │
│     Upgrade to invite Certified Nunus → [Upgrade]           │
│                                                             │
│  ─────────────────────────────────────────────────────────  │
│                                                             │
│  Message (optional):                                        │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ Hi Sarah! I'd love to learn UX research from you...  │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
│  [Cancel]                              [Send Invite]        │
└─────────────────────────────────────────────────────────────┘
```

**Validation Rules**:
1. User must have a pass for at least one upcoming month
2. Pass tier must match or exceed Nunu type requirement
3. User must have available slots for selected month
4. Cannot invite same Nunu for same month twice

**Error States**:
- "No passes available" → Show buy prompt
- "No matching tier" → Show upgrade prompt
- "All slots used" → Show "slot full" message
- "Already invited" → Show "pending invite" status

---

### 4.5 Duplicate Purchase Prevention

#### Detection Logic

```typescript
function checkDuplicatePurchase(
  userId: string,
  selectedMonths: string[],
  newTier: DuoTier
): DuplicateCheckResult {
  const existingPasses = getUserPasses(userId);
  const conflicts: MonthConflict[] = [];

  for (const month of selectedMonths) {
    const existing = existingPasses.find(p => p.month === month);

    if (existing) {
      const tierRank = { 'duo-go': 1, 'duo-run': 2, 'duo-fly': 3 };

      if (tierRank[newTier] <= tierRank[existing.tier]) {
        conflicts.push({
          month,
          existingTier: existing.tier,
          action: 'already_owned_same_or_higher'
        });
      } else {
        conflicts.push({
          month,
          existingTier: existing.tier,
          newTier,
          action: 'upgrade_available',
          priceDifference: calculateUpgradePrice(existing.tier, newTier)
        });
      }
    }
  }

  return { conflicts, canProceed: conflicts.length === 0 };
}
```

#### UI Feedback

**Scenario 1: Same or Higher Tier Already Owned**
```
┌─────────────────────────────────────────────────────────────┐
│  ⚠️ Already Owned                                           │
│                                                             │
│  You already have Duo Run for March 2026.                   │
│                                                             │
│  This is the same or higher tier than what you're trying    │
│  to purchase. No action needed!                             │
│                                                             │
│  Current access for March 2026:                             │
│  • Certified Nunu matching                                  │
│  • Up to 5 companion slots                                  │
│  • Discord community access                                 │
│                                                             │
│  [View My Passes]                            [OK]           │
└─────────────────────────────────────────────────────────────┘
```

**Scenario 2: Lower Tier Owned - Upgrade Available**
```
┌─────────────────────────────────────────────────────────────┐
│  🔄 Upgrade Available                                       │
│                                                             │
│  You have Duo Go for March 2026.                           │
│  Would you like to upgrade to Duo Run?                      │
│                                                             │
│  ┌─ Current (Duo Go) ─────┐  ┌─ Upgrade (Duo Run) ─────┐   │
│  │ • Regular Nunu         │  │ • Certified Nunu        │   │
│  │ • 1 companion slot     │  │ • 5 companion slots     │   │
│  │ • Basic Discord        │→ │ • Priority matching     │   │
│  │                        │  │ • Professional guidance │   │
│  └────────────────────────┘  └─────────────────────────┘   │
│                                                             │
│  Upgrade price: 1,500 TWD (2,490 - 990 already paid)       │
│                                                             │
│  [Cancel]                              [Upgrade Now]        │
└─────────────────────────────────────────────────────────────┘
```

---

## 5. Technical Implementation

### 5.1 New Files to Create

```
src/
├── features/
│   ├── shop/
│   │   └── components/
│   │       └── DuoMonthSelector.tsx        # Month picker modal
│   │       └── DuoUpgradeModal.tsx         # Upgrade prompt
│   │       └── DuoMonthCalendar.tsx        # Reusable calendar grid
│   │
│   ├── space/
│   │   └── components/
│   │       └── DuoCalendarView.tsx         # My passes calendar
│   │       └── MonthDetailPanel.tsx        # Selected month details
│   │       └── MonthFilter.tsx             # Month filter bar
│   │       └── InviteModal.tsx             # Updated invite with month
│   │
│   └── duo/                                 # NEW feature module
│       ├── types.ts                         # Duo-specific types
│       ├── hooks/
│       │   └── useDuoMonthPasses.ts        # Fetch user's passes
│       │   └── useDuoUpgrade.ts            # Upgrade logic
│       │   └── useDuoValidation.ts         # Purchase validation
│       └── utils/
│           └── month-utils.ts              # Month formatting helpers
│           └── tier-utils.ts               # Tier comparison helpers
│
├── lib/
│   └── db/
│       ├── schema/
│       │   └── duo.schema.ts               # DuoMonthPass schema
│       └── repositories/
│           └── duo.repository.ts           # Duo data access
```

### 5.2 Files to Modify

```
src/features/shop/components/cart/CartProvider.tsx
  - Update CartItem type for selectedMonths
  - Add month validation to addToCart

src/features/shop/components/ProductCard.tsx
  - Trigger month selector instead of direct add

src/features/checkout/context/CheckoutContext.tsx
  - Handle monthly pass creation on order complete

src/app/(public)/member/space/page.tsx
  - Add DuoCalendarView component
  - Filter companions by selected month

src/app/(public)/space/page.tsx
  - Add month filter bar
  - Filter Nunu list by month & tier

src/lib/db/schema/space.schema.ts
  - Add forMonth to MatchRecord
  - Add months array to MentorshipRecord

src/lib/db/schema/user.schema.ts
  - Deprecate UserDuoTicketRecord
  - Add DuoMonthPassRecord
```

### 5.3 API / Repository Methods

```typescript
// duo.repository.ts

class DuoRepository {
  // Get user's passes for display
  getUserPasses(userId: string): DuoMonthPass[]

  // Get passes for specific months
  getPassesForMonths(userId: string, months: string[]): DuoMonthPass[]

  // Check if user has valid pass for month + tier
  hasValidPass(userId: string, month: string, minTier: DuoTier): boolean

  // Create new passes from purchase
  createPasses(userId: string, months: string[], tier: DuoTier, orderId: string): DuoMonthPass[]

  // Upgrade existing pass
  upgradePass(passId: string, newTier: DuoTier, orderId: string): DuoMonthPass

  // Get available months (next 12 months)
  getAvailableMonths(): string[]

  // Get companion count for month
  getCompanionCount(userId: string, month: string): { current: number, max: number }

  // Increment companion count
  incrementCompanionCount(userId: string, month: string): void
}
```

---

## 6. Migration Strategy

### Phase 1: Data Model
1. Create `DuoMonthPass` schema and collection
2. Write migration script to convert existing `UserDuoTicket` records:
   - Calculate which months are covered by `validFrom` → `validUntil`
   - Create `DuoMonthPass` for each month
   - Map tier correctly

### Phase 2: Cart & Checkout
1. Implement `DuoMonthSelector` component
2. Update `CartItem` to use `selectedMonths`
3. Update checkout to create `DuoMonthPass` records

### Phase 3: Space Integration
1. Add `DuoCalendarView` to member space
2. Update Nunu browsing with month filter
3. Update invite flow with month selection

### Phase 4: Validation & Polish
1. Add duplicate purchase detection
2. Add upgrade prompts
3. Polish UX and animations

---

## 7. Edge Cases & Validation

### 7.1 Time Zone Handling
- All months stored in UTC
- Display in user's local timezone
- Month boundaries at midnight UTC

### 7.2 Expired Passes
- Passes for past months marked as 'expired' automatically
- Expired passes not shown in selector
- Expired matches remain visible in history

### 7.3 Refunds
- Refunded passes marked as 'refunded'
- Active matches for refunded months → status changed to 'expired'
- Nunu notified of early termination

### 7.4 Mid-Month Purchases
- Pass valid for entire calendar month
- Even if purchased on March 15th, valid for all of March
- No pro-rating (simplicity over complexity)

### 7.5 Slot Limits
- Duo Go: 1 companion per month
- Duo Run: 5 companions per month
- Duo Fly: Unlimited
- Slots are per-month, not total

---

## 8. Success Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| Month selection completion rate | >85% | Users who add to cart after opening selector |
| Upgrade conversion rate | >20% | Users who upgrade when prompted |
| Multi-month purchase rate | >40% | Users buying 2+ months at once |
| Space calendar engagement | >60% | Users who interact with calendar view |
| Match-to-month accuracy | 100% | Matches only created for valid months |

---

## 9. Open Questions

1. **Carryover slots**: If user has 5 slots in March but only uses 3, do unused slots carry to April?
   - **Recommendation**: No carryover (keeps logic simple)

2. **Multi-month matches**: Can a match span multiple months (e.g., March-April)?
   - **Recommendation**: Yes, but requires passes for all months

3. **Gift purchases**: Can users buy month passes for others?
   - **Recommendation**: Phase 2 feature

4. **Bulk discounts**: Discount for buying 6+ months at once?
   - **Recommendation**: Yes, 10% discount for 6+ months

5. **Auto-renewal**: Should months auto-renew?
   - **Recommendation**: No, keep as one-time purchases for MVP

---

## 10. Appendix: UI Mockups Reference

### Color Palette for Tiers
```css
--duo-go-primary: #22c55e;     /* Green 500 */
--duo-go-bg: #dcfce7;          /* Green 100 */

--duo-run-primary: #eab308;    /* Yellow 500 */
--duo-run-bg: #fef9c3;         /* Yellow 100 */

--duo-fly-primary: #a855f7;    /* Purple 500 */
--duo-fly-bg: #f3e8ff;         /* Purple 100 */

--no-pass-primary: #6b7280;    /* Gray 500 */
--no-pass-bg: #f3f4f6;         /* Gray 100 */
```

### Month Format
- Storage: `"2026-03"` (ISO format)
- Display: `"March 2026"` or `"Mar '26"` (short)
- Sorting: Lexicographic (ISO format sorts correctly)

---

*Document Version: 1.0*
*Created: January 2026*
*Status: Draft - Pending Review*
