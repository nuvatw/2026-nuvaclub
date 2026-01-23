# PRD: NuvaClub Project Reorganization & Mock Data Consolidation

**Version:** 1.0.0
**Date:** 2026-01-23
**Status:** Draft

---

## Executive Summary

This PRD outlines a comprehensive reorganization of the NuvaClub codebase to:
1. **Consolidate all mock/database data** into a single `/src/mocks/` folder
2. **Clean up and standardize** the project structure for clarity
3. **Sync inconsistencies** across modules (user entities, naming conventions)
4. **Improve maintainability** through clear separation of concerns

---

## Current State Analysis

### Project Overview
- **Type:** Next.js 15 React App with TypeScript
- **Size:** 289 TypeScript/TSX files, 2.5 MB source code
- **Architecture:** Feature-based modular architecture with atomic design system

### Current Data Distribution (Problem)

Mock data is currently **scattered across multiple locations**:

| Location | Data Type | Files |
|----------|-----------|-------|
| `/src/features/learn/data/` | Courses (60 items) | `courses.ts` |
| `/src/features/forum/data/` | Posts & Comments | `posts.ts` |
| `/src/features/space/data/` | Companions (6 items) | `companions.ts`, `nunu-levels.ts` |
| `/src/features/sprint/data/` | Sprints & Seasons | `sprints.ts` |
| `/src/features/shop/data/` | Plans, Products, Comparisons | 3 files |
| `/src/features/document/data/` | Playbook versions | `versions/` folder |
| `/src/data/user-data/` | Progress, Favorites | 2 files |
| `/src/data/entities/` | Re-exports | `index.ts` |
| `/src/lib/db/seed/` | Database seeds | 7 files |
| `/src/lib/db/schema/` | Database schemas | 8 files |
| `/src/features/auth/` | Identity configs | `types.ts`, `permissions.ts` |

### Identified Inconsistencies

1. **User Entity Fragmentation**
   - Sprint module: 30 mock authors
   - Forum/Progress: 10 canonical users (user-1 to user-10)
   - No unified user source of truth

2. **Naming Convention Inconsistency**
   - Some exports use `MOCK_` prefix (MOCK_COURSES, MOCK_POSTS)
   - Others use plain names (plans, products)
   - Helper functions mixed: `getFeaturedCourses()` vs `getPostById()`

3. **Duplicate Type Definitions**
   - Companion types in `/features/space/types.ts`
   - Companion types in `/lib/db/schema/space.schema.ts`

4. **YouTube Video Pool Location**
   - 48 YouTube IDs hardcoded in `courses.ts`
   - Should be in constants or media assets

---

## Proposed Solution

### New Folder Structure

