# PRD: Sidebar Navigation Scroll Fix

## Executive Summary

The sidebar table of contents (TOC) navigation on the `/document` page is not scrolling to the correct position when users click on section links. This PRD outlines the root causes and provides a comprehensive solution.

---

## Problem Statement

**User Report:** "When I press a section on the left sidebar, it didn't go to the right place."

**Observed Issues:**
1. Clicking sidebar links scrolls to wrong positions
2. Sections get hidden behind the fixed navbar
3. Active state highlighting doesn't match the visible section
4. Some clicks don't scroll at all

---

## Root Cause Analysis

After analyzing the codebase and researching solutions, I identified **5 root causes**:

### 1. ID Mismatch Between TOC and DOM Elements

**Problem:** The TOC references IDs that don't match where they're placed in the DOM.

| TOC ID | Expected Target | Actual Target |
|--------|-----------------|---------------|
| `learn-overview` | H3 header | `<div id="learn-overview">` wrapper |
| `dashboard-overview` | H3 header | `<div id="dashboard-overview">` wrapper |
| `test-overview` | H3 header | `<div id="test-overview">` wrapper |

**Code Location:** `src/app/(public)/document/page.tsx:552-558`
```tsx
// Current: ID on div, not on SubsectionHeader
<div id="learn-overview" className="mb-8">
  <Card>
```

**Should be:** ID on the actual header being scrolled to.

### 2. Inconsistent Scroll Offset Calculations

**Problem:** Multiple hardcoded offset values that don't account for all cases.

| Component | Offset Value | Navbar Height | Actual Need |
|-----------|--------------|---------------|-------------|
| PlaybookSidebar | `100px` | 64px | ~80-96px |
| PlaybookHero | `100px` | 64px | ~80-96px |
| CSS `scroll-mt-24` | 96px | 64px | ~80-96px |

**Code Location:** `src/features/document/components/PlaybookSidebar.tsx:121-124`
```tsx
const handleItemClick = (id: string) => {
  const element = document.getElementById(id);
  if (element) {
    const offset = 100; // Hardcoded, inconsistent
```

