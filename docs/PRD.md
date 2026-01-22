# nuvaClub - Product Requirements Document (PRD)

**Version:** 1.0
**Last Updated:** 2026-01-22
**Author:** Engineering Team
**Status:** Active Development

---

## Table of Contents

1. [Product Overview](#1-product-overview)
2. [Information Architecture](#2-information-architecture)
3. [User Roles & Permissions](#3-user-roles--permissions)
4. [Key User Flows](#4-key-user-flows)
5. [Module Specifications](#5-module-specifications)
6. [UI/Interaction System](#6-uiinteraction-system)
7. [Design Consistency Plan](#7-design-consistency-plan)
8. [Implementation Plan](#8-implementation-plan)
9. [Acceptance Criteria](#9-acceptance-criteria)

---

## 1. Product Overview

### 1.1 What is nuvaClub?

**nuvaClub** is a comprehensive community learning platform focused on AI education and personal growth. It provides a progression-based experience through five interconnected modules:

```
Learn → Forum → Space → Sprint → Shop
```

### 1.2 Core Value Proposition

- **Learn**: Tiered course access (first chapter preview → free → paid)
- **Forum**: Community-driven discussions, Q&A, and resource sharing
- **Space**: Companion pairing system for mentorship (requires Duo Ticket)
- **Sprint**: Seasonal project challenges with community voting
- **Shop**: E-commerce for subscriptions, tickets, events, and merchandise

### 1.3 Target Users

| Segment | Profile | Primary Needs |
|---------|---------|---------------|
| **Beginners** | New to AI, curious | Free content, guidance |
| **Learners** | Active students | Full course access, community support |
| **Professionals** | Career-focused | Mentorship, networking, advanced content |
| **Creators** | Project builders | Showcase platform, feedback, recognition |

### 1.4 Tech Stack

- **Framework**: Next.js 15, React 19, TypeScript 5.7
- **Styling**: Tailwind CSS 4
- **Animation**: Motion (Framer Motion alternative)
- **State**: React Context (Auth, Cart, HoverPreview)

---

## 2. Information Architecture

### 2.1 Site Structure

```
nuvaClub
├── Learn (課程平台)
│   ├── Hero Carousel (精選課程)
│   ├── Course Rows (分類課程列表)
│   │   ├── 精選推薦
│   │   ├── AI 基礎
│   │   ├── 進階應用
│   │   ├── 實戰專案
│   │   ├── 工具技巧
│   │   └── 免費課程
│   └── Course Detail (課程詳情)
│
├── Forum (社群論壇)
│   ├── Post Feed (文章列表)
│   │   ├── Filter by Category
│   │   └── Sort by Recent/Popular
│   └── Post Detail (文章詳情)
│
├── Space (夥伴配對)
│   ├── Companion Grid (夥伴列表)
│   │   ├── Nunu (努努) - General mentors
│   │   ├── Certified Nunu (認證努努) - Professional mentors
│   │   └── Shangzhe (上哲) - Founder/VIP
│   └── Match System
│
├── Sprint (專案挑戰)
│   ├── Season Overview (賽季總覽)
│   ├── Sprint Listing (挑戰列表)
│   └── Project Gallery (專案展示)
│
└── Shop (商店)
    ├── Plans (訂閱方案)
    ├── Duo Tickets (配對票券)
    ├── Events (活動)
    └── Merchandise (周邊商品)
```

### 2.2 Module Purposes

| Module | Purpose | Monetization |
|--------|---------|--------------|
| **Learn** | AI courses & tutorials | Paid course access |
| **Forum** | Community discussions | Drives engagement |
| **Space** | 1:1 mentorship matching | Duo Tickets (Go/Run/Fly) |
| **Sprint** | Project challenges | Community building |
| **Shop** | All purchases | Plans, Tickets, Events, Merch |

---

## 3. User Roles & Permissions

### 3.1 Identity Types (6 Levels)

| Level | Identity | Monthly Cost | Access |
|-------|----------|--------------|--------|
| 0 | **Guest** | Free | First chapters, browse only |
| 1 | **Explorer** | Free (registered) | Free courses, forum read/like |
| 2 | **Solo Traveler** | NT$990 | All courses, forum post, sprint submit |
| 3 | **Duo Go** | +NT$990 | Space access (Nunu mentors) |
| 4 | **Duo Run** | +NT$2,490/quarter | Space access (Certified Nunu) |
| 5 | **Duo Fly** | +NT$4,990/quarter | Space access (Founder 1:1) |

### 3.2 Permission Matrix

| Feature | Guest | Explorer | Solo Traveler | Duo Go/Run/Fly |
|---------|-------|----------|---------------|----------------|
| View first chapter | ✅ | ✅ | ✅ | ✅ |
| View free courses | ❌ | ✅ | ✅ | ✅ |
| View all courses | ❌ | ❌ | ✅ | ✅ |
| Forum read | ✅ | ✅ | ✅ | ✅ |
| Forum like/comment | ❌ | ✅ | ✅ | ✅ |
| Forum post | ❌ | ❌ | ✅ | ✅ |
| Sprint view | ✅ | ✅ | ✅ | ✅ |
| Sprint submit | ❌ | ❌ | ✅ | ✅ |
| Sprint vote | ❌ | ❌ | ✅ | ✅ |
| Space access | ❌ | ❌ | ❌ | ✅ |
| Shop browse | ✅ | ✅ | ✅ | ✅ |
| Shop purchase | ❌ | ✅ | ✅ | ✅ |

### 3.3 Access Control Implementation

```tsx
// Gate component for permission-based rendering
<Gate
  permission="forum:post"
  fallback={<UpgradePrompt tier="solo-traveler" />}
>
  <CreatePostButton />
</Gate>
```

---

## 4. Key User Flows

### 4.1 Course Discovery → Learning

```
Guest visits Learn page
    ↓
Browses Hero Carousel (featured courses)
    ↓
Hovers course card → Preview expands (Netflix-style)
    ↓
Clicks course → Course detail page
    ↓
Watches first chapter (free)
    ↓
[LOGIN GATE] Prompted to register
    ↓
Creates account → Explorer
    ↓
[PAYWALL] Prompted to subscribe for full access
    ↓
Purchases Solo Traveler plan
    ↓
Full course access unlocked
```

### 4.2 Forum Participation

```
User visits Forum
    ↓
Browses posts by category (Discussion/Question/Share/Resource)
    ↓
Reads post, views comments
    ↓
[EXPLORER+] Upvotes helpful content
    ↓
[SOLO TRAVELER+] Creates new post
    ↓
Community engages, responds
```

### 4.3 Space Mentorship Matching

```
Solo Traveler wants mentorship
    ↓
Visits Space page
    ↓
[LOCKED] Sees Duo Ticket upsell
    ↓
Purchases Duo Go ticket → Duo Go identity
    ↓
Space unlocks → Views Nunu companions
    ↓
Selects available mentor
    ↓
Initiates match → Discord contact
    ↓
1:1 mentorship begins
```

### 4.4 Sprint Challenge Participation

```
User visits Sprint page
    ↓
Views active season & challenges
    ↓
Selects Sprint theme of interest
    ↓
[SOLO TRAVELER+] Submits project
    ↓
Community views & votes
    ↓
Rankings determined by votes
    ↓
Winners announced at season end
```

### 4.5 Shopping & Checkout

```
User browses Shop
    ↓
Filters by category (Plans/Tickets/Events/Merch)
    ↓
Adds items to cart
    ↓
Views cart drawer → Proceeds to checkout
    ↓
Reviews order summary
    ↓
Completes purchase
    ↓
Identity/access updated accordingly
```

---

## 5. Module Specifications

### 5.1 Learn Module

#### Course Data Model
```typescript
interface Course {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  thumbnailUrl: string;
  trailer?: string; // YouTube URL for hover preview
  category: string;
  tags: string[];
  instructor: { name: string; avatar: string };
  accessLevel: 'first-chapter' | 'free' | 'paid';
  lessons: Lesson[];
  totalDuration: number; // seconds
  lessonCount: number;
  isFeatured: boolean;
  createdAt: Date;
}
```

#### Course Categories
- AI 基礎 (AI Basics)
- 進階應用 (Advanced)
- 實戰專案 (Projects)
- 工具技巧 (Tools)
- 免費課程 (Free)

### 5.2 Forum Module

#### Post Data Model
```typescript
interface Post {
  id: string;
  title: string;
  content: string;
  author: { id: string; name: string; avatar: string; identity: Identity };
  category: 'discussion' | 'question' | 'share' | 'resource' | 'announcement';
  tags: string[];
  score: number;
  upvotes: number;
  downvotes: number;
  commentCount: number;
  viewCount: number;
  isPinned: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

#### Category Color Coding
| Category | Chinese | Color |
|----------|---------|-------|
| Discussion | 討論 | Blue |
| Question | 問題 | Purple |
| Share | 分享 | Green |
| Resource | 資源 | Amber |
| Announcement | 公告 | Red |

### 5.3 Space Module

#### Companion Data Model
```typescript
interface Companion {
  id: string;
  name: string;
  avatar: string;
  type: 'nunu' | 'certified-nunu' | 'shangzhe';
  bio: string;
  expertise: string[];
  discordId: string;
  isAvailable: boolean;
  matchCount: number;
  rating: number; // 1-5
}
```

#### Companion Tiers
| Tier | Chinese | Ticket Required | Features |
|------|---------|-----------------|----------|
| Nunu | 努努 | Duo Go | General community mentors |
| Certified Nunu | 認證努努 | Duo Run | Vetted professionals |
| Shangzhe | 上哲 | Duo Fly | Founder & deep experts |

### 5.4 Sprint Module

#### Sprint Data Model
```typescript
interface Sprint {
  id: string;
  seasonId: string;
  title: string;
  theme: string;
  thumbnailUrl: string;
  description: string;
  startDate: Date;
  endDate: Date;
  votingStartDate: Date;
  isVotingOpen: boolean;
  projectCount: number;
}

interface Project {
  id: string;
  sprintId: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  videoUrl?: string;
  githubUrl?: string;
  liveUrl?: string;
  techStack: string[];
  author: { id: string; name: string; avatar: string };
  voteCount: number;
  rank?: number;
}
```

### 5.5 Shop Module

#### Product Types
1. **Plans** - Subscription tiers (Explorer free, Traveler paid)
2. **Duo Tickets** - Mentorship access (Go/Run/Fly)
3. **Events** - Workshops & webinars (in-person/online)
4. **Merchandise** - Physical goods (t-shirts, mugs, etc.)

#### Cart System
```typescript
interface CartItem {
  productId: string;
  productType: 'plan' | 'duo-ticket' | 'event' | 'merchandise';
  name: string;
  price: number;
  imageUrl: string;
  quantity: number;
  selectedVariant?: string; // Size for clothing
  selectedPeriod?: string;  // Period for tickets
}
```

---

## 6. UI/Interaction System

### 6.1 Card Hover Behavior (Netflix-style) - PHASE 1 COMPLETE

#### Trigger
- Mouse enters course card in any CourseRow
- 300ms delay before expansion (prevents accidental triggers)

#### Expansion Behavior
1. **Portal Rendering**: Expanded card renders at `document.body` level via React Portal
2. **Positioning**: Calculated from original card's viewport position
3. **Scale**: Expanded to 340px width, centered on original card
4. **Z-Index**: 9999 (above all other content)
5. **No Clipping**: Portal bypasses all `overflow: hidden` containers

#### Expanded Card Content
- Video preview area (16:9 aspect ratio)
  - Auto-playing YouTube trailer (muted, looped)
  - Fallback to thumbnail if no trailer
- Play button overlay (centered)
- Access badge (top-right)
- Action buttons: "開始學習" + "加入收藏"
- Meta info: chapters, duration, instructor
- Title & description (2-line clamp)
- Tags (first 3)

#### Exit Behavior
- Mouse leaves expanded card → immediate close
- 100ms grace period when moving from base card to expanded card
- Only one card expanded at a time (global state management)

### 6.2 Modal System

#### Course Detail Modal (Phase 2)
- Full-screen overlay
- Video player (large)
- Course info panel
- Lesson list
- Instructor bio
- Related courses

### 6.3 Animation Standards

| Interaction | Duration | Easing |
|-------------|----------|--------|
| Card hover scale | 150ms | ease-out |
| Expanded card appear | 200ms | ease-out |
| Expanded card exit | 200ms | ease-out |
| Button hover | 200ms | default |
| Page transitions | 300ms | ease-in-out |

---

## 7. Design Consistency Plan

### 7.1 Component Naming Convention

| Component | Purpose | Location |
|-----------|---------|----------|
| `CourseCard` | Base course thumbnail card | `/features/learn/components/` |
| `ExpandedCourseCard` | Portal-based hover preview | `/features/learn/components/` |
| `CourseRow` | Horizontal scrollable row | `/features/learn/components/` |
| `HoverPreviewContext` | Global hover state | `/features/learn/components/` |
| `PostCard` | Forum post summary | `/features/forum/components/` |
| `CompanionCard` | Space mentor profile | `/features/space/components/` |
| `ProductCard` | Shop item display | `/features/shop/components/` |

### 7.2 Reusable Patterns

#### Horizontal Scroll Rows
Used in: Learn (CourseRow), Shop (RecommendationsCarousel)
- Left/right navigation arrows
- Hide scrollbar CSS
- Responsive card sizing
- Hover-reveal arrows

#### Card Grid Layouts
Used in: Sprint (Projects), Space (Companions), Shop (Products)
- Responsive columns: 1 → 2 → 3
- Consistent gap spacing
- Hover effects (scale, shadow)

#### Permission Gates
Used everywhere for access control
```tsx
<Gate permission="..." fallback={<UpgradePrompt />}>
  {children}
</Gate>
```

### 7.3 Color System

| Purpose | Token | Value |
|---------|-------|-------|
| Background | `neutral-950` | `#0a0a0a` |
| Card BG | `neutral-900` | `#171717` |
| Border | `neutral-800` | `#262626` |
| Text Primary | `neutral-100` | `#f5f5f5` |
| Text Secondary | `neutral-400` | `#a3a3a3` |
| Primary | `primary-600` | Blue accent |
| Success | `green-500` | Available/Free |
| Warning | `amber-500` | Premium/VIP |
| Error | `red-600` | Alerts |

---

## 8. Implementation Plan

### Phase 1: Learn Hover Preview Fix ✅ COMPLETE

**Scope:**
- [x] Create `HoverPreviewContext` for global state
- [x] Create `ExpandedCourseCard` with React Portal
- [x] Refactor `CourseCard` to use new system
- [x] Update `CourseRow` overflow handling
- [x] Update Learn page with provider

**Key Changes:**
1. Portal-based rendering eliminates z-index/overflow issues
2. Single expanded card at a time (managed by context)
3. 300ms hover delay prevents accidental triggers
4. Clean separation: base card stays in place, expanded card floats above

### Phase 2: Course Detail & Trailer Modal

**Scope:**
- [ ] Full-screen course detail modal
- [ ] Video player with trailer playback
- [ ] Lesson list with access indicators
- [ ] Progress tracking UI
- [ ] "Continue watching" functionality

**Estimated Effort:** 3-5 days

### Phase 3: Collection & Progress System

**Scope:**
- [ ] "Add to watchlist" functionality
- [ ] Course progress persistence
- [ ] "Continue Learning" row with actual progress
- [ ] Recommendation algorithm (basic)

**Estimated Effort:** 5-7 days

### Phase 4: Backend Integration

**Scope:**
- [ ] API routes for course data
- [ ] User authentication (OAuth)
- [ ] Database setup (courses, users, progress)
- [ ] Payment integration (Stripe)

**Estimated Effort:** 2-3 weeks

---

## 9. Acceptance Criteria

### 9.1 Hover Preview (Phase 1) ✅

- [x] Hover to any course card → 300ms delay → card expands
- [x] Expanded card floats above all content (z-index 9999)
- [x] Expanded card NOT clipped by any container (portal rendering)
- [x] Hover shows trailer preview (YouTube autoplay + muted)
- [x] Expanded card shows: Play button, Add button, meta info
- [x] Only ONE card expanded at a time
- [x] Click expanded card → navigates to course detail
- [x] Mouse leave → preview immediately closes
- [x] Escape key → closes preview

### 9.2 Course Detail Modal (Phase 2)

- [ ] Click course card or "開始學習" → opens modal
- [ ] Modal shows video player with trailer
- [ ] Lesson list with lock icons for paid content
- [ ] "Start Learning" CTA
- [ ] Close button and click-outside-to-close
- [ ] Keyboard navigation (Escape to close)

### 9.3 Progress & Collections (Phase 3)

- [ ] Plus button → adds to watchlist
- [ ] Watchlist persists across sessions
- [ ] Progress bar on in-progress courses
- [ ] "Continue Learning" row shows actual recent activity
- [ ] Progress percentage displayed on card

---

## Appendix A: File Structure Reference

```
src/features/learn/components/
├── CourseCard.tsx          # Base card (hover trigger)
├── CourseRow.tsx           # Horizontal scroll container
├── ExpandedCourseCard.tsx  # Portal-based expanded preview
├── HoverPreviewContext.tsx # Global hover state management
└── index.ts                # Public exports
```

## Appendix B: Key Technical Decisions

### Why React Portal for Expanded Card?

**Problem:** Original implementation had z-index and overflow clipping issues
- Parent containers with `overflow: hidden` clipped expanded cards
- Z-index battles between rows, hero, and navbar
- Expanded card appeared below original card (wrong position)

**Solution:** Portal renders expanded card at `document.body` level
- Completely outside all ancestor containers
- Z-index of 9999 ensures it's always on top
- Position calculated from original card's viewport coords

### Why Global Hover Context?

**Problem:** Multiple cards could expand simultaneously
- Each card managed its own state independently
- No coordination between cards

**Solution:** Single source of truth for expanded state
- Only one `activePreview` at a time
- Automatic cleanup when new card hovered
- Shared state accessible to both `CourseCard` and `ExpandedCourseCard`

---

**Document maintained by:** Engineering Team
**Next review:** After Phase 2 completion
