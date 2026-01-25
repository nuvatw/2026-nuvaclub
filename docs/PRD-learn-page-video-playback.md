# PRD: Learn Page – Complete Video Playback & Course Structure

**Version**: 2.0
**Date**: January 24, 2026
**Status**: Ready for Implementation
**Supersedes**: PRD-course-trailer-resume-playback.md (v1.0)

---

## 1. Executive Summary

### Overview
This PRD defines the complete video playback experience for the Learn page, including:
1. **Trailer-first playback** for all courses
2. **Course card hover behavior** with video previews
3. **Smart resume logic** for returning users
4. **Unified playback rules** across all entry points

### Goals
- Users always see a preview before committing to a course
- "Start Learning" always plays the trailer first (for new users)
- Returning users resume from where they left off
- Course content is structured cleanly for future expansion

### Current State vs. Target State

| Feature | Current State | Target State |
|---------|--------------|--------------|
| Hero Section "Start Learning" | ✅ Opens player immediately | ✅ No change needed |
| Course Card click | ✅ Uses `getResumePoint()` → VideoPlayer | ✅ Confirmed working |
| Course Card hover preview | ✅ Shows preview video | ✅ No change needed |
| **Hover "Start Learning"** | ✅ Opens VideoPlayer directly | ✅ **IMPLEMENTED** |
| Course Detail "Start Learning" | ✅ Uses `getResumePoint()` | ✅ Confirmed working |
| Trailer as first-class entity | ✅ Exists in data model | ✅ Confirmed |
| Resume logic | ✅ Implemented | ✅ Verified correct |

### Implementation Gap ✅ RESOLVED

**LearnHoverPreview.tsx** - Now opens VideoPlayer directly:
```typescript
// NEW behavior - opens VideoPlayer via context
const { openPlayer } = useLearnVideoPlayer();
const handleStartLearning = (course: Course) => {
  openPlayer(course);  // Uses getResumePoint() internally
};
```

**Solution Implemented**: Option A - Lifted VideoPlayer state to Learn page, created `LearnVideoPlayerContext`.

---

## 2. Data Model

### 2.1 Course Structure (Confirmed)

The course data model already supports the required structure:

```typescript
// src/features/learn/types.ts

interface Trailer {
  title: string;        // "Course Trailer"
  youtubeId: string;    // YouTube video ID
  duration: number;     // Duration in seconds
}

interface Lesson {
  id: string;
  title: string;
  duration: number;
  videoUrl: string;     // YouTube video ID
  order: number;
}

interface Chapter {
  id: string;
  title: string;
  lessons: Lesson[];
}

interface Course {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  thumbnailUrl: string;
  trailer: Trailer;           // ✅ First-class entity, NOT a lesson
  chapters: Chapter[];        // ✅ Structured content
  // ... other fields
}
```

### 2.2 Key Design Decisions

| Decision | Rationale |
|----------|-----------|
| Trailer is NOT a lesson | Trailers are promotional content, not curriculum. They don't count toward course completion. |
| Chapters contain lessons | Allows logical grouping of content (Chapter 1: Basics, Chapter 2: Advanced, etc.) |
| `trailer.youtubeId` not `videoUrl` | Clear distinction between trailer and lesson video references |
| Trailer tracked separately | `UserTrailerProgressRecord` vs `UserLessonProgressRecord` in schema |

### 2.3 Database Schema (Confirmed)

```typescript
// src/lib/db/schema/learn.schema.ts

// Trailer progress tracked separately from lessons
interface UserTrailerProgressRecord {
  id: string;
  userId: string;
  courseId: string;
  watchedSeconds: number;
  progressPercent: number;
  isCompleted: boolean;     // ≥90% = completed
  completedAt?: Date;
  lastWatchedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Lesson progress
interface UserLessonProgressRecord {
  id: string;
  userId: string;
  lessonId: string;
  enrollmentId: string;
  watchedSeconds: number;
  progressPercent: number;
  isCompleted: boolean;
  completedAt?: Date;
  lastWatchedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}
```

