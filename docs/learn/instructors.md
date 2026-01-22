# Instructors

Instructors are course creators on the nuvaClub platform.

## Instructor Profile

```typescript
interface InstructorRecord {
  id: string;
  name: string;
  avatar: string;
  title: string;
  bio: string;
  expertise: string[];
  socialLinks?: {
    twitter?: string;
    linkedin?: string;
    website?: string;
  };
  courseCount: number;
  studentCount: number;
  avgRating: number;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

## Displaying Instructors

### In Course Cards

Shows instructor name and avatar alongside course info.

### Instructor Pages

Full profile with:
- Bio and expertise
- All courses by instructor
- Student count and rating
- Social links

## Verification

Verified instructors have:
- ✓ Verified badge
- Higher visibility in search
- Featured placement eligibility

## Becoming an Instructor

(Future feature)
1. Apply with portfolio
2. Platform review
3. Create first course
4. Publish after approval

## Data Relations

```typescript
// Course → Instructor
const course = db.courses.findById(courseId);
const instructor = db.instructors.findById(course.instructorId);

// Instructor → Courses
const courses = db.courses.findMany({ instructorId });
```
