# PRD: Page Layout Standardization & Guest Space Access

## Overview

This PRD outlines the implementation plan to standardize page layouts across the platform and enable guest access to the Space page while keeping personal sections locked.

---

## Goals

1. **Standardize page layouts** - Make Test, Forum, Space, Sprint pages follow the Shop page layout pattern (no page-level heading and description, just show content sections directly)
2. **Enable guest Space access** - Allow guests to view the Space marketplace (MatchingBoard)
3. **Lock personal sections** - Keep "My Nunu" and "My Vava" sections locked for guests

---

## Current State Analysis

### Shop Page Layout (Reference Pattern)
**File:** `src/app/(public)/shop/page.tsx`

The Shop page follows a clean, content-first layout:
```
├── PageTransition wrapper
└── Container (max-w-7xl, py-8)
    ├── Category Pills (inline selection)
    └── CategoryDetails (main content section)
        ├── Products Grid / PlanComparisonSection
        ├── Introduction Card
        └── FAQ Section
```

**Key characteristics:**
- NO page-level h1 title or description paragraph
- Uses a short instructional text: "Choose a category to explore our offerings"
- Content sections are immediately visible
- Clean, minimal header area

### Current Pages (Need Updates)

#### Forum Page (`src/app/(public)/forum/page.tsx`)
**Current header:**
```jsx
<h1 className="text-2xl sm:text-[28px] font-bold text-[#d7dadc]">Community Forum</h1>
<p className="text-sm text-[#818384] mt-1">Share ideas, ask questions, and learn together</p>
```
**To remove:** Lines 493-499 (h1 and p tags)

#### Space Page (`src/app/(public)/space/page.tsx`)
**Current header:**
```jsx
<h1 className="text-3xl font-bold text-white mb-2">Space</h1>
<p className="text-neutral-400">Find mentors, connect with learners, grow together</p>
```
**To remove:** Lines 100-106 (h1 and p tags)

**Current guest access:** Shows locked screen with login prompt
**To change:** Allow guests to view MatchingBoard, lock My Nunu/My Vava sections

#### Sprint Page (`src/app/(public)/sprint/page.tsx`)
**Current header:**
```jsx
<h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">Sprint</h1>
<p className="text-lg text-neutral-400 max-w-2xl mx-auto">
  Turn learning into creations. Join Sprint challenges and showcase your skills.
</p>
```
**To remove:** Lines 103-117 (hero section with h1 and p)

#### Test Page (`src/app/(public)/test/page.tsx`)
**Current header:**
```jsx
<h1 className="text-3xl font-bold text-white mb-2">AI Skills Test</h1>
<p className="text-neutral-400">Complete 12 levels of tests to verify your AI application skills</p>
```
**To remove:** Lines 96-101 (div containing h1 and p)

#### Learn Page (`src/app/(public)/learn/page.tsx`)
**Status:** Already follows content-first pattern with VideoHero - NO CHANGES NEEDED

---

## Implementation Plan

### Phase 1: Forum Page Layout Update

**File:** `src/app/(public)/forum/page.tsx`

**Changes:**
1. Remove the page header section (h1 "Community Forum" and description p)
2. Keep the search bar and create post button section
3. Move the FeedToolbar to be the first visible element after the top bar

**Before:**
```jsx
{/* Page Header */}
<motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mb-5">
  <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-4">
    <div>
      <h1 className="text-2xl sm:text-[28px] font-bold text-[#d7dadc]">Community Forum</h1>
      <p className="text-sm text-[#818384] mt-1">Share ideas, ask questions, and learn together</p>
    </div>
  </div>
  {/* Global Search with Create Post */}
  ...
</motion.div>
```

**After:**
```jsx
{/* Search and Create Post */}
<motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mb-5">
  {/* Global Search with Create Post */}
  <div className="flex items-center justify-center gap-3 max-w-xl mx-auto">
    ...
  </div>
</motion.div>
```

---

### Phase 2: Space Page Layout Update

**File:** `src/app/(public)/space/page.tsx`

**Changes:**
1. Remove the page header section (h1 "Space" and description p)
2. Remove the guest locked screen (entire if block for !isLoggedIn)
3. Allow all users (including guests) to see the main Space content
4. Add locked state to MyNunuSection and MyVavaSection for guests
5. Keep "My Space" button visible but link to login for guests

**Before:**
```jsx
if (!isLoggedIn) {
  return (
    <PageTransition skeleton={<SpaceLockedSkeleton />}>
      // ... locked screen with login prompt
    </PageTransition>
  );
}

return (
  <PageTransition skeleton={<SpacePageSkeleton />}>
    <div className="min-h-screen py-8">
      {/* Header */}
      <motion.div>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Space</h1>
            <p className="text-neutral-400">Find mentors, connect with learners, grow together</p>
          </div>
          <Link href="/member/space">
            <Button variant="secondary">My Space</Button>
          </Link>
        </div>
      </motion.div>

      {/* Quick Stats */}
      ...

      {/* My Nunu Section */}
      <MyNunuSection onNavigateToMatchingBoard={() => {}} />

      {/* My Vava Section */}
      <MyVavaSection onNavigateToMatchingBoard={() => {}} />

      {/* Matching Board */}
      <MatchingBoardSection />
    </div>
  </PageTransition>
);
```