---

## 3. User Flows & Playback Rules

### 3.1 Entry Points

There are **5 distinct entry points** to video playback on the Learn page:

| # | Entry Point | Location | Expected Behavior |
|---|-------------|----------|-------------------|
| 1 | Hero "Start Learning" | Top of Learn page | Smart resume → VideoPlayer |
| 2 | Course card click | Card thumbnail | Smart resume → VideoPlayer |
| 3 | Hover video click | Hover preview panel | Smart resume → VideoPlayer |
| 4 | Hover "Start Learning" | Hover preview panel | Smart resume → VideoPlayer |
| 5 | Course detail "Start Learning" | `/learn/[courseId]` page | Smart resume → VideoPlayer |

### 3.2 Smart Resume Logic

All entry points use the same **Smart Resume Logic**:

```
┌─────────────────────────────────────────────────────────────┐
│                    getResumePoint(courseId)                  │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  1. No progress at all?                                      │
│     → Play TRAILER from 0:00                                 │
│                                                              │
│  2. Trailer in progress (< 90%)?                             │
│     → Resume TRAILER at (watchedSeconds - 5)                 │
│                                                              │
│  3. Trailer completed + lesson progress exists?              │
│     → Resume LESSON at (watchedSeconds - 5)                  │
│                                                              │
│  4. Trailer completed + no lesson progress?                  │
│     → Start LESSON 1 at 0:00                                 │
│                                                              │
│  5. Course fully completed?                                  │
│     → Play TRAILER from 0:00 (rewatch)                       │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### 3.3 Flow Diagram

```
User clicks any "Start Learning" entry point
                    │
                    ▼
            ┌───────────────┐
            │ getResumePoint│
            └───────┬───────┘
                    │
        ┌───────────┴───────────┐
        ▼                       ▼
   New User?              Returning User?
        │                       │
        ▼                       ▼
  Play Trailer          Check Progress Type
  from 0:00                     │
                    ┌───────────┴───────────┐
                    ▼                       ▼
            Trailer incomplete?      Lesson incomplete?
                    │                       │
                    ▼                       ▼
              Resume Trailer         Resume Lesson
              at last position       at last position
