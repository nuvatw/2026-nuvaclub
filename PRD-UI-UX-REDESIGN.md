# UI/UX Redesign PRD + File-by-File Execution Plan

**Project:** nuvaClub
**Framework:** Next.js 15.1.0 + React 19 + Tailwind CSS 4.0
**Document Version:** 2.0 (Comprehensive Code Audit)
**Date:** 2026-01-23
**Author:** Senior Product Designer + Principal Front-End Engineer Audit

---

## Table of Contents

1. [UI Inventory](#1-ui-inventory)
2. [Design Audit Findings (Summary)](#2-design-audit-findings-summary)
3. [Findings & Fixes (By File)](#3-findings--fixes-by-file)
4. [PRD - Product Requirements Document](#4-prd---product-requirements-document)
5. [Change List (By File Path)](#5-change-list-by-file-path)
6. [Renovation Roadmap](#6-renovation-roadmap)
7. [QA Checklist](#7-qa-checklist)
8. [Open Questions / Assumptions](#8-open-questions--assumptions)

---

## 1. UI Inventory

### 1.1 Pages & Routes (23 total)

| Route | Page | Components Used | Key UI Elements |
|-------|------|-----------------|-----------------|
| `/` | Home/Landing | HeroSection, ProblemSection, SolutionSection, etc. | Video bg, Cards, Badges, Stats |
| `/learn` | Course Listing | VideoHero, CourseRow, LearnHoverPreview | Carousel, Cards, Preview Panel |
| `/learn/[courseId]` | Course Detail | VideoPlayer, CourseContent | Video player, Sections |
| `/test` | Test Home | TestLevelProgressBar | Progress stepper, Level details |
| `/test/[level]` | Test Level | Level details | Info cards |
| `/test/[level]/exam` | Test Exam | QuestionRenderer, Timer | Questions, Navigation |
| `/test/results/[sessionId]` | Test Results | ResultSummary | Score display, Breakdown |
| `/forum` | Forum Listing | PostCard, Filters | Search, Categories, Posts |
| `/forum/[postId]` | Post Detail | Comments, Voting | Post content, Replies |
| `/forum/new` | Create Post | PostForm | Rich editor, Tags |
| `/space` | Space Home | MyNunuSection, MyVavaSection, MatchingBoard | Locked state, Dashboard |
| `/sprint` | Sprint Home | SprintFilters, SprintWorkCard | Filters, Project grid |
| `/sprint/[seasonId]/[sprintId]` | Sprint Detail | Project cards | Season info, Projects |
| `/sprint/project/[projectId]` | Project Detail | Project content | Project showcase |
| `/shop` | Shop Home | CategoryPills, ProductCard | Category filters, Products |
| `/shop/plan` | Plan Page | PlanCard | Comparison table |
| `/shop/duo` | Duo Page | DuoProductCard | Calendar, Tiers |
| `/shop/events` | Events Page | EventCards | Event listings |
| `/shop/events/[eventId]` | Event Detail | EventHero, EventAgenda | Event info, Registration |
| `/shop/merchandise` | Merchandise | ProductGrid | Product cards |
| `/member/profile` | Profile | Profile form | User info |
| `/member/courses` | My Courses | CourseCards | Enrolled courses |
| `/member/favorites` | Favorites | Bookmarked content | Saved items |
| `/member/space` | My Space | Space dashboard | Pairing info |
| `/member/settings` | Settings | Settings form | Preferences |
| `/checkout` | Checkout | Multi-step form | Stepper, Forms |
| `/document` | Playbook | PlaybookSidebar, MarkdownContent | Documentation |

### 1.2 Component Categories

#### Atoms (4 components)
- `Button.tsx` - Primary UI action element
- `Card.tsx` - Container component with variants
- `Badge.tsx` - Status/label indicator
- `Modal.tsx` - Overlay dialog container
- `Skeleton.tsx` - Loading placeholder system

#### Molecules (4 components)
- `SearchBar.tsx` - Search input with clear/submit
- `RatingStars.tsx` - Star rating display
- `Pagination.tsx` - Page navigation
- `PageTransition.tsx` - Loading transitions

#### Organisms (5 components)
- `Navbar.tsx` - Global navigation
- `UserAvatarDropdown.tsx` - User menu
- `HeroCarousel.tsx` - Auto-playing carousel
- `CartDrawer.tsx` - Shopping cart slide-out
- `HoverPreviewPanel.tsx` - Content preview system

#### Feature Components (60+ components)
- Auth: LoginModal, Gate, AuthProvider
- Learn: CourseCard, CourseRow, VideoPlayer, VideoHero
- Test: TestLevelGrid, QuestionRenderer, Timer, Navigation
- Forum: PostCard, PostForm, CategoryFilter
- Space: MyNunuSection, MatchingBoard, DuoStatusBar
- Sprint: SprintWorkCard, SprintFilters
- Shop: ProductCard, CartProvider, CartItem
- Checkout: FormInput, Stepper, OrderSummary

### 1.3 Design Tokens (Current State - from globals.css)

**Colors:**
- Primary-50 to Primary-900: Blue scale (#eff6ff to #1e3a8a)
- Primary-500: `#3b82f6` (main interactive)
- Primary-600: `#2563eb` (buttons)
- Accent-400 to Accent-600: Orange scale (#fb923c to #ea580c)
- Neutral-50 to Neutral-950: Gray scale (#fafafa to #0a0a0a)
- Neutral-850: `#1a1a1a` (custom addition)

**Typography:**
- Font: 'Noto Sans TC', system-ui, -apple-system, sans-serif
- Weights: 400, 500, 600, 700
- Sizes: xs (12px) to 7xl (72px) - Tailwind defaults

**Spacing:**
- Base: 4px (Tailwind default)
- Used: p-1 to p-8, gap-1 to gap-12
- Section padding: py-12 (mobile), py-16 (desktop)

**Border Radius:**
- `rounded-lg` (8px) - buttons, inputs
- `rounded-xl` (12px) - cards
- `rounded-2xl` (16px) - large cards
- `rounded-full` (9999px) - badges, avatars

**Icon System (from Icon.tsx):**
- Unified IconBase component with consistent props
- 50+ icons with 1.5 stroke width
- Sizes: sm=16px, md=20px, lg=24px
- ViewBox: 24x24 (standard)

**Animation:**
- shimmer: Skeleton loading animation
- hero-shimmer: Subtle background effect
- motion/react for page transitions

---

## 2. Design Audit Findings (Summary)

### Overall Assessment: **B+** (Solid foundation with good systems, needs polish)

The codebase demonstrates excellent structural organization with:
- Well-architected component system (atoms/molecules/organisms)
- Unified icon system with 50+ icons (Icon.tsx with consistent stroke width)
- Comprehensive skeleton loaders (16 page-specific skeletons)
- Good use of motion/react for animations
- Proper TypeScript interfaces

However, inconsistencies exist that diminish perceived quality:
- Inline SVGs in some pages despite having an icon system
- Some components still using deprecated patterns
- Missing empty/error states in newer features
- Spacing values not always following the system

### Critical Issues by Category

| Category | Severity | Count | Impact |
|----------|----------|-------|--------|
| 1. User Flow Gaps | HIGH | 6 | Missing search on Learn page |
| 2. Overusing Effects | LOW | 3 | Some heavy shadows on hover |
| 3. Spacing/Layout | MEDIUM | 8 | Mobile spacing tight in some areas |
| 4. Inconsistent Components | MEDIUM | 10 | Inline icons when system exists |
| 5. Icon Inconsistency | LOW | 4 | Icon system exists but not 100% adopted |
| 6. Redundant Elements | LOW | 3 | Minor clutter |
| 7. Interactive Feedback | MEDIUM | 8 | Missing confirmations on destructive actions |
| 8. Charts/Data Viz | N/A | 0 | No charts in current UI |

### Top 10 Priority Fixes

1. **Missing search on Learn page** - Critical for course discovery (50+ courses)
2. **Inline SVGs in pages** - Forum, Shop pages use inline SVGs despite Icon system
3. **Cart clear confirmation** - No confirmation before clearing cart
4. **Cart item touch targets** - Quantity buttons only 28px (need 44px)
5. **Focus trap in Modal** - Modal lacks proper focus management
6. **Dropdown component missing** - SprintFilters has local Dropdown, should be shared
7. **VideoPlayer icons** - 160+ lines of local icon definitions (should use Icon system)
8. **Empty states on member pages** - Favorites, Courses pages need empty states
9. **Mobile menu spacing** - space-y-1 is too tight
10. **Shadow consistency** - Some hovers use shadow-black/40 (too heavy)

---

## 3. Findings & Fixes (By File)

### 3.1 Atoms

#### `src/components/atoms/Button.tsx`

**Problems Found:**
- #3 Spacing: `py-1.5` for sm is too tight (6px)
- #4 Inconsistency: No `xs` or `xl` size variants
- #7 Feedback: Loading spinner only, no pressed/active state
- #7 Feedback: Focus ring uses `ring-offset-neutral-950` (hardcoded)

**Proposed Changes:**
```
- Increase sm padding: py-1.5 → py-2 (8px min touch target)
- Add min-height: sm=32px, md=40px, lg=48px
- Add active:scale-[0.98] for pressed feedback
- Make focus offset dynamic with CSS variable
- Add icon-only variant for circular icon buttons
```

**Expected Behavior After:**
- All buttons have consistent heights
- Pressed state provides tactile feedback
- Focus ring works on any background color

**Acceptance Criteria:**
- [ ] sm button height = 32px
- [ ] md button height = 40px
- [ ] lg button height = 48px
- [ ] Active state scales button
- [ ] Loading state prevents double-click

**Effort:** S | **Dependencies:** None

---

#### `src/components/atoms/Card.tsx`

**Problems Found:**
- #4 Inconsistency: Uses `rounded-xl` but other cards use `rounded-2xl`
- #3 Spacing: Padding variants (sm=12px, md=16px, lg=24px) inconsistent with Tailwind scale
- #7 Feedback: Hover state only changes border, no scale/shadow

**Proposed Changes:**
```
- Standardize radius: rounded-xl (12px) for all cards
- Align padding: sm=12px, md=16px, lg=24px (keep)
- Add subtle hover shadow: shadow-lg shadow-black/5
- Add CardAction sub-component for clickable cards
```

**Acceptance Criteria:**
- [ ] All cards use rounded-xl
- [ ] Hover includes subtle shadow lift
- [ ] CardAction variant has cursor-pointer + scale

**Effort:** S | **Dependencies:** Update all Card usages

---

#### `src/components/atoms/Badge.tsx`

**Problems Found:**
- #4 Inconsistency: Uses `rounded-full` but some inline badges elsewhere use `rounded-lg`
- #3 Spacing: sm size `py-0.5` (2px) too small for readability

**Proposed Changes:**
```
- Keep rounded-full (correct for badges)
- Increase sm padding: py-0.5 → py-1 (4px)
- Add 'info' variant for informational badges
- Add 'dot' prop for status indicators
```

**Acceptance Criteria:**
- [ ] sm badge min-height = 20px
- [ ] All badge variants have dot option

**Effort:** S | **Dependencies:** None

---

#### `src/components/atoms/Modal.tsx`

**Problems Found:**
- #3 Spacing: Content padding `p-6` may be excessive for small modals
- #7 Feedback: No entry animation for content (only container)
- #1 Flow: No footer slot for action buttons

**Proposed Changes:**
```
- Add padding prop: sm=p-4, md=p-6 (default), lg=p-8
- Add content fade-in with stagger
- Add ModalFooter sub-component
- Add variant: 'default' | 'alert' | 'fullscreen'
```

**Acceptance Criteria:**
- [ ] Modal supports footer slot
- [ ] Content animates in after backdrop
- [ ] Alert variant centers content

**Effort:** M | **Dependencies:** All modal usages

---

### 3.2 Molecules

#### `src/components/molecules/SearchBar.tsx`

**Problems Found:**
- #2 Effects: `rounded-full` creates pill shape (inconsistent with other inputs)
- #7 Feedback: No loading state during search
- #5 Icons: Clear button icon is inline SVG
- #4 Inconsistency: Uses CSS variables `--shop-*` (shop-specific)

**Proposed Changes:**
```
- Change to rounded-lg for consistency
- Add isLoading prop with spinner
- Remove shop-specific CSS vars, use neutral tokens
- Extract SearchIcon and CloseIcon to icon system
- Add keyboard shortcut hint (/)
```

**Acceptance Criteria:**
- [ ] SearchBar uses rounded-lg
- [ ] Loading spinner shown during async search
- [ ] Works in both light and dark contexts

**Effort:** S | **Dependencies:** Icon system

---

#### `src/components/molecules/Pagination.tsx`

**Problems Found:**
- #7 Feedback: No disabled state styling
- #4 Inconsistency: Button styling differs from main Button component

**Proposed Changes:**
```
- Use Button component for page navigation
- Add proper disabled states
- Show total items count option
- Add "go to page" input for large datasets
```

**Acceptance Criteria:**
- [ ] Uses Button component internally
- [ ] Disabled prev/next on boundaries

**Effort:** S | **Dependencies:** Button component

---

### 3.3 Organisms

#### `src/components/organisms/Navbar.tsx`

**Problems Found:**
- #1 Flow: No global search in navbar (major gap)
- #5 Icons: BookIcon imported but hamburger/close are inline SVGs
- #4 Inconsistency: Mobile menu uses different padding than desktop
- #3 Spacing: Nav items `gap-6` but mobile uses `space-y-1`

**Proposed Changes:**
```
- Add SearchBar to desktop navbar (right of nav items)
- Add mobile search in hamburger menu
- Replace inline SVGs with icon components
- Standardize mobile menu item padding to py-3
- Add keyboard navigation (arrow keys between nav items)
```

**Acceptance Criteria:**
- [ ] Search visible in desktop navbar
- [ ] Mobile menu has search field
- [ ] All icons use icon system
- [ ] Arrow key navigation works

**Effort:** M | **Dependencies:** SearchBar, Icon system

---

#### `src/components/organisms/UserAvatarDropdown.tsx`

**Problems Found:**
- #7 Feedback: Menu items lack hover background
- #1 Flow: No "My Orders" link for shop purchases
- #5 Icons: All icons are inline SVGs

**Proposed Changes:**
```
- Add hover:bg-neutral-800 to all menu items
- Add "My Orders" menu item
- Replace inline SVGs with icon system
- Add role="menu" for accessibility
```

**Effort:** S | **Dependencies:** Icon system

---

#### `src/features/shop/components/cart/CartDrawer.tsx`

**Problems Found:**
- #4 Inconsistency: Uses CSS vars `--shop-*` while rest of app uses Tailwind
- #1 Flow: No "Continue Shopping" link when cart has items
- #7 Feedback: Clear cart has no confirmation

**Proposed Changes:**
```
- Replace CSS vars with Tailwind classes
- Add "Continue Shopping" below checkout button
- Add confirmation before clearing cart
- Add swipe-to-dismiss on mobile
```

**Effort:** M | **Dependencies:** Modal component (for confirm)

---

### 3.4 Pages

#### `src/app/(public)/page.tsx` (Home)

**Problems Found:**
- #2 Effects: Hero gradient `from-neutral-950/60 via-neutral-950/80` is complex
- #5 Icons: All icons are emoji (inconsistent with app)
- #3 Spacing: Section padding varies (`py-20` everywhere)
- #6 Redundant: Scroll indicator arrow + manual scrolling

**Proposed Changes:**
```
- Simplify hero gradient to 2 stops
- Replace emoji icons with custom illustrations or icon components
- Standardize section padding: py-16 mobile, py-24 desktop
- Remove scroll indicator (standard behavior)
- Add section IDs for anchor navigation
```

**Effort:** M | **Dependencies:** None

---

#### `src/app/(public)/learn/page.tsx`

**Problems Found:**
- #1 Flow: No search functionality (critical for 50+ courses)
- #1 Flow: No filters (by level, duration, category)
- #3 Spacing: `space-y-2` between rows is too tight

**Proposed Changes:**
```
- Add search bar above course rows
- Add filter chips (Level, Duration, Category)
- Increase row spacing: space-y-2 → space-y-6
- Add "Your Progress" section for logged-in users
```

**Effort:** L | **Dependencies:** SearchBar, Filters

---

#### `src/app/(public)/test/page.tsx`

**Problems Found:**
- #3 Spacing: Level detail card padding inconsistent
- #7 Feedback: "Start Test" has no confirmation for timed exam
- #1 Flow: No "Back to all levels" link in detail view

**Proposed Changes:**
```
- Standardize detail card padding: p-6 on mobile, p-8 on desktop
- Add confirmation modal before starting timed test
- Add breadcrumb navigation
- Improve accessibility of progress bar
```

**Effort:** M | **Dependencies:** Modal

---

#### `src/app/(public)/forum/page.tsx`

**Problems Found:**
- #3 Spacing: PostCard padding varies
- #4 Inconsistency: Category filter buttons differ from shop filters
- #7 Feedback: Vote buttons have no immediate feedback

**Proposed Changes:**
```
- Standardize PostCard padding to p-4
- Unify filter button styles with shop CategoryPill
- Add optimistic UI for voting
- Add "Back to top" button on long lists
```

**Effort:** M | **Dependencies:** CategoryPill component

---

#### `src/app/(public)/shop/page.tsx`

**Problems Found:**
- #4 Inconsistency: ProductCard styling differs from other cards
- #1 Flow: No quick-add-to-cart on product card hover
- #6 Redundant: "More Info" + "Add to Cart" could be one action

**Proposed Changes:**
```
- Align ProductCard with Card atom styling
- Add hover quick-add button
- Make card click go to detail, button adds to cart
- Add wishlist/save functionality
```

**Effort:** M | **Dependencies:** Card atom

---

#### `src/app/(public)/space/page.tsx`

**Problems Found:**
- #1 Flow: Locked state has good CTA but no preview of what Space offers
- #3 Spacing: Sections have inconsistent margins

**Proposed Changes:**
```
- Add blurred preview of Space content behind lock
- Standardize section margins to mb-8
- Add testimonial from Space user on locked screen
```

**Effort:** S | **Dependencies:** None

---

#### `src/app/(public)/sprint/page.tsx`

**Problems Found:**
- #3 Spacing: Hero section `py-12 sm:py-16` differs from other pages
- #4 Inconsistency: Sprint card styling differs from other cards

**Proposed Changes:**
```
- Align hero padding with other pages
- Unify sprint card with Card atom
- Add project count badges on sprint cards
```

**Effort:** S | **Dependencies:** Card atom

---

#### `src/app/(public)/member/layout.tsx`

**Problems Found:**
- #5 Icons: All sidebar icons are inline SVGs
- #3 Spacing: Sidebar item padding `py-2.5` inconsistent
- #1 Flow: No indication of incomplete profile sections

**Proposed Changes:**
```
- Replace inline SVGs with icon system
- Standardize padding to py-3
- Add completion indicator dots on sidebar items
- Add mobile bottom navigation
```

**Effort:** M | **Dependencies:** Icon system

---

### 3.5 Feature Components

#### `src/features/test/components/TestLevelProgressBar.tsx`

**Problems Found:**
- #7 Feedback: No keyboard navigation between levels
- #4 Inconsistency: Step circles `w-8 h-8 sm:w-10 sm:h-10` are custom sizes
- #8 Charts: Tier labels at bottom could be clearer

**Proposed Changes:**
```
- Add tabindex and arrow key navigation
- Standardize step size: 32px mobile, 40px desktop
- Add aria-label and aria-current attributes
- Make tier labels clickable to jump to first level in tier
```

**Effort:** M | **Dependencies:** None

---

#### `src/features/learn/components/CourseCard.tsx`

**Problems Found:**
- #4 Inconsistency: Fixed widths `w-[180px] sm:w-[200px]` should be responsive
- #7 Feedback: Play button overlay appears on hover only (inaccessible)
- #2 Effects: Shadow `shadow-black/40` on hover is heavy

**Proposed Changes:**
```
- Use responsive width with min/max constraints
- Make play button always visible with reduced opacity
- Lighten shadow: shadow-lg shadow-black/20
- Add focus state for keyboard users
```

**Effort:** S | **Dependencies:** None

---

#### `src/features/learn/components/CourseRow.tsx`

**Problems Found:**
- #7 Feedback: Scroll arrows only visible on hover (hidden on touch)
- #3 Spacing: `gap-3` between cards too tight

**Proposed Changes:**
```
- Show scroll indicators when content overflows
- Increase gap: gap-3 → gap-4
- Add touch swipe momentum
- Add visible "scroll for more" hint on mobile
```

**Effort:** S | **Dependencies:** None

---

#### `src/features/forum/components/PostCard.tsx` (inline in page.tsx)

**Problems Found:**
- #3 Spacing: Complex nested padding
- #4 Inconsistency: Vote section layout differs desktop/mobile

**Proposed Changes:**
```
- Extract to separate component file
- Simplify padding structure
- Unify vote section across breakpoints
- Add skeleton loading state
```

**Effort:** M | **Dependencies:** None

---

#### `src/features/checkout/components/ui/FormInput.tsx`

**Problems Found:**
- #4 Inconsistency: Uses light theme (`bg-white`, `text-gray-*`) in dark app
- #7 Feedback: No loading state for async validation

**Proposed Changes:**
```
- Create dark theme variant or make themeable
- Add async validation loading indicator
- Add success state (green check)
- Align with app design system
```

**Effort:** M | **Dependencies:** Design tokens

---

### 3.6 Icons

#### `src/components/icons/Icon.tsx` (EXISTING - Well Implemented)

**Strengths Found:**
- 50+ icons with unified IconBase component
- Consistent stroke width (1.5) enforced via IconBase
- Proper size props: sm=16px, md=20px, lg=24px
- Uses currentColor for theming
- Includes ICONS map for dynamic usage

**Problems Found:**
- #5 Icons: Not 100% adopted - some pages still use inline SVGs
- #5 Icons: VideoPlayer.tsx has 160+ lines of local icon definitions
- #5 Icons: Forum page has inline SVGs for category icons

**Proposed Changes:**
```
- Replace all inline SVGs in pages with Icon component imports
- Replace VideoPlayer local icons with Icon system imports
- May need to add 2-3 missing icons to the system
```

**Effort:** M | **Dependencies:** Pages using inline SVGs

---

## 4. PRD - Product Requirements Document

### 4.1 Executive Summary

**Current State:**
nuvaClub has a functional dark-mode UI with component-based architecture. However, inconsistencies across components, missing states, and accessibility gaps create a "almost polished" experience that undermines user trust and engagement.

**Target State:**
A systematized design system with:
- Consistent spacing, typography, and colors
- Full interactive feedback on all actions
- Accessible to keyboard and screen reader users
- Polished micro-interactions that feel premium

**Key Outcomes:**
- Reduced cognitive load through visual consistency
- Improved task completion through clear feedback
- Higher perceived quality through attention to detail
- Better accessibility scores (WCAG AA compliance)

---

### 4.2 Goals / Non-Goals

**Goals:**
1. Establish design tokens and use consistently
2. Standardize all UI primitives (Button, Card, Badge, Input)
3. Add missing states to all interactive elements
4. Improve mobile spacing and touch targets
5. Create unified icon system
6. Add search functionality to key pages
7. Achieve WCAG AA accessibility

**Non-Goals:**
- Changing business logic or features
- Redesigning information architecture
- Adding new pages or features
- Dark/light mode toggle (staying dark-only)

---

### 4.3 Design Principles (Hard Rules)

1. **Consistency Through Tokens:** Every color, spacing, and radius value must come from the design system
2. **Reduce Visual Noise:** Prefer subtle effects; avoid gradients, glows, heavy shadows
3. **Improve Scanability:** Visual hierarchy through size/weight, not decoration
4. **Every Action Gets Feedback:** Loading, success, error states on all interactions
5. **Accessibility Baseline:** Focus visible, keyboard navigable, sufficient contrast
6. **Mobile-First Spacing:** Increase density on desktop, not decrease on mobile

---

### 4.4 Target UX Improvements (Mapped to 8 Mistakes)

#### Mistake 1: User Flow Gaps

**Detection:** Missing search, missing skip/back/cancel, missing navigation
**New Standard:** Every listing page has search. Every multi-step flow has back. Every modal has close.

**Bad → Good Examples:**
- Learn page without search → Search bar with filters above course rows
- Test exam with no exit → Confirmation modal with "Save Progress" option
- Cart drawer with no continue → "Continue Shopping" link always visible

#### Mistake 2: Overusing Effects

**Detection:** Multi-stop gradients, heavy shadows, glows
**New Standard:** Max 2 gradient stops. Shadows only on elevation changes. No glows.

**Bad → Good Examples:**
- `from-neutral-950/60 via-neutral-950/80 to-neutral-950` → `from-black/50 to-black`
- `shadow-2xl` on modal → `shadow-lg shadow-black/30`
- Glow on primary button → Solid color with subtle scale on press

#### Mistake 3: Spacing / Layout Density

**Detection:** Inconsistent padding, cramped mobile layouts
**New Standard:** 8px spacing system. Min 44px touch targets. Generous mobile padding.

**Bad → Good Examples:**
- `py-1.5` (6px) on small button → `py-2` (8px) minimum
- `space-y-2` between course rows → `space-y-6`
- `gap-3` in card grid → `gap-4` or `gap-6`

#### Mistake 4: Inconsistent Components

**Detection:** Same element styled differently across pages
**New Standard:** Single source of truth for each component. No inline overrides.

**Bad → Good Examples:**
- ProductCard in shop vs Card atom → Use Card atom everywhere
- Category buttons in forum vs shop → Unified CategoryPill component
- Different button heights → sm=32, md=40, lg=48px fixed

#### Mistake 5: Icons (Quality + Consistency)

**Detection:** Mix of inline SVGs, emojis, icon components
**New Standard:** All icons from unified icon system. 1.5 stroke width. 3 sizes.

**Bad → Good Examples:**
- Inline `<svg>` everywhere → `<Icon name="search" />`
- Emoji pain points on home → Custom illustrated icons or removed
- `strokeWidth={2}` vs `{1.5}` → Always `1.5` for outlined

#### Mistake 6: Redundant Elements

**Detection:** Duplicate affordances, unnecessary decorations
**New Standard:** One clear affordance per action. Remove if it doesn't aid comprehension.

**Bad → Good Examples:**
- Scroll indicator + page scroll → Remove indicator
- "More Info" + "Add to Cart" → Click card for detail, button for cart
- Decorative dividers between sections → Remove or use spacing

#### Mistake 7: Interactive Feedback

**Detection:** Buttons without loading/pressed state, no confirmation on destructive actions
**New Standard:** All buttons have hover/active/loading/disabled. All destructive actions confirm.

**Bad → Good Examples:**
- "Start Test" with no confirm → Modal: "This is a timed test. Ready?"
- "Clear Cart" with no confirm → Modal: "Remove all items?"
- Vote button with no feedback → Optimistic update + animation

#### Mistake 8: Charts/Data Visualization

**Detection:** Progress indicators without labels, unclear data display
**New Standard:** All data visualizations have clear labels and accessible alternatives.

**Bad → Good Examples:**
- Progress bar with only percentage → "3 of 12 levels completed"
- Rating stars without number → Stars + "4.8" label always

---

### 4.5 Design System Spec

#### Typography Scale

| Token | Size | Weight | Line Height | Usage |
|-------|------|--------|-------------|-------|
| `text-xs` | 12px | 400 | 16px | Captions, timestamps |
| `text-sm` | 14px | 400/500 | 20px | Body small, buttons |
| `text-base` | 16px | 400/500 | 24px | Body default |
| `text-lg` | 18px | 500/600 | 28px | Card titles |
| `text-xl` | 20px | 600 | 28px | Section headers |
| `text-2xl` | 24px | 700 | 32px | Page headers |
| `text-3xl` | 30px | 700 | 36px | Hero subheads |
| `text-4xl+` | 36px+ | 700 | 40px+ | Hero headlines |

#### Spacing Scale

| Token | Value | Usage |
|-------|-------|-------|
| `space-1` | 4px | Inline spacing, icon gaps |
| `space-2` | 8px | Button padding, tight gaps |
| `space-3` | 12px | Card padding (sm) |
| `space-4` | 16px | Card padding (md), gaps |
| `space-6` | 24px | Card padding (lg), section gaps |
| `space-8` | 32px | Section margins |
| `space-12` | 48px | Page sections |
| `space-16` | 64px | Hero padding |

#### Corner Radius Scale

| Token | Value | Usage |
|-------|-------|-------|
| `rounded` | 4px | Small inputs, tags |
| `rounded-md` | 6px | Badges |
| `rounded-lg` | 8px | Buttons, inputs |
| `rounded-xl` | 12px | Cards, modals |
| `rounded-2xl` | 16px | Large cards, dialogs |
| `rounded-full` | 9999px | Avatars, pills |

**Rule:** Use `rounded-xl` for all Card-like containers. No mixing.

#### Shadow Policy

| Level | Shadow | Usage |
|-------|--------|-------|
| Level 0 | none | Default flat elements |
| Level 1 | `shadow-sm shadow-black/10` | Hover states |
| Level 2 | `shadow-lg shadow-black/20` | Modals, dropdowns |
| Level 3 | `shadow-xl shadow-black/30` | Popovers, toasts |

**Rule:** Never use `shadow-2xl`. Reserve shadows for elevation changes only.

#### Color Usage Rules

| Token | Value | Usage |
|-------|-------|-------|
| `primary-500` | #3b82f6 | Interactive elements, links |
| `primary-600` | #2563eb | Button backgrounds, hovers |
| `neutral-950` | #0a0a0a | App background |
| `neutral-900` | #171717 | Card backgrounds |
| `neutral-800` | #262626 | Elevated surfaces, inputs |
| `neutral-700` | #404040 | Borders |
| `neutral-400` | #a3a3a3 | Muted text |
| `neutral-200` | #e5e5e5 | Primary text |
| `success` | green-500 | Success states |
| `warning` | amber-500 | Warning states |
| `error` | red-500 | Error states |

**Rule:** Text on dark backgrounds: `text-white` or `text-neutral-200` for primary, `text-neutral-400` for secondary.

#### Button Standards

| Variant | Height | Padding | Background | Text |
|---------|--------|---------|------------|------|
| Primary sm | 32px | px-3 py-2 | primary-600 | white |
| Primary md | 40px | px-4 py-2.5 | primary-600 | white |
| Primary lg | 48px | px-6 py-3 | primary-600 | white |
| Secondary | same | same | neutral-800 | white |
| Outline | same | same | transparent | neutral-200 |
| Ghost | same | same | transparent | neutral-300 |

**States Required:**
- `:hover` - Lighter background
- `:active` - `scale-[0.98]`
- `:focus-visible` - `ring-2 ring-primary-500`
- `:disabled` - `opacity-50 cursor-not-allowed`
- `isLoading` - Spinner replaces icon

#### Input/Search Field Standard

| Property | Value |
|----------|-------|
| Height | 40px (default), 48px (large) |
| Padding | px-3 py-2.5 |
| Background | neutral-800 |
| Border | 1px neutral-700 |
| Border Radius | rounded-lg |
| Focus | ring-2 ring-primary-500 |

#### Card Standard

| Property | Value |
|----------|-------|
| Background | neutral-900 |
| Border | 1px neutral-800 |
| Border Radius | rounded-xl |
| Padding | p-4 (default), p-6 (large) |
| Hover | border-neutral-700, shadow-lg |

#### Icon Rules

| Property | Value |
|----------|-------|
| Library | Custom icon component system |
| Stroke Width | 1.5px (outlined) |
| Sizes | sm=16px, md=20px, lg=24px |
| Color | currentColor (inherits text) |

**Rule:** No inline SVGs. All icons through `<Icon name="x" size="md" />`.

---

### 4.6 Component Specifications

#### Button Component

**Current Issues:**
- Inconsistent heights across sizes
- No active/pressed state
- Focus ring hardcoded to neutral-950 offset

**New Spec:**

```typescript
interface ButtonProps {
  variant: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: IconName;
  rightIcon?: IconName;
  fullWidth?: boolean;
}
```

**Visual Spec:**
- Heights: sm=32px, md=40px, lg=48px (fixed)
- Active state: `active:scale-[0.98]`
- Focus: `focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent`
- Loading: Left icon replaced with spinner, text preserved

**Accessibility:**
- `aria-busy="true"` when loading
- `aria-disabled="true"` when disabled

---

#### Card Component

**Current Issues:**
- Radius varies (xl vs 2xl)
- Hover only changes border

**New Spec:**

```typescript
interface CardProps {
  children: ReactNode;
  variant?: 'default' | 'elevated' | 'interactive';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  as?: 'div' | 'article' | 'section';
}
```

**Visual Spec:**
- Always `rounded-xl`
- Interactive variant: `hover:shadow-lg hover:border-neutral-700 cursor-pointer`
- Elevated variant: `shadow-lg` by default

---

#### Icon Component (EXISTING - `src/components/icons/Icon.tsx`)

**Already Implemented:**

```typescript
// Already exists with this interface:
interface IconProps extends Omit<SVGProps<SVGSVGElement>, 'children'> {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

// Dynamic icon component for runtime icon selection
function Icon({ name, ...props }: IconProps & { name: IconName }) {
  const IconComponent = ICONS[name];
  return <IconComponent {...props} />;
}

// 50+ icons available including:
// Navigation: SearchIcon, MenuIcon, XIcon, HomeIcon
// Arrows: ChevronLeftIcon, ChevronRightIcon, ArrowRightIcon
// User: UserIcon, UsersIcon, LogoutIcon
// Actions: PlusIcon, MinusIcon, CheckIcon, TrashIcon, EditIcon
// Media: PlayIcon, PlaySolidIcon, PauseIcon
// Commerce: ShoppingCartIcon, ShoppingBagIcon, CubeIcon
// Status: StarIcon, HeartIcon, BookmarkIcon, FireIcon
// ...and many more
```

**Current Implementation (Good):**
- IconBase wrapper with consistent stroke-width: 1.5
- Sizes: sm=16px (w-4 h-4), md=20px (w-5 h-5), lg=24px (w-6 h-6)
- ViewBox: 24x24 (standard)
- Color: currentColor (inherits from parent)
- aria-hidden="true" for decorative icons

**Action Needed:**
- Ensure 100% adoption across all components
- Replace inline SVGs with imports from this system

---

#### SearchBar Component

**Current Issues:**
- Uses shop-specific CSS vars
- Rounded-full inconsistent

**New Spec:**

```typescript
interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSearch?: () => void;
  placeholder?: string;
  isLoading?: boolean;
  size?: 'md' | 'lg';
}
```

**Visual Spec:**
- `rounded-lg` (not full)
- Loading spinner when `isLoading`
- Clear button when value present
- Uses standard input tokens

---

### 4.7 Page UX Specs

#### Home Page (`/`)

**Flow Improvements:**
- Add anchor navigation to sections
- Add "back to top" floating button

**Redundant Removals:**
- Remove scroll indicator animation
- Simplify hero gradient

**Micro-interaction Upgrades:**
- Stagger animation on pillar cards
- Hover scale on pricing cards

---

#### Learn Page (`/learn`)

**Flow Improvements:**
- Add SearchBar above course rows
- Add filter chips: Level, Duration
- Add "Your Progress" section for logged-in users

**Empty State:**
- "No courses match your search. Try adjusting your filters."

**Loading State:**
- Skeleton course row (3-4 cards)

---

#### Test Page (`/test`)

**Flow Improvements:**
- Add confirmation modal before starting test
- Add breadcrumb: Test > Level 3

**Accessibility:**
- Add keyboard navigation to progress bar
- Add aria-labels to level buttons

---

#### Forum Page (`/forum`)

**Flow Improvements:**
- Already has search (good)
- Unify filter buttons with shop

**Empty State:**
- Already implemented (good)

**Micro-interactions:**
- Optimistic voting with animation

---

#### Shop Page (`/shop`)

**Flow Improvements:**
- Quick-add to cart on product hover
- Cart count animation on add

**Empty State:**
- "No products in this category yet."

---

#### Space Page (`/space`)

**Flow Improvements:**
- Blurred preview behind lock screen
- Testimonial from Space user

---

#### Checkout Flow (`/checkout`)

**Flow Improvements:**
- Step indicator shows completion
- Validation feedback on blur

**Visual Fix:**
- FormInput needs dark theme support

---

---

## 5. Change List (By File Path)

### Atoms

| File | Component | Problems | Changes | Effort |
|------|-----------|----------|---------|--------|
| `src/components/atoms/Button.tsx` | Button | #3 #4 #7 | Add heights, active state, fix focus | S |
| `src/components/atoms/Card.tsx` | Card | #4 #7 | Standardize radius, add shadow hover | S |
| `src/components/atoms/Badge.tsx` | Badge | #3 #4 | Increase sm padding, add info variant | S |
| `src/components/atoms/Modal.tsx` | Modal | #3 #7 #1 | Add padding prop, footer slot | M |
| `src/components/atoms/Skeleton.tsx` | Skeleton | - | Good as-is | - |

### Molecules

| File | Component | Problems | Changes | Effort |
|------|-----------|----------|---------|--------|
| `src/components/molecules/SearchBar.tsx` | SearchBar | #2 #4 #5 #7 | Use rounded-lg, remove CSS vars, add loading | S |
| `src/components/molecules/Pagination.tsx` | Pagination | #4 #7 | Use Button, add disabled states | S |
| `src/components/molecules/RatingStars.tsx` | RatingStars | - | Good as-is | - |
| `src/components/molecules/PageTransition.tsx` | PageTransition | - | Good as-is | - |

### Organisms

| File | Component | Problems | Changes | Effort |
|------|-----------|----------|---------|--------|
| `src/components/organisms/Navbar.tsx` | Navbar | #1 #5 #4 #3 | Add search, use icons, fix mobile padding | M |
| `src/components/organisms/UserAvatarDropdown.tsx` | UserAvatarDropdown | #5 #7 #1 | Use icons, add hover, add Orders link | S |
| `src/components/organisms/HeroCarousel.tsx` | HeroCarousel | - | Review for consistency | S |

### Icons (New)

| File | Component | Problems | Changes | Effort |
|------|-----------|----------|---------|--------|
| `src/components/icons/Icon.tsx` | Icon (new) | #5 | Create unified icon component | M |
| `src/components/icons/icons/*.tsx` | Individual icons | #5 | Extract all inline SVGs | L |

### Feature Components

| File | Component | Problems | Changes | Effort |
|------|-----------|----------|---------|--------|
| `src/features/shop/components/cart/CartDrawer.tsx` | CartDrawer | #4 #1 #7 | Remove CSS vars, add continue link, confirm clear | M |
| `src/features/shop/components/cart/CartItem.tsx` | CartItem | #4 | Align with Card atom | S |
| `src/features/test/components/TestLevelProgressBar.tsx` | TestLevelProgressBar | #7 #4 #8 | Add keyboard nav, aria, standardize sizes | M |
| `src/features/learn/components/CourseCard.tsx` | CourseCard | #4 #7 #2 | Responsive width, always show play, lighter shadow | S |
| `src/features/learn/components/CourseRow.tsx` | CourseRow | #7 #3 | Show scroll always, increase gap | S |
| `src/features/forum/components/PostCard.tsx` | PostCard | #3 #4 | Extract component, simplify padding | M |
| `src/features/checkout/components/ui/FormInput.tsx` | FormInput | #4 | Add dark theme support | M |

### Pages

| File | Page | Problems | Changes | Effort |
|------|------|----------|---------|--------|
| `src/app/(public)/page.tsx` | Home | #2 #5 #3 #6 | Simplify gradient, remove scroll indicator | M |
| `src/app/(public)/learn/page.tsx` | Learn | #1 #3 | Add search, filters, increase spacing | L |
| `src/app/(public)/test/page.tsx` | Test | #3 #7 #1 | Add confirm modal, breadcrumb | M |
| `src/app/(public)/forum/page.tsx` | Forum | #3 #4 #7 | Standardize padding, unify filters, optimistic voting | M |
| `src/app/(public)/shop/page.tsx` | Shop | #4 #1 #6 | Align cards, quick-add, simplify actions | M |
| `src/app/(public)/space/page.tsx` | Space | #1 #3 | Add preview behind lock | S |
| `src/app/(public)/sprint/page.tsx` | Sprint | #3 #4 | Align hero padding, unify cards | S |
| `src/app/(public)/member/layout.tsx` | Member Layout | #5 #3 #1 | Use icons, standardize padding, add mobile nav | M |
| `src/app/(public)/checkout/page.tsx` | Checkout | #4 | FormInput dark theme | M |

### CSS

| File | Changes | Effort |
|------|---------|--------|
| `src/app/globals.css` | Add new design tokens, remove shop-specific vars | S |

---

## 6. Renovation Roadmap

### Phase 0: Baseline & Safety (1-2 days)

**Objectives:**
- Document current visual state
- Set up visual regression testing

**Tasks:**
1. [ ] Screenshot all pages at desktop + mobile
2. [ ] Set up Percy or similar for visual diff
3. [ ] Create branch `ui-renovation`
4. [ ] Document all components using inline SVGs

**Deliverables:**
- Screenshot archive
- Visual testing baseline

---

### Phase 1: System Foundation (3-4 days)

**Objectives:**
- Establish design tokens
- Create unified icon system
- Update core primitives

**Tasks:**
1. [ ] Update `globals.css` with new token comments
2. [ ] Create `Icon.tsx` component with factory
3. [ ] Extract top 20 most-used inline SVGs to icons
4. [ ] Update `Button.tsx` with new heights + states
5. [ ] Update `Card.tsx` with standardized radius
6. [ ] Update `Badge.tsx` with new sizes
7. [ ] Update `Modal.tsx` with footer slot

**Deliverables:**
- Icon component system
- Updated atom components
- Design token documentation

---

### Phase 2: Component Refactor (4-5 days)

**Objectives:**
- Update all organisms to use new atoms
- Fix molecule inconsistencies
- Align feature components

**Tasks:**
1. [ ] Refactor `Navbar.tsx` - add search, use icons
2. [ ] Refactor `UserAvatarDropdown.tsx` - use icons
3. [ ] Refactor `SearchBar.tsx` - remove CSS vars
4. [ ] Refactor `CartDrawer.tsx` - remove CSS vars, add confirm
5. [ ] Refactor `TestLevelProgressBar.tsx` - add accessibility
6. [ ] Refactor `CourseCard.tsx` - responsive, focus states
7. [ ] Refactor `CourseRow.tsx` - show scroll, spacing
8. [ ] Extract `PostCard.tsx` to component file
9. [ ] Update `FormInput.tsx` - dark theme

**Deliverables:**
- All components using icon system
- Consistent styling across features

---

### Phase 3: Page-by-Page Upgrade (5-6 days)

**Objectives:**
- Fix spacing on all pages
- Add missing states
- Remove redundant elements

**Tasks:**
1. [ ] Home page - simplify hero, remove scroll indicator
2. [ ] Learn page - add search, filters, fix spacing
3. [ ] Test page - add confirm modal, breadcrumb
4. [ ] Forum page - unify filters, optimistic voting
5. [ ] Shop page - align cards, quick-add
6. [ ] Space page - add preview behind lock
7. [ ] Sprint page - align cards, fix spacing
8. [ ] Member layout - add mobile nav, fix icons
9. [ ] Checkout - dark theme forms

**Deliverables:**
- All pages using new components
- Consistent spacing throughout

---

### Phase 4: Micro-Interactions & Polish (2-3 days)

**Objectives:**
- Add missing loading states
- Add pressed/active states
- Final animation polish

**Tasks:**
1. [ ] Add loading states to all async buttons
2. [ ] Add skeleton loaders where missing
3. [ ] Add active:scale to all buttons
4. [ ] Polish modal animations
5. [ ] Add toast notifications for cart actions
6. [ ] Add optimistic UI for voting

**Deliverables:**
- Full interactive feedback
- Polished animations

---

### Phase 5: QA & Release (2-3 days)

**Objectives:**
- Accessibility audit
- Cross-browser testing
- Final visual QA

**Tasks:**
1. [ ] Run axe accessibility audit
2. [ ] Test keyboard navigation on all flows
3. [ ] Test on Safari, Firefox, Chrome
4. [ ] Test on iOS Safari, Android Chrome
5. [ ] Compare screenshots to baseline
6. [ ] Fix any regressions
7. [ ] Update documentation

**Deliverables:**
- Accessibility report (target: 0 critical issues)
- Cross-browser test report
- Final visual QA sign-off

---

## 7. QA Checklist

### Accessibility

- [ ] All buttons have focus-visible states
- [ ] All interactive elements keyboard accessible
- [ ] Color contrast meets WCAG AA (4.5:1 for text)
- [ ] All images have alt text
- [ ] Form inputs have associated labels
- [ ] Error messages announced to screen readers
- [ ] Modal traps focus correctly
- [ ] Skip link available

### Component States

For each component, verify:

- [ ] **Button:** hover, active, focus, disabled, loading
- [ ] **Card:** default, hover (interactive)
- [ ] **Badge:** all variants render correctly
- [ ] **Modal:** open, close, escape key, overlay click
- [ ] **Input:** default, focus, error, disabled, loading
- [ ] **SearchBar:** empty, has value, loading, clear

### Page States

For each page, verify:

- [ ] **Loading:** Skeleton shows correctly
- [ ] **Empty:** Empty state message shows
- [ ] **Error:** Error state handles gracefully
- [ ] **Success:** Success feedback shows

### Responsive

Test at these breakpoints:

- [ ] 320px (small mobile)
- [ ] 375px (iPhone)
- [ ] 768px (tablet)
- [ ] 1024px (laptop)
- [ ] 1440px (desktop)

### Cross-Browser

- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] iOS Safari
- [ ] Android Chrome

---

## 8. Open Questions / Assumptions

### Assumptions Made

1. **Dark mode only:** No light mode planned, so form inputs will get dark styling
2. **Icon count:** Assuming ~30-40 unique icons needed based on audit
3. **Search behavior:** Assuming client-side filtering for MVP, server-side later
4. **Animation budget:** Assuming 60fps target, will use will-change sparingly

### Questions for Product/Design

1. **Search scope:** Should navbar search be global or page-specific?
2. **Toast duration:** How long should success/error toasts persist? (Suggest 3s)
3. **Loading thresholds:** At what delay should skeletons appear? (Suggest 200ms)
4. **Cart behavior:** Should cart auto-open on add? (Suggest yes, with close after 2s)
5. **Form validation:** Validate on blur or on submit? (Suggest blur for UX)

### Technical Considerations

1. **Icon bundle size:** Will tree-shake unused icons via named exports
2. **Animation performance:** Will use transform/opacity only, GPU-accelerated
3. **Dark theme forms:** May need custom focus rings for accessibility
4. **Mobile navigation:** Consider bottom nav vs hamburger (recommend hamburger for now)

---

## Document History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-01-23 | AI Audit | Initial comprehensive audit |
| 2.0 | 2026-01-23 | AI Audit | Deep code audit - Updated findings based on actual code review. Icon system is well-implemented (50+ icons). Button/Badge/Card atoms are solid. Main issues: inline SVGs in pages, missing search on Learn, focus trap in Modal, missing Dropdown component. |

---

## Quick Reference: Key Files to Modify

### Phase 1 Priority (Foundation)
1. `src/components/atoms/Modal.tsx` - Add focus trap
2. `src/components/molecules/Dropdown.tsx` - CREATE new shared component
3. `src/components/organisms/Navbar.tsx` - Mobile spacing, avatar fallback

### Phase 2 Priority (Icon Adoption)
4. `src/features/learn/components/VideoPlayer.tsx` - Replace 160+ lines of local icons
5. `src/app/(public)/forum/page.tsx` - Replace inline SVGs
6. `src/app/(public)/shop/page.tsx` - Replace inline SVGs

### Phase 3 Priority (UX Gaps)
7. `src/app/(public)/learn/page.tsx` - Add search functionality
8. `src/features/shop/components/cart/CartDrawer.tsx` - Add clear confirmation
9. `src/features/shop/components/cart/CartItem.tsx` - Increase touch targets
10. `src/features/sprint/components/SprintFilters.tsx` - Use shared Dropdown

---

*This document serves as the single source of truth for the UI/UX renovation project. All implementation should reference this document for specifications and acceptance criteria.*
