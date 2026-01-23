# PRD: Animated Search Icon for /learn Page

## Overview

Replace the current always-visible SearchBar on the `/learn` page with a compact search icon in the top-right that animates/expands into a full search input when clicked.

---

## Current State

**Location:** `src/app/(public)/learn/page.tsx`

The current implementation shows:
- A full-width `SearchBar` component always visible below the `VideoHero`
- Takes up vertical space even when not in use
- Search filters courses in real-time as user types

```tsx
// Current implementation (lines ~45-55)
<div className="sticky top-16 z-30 bg-neutral-950/80 backdrop-blur-md border-b border-neutral-800">
  <div className="container py-3">
    <SearchBar
      value={searchQuery}
      onChange={setSearchQuery}
      placeholder="Search courses by title, topic, or instructor..."
      size="md"
    />
  </div>
</div>
```

---

## Desired State

### Visual Behavior

1. **Collapsed State (Default)**
   - Small circular/rounded search icon button in top-right
   - Positioned in page header area (not sticky)
   - Icon: `SearchIcon` from `@/components/icons`

2. **Expanded State (On Click)**
   - Animates horizontally from icon to full search input
   - Width expands from ~40px to ~320px (or responsive max)
   - Input auto-focuses when expanded
   - Shows clear (X) button when text is entered

3. **Collapse Triggers**
   - Click outside the search area
   - Press Escape key
   - Clear search and blur input
   - Optional: Auto-collapse after 3s of inactivity with empty query

---

## Technical Specification

### Files to Create/Modify

| File | Action | Description |
|------|--------|-------------|
| `src/features/learn/components/AnimatedSearchIcon.tsx` | **CREATE** | New animated search component |
| `src/app/(public)/learn/page.tsx` | **MODIFY** | Replace SearchBar with AnimatedSearchIcon |

### Component: AnimatedSearchIcon

```tsx
// src/features/learn/components/AnimatedSearchIcon.tsx

interface AnimatedSearchIconProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}
```

### Animation Approach

Use `motion/react` (already in project) with width-based expansion:

```tsx
import { motion, AnimatePresence } from 'motion/react';

// Collapsed → Expanded
initial={{ width: 40 }}
animate={{ width: isExpanded ? 320 : 40 }}
transition={{
  type: 'spring',
  stiffness: 400,
  damping: 30
}}
```

### State Management

```tsx
const [isExpanded, setIsExpanded] = useState(false);
const [isFocused, setIsFocused] = useState(false);
const inputRef = useRef<HTMLInputElement>(null);
const containerRef = useRef<HTMLDivElement>(null);

// Auto-focus when expanded
useEffect(() => {
  if (isExpanded && inputRef.current) {
    inputRef.current.focus();
  }
}, [isExpanded]);

// Close on click outside
useEffect(() => {
  const handleClickOutside = (e: MouseEvent) => {
    if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
      if (!value) setIsExpanded(false);
    }
  };
  document.addEventListener('mousedown', handleClickOutside);
  return () => document.removeEventListener('mousedown', handleClickOutside);
}, [value]);

// Close on Escape
useEffect(() => {
  const handleEscape = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsExpanded(false);
      inputRef.current?.blur();
    }
  };
  document.addEventListener('keydown', handleEscape);
  return () => document.removeEventListener('keydown', handleEscape);
}, []);
```

---

## UI/UX Specification

### Collapsed State

```
┌──────────────────────────────────────────────────────────┐
│  VideoHero Content                            [🔍]      │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

- **Position:** Absolute, top-right of hero or page header
- **Size:** 40px × 40px (h-10 w-10)
- **Style:**
  - `bg-neutral-800/80 backdrop-blur-sm`
  - `border border-neutral-700`
  - `rounded-full` (circular) or `rounded-lg` (rounded square)
  - `hover:bg-neutral-700 transition-colors`
- **Icon:** `SearchIcon size="md"` (20px)

### Expanded State

```
┌──────────────────────────────────────────────────────────┐
│  VideoHero Content           [🔍 Search courses...   ✕] │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

- **Width:** 280-320px (responsive: `w-72 sm:w-80`)
- **Height:** 40px (h-10)
- **Style:**
  - `bg-neutral-800 border border-neutral-700 rounded-full`
  - `focus-within:border-primary-500 focus-within:ring-2 focus-within:ring-primary-500/20`
- **Layout:**
  - Search icon on left (persistent)
  - Input in center (flex-1)
  - Clear button on right (conditional, when value exists)

### Animation Timing

| Property | Duration | Easing |
|----------|----------|--------|
| Width expansion | 300ms | spring (stiffness: 400, damping: 30) |
| Icon fade | 150ms | ease-out |
| Input fade-in | 200ms | ease-out (delayed 100ms) |
| Clear button | 150ms | ease-in-out |

---

## Component Structure

