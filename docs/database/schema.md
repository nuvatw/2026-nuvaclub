# Database Schema

Complete reference for all database tables.

## User Tables

### `users`

```typescript
interface UserRecord {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  identityType: IdentityType;
  emailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt?: Date;
}
```

### `userSubscriptions`

```typescript
interface UserSubscriptionRecord {
  id: string;
  userId: string;
  planType: 'explorer' | 'traveler';
  status: 'active' | 'cancelled' | 'expired' | 'paused';
  billingCycle: 'monthly' | 'yearly';
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  cancelledAt?: Date;
  createdAt: Date;
}
```

### `duoTickets`

```typescript
interface DuoTicketRecord {
  id: string;
  userId: string;
  ticketType: 'go' | 'run' | 'fly';
  status: 'active' | 'expired' | 'cancelled';
  validFrom: Date;
  validUntil: Date;
  purchasedAt: Date;
  orderId?: string;
}
```

## Learn Tables

### `courses`

```typescript
interface CourseRecord {
  id: string;
  instructorId: string;
  categoryId: string;
  title: string;
  slug: string;
  description: string;
  thumbnail: string;
  previewVideoUrl?: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  duration: number; // minutes
  lessonCount: number;
  enrollmentCount: number;
  avgRating: number;
  totalRatings: number;
  price: number;
  originalPrice?: number;
  isFeatured: boolean;
  isPublished: boolean;
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}
```

### `lessons`

```typescript
interface LessonRecord {
  id: string;
  courseId: string;
  title: string;
  description: string;
  videoUrl: string;
  duration: number;
  order: number;
  isFree: boolean;
  createdAt: Date;
}
```

## Space Tables

### `companions`

```typescript
interface CompanionRecord {
  id: string;
  userId?: string;
  name: string;
  avatar: string;
  type: 'nunu' | 'certified-nunu' | 'shangzhe';
  bio: string;
  discordId: string;
  isAvailable: boolean;
  matchCount: number;
  avgRating: number;
  totalRatings: number;
  createdAt: Date;
  updatedAt: Date;
}
```

### `userMentorships`

```typescript
interface UserMentorshipRecord {
  id: string;
  nunuId: string;      // Mentor user ID
  vavaId: string;      // Learner user ID
  status: 'active' | 'completed' | 'paused';
  startedAt: Date;
  lastSessionAt?: Date;
  sessionCount: number;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### `nunuApplications`

```typescript
interface NunuApplicationRecord {
  id: string;
  userId: string;
  status: 'pending' | 'approved' | 'rejected';
  applicationText: string;
  expertise: string[];
  discordId: string;
  submittedAt: Date;
  reviewedAt?: Date;
  reviewedBy?: string;
  rejectionReason?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### `nunuProfiles`

```typescript
interface NunuProfileRecord {
  id: string;
  userId: string;
  applicationId: string;
  level: 'N5' | 'N4' | 'N3' | 'N2' | 'N1';
  type: 'regular' | 'verified';
  bio: string;
  expertise: string[];
  discordId: string;
  currentVavaCount: number;
  totalMentorships: number;
  avgRating: number;
  totalRatings: number;
  isAvailable: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

### `matchingPosts`

```typescript
interface MatchingPostRecord {
  id: string;
  authorId: string;
  type: 'offering-nunu' | 'looking-for-nunu' | 'looking-for-vava';
  title: string;
  content: string;
  timeSelection: 'monthly' | 'seasonal';
  timePeriod: string;
  isVerifiedNunuOnly: boolean;
  viewCount: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

### `matchingComments`

```typescript
interface MatchingCommentRecord {
  id: string;
  postId: string;
  authorId: string;
  content: string;
  isPrivate: boolean;
  parentId?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

## Forum Tables

### `posts`

```typescript
interface PostRecord {
  id: string;
  authorId: string;
  category: 'question' | 'discussion' | 'showcase' | 'announcement';
  title: string;
  content: string;
  isPinned: boolean;
  isLocked: boolean;
  score: number;
  viewCount: number;
  createdAt: Date;
  updatedAt: Date;
}
```

### `comments`

```typescript
interface CommentRecord {
  id: string;
  postId: string;
  authorId: string;
  content: string;
  parentId?: string;
  score: number;
  createdAt: Date;
  updatedAt: Date;
}
```

## Shop Tables

### `products`

```typescript
interface ProductRecord {
  id: string;
  type: 'plan' | 'duo-ticket' | 'event' | 'merchandise';
  name: string;
  slug: string;
  description: string;
  price: number;
  originalPrice?: number;
  currency: string;
  imageUrl: string;
  isActive: boolean;
  isFeatured: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

## Test Tables

### `questions`

```typescript
interface QuestionRecord {
  id: string;
  level: number;
  type: 'multiple-choice' | 'true-false' | 'short-answer' | 'essay';
  question: string;
  options?: string[];
  correctAnswer: string | number | boolean;
  explanation?: string;
  points: number;
  timeLimit?: number;
  createdAt: Date;
}
```

### `testSessions`

```typescript
interface TestSessionRecord {
  id: string;
  userId: string;
  level: number;
  status: 'in-progress' | 'completed' | 'abandoned';
  questionIds: string[];
  currentQuestionIndex: number;
  score?: number;
  totalPoints: number;
  startedAt: Date;
  completedAt?: Date;
  timeSpentSeconds: number;
}
```