```
/src/
├── mocks/                           # NEW: Centralized mock data
│   ├── index.ts                     # Single export point
│   ├── README.md                    # Documentation for mock data
│   │
│   ├── entities/                    # Core business entities
│   │   ├── users.mock.ts            # Unified user data (30 users)
│   │   ├── courses.mock.ts          # 60 courses
│   │   ├── posts.mock.ts            # Forum posts
│   │   ├── comments.mock.ts         # Forum comments (separated)
│   │   ├── companions.mock.ts       # 6 companions
│   │   ├── sprints.mock.ts          # Sprint projects
│   │   ├── seasons.mock.ts          # 7 seasons
│   │   ├── products.mock.ts         # Shop products
│   │   ├── plans.mock.ts            # Subscription plans
│   │   └── events.mock.ts           # Event data
│   │
│   ├── user-state/                  # User-specific state mocks
│   │   ├── progress.mock.ts         # Watch progress
│   │   ├── favorites.mock.ts        # User favorites
│   │   ├── purchases.mock.ts        # Purchase history
│   │   └── notifications.mock.ts    # User notifications
│   │
│   ├── config/                      # Configuration data
│   │   ├── permissions.mock.ts      # Permission matrix
│   │   ├── identities.mock.ts       # Identity types & labels
│   │   ├── levels.mock.ts           # Course levels config
│   │   ├── nunu-levels.mock.ts      # Nunu progression
│   │   └── comparisons.mock.ts      # Plan/duo comparisons
│   │
│   ├── content/                     # Content-based mocks
│   │   ├── playbook/                # Playbook versions
│   │   │   ├── v1.0.0.ts
│   │   │   ├── v2.0.0.ts
│   │   │   ├── v3.0.0.ts
│   │   │   └── index.ts
│   │   └── youtube-pool.ts          # YouTube video IDs
│   │
│   ├── helpers/                     # Data access helpers
│   │   ├── user.helpers.ts
│   │   ├── course.helpers.ts
│   │   ├── forum.helpers.ts
│   │   ├── companion.helpers.ts
│   │   ├── sprint.helpers.ts
│   │   └── shop.helpers.ts
│   │
│   └── types/                       # Mock-specific types
│       └── index.ts                 # Re-export all mock types
│
├── features/                        # CLEANED: Remove data folders
│   ├── auth/
│   │   ├── components/
│   │   ├── hooks/
│   │   └── types.ts                 # Keep type definitions only
│   │
│   ├── learn/
│   │   ├── components/
│   │   ├── sections/
│   │   ├── hooks/                   # NEW: Extract hooks
│   │   └── types.ts
│   │
│   ├── forum/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── utils/
│   │   └── types.ts
│   │
│   ├── space/
│   │   ├── components/
│   │   ├── hooks/                   # NEW: Extract hooks
│   │   └── types.ts
│   │
│   ├── sprint/
│   │   ├── components/
│   │   ├── hooks/                   # NEW: Extract hooks
│   │   └── types.ts
│   │
│   ├── shop/
│   │   ├── components/
│   │   ├── hooks/
│   │   └── types.ts
│   │
│   ├── checkout/
│   │   ├── components/
│   │   ├── context/
│   │   └── types.ts
│   │
│   ├── document/
│   │   ├── components/
│   │   ├── utils/
│   │   └── types.ts
│   │
│   ├── duo/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── utils/
│   │   └── types.ts
│   │
│   ├── test/
│   │   ├── components/
│   │   ├── hooks/                   # NEW
│   │   └── types.ts
│   │
│   └── shared/
│       ├── sections/
│       └── progress/
│
├── components/                      # UNCHANGED: Atomic design
│   ├── atoms/
│   ├── molecules/
│   ├── organisms/
│   ├── skeletons/
│   ├── icons/
│   └── templates/
│
├── data/                            # DEPRECATED: Move to /mocks/
│   └── types/                       # KEEP: Shared type definitions
│       ├── common.ts
│       ├── sections.ts
│       ├── user.ts
│       └── index.ts
│
├── lib/
│   ├── constants/                   # KEEP: Non-mock constants
│   │   ├── shop.ts
│   │   ├── pagination.ts
│   │   ├── timing.ts
│   │   └── routes.ts                # NEW: Route constants
│   │
│   ├── utils/
│   │   ├── date.ts
│   │   ├── format.ts                # NEW: Formatting utils
│   │   └── index.ts
│   │
│   └── db/                          # SIMPLIFIED: Schema only
│       ├── schema/
│       │   ├── user.schema.ts
│       │   ├── learn.schema.ts
│       │   ├── forum.schema.ts
│       │   ├── space.schema.ts
│       │   ├── sprint.schema.ts
│       │   ├── shop.schema.ts
│       │   ├── test.schema.ts
│       │   └── index.ts
│       │
│       └── core/                    # Database engine
│           ├── MockDB.ts
│           ├── Collection.ts
│           └── types.ts
│
└── app/                             # UNCHANGED: Next.js routes
    └── ...
```

---

## Detailed Changes

### Phase 1: Create Mock Data Infrastructure

#### 1.1 Create `/src/mocks/` folder structure

```
mkdir -p src/mocks/{entities,user-state,config,content/playbook,helpers,types}
```

#### 1.2 Unified Users Mock (`/src/mocks/entities/users.mock.ts`)

Merge 30 sprint authors + 10 canonical users into single source:

```typescript
// Canonical users (user-1 to user-10) + Sprint authors
export const MOCK_USERS: User[] = [
  // Core platform users
  { id: 'user-1', username: 'Sarah Chen', avatar: '...', role: 'traveler', ... },
  { id: 'user-2', username: 'Mike Torres', avatar: '...', role: 'explorer', ... },
  // ... (10 canonical users)

  // Sprint community users (additional 20)
  { id: 'user-11', username: 'Alex Kim', avatar: '...', ... },
  // ... (up to 30 total)
];

// Helper exports
export const getCanonicalUsers = () => MOCK_USERS.slice(0, 10);
export const getSprintAuthors = () => MOCK_USERS;
export const getUserById = (id: string) => MOCK_USERS.find(u => u.id === id);
```

