# PRD: Page Loading Animation System

## Overview

This document outlines the implementation plan for a comprehensive page loading animation system across all pages of nuvaClub. The system will display skeleton placeholders that match the exact layout of each page section, with smooth opacity transitions until the content is fully loaded.

---

## Design Principles

### Visual Approach
- **Skeleton blocks match actual layout** - Each skeleton mirrors the exact dimensions and positioning of the real content
- **Opacity-based transitions** - Smooth fade from skeleton → real content (no jarring pops)
- **Consistent timing** - All animations use the same easing curve and duration
- **Staggered reveals** - Sections animate in sequence (top to bottom) for visual flow
- **Dark theme aligned** - Skeleton colors: `bg-neutral-800` with `animate-pulse`

### Technical Approach
- **Header always visible** - Navbar renders immediately, never shows skeleton
- **Client-side hydration detection** - Use `useEffect` + state to detect when React hydrates
- **Suspense boundaries** - Leverage React Suspense for async data sections
- **Reusable skeleton components** - Create atomic skeleton primitives

---

## Animation Specifications

| Property | Value |
|----------|-------|
| Skeleton background | `bg-neutral-800` |
| Pulse animation | `animate-pulse` (Tailwind default) |
| Fade-in duration | `300ms` |
| Fade-in easing | `ease-out` |
| Stagger delay between sections | `100ms` |
| Minimum skeleton display | `200ms` (prevents flash) |

---

## Global Components to Create

### 1. `PageLoadingProvider`
Context provider that tracks page hydration state.

```
Location: /src/components/providers/PageLoadingProvider.tsx
```

**Responsibilities:**
- Track if page is hydrated
- Provide loading state to children
- Manage minimum display time

### 2. `SkeletonPrimitive` Components
Atomic building blocks for skeletons.

```
Location: /src/components/atoms/Skeleton.tsx
```

**Components:**
- `SkeletonBox` - Rectangular placeholder (configurable w/h)
- `SkeletonText` - Text line placeholder (configurable width)
- `SkeletonCircle` - Circular placeholder (avatar)
- `SkeletonImage` - Image placeholder with aspect ratio
- `SkeletonCard` - Card container with rounded corners
- `SkeletonButton` - Button placeholder

### 3. `PageTransition` Wrapper
Handles opacity transition from skeleton to content.

```
Location: /src/components/molecules/PageTransition.tsx
```

**Features:**
- Wraps page content
- Manages opacity animation
- Shows skeleton while loading, fades to real content

---

## Page-by-Page Implementation

---

### 1. Homepage (`/`)

**Route:** `/src/app/(public)/page.tsx`

**Sections to Animate:**

| Section | Skeleton Layout |
|---------|-----------------|
| Hero | Full-width video placeholder (16:9), centered title skeleton, subtitle skeleton, CTA button skeleton |
| Features | Grid of 5 feature card skeletons (icon circle + title + description lines) |
| Identity/Role | Heading skeleton + horizontal role tier cards (4 cards) |
| CTA Section | Centered heading + subtext + button skeleton |

**Skeleton Component:** `HomePageSkeleton`

```
/src/components/skeletons/HomePageSkeleton.tsx
```

**Animation Flow:**
1. Hero fades in (0ms)
2. Features fade in (100ms delay)
3. Identity section fades in (200ms delay)
4. CTA fades in (300ms delay)

---

### 2. Learn Main Page (`/learn`)

**Route:** `/src/app/(public)/learn/page.tsx`

**Sections to Animate:**

| Section | Skeleton Layout |
|---------|-----------------|
| VideoHero | Full-width 16:9 placeholder with gradient overlay, title + badge skeletons |
| CourseRow(s) | Section title skeleton + horizontal scroll of 4-6 course card skeletons |

**Course Card Skeleton:**
- Thumbnail (16:9 aspect)
- Title line (80% width)
- Instructor line (60% width)
- Badge + duration row

**Skeleton Component:** `LearnPageSkeleton`

```
/src/components/skeletons/LearnPageSkeleton.tsx
```

**Animation Flow:**
1. VideoHero fades in (0ms)
2. First CourseRow fades in (100ms)
3. Second CourseRow fades in (200ms)
4. Subsequent rows stagger at 100ms each

---

### 3. Course Detail Page (`/learn/[courseId]`)

**Route:** `/src/app/(public)/learn/[courseId]/page.tsx`

**Sections to Animate:**

| Section | Skeleton Layout |
|---------|-----------------|
| Hero Banner | Full-width image placeholder, title + category badge + instructor info skeletons |
| Main Content (2/3) | Description card skeleton + lessons list skeleton (5-8 lesson items) |
| Sidebar (1/3) | Sticky card with image, metadata lines, tags row, CTA button |

