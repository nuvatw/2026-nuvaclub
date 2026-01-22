# Test Feature

The Test feature provides a 12-level assessment system to evaluate AI knowledge.

## Overview

Test offers:
- 12 levels (freely selectable)
- Multiple question types
- Timed assessments
- Progress tracking
- Achievement system

## Levels

| Level | Name | Questions | Time | Pass Score |
|-------|------|-----------|------|------------|
| 1-3 | Beginner | 10 | 15 min | 70% |
| 4-6 | Intermediate | 15 | 20 min | 75% |
| 7-9 | Advanced | 20 | 30 min | 80% |
| 10-12 | Expert | 25 | 45 min | 85% |

## Question Types

- **Multiple Choice** - Select one correct answer
- **True/False** - Binary choice
- **Short Answer** - Brief text response
- **Essay** - Extended response (manual grading)

## Key Files

```
src/features/test/
├── components/
│   ├── TestLevelCard.tsx
│   ├── TestLevelGrid.tsx
│   ├── TestTimer.tsx
│   ├── TestProgressBar.tsx
│   ├── TestNavigation.tsx
│   ├── TestResultSummary.tsx
│   ├── TestSubmitModal.tsx
│   └── QuestionRenderer/
│       ├── index.tsx
│       ├── MultipleChoiceQuestion.tsx
│       ├── TrueFalseQuestion.tsx
│       ├── ShortAnswerQuestion.tsx
│       └── EssayQuestion.tsx
└── types.ts

src/app/(public)/test/
├── page.tsx           # Level selection
└── [levelId]/
    └── page.tsx       # Take test
```

## Documentation

- [Levels](./levels.md) - Level system details
- [Scoring](./scoring.md) - Scoring and progression
