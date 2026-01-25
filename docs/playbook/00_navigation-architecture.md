# Playbook Navigation Architecture

> **Purpose:** Technical documentation for the smooth scroll navigation system
> **Last Updated:** 2026-01-24

---

## Overview

The playbook uses a sticky sidebar navigation with smooth scroll-to-section functionality. This document explains the implementation and best practices.

---

## Key Components

### 1. PlaybookSidebar (`src/features/document/components/PlaybookSidebar.tsx`)

The sidebar component that displays the table of contents.

**Features:**
- Sticky positioning (`sticky top-24`)
- Collapsible sections with animations
- Active section highlighting
- Mobile slide-out drawer
- Auto-expands parent when child is active

### 2. Scroll Utility (`src/features/document/utils/scroll.ts`)

Handles smooth scrolling with proper offset calculation.

```typescript
// Constants
const NAVBAR_HEIGHT = 64; // h-16 = 64px
const SCROLL_BUFFER = 24; // Extra breathing room
export const SCROLL_OFFSET = NAVBAR_HEIGHT + SCROLL_BUFFER; // 88px

// Scroll to section with proper offset
export function scrollToSection(id: string): void {
  const element = document.getElementById(id);
  if (!element) return;

  const elementPosition = element.getBoundingClientRect().top;
  const offsetPosition = elementPosition + window.scrollY - SCROLL_OFFSET;

  window.scrollTo({
    top: Math.max(0, offsetPosition),
    behavior: 'smooth',
  });
}
```

### 3. Intersection Observer (in page.tsx)

Tracks which section is currently in view to highlight in sidebar.

```typescript
const observer = new IntersectionObserver(
  (entries) => {
    const intersecting = entries.filter(e => e.isIntersecting);
    if (intersecting.length > 0) {
      const topmost = intersecting.reduce((prev, curr) => {
        return prev.boundingClientRect.top < curr.boundingClientRect.top
          ? prev : curr;
      });
      setActiveId(topmost.target.id);
    }
  },
  {
    rootMargin: '-88px 0px -50% 0px', // Match scroll offset
    threshold: 0,
  }
);
```

---

## Critical CSS Classes

### Scroll Margin Top

Every section header needs this class to account for the fixed navbar:

```html
<h2 id="section-id" class="scroll-mt-[88px]">Section Title</h2>
```

**Why 88px?**
- Navbar height: 64px
- Buffer space: 24px
- Total: 88px

### Sticky Sidebar

```html
<aside class="sticky top-24 max-h-[calc(100vh-8rem)]">
  <!-- sidebar content -->
</aside>
```

- `top-24` (96px) accounts for navbar + padding
- `max-h-[calc(100vh-8rem)]` ensures it doesn't exceed viewport

---

## ID Matching Rules

### Table of Contents IDs

The TOC defines IDs that must match elements in the page:

```typescript
tableOfContents: [
  { id: 'quick-start', title: 'Quick Start', level: 1 },
  { id: 'learn', title: 'Learn', level: 1, children: [
    { id: 'learn-overview', title: 'How It Works', level: 2 },
    { id: 'learn-levels', title: 'The 10 Levels', level: 2 },
  ]},
]
```

### Page Elements

Each section must have a matching ID:

```html
<section class="mb-16">
  <h2 id="quick-start" class="scroll-mt-[88px]">Quick Start</h2>
  <!-- content -->
</section>

<section class="mb-16">
  <h2 id="learn" class="scroll-mt-[88px]">Learn</h2>
  <div id="learn-overview" class="scroll-mt-[88px]"><!-- subsection --></div>
  <div id="learn-levels" class="scroll-mt-[88px]"><!-- subsection --></div>
</section>
```

---

## Common Issues & Fixes

### Issue: Click doesn't scroll to right position

**Cause:** Missing or mismatched ID

**Fix:**
1. Verify the TOC ID matches the element ID exactly
2. Ensure element has `scroll-mt-[88px]` class
3. Check that ID is unique on the page

### Issue: Wrong section highlighted in sidebar

**Cause:** Intersection observer rootMargin mismatch

**Fix:**
1. Ensure rootMargin matches SCROLL_OFFSET
2. Check that all observed elements have the expected IDs
3. Verify elements are visible and have height

### Issue: Smooth scroll not working

**Cause:** Missing CSS or conflicting styles

**Fix:**
1. Add `scroll-behavior: smooth` to html/body (optional, JS handles this)
2. Check for `overflow: hidden` on parent containers
3. Verify JavaScript isn't being blocked

---

## Best Practices

### 1. Consistent ID Naming

Use kebab-case with section prefix:

```
section-name
section-subsection-name
learn-overview
learn-levels
forum-guidelines
```

### 2. Always Use scroll-mt-[88px]

Every scrollable target needs this:

```html
<h2 id="section" class="text-2xl font-bold scroll-mt-[88px]">
<h3 id="subsection" class="text-lg font-semibold scroll-mt-[88px]">
<div id="content-block" class="scroll-mt-[88px]">
```

### 3. Test All Navigation Links

Before deploying, verify each TOC item:
1. Click the sidebar link
2. Confirm it scrolls to correct position
3. Verify the section header is visible below navbar
4. Check that sidebar highlights correctly

### 4. Mobile Considerations

- Sidebar becomes slide-out drawer on mobile
- Touch targets should be at least 44x44px
- Close drawer after navigation

---

## Animation Specs

### Sidebar Expand/Collapse

```typescript
<motion.div
  initial={{ opacity: 0, height: 0 }}
  animate={{ opacity: 1, height: 'auto' }}
  exit={{ opacity: 0, height: 0 }}
>
```

### Mobile Drawer

```typescript
<motion.div
  initial={{ x: '-100%' }}
  animate={{ x: 0 }}
  exit={{ x: '-100%' }}
  transition={{ type: 'spring', damping: 25, stiffness: 200 }}
>
```

### Scroll Behavior

- Duration: Native browser smooth scroll
- Easing: Browser default (ease-out)
- Offset: 88px from top

---

## Testing Checklist

- [ ] All TOC IDs match page element IDs
- [ ] All section headers have `scroll-mt-[88px]`
- [ ] Clicking sidebar item scrolls to correct position
- [ ] Active section highlights correctly while scrolling
- [ ] Mobile drawer opens and closes properly
- [ ] Navigation works after version change
- [ ] No console errors for missing IDs

---

## Related Files

| File | Purpose |
|------|---------|
| `src/features/document/components/PlaybookSidebar.tsx` | Sidebar component |
| `src/features/document/utils/scroll.ts` | Scroll utility |
| `src/features/document/data/versions/*.ts` | TOC definitions |
| `src/app/(public)/document/page.tsx` | Main playbook page |
