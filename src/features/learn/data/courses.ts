import type { Course, CourseCategory } from '@/features/learn/types';

export const COURSE_CATEGORIES: CourseCategory[] = [
  { id: 'cat-1', name: 'AI Basics', slug: 'ai-basics' },
  { id: 'cat-2', name: 'Advanced Applications', slug: 'advanced' },
  { id: 'cat-3', name: 'Hands-on Projects', slug: 'projects' },
  { id: 'cat-4', name: 'Tools & Tips', slug: 'tools' },
  { id: 'cat-5', name: 'Free Courses', slug: 'free' },
];

export const MOCK_COURSES: Course[] = [
  {
    id: 'course-1',
    title: 'AI Social Media Copywriter',
    subtitle: 'Write menu items, food stories, and event promotions like a pro',
    description: 'Transform "I don\'t know what to write, can\'t write anything unique, no one reads what I write" into a reusable copywriting workflow. From product positioning and target audience analysis to copywriting, systematically improve your copywriting skills.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800',
    trailer: 'https://www.youtube.com/watch?v=dLRdaUda8Ho',
    previewVideoUrl: 'https://sample-videos.com/video321/mp4/720/big_buck_bunny_720p_1mb.mp4',
    category: 'AI Basics',
    tags: ['ChatGPT', 'Perplexity', 'Copywriting'],
    instructor: { name: 'Luna', avatar: 'https://i.pravatar.cc/150?u=luna' },
    accessLevel: 'paid',
    lessons: [
      { id: 'l1-1', title: 'Course Introduction', duration: 300, videoUrl: '', accessLevel: 'first-chapter', order: 1 },
      { id: 'l1-2', title: 'AI Copywriting Fundamentals', duration: 900, videoUrl: '', accessLevel: 'paid', order: 2 },
      { id: 'l1-3', title: 'Product Positioning Analysis', duration: 1200, videoUrl: '', accessLevel: 'paid', order: 3 },
    ],
    totalDuration: 7200,
    lessonCount: 8,
    isFeatured: true,
    createdAt: new Date('2026-01-01'),
  },
  {
    id: 'course-2',
    title: 'ChatGPT Complete Beginner\'s Guide',
    subtitle: 'Learn AI conversations from scratch',
    description: 'This is a free course that takes you from the basics to understanding how to use ChatGPT and its techniques.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1676299081847-824916de030a?w=800',
    trailer: 'https://www.youtube.com/watch?v=dLRdaUda8Ho',
    category: 'Free Courses',
    tags: ['ChatGPT', 'Beginner'],
    instructor: { name: 'Max', avatar: 'https://i.pravatar.cc/150?u=max' },
    accessLevel: 'free',
    lessons: [
      { id: 'l2-1', title: 'What is ChatGPT', duration: 600, videoUrl: '', accessLevel: 'free', order: 1 },
      { id: 'l2-2', title: 'Basic Operations Guide', duration: 800, videoUrl: '', accessLevel: 'free', order: 2 },
    ],
    totalDuration: 3600,
    lessonCount: 5,
    isFeatured: true,
    createdAt: new Date('2026-01-05'),
  },
  {
    id: 'course-3',
    title: 'AI Image Generation Hands-on',
    subtitle: 'Complete Midjourney and DALL-E Tutorial',
    description: 'Learn how to use AI to generate high-quality images, from basic prompts to advanced techniques.',
    thumbnailUrl: '/images/courses/ai-art.png',
    trailer: 'https://www.youtube.com/watch?v=dLRdaUda8Ho',
    category: 'Advanced Applications',
    tags: ['Midjourney', 'DALL-E', 'Image Generation'],
    instructor: { name: 'Aria', avatar: 'https://i.pravatar.cc/150?u=aria' },
    accessLevel: 'paid',
    lessons: [
      { id: 'l3-1', title: 'Image Generation Basics', duration: 500, videoUrl: '', accessLevel: 'first-chapter', order: 1 },
      { id: 'l3-2', title: 'Getting Started with Midjourney', duration: 1200, videoUrl: '', accessLevel: 'paid', order: 2 },
    ],
    totalDuration: 5400,
    lessonCount: 6,
    isFeatured: true,
    createdAt: new Date('2026-01-10'),
  },
  {
    id: 'course-4',
    title: 'Prompt Engineering',
    subtitle: 'Advanced Prompt Engineering Techniques',
    description: 'Learn in-depth how to write effective prompts to get more precise results from AI.',
    thumbnailUrl: '/images/courses/prompt-engineering.png',
    trailer: 'https://www.youtube.com/watch?v=dLRdaUda8Ho',
    category: 'Advanced Applications',
    tags: ['Prompt', 'Advanced'],
    instructor: { name: 'Leo', avatar: 'https://i.pravatar.cc/150?u=leo' },
    accessLevel: 'paid',
    lessons: [
      { id: 'l4-1', title: 'Prompt Structure Fundamentals', duration: 600, videoUrl: '', accessLevel: 'first-chapter', order: 1 },
      { id: 'l4-2', title: 'Role Setting Techniques', duration: 900, videoUrl: '', accessLevel: 'paid', order: 2 },
    ],
    totalDuration: 4800,
    lessonCount: 7,
    isFeatured: false,
    createdAt: new Date('2026-01-15'),
  },
  {
    id: 'course-5',
    title: 'AI Automation Workflows',
    subtitle: 'Make.com and Zapier Integration Tutorial',
    description: 'Build your AI automation workflows and boost your productivity.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800',
    trailer: 'https://www.youtube.com/watch?v=dLRdaUda8Ho',
    category: 'Tools & Tips',
    tags: ['Automation', 'Make.com', 'Zapier'],
    instructor: { name: 'Nina', avatar: 'https://i.pravatar.cc/150?u=nina' },
    accessLevel: 'paid',
    lessons: [
      { id: 'l5-1', title: 'Introduction to Automation', duration: 400, videoUrl: '', accessLevel: 'first-chapter', order: 1 },
      { id: 'l5-2', title: 'Make.com Basics', duration: 1000, videoUrl: '', accessLevel: 'paid', order: 2 },
    ],
    totalDuration: 6000,
    lessonCount: 8,
    isFeatured: false,
    createdAt: new Date('2026-01-20'),
  },
  {
    id: 'course-6',
    title: 'AI Data Analysis for Beginners',
    subtitle: 'Quick data analysis with AI',
    description: 'Learn for free how to use AI tools for basic data analysis.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800',
    trailer: 'https://www.youtube.com/watch?v=dLRdaUda8Ho',
    category: 'Free Courses',
    tags: ['Data Analysis', 'Free'],
    instructor: { name: 'Sam', avatar: 'https://i.pravatar.cc/150?u=sam' },
    accessLevel: 'free',
    lessons: [
      { id: 'l6-1', title: 'Data Analysis Fundamentals', duration: 500, videoUrl: '', accessLevel: 'free', order: 1 },
      { id: 'l6-2', title: 'Excel + AI', duration: 700, videoUrl: '', accessLevel: 'free', order: 2 },
    ],
    totalDuration: 2400,
    lessonCount: 4,
    isFeatured: false,
    createdAt: new Date('2026-01-25'),
  },
  {
    id: 'course-7',
    title: 'AI Customer Service Bot Development',
    subtitle: 'Build an intelligent customer service assistant',
    description: 'Learn how to build an AI customer service bot and automate your customer service process.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1531746790731-6c087fecd65a?w=800',
    trailer: 'https://www.youtube.com/watch?v=dLRdaUda8Ho',
    category: 'Hands-on Projects',
    tags: ['Customer Service', 'Chatbot', 'Project'],
    instructor: { name: 'Jake', avatar: 'https://i.pravatar.cc/150?u=jake' },
    accessLevel: 'paid',
    lessons: [
      { id: 'l7-1', title: 'Project Overview', duration: 400, videoUrl: '', accessLevel: 'first-chapter', order: 1 },
      { id: 'l7-2', title: 'Requirements Analysis', duration: 800, videoUrl: '', accessLevel: 'paid', order: 2 },
    ],
    totalDuration: 7200,
    lessonCount: 10,
    isFeatured: true,
    createdAt: new Date('2026-01-28'),
  },
  {
    id: 'course-8',
    title: 'AI Content Creation Workshop',
    subtitle: 'Blogs, social media, and video scripts all in one',
    description: 'A hands-on content creation course that teaches you how to use AI to boost your creative efficiency.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800',
    trailer: 'https://www.youtube.com/watch?v=dLRdaUda8Ho',
    category: 'Hands-on Projects',
    tags: ['Content Creation', 'Hands-on'],
    instructor: { name: 'Mia', avatar: 'https://i.pravatar.cc/150?u=mia' },
    accessLevel: 'paid',
    lessons: [
      { id: 'l8-1', title: 'Content Strategy Planning', duration: 600, videoUrl: '', accessLevel: 'first-chapter', order: 1 },
      { id: 'l8-2', title: 'Blog Writing', duration: 1000, videoUrl: '', accessLevel: 'paid', order: 2 },
    ],
    totalDuration: 5400,
    lessonCount: 6,
    isFeatured: false,
    createdAt: new Date('2026-02-01'),
  },
];

export function getCoursesByCategory(category: string): Course[] {
  if (category === 'Free Courses') {
    return MOCK_COURSES.filter((c) => c.accessLevel === 'free');
  }
  return MOCK_COURSES.filter((c) => c.category === category);
}

export function getFeaturedCourses(): Course[] {
  return MOCK_COURSES.filter((c) => c.isFeatured);
}

export function getCourseById(id: string): Course | undefined {
  return MOCK_COURSES.find((c) => c.id === id);
}