```

---

## 4. Component Behavior Specifications

### 4.1 Hero Section (`VideoHero.tsx`)

**Location**: Top of Learn page, shows featured course

**Current Behavior**: ✅ Already correct
- "Start Learning" button calls `getResumePoint()` and opens VideoPlayer
- Shows "Continue Learning" text with resume indicator if progress exists

**No changes needed.**

### 4.2 Course Card (`CourseCard.tsx`)

**Current Behavior**:
- Shows thumbnail with hover overlay
- Hover reveals play button
- Click opens VideoPlayer

**Required Verification**:
- [ ] Click handler uses `getResumePoint()` (not hardcoded lesson 0)
- [ ] VideoPlayer receives correct `initialLessonIndex` and `initialStartSeconds`

**Button Text States**:

| User State | Button Text | Icon |
|------------|-------------|------|
| Never watched | "Watch Trailer" | ▶️ |
| Trailer in progress | "Continue Trailer" | ▶️ |
| Has lesson progress | "Continue Learning" | ▶️ |
| Course completed | "Watch Again" | ↻ |

### 4.3 Hover Preview Panel (`LearnHoverPreview.tsx`)

**Current Behavior**:
- Shows lazy-loaded trailer video
- Has "Start Learning" button
- Has "Course Details" button

**Requirements**:

1. **Clicking directly on the hover preview video**:
   - Should open VideoPlayer
   - Should start playing immediately
   - Should use `getResumePoint()` logic

2. **Clicking "Start Learning" button**:
   - Should open VideoPlayer
   - Should start playing immediately
   - Should use `getResumePoint()` logic

3. **Video should NOT play inline** (current behavior is correct):
   - Preview video in hover panel is just a preview
   - Full playback transitions to VideoPlayer modal

### 4.4 Video Player (`VideoPlayer.tsx`)

**Props Interface**:
```typescript
interface VideoPlayerProps {
  course: Course;
  videoId: string;
  isOpen: boolean;
  onClose: () => void;
  initialLessonIndex?: number;      // -1 for trailer, 0+ for lessons
  initialStartSeconds?: number;     // Where to seek on load
  onProgressUpdate?: (lessonIndex: number, seconds: number) => void;
}
```

**Key Behaviors**:

1. **Auto-play on open**: When VideoPlayer opens, video should play automatically
2. **Seek to resume position**: If `initialStartSeconds > 0`, seek after player loads
3. **Save progress**: Every 5 seconds during playback, on pause, on close
4. **Episode drawer**: Shows trailer separately from lessons (trailer at top)

---

## 5. Mock Data Specifications

### 5.1 Current Mock Data Status

**File**: `src/features/learn/data/courses.ts`

| Metric | Value |
|--------|-------|
| Total courses | 60 |
| Free courses (Level 1) | 15 |
| Premium courses (Levels 2-10) | 45 |
| Chapters per course | 3 |
| Lessons per chapter | 5 |
| Total lessons per course | 15 |

### 5.2 Trailer Data Structure

Every course has a trailer:
```typescript
trailer: {
  title: 'Course Trailer',
  youtubeId: 'ad79nYk2keg',  // From YouTube video pool
  duration: 120              // 2 minutes
}
```

### 5.3 Chapter Data Structure

Each course has 3 chapters:
```typescript
chapters: [
  {
    id: 'c1-ch1',
    title: 'Chapter 1: AI Basics',
    lessons: [
      { id: 'c1-ch1-l1', title: 'What is AI?', duration: 720, videoUrl: '...', order: 1 },
      { id: 'c1-ch1-l2', title: 'History of AI', duration: 900, videoUrl: '...', order: 2 },
      // ... 5 lessons total
    ]
  },
  // ... 3 chapters total
]
```

### 5.4 YouTube Video Pool

48 unique educational YouTube video IDs are used for variety:
- 3Blue1Brown neural network series
- ChatGPT tutorials
- AI concept explainers
- Python/ML tutorials

---

## 6. Functional Requirements

### FR-1: Trailer Playback
- [x] FR-1.1: Every course MUST have a `trailer` field
- [x] FR-1.2: Trailer MUST have `title`, `youtubeId`, `duration`
- [x] FR-1.3: Trailer is NOT counted as a lesson
- [x] FR-1.4: Trailer progress tracked separately from lessons

### FR-2: Click Behavior
- [ ] FR-2.1: Clicking course thumbnail → Smart Resume logic
- [ ] FR-2.2: Clicking hover preview video → Smart Resume logic + auto-play
- [ ] FR-2.3: Clicking "Start Learning" → Smart Resume logic + auto-play
- [ ] FR-2.4: New users always see trailer first
- [ ] FR-2.5: VideoPlayer opens in fullscreen/modal mode (not inline)

### FR-3: Progress Tracking
- [x] FR-3.1: Trailer progress persisted to localStorage
- [x] FR-3.2: Lesson progress persisted to localStorage
- [x] FR-3.3: Progress saved every 5 seconds during playback
- [x] FR-3.4: Progress saved on player close
- [x] FR-3.5: Resume position within 5-second tolerance

### FR-4: Visual Indicators
- [ ] FR-4.1: Course card shows progress bar if user has progress
- [ ] FR-4.2: "Continue Learning" vs "Watch Trailer" button text
- [ ] FR-4.3: Episode drawer shows progress per item
- [ ] FR-4.4: Completed episodes show checkmark

---

## 7. Non-Functional Requirements

### NFR-1: Performance
- Resume point calculation < 50ms
- No perceptible delay when opening player
- Progress saves are non-blocking (async)

### NFR-2: Storage
- localStorage for demo (MockDB pattern)
- Maximum 500KB for all progress data
- Efficient storage format

### NFR-3: Reliability
- Graceful fallback if progress data corrupted
- Start from beginning if resume point invalid
- No crashes on missing data

---

## 8. Edge Cases

| Edge Case | Expected Behavior |
|-----------|-------------------|
| User clears browser data | Start fresh with trailer |
| Video deleted from YouTube | Show error, allow skip to next |
| Progress > video duration | Start from beginning |
| User switches identity | Progress tied to user ID |
| Rapid episode switching | Debounce progress saves |
| Offline playback | YouTube handles (not our concern) |
| Course has no chapters | Play trailer only, no lessons available |
| Trailer is 0 duration | Skip to first lesson |

---

## 9. Implementation Checklist

### Phase 1: Verification (Already Implemented) ✅
- [x] Trailer field exists on all courses
- [x] Chapter-based structure exists
- [x] `useVideoProgress` hook implemented
- [x] `getResumePoint()` function works
- [x] `UserTrailerProgressRecord` in schema
- [x] CourseCard uses `getResumePoint()` ✅ Verified
- [x] Course Detail page uses `getResumePoint()` ✅ Verified
- [x] Progress bars on course cards ✅ Verified

### Phase 2: Fix LearnHoverPreview ✅ COMPLETED
**Files Modified**:
- `src/features/learn/context/LearnVideoPlayerContext.tsx` (NEW)
- `src/app/(public)/learn/page.tsx` (MODIFIED)
- `src/features/learn/components/LearnHoverPreview.tsx` (MODIFIED)

**Changes Made**:
1. ✅ Created `LearnVideoPlayerContext` to share video player control
2. ✅ Added VideoPlayer state to Learn page (course, lessonIndex, startSeconds, isOpen)
3. ✅ Created `openPlayer(course)` callback that uses `getResumePoint()`
4. ✅ Wrapped Learn page content with context provider
5. ✅ Updated `LearnHoverPreview` to use `useLearnVideoPlayer()` hook
6. ✅ "Start Learning" in hover preview now opens VideoPlayer directly

**Before**: `router.push('/learn/${course.id}?play=1')` (navigated away)
**After**: `openPlayer(course)` (opens VideoPlayer with smart resume)

### Phase 3: Visual Polish (Nice to Have)
- [ ] Add progress bars to episode drawer
- [ ] Add checkmarks for completed items in episode drawer
- [ ] Add "Continue from X:XX" indicator on buttons
- [ ] Dynamic button text in hover preview ("Continue" vs "Start")

### Phase 4: Testing
- [ ] Test new user flow (trailer first)
- [ ] Test returning user flow (resume)
- [ ] Test all 5 entry points
- [ ] Test progress persistence across sessions
- [ ] Test edge cases

---

## 10. Acceptance Criteria

### Must Pass
- [ ] AC-1: New user clicks any "Start Learning" → trailer plays from 0:00
- [ ] AC-2: User with in-progress trailer → trailer resumes at saved position
- [ ] AC-3: User with completed trailer → last lesson resumes
- [ ] AC-4: VideoPlayer auto-plays when opened
- [ ] AC-5: Progress persists after browser refresh
- [ ] AC-6: All 5 entry points use same resume logic

### Nice to Have
- [ ] "Skip to lessons" option for returning users
- [ ] Progress sync across devices (requires backend)
- [ ] "Reset progress" option

---

## 11. State Machine

```
                                 ┌────────────────────────────────┐
                                 │                                │
                                 ▼                                │