#### 1.3 Standardized Naming Convention

All mock exports follow pattern:
- `MOCK_*` for raw data arrays/objects
- `get*ById()`, `get*ByType()` for accessors
- `is*()` for boolean checks
- `create*()` for factory functions (if needed)

```typescript
// Example: /src/mocks/entities/courses.mock.ts
export const MOCK_COURSES: Course[] = [...];
export const MOCK_FEATURED_COURSES: Course[] = [...];

export const getCourseById = (id: string) => MOCK_COURSES.find(c => c.id === id);
export const getCoursesByLevel = (level: number) => MOCK_COURSES.filter(c => c.level === level);
export const getFeaturedCourses = () => MOCK_FEATURED_COURSES;
export const isFreeCourse = (course: Course) => course.price === 0;
```

### Phase 2: Migrate Existing Data

| Source | Destination | Action |
|--------|-------------|--------|
| `/features/learn/data/courses.ts` | `/mocks/entities/courses.mock.ts` | Move + standardize |
| `/features/forum/data/posts.ts` | `/mocks/entities/posts.mock.ts` + `comments.mock.ts` | Split + move |
| `/features/space/data/companions.ts` | `/mocks/entities/companions.mock.ts` | Move + standardize |
| `/features/space/data/nunu-levels.ts` | `/mocks/config/nunu-levels.mock.ts` | Move |
| `/features/sprint/data/sprints.ts` | `/mocks/entities/sprints.mock.ts` + `seasons.mock.ts` | Split + move |
| `/features/shop/data/plans.ts` | `/mocks/entities/plans.mock.ts` | Move + standardize |
| `/features/shop/data/products.ts` | `/mocks/entities/products.mock.ts` + `events.mock.ts` | Split |
| `/features/shop/data/comparisons.ts` | `/mocks/config/comparisons.mock.ts` | Move |
| `/data/user-data/progress.ts` | `/mocks/user-state/progress.mock.ts` | Move |
| `/data/user-data/favorites.ts` | `/mocks/user-state/favorites.mock.ts` | Move |
| `/features/auth/types.ts` (data only) | `/mocks/config/identities.mock.ts` | Extract data |
| `/features/auth/permissions.ts` | `/mocks/config/permissions.mock.ts` | Move |
| `/features/learn/types.ts` (levels) | `/mocks/config/levels.mock.ts` | Extract data |
| `/features/document/data/versions/` | `/mocks/content/playbook/` | Move |
| YouTube pool in courses.ts | `/mocks/content/youtube-pool.ts` | Extract |
| `/lib/db/seed/*` | DELETE | Replaced by /mocks/ |
| `/data/entities/` | DELETE | Replaced by /mocks/index.ts |
| `/data/user-data/` | DELETE | Moved to /mocks/user-state/ |

### Phase 3: Update Imports

Update all import statements across the codebase:

```typescript
// BEFORE
import { MOCK_COURSES, getFeaturedCourses } from '@/features/learn/data/courses';
import { MOCK_POSTS } from '@/features/forum/data/posts';
import { PERMISSION_MATRIX } from '@/features/auth/permissions';

// AFTER
import { MOCK_COURSES, getFeaturedCourses } from '@/mocks/entities/courses.mock';
import { MOCK_POSTS } from '@/mocks/entities/posts.mock';
import { PERMISSION_MATRIX } from '@/mocks/config/permissions.mock';

// OR via central export
import { MOCK_COURSES, MOCK_POSTS, PERMISSION_MATRIX } from '@/mocks';
```

### Phase 4: Clean Up Feature Folders

Remove `/data/` folders from features after migration:

```
rm -rf src/features/learn/data/
rm -rf src/features/forum/data/
rm -rf src/features/space/data/
rm -rf src/features/sprint/data/
rm -rf src/features/shop/data/
rm -rf src/features/document/data/
rm -rf src/data/entities/
rm -rf src/data/user-data/
rm -rf src/lib/db/seed/
```

### Phase 5: Type Consolidation

