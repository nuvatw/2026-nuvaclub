# NuvaClub Architecture

## Overview

NuvaClub is a Next.js 15 (App Router) frontend application for an AI learning platform. This document describes the architecture and the ongoing restructuring effort to centralize mock data into the `Database` folder.

**Last Analysis**: January 2026

### Migration Progress

| Phase | Status | Description |
|-------|--------|-------------|
| Phase 0 | ✅ Complete | Safety Rails - established baseline |
| Phase 1 | ✅ Complete | Data Consolidation - moved courses, sprints, products to Database/ |
| Phase 2 | ✅ Complete | Import Paths - updated 17 files to use @/Database |
| Phase 3 | ✅ Complete | Type Consolidation - Sprint, ForumPost, Companion types |
| Phase 4 | ✅ Complete | Cleanup - deleted mocks/, kept data/ for user-state |

---

## Table of Contents

1. [Directory Structure](#directory-structure)
2. [Key Concepts](#key-concepts)
3. [Naming Conventions](#naming-conventions)
4. [Import Aliases](#import-aliases)
5. [Data Flow](#data-flow)
6. [Current State Analysis](#current-state-analysis)
7. [Migration Plan](#migration-plan)
8. [Verification Gates](#verification-gates)

## Directory Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── (public)/          # Public-facing routes with Navbar/Footer
│   │   ├── checkout/
│   │   ├── document/
│   │   ├── forum/
│   │   ├── learn/
│   │   ├── member/
│   │   ├── shop/
│   │   ├── space/
│   │   ├── sprint/
│   │   └── test/
│   ├── admin/             # Admin dashboard (separate layout)
│   └── api/               # API routes
│
├── components/            # Shared UI components (atomic design)
│   ├── atoms/            # Basic building blocks (Button, Card, Badge, Modal, Skeleton)
│   ├── molecules/        # Compositions (Dropdown, Pagination, SearchBar, RatingStars)
│   ├── organisms/        # Complex components (Navbar, Footer, HeroCarousel)
│   ├── icons/            # Icon components
│   ├── skeletons/        # Loading skeleton components
│   └── templates/        # Page templates (currently empty)
│
├── Database/              # ** SINGLE SOURCE OF TRUTH FOR MOCK DATA **
│   ├── tables/           # Table-like modules for each entity type
│   │   ├── users.ts
│   │   ├── courses.ts
│   │   ├── forumPosts.ts
│   │   ├── comments.ts
│   │   ├── events.ts
│   │   ├── products.ts
│   │   ├── plans.ts
│   │   ├── seasons.ts
│   │   ├── sprints.ts
│   │   ├── companions.ts
│   │   └── ...
│   ├── schema.ts         # TypeScript types for all tables
│   ├── utils/            # Helper functions (getById, list, find, etc.)
│   ├── seed/             # Seed data generators (optional)
│   ├── index.ts          # Main entry - re-exports all tables
│   └── README.md         # Documentation for Database usage
│
├── features/              # Feature-based modules
│   ├── auth/             # Authentication (mock login, permissions)
│   ├── checkout/         # Checkout flow
│   ├── document/         # Document viewer
│   ├── duo/              # Duo pass system
│   ├── forum/            # Forum discussions
│   ├── home/             # Homepage content
│   ├── keyboard-shortcuts/
│   ├── learn/            # Courses and lessons
│   ├── mission/          # Missions/challenges
│   ├── shared/           # Shared feature utilities
│   ├── shop/             # E-commerce (products, events, plans)
│   ├── space/            # Community space
│   ├── sprint/           # Sprint challenges
│   └── test/             # AI skill tests
│
├── hooks/                 # Shared React hooks
│
├── lib/                   # Core utilities
│   ├── constants/        # Application constants
│   ├── db/               # MockDB runtime (collections, persistence)
│   └── utils/            # Utility functions
│
├── mocks/                 # ** DEPRECATED - Use Database instead **
│   └── index.ts          # Re-exports from Database for compatibility
│
└── data/                  # ** DEPRECATED - Use Database instead **
    └── index.ts          # Re-exports from Database for compatibility
```

## Key Concepts

### Database (Mock Data Layer)

All mock data lives in `src/Database/`. Each entity type is a "table":

```typescript
// src/Database/tables/users.ts
export interface User {
  id: string;
  name: string;
  avatar: string;
  identity?: UserIdentity;
}

export const UsersTable: User[] = [...];

export const getUserById = (id: string) => UsersTable.find(u => u.id === id);
export const getUsers = () => UsersTable;
```

Import from Database:
```typescript
import { UsersTable, getUserById } from '@/Database/tables/users';
// or
import { UsersTable } from '@/Database';
```

### MockDB (Runtime Layer)

`src/lib/db/` provides a runtime database abstraction with:
- Collections with CRUD operations
- LocalStorage persistence
- Event system for reactivity
- Repository pattern for business logic
- React hooks for data access

The MockDB seeds its data from `Database/tables/` on initialization.

### Features

Each feature module contains:
- `components/` - Feature-specific React components
- `hooks/` - Feature-specific hooks
- `types.ts` - TypeScript interfaces
- `index.ts` - Public exports

Features do NOT contain data files - all data comes from `Database/`.

### Components (Atomic Design)

- **Atoms**: Basic UI elements (Button, Card, Badge, Modal, Skeleton)
- **Molecules**: Combinations of atoms (Dropdown, Pagination, SearchBar)
- **Organisms**: Complex UI sections (Navbar, Footer, HeroCarousel)
- **Icons**: SVG icon components
- **Skeletons**: Loading state components

## Naming Conventions

- **Files**: kebab-case for utilities, PascalCase for components
- **Tables**: PascalCase with `Table` suffix (e.g., `UsersTable`, `CoursesTable`)
- **Types**: PascalCase (e.g., `User`, `Course`, `ForumPost`)
- **Helpers**: camelCase verbs (e.g., `getUserById`, `getCoursesbyCategory`)

## Import Aliases

```json
{
  "@/*": ["./src/*"]
}
```

Examples:
```typescript
import { Button } from '@/components/atoms';
import { UsersTable } from '@/Database';
import { useAuth } from '@/features/auth';
```

## Data Flow

1. **Static Mock Data**: Defined in `Database/tables/*.ts`
2. **Runtime Persistence**: MockDB loads data, persists to localStorage
3. **React Access**: Use hooks from `@/lib/db/hooks` or feature hooks
4. **UI Rendering**: Components consume data via hooks

## Migration Notes

### Deprecated Paths (Do Not Use)

- `@/mocks/*` - Redirects to `@/Database`
- `@/data/*` - Redirects to `@/Database`
- `@/features/*/data/*` - Moved to `@/Database/tables`

These paths have compatibility re-exports but should not be used in new code.

### Updating Old Imports

```typescript
// OLD (deprecated)
import { MOCK_USERS } from '@/mocks/entities/users.mock';
import { MOCK_COURSES } from '@/features/learn/data/courses';

// NEW (recommended)
import { UsersTable } from '@/Database/tables/users';
import { CoursesTable } from '@/Database/tables/courses';
// or
import { UsersTable, CoursesTable } from '@/Database';
```

---

## Current State Analysis

> **Status**: Migration INCOMPLETE — This section documents the actual current state vs. intended architecture.

### Problem 1: Data Source Fragmentation (Critical)

Mock data currently lives in **multiple locations** with overlapping concerns:

| Entity | Database/ | mocks/ | features/*/data/ | lib/db/seed/ |
|--------|-----------|--------|------------------|--------------|
| Users | ✅ `tables/users.ts` | ⚠️ `entities/users.mock.ts` | — | ⚠️ `users.seed.ts` |
| Courses | ❌ Missing | — | ⚠️ `learn/data/courses.ts` (60KB) | ⚠️ `learn.seed.ts` |
| Sprints | ❌ Missing | ⚠️ `entities/sprints.mock.ts` | ⚠️ `sprint/data/sprints.ts` (144KB) | ⚠️ `sprint.seed.ts` |
| Events | ✅ `tables/events.ts` | ⚠️ `entities/events.mock.ts` | — | ⚠️ `shop.seed.ts` |
| Products | ❌ Missing | ⚠️ `entities/products.mock.ts` | ⚠️ `shop/data/products.ts` | ⚠️ `shop.seed.ts` |

**Evidence**: `src/mocks/index.ts` re-exports from `@/features/sprint/data/sprints` and `@/features/learn/data/courses`, creating potential circular dependency patterns.

### Problem 2: Incomplete Database/ Migration (High)

The `Database/` folder was introduced but migration is incomplete:

**Present in Database/**:
- users, seasons, companions, plans, merchandise, forumPosts, comments, events, duo

**Missing from Database/** (still in features/):
- courses (60KB) — `src/features/learn/data/courses.ts`
- sprints (144KB) — `src/features/sprint/data/sprints.ts`
- projects — embedded in sprints.ts
- products — `src/features/shop/data/products.ts`

### Problem 3: Type Definition Duplication (High)

Same types defined in multiple places:

| Type | Location 1 | Location 2 | Location 3 |
|------|------------|------------|------------|
| Season | `features/sprint/types.ts` | `Database/tables/seasons.ts` | `lib/db/schema/sprint.schema.ts` |
| ForumPost | `features/forum/types.ts` | `Database/tables/forumPosts.ts` | `lib/db/schema/forum.schema.ts` |
| Companion | `features/space/types.ts` | `Database/tables/companions.ts` | `lib/db/schema/space.schema.ts` |

### Problem 4: Deprecated Folders Still in Active Use (Medium)

Despite being marked deprecated, these paths still have active imports:

```
# Active imports from deprecated paths:
src/features/sprint/components/SprintFilters.tsx → '@/mocks'
src/components/organisms/HeaderSearch.tsx → '@/mocks'
src/features/shared/progress/useProgress.ts → '@/data/user-data/progress'
```

### Problem 5: Feature data/ Folders (Medium)

9 feature modules maintain their own data folders:

| Feature | Data Files | Size |
|---------|------------|------|
| learn | `data/courses.ts` | 60KB |
| sprint | `data/sprints.ts` | 144KB |
| shop | 5 files in `data/` | ~31KB |
| document | 4 files in `data/` | ~77KB |
| forum | `data/posts.ts` | 24KB |
| auth | `data/test-accounts.ts` | 11KB |
| space | 2 files in `data/` | ~5KB |
| test | `data/nunu-rules.ts` | 11KB |
| home | `data/home-content.ts` | 5KB |

---

## Migration Plan

### Guiding Principles

1. **Single Source of Truth**: All mock data in `Database/`
2. **Backward Compatibility**: Re-exports at old paths during transition
3. **UI/UX Invariance**: No visual or behavioral changes
4. **Incremental & Reversible**: Small steps with verification at each phase

### Target Structure

```
src/Database/
├── tables/                   # All entity data
│   ├── users.ts
│   ├── courses.ts           # ← migrate from features/learn/data
│   ├── seasons.ts
│   ├── sprints.ts           # ← migrate from features/sprint/data
│   ├── projects.ts          # ← extract from sprints
│   ├── forumPosts.ts
│   ├── comments.ts
│   ├── companions.ts
│   ├── plans.ts
│   ├── duo.ts
│   ├── merchandise.ts
│   ├── events.ts
│   └── products.ts          # ← migrate from features/shop/data
│
├── config/                   # Static configuration
│   ├── comparisons.ts       # Plan comparison table
│   ├── identities.ts        # Identity metadata
│   ├── levels.ts            # Level definitions
│   ├── permissions.ts       # Permission rules
│   └── youtube-pool.ts      # YouTube video pool
│
├── content/                  # Static content (not entity data)
│   ├── playbook/            # Playbook document versions
│   ├── home-content.ts      # Homepage sections
│   └── nunu-rules.ts        # Nunu requirement rules
│
├── user-state/              # User-specific mock state
│   ├── favorites.ts
│   └── progress.ts
│
├── schema.ts                # Central type definitions
├── utils/
└── index.ts                 # Public API
```

### Phase 0: Safety Rails (No File Moves) ✅ COMPLETE

**Scope**: Establish verification infrastructure

**Steps**:
1. Document current import counts from deprecated paths
2. Create baseline verification script
3. Capture page route snapshot for manual testing

**File Changes**: None

**Verification**:
```bash
npm run lint && npm run build
```

### Phase 1: Data Consolidation ✅ COMPLETE

**Scope**: Move all mock data to `Database/`, add re-exports for compatibility

**1a: Migrate courses.ts**
- Copy `src/features/learn/data/courses.ts` → `Database/tables/courses.ts`
- Update `Database/index.ts` to export courses
- Replace original with re-export:
  ```typescript
  // @deprecated - Import from '@/Database' instead
  export * from '@/Database/tables/courses';
  ```

**1b: Migrate sprints.ts**
- Copy `src/features/sprint/data/sprints.ts` → `Database/tables/sprints.ts`
- Consider splitting `Project` into `Database/tables/projects.ts`
- Replace original with re-export

**1c: Migrate shop data**
- `features/shop/data/products.ts` → `Database/tables/products.ts`
- `features/shop/data/comparisons.ts` → `Database/config/comparisons.ts`
- Merge `features/shop/data/duo.ts` into existing `Database/tables/duo.ts`

**1d: Migrate config data**
- `mocks/config/*.mock.ts` → `Database/config/`
- `mocks/content/youtube-pool.ts` → `Database/config/`

**1e: Migrate content**
- `features/document/data/versions/*` → `Database/content/playbook/`
- `features/test/data/nunu-rules.ts` → `Database/content/`
- `features/home/data/home-content.ts` → `Database/content/`

**1f: Migrate user state**
- `mocks/user-state/*` → `Database/user-state/`
- `data/user-data/*` → `Database/user-state/`

### Phase 2: Update Import Paths ✅ COMPLETE

**Scope**: Update active imports to use `@/Database` directly

**Steps**:
1. Update organism imports (HeaderSearch, HeroCarousel)
2. Update feature imports (useProgress, SprintFilters)
3. Update page imports

**Search for remaining deprecated imports**:
```bash
grep -r "from '@/mocks'" src/ --include="*.ts" --include="*.tsx"
grep -r "from '@/data'" src/ --include="*.ts" --include="*.tsx"
```

### Phase 3: Type Consolidation ✅ COMPLETE

**Scope**: Consolidate duplicate type definitions

**Canonical Locations**:
- `Database/schema.ts` — entity types (User, Course, Season, etc.)
- `features/*/types.ts` — feature-specific extensions only
- `src/types/` — shared non-entity types

**Example refactor**:
```typescript
// features/sprint/types.ts becomes:
export type { Season, Sprint, Project } from '@/Database/schema';

// Feature-specific types remain here
export type SortOption = 'most-viewed' | 'most-starred';
export type SprintMode = 'voting' | 'upload' | 'ended';
```

### Phase 4: Cleanup Deprecated Folders ✅ COMPLETE

**Scope**: Remove deprecated folders after all imports updated

**Completed**:
1. ✅ Deleted `src/mocks/` folder (no external imports)
2. ✅ Kept `src/data/` folder (still has active imports for user-state types)
3. ✅ Kept `features/*/data/` re-export files for backward compatibility
4. ✅ Updated this document

**Remaining deprecated re-export files** (safe to delete when no imports remain):
- `features/learn/data/courses.ts` - re-exports from Database
- `features/sprint/data/sprints.ts` - re-exports from Database
- `features/shop/data/products.ts` - re-exports from Database

**Active feature-specific data** (should stay in features/):
- `features/home/data/home-content.ts` - homepage content
- `features/test/data/nunu-rules.ts` - test rules
- `features/auth/data/test-accounts.ts` - test accounts
- `features/document/data/` - playbook versions

---

## Verification Gates

### Automated Checks (Must Pass for Each Phase)

```bash
# Lint check
npm run lint

# TypeScript check (via build)
npm run build

# Format check (if available)
npm run format:check
```

### Manual UI Invariance Smoke Checklist

After each migration phase, manually verify:

**Header/Navigation** (all sections):
- [ ] Logo links to homepage
- [ ] All nav items clickable and link correctly
- [ ] User avatar dropdown works
- [ ] Cart icon badge updates
- [ ] Search modal opens with Cmd+K
- [ ] Login modal displays correctly

**Learn Page** (`/learn`):
- [ ] Hero carousel auto-rotates
- [ ] Course cards show thumbnails
- [ ] Hover preview appears on card hover
- [ ] Category filters work
- [ ] Course detail page loads

**Video Player** (`/learn/[courseId]`):
- [ ] Video plays/pauses
- [ ] Progress bar scrubs
- [ ] Fullscreen toggle works
- [ ] Episode drawer opens

**Forum** (`/forum`):
- [ ] Post list renders
- [ ] Sort/filter options work
- [ ] New post form submits
- [ ] Post detail shows comments

**Shop** (`/shop`):
- [ ] Plan comparison displays
- [ ] Duo month selector works
- [ ] Event detail pages load
- [ ] Add to cart works
- [ ] Cart drawer opens

**Sprint** (`/sprint`):
- [ ] Season/sprint navigation works
- [ ] Project cards display
- [ ] Voting buttons work (when enabled)
- [ ] Filters sort correctly

**Space** (`/space`):
- [ ] Matching board loads
- [ ] Post cards display
- [ ] Filters work

**Test** (`/test`):
- [ ] Level grid displays
- [ ] Test flow starts
- [ ] Questions render by type

---

## Confirmation

**This document is analysis and planning only; no UI/UX changes proposed that alter behavior.**

All changes are structural (file organization) and import path updates. No component logic, styling, or routing behavior will be modified.
