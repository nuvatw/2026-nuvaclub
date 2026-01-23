import type { MockDB } from '../core/MockDB';

/**
 * Seed learn module data
 * Following 3NF normalization with proper junction tables
 */
export async function seedLearn(db: MockDB): Promise<void> {
  const now = new Date();

  // ==========================================
  // INSTRUCTORS
  // ==========================================
  db.instructors.createMany([
    { id: 'instructor-1', name: 'Luna', avatar: 'https://i.pravatar.cc/150?u=luna', bio: 'AI content specialist with 5 years experience', isActive: true, createdAt: now, updatedAt: now },
    { id: 'instructor-2', name: 'Max', avatar: 'https://i.pravatar.cc/150?u=max', bio: 'Beginner-friendly AI educator', isActive: true, createdAt: now, updatedAt: now },
    { id: 'instructor-3', name: 'Aria', avatar: 'https://i.pravatar.cc/150?u=aria', bio: 'Visual AI expert specializing in image generation', isActive: true, createdAt: now, updatedAt: now },
    { id: 'instructor-4', name: 'Leo', avatar: 'https://i.pravatar.cc/150?u=leo', bio: 'Advanced prompt engineering specialist', isActive: true, createdAt: now, updatedAt: now },
    { id: 'instructor-5', name: 'Nina', avatar: 'https://i.pravatar.cc/150?u=nina', bio: 'Automation workflow expert', isActive: true, createdAt: now, updatedAt: now },
    { id: 'instructor-6', name: 'Sam', avatar: 'https://i.pravatar.cc/150?u=sam', bio: 'Data analysis and AI integration specialist', isActive: true, createdAt: now, updatedAt: now },
    { id: 'instructor-7', name: 'Jake', avatar: 'https://i.pravatar.cc/150?u=jake', bio: 'Customer service AI implementation expert', isActive: true, createdAt: now, updatedAt: now },
    { id: 'instructor-8', name: 'Mia', avatar: 'https://i.pravatar.cc/150?u=mia', bio: 'Content creation and hands-on project specialist', isActive: true, createdAt: now, updatedAt: now },
  ]);

  // ==========================================
  // INSTRUCTOR EXPERTISE (Junction Table - 1NF)
  // ==========================================
  db.instructorExpertise.createMany([
    // Luna
    { id: 'ie-1-1', instructorId: 'instructor-1', expertise: 'ChatGPT', sortOrder: 1 },
    { id: 'ie-1-2', instructorId: 'instructor-1', expertise: 'Perplexity', sortOrder: 2 },
    { id: 'ie-1-3', instructorId: 'instructor-1', expertise: 'Copywriting', sortOrder: 3 },
    // Max
    { id: 'ie-2-1', instructorId: 'instructor-2', expertise: 'ChatGPT', sortOrder: 1 },
    { id: 'ie-2-2', instructorId: 'instructor-2', expertise: 'Beginner Tutorial', sortOrder: 2 },
    // Aria
    { id: 'ie-3-1', instructorId: 'instructor-3', expertise: 'Midjourney', sortOrder: 1 },
    { id: 'ie-3-2', instructorId: 'instructor-3', expertise: 'DALL-E', sortOrder: 2 },
    { id: 'ie-3-3', instructorId: 'instructor-3', expertise: 'Image Generation', sortOrder: 3 },
    // Leo
    { id: 'ie-4-1', instructorId: 'instructor-4', expertise: 'Prompt Engineering', sortOrder: 1 },
    { id: 'ie-4-2', instructorId: 'instructor-4', expertise: 'Advanced Techniques', sortOrder: 2 },
    // Nina
    { id: 'ie-5-1', instructorId: 'instructor-5', expertise: 'Automation', sortOrder: 1 },
    { id: 'ie-5-2', instructorId: 'instructor-5', expertise: 'Make.com', sortOrder: 2 },
    { id: 'ie-5-3', instructorId: 'instructor-5', expertise: 'Zapier', sortOrder: 3 },
    // Sam
    { id: 'ie-6-1', instructorId: 'instructor-6', expertise: 'Data Analysis', sortOrder: 1 },
    { id: 'ie-6-2', instructorId: 'instructor-6', expertise: 'Excel', sortOrder: 2 },
    // Jake
    { id: 'ie-7-1', instructorId: 'instructor-7', expertise: 'Customer Service', sortOrder: 1 },
    { id: 'ie-7-2', instructorId: 'instructor-7', expertise: 'Chatbot', sortOrder: 2 },
    // Mia
    { id: 'ie-8-1', instructorId: 'instructor-8', expertise: 'Content Creation', sortOrder: 1 },
    { id: 'ie-8-2', instructorId: 'instructor-8', expertise: 'Hands-on Projects', sortOrder: 2 },
  ]);

  // ==========================================
  // COURSE CATEGORIES
  // ==========================================
  db.courseCategories.createMany([
    { id: 'cat-1', name: 'AI Basics', slug: 'ai-basics', description: 'Foundational AI knowledge', sortOrder: 1, isActive: true, createdAt: now, updatedAt: now },
    { id: 'cat-2', name: 'Advanced Applications', slug: 'advanced', description: 'Advanced AI techniques', sortOrder: 2, isActive: true, createdAt: now, updatedAt: now },
    { id: 'cat-3', name: 'Hands-on Projects', slug: 'projects', description: 'Practical AI projects', sortOrder: 3, isActive: true, createdAt: now, updatedAt: now },
    { id: 'cat-4', name: 'Tools & Tips', slug: 'tools', description: 'AI tools and productivity tips', sortOrder: 4, isActive: true, createdAt: now, updatedAt: now },
    { id: 'cat-5', name: 'Free Courses', slug: 'free', description: 'Free introductory courses', sortOrder: 5, isActive: true, createdAt: now, updatedAt: now },
  ]);

  // ==========================================
  // COURSES
  // ==========================================
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
      level: 4,
      totalDurationSeconds: 7200,
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
      level: 1,
      totalDurationSeconds: 3600,
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
      level: 5,
      totalDurationSeconds: 5400,
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
      level: 7,
      totalDurationSeconds: 4800,
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
      level: 6,
      totalDurationSeconds: 6000,
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
      level: 1,
      totalDurationSeconds: 2400,
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
      level: 8,
      totalDurationSeconds: 7200,
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
      level: 5,
      totalDurationSeconds: 5400,
      lessonCount: 6,
      isFeatured: false,
      isPublished: true,
      publishedAt: new Date('2026-02-01'),
      createdAt: new Date('2026-02-01'),
      updatedAt: now,
    },
  ]);

  // ==========================================
  // COURSE TAGS (Junction Table)
  // ==========================================
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

  // ==========================================
  // LESSONS
  // ==========================================
  db.lessons.createMany([
    // Course 1 lessons
    { id: 'l1-1', courseId: 'course-1', title: 'Course Introduction', description: 'Introduction to AI copywriting', durationSeconds: 300, videoUrl: '', sortOrder: 1, isPublished: true, hasResources: false, createdAt: now, updatedAt: now },
    { id: 'l1-2', courseId: 'course-1', title: 'AI Copywriting Fundamentals', description: 'Learn the basics of AI-assisted writing', durationSeconds: 900, videoUrl: '', sortOrder: 2, isPublished: true, hasResources: true, createdAt: now, updatedAt: now },
    { id: 'l1-3', courseId: 'course-1', title: 'Product Positioning Analysis', description: 'How to analyze and position your products', durationSeconds: 1200, videoUrl: '', sortOrder: 3, isPublished: true, hasResources: true, createdAt: now, updatedAt: now },
    // Course 2 lessons
    { id: 'l2-1', courseId: 'course-2', title: 'What is ChatGPT', description: 'Understanding ChatGPT basics', durationSeconds: 600, videoUrl: '', sortOrder: 1, isPublished: true, hasResources: false, createdAt: now, updatedAt: now },
    { id: 'l2-2', courseId: 'course-2', title: 'Basic Operations Guide', description: 'How to use ChatGPT effectively', durationSeconds: 800, videoUrl: '', sortOrder: 2, isPublished: true, hasResources: true, createdAt: now, updatedAt: now },
    // Course 3 lessons
    { id: 'l3-1', courseId: 'course-3', title: 'Image Generation Basics', description: 'Introduction to AI image generation', durationSeconds: 500, videoUrl: '', sortOrder: 1, isPublished: true, hasResources: false, createdAt: now, updatedAt: now },
    { id: 'l3-2', courseId: 'course-3', title: 'Getting Started with Midjourney', description: 'Your first Midjourney images', durationSeconds: 1200, videoUrl: '', sortOrder: 2, isPublished: true, hasResources: true, createdAt: now, updatedAt: now },
    // Course 4 lessons
    { id: 'l4-1', courseId: 'course-4', title: 'Prompt Structure Fundamentals', description: 'Understanding prompt architecture', durationSeconds: 600, videoUrl: '', sortOrder: 1, isPublished: true, hasResources: true, createdAt: now, updatedAt: now },
    { id: 'l4-2', courseId: 'course-4', title: 'Role Setting Techniques', description: 'Advanced role prompting', durationSeconds: 900, videoUrl: '', sortOrder: 2, isPublished: true, hasResources: true, createdAt: now, updatedAt: now },
    // Course 5 lessons
    { id: 'l5-1', courseId: 'course-5', title: 'Introduction to Automation', description: 'Why automation matters', durationSeconds: 400, videoUrl: '', sortOrder: 1, isPublished: true, hasResources: false, createdAt: now, updatedAt: now },
    { id: 'l5-2', courseId: 'course-5', title: 'Make.com Basics', description: 'Getting started with Make.com', durationSeconds: 1000, videoUrl: '', sortOrder: 2, isPublished: true, hasResources: true, createdAt: now, updatedAt: now },
    // Course 6 lessons
    { id: 'l6-1', courseId: 'course-6', title: 'Data Analysis Fundamentals', description: 'Basics of data analysis', durationSeconds: 500, videoUrl: '', sortOrder: 1, isPublished: true, hasResources: false, createdAt: now, updatedAt: now },
    { id: 'l6-2', courseId: 'course-6', title: 'Excel + AI', description: 'Combining Excel with AI tools', durationSeconds: 700, videoUrl: '', sortOrder: 2, isPublished: true, hasResources: true, createdAt: now, updatedAt: now },
    // Course 7 lessons
    { id: 'l7-1', courseId: 'course-7', title: 'Project Overview', description: 'What we will build', durationSeconds: 400, videoUrl: '', sortOrder: 1, isPublished: true, hasResources: false, createdAt: now, updatedAt: now },
    { id: 'l7-2', courseId: 'course-7', title: 'Requirements Analysis', description: 'Understanding customer needs', durationSeconds: 800, videoUrl: '', sortOrder: 2, isPublished: true, hasResources: true, createdAt: now, updatedAt: now },
    // Course 8 lessons
    { id: 'l8-1', courseId: 'course-8', title: 'Content Strategy Planning', description: 'Planning your content strategy', durationSeconds: 600, videoUrl: '', sortOrder: 1, isPublished: true, hasResources: true, createdAt: now, updatedAt: now },
    { id: 'l8-2', courseId: 'course-8', title: 'Blog Writing', description: 'AI-assisted blog writing', durationSeconds: 1000, videoUrl: '', sortOrder: 2, isPublished: true, hasResources: true, createdAt: now, updatedAt: now },
  ]);

  // ==========================================
  // LESSON RESOURCES
  // ==========================================
  db.lessonResources.createMany([
    { id: 'lr-1-2-1', lessonId: 'l1-2', title: 'Copywriting Templates', type: 'pdf', url: '/resources/copywriting-templates.pdf', sortOrder: 1, createdAt: now },
    { id: 'lr-1-3-1', lessonId: 'l1-3', title: 'Positioning Framework', type: 'pdf', url: '/resources/positioning.pdf', sortOrder: 1, createdAt: now },
    { id: 'lr-2-2-1', lessonId: 'l2-2', title: 'ChatGPT Cheat Sheet', type: 'pdf', url: '/resources/chatgpt-cheatsheet.pdf', sortOrder: 1, createdAt: now },
    { id: 'lr-3-2-1', lessonId: 'l3-2', title: 'Midjourney Prompts Collection', type: 'pdf', url: '/resources/mj-prompts.pdf', sortOrder: 1, createdAt: now },
    { id: 'lr-4-1-1', lessonId: 'l4-1', title: 'Prompt Structure Guide', type: 'pdf', url: '/resources/prompt-structure.pdf', sortOrder: 1, createdAt: now },
  ]);

  // ==========================================
  // USER COURSE ENROLLMENTS
  // ==========================================
  db.userCourseEnrollments.createMany([
    // Alex Chen (user-1) - 2 complete courses
    { id: 'enroll-1-1', userId: 'user-1', courseId: 'course-1', currentLessonId: 'l1-3', progressPercent: 100, isCompleted: true, completedAt: new Date('2026-01-10T16:00:00'), enrolledAt: new Date('2026-01-05'), lastAccessedAt: new Date('2026-01-10T16:00:00'), updatedAt: now },
    { id: 'enroll-1-2', userId: 'user-1', courseId: 'course-2', currentLessonId: 'l2-2', progressPercent: 100, isCompleted: true, completedAt: new Date('2026-01-08T10:00:00'), enrolledAt: new Date('2026-01-01'), lastAccessedAt: new Date('2026-01-08T10:00:00'), updatedAt: now },

    // Sarah Lin (user-2) - 4 courses
    { id: 'enroll-2-1', userId: 'user-2', courseId: 'course-1', currentLessonId: 'l1-3', progressPercent: 100, isCompleted: true, completedAt: new Date('2025-12-01T10:00:00'), enrolledAt: new Date('2025-11-20'), lastAccessedAt: new Date('2025-12-01T10:00:00'), updatedAt: now },
    { id: 'enroll-2-2', userId: 'user-2', courseId: 'course-2', currentLessonId: 'l2-2', progressPercent: 100, isCompleted: true, completedAt: new Date('2025-11-20T14:00:00'), enrolledAt: new Date('2025-11-15'), lastAccessedAt: new Date('2025-11-20T14:00:00'), updatedAt: now },
    { id: 'enroll-2-3', userId: 'user-2', courseId: 'course-3', currentLessonId: 'l3-2', progressPercent: 100, isCompleted: true, completedAt: new Date('2025-12-15T16:00:00'), enrolledAt: new Date('2025-12-10'), lastAccessedAt: new Date('2025-12-15T16:00:00'), updatedAt: now },
    { id: 'enroll-2-4', userId: 'user-2', courseId: 'course-4', currentLessonId: 'l4-1', progressPercent: 50, isCompleted: false, enrolledAt: new Date('2026-01-15'), lastAccessedAt: new Date('2026-01-19T09:00:00'), updatedAt: now },

    // Mike Wang (user-3) - 3 courses
    { id: 'enroll-3-1', userId: 'user-3', courseId: 'course-1', currentLessonId: 'l1-3', progressPercent: 100, isCompleted: true, completedAt: new Date('2026-01-05T10:00:00'), enrolledAt: new Date('2025-12-28'), lastAccessedAt: new Date('2026-01-05T10:00:00'), updatedAt: now },
    { id: 'enroll-3-2', userId: 'user-3', courseId: 'course-2', currentLessonId: 'l2-2', progressPercent: 100, isCompleted: true, completedAt: new Date('2025-12-20T14:00:00'), enrolledAt: new Date('2025-12-15'), lastAccessedAt: new Date('2025-12-20T14:00:00'), updatedAt: now },
    { id: 'enroll-3-3', userId: 'user-3', courseId: 'course-5', currentLessonId: 'l5-1', progressPercent: 60, isCompleted: false, enrolledAt: new Date('2026-01-12'), lastAccessedAt: new Date('2026-01-18T11:00:00'), updatedAt: now },

    // Emily Huang (user-4) - 5 courses
    { id: 'enroll-4-1', userId: 'user-4', courseId: 'course-1', currentLessonId: 'l1-3', progressPercent: 100, isCompleted: true, completedAt: new Date('2025-10-15T10:00:00'), enrolledAt: new Date('2025-10-10'), lastAccessedAt: new Date('2025-10-15T10:00:00'), updatedAt: now },
    { id: 'enroll-4-2', userId: 'user-4', courseId: 'course-2', currentLessonId: 'l2-2', progressPercent: 100, isCompleted: true, completedAt: new Date('2025-09-20T14:00:00'), enrolledAt: new Date('2025-09-15'), lastAccessedAt: new Date('2025-09-20T14:00:00'), updatedAt: now },
    { id: 'enroll-4-3', userId: 'user-4', courseId: 'course-3', currentLessonId: 'l3-2', progressPercent: 100, isCompleted: true, completedAt: new Date('2025-11-01T16:00:00'), enrolledAt: new Date('2025-10-25'), lastAccessedAt: new Date('2025-11-01T16:00:00'), updatedAt: now },
    { id: 'enroll-4-4', userId: 'user-4', courseId: 'course-4', currentLessonId: 'l4-2', progressPercent: 100, isCompleted: true, completedAt: new Date('2025-12-01T09:00:00'), enrolledAt: new Date('2025-11-20'), lastAccessedAt: new Date('2025-12-01T09:00:00'), updatedAt: now },
    { id: 'enroll-4-5', userId: 'user-4', courseId: 'course-5', currentLessonId: 'l5-1', progressPercent: 50, isCompleted: false, enrolledAt: new Date('2026-01-15'), lastAccessedAt: new Date('2026-01-20T11:00:00'), updatedAt: now },

    // Kevin Lee (user-5) - 1 course partial
    { id: 'enroll-5-1', userId: 'user-5', courseId: 'course-2', currentLessonId: 'l2-1', progressPercent: 50, isCompleted: false, enrolledAt: new Date('2026-01-18'), lastAccessedAt: new Date('2026-01-21T14:30:00'), updatedAt: now },

    // Jessica Wu (user-6) - 3 courses
    { id: 'enroll-6-1', userId: 'user-6', courseId: 'course-1', currentLessonId: 'l1-3', progressPercent: 100, isCompleted: true, completedAt: new Date('2026-01-12T10:00:00'), enrolledAt: new Date('2026-01-05'), lastAccessedAt: new Date('2026-01-12T10:00:00'), updatedAt: now },
    { id: 'enroll-6-2', userId: 'user-6', courseId: 'course-2', currentLessonId: 'l2-2', progressPercent: 100, isCompleted: true, completedAt: new Date('2026-01-05T14:00:00'), enrolledAt: new Date('2025-12-28'), lastAccessedAt: new Date('2026-01-05T14:00:00'), updatedAt: now },
    { id: 'enroll-6-3', userId: 'user-6', courseId: 'course-3', currentLessonId: 'l3-1', progressPercent: 50, isCompleted: false, enrolledAt: new Date('2026-01-15'), lastAccessedAt: new Date('2026-01-20T11:00:00'), updatedAt: now },

    // David Zhang (user-7) - free course only
    { id: 'enroll-7-1', userId: 'user-7', courseId: 'course-2', currentLessonId: 'l2-2', progressPercent: 100, isCompleted: true, completedAt: new Date('2026-01-18T10:00:00'), enrolledAt: new Date('2026-01-10'), lastAccessedAt: new Date('2026-01-18T10:00:00'), updatedAt: now },

    // Lisa Chen (user-8) - 2 courses
    { id: 'enroll-8-1', userId: 'user-8', courseId: 'course-1', currentLessonId: 'l1-1', progressPercent: 33, isCompleted: false, enrolledAt: new Date('2026-01-15'), lastAccessedAt: new Date('2026-01-19T15:00:00'), updatedAt: now },
    { id: 'enroll-8-2', userId: 'user-8', courseId: 'course-2', currentLessonId: 'l2-2', progressPercent: 100, isCompleted: true, completedAt: new Date('2026-01-17T10:00:00'), enrolledAt: new Date('2026-01-12'), lastAccessedAt: new Date('2026-01-17T10:00:00'), updatedAt: now },

    // Tom Huang (user-9) - 2 courses
    { id: 'enroll-9-1', userId: 'user-9', courseId: 'course-1', currentLessonId: 'l1-3', progressPercent: 100, isCompleted: true, completedAt: new Date('2026-01-08T10:00:00'), enrolledAt: new Date('2026-01-01'), lastAccessedAt: new Date('2026-01-08T10:00:00'), updatedAt: now },
    { id: 'enroll-9-2', userId: 'user-9', courseId: 'course-7', currentLessonId: 'l7-1', progressPercent: 70, isCompleted: false, enrolledAt: new Date('2026-01-15'), lastAccessedAt: new Date('2026-01-20T14:00:00'), updatedAt: now },

    // Amy Lin (user-10) - 6 courses
    { id: 'enroll-10-1', userId: 'user-10', courseId: 'course-1', currentLessonId: 'l1-3', progressPercent: 100, isCompleted: true, completedAt: new Date('2025-07-01T10:00:00'), enrolledAt: new Date('2025-06-20'), lastAccessedAt: new Date('2025-07-01T10:00:00'), updatedAt: now },
    { id: 'enroll-10-2', userId: 'user-10', courseId: 'course-2', currentLessonId: 'l2-2', progressPercent: 100, isCompleted: true, completedAt: new Date('2025-06-15T14:00:00'), enrolledAt: new Date('2025-06-10'), lastAccessedAt: new Date('2025-06-15T14:00:00'), updatedAt: now },
    { id: 'enroll-10-3', userId: 'user-10', courseId: 'course-3', currentLessonId: 'l3-2', progressPercent: 100, isCompleted: true, completedAt: new Date('2025-08-01T16:00:00'), enrolledAt: new Date('2025-07-25'), lastAccessedAt: new Date('2025-08-01T16:00:00'), updatedAt: now },
    { id: 'enroll-10-4', userId: 'user-10', courseId: 'course-4', currentLessonId: 'l4-2', progressPercent: 100, isCompleted: true, completedAt: new Date('2025-09-01T09:00:00'), enrolledAt: new Date('2025-08-20'), lastAccessedAt: new Date('2025-09-01T09:00:00'), updatedAt: now },
    { id: 'enroll-10-5', userId: 'user-10', courseId: 'course-5', currentLessonId: 'l5-2', progressPercent: 100, isCompleted: true, completedAt: new Date('2025-10-01T11:00:00'), enrolledAt: new Date('2025-09-20'), lastAccessedAt: new Date('2025-10-01T11:00:00'), updatedAt: now },
    { id: 'enroll-10-6', userId: 'user-10', courseId: 'course-6', currentLessonId: 'l6-2', progressPercent: 100, isCompleted: true, completedAt: new Date('2025-11-01T14:00:00'), enrolledAt: new Date('2025-10-25'), lastAccessedAt: new Date('2025-11-01T14:00:00'), updatedAt: now },
  ]);

  // ==========================================
  // USER COMPLETED LESSONS (Junction Table - 1NF)
  // ==========================================
  db.userCompletedLessons.createMany([
    // Alex Chen (user-1) completed lessons
    { id: 'ucl-1-1-1', userId: 'user-1', lessonId: 'l1-1', enrollmentId: 'enroll-1-1', completedAt: new Date('2026-01-08T10:00:00') },
    { id: 'ucl-1-1-2', userId: 'user-1', lessonId: 'l1-2', enrollmentId: 'enroll-1-1', completedAt: new Date('2026-01-09T10:00:00') },
    { id: 'ucl-1-1-3', userId: 'user-1', lessonId: 'l1-3', enrollmentId: 'enroll-1-1', completedAt: new Date('2026-01-10T16:00:00') },
    { id: 'ucl-1-2-1', userId: 'user-1', lessonId: 'l2-1', enrollmentId: 'enroll-1-2', completedAt: new Date('2026-01-07T10:00:00') },
    { id: 'ucl-1-2-2', userId: 'user-1', lessonId: 'l2-2', enrollmentId: 'enroll-1-2', completedAt: new Date('2026-01-08T10:00:00') },

    // Sarah Lin (user-2) completed lessons
    { id: 'ucl-2-1-1', userId: 'user-2', lessonId: 'l1-1', enrollmentId: 'enroll-2-1', completedAt: new Date('2025-11-25T10:00:00') },
    { id: 'ucl-2-1-2', userId: 'user-2', lessonId: 'l1-2', enrollmentId: 'enroll-2-1', completedAt: new Date('2025-11-28T10:00:00') },
    { id: 'ucl-2-1-3', userId: 'user-2', lessonId: 'l1-3', enrollmentId: 'enroll-2-1', completedAt: new Date('2025-12-01T10:00:00') },
    { id: 'ucl-2-2-1', userId: 'user-2', lessonId: 'l2-1', enrollmentId: 'enroll-2-2', completedAt: new Date('2025-11-18T14:00:00') },
    { id: 'ucl-2-2-2', userId: 'user-2', lessonId: 'l2-2', enrollmentId: 'enroll-2-2', completedAt: new Date('2025-11-20T14:00:00') },

    // Kevin Lee (user-5) partial progress
    { id: 'ucl-5-1-1', userId: 'user-5', lessonId: 'l2-1', enrollmentId: 'enroll-5-1', completedAt: new Date('2026-01-20T10:00:00') },
  ]);

  // ==========================================
  // USER LESSON PROGRESS
  // ==========================================
  db.userLessonProgress.createMany([
    // Kevin Lee (user-5) - partial progress
    { id: 'lp-5-1', userId: 'user-5', lessonId: 'l2-1', enrollmentId: 'enroll-5-1', watchedSeconds: 600, progressPercent: 100, isCompleted: true, completedAt: new Date('2026-01-20T10:00:00'), lastWatchedAt: new Date('2026-01-20T10:00:00'), createdAt: now, updatedAt: now },
    { id: 'lp-5-2', userId: 'user-5', lessonId: 'l2-2', enrollmentId: 'enroll-5-1', watchedSeconds: 320, progressPercent: 40, isCompleted: false, lastWatchedAt: new Date('2026-01-21T14:30:00'), createdAt: now, updatedAt: now },

    // Alex Chen (user-1) - complete
    { id: 'lp-1-1', userId: 'user-1', lessonId: 'l1-1', enrollmentId: 'enroll-1-1', watchedSeconds: 300, progressPercent: 100, isCompleted: true, completedAt: new Date('2026-01-08T10:00:00'), lastWatchedAt: new Date('2026-01-08T10:00:00'), createdAt: now, updatedAt: now },
    { id: 'lp-1-2', userId: 'user-1', lessonId: 'l1-2', enrollmentId: 'enroll-1-1', watchedSeconds: 900, progressPercent: 100, isCompleted: true, completedAt: new Date('2026-01-09T10:00:00'), lastWatchedAt: new Date('2026-01-09T10:00:00'), createdAt: now, updatedAt: now },
    { id: 'lp-1-3', userId: 'user-1', lessonId: 'l1-3', enrollmentId: 'enroll-1-1', watchedSeconds: 1200, progressPercent: 100, isCompleted: true, completedAt: new Date('2026-01-10T16:00:00'), lastWatchedAt: new Date('2026-01-10T16:00:00'), createdAt: now, updatedAt: now },
  ]);

  // ==========================================
  // COURSE REVIEWS
  // ==========================================
  db.courseReviews.createMany([
    { id: 'review-1', userId: 'user-1', courseId: 'course-1', rating: 5, title: 'Excellent course!', content: 'Really helped me understand AI copywriting fundamentals.', isVerifiedEnrollment: true, createdAt: new Date('2026-01-11'), updatedAt: now },
    { id: 'review-2', userId: 'user-2', courseId: 'course-1', rating: 4, title: 'Very informative', content: 'Great content, could use more examples.', isVerifiedEnrollment: true, createdAt: new Date('2025-12-02'), updatedAt: now },
    { id: 'review-3', userId: 'user-4', courseId: 'course-3', rating: 5, title: 'Mind-blowing!', content: 'The image generation techniques are amazing.', isVerifiedEnrollment: true, createdAt: new Date('2025-11-02'), updatedAt: now },
    { id: 'review-4', userId: 'user-7', courseId: 'course-2', rating: 5, title: 'Perfect for beginners', content: 'Very easy to follow and understand.', isVerifiedEnrollment: true, createdAt: new Date('2026-01-19'), updatedAt: now },
  ]);
}