Move mock-related types to `/src/mocks/types/`:

```typescript
// /src/mocks/types/index.ts
export type { User, UserRole, UserIdentity } from './user.types';
export type { Course, Chapter, Lesson, CourseLevel } from './course.types';
export type { Post, Comment, PostCategory } from './forum.types';
export type { Companion, CompanionType } from './companion.types';
export type { Sprint, Season, Project } from './sprint.types';
export type { Product, Plan, DuoTier, Event } from './shop.types';
```

Keep shared application types in `/src/data/types/` (rename to `/src/types/`).

---

## File-by-File Migration Plan

### New Files to Create (26 files)

| File | Purpose | Source Data |
|------|---------|-------------|
| `/mocks/index.ts` | Central export | - |
| `/mocks/entities/users.mock.ts` | 30 unified users | Sprint authors + canonical users |
| `/mocks/entities/courses.mock.ts` | 60 courses | learn/data/courses.ts |
| `/mocks/entities/posts.mock.ts` | Forum posts | forum/data/posts.ts |
| `/mocks/entities/comments.mock.ts` | Forum comments | forum/data/posts.ts |
| `/mocks/entities/companions.mock.ts` | 6 companions | space/data/companions.ts |
| `/mocks/entities/sprints.mock.ts` | Sprint projects | sprint/data/sprints.ts |
| `/mocks/entities/seasons.mock.ts` | 7 seasons | sprint/data/sprints.ts |
| `/mocks/entities/products.mock.ts` | Shop products | shop/data/products.ts |
| `/mocks/entities/plans.mock.ts` | Subscription plans | shop/data/plans.ts |
| `/mocks/entities/events.mock.ts` | Events | shop/data/products.ts |
| `/mocks/user-state/progress.mock.ts` | Watch progress | data/user-data/progress.ts |
| `/mocks/user-state/favorites.mock.ts` | Favorites | data/user-data/favorites.ts |
| `/mocks/user-state/purchases.mock.ts` | Purchase history | NEW |
| `/mocks/config/permissions.mock.ts` | Permission matrix | auth/permissions.ts |
| `/mocks/config/identities.mock.ts` | Identity configs | auth/types.ts (extracted) |
| `/mocks/config/levels.mock.ts` | Course level configs | learn/types.ts (extracted) |
| `/mocks/config/nunu-levels.mock.ts` | Nunu progression | space/data/nunu-levels.ts |
| `/mocks/config/comparisons.mock.ts` | Plan/duo comparisons | shop/data/comparisons.ts |
| `/mocks/content/youtube-pool.ts` | YouTube video IDs | learn/data/courses.ts (extracted) |
| `/mocks/content/playbook/v1.0.0.ts` | Playbook v1 | document/data/versions/ |
| `/mocks/content/playbook/v2.0.0.ts` | Playbook v2 | document/data/versions/ |
| `/mocks/content/playbook/v3.0.0.ts` | Playbook v3 | document/data/versions/ |
| `/mocks/content/playbook/index.ts` | Playbook exports | document/data/playbook-content.ts |
| `/mocks/helpers/index.ts` | Helper exports | Various |
| `/mocks/types/index.ts` | Type re-exports | - |

### Files to Delete (after migration, 15 files/folders)

```
src/features/learn/data/           # courses.ts
src/features/forum/data/           # posts.ts
src/features/space/data/           # companions.ts, nunu-levels.ts
src/features/sprint/data/          # sprints.ts
src/features/shop/data/            # plans.ts, products.ts, comparisons.ts
src/features/document/data/        # playbook-content.ts, versions/
src/data/entities/                 # index.ts
src/data/user-data/                # progress.ts, favorites.ts, index.ts
src/lib/db/seed/                   # 7 seed files
```

### Files to Modify (import updates, ~50+ files)

All files importing from the deleted locations need import path updates.

---

## Code Cleanup Standards

### Folder Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| Features | kebab-case | `learn`, `forum`, `space` |
| Components | PascalCase file | `VideoPlayer.tsx` |
| Hooks | camelCase with `use` prefix | `useAuth.ts` |
| Utils | camelCase | `formatDate.ts` |
| Types | camelCase | `types.ts` |
| Mocks | kebab-case with `.mock.ts` | `users.mock.ts` |
| Constants | kebab-case | `shop.ts` |