**Lesson Item Skeleton:**
- Number circle + title line + duration line + lock icon

**Skeleton Component:** `CourseDetailSkeleton`

```
/src/components/skeletons/CourseDetailSkeleton.tsx
```

**Animation Flow:**
1. Hero banner (0ms)
2. Sidebar appears (100ms)
3. Description card (150ms)
4. Lessons list items stagger (50ms each)

---

### 4. Forum Main Page (`/forum`)

**Route:** `/src/app/(public)/forum/page.tsx`

**Sections to Animate:**

| Section | Skeleton Layout |
|---------|-----------------|
| Header | Title skeleton + description + category filter buttons (5 button skeletons) |
| Sort Options | 3 pill button skeletons |
| Pinned Posts | 1-2 post card skeletons with pin indicator |
| Posts Grid | 6-8 post card skeletons |

**Post Card Skeleton:**
- Category badge + title (2 lines)
- Author row (avatar circle + name line + date)
- Content preview (3 lines)
- Tags row (3-4 tag badges)
- Actions row (upvote/downvote + view count + comments)

**Skeleton Component:** `ForumPageSkeleton`

```
/src/components/skeletons/ForumPageSkeleton.tsx
```

**Animation Flow:**
1. Header + filters (0ms)
2. Pinned posts (100ms)
3. Post cards stagger (50ms each)

---

### 5. Forum Post Detail (`/forum/[postId]`)

**Route:** `/src/app/(public)/forum/[postId]/page.tsx`

**Sections to Animate:**

| Section | Skeleton Layout |
|---------|-----------------|
| Back Link | Arrow icon + text skeleton |
| Post Card | Full post skeleton (badge, title, author, content blocks, tags, actions) |
| Comments Section | Comment input skeleton + 3-5 comment card skeletons |

**Comment Skeleton:**
- Avatar + author info
- Content lines (2-3)
- Timestamp + like button

**Skeleton Component:** `PostDetailSkeleton`

```
/src/components/skeletons/PostDetailSkeleton.tsx
```

**Animation Flow:**
1. Post card (0ms)
2. Comment input (100ms)
3. Comments stagger (50ms each)

---

### 6. Space Page (`/space`)

**Route:** `/src/app/(public)/space/page.tsx`

**Sections to Animate:**

**Locked State:**
| Section | Skeleton Layout |
|---------|-----------------|
| Lock Message | Icon + title + description |
| Plan Cards | 3 plan comparison card skeletons |
| CTA | Button skeleton |

**Unlocked State:**
| Section | Skeleton Layout |
|---------|-----------------|
| Header | Title + identity badge skeleton |
| Companion Grid | 6-9 companion card skeletons (3 columns) |

**Companion Card Skeleton:**
- Avatar circle with online indicator
- Name + type badge
- Rating stars + match count
- Bio lines (2-3)
- Expertise tags (3-4)
- Action buttons (2)

**Skeleton Component:** `SpacePageSkeleton`

```
/src/components/skeletons/SpacePageSkeleton.tsx
```

**Animation Flow:**
1. Header (0ms)
2. Companion cards stagger by row (100ms per row)

---

### 7. Sprint Main Page (`/sprint`)

**Route:** `/src/app/(public)/sprint/page.tsx`

**Sections to Animate:**

| Section | Skeleton Layout |
|---------|-----------------|
| Header | Title + description centered |
| Current Season | Season title + badge + date range + sprint cards grid (3 columns) |
| Past Works | Section title + filter dropdowns + archived projects grid (4 columns) |

**Sprint Card Skeleton:**
- Thumbnail with gradient overlay
- Badge + theme tag
- Title + description lines
- Metadata row

**Skeleton Component:** `SprintPageSkeleton`

```
/src/components/skeletons/SprintPageSkeleton.tsx
```

**Animation Flow:**
1. Header (0ms)
2. Current season header (100ms)
3. Sprint cards stagger (50ms each)
4. Past works section (200ms)
5. Archive cards stagger (30ms each)

---

### 8. Test Main Page (`/test`)

**Route:** `/src/app/(public)/test/page.tsx`

**Sections to Animate:**

| Section | Skeleton Layout |
|---------|-----------------|
| Page Title | Title + description |
| Progress Overview | Current level display + stats row + progress bar |
| Level Categories | 4 colored info boxes |
| Level Grid | 12 level card skeletons (4x3 grid) |

**Level Card Skeleton:**
- Level number circle
- Title + description
- Status indicator

**Skeleton Component:** `TestPageSkeleton`

```
/src/components/skeletons/TestPageSkeleton.tsx
```

**Animation Flow:**
1. Title + description (0ms)
2. Progress overview (100ms)
3. Category boxes (150ms)
4. Level cards stagger (40ms each)