┌───────────────────────────────────────────────────────────┐     │
│   NEW USER                                                 │     │
│   (No progress)                                            │     │
│                                                            │     │
│   Any "Start Learning" click → Play Trailer @ 0:00        │     │
└───────────────────────────────────────────────────────────┘     │
                                 │                                │
                                 ▼ (watches trailer)              │
┌───────────────────────────────────────────────────────────┐     │
│   TRAILER IN PROGRESS                                      │     │
│   (0% < progress < 90%)                                    │     │
│                                                            │     │
│   Any "Start Learning" click → Resume Trailer @ X:XX      │     │
└───────────────────────────────────────────────────────────┘     │
                                 │                                │
                                 ▼ (trailer ≥90%)                 │
┌───────────────────────────────────────────────────────────┐     │
│   TRAILER COMPLETED                                        │     │
│   (progress ≥ 90%)                                         │     │
│                                                            │     │
│   Any "Start Learning" click → Start Lesson 1 @ 0:00      │     │
└───────────────────────────────────────────────────────────┘     │
                                 │                                │
                                 ▼ (watches lessons)              │
┌───────────────────────────────────────────────────────────┐     │
│   LESSONS IN PROGRESS                                      │     │
│   (has lesson progress)                                    │     │
│                                                            │     │
│   Any "Start Learning" click → Resume Last Lesson @ X:XX  │     │
└───────────────────────────────────────────────────────────┘     │
                                 │                                │
                                 ▼ (all lessons 100%)             │
