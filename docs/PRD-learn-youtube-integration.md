# PRD: Learn Page YouTube Video Integration

**Version**: 1.0
**Date**: January 23, 2026
**Status**: Draft

---

## 1. Feature Scope

### Overview
Enhance the `/learn` page to connect mock courses with real YouTube videos, enabling a fully functional demo experience where users can:
- Watch course trailers
- Start learning from Chapter 1/Lesson 1
- Navigate between lessons with distinct video content per lesson

### In Scope
- Chapter-based curriculum structure (3 chapters × 5 lessons per course)
- Unique YouTube video per lesson for demo realism
- Trailer video per course
- Dynamic video source switching when navigating lessons
- Course cards trigger correct video playback
- Episode/lesson switcher updates video in real-time

### Out of Scope
- Backend/database integration (hardcoded data only)
- Video progress persistence across sessions
- User authentication for access control (use existing mock)
- Custom video hosting (YouTube only)

---

## 2. User Flow

### Primary Flow: Start Learning
```
User on /learn page
  → Hovers on course card (sees trailer preview)
  → Clicks "Start Learning"
  → Video player opens fullscreen
  → Plays Chapter 1, Lesson 1
  → User opens episode drawer
  → Selects different lesson
  → Video switches to selected lesson's YouTube video
  → User continues or closes player
```

### Secondary Flow: Watch Trailer
```
User on /learn page
  → Clicks trailer thumbnail OR "Watch Trailer" button
  → Video player opens with trailer video
  → User can then proceed to lessons or close
```

### Tertiary Flow: Course Details Page
```
User clicks "Course Details" on course card
  → Navigates to /learn/[courseId]
  → Sees full curriculum (chapters + lessons)
  → Clicks any lesson
  → Video player opens with that lesson
  → Episode drawer shows all lessons with current highlighted
```

---

## 3. Data Model Proposal

### Updated Type Definitions

```typescript
// Lesson within a chapter
interface Lesson {
  id: string;
  title: string;
  duration: number;        // seconds
  youtubeId: string;       // YouTube video ID (11 chars)
  order: number;
}

// Chapter grouping lessons
interface Chapter {
  id: string;
  title: string;
  lessons: Lesson[];       // exactly 5 lessons
}

// Trailer video
interface Trailer {
  title: string;
  youtubeId: string;
  duration: number;
}

// Full course structure
interface Course {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  thumbnailUrl: string;
  category: string;
  tags: string[];
  level: CourseLevel;
  instructor: {
    name: string;
    avatar: string;
  };
  trailer: Trailer;
  chapters: Chapter[];     // min 3 chapters
  totalDuration: number;
  lessonCount: number;     // computed: chapters × lessons
  isFeatured: boolean;
  createdAt: Date;
}
```

### Backward Compatibility
The existing `lessons: Lesson[]` flat array will be replaced by `chapters: Chapter[]`. A helper function will flatten chapters for components that need a simple lesson list:

```typescript
function getAllLessons(course: Course): Lesson[] {
  return course.chapters.flatMap(chapter => chapter.lessons);
}
```

---

## 4. Functional Requirements

### FR-1: Course Data Structure
- [ ] Each course MUST have exactly 1 trailer with a valid YouTube ID
- [ ] Each course MUST have at least 3 chapters
- [ ] Each chapter MUST have exactly 5 lessons
- [ ] Each lesson MUST have a unique `youtubeId` (different from other lessons in same course)

### FR-2: Course Card Behavior
- [ ] Clicking "Start Learning" opens VideoPlayer at Chapter 1, Lesson 1
- [ ] Clicking trailer thumbnail opens VideoPlayer with trailer video
- [ ] Clicking "Watch Trailer" button opens VideoPlayer with trailer video
- [ ] Clicking "Course Details" navigates to `/learn/[courseId]`

### FR-3: Video Player Behavior
- [ ] Player loads correct video based on selected lesson
- [ ] Episode drawer shows all chapters and lessons
- [ ] Selecting a lesson immediately loads that lesson's YouTube video
- [ ] Current lesson is visually highlighted in episode drawer
- [ ] Video source changes when switching lessons (verified by different content)

### FR-4: Course Details Page
- [ ] Shows curriculum organized by chapters
- [ ] Each lesson is clickable
- [ ] Clicking a lesson opens VideoPlayer with that lesson
- [ ] "Start Learning" button starts at Chapter 1, Lesson 1

### FR-5: State Persistence
- [ ] Selected course/lesson persists while navigating within player
- [ ] Closing and reopening player on same course resumes from last position (optional enhancement)

---

## 5. Non-Functional Requirements

### NFR-1: Performance
- YouTube IFrame API should load only when player opens
- Lesson switching should feel instant (< 500ms perceived)

### NFR-2: Demo Quality
- All YouTube videos must be public and embeddable
- Videos should be tech/AI related for thematic consistency
- Different videos per lesson to demonstrate real switching

### NFR-3: Code Quality
- Type-safe data structures
- Helper functions for common operations
- Clear separation of data and presentation

---

## 6. Dependencies & Gaps in Current Codebase

