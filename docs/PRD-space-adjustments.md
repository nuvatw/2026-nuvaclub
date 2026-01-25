# Product Requirements Document (PRD)
# Space Page Adjustments

**Version:** 1.0
**Date:** 2026-01-23
**Status:** Ready for Implementation

---

## 1. Overview

This PRD documents adjustments to the Space feature (formerly "Space Marketplace") to fix bugs and improve UX.

---

## 2. Changes Summary

| # | Issue | Current State | Target State |
|---|-------|---------------|--------------|
| 1 | Filter not working | `postType` key in filters | Use correct `type` key |
| 2 | Toggle alignment | Left-aligned | Center-aligned |
| 3 | Page name | "Space Marketplace" | "Space" |

---

## 3. Bug Fix: Find Nunu / Find Vava Filter Not Working

### 3.1 Root Cause
In `src/features/space/components/MatchingBoard/MatchingBoardSection.tsx`, the filter object uses the wrong key:

**Current (Broken):**
```typescript
const filters = useMemo(() => {
  return {
    isActive: true,
    postType: viewMode === 'find-nunu'  // WRONG KEY
      ? 'nunu-looking-for-vava' as MatchingPostType
      : 'vava-looking-for-nunu' as MatchingPostType,
  };
}, [viewMode]);
```

**Expected filter interface** (from `useMatchingPosts.ts`):
```typescript
export interface MatchingPostFilters {
  type?: MatchingPostType;  // Uses "type", not "postType"
  isVerifiedNunuOnly?: boolean;
  priceType?: PriceType;
  priceMin?: number;
  priceMax?: number;
  months?: string[];
  authorId?: string;
  isActive?: boolean;
  tags?: string[];
}
```

### 3.2 Fix
Change `postType` to `type` in the filters object:

**File:** `src/features/space/components/MatchingBoard/MatchingBoardSection.tsx`
**Line:** ~46

```typescript
const filters = useMemo(() => {
  return {
    isActive: true,
    type: viewMode === 'find-nunu'  // CORRECT KEY
      ? 'nunu-looking-for-vava' as MatchingPostType
      : 'vava-looking-for-nunu' as MatchingPostType,
  };
}, [viewMode]);
```

---

## 4. UI Fix: Center Align Toggle Buttons

### 4.1 Current State
The "Find Nunu" and "Find Vava" toggle buttons are left-aligned in their container.

### 4.2 Fix
Add `justify-center` to center the buttons.

**File:** `src/features/space/components/MatchingBoard/MatchingBoardSection.tsx`
**Line:** ~151

**Current:**
```tsx
<div className="flex gap-3">
```

**Fix:**
```tsx
<div className="flex gap-3 justify-center">
```

---

## 5. Naming Change: "Space Marketplace" to "Space"

### 5.1 Files to Update

| File | Line | Current | New |
|------|------|---------|-----|
| `src/app/(public)/space/page.tsx` | 35 | "Space Marketplace" | "Space" |
| `src/app/(public)/space/page.tsx` | 102 | "Space Marketplace" | "Space" |

### 5.2 Changes

**Guest view (line 35):**
```tsx
// Current
<h1 className="text-3xl font-bold text-white mb-4">Space Marketplace</h1>

// New
<h1 className="text-3xl font-bold text-white mb-4">Space</h1>
```

**Logged-in view (line 102):**
```tsx
// Current
<h1 className="text-3xl font-bold text-white mb-2">Space Marketplace</h1>

// New
<h1 className="text-3xl font-bold text-white mb-2">Space</h1>
```

---

## 6. Section Structure (Already Correct)

The current section structure matches the desired layout:

1. **My Nunu** - Shows the user's current mentor
2. **My Vava** - Shows the user's learners (if they are a Nunu)
3. **Matching Board** - The main marketplace with Find Nunu / Find Vava toggle

No changes needed for section ordering.

---

## 7. Implementation Checklist

- [ ] **Fix filter bug** - Change `postType` to `type` in MatchingBoardSection.tsx
- [ ] **Center toggle buttons** - Add `justify-center` to flex container
- [ ] **Rename page title** - Update both guest and logged-in view titles from "Space Marketplace" to "Space"

---

## 8. Files Modified

| File | Changes |
|------|---------|
| `src/features/space/components/MatchingBoard/MatchingBoardSection.tsx` | Fix filter key, center buttons |
| `src/app/(public)/space/page.tsx` | Rename title |

---

## 9. Testing

After implementation, verify:

1. **Filter works:**
   - Click "Find Nunu" - should show posts from Nunus offering mentorship
   - Click "Find Vava" - should show posts from Vavas seeking mentorship
   - Switching between tabs should filter the posts correctly

2. **Toggle centered:**
   - The "Find Nunu" and "Find Vava" buttons should be horizontally centered

3. **Title updated:**
   - Guest view shows "Space" as the page title
   - Logged-in view shows "Space" as the page title