```tsx
<motion.div
  ref={containerRef}
  className="relative"
  animate={{ width: isExpanded ? 320 : 40 }}
  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
>
  <div className={cn(
    'flex items-center h-10 overflow-hidden',
    'bg-neutral-800/80 backdrop-blur-sm border border-neutral-700',
    'rounded-full transition-colors',
    isExpanded && 'bg-neutral-800 border-neutral-600'
  )}>
    {/* Search Icon / Button */}
    <button
      onClick={() => setIsExpanded(true)}
      className="flex-shrink-0 w-10 h-10 flex items-center justify-center"
      aria-label="Open search"
      aria-expanded={isExpanded}
    >
      <SearchIcon size="md" className="text-neutral-400" />
    </button>

    {/* Input (conditionally rendered or always present but hidden) */}
    <AnimatePresence>
      {isExpanded && (
        <motion.input
          ref={inputRef}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15, delay: 0.1 }}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={cn(
            'flex-1 bg-transparent border-none outline-none',
            'text-white placeholder-neutral-500 text-sm',
            'pr-2'
          )}
          onBlur={() => {
            if (!value) setIsExpanded(false);
          }}
        />
      )}
    </AnimatePresence>

    {/* Clear Button */}
    <AnimatePresence>
      {isExpanded && value && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          onClick={() => {
            onChange('');
            inputRef.current?.focus();
          }}
          className="flex-shrink-0 w-8 h-8 flex items-center justify-center mr-1"
          aria-label="Clear search"
        >
          <XIcon size="sm" className="text-neutral-400 hover:text-white" />
        </motion.button>
      )}
    </AnimatePresence>
  </div>
</motion.div>
```

---

## Page Integration

### Modified learn/page.tsx

```tsx
// Remove the sticky SearchBar section entirely

// Add AnimatedSearchIcon to the page header/hero area
<div className="relative">
  <VideoHero ... />

  {/* Animated Search - Top Right */}
  <div className="absolute top-4 right-4 z-20">
    <AnimatedSearchIcon
      value={searchQuery}
      onChange={setSearchQuery}
      placeholder="Search courses..."
    />
  </div>
</div>
```

### Alternative: Sticky Header with Search

If a sticky behavior is desired:

```tsx
<div className="sticky top-16 z-30">
  <div className="container flex justify-end py-3">
    <AnimatedSearchIcon
      value={searchQuery}
      onChange={setSearchQuery}
      placeholder="Search courses..."
    />
  </div>
</div>
```

---

## Accessibility Requirements

| Requirement | Implementation |
|-------------|----------------|
| Keyboard accessible | Tab to icon, Enter to expand |
| ARIA attributes | `aria-label`, `aria-expanded`, `role="search"` |
| Focus management | Auto-focus input on expand |
| Escape to close | Close and return focus to trigger |
| Screen reader | Announce "Search expanded/collapsed" |

```tsx
<div role="search" aria-label="Search courses">
  <button
    aria-label={isExpanded ? "Close search" : "Open search"}
    aria-expanded={isExpanded}
    aria-controls="search-input"
  >
    ...
  </button>
  <input
    id="search-input"
    aria-label="Search courses"
    ...
  />
</div>
```

---

## Edge Cases

| Scenario | Behavior |
|----------|----------|
| Click icon when expanded | Focus input (don't collapse) |
| Blur with text entered | Stay expanded |
| Blur with empty input | Collapse after 150ms delay |
| Escape with text | Clear text, collapse |
| Mobile touch | Same behavior, larger touch target |
| Page scroll while expanded | Stay expanded |

---

## Testing Checklist

- [ ] Click icon expands search smoothly
- [ ] Input auto-focuses on expand
- [ ] Typing filters courses in real-time
- [ ] Clear button appears when text exists
- [ ] Clear button clears text and keeps focus
- [ ] Click outside collapses (if empty)
- [ ] Escape key collapses
- [ ] Tab navigation works correctly
- [ ] Screen reader announces state changes
- [ ] Animation is smooth (60fps)
- [ ] Works on mobile (touch events)
- [ ] No layout shift during animation

---

## Dependencies

All dependencies are already in the project:

- `motion/react` - Animation library
- `@/components/icons` - SearchIcon, XIcon
- `@/lib/utils` - cn() class utility
- Tailwind CSS - Styling

---

## Implementation Order

1. Create `AnimatedSearchIcon.tsx` component
2. Add to learn page (alongside existing SearchBar)
3. Test functionality and animations
4. Remove old SearchBar implementation
5. Adjust positioning as needed
6. Add accessibility attributes
7. Test edge cases
8. Mobile testing

---

## Future Enhancements (Out of Scope)

- Search suggestions/autocomplete dropdown
- Recent searches history
- Voice search input
- Search analytics tracking
- Debounced API search (if backend search added)
