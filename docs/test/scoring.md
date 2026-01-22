# Scoring System

How test scores are calculated and tracked.

## Score Calculation

### Point Values

```typescript
const QUESTION_POINTS = {
  'multiple-choice': 10,
  'true-false': 5,
  'short-answer': 15,
  'essay': 25,
};
```

### Score Formula

```
Score = (Points Earned / Total Points) × 100
```

### Pass Requirements

| Tier | Levels | Pass Score |
|------|--------|------------|
| Beginner | 1-3 | 70% |
| Intermediate | 4-6 | 75% |
| Advanced | 7-9 | 80% |
| Expert | 10-12 | 85% |

## Answer Evaluation

### Auto-Graded

- **Multiple Choice** - Exact match
- **True/False** - Exact match
- **Short Answer** - Fuzzy matching with keywords

### Manual Grading

- **Essay** - Requires manual review
- Partial credit possible
- Rubric-based scoring

## Time Bonuses

(Future feature)
- Early completion bonus
- Perfect score bonus
- Streak bonuses

## Attempt Tracking

```typescript
interface LevelAttemptRecord {
  id: string;
  userId: string;
  level: number;
  score: number;
  totalPoints: number;
  passed: boolean;
  timeSpent: number;
  answers: AnswerRecord[];
  startedAt: Date;
  completedAt: Date;
}
```

## Results Display

```typescript
<TestResultSummary
  score={85}
  totalPoints={100}
  passed={true}
  timeSpent={720} // seconds
  correctAnswers={17}
  totalQuestions={20}
/>
```

## Achievements

- First Test Passed
- Perfect Score
- Speed Demon (under time)
- Level Master (all levels)
- No Mistakes (streak)