---

### 9. Test Level Detail (`/test/[level]`)

**Route:** `/src/app/(public)/test/[level]/page.tsx`

**Sections to Animate:**

| Section | Skeleton Layout |
|---------|-----------------|
| Back Button | Icon + text |
| Level Card | Large level number + tier description + test info box + history box |
| Action Buttons | 1-2 button skeletons |
| Warning Box | Icon + text lines |

**Skeleton Component:** `TestLevelSkeleton`

```
/src/components/skeletons/TestLevelSkeleton.tsx
```

**Animation Flow:**
1. Level card (0ms)
2. Info boxes (100ms)
3. Buttons + warning (150ms)

---

### 10. Test Exam Page (`/test/[level]/exam`)

**Route:** `/src/app/(public)/test/[level]/exam/page.tsx`

**Sections to Animate:**

| Section | Skeleton Layout |
|---------|-----------------|
| Header | Level info + timer placeholder + progress bar |
| Question Area | Question number + question text lines + answer options (4 radio/checkbox skeletons) |
| Navigation | Previous/Next/Submit button skeletons |

**Skeleton Component:** `TestExamSkeleton`

```
/src/components/skeletons/TestExamSkeleton.tsx
```

**Animation Flow:**
1. Header (0ms)
2. Question area (100ms)
3. Answer options stagger (50ms each)
4. Navigation (200ms)

---

### 11. Test Results Page (`/test/results/[sessionId]`)

**Route:** `/src/app/(public)/test/results/[sessionId]/page.tsx`

**Sections to Animate:**

| Section | Skeleton Layout |
|---------|-----------------|
| Result Summary | Score display + pass/fail indicator + performance text |
| Question Review | List of question review cards |
| Suggestions | Recommendation card |

**Skeleton Component:** `TestResultsSkeleton`

```
/src/components/skeletons/TestResultsSkeleton.tsx
```

---

### 12. Shop Main Page (`/shop`)

**Route:** `/src/app/(public)/shop/page.tsx`

**Sections to Animate:**

| Section | Skeleton Layout |
|---------|-----------------|
| VideoHero | Full-width video placeholder |
| Shop Header | Search bar skeleton + tagline |
| Sidebar (1/3) | Category filter skeletons (4 items) + additional filter skeletons (3 items) |
| Product Grid (2/3) | Results count + 6-9 product card skeletons |
| Recommendations | Carousel skeleton with 4 product card hints |

**Product Card Skeleton:**
- Image (square aspect)
- Title line
- Price line
- Rating row

**Skeleton Component:** `ShopPageSkeleton`

```
/src/components/skeletons/ShopPageSkeleton.tsx
```

**Animation Flow:**
1. VideoHero (0ms)
2. Header + search (100ms)
3. Sidebar (150ms)
4. Product cards stagger by row (50ms each)
5. Recommendations carousel (300ms)

---

### 13. Shop Event Detail (`/shop/events/[eventId]`)

**Route:** `/src/app/(public)/shop/events/[eventId]/page.tsx`

**Sections to Animate:**

| Section | Skeleton Layout |
|---------|-----------------|
| EventHero | Banner image placeholder |
| Breadcrumb | 3 text skeletons with separators |
| Left Content (2/3) | Overview card + agenda card + FAQ card skeletons |
| Right Sidebar (1/3) | Price + date + button + details list |

**Skeleton Component:** `EventDetailSkeleton`

```
/src/components/skeletons/EventDetailSkeleton.tsx
```

---

### 14. Checkout Page (`/checkout`)

**Route:** `/src/app/(public)/checkout/page.tsx`

**Sections to Animate:**

| Section | Skeleton Layout |
|---------|-----------------|
| Back Link | Arrow + text |
| Order Summary (2/3) | 2-3 cart item skeletons (image + name + variant + quantity + price) |
| Payment Sidebar (1/3) | Subtotal + tax + total lines + place order button |

**Skeleton Component:** `CheckoutSkeleton`

```
/src/components/skeletons/CheckoutSkeleton.tsx
```

---

### 15. Document Page (`/document`)

**Route:** `/src/app/(public)/document/page.tsx`

**Sections to Animate:**

| Section | Skeleton Layout |
|---------|-----------------|
| Back Link | Arrow + text |
| Page Header | Icon + title + description |
| Content Area | Multiple paragraph skeletons (varying widths) |
| Quick Actions | Card with text + button |

**Skeleton Component:** `DocumentSkeleton`

```
/src/components/skeletons/DocumentSkeleton.tsx
```

---

## Implementation Architecture

### File Structure

