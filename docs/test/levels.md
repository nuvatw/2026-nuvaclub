# Test Levels

The 12-level system provides progressive assessment of AI knowledge.

## Level Tiers

### Beginner (1-3)

- Basic AI concepts
- Simple tool usage
- Foundational knowledge

**Topics:**
- What is AI?
- ChatGPT basics
- Prompt fundamentals

### Intermediate (4-6)

- Applied knowledge
- Workflow creation
- Problem-solving

**Topics:**
- Advanced prompting
- Tool integration
- Content creation

### Advanced (7-9)

- Complex scenarios
- Strategy development
- Multiple tool chains

**Topics:**
- API usage
- Automation workflows
- AI in business

### Expert (10-12)

- Master-level content
- Original solutions
- Teaching ability

**Topics:**
- AI architecture
- Enterprise deployment
- Innovation

## Level Access

All 12 levels are available from the start. Users can freely choose any level to test their skills.

```
Levels 1-12 → All unlocked, freely selectable
```

Users can:
- Start at any level they feel confident with
- Skip around between levels as desired
- Retake any level to improve their score

## Level Configuration

```typescript
interface LevelConfig {
  level: number;
  name: string;
  description: string;
  questionCount: number;
  durationMinutes: number;
  passScore: number; // percentage (default 60%)
  questionTypes: string;
  topics: string[];
}
```

## Attempts

- Unlimited attempts for all levels
- No cooldown between attempts
- Progress is tracked per level (best score, attempt count)

## Progress Storage

```typescript
interface UserTestProgressRecord {
  id: string;
  userId: string;
  currentLevel: number;        // Legacy field, not used for access control
  highestPassedLevel: number;  // Best level completed successfully
  totalAttempts: number;       // Total test attempts across all levels
  totalPassed: number;         // Number of passed tests
  lastAttemptAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}
```
