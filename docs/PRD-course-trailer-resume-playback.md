# PRD: Course Trailer & Resume Playback System

**Version**: 1.0
**Date**: January 23, 2026
**Status**: Ready for Implementation

---

## 1. Executive Summary

### Overview
Enhance the learning experience by ensuring every course has a trailer that plays when users click the video thumbnail or "Start Learning" button. If a user has previously watched content, the system should automatically resume from where they left off.

### Key Features
1. **Trailer Playback**: Every course plays its trailer on first interaction (thumbnail click or "Start Learning")
2. **Resume Playback**: If the user has watch history, resume from their last watched position
3. **Progress Persistence**: Track and persist video playback position per lesson and trailer
4. **Smart Entry Point**: Determine whether to show trailer or resume based on user's watch history

### Current State Analysis
| Component | Status | Notes |
|-----------|--------|-------|
| `Course.trailer` field | ✅ Exists | All 60 courses have `trailer: { title, youtubeId, duration }` |
| `VideoPlayer` trailer support | ✅ Exists | Uses `index=-1` for trailer, episode drawer shows it |
| `UserLessonProgressRecord` | ✅ Schema exists | Has `watchedSeconds`, `progressPercent`, `lastWatchedAt` |
| `UserCourseEnrollmentRecord` | ✅ Schema exists | Has `currentLessonId`, `lastAccessedAt` |
| Progress persistence in VideoPlayer | ❌ Missing | Player doesn't save/restore position |
| Trailer progress tracking | ❌ Missing | No `trailerWatchedSeconds` field |
| Resume logic on start | ❌ Missing | Always starts fresh |

---

## 2. User Stories

### US-1: First-Time Learner
> As a new user clicking on a course, I want to see the course trailer first so I can preview what I'll learn before committing.

**Acceptance Criteria:**
- Clicking course thumbnail opens VideoPlayer with trailer
- Clicking "Start Learning" opens VideoPlayer with trailer
- Trailer is clearly labeled in the episode drawer

### US-2: Returning Learner
> As a returning user who has watched part of a course, I want to resume from where I left off so I don't lose my place.

**Acceptance Criteria:**
- System remembers last watched position per lesson
- "Continue Learning" button appears for in-progress courses
- Player seeks to last position automatically
- Works for both lessons and trailers

### US-3: Completed Trailer
> As a user who has already watched the trailer, I want to go directly to my lesson progress when I click "Start Learning".

**Acceptance Criteria:**
- If trailer is completed (>90% watched), skip to first lesson or last-watched lesson
- Visual indicator showing trailer is completed
- Option to re-watch trailer from episode drawer

---

## 3. Technical Design

### 3.1 Data Model Updates

#### A. Add Trailer Progress to Schema

**File**: `src/lib/db/schema/learn.schema.ts`

```typescript
// ==========================================
// USER TRAILER PROGRESS TABLE
// Tracks trailer watch progress separately
// ==========================================
export interface UserTrailerProgressRecord {
  // Primary Key
  id: string;

  // Foreign Keys
  userId: string;          // FK -> users.id
  courseId: string;        // FK -> courses.id

  // Progress Tracking
  watchedSeconds: number;  // How far they've watched
  progressPercent: number; // 0-100

  // Completion
  isCompleted: boolean;    // >90% watched
  completedAt?: Date;

  // Timestamps
  lastWatchedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Unique Index: (userId, courseId)
```

#### B. Update Course Types (Already Complete)

**File**: `src/features/learn/types.ts` - No changes needed, `Trailer` interface exists:

```typescript
export interface Trailer {
  title: string;
  youtubeId: string;
  duration: number;
}

export interface Course {
  // ... existing fields
  trailer: Trailer;  // ✅ Already required
}
```

### 3.2 New Hooks

#### A. useVideoProgress Hook

**File**: `src/lib/db/hooks/useVideoProgress.ts`

```typescript
interface UseVideoProgressReturn {
  // Lesson progress
  getLessonProgress: (courseId: string, lessonId: string) => LessonProgress | null;
  saveLessonProgress: (courseId: string, lessonId: string, seconds: number, duration: number) => void;

  // Trailer progress
  getTrailerProgress: (courseId: string) => TrailerProgress | null;
  saveTrailerProgress: (courseId: string, seconds: number, duration: number) => void;

  // Resume helpers
  getResumePoint: (courseId: string) => ResumePoint;
  isTrailerCompleted: (courseId: string) => boolean;
}

interface ResumePoint {
  type: 'trailer' | 'lesson';
  lessonIndex: number;      // -1 for trailer, 0+ for lessons
  startSeconds: number;     // Where to seek to
  hasAnyProgress: boolean;  // True if user has watched anything
}
```