**After:**
```jsx
return (
  <PageTransition skeleton={<SpacePageSkeleton />}>
    <div className="min-h-screen py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Quick Stats (always visible) */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-3 gap-4 mb-8">
          ...
        </motion.div>

        {/* My Nunu Section - Locked for guests */}
        {isLoggedIn ? (
          <MyNunuSection onNavigateToMatchingBoard={() => {}} />
        ) : (
          <LockedMyNunuSection />
        )}

        {/* My Vava Section - Locked for guests */}
        {isLoggedIn ? (
          <MyVavaSection onNavigateToMatchingBoard={() => {}} />
        ) : (
          <LockedMyVavaSection />
        )}

        {/* Matching Board (always visible) */}
        <MatchingBoardSection />
      </div>
    </div>
  </PageTransition>
);
```

**New Components Needed:**

1. **LockedMyNunuSection** - Compact locked card for My Nunu
2. **LockedMyVavaSection** - Compact locked card for My Vava

These should be small, non-intrusive locked states that:
- Show a brief description of what the section is
- Show a "Sign in to view" call-to-action
- Use a lock icon and muted styling
- Don't take up too much vertical space

---

### Phase 3: Sprint Page Layout Update

**File:** `src/app/(public)/sprint/page.tsx`

**Changes:**
1. Remove the hero section with h1 "Sprint" and description paragraph
2. Start directly with the "Current Sprint" section (if active season exists)
3. Remove the gradient background hero wrapper

**Before:**
```jsx
<div className="min-h-screen">
  {/* Hero Section */}
  <div className="py-12 sm:py-16 bg-gradient-to-b from-neutral-900 to-neutral-950">
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
        <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">Sprint</h1>
        <p className="text-lg text-neutral-400 max-w-2xl mx-auto">
          Turn learning into creations. Join Sprint challenges and showcase your skills.
        </p>
      </motion.div>
    </div>
  </div>

  {/* Section 1: Ongoing Sprint */}
  ...
```

**After:**
```jsx
<div className="min-h-screen py-8">
  {/* Section 1: Ongoing Sprint */}
  {currentSeason && (
    <section className="mb-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        ...
      </div>
    </section>
  )}

  {/* Section 2: Project Library */}
  ...
```

---

### Phase 4: Test Page Layout Update

**File:** `src/app/(public)/test/page.tsx`

**Changes:**
1. Remove the page title section (h1 "AI Skills Test" and description p)
2. Start directly with the TestLevelProgressBar
3. Adjust padding/margins accordingly

**Before:**
```jsx
<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
  {/* Page Title */}
  <div className="mb-8">
    <h1 className="text-3xl font-bold text-white mb-2">AI Skills Test</h1>
    <p className="text-neutral-400">Complete 12 levels of tests to verify your AI application skills</p>
  </div>

  {/* Progress Bar */}
  <div className="mb-8">
    <TestLevelProgressBar ... />
  </div>
```

**After:**
```jsx
<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
  {/* Progress Bar */}
  <div className="mb-8">
    <TestLevelProgressBar ... />
  </div>
```

---

## Locked Section Components

### LockedMyNunuSection

**File:** `src/features/space/components/MySpaceSection/LockedMyNunuSection.tsx`

```tsx
'use client';

import { motion } from 'motion/react';
import { LockIcon, UserIcon } from '@/components/icons';
import { Button } from '@/components/atoms';

export function LockedMyNunuSection() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="mb-8"
    >
      <div className="rounded-xl border border-neutral-800 bg-neutral-900/50 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center">
              <LockIcon size="md" className="text-amber-500/50" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                My Nunu
                <LockIcon size="sm" className="text-neutral-500" />
              </h2>
              <p className="text-sm text-neutral-500">Sign in to view your mentor</p>
            </div>
          </div>
          <Button variant="secondary" size="sm">Sign In</Button>
        </div>
      </div>
    </motion.div>
  );
}
```

### LockedMyVavaSection

**File:** `src/features/space/components/MySpaceSection/LockedMyVavaSection.tsx`

```tsx
'use client';

import { motion } from 'motion/react';
import { LockIcon, UsersIcon } from '@/components/icons';
import { Button } from '@/components/atoms';

export function LockedMyVavaSection() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="mb-8"
    >
      <div className="rounded-xl border border-neutral-800 bg-neutral-900/50 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center">
              <LockIcon size="md" className="text-green-500/50" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                My Vava
                <LockIcon size="sm" className="text-neutral-500" />
              </h2>
              <p className="text-sm text-neutral-500">Sign in to view your learners</p>
            </div>
          </div>
          <Button variant="secondary" size="sm">Sign In</Button>
        </div>
      </div>
    </motion.div>
  );
}
```