### Export Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| Mock data arrays | SCREAMING_SNAKE_CASE with MOCK_ prefix | `MOCK_COURSES` |
| Config objects | SCREAMING_SNAKE_CASE | `PERMISSION_MATRIX` |
| Helper functions | camelCase | `getCourseById` |
| Boolean helpers | camelCase with `is` prefix | `isFreeCourse` |
| Types/Interfaces | PascalCase | `Course`, `User` |
| Enums | PascalCase | `UserRole`, `PostCategory` |

### File Organization Within Each Mock File

```typescript
// 1. Imports (types, dependencies)
import type { Course, Chapter, Lesson } from '@/mocks/types';
import { YOUTUBE_POOL } from '@/mocks/content/youtube-pool';

// 2. Constants (if any)
const LESSONS_PER_CHAPTER = 5;
const CHAPTERS_PER_COURSE = 3;

// 3. Main mock data export
export const MOCK_COURSES: Course[] = [
  // ...data
];

// 4. Derived/computed exports
export const MOCK_FEATURED_COURSES = MOCK_COURSES.filter(c => c.featured);

// 5. Helper functions (accessors)
export const getCourseById = (id: string): Course | undefined =>
  MOCK_COURSES.find(c => c.id === id);

export const getCoursesByLevel = (level: number): Course[] =>
  MOCK_COURSES.filter(c => c.level === level);

// 6. Boolean helpers
export const isFreeCourse = (course: Course): boolean =>
  course.price === 0;

// 7. Factory functions (if needed)
export const createMockCourse = (overrides: Partial<Course>): Course => ({
  id: `course-${Date.now()}`,
  title: 'Mock Course',
  // ...defaults
  ...overrides,
});
```

---

## Central Export Structure

### `/src/mocks/index.ts`

```typescript
// ============================================================
// NUVACLUB MOCK DATA - CENTRAL EXPORT
// ============================================================

// ENTITIES
export * from './entities/users.mock';
export * from './entities/courses.mock';
export * from './entities/posts.mock';
export * from './entities/comments.mock';
export * from './entities/companions.mock';
export * from './entities/sprints.mock';
export * from './entities/seasons.mock';
export * from './entities/products.mock';
export * from './entities/plans.mock';
export * from './entities/events.mock';

// USER STATE
export * from './user-state/progress.mock';
export * from './user-state/favorites.mock';
export * from './user-state/purchases.mock';

// CONFIG
export * from './config/permissions.mock';
export * from './config/identities.mock';
export * from './config/levels.mock';
export * from './config/nunu-levels.mock';
export * from './config/comparisons.mock';

// CONTENT
export * from './content/youtube-pool';
export * from './content/playbook';

// TYPES
export * from './types';
```

---

## Impact Analysis

### Breaking Changes

1. **All import paths change** - Every file importing mock data needs updates
2. **Some type locations change** - Mock-specific types move to `/mocks/types/`
3. **Helper function locations change** - All data helpers move to `/mocks/helpers/`

### Risk Mitigation

1. **Staged rollout** - Migrate one feature at a time
2. **Alias support** - Keep temporary re-exports for compatibility
3. **TypeScript validation** - Compile after each phase to catch issues
4. **Search & replace** - Use IDE refactoring tools for bulk updates

---

## Testing Requirements

### Pre-Migration Checklist

- [ ] All existing tests pass
- [ ] App builds without errors
- [ ] Manual smoke test of all features

### Post-Migration Validation

- [ ] All import paths resolve correctly
- [ ] TypeScript compiles without errors
- [ ] All existing tests still pass
- [ ] No runtime errors in browser console
- [ ] All mock data accessible via `/mocks/index.ts`
- [ ] No orphaned files in old locations

---

## Implementation Order

### Step 1: Infrastructure (no breaking changes)
1. Create `/src/mocks/` folder structure
2. Create empty index files
3. Create types barrel export

### Step 2: Migrate Entities (one at a time)
1. Users (unified from sprint + canonical)
2. Courses (with YouTube pool extraction)
3. Posts + Comments (split)
4. Companions
5. Sprints + Seasons (split)
6. Products + Events (split)
7. Plans

### Step 3: Migrate User State
1. Progress
2. Favorites
3. Create Purchases (new)