### 3.3 VideoPlayer Updates

#### A. Accept Resume Point Props

```typescript
interface VideoPlayerProps {
  course: Course;
  videoId: string;
  isOpen: boolean;
  onClose: () => void;
  initialLessonIndex?: number;
  initialStartSeconds?: number;  // NEW: Where to seek on load
  onProgressUpdate?: (lessonIndex: number, seconds: number) => void;  // NEW
}
```

#### B. Progress Tracking Logic

```typescript
// In VideoPlayer.tsx

// Track progress periodically (every 5 seconds)
useEffect(() => {
  if (!player || !isPlaying) return;

  const interval = setInterval(() => {
    const currentSeconds = player.getCurrentTime();
    const totalDuration = player.getDuration();

    if (onProgressUpdate) {
      onProgressUpdate(currentLessonIndex, currentSeconds);
    }
  }, 5000);

  return () => clearInterval(interval);
}, [player, isPlaying, currentLessonIndex, onProgressUpdate]);

// Seek to initial position on video load
useEffect(() => {
  if (player && initialStartSeconds && initialStartSeconds > 0) {
    player.seekTo(initialStartSeconds, true);
  }
}, [player, initialStartSeconds]);
```

### 3.4 Smart Entry Point Logic

#### When User Clicks Thumbnail/Start Learning:

```typescript
function getSmartEntryPoint(course: Course, progress: UserProgress): EntryPoint {
  const trailerProgress = getTrailerProgress(course.id);
  const lessonProgress = getLastLessonProgress(course.id);

  // Case 1: Never watched anything -> Start with trailer
  if (!trailerProgress && !lessonProgress) {
    return {
      type: 'trailer',
      lessonIndex: -1,
      startSeconds: 0
    };
  }

  // Case 2: Trailer in progress -> Resume trailer
  if (trailerProgress && !trailerProgress.isCompleted) {
    return {
      type: 'trailer',
      lessonIndex: -1,
      startSeconds: trailerProgress.watchedSeconds
    };
  }

  // Case 3: Trailer completed, has lesson progress -> Resume lesson
  if (lessonProgress) {
    return {
      type: 'lesson',
      lessonIndex: lessonProgress.lessonIndex,
      startSeconds: lessonProgress.watchedSeconds
    };
  }

  // Case 4: Trailer completed, no lesson progress -> Start lesson 1
  return {
    type: 'lesson',
    lessonIndex: 0,
    startSeconds: 0
  };
}
```

---

## 4. UI/UX Updates

### 4.1 Course Card Changes

**File**: `src/features/learn/components/CourseCard.tsx`

| State | Button Text | Icon | Behavior |
|-------|-------------|------|----------|
| Never watched | "Watch Trailer" | ▶️ | Opens trailer |
| Trailer in progress | "Continue Trailer" | ▶️ | Resumes trailer |
| Has lesson progress | "Continue Learning" | ▶️ | Resumes last lesson |
| Course completed | "Watch Again" | ↻ | Opens trailer |

### 4.2 Course Detail Page Changes

**File**: `src/app/(public)/learn/[courseId]/page.tsx`

- Show progress bar under each lesson
- "Continue" badge on last-watched lesson
- "Completed" badge on finished lessons
- Sidebar CTA button reflects progress state

### 4.3 Episode Drawer Enhancement

**File**: `src/features/learn/components/VideoPlayer.tsx` (EpisodeDrawer)

- Show progress bar under each episode
- Checkmark icon for completed episodes
- "In Progress" indicator for partially watched

---

## 5. Implementation Plan

### Phase 1: Schema & Data Layer (Day 1)
| Task | File | Description |
|------|------|-------------|
| 1.1 | `learn.schema.ts` | Add `UserTrailerProgressRecord` interface |
| 1.2 | `learn.seed.ts` | Add mock trailer progress data |
| 1.3 | `useVideoProgress.ts` | Create new hook for progress CRUD |
| 1.4 | `index.ts` | Export new hook |