### Existing Infrastructure ✅
| Component | Status | Notes |
|-----------|--------|-------|
| VideoPlayer.tsx | Ready | Full YouTube IFrame API support |
| YouTube ID extraction | Ready | Handles URLs and raw IDs |
| Episode drawer UI | Ready | Shows lessons, handles selection |
| Course types | Partial | Need chapter structure |
| Course data | Partial | Need restructuring + unique videos |

### Gaps to Address ❌
| Gap | Resolution |
|-----|------------|
| Flat lessons array (no chapters) | Add Chapter type, restructure data |
| Same YouTube ID across many lessons | Collect 10+ unique YouTube IDs for demo |
| CourseCard doesn't pass lesson index | Add `startAtLesson` prop |
| Course detail page doesn't open player | Add VideoPlayer + click handlers |
| Trailer button wiring inconsistent | Standardize trailer playback logic |

---

## 7. Implementation Plan

### Phase 1: Data Model Update
1. Update `types.ts` with Chapter interface
2. Add trailer as required field (not optional)
3. Add helper functions: `getAllLessons()`, `getLessonByIndex()`

### Phase 2: Course Data Restructuring
1. Research and collect 10 unique YouTube video IDs (AI/tech content)
2. Update `courses.ts` to use chapter-based structure
3. Ensure each demo course has:
   - 1 trailer
   - 3 chapters
   - 5 lessons per chapter (15 total)
   - Unique YouTube IDs per lesson

### Phase 3: Component Updates
1. **CourseCard.tsx**:
   - Add `onStartLearning` callback with course + lesson info
   - Wire trailer button to open player with trailer

2. **VideoPlayer.tsx**:
   - Accept `initialLessonIndex` prop
   - Support chapter-grouped episode drawer
   - Handle trailer as special "Lesson 0" or separate mode

3. **VideoHero.tsx**:
   - Wire "Start Learning" to open player at correct lesson
   - Ensure trailer button works

### Phase 4: Course Detail Page Enhancement
1. Add VideoPlayer component to page
2. Add `selectedLesson` state
3. Make lesson list items clickable
4. Open player on lesson click with correct video

### Phase 5: Testing & Polish
1. Verify all acceptance criteria
2. Test lesson-to-lesson switching
3. Test trailer playback from multiple entry points
4. Ensure no placeholder videos remain

---

## 8. YouTube Videos for Demo

### Required: 10 Unique Public YouTube Videos (AI/Tech Topics)

| # | Video ID | Topic |
|---|----------|-------|
| 1 | ad79nYk2keg | AI Introduction |
| 2 | JTxsNm9IdYU | Machine Learning |
| 3 | 0kARDVL2nZg | ChatGPT Tutorial |
| 4 | aircAruvnKk | Neural Networks (3Blue1Brown) |
| 5 | IHZwWFHWa-w | Gradient Descent (3Blue1Brown) |
| 6 | VMj-3S1tku0 | Deep Learning (Lex Fridman) |
| 7 | WXuK6gekU1Y | Python for AI |
| 8 | rfscVS0vtbw | Python Full Course |
| 9 | GwIo3gDZCVQ | OpenAI API Tutorial |
| 10 | kCc8FmEb1nY | GPT from Scratch (Karpathy) |

*Note: These are well-known, public, embeddable AI/tech videos.*

---

## 9. Acceptance Criteria

### Must Pass ✅
- [ ] **AC-1**: Every course card plays a different YouTube video when selected
- [ ] **AC-2**: Every course has 3 chapters, each with 5 lessons (15 total)
- [ ] **AC-3**: Every course has a trailer video with valid YouTube ID
- [ ] **AC-4**: Clicking trailer thumbnail OR "Watch Trailer" plays trailer in player
- [ ] **AC-5**: Switching lessons in episode drawer updates video immediately
- [ ] **AC-6**: Course/lesson selection persists while navigating in player view

### Nice to Have
- [ ] Deep-linking to specific lesson via URL query params
- [ ] Progress bar per lesson in episode drawer
- [ ] "Next lesson" auto-advance when video ends

---

## 10. Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| YouTube video becomes private/deleted | Broken demo | Use well-known educational channels |
| YouTube embedding blocked in some regions | Limited demo | Document as demo limitation |
| Large data restructure breaks existing features | Regression | Test thoroughly, maintain type safety |

---

## Appendix A: File Changes Required

| File | Change Type | Description |
|------|-------------|-------------|
| `src/features/learn/types.ts` | Modify | Add Chapter, update Course |
| `src/features/learn/data/courses.ts` | Modify | Restructure to chapters, unique videos |
| `src/features/learn/components/VideoPlayer.tsx` | Modify | Chapter-aware episode drawer |
| `src/features/learn/components/CourseCard.tsx` | Modify | Proper callback props |
| `src/features/learn/components/VideoHero.tsx` | Modify | Wire Start Learning correctly |
| `src/app/(public)/learn/[courseId]/page.tsx` | Modify | Add VideoPlayer, clickable lessons |
| `src/app/(public)/learn/page.tsx` | Minor | Ensure callbacks propagate |
