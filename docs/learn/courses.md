# Courses

Courses are the primary learning content in nuvaClub.

## Course Structure

```
Course
├── Metadata (title, description, thumbnail)
├── Instructor
├── Category
├── Tags
├── Lessons[]
│   ├── Lesson 1 (may be free)
│   ├── Lesson 2
│   └── ...
└── Reviews
```

## Course Levels

### Beginner

- No prerequisites
- Foundational concepts
- Simple exercises
- Estimated: 2-4 hours

### Intermediate

- Basic AI knowledge required
- Practical applications
- Hands-on projects
- Estimated: 4-8 hours

### Advanced

- Prior experience required
- Complex workflows
- Real-world scenarios
- Estimated: 8+ hours

## Course Categories

| Category | Description | Example Topics |
|----------|-------------|----------------|
| AI Basics | Introduction to AI | What is AI, ChatGPT basics |
| Prompt Engineering | Writing effective prompts | Techniques, templates |
| Automation | Workflow automation | Make.com, Zapier, APIs |
| Content Creation | AI for content | Writing, images, video |
| Business Applications | AI in business | Strategy, implementation |

## Lesson Types

### Free Lessons

- Available to all users
- Typically first 1-2 lessons
- Used for course preview

### Premium Lessons

- Requires Explorer+ subscription
- Full course content
- Includes resources

## Progress Tracking

### Course Progress

```typescript
interface UserCourseProgressRecord {
  id: string;
  userId: string;
  courseId: string;
  enrolledAt: Date;
  lastAccessedAt?: Date;
  completedAt?: Date;
  progressPercent: number;
}
```

### Lesson Progress

```typescript
interface UserLessonProgressRecord {
  id: string;
  userId: string;
  lessonId: string;
  courseId: string;
  status: 'not-started' | 'in-progress' | 'completed';
  progressSeconds: number;
  completedAt?: Date;
}
```

## Hooks

```typescript
// Get all courses
const { courses, isReady } = useCourses();

// Get single course with lessons
const course = useCourse(courseId);

// Get categories
const { categories } = useCourseCategories();
```

## Course Card Display

```typescript
<CourseCard
  course={course}
  showProgress={isLoggedIn}
  variant="grid" // or "list"
/>
```