### Phase 2: VideoPlayer Integration (Day 2)
| Task | File | Description |
|------|------|-------------|
| 2.1 | `VideoPlayer.tsx` | Add `initialStartSeconds` prop |
| 2.2 | `VideoPlayer.tsx` | Add `onProgressUpdate` callback |
| 2.3 | `VideoPlayer.tsx` | Implement auto-save progress (every 5s) |
| 2.4 | `VideoPlayer.tsx` | Seek to initial position on load |
| 2.5 | `VideoPlayer.tsx` | Save progress on close/episode change |

### Phase 3: Smart Entry Point (Day 3)
| Task | File | Description |
|------|------|-------------|
| 3.1 | `CourseCard.tsx` | Use `getResumePoint()` for click handler |
| 3.2 | `CourseCard.tsx` | Update button text based on progress |
| 3.3 | `[courseId]/page.tsx` | Use `getResumePoint()` for "Start Learning" |
| 3.4 | `VideoHero.tsx` | Apply same resume logic |

### Phase 4: Progress Visualization (Day 4)
| Task | File | Description |
|------|------|-------------|
| 4.1 | `EpisodeDrawer` | Add progress bars per episode |
| 4.2 | `EpisodeDrawer` | Add completed checkmarks |
| 4.3 | `[courseId]/page.tsx` | Add progress bars to curriculum |
| 4.4 | `CourseCard.tsx` | Add progress indicator on thumbnail |

### Phase 5: Testing & Polish (Day 5)
| Task | Description |
|------|-------------|
| 5.1 | Test all entry points (card click, detail page, hero) |
| 5.2 | Test resume accuracy (within 5-second tolerance) |
| 5.3 | Test cross-lesson navigation preserves progress |
| 5.4 | Test localStorage persistence across sessions |
| 5.5 | Edge cases: completed courses, deleted progress |

---

## 6. Detailed File Changes

### 6.1 New Files

| File | Purpose |
|------|---------|
| `src/lib/db/hooks/useVideoProgress.ts` | Progress CRUD hook |
| `src/lib/db/seed/video-progress.seed.ts` | Mock progress data |

### 6.2 Modified Files

| File | Changes |
|------|---------|
| `src/lib/db/schema/learn.schema.ts` | Add `UserTrailerProgressRecord` |
| `src/features/learn/components/VideoPlayer.tsx` | Add resume props, progress saving |
| `src/features/learn/components/CourseCard.tsx` | Smart entry point, progress-aware text |
| `src/app/(public)/learn/[courseId]/page.tsx` | Resume logic, progress visualization |
| `src/features/learn/components/VideoHero.tsx` | Apply resume logic |
| `src/lib/db/hooks/index.ts` | Export `useVideoProgress` |

---

## 7. Functional Requirements

### FR-1: Trailer Column
- [x] Every course MUST have a `trailer` field (already exists)
- [x] Trailer MUST have `title`, `youtubeId`, `duration` (already exists)
- [ ] Trailer progress MUST be tracked separately from lessons

### FR-2: Click Behavior
- [ ] Clicking course thumbnail MUST play trailer for new users
- [ ] Clicking course thumbnail MUST resume from last position for returning users
- [ ] Clicking "Start Learning" MUST follow same smart entry logic
- [ ] Clicking specific lesson MUST start that lesson (not trailer)

### FR-3: Progress Persistence
- [ ] Progress MUST persist across browser sessions (localStorage)
- [ ] Progress MUST be saved every 5 seconds during playback
- [ ] Progress MUST be saved on player close
- [ ] Progress MUST be saved on episode/lesson change

### FR-4: Resume Accuracy
- [ ] Resume position MUST be within 5 seconds of actual last position
- [ ] Resume MUST work for both trailer and lessons
- [ ] User MUST see immediate seek to resume position on player open

---

## 8. Non-Functional Requirements

### NFR-1: Performance
- Progress saves should be non-blocking (async)
- Initial resume point calculation < 50ms
- No perceptible delay when opening player

### NFR-2: Storage
- Use localStorage for demo (MockDB pattern)
- Efficient storage format (no duplicate data)
- Maximum 500KB for all progress data

### NFR-3: Reliability
- Graceful fallback if progress data is corrupted
- Start from beginning if resume point invalid
- No crashes on missing data

---

## 9. Edge Cases

| Edge Case | Expected Behavior |
|-----------|-------------------|
| User clears browser data | Start fresh with trailer |
| Video is deleted from YouTube | Show error, allow skip to next |
| Progress > video duration | Start from beginning |
| User switches identity (mock) | Progress tied to user ID |
| Offline playback attempt | YouTube handles (not our concern) |
| Rapid episode switching | Debounce progress saves |

---