### Step 4: Migrate Config
1. Permissions
2. Identities (extract from auth/types.ts)
3. Levels (extract from learn/types.ts)
4. Nunu levels
5. Comparisons

### Step 5: Migrate Content
1. YouTube pool
2. Playbook versions

### Step 6: Update All Imports
1. Feature by feature
2. Components
3. App routes
4. Utils/hooks

### Step 7: Cleanup
1. Delete old data folders
2. Delete old seed files
3. Remove temporary re-exports
4. Final validation

---

## Success Criteria

1. **Single source of truth** - All mock data in `/src/mocks/`
2. **Consistent naming** - All exports follow MOCK_* convention
3. **Unified users** - Single user list (30 users) used across all features
4. **Clean features** - No `/data/` folders in feature modules
5. **Working app** - All functionality preserved
6. **Passing tests** - All existing tests pass
7. **Zero orphans** - No unused files left behind

---

## Appendix A: Complete File Mapping

| Old Path | New Path | Action |
|----------|----------|--------|
| `features/learn/data/courses.ts` | `mocks/entities/courses.mock.ts` | Move |
| `features/forum/data/posts.ts` | `mocks/entities/posts.mock.ts` | Split (posts) |
| `features/forum/data/posts.ts` | `mocks/entities/comments.mock.ts` | Split (comments) |
| `features/space/data/companions.ts` | `mocks/entities/companions.mock.ts` | Move |
| `features/space/data/nunu-levels.ts` | `mocks/config/nunu-levels.mock.ts` | Move |
| `features/sprint/data/sprints.ts` | `mocks/entities/sprints.mock.ts` | Split (projects) |
| `features/sprint/data/sprints.ts` | `mocks/entities/seasons.mock.ts` | Split (seasons) |
| `features/shop/data/plans.ts` | `mocks/entities/plans.mock.ts` | Move |
| `features/shop/data/products.ts` | `mocks/entities/products.mock.ts` | Split (products) |
| `features/shop/data/products.ts` | `mocks/entities/events.mock.ts` | Split (events) |
| `features/shop/data/comparisons.ts` | `mocks/config/comparisons.mock.ts` | Move |
| `features/auth/types.ts` | `mocks/config/identities.mock.ts` | Extract data |
| `features/auth/permissions.ts` | `mocks/config/permissions.mock.ts` | Move |
| `features/learn/types.ts` | `mocks/config/levels.mock.ts` | Extract levels |
| `features/document/data/versions/*` | `mocks/content/playbook/*` | Move |
| `features/document/data/playbook-content.ts` | `mocks/content/playbook/index.ts` | Move |
| `data/user-data/progress.ts` | `mocks/user-state/progress.mock.ts` | Move |
| `data/user-data/favorites.ts` | `mocks/user-state/favorites.mock.ts` | Move |
| `data/entities/index.ts` | `mocks/index.ts` | Replace |
| `lib/db/seed/*.seed.ts` | DELETE | Replaced |
| `courses.ts` (YouTube pool) | `mocks/content/youtube-pool.ts` | Extract |
| `sprint/data/sprints.ts` (authors) | `mocks/entities/users.mock.ts` | Merge |
| Various (canonical users) | `mocks/entities/users.mock.ts` | Merge |

---

## Appendix B: Import Update Patterns

### Pattern 1: Direct Entity Import
```typescript
// BEFORE
import { MOCK_COURSES } from '@/features/learn/data/courses';
// AFTER
import { MOCK_COURSES } from '@/mocks';
```

### Pattern 2: Helper Function Import
```typescript
// BEFORE
import { getPostById, getCommentsByPostId } from '@/features/forum/data/posts';
// AFTER
import { getPostById, getCommentsByPostId } from '@/mocks';
```

### Pattern 3: Config Import
```typescript
// BEFORE
import { PERMISSION_MATRIX } from '@/features/auth/permissions';
// AFTER
import { PERMISSION_MATRIX } from '@/mocks';
```

### Pattern 4: Selective Import (for tree-shaking)
```typescript
// BEFORE
import { MOCK_COURSES, getCourseById } from '@/features/learn/data/courses';
// AFTER
import { MOCK_COURSES, getCourseById } from '@/mocks/entities/courses.mock';
```

---

**End of PRD**
