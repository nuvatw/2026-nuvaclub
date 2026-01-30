# Architectural Boundary Integrity Score Report
**Date:** 2026-01-30
**Score:** 80/100
**Status:** Transitional (Threshold: 85)

## Summary
The codebase demonstrates a strong Core Domain and Repository architecture (20/20 both). However, the **Admin UI** (`src/app/admin`) heavily violates boundary rules by bypassing the BFF and accessing the DB directly. Additionally, a dependency direction violation exists where the Application layer imports types from the Feature layer.

---

## Overall Summary

| Category | Score | Max | Status |
|---|---|---|---|
| A. Frontend Boundary Isolation | 10 | 20 | ⚠️ Warning |
| B. Domain Purity | 20 | 20 | ✅ Healthy |
| C. BFF Boundary Strength | 15 | 20 | ⚠️ Warning |
| D. Repository Isolation | 20 | 20 | ✅ Healthy |
| E. Directional Integrity | 15 | 20 | ⚠️ Warning |
| **TOTAL** | **80** | **100** | ⚠️ Transitional |

---

## Scoring Breakdown

### A. Frontend Boundary Isolation (10/20 pts)

| ID | Check | Score | Max | Details | Status |
|---|---|---|---|---|---|
| A1 | No domain imports in UI | 5 | 5 | 0 matches detected in `features/` | ✅ Clean |
| A2 | No infra/persistence imports in UI | 0 | 5 | **Failed**: `AdminForumPostsPage` uses `useDBContext` | ❌ Critical |
| A3 | UI does not compute business state | 0 | 5 | **Failed**: Admin UI computes filtered lists locally | ❌ Failed |
| A4 | Access control not client-only | 5 | 5 | BFF middleware handles auth | ✅ Clean |

> [!CRITICAL]
> **Violation**: `/src/app/admin/forum-posts/page.tsx`
> Imports `useDBContext` and accesses `db.forumPosts` directly. This bypasses the BFF and couples the UI to the specific DB implementation.

---

### B. Domain Purity (20/20 pts)

| ID | Check | Score | Max | Details | Status |
|---|---|---|---|---|---|
| B1 | No framework imports in domain | 5 | 5 | No React/Next.js imports | ✅ Clean |
| B2 | No browser API usage in domain | 5 | 5 | No window/document usage | ✅ Clean |
| B3 | No DB client import in domain | 5 | 5 | No infra imports | ✅ Clean |
| B4 | Domain executable in pure Node | 5 | 5 | Pure TypeScript logic | ✅ Clean |

---

### C. BFF Boundary Strength (15/20 pts)

| ID | Check | Score | Max | Details | Status |
|---|---|---|---|---|---|
| C1 | All UI data flows through BFF | 0 | 5 | **Failed**: Admin UI hits DB directly | ❌ Failed |
| C2 | BFF contains no heavy business logic | 5 | 5 | Service composition handled correctly | ✅ Clean |
| C3 | DTO completeness | 5 | 5 | DTOs are rich and typed | ✅ Clean |
| C4 | Auth & gating enforced server-side | 5 | 5 | Gate Engine in use | ✅ Clean |

---

### D. Repository Isolation (20/20 pts)

| ID | Check | Score | Max | Details | Status |
|---|---|---|---|---|---|
| D1 | Repository interfaces defined outside infra | 5 | 5 | `src/application/ports` | ✅ Clean |
| D2 | Infra implements repositories only | 5 | 5 | `src/infra/mock/repositories` | ✅ Clean |
| D3 | Application does not import DB client directly | 5 | 5 | Services use Ports (Audit confirmed) | ✅ Clean |
| D4 | Infra replaceable without UI change | 5 | 5 | Dependency Injection via Composition Root | ✅ Clean |

> [!NOTE]
> Previous report flagged D3 as a warning, but current audit confirms `MemberService` and others rely solely on `IUserRepository` etc., injected via constructor. `MockDB` is only imported in `composition.ts` (Root), which is correct.

---

### E. Directional Integrity (15/20 pts)

| ID | Check | Score | Max | Details | Status |
|---|---|---|---|---|---|
| E1 | Dependency direction correct | 0 | 5 | **Failed**: App imports Feature types | ❌ Failed |
| E2 | One module fully compliant end-to-end | 5 | 5 | Sprint/Member modules are clean | ✅ Clean |
| E3 | No circular dependencies | 5 | 5 | None detected | ✅ Clean |
| E4 | Architecture enforceable via tooling | 5 | 5 | Linting available | ✅ Clean |

> [!WARNING]
> **Violation**: `src/application/services/ForumService.ts`
> Imports `CreatePostInput` from `@/features/forum/types`.
> **Fix**: Move shared types to `@/application/dtos` or `@/domain`.

---

## Remediation Plan (To Reach 85+)

1.  **Refactor Admin UI (Score +10)**
    *   Create BFF endpoints for Forum Administration (`DELETE /api/admin/forum-posts`, etc).
    *   Remove `useDBContext` from `src/app/admin/forum-posts/page.tsx`.
    *   Fetch data via standard `fetch` or internal API client properly.

2.  **Fix ForumService Dependency (Score +5)**
    *   Move `CreatePostInput` to `src/application/dtos/forum.dto.ts`.
    *   Update `ForumService` and `src/features/forum` to import from the new location.

**Target Score:** 95/100