**Sources:**
- [Handling Scroll Offset with Fixed Headers in React](https://medium.com/@naglaafouz4/handling-scroll-offset-with-fixed-headers-in-react-a-deep-dive-with-smooth-scrolling-example-cac47056c8d3) recommends calculating offset dynamically

### 3. CSS `scroll-margin-top` Only on Headers

**Problem:** The `scroll-mt-24` class is only applied to `H2` and `H3` elements, but some scroll targets are `<div>` elements.

**Code Location:** `src/app/(public)/document/page.tsx:33-39`
```tsx
function SectionHeader({ id, title, icon }) {
  return (
    <h2 id={id} className="... scroll-mt-24">  // Has scroll-mt
```

But div wrappers don't have it:
```tsx
<div id="learn-overview" className="mb-8">  // Missing scroll-mt-24
```

**Source:** [CSS-Tricks - Sticky Table of Contents](https://css-tricks.com/sticky-table-of-contents-with-scrolling-active-states/) recommends `scroll-margin-top` on all anchor targets.

### 4. IntersectionObserver Configuration Issues

**Problem:** The IntersectionObserver only tracks `H2` and `H3` elements, but some IDs are on `<div>` elements.

**Code Location:** `src/app/(public)/document/page.tsx:318-327`
```tsx
const sections = document.querySelectorAll('[id]');
sections.forEach((section) => {
  if (section.tagName === 'H2' || section.tagName === 'H3') {  // Only H2/H3!
    observer.observe(section);
  }
});
```

This means sections with IDs on `<div>` elements (like `learn-overview`) are never observed, so active state never updates.

### 5. Next.js Link Scroll Behavior Override

**Problem:** While not directly used here, the codebase uses `window.scrollTo()` which can conflict with React's rendering cycle.

**Source:** [Next.js Issue #64441](https://github.com/vercel/next.js/issues/64441) documents similar scroll behavior issues.

---

## Proposed Solution

### Solution Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     SCROLL NAVIGATION SYSTEM                     │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  1. CONSISTENT IDs                                               │
│     └── All scroll targets use header elements with IDs          │
│                                                                  │
│  2. CENTRALIZED SCROLL UTILITY                                   │
│     └── Single function handles all scroll logic                 │
│     └── Calculates navbar height dynamically                     │
│     └── Adds buffer for visual breathing room                    │
│                                                                  │
│  3. CSS SCROLL-MARGIN                                            │
│     └── Applied to ALL elements with IDs                         │
│     └── Consistent value matching navbar + buffer                │
│                                                                  │
│  4. IMPROVED INTERSECTION OBSERVER                               │
│     └── Observe all ID'd elements, not just H2/H3                │
│     └── Better rootMargin calculation                            │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Implementation Plan

### Phase 1: Create Centralized Scroll Utility

**File:** `src/features/document/utils/scroll.ts` (NEW)

```typescript
/**
 * Scroll Navigation Utility
 *
 * Handles smooth scrolling with proper offset calculation
 * for fixed navbar and sticky elements.
 */

// Constants
const NAVBAR_HEIGHT = 64; // h-16 = 64px
const SCROLL_BUFFER = 24; // Extra breathing room
const TOTAL_OFFSET = NAVBAR_HEIGHT + SCROLL_BUFFER; // 88px

/**
 * Scrolls to an element by ID with proper offset
 */
export function scrollToSection(id: string): void {
  const element = document.getElementById(id);
  if (!element) {
    console.warn(`[ScrollNav] Element with id "${id}" not found`);
    return;
  }

  const elementPosition = element.getBoundingClientRect().top;
  const offsetPosition = elementPosition + window.scrollY - TOTAL_OFFSET;

  window.scrollTo({
    top: offsetPosition,
    behavior: 'smooth',
  });
}

/**
 * Returns the scroll offset constant for CSS usage
 */
export const SCROLL_OFFSET = TOTAL_OFFSET;
```

### Phase 2: Update Page Structure - Move IDs to Headers

**File:** `src/app/(public)/document/page.tsx`

**Change 1:** Create a new wrapper component that puts ID on a proper scroll target

```tsx
// NEW: Subsection wrapper with proper scroll target
function SubsectionWrapper({
  id,
  title,
  children
}: {
  id: string;
  title: string;
  children: React.ReactNode
}) {
  return (
    <div className="mb-8">
      <SubsectionHeader id={id} title={title} />
      {children}
    </div>
  );
}
```

**Change 2:** Update SubsectionHeader to include scroll-margin

```tsx
function SubsectionHeader({ id, title }: { id: string; title: string }) {
  return (
    <h3
      id={id}
      className="text-lg font-semibold text-white mb-4 scroll-mt-[88px]"
    >
      {title}
    </h3>
  );
}
```

**Change 3:** Update SectionHeader to use consistent scroll-margin

```tsx
function SectionHeader({ id, title, icon }: { id: string; title: string; icon?: string }) {
  return (
    <h2
      id={id}
      className="text-2xl font-bold text-white mb-6 flex items-center gap-3 scroll-mt-[88px]"
    >
      {icon && <span className="text-2xl">{icon}</span>}
      {title}
    </h2>
  );
}
```

**Change 4:** Update Learn section structure (example for all sections)

**Before:**
```tsx
<div id="learn-overview" className="mb-8">
  <Card>
    <CardContent>
      <MarkdownContent content={content.learn.overview} />
    </CardContent>
  </Card>
</div>

<SubsectionHeader id="learn-access" title="Course Access Levels" />
```

**After:**
```tsx
<SubsectionWrapper id="learn-overview" title="Overview">
  <Card>
    <CardContent>
      <MarkdownContent content={content.learn.overview} />
    </CardContent>
  </Card>
</SubsectionWrapper>

<SubsectionWrapper id="learn-access" title="Course Access Levels">
  <Card>
    <CardContent>
      <MarkdownContent content={content.learn.access} />
    </CardContent>
  </Card>
</SubsectionWrapper>
```

### Phase 3: Update PlaybookSidebar to Use Utility

**File:** `src/features/document/components/PlaybookSidebar.tsx`

```tsx
import { scrollToSection } from '../utils/scroll';

// Update handleItemClick
const handleItemClick = (id: string) => {
  scrollToSection(id);
  setIsMobileOpen(false);
};
```

### Phase 4: Update PlaybookHero to Use Utility

**File:** `src/features/document/components/PlaybookHero.tsx`

```tsx
import { scrollToSection } from '../utils/scroll';

function QuickStartCard({ item, index }: QuickStartCardProps) {
  const handleClick = () => {
    scrollToSection(item.id);
  };
  // ... rest unchanged
}
```

### Phase 5: Fix IntersectionObserver

**File:** `src/app/(public)/document/page.tsx`

```tsx
useEffect(() => {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveId(entry.target.id);
        }
      });
    },
    {
      // Adjusted rootMargin:
      // -88px top (navbar + buffer)
      // -50% bottom (trigger when element is in top half)
      rootMargin: '-88px 0px -50% 0px',
      threshold: 0,
    }
  );

  // Observe ALL elements with IDs that are in our TOC
  const tocIds = new Set<string>();
  const collectIds = (items: TOCItem[]) => {
    items.forEach(item => {
      tocIds.add(item.id);
      if (item.children) {
        item.children.forEach(child => tocIds.add(child.id));
      }
    });
  };
  collectIds(playbook.tableOfContents);

  const sections = document.querySelectorAll('[id]');
  sections.forEach((section) => {
    if (tocIds.has(section.id)) {
      observer.observe(section);
    }
  });

  return () => observer.disconnect();
}, [selectedVersion, playbook.tableOfContents]);
```

### Phase 6: Add Global CSS for Scroll Margin

**File:** `src/app/globals.css` (or create document-specific styles)

```css
/* Scroll margin for all document page anchors */
.document-content [id] {
  scroll-margin-top: 88px;
}
```

---

## File Changes Summary

| File | Action | Changes |
|------|--------|---------|
| `src/features/document/utils/scroll.ts` | CREATE | New scroll utility |
| `src/features/document/components/PlaybookSidebar.tsx` | UPDATE | Use scroll utility |
| `src/features/document/components/PlaybookHero.tsx` | UPDATE | Use scroll utility |
| `src/app/(public)/document/page.tsx` | UPDATE | Fix IDs, IntersectionObserver |
| `src/features/document/components/index.ts` | UPDATE | Export scroll utility |

---

## Testing Checklist

### Manual Testing

- [ ] Click each sidebar item, verify it scrolls to correct position
- [ ] Verify section is visible (not hidden behind navbar)
- [ ] Verify active state updates when clicking
- [ ] Scroll manually, verify active state follows scroll position
- [ ] Test on mobile: tap sidebar items
- [ ] Test Quick Start cards scroll correctly
- [ ] Test with all 3 playbook versions (v1, v2, v3)

### Edge Cases

- [ ] Click same section twice (shouldn't scroll)
- [ ] Click while already scrolling (smooth transition)
- [ ] Very long section names in sidebar
- [ ] Sections near page bottom (may not reach full scroll)
- [ ] Browser back/forward with hash URLs

---

## Success Metrics

1. **100% scroll accuracy** - Every sidebar click lands user at correct section
2. **Section visibility** - Top of section visible, not hidden by navbar
3. **Active state sync** - Sidebar highlights match visible content within 100ms
4. **Mobile parity** - Same behavior on mobile drawer

---

## References

- [CSS-Tricks: Sticky Table of Contents with Scrolling Active States](https://css-tricks.com/sticky-table-of-contents-with-scrolling-active-states/)
- [Medium: Handling Scroll Offset with Fixed Headers in React](https://medium.com/@naglaafouz4/handling-scroll-offset-with-fixed-headers-in-react-a-deep-dive-with-smooth-scrolling-example-cac47056c8d3)
- [Perishable Press: Margin Offset for Anchor Targets](https://perishablepress.com/margin-offset-anchor-targets/)
- [Next.js GitHub Issue #64441: Link not scrolling with sticky header](https://github.com/vercel/next.js/issues/64441)
- [Smashing Magazine: Sticky Headers and Full-Height Elements](https://www.smashingmagazine.com/2024/09/sticky-headers-full-height-elements-tricky-combination/)

---

## Implementation Priority

**High Priority (Fix Now):**
1. Create scroll utility with correct offset
2. Update PlaybookSidebar to use utility
3. Add scroll-margin-top to all ID'd elements

**Medium Priority (Next Sprint):**
4. Fix IntersectionObserver to track all sections
5. Restructure page IDs consistently

**Low Priority (Polish):**
6. Add hash URL support (#section links)
7. Add scroll progress indicator

---

*Document Version: 1.0*
*Created: 2026-01-23*
*Author: Claude Code*