## 10. Success Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| Resume accuracy | ±5 seconds | Manual testing |
| Trailer plays on first click | 100% of new users | Console logs |
| Progress persists across sessions | 100% | Manual testing |
| No data loss on close | 100% | Manual testing |

---

## 11. Acceptance Criteria Checklist

### Must Pass
- [ ] AC-1: New user clicks course card → trailer plays from beginning
- [ ] AC-2: User with in-progress trailer clicks card → trailer resumes
- [ ] AC-3: User with completed trailer clicks card → last lesson resumes
- [ ] AC-4: Progress bar shows in episode drawer for each item
- [ ] AC-5: Closing player saves current position
- [ ] AC-6: Reopening player resumes from saved position
- [ ] AC-7: Progress persists after browser refresh

### Nice to Have
- [ ] "Continue from trailer" vs "Skip to lessons" choice
- [ ] Progress sync across devices (requires backend)
- [ ] "Reset progress" option

---

## 12. Risk Assessment

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| localStorage quota exceeded | Low | Medium | Implement cleanup for old data |
| YouTube API timing issues | Medium | Low | Add retry logic for seek |
| Progress data corruption | Low | High | Validate on read, fallback to start |
| Performance on many courses | Low | Low | Lazy load progress data |

---

## Appendix A: Mock Data Example

```typescript
// Example trailer progress
{
  id: 'trailer-prog-1',
  userId: 'user-1',
  courseId: 'c1',
  watchedSeconds: 45,
  progressPercent: 37.5,
  isCompleted: false,
  lastWatchedAt: new Date('2026-01-23T10:30:00'),
  createdAt: new Date('2026-01-23T10:25:00'),
  updatedAt: new Date('2026-01-23T10:30:00'),
}

// Example lesson progress
{
  id: 'lesson-prog-1',
  userId: 'user-1',
  lessonId: 'c1-ch1-l3',
  enrollmentId: 'enroll-1',
  watchedSeconds: 420,
  progressPercent: 58.3,
  isCompleted: false,
  lastWatchedAt: new Date('2026-01-23T11:00:00'),
  createdAt: new Date('2026-01-22T14:00:00'),
  updatedAt: new Date('2026-01-23T11:00:00'),
}
```

---

## Appendix B: State Machine

```
                    ┌─────────────────────────────────────┐
                    │                                     │
                    ▼                                     │
┌──────────────────────────────────┐                     │
│   NEW USER                        │                     │
│   (No progress)                   │                     │
│                                   │                     │
│   Click → Play Trailer @ 0:00    │                     │
└──────────────────────────────────┘                     │
                    │                                     │
                    ▼ (watches trailer)                   │
┌──────────────────────────────────┐                     │
│   TRAILER IN PROGRESS             │                     │
│   (0% < progress < 90%)           │                     │
│                                   │                     │
│   Click → Resume Trailer @ X:XX  │                     │
└──────────────────────────────────┘                     │
                    │                                     │
                    ▼ (trailer >90%)                      │
┌──────────────────────────────────┐                     │
│   TRAILER COMPLETED               │                     │
│   (progress ≥ 90%)                │                     │
│                                   │                     │
│   Click → Start Lesson 1 @ 0:00  │                     │
└──────────────────────────────────┘                     │
                    │                                     │
                    ▼ (watches lessons)                   │
┌──────────────────────────────────┐                     │
│   LESSONS IN PROGRESS             │                     │
│   (has lesson progress)           │                     │
│                                   │                     │
│   Click → Resume Last Lesson     │                     │
└──────────────────────────────────┘                     │
                    │                                     │
                    ▼ (all lessons 100%)                  │
┌──────────────────────────────────┐                     │
│   COURSE COMPLETED                │─────────────────────┘
│   (all lessons done)              │   (user can rewatch)
│                                   │
│   Click → Play Trailer @ 0:00    │
└──────────────────────────────────┘
```

---

## Appendix C: Component Hierarchy

```
Learn Page
├── VideoHero
│   └── "Start Learning" → getResumePoint() → VideoPlayer
├── CourseRow
│   └── CourseCard
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

VideoPlayer (shared component)
├── Props: initialLessonIndex, initialStartSeconds, onProgressUpdate
├── Episode Drawer
│   ├── Trailer (with progress bar)
│   └── Lessons (with progress bars)
└── Progress Auto-Save (5s interval)
```

---

**Document Status**: Ready for Implementation
**Next Action**: Begin Phase 1 - Schema & Data Layer