```
/src/components/
├── atoms/
│   └── Skeleton.tsx                 # Primitive skeleton components
├── molecules/
│   └── PageTransition.tsx           # Transition wrapper
├── providers/
│   └── PageLoadingProvider.tsx      # Loading state context
└── skeletons/
    ├── HomePageSkeleton.tsx
    ├── LearnPageSkeleton.tsx
    ├── CourseDetailSkeleton.tsx
    ├── ForumPageSkeleton.tsx
    ├── PostDetailSkeleton.tsx
    ├── SpacePageSkeleton.tsx
    ├── SprintPageSkeleton.tsx
    ├── TestPageSkeleton.tsx
    ├── TestLevelSkeleton.tsx
    ├── TestExamSkeleton.tsx
    ├── TestResultsSkeleton.tsx
    ├── ShopPageSkeleton.tsx
    ├── EventDetailSkeleton.tsx
    ├── CheckoutSkeleton.tsx
    └── DocumentSkeleton.tsx
```

### Usage Pattern

Each page will follow this pattern:

```tsx
// Example: /src/app/(public)/learn/page.tsx
'use client'

import { PageTransition } from '@/components/molecules/PageTransition'
import { LearnPageSkeleton } from '@/components/skeletons/LearnPageSkeleton'

export default function LearnPage() {
  return (
    <PageTransition skeleton={<LearnPageSkeleton />}>
      {/* Actual page content */}
    </PageTransition>
  )
}
```

### PageTransition Component Logic

```tsx
export function PageTransition({
  children,
  skeleton,
  minLoadTime = 200
}: Props) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [showContent, setShowContent] = useState(false)

  useEffect(() => {
    // Mark as loaded after hydration
    setIsLoaded(true)

    // Ensure minimum display time
    const timer = setTimeout(() => {
      setShowContent(true)
    }, minLoadTime)

    return () => clearTimeout(timer)
  }, [minLoadTime])

  return (
    <div className="relative">
      {/* Skeleton */}
      <div className={cn(
        "transition-opacity duration-300 ease-out",
        showContent ? "opacity-0 pointer-events-none" : "opacity-100"
      )}>
        {skeleton}
      </div>

      {/* Real content */}
      <div className={cn(
        "transition-opacity duration-300 ease-out",
        showContent ? "opacity-100" : "opacity-0 absolute inset-0"
      )}>
        {children}
      </div>
    </div>
  )
}
```

---

## Implementation Priority

### Phase 1 - Core Infrastructure
1. Create `Skeleton.tsx` atomic components
2. Create `PageTransition.tsx` wrapper
3. Create `PageLoadingProvider.tsx` context

### Phase 2 - High-Traffic Pages
4. `HomePageSkeleton.tsx`
5. `LearnPageSkeleton.tsx`
6. `ShopPageSkeleton.tsx`
7. `ForumPageSkeleton.tsx`

### Phase 3 - Detail Pages
8. `CourseDetailSkeleton.tsx`
9. `PostDetailSkeleton.tsx`
10. `EventDetailSkeleton.tsx`
11. `CheckoutSkeleton.tsx`

### Phase 4 - Feature Pages
12. `SpacePageSkeleton.tsx`
13. `SprintPageSkeleton.tsx`
14. `TestPageSkeleton.tsx`
15. `TestLevelSkeleton.tsx`
16. `TestExamSkeleton.tsx`
17. `TestResultsSkeleton.tsx`
18. `DocumentSkeleton.tsx`

### Phase 5 - Integration & Polish
19. Integrate all skeletons with pages
20. Fine-tune animation timings
21. Test on slow connections (Chrome DevTools throttling)
22. Verify no layout shift (CLS)

---

## Quality Checklist

For each skeleton implementation, verify:

- [ ] Skeleton dimensions match real content exactly
- [ ] Layout matches (grid columns, flex direction, gaps)
- [ ] Colors use `bg-neutral-800` with `animate-pulse`
- [ ] Rounded corners match actual components
- [ ] No cumulative layout shift when content loads
- [ ] Stagger delays create pleasant visual flow
- [ ] Transition is smooth (300ms ease-out)
- [ ] Works on all breakpoints (mobile, tablet, desktop)
- [ ] Header remains visible throughout

---

## Success Metrics

1. **Visual smoothness** - No jarring pops or flashes
2. **Layout stability** - Zero cumulative layout shift (CLS = 0)
3. **Perceived performance** - Users see meaningful UI within 100ms
4. **Consistency** - All pages follow same animation patterns
5. **Accessibility** - Reduced motion preference respected

---

## Notes

- The Motion library (already installed) will be used for staggered animations
- Tailwind's `animate-pulse` provides the skeleton shimmer effect
- Server components will render immediately; client components will use PageTransition
- Suspense boundaries can be used for async data fetching sections
