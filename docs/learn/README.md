# Learn Feature

The Learn feature provides video courses and tutorials on AI tools and concepts.

## Overview

Learn offers:
- Structured video courses
- Multiple skill levels
- Progress tracking
- Instructor profiles

## Key Concepts

### Courses

Courses are organized collections of lessons on specific topics.

**Levels:**
- Beginner - No prerequisites
- Intermediate - Basic AI knowledge
- Advanced - Prior experience required

**Categories:**
- AI Basics
- Prompt Engineering
- Automation
- Content Creation
- Business Applications

### Lessons

Individual video lessons within a course.

- Sequential ordering
- Duration tracking
- Free preview lessons
- Progress tracking

### Instructors

Course creators with expertise profiles.

## Access Control

| Feature | Guest | Free | Explorer+ |
|---------|-------|------|-----------|
| Browse courses | ✓ | ✓ | ✓ |
| View previews | ✓ | ✓ | ✓ |
| Watch free lessons | ✓ | ✓ | ✓ |
| Watch all lessons | ✗ | ✗ | ✓ |
| Track progress | ✗ | ✓ | ✓ |
| Download resources | ✗ | ✗ | Traveler+ |

## Key Files

```
src/features/learn/
├── components/
│   ├── CourseCard.tsx
│   ├── CourseRow.tsx
│   ├── LearnHoverPreview.tsx
│   └── VideoHero.tsx
├── types.ts
└── data/

src/lib/db/hooks/
└── useCourses.ts

src/app/(public)/learn/
├── page.tsx           # Course catalog
└── [courseId]/
    └── page.tsx       # Course detail
```

## Documentation

- [Courses](./courses.md) - Course structure and progression
- [Instructors](./instructors.md) - Instructor system