---

## Summary of Changes

### Files to Modify

| File | Changes |
|------|---------|
| `src/app/(public)/forum/page.tsx` | Remove h1 "Community Forum" and description p tag |
| `src/app/(public)/space/page.tsx` | Remove header, remove guest locked screen, add conditional rendering for My Nunu/My Vava |
| `src/app/(public)/sprint/page.tsx` | Remove hero section with h1 "Sprint" and description |
| `src/app/(public)/test/page.tsx` | Remove h1 "AI Skills Test" and description p tag |

### Files to Create

| File | Purpose |
|------|---------|
| `src/features/space/components/MySpaceSection/LockedMyNunuSection.tsx` | Locked state for My Nunu section (guests) |
| `src/features/space/components/MySpaceSection/LockedMyVavaSection.tsx` | Locked state for My Vava section (guests) |

### Files to Update (Exports)

| File | Changes |
|------|---------|
| `src/features/space/components/MySpaceSection/index.ts` | Export new locked components |

---

## Visual Comparison

### Before (Current Layout)

```
┌─────────────────────────────────────────┐
│  [Navbar]                               │
├─────────────────────────────────────────┤
│                                         │
│  Page Title (h1)                        │
│  Description paragraph                  │
│                                         │
├─────────────────────────────────────────┤
│                                         │
│  [Main Content Sections]                │
│                                         │
└─────────────────────────────────────────┘
```

### After (Shop-Style Layout)

```
┌─────────────────────────────────────────┐
│  [Navbar]                               │
├─────────────────────────────────────────┤
│                                         │
│  [Main Content Sections]                │
│  (Content-first approach)               │
│                                         │
└─────────────────────────────────────────┘
```

---

## Implementation Checklist

- [ ] Phase 1: Update Forum page - remove header
- [ ] Phase 2: Update Space page - remove header, enable guest access, add locked sections
- [ ] Phase 3: Update Sprint page - remove hero section
- [ ] Phase 4: Update Test page - remove header
- [ ] Create LockedMyNunuSection component
- [ ] Create LockedMyVavaSection component
- [ ] Update exports in MySpaceSection/index.ts
- [ ] Test all pages with guest and logged-in users
- [ ] Verify responsive layout on mobile

---

## Notes

- **Learn page** already follows the content-first pattern with VideoHero and needs no changes
- The **Shop page** is the reference implementation for the standardized layout
- Guest users will be able to browse the Space marketplace but cannot:
  - View their personal My Nunu / My Vava sections
  - Access /member/space
  - Create matching posts
  - Purchase mentorships

---

## Additional Changes Implemented

### 1. Gender-Appropriate Avatars

Updated all user avatars to use gender-specific avatars from `avatar.iran.liara.run`:
- **Female users**: `https://avatar.iran.liara.run/public/girl?username={name}`
- **Male users**: `https://avatar.iran.liara.run/public/boy?username={name}`

**Files Updated:**
- `src/lib/db/seed/users.seed.ts`
- `src/mocks/entities/users.mock.ts`

### 2. Removed Quick Stats from Space Page

Removed the "Find Nunu / Find Vava / Direct Pay" stat blocks from the top of the Space page.

### 3. Mission System Added

Added a new Mission feature with monthly requirements based on Nunu level.

**New Files Created:**
- `src/features/mission/types.ts` - Mission types and requirements table
- `src/features/mission/components/MissionPanel.tsx` - Mission dropdown panel
- `src/features/mission/components/index.ts` - Component exports
- `src/features/mission/index.ts` - Feature exports

**Files Modified:**
- `src/components/organisms/Navbar.tsx` - Added MissionPanel to header (left of Playbook)

**Mission Requirements by Nunu Level:**

| Item / Level            | Nx | N5 | N4 | N3 | N2 | N1 |
|-------------------------|----|----|----|----|----|----|
| **Min Lv**              | 4  | 4  | 6  | 8  | 10 | 12 |
| **Course #**            | 1  | 1  | 1  | 2  | 2  | 3  |
| **Test (upgrade/month)**| +1 | +1 | +1 | +1 | +1 | +1 |
| **Forum (post)**        | 1  | 1  | 2  | 3  | 4  | 5  |
| **Forum (comment)**     | 3  | 3  | 6  | 10 | 30 | 50 |
| **Sprint (per season)** | -  | 1  | 1  | 1  | 1  | 1  |
| **Shop Discount**       | 0% | 50%| 0% |100%| 0% |100%|
| **Min active vava**     | 1  | 1  | 2  | 5  | 6  | 10 |
| **Max active nunu**     | 1  | 3  | 5  | 10 | 10 | 30 |
