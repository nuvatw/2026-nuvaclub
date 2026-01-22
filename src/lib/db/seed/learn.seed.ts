import type { MockDB } from '../core/MockDB';

/**
 * Seed learn module data
 */
export async function seedLearn(db: MockDB): Promise<void> {
  const now = new Date();

  // Create instructors
  db.instructors.createMany([
    { id: 'instructor-1', name: 'Luna', avatar: 'https://i.pravatar.cc/150?u=luna', expertise: ['ChatGPT', 'Perplexity', 'Copywriting'], createdAt: now },
    { id: 'instructor-2', name: 'Max', avatar: 'https://i.pravatar.cc/150?u=max', expertise: ['ChatGPT', 'Beginner'], createdAt: now },
    { id: 'instructor-3', name: 'Aria', avatar: 'https://i.pravatar.cc/150?u=aria', expertise: ['Midjourney', 'DALL-E', 'Image Generation'], createdAt: now },
    { id: 'instructor-4', name: 'Leo', avatar: 'https://i.pravatar.cc/150?u=leo', expertise: ['Prompt', 'Advanced'], createdAt: now },
    { id: 'instructor-5', name: 'Nina', avatar: 'https://i.pravatar.cc/150?u=nina', expertise: ['Automation', 'Make.com', 'Zapier'], createdAt: now },
    { id: 'instructor-6', name: 'Sam', avatar: 'https://i.pravatar.cc/150?u=sam', expertise: ['Data Analysis', 'Excel'], createdAt: now },
    { id: 'instructor-7', name: 'Jake', avatar: 'https://i.pravatar.cc/150?u=jake', expertise: ['Customer Service', 'Chatbot'], createdAt: now },
    { id: 'instructor-8', name: 'Mia', avatar: 'https://i.pravatar.cc/150?u=mia', expertise: ['Content Creation', 'Hands-on'], createdAt: now },
  ]);

  // Create categories
  db.courseCategories.createMany([
    { id: 'cat-1', name: 'AI Basics', slug: 'ai-basics', sortOrder: 1 },
    { id: 'cat-2', name: 'Advanced Applications', slug: 'advanced', sortOrder: 2 },
    { id: 'cat-3', name: 'Hands-on Projects', slug: 'projects', sortOrder: 3 },
    { id: 'cat-4', name: 'Tools & Tips', slug: 'tools', sortOrder: 4 },
    { id: 'cat-5', name: 'Free Courses', slug: 'free', sortOrder: 5 },
  ]);

  // Create courses
  db.courses.createMany([
    {
      id: 'course-1',
      title: 'AI Social Media Copywriter',
      subtitle: 'Write menu items, food stories, and event promotions like a pro',
      description: 'Transform "I don\'t know what to write, can\'t write anything unique, no one reads what I write" into a reusable copywriting workflow. From product positioning and target audience analysis to copywriting, systematically improve your copywriting skills.',
      thumbnailUrl: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800',
      previewVideoUrl: 'https://sample-videos.com/video321/mp4/720/big_buck_bunny_720p_1mb.mp4',
      trailerUrl: 'https://www.youtube.com/watch?v=dLRdaUda8Ho',
      categoryId: 'cat-1',
      instructorId: 'instructor-1',
      accessLevel: 'paid',
      totalDuration: 7200,
      lessonCount: 8,
      isFeatured: true,
      isPublished: true,
      publishedAt: new Date('2026-01-01'),
      createdAt: new Date('2026-01-01'),
      updatedAt: now,
    },
    {
      id: 'course-2',
      title: 'ChatGPT Complete Beginner\'s Guide',
      subtitle: 'Learn AI conversations from scratch',
      description: 'This is a free course that takes you from the basics to understanding how to use ChatGPT and its techniques.',
      thumbnailUrl: 'https://images.unsplash.com/photo-1676299081847-824916de030a?w=800',
      trailerUrl: 'https://www.youtube.com/watch?v=dLRdaUda8Ho',
      categoryId: 'cat-5',
      instructorId: 'instructor-2',
      accessLevel: 'free',
      totalDuration: 3600,
      lessonCount: 5,
      isFeatured: true,
      isPublished: true,
      publishedAt: new Date('2026-01-05'),
      createdAt: new Date('2026-01-05'),
      updatedAt: now,
    },
    {
      id: 'course-3',
      title: 'AI Image Generation Hands-on',
      subtitle: 'Complete Midjourney and DALL-E Tutorial',
      description: 'Learn how to use AI to generate high-quality images, from basic prompts to advanced techniques.',
      thumbnailUrl: '/images/courses/ai-art.png',
      trailerUrl: 'https://www.youtube.com/watch?v=dLRdaUda8Ho',
      categoryId: 'cat-2',
      instructorId: 'instructor-3',
      accessLevel: 'paid',
      totalDuration: 5400,
      lessonCount: 6,
      isFeatured: true,
      isPublished: true,
      publishedAt: new Date('2026-01-10'),
      createdAt: new Date('2026-01-10'),
      updatedAt: now,
    },
    {
      id: 'course-4',
      title: 'Prompt Engineering',
      subtitle: 'Advanced Prompt Engineering Techniques',
      description: 'Learn in-depth how to write effective prompts to get more precise results from AI.',
      thumbnailUrl: '/images/courses/prompt-engineering.png',
      trailerUrl: 'https://www.youtube.com/watch?v=dLRdaUda8Ho',
      categoryId: 'cat-2',
      instructorId: 'instructor-4',
      accessLevel: 'paid',
      totalDuration: 4800,
      lessonCount: 7,
      isFeatured: false,
      isPublished: true,
      publishedAt: new Date('2026-01-15'),
      createdAt: new Date('2026-01-15'),
      updatedAt: now,
    },
    {
      id: 'course-5',
      title: 'AI Automation Workflows',
      subtitle: 'Make.com and Zapier Integration Tutorial',
      description: 'Build your AI automation workflows and boost your productivity.',
      thumbnailUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800',
      trailerUrl: 'https://www.youtube.com/watch?v=dLRdaUda8Ho',
      categoryId: 'cat-4',
      instructorId: 'instructor-5',
      accessLevel: 'paid',
      totalDuration: 6000,
      lessonCount: 8,
      isFeatured: false,
      isPublished: true,
      publishedAt: new Date('2026-01-20'),
      createdAt: new Date('2026-01-20'),
      updatedAt: now,
    },
    {
      id: 'course-6',
      title: 'AI Data Analysis for Beginners',
      subtitle: 'Quick data analysis with AI',
      description: 'Learn for free how to use AI tools for basic data analysis.',
      thumbnailUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800',
      trailerUrl: 'https://www.youtube.com/watch?v=dLRdaUda8Ho',
      categoryId: 'cat-5',
      instructorId: 'instructor-6',
      accessLevel: 'free',
      totalDuration: 2400,
      lessonCount: 4,
      isFeatured: false,
      isPublished: true,
      publishedAt: new Date('2026-01-25'),
      createdAt: new Date('2026-01-25'),
      updatedAt: now,
    },
    {
      id: 'course-7',
      title: 'AI Customer Service Bot Development',
      subtitle: 'Build an intelligent customer service assistant',
      description: 'Learn how to build an AI customer service bot and automate your customer service process.',
      thumbnailUrl: 'https://images.unsplash.com/photo-1531746790731-6c087fecd65a?w=800',
      trailerUrl: 'https://www.youtube.com/watch?v=dLRdaUda8Ho',
      categoryId: 'cat-3',
      instructorId: 'instructor-7',
      accessLevel: 'paid',
      totalDuration: 7200,
      lessonCount: 10,
      isFeatured: true,
      isPublished: true,
      publishedAt: new Date('2026-01-28'),
      createdAt: new Date('2026-01-28'),
      updatedAt: now,
    },
    {
      id: 'course-8',
      title: 'AI Content Creation Workshop',
      subtitle: 'Blogs, social media, and video scripts all in one',
      description: 'A hands-on content creation course that teaches you how to use AI to boost your creative efficiency.',
      thumbnailUrl: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800',
      trailerUrl: 'https://www.youtube.com/watch?v=dLRdaUda8Ho',
      categoryId: 'cat-3',
      instructorId: 'instructor-8',
      accessLevel: 'paid',
      totalDuration: 5400,
      lessonCount: 6,
      isFeatured: false,
      isPublished: true,
      publishedAt: new Date('2026-02-01'),
      createdAt: new Date('2026-02-01'),
      updatedAt: now,
    },
  ]);

  // Create course tags
  db.courseTags.createMany([
    { id: 'tag-1-1', courseId: 'course-1', tag: 'ChatGPT' },
    { id: 'tag-1-2', courseId: 'course-1', tag: 'Perplexity' },
    { id: 'tag-1-3', courseId: 'course-1', tag: 'Copywriting' },
    { id: 'tag-2-1', courseId: 'course-2', tag: 'ChatGPT' },
    { id: 'tag-2-2', courseId: 'course-2', tag: 'Beginner' },
    { id: 'tag-3-1', courseId: 'course-3', tag: 'Midjourney' },
    { id: 'tag-3-2', courseId: 'course-3', tag: 'DALL-E' },
    { id: 'tag-3-3', courseId: 'course-3', tag: 'Image Generation' },
    { id: 'tag-4-1', courseId: 'course-4', tag: 'Prompt' },
    { id: 'tag-4-2', courseId: 'course-4', tag: 'Advanced' },
    { id: 'tag-5-1', courseId: 'course-5', tag: 'Automation' },
    { id: 'tag-5-2', courseId: 'course-5', tag: 'Make.com' },
    { id: 'tag-5-3', courseId: 'course-5', tag: 'Zapier' },
    { id: 'tag-6-1', courseId: 'course-6', tag: 'Data Analysis' },
    { id: 'tag-6-2', courseId: 'course-6', tag: 'Free' },
    { id: 'tag-7-1', courseId: 'course-7', tag: 'Customer Service' },
    { id: 'tag-7-2', courseId: 'course-7', tag: 'Chatbot' },
    { id: 'tag-7-3', courseId: 'course-7', tag: 'Project' },
    { id: 'tag-8-1', courseId: 'course-8', tag: 'Content Creation' },
    { id: 'tag-8-2', courseId: 'course-8', tag: 'Hands-on' },
  ]);

  // Create lessons
  db.lessons.createMany([
    // Course 1 lessons
    { id: 'l1-1', courseId: 'course-1', title: 'Course Introduction', duration: 300, videoUrl: '', accessLevel: 'first-chapter', order: 1, createdAt: now, updatedAt: now },
    { id: 'l1-2', courseId: 'course-1', title: 'AI Copywriting Fundamentals', duration: 900, videoUrl: '', accessLevel: 'paid', order: 2, createdAt: now, updatedAt: now },
    { id: 'l1-3', courseId: 'course-1', title: 'Product Positioning Analysis', duration: 1200, videoUrl: '', accessLevel: 'paid', order: 3, createdAt: now, updatedAt: now },
    // Course 2 lessons
    { id: 'l2-1', courseId: 'course-2', title: 'What is ChatGPT', duration: 600, videoUrl: '', accessLevel: 'free', order: 1, createdAt: now, updatedAt: now },
    { id: 'l2-2', courseId: 'course-2', title: 'Basic Operations Guide', duration: 800, videoUrl: '', accessLevel: 'free', order: 2, createdAt: now, updatedAt: now },
    // Course 3 lessons
    { id: 'l3-1', courseId: 'course-3', title: 'Image Generation Basics', duration: 500, videoUrl: '', accessLevel: 'first-chapter', order: 1, createdAt: now, updatedAt: now },
    { id: 'l3-2', courseId: 'course-3', title: 'Getting Started with Midjourney', duration: 1200, videoUrl: '', accessLevel: 'paid', order: 2, createdAt: now, updatedAt: now },
    // Course 4 lessons
    { id: 'l4-1', courseId: 'course-4', title: 'Prompt Structure Fundamentals', duration: 600, videoUrl: '', accessLevel: 'first-chapter', order: 1, createdAt: now, updatedAt: now },
    { id: 'l4-2', courseId: 'course-4', title: 'Role Setting Techniques', duration: 900, videoUrl: '', accessLevel: 'paid', order: 2, createdAt: now, updatedAt: now },
    // Course 5 lessons
    { id: 'l5-1', courseId: 'course-5', title: 'Introduction to Automation', duration: 400, videoUrl: '', accessLevel: 'first-chapter', order: 1, createdAt: now, updatedAt: now },
    { id: 'l5-2', courseId: 'course-5', title: 'Make.com Basics', duration: 1000, videoUrl: '', accessLevel: 'paid', order: 2, createdAt: now, updatedAt: now },
    // Course 6 lessons
    { id: 'l6-1', courseId: 'course-6', title: 'Data Analysis Fundamentals', duration: 500, videoUrl: '', accessLevel: 'free', order: 1, createdAt: now, updatedAt: now },
    { id: 'l6-2', courseId: 'course-6', title: 'Excel + AI', duration: 700, videoUrl: '', accessLevel: 'free', order: 2, createdAt: now, updatedAt: now },
    // Course 7 lessons
    { id: 'l7-1', courseId: 'course-7', title: 'Project Overview', duration: 400, videoUrl: '', accessLevel: 'first-chapter', order: 1, createdAt: now, updatedAt: now },
    { id: 'l7-2', courseId: 'course-7', title: 'Requirements Analysis', duration: 800, videoUrl: '', accessLevel: 'paid', order: 2, createdAt: now, updatedAt: now },
    // Course 8 lessons
    { id: 'l8-1', courseId: 'course-8', title: 'Content Strategy Planning', duration: 600, videoUrl: '', accessLevel: 'first-chapter', order: 1, createdAt: now, updatedAt: now },
    { id: 'l8-2', courseId: 'course-8', title: 'Blog Writing', duration: 1000, videoUrl: '', accessLevel: 'paid', order: 2, createdAt: now, updatedAt: now },
  ]);

  // ==========================================
  // User Progress Data for Canonical Users
  // ==========================================
  // Mapped to new canonical users (user-1 through user-10)
  // user-1 (Alex Chen) - solo-traveler - 2 completed courses
  // user-2 (Sarah Lin) - duo-run - 4 courses (power user)
  // user-3 (Mike Wang) - solo-traveler - 3 courses
  // user-4 (Emily Huang) - duo-fly - 5 courses (premium user)
  // user-5 (Kevin Lee) - explorer - 1 course partial
  // user-6 (Jessica Wu) - duo-go - 3 courses
  // user-7 (David Zhang) - explorer - free course only
  // user-8 (Lisa Chen) - duo-go - 2 courses
  // user-9 (Tom Huang) - solo-traveler - 2 courses
  // user-10 (Amy Lin) - duo-fly - 6 courses (expert mentor)

  db.userCourseProgress.createMany([
    // ==========================================
    // Alex Chen (user-1) - solo-traveler - 2 complete
    // ==========================================
    {
      id: 'progress-1-1',
      userId: 'user-1',
      courseId: 'course-1',
      progressPercent: 100,
      currentLessonId: 'l1-3',
      completedLessonIds: ['l1-1', 'l1-2', 'l1-3'],
      lastAccessedAt: new Date('2026-01-10T16:00:00'),
      completedAt: new Date('2026-01-10T16:00:00'),
    },
    {
      id: 'progress-1-2',
      userId: 'user-1',
      courseId: 'course-2',
      progressPercent: 100,
      currentLessonId: 'l2-2',
      completedLessonIds: ['l2-1', 'l2-2'],
      lastAccessedAt: new Date('2026-01-08T10:00:00'),
      completedAt: new Date('2026-01-08T10:00:00'),
    },

    // ==========================================
    // Sarah Lin (user-2) - duo-run - 4 courses (power user)
    // ==========================================
    {
      id: 'progress-2-1',
      userId: 'user-2',
      courseId: 'course-1',
      progressPercent: 100,
      currentLessonId: 'l1-3',
      completedLessonIds: ['l1-1', 'l1-2', 'l1-3'],
      lastAccessedAt: new Date('2025-12-01T10:00:00'),
      completedAt: new Date('2025-12-01T10:00:00'),
    },
    {
      id: 'progress-2-2',
      userId: 'user-2',
      courseId: 'course-2',
      progressPercent: 100,
      currentLessonId: 'l2-2',
      completedLessonIds: ['l2-1', 'l2-2'],
      lastAccessedAt: new Date('2025-11-20T14:00:00'),
      completedAt: new Date('2025-11-20T14:00:00'),
    },
    {
      id: 'progress-2-3',
      userId: 'user-2',
      courseId: 'course-3',
      progressPercent: 100,
      currentLessonId: 'l3-2',
      completedLessonIds: ['l3-1', 'l3-2'],
      lastAccessedAt: new Date('2025-12-15T16:00:00'),
      completedAt: new Date('2025-12-15T16:00:00'),
    },
    {
      id: 'progress-2-4',
      userId: 'user-2',
      courseId: 'course-4',
      progressPercent: 50,
      currentLessonId: 'l4-1',
      completedLessonIds: ['l4-1'],
      lastAccessedAt: new Date('2026-01-19T09:00:00'),
    },

    // ==========================================
    // Mike Wang (user-3) - solo-traveler - 3 courses
    // ==========================================
    {
      id: 'progress-3-1',
      userId: 'user-3',
      courseId: 'course-1',
      progressPercent: 100,
      currentLessonId: 'l1-3',
      completedLessonIds: ['l1-1', 'l1-2', 'l1-3'],
      lastAccessedAt: new Date('2026-01-05T10:00:00'),
      completedAt: new Date('2026-01-05T10:00:00'),
    },
    {
      id: 'progress-3-2',
      userId: 'user-3',
      courseId: 'course-2',
      progressPercent: 100,
      currentLessonId: 'l2-2',
      completedLessonIds: ['l2-1', 'l2-2'],
      lastAccessedAt: new Date('2025-12-20T14:00:00'),
      completedAt: new Date('2025-12-20T14:00:00'),
    },
    {
      id: 'progress-3-3',
      userId: 'user-3',
      courseId: 'course-5',
      progressPercent: 60,
      currentLessonId: 'l5-1',
      completedLessonIds: ['l5-1'],
      lastAccessedAt: new Date('2026-01-18T11:00:00'),
    },

    // ==========================================
    // Emily Huang (user-4) - duo-fly - 5 courses (premium)
    // ==========================================
    {
      id: 'progress-4-1',
      userId: 'user-4',
      courseId: 'course-1',
      progressPercent: 100,
      currentLessonId: 'l1-3',
      completedLessonIds: ['l1-1', 'l1-2', 'l1-3'],
      lastAccessedAt: new Date('2025-10-15T10:00:00'),
      completedAt: new Date('2025-10-15T10:00:00'),
    },
    {
      id: 'progress-4-2',
      userId: 'user-4',
      courseId: 'course-2',
      progressPercent: 100,
      currentLessonId: 'l2-2',
      completedLessonIds: ['l2-1', 'l2-2'],
      lastAccessedAt: new Date('2025-09-20T14:00:00'),
      completedAt: new Date('2025-09-20T14:00:00'),
    },
    {
      id: 'progress-4-3',
      userId: 'user-4',
      courseId: 'course-3',
      progressPercent: 100,
      currentLessonId: 'l3-2',
      completedLessonIds: ['l3-1', 'l3-2'],
      lastAccessedAt: new Date('2025-11-01T16:00:00'),
      completedAt: new Date('2025-11-01T16:00:00'),
    },
    {
      id: 'progress-4-4',
      userId: 'user-4',
      courseId: 'course-4',
      progressPercent: 100,
      currentLessonId: 'l4-2',
      completedLessonIds: ['l4-1', 'l4-2'],
      lastAccessedAt: new Date('2025-12-01T09:00:00'),
      completedAt: new Date('2025-12-01T09:00:00'),
    },
    {
      id: 'progress-4-5',
      userId: 'user-4',
      courseId: 'course-5',
      progressPercent: 50,
      currentLessonId: 'l5-1',
      completedLessonIds: ['l5-1'],
      lastAccessedAt: new Date('2026-01-20T11:00:00'),
    },

    // ==========================================
    // Kevin Lee (user-5) - explorer - 1 course partial
    // ==========================================
    {
      id: 'progress-5-1',
      userId: 'user-5',
      courseId: 'course-2', // Free course - partial
      progressPercent: 50,
      currentLessonId: 'l2-1',
      completedLessonIds: ['l2-1'],
      lastAccessedAt: new Date('2026-01-21T14:30:00'),
    },

    // ==========================================
    // Jessica Wu (user-6) - duo-go - 3 courses
    // ==========================================
    {
      id: 'progress-6-1',
      userId: 'user-6',
      courseId: 'course-1',
      progressPercent: 100,
      currentLessonId: 'l1-3',
      completedLessonIds: ['l1-1', 'l1-2', 'l1-3'],
      lastAccessedAt: new Date('2026-01-12T10:00:00'),
      completedAt: new Date('2026-01-12T10:00:00'),
    },
    {
      id: 'progress-6-2',
      userId: 'user-6',
      courseId: 'course-2',
      progressPercent: 100,
      currentLessonId: 'l2-2',
      completedLessonIds: ['l2-1', 'l2-2'],
      lastAccessedAt: new Date('2026-01-05T14:00:00'),
      completedAt: new Date('2026-01-05T14:00:00'),
    },
    {
      id: 'progress-6-3',
      userId: 'user-6',
      courseId: 'course-3',
      progressPercent: 50,
      currentLessonId: 'l3-1',
      completedLessonIds: ['l3-1'],
      lastAccessedAt: new Date('2026-01-20T11:00:00'),
    },

    // ==========================================
    // David Zhang (user-7) - explorer - free course only
    // ==========================================
    {
      id: 'progress-7-1',
      userId: 'user-7',
      courseId: 'course-2', // Free course - complete
      progressPercent: 100,
      currentLessonId: 'l2-2',
      completedLessonIds: ['l2-1', 'l2-2'],
      lastAccessedAt: new Date('2026-01-18T10:00:00'),
      completedAt: new Date('2026-01-18T10:00:00'),
    },

    // ==========================================
    // Lisa Chen (user-8) - duo-go - 2 courses
    // ==========================================
    {
      id: 'progress-8-1',
      userId: 'user-8',
      courseId: 'course-1',
      progressPercent: 33,
      currentLessonId: 'l1-1',
      completedLessonIds: ['l1-1'],
      lastAccessedAt: new Date('2026-01-19T15:00:00'),
    },
    {
      id: 'progress-8-2',
      userId: 'user-8',
      courseId: 'course-2',
      progressPercent: 100,
      currentLessonId: 'l2-2',
      completedLessonIds: ['l2-1', 'l2-2'],
      lastAccessedAt: new Date('2026-01-17T10:00:00'),
      completedAt: new Date('2026-01-17T10:00:00'),
    },

    // ==========================================
    // Tom Huang (user-9) - solo-traveler - 2 courses
    // ==========================================
    {
      id: 'progress-9-1',
      userId: 'user-9',
      courseId: 'course-1',
      progressPercent: 100,
      currentLessonId: 'l1-3',
      completedLessonIds: ['l1-1', 'l1-2', 'l1-3'],
      lastAccessedAt: new Date('2026-01-08T10:00:00'),
      completedAt: new Date('2026-01-08T10:00:00'),
    },
    {
      id: 'progress-9-2',
      userId: 'user-9',
      courseId: 'course-7',
      progressPercent: 70,
      currentLessonId: 'l7-1',
      completedLessonIds: ['l7-1'],
      lastAccessedAt: new Date('2026-01-20T14:00:00'),
    },

    // ==========================================
    // Amy Lin (user-10) - duo-fly - 6 courses (expert mentor)
    // ==========================================
    {
      id: 'progress-10-1',
      userId: 'user-10',
      courseId: 'course-1',
      progressPercent: 100,
      currentLessonId: 'l1-3',
      completedLessonIds: ['l1-1', 'l1-2', 'l1-3'],
      lastAccessedAt: new Date('2025-07-01T10:00:00'),
      completedAt: new Date('2025-07-01T10:00:00'),
    },
    {
      id: 'progress-10-2',
      userId: 'user-10',
      courseId: 'course-2',
      progressPercent: 100,
      currentLessonId: 'l2-2',
      completedLessonIds: ['l2-1', 'l2-2'],
      lastAccessedAt: new Date('2025-06-15T14:00:00'),
      completedAt: new Date('2025-06-15T14:00:00'),
    },
    {
      id: 'progress-10-3',
      userId: 'user-10',
      courseId: 'course-3',
      progressPercent: 100,
      currentLessonId: 'l3-2',
      completedLessonIds: ['l3-1', 'l3-2'],
      lastAccessedAt: new Date('2025-08-01T16:00:00'),
      completedAt: new Date('2025-08-01T16:00:00'),
    },
    {
      id: 'progress-10-4',
      userId: 'user-10',
      courseId: 'course-4',
      progressPercent: 100,
      currentLessonId: 'l4-2',
      completedLessonIds: ['l4-1', 'l4-2'],
      lastAccessedAt: new Date('2025-09-01T09:00:00'),
      completedAt: new Date('2025-09-01T09:00:00'),
    },
    {
      id: 'progress-10-5',
      userId: 'user-10',
      courseId: 'course-5',
      progressPercent: 100,
      currentLessonId: 'l5-2',
      completedLessonIds: ['l5-1', 'l5-2'],
      lastAccessedAt: new Date('2025-10-01T11:00:00'),
      completedAt: new Date('2025-10-01T11:00:00'),
    },
    {
      id: 'progress-10-6',
      userId: 'user-10',
      courseId: 'course-6',
      progressPercent: 100,
      currentLessonId: 'l6-2',
      completedLessonIds: ['l6-1', 'l6-2'],
      lastAccessedAt: new Date('2025-11-01T14:00:00'),
      completedAt: new Date('2025-11-01T14:00:00'),
    },
  ]);

  // Lesson-level progress for detailed tracking
  db.userLessonProgress.createMany([
    // Kevin Lee (user-5) - partial progress on course-2
    {
      id: 'lp-5-1',
      userId: 'user-5',
      lessonId: 'l2-1',
      progressPercent: 100,
      currentPosition: 600,
      completedAt: new Date('2026-01-20T10:00:00'),
      lastWatchedAt: new Date('2026-01-20T10:00:00'),
    },
    {
      id: 'lp-5-2',
      userId: 'user-5',
      lessonId: 'l2-2',
      progressPercent: 40,
      currentPosition: 320,
      lastWatchedAt: new Date('2026-01-21T14:30:00'),
    },
    // Alex Chen (user-1) - all complete
    {
      id: 'lp-1-1',
      userId: 'user-1',
      lessonId: 'l1-1',
      progressPercent: 100,
      currentPosition: 300,
      completedAt: new Date('2026-01-08T10:00:00'),
      lastWatchedAt: new Date('2026-01-08T10:00:00'),
    },
    {
      id: 'lp-1-2',
      userId: 'user-1',
      lessonId: 'l1-2',
      progressPercent: 100,
      currentPosition: 900,
      completedAt: new Date('2026-01-09T10:00:00'),
      lastWatchedAt: new Date('2026-01-09T10:00:00'),
    },
    {
      id: 'lp-1-3',
      userId: 'user-1',
      lessonId: 'l1-3',
      progressPercent: 100,
      currentPosition: 1200,
      completedAt: new Date('2026-01-10T16:00:00'),
      lastWatchedAt: new Date('2026-01-10T16:00:00'),
    },
  ]);
}
