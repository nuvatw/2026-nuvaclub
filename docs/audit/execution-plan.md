# Codebase Audit: Execution Plan

**Date**: January 27, 2026
**Project**: nuvaClub Frontend

---

## Guiding Principles

1. **UI/UX must remain 100% identical**
2. **Remove only verified unused code**
3. **Small batches with validation after each**
4. **No refactoring for style - only dead code removal**

---

## Execution Sequence

### Step 1: Remove Empty Directories (LOWEST RISK)

**Files**:
- Delete `src/data/queries/` (empty)
- Delete `src/data/sections/` (empty)

**Validation**:
```bash
npx tsc --noEmit
npm run build
```

---

### Step 2: Remove Unused Icon Files (LOW RISK)

**Files**:
- Delete `src/components/icons/ChevronIcon.tsx`
- Delete `src/components/icons/UIIcons.tsx`
- Delete `src/components/icons/CloseIcon.tsx`
- Update `src/components/icons/index.ts` to remove CloseIcon export

**Why safe**: No imports found for any of these files. All icons are now in Icon.tsx.

**Validation**:
```bash
npx tsc --noEmit
npm run build
```

---

### Step 3: Remove Unused Shared Components (LOW RISK)

**Files**:
- Delete `src/components/organisms/CategorySidebar.tsx`
- Delete `src/components/organisms/ProductGrid.tsx`
- Update `src/components/organisms/index.ts` to remove exports

**Why safe**: No imports found anywhere in codebase.

**Validation**:
```bash
npx tsc --noEmit
npm run build
```

---

### Step 4: Remove Unused Pagination Component (LOW RISK)

**Files**:
- Delete `src/components/molecules/Pagination.tsx`
- Update `src/components/molecules/index.ts` to remove export

**Why safe**: Events page defines its own local Pagination component.

**Validation**:
```bash
npx tsc --noEmit
npm run build
```

---

### Step 5: Clean Up Unused Exports (MEDIUM RISK)

**Files**:
- Update `src/components/molecules/index.ts` to remove `SectionTransition` and `StaggeredList` exports

**Why safe**: Exported but never imported. Keep functions in PageTransition.tsx for potential future use.

**Validation**:
```bash
npx tsc --noEmit
npm run build
```

---

### Step 6: Fix Missing Image Paths (BUG FIX)

**Files**:
- Update `src/Database/content/home-content.ts`

**Change**: Update image paths to use existing images or use placeholder

**Current (broken)**:
```typescript
image: '/images/courses/chatgpt.jpg',
image: '/images/courses/prompt.jpg',
image: '/images/courses/automation.jpg',
```

**Fix**: Use existing images (ai-art.png, prompt-engineering.png) or remove image property

**Validation**:
```bash
npx tsc --noEmit
npm run build
```

---

### Step 7: Clean Up templates/index.ts (LOW RISK)

**Files**:
- Update `src/components/templates/index.ts` to be a proper empty export file

**Current**:
```typescript
/**
 * Templates - Page layout patterns
 */

// Templates will be added as needed
```

**Change to**:
```typescript
/**
 * Templates - Page layout patterns
 * Currently empty - templates will be added as needed.
 */
export {};
```

**Validation**:
```bash
npx tsc --noEmit
npm run build
```

---

## NOT INCLUDED (Requires Migration)

The following require updating active imports before removal:

1. `src/data/types/` - Has imports from `src/features/shared/`
2. `src/data/user-data/` - Has imports from `src/features/shared/progress/`
3. Deprecated feature data files - Still have some legacy references

These should be addressed in a separate migration task.

---

## Final Validation

After all steps, run:

```bash
# TypeScript check
npx tsc --noEmit

# Build
npm run build

# Manual smoke test
npm run dev
# Visit: /, /learn, /shop, /forum, /sprint, /space, /test
```

---

## Rollback Strategy

If any step fails:
1. Check `git diff` to see what changed
2. Use `git checkout -- <file>` to revert specific files
3. Re-run validation

All changes are isolated and reversible.