┌───────────────────────────────────────────────────────────┐     │
│   COURSE COMPLETED                                         │────┘
│   (all lessons done)                                       │ (rewatch)
│                                                            │
│   Any "Start Learning" click → Play Trailer @ 0:00        │
└───────────────────────────────────────────────────────────┘
```

---

## 12. Component Hierarchy

```
Learn Page (/learn)
├── VideoHero
│   └── "Start Learning" → getResumePoint() → VideoPlayer
├── HoverPreviewProvider
│   └── LearnHoverPreview
│       ├── Preview Video (click → getResumePoint() → VideoPlayer)
│       └── "Start Learning" (click → getResumePoint() → VideoPlayer)
├── CourseRow[]
│   └── CourseCard[]
│       └── onClick → getResumePoint() → VideoPlayer
│
Course Detail Page (/learn/[courseId])
├── Hero Section
│   └── "Start Learning" → getResumePoint() → VideoPlayer
├── Curriculum List
│   └── Lesson Item
│       └── onClick → specific lesson → VideoPlayer
└── Sidebar CTA
    └── "Continue" / "Start" → getResumePoint() → VideoPlayer

VideoPlayer (shared modal component)
├── YouTube IFrame
├── Custom Controls
├── Episode Drawer
│   ├── Trailer (index: -1)
│   └── Lessons by Chapter
└── Progress Auto-Save (5s interval)
```

---

## 13. Files Reference

### Data Model Files
| File | Purpose |
|------|---------|
| `src/features/learn/types.ts` | Course, Trailer, Chapter, Lesson interfaces |
| `src/lib/db/schema/learn.schema.ts` | Database schema with UserTrailerProgressRecord |
| `src/features/learn/data/courses.ts` | Mock course data (60 courses) |

### Component Files
| File | Purpose |
|------|---------|
| `src/app/(public)/learn/page.tsx` | Main Learn page |
| `src/app/(public)/learn/[courseId]/page.tsx` | Course detail page |
| `src/features/learn/components/VideoHero.tsx` | Hero section with featured course |
| `src/features/learn/components/CourseCard.tsx` | Course thumbnail card |
| `src/features/learn/components/LearnHoverPreview.tsx` | Hover preview panel |
| `src/features/learn/components/VideoPlayer.tsx` | Full video player modal |

### Progress Tracking
| File | Purpose |
|------|---------|
| `src/lib/db/hooks/useVideoProgress.ts` | Progress CRUD hook with getResumePoint() |

---

## 14. Summary

The Learn page video playback system follows these core principles:

1. **Trailer First**: New users always see the course trailer before any lessons
2. **Smart Resume**: Returning users pick up exactly where they left off
3. **Consistent Entry Points**: All "Start Learning" buttons use the same logic
4. **Progress Persistence**: Watch history is saved and survives browser refresh
5. **Clean Separation**: Trailer is a first-class entity, not mixed with lessons

The existing implementation already supports most of this functionality. The main work remaining is **verification** that all entry points correctly use `getResumePoint()` and **visual polish** for progress indicators.

---

**Document Status**: Ready for Implementation
**Next Action**: Verify all entry points use getResumePoint() correctly
