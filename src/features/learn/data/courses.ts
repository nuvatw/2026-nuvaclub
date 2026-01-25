import type { Course, CourseCategory, CourseLevel, CourseType, CourseTrack, Chapter, Lesson, Trailer } from '@/features/learn/types';

export const COURSE_CATEGORIES: CourseCategory[] = [
  { id: 'cat-1', name: 'AI Fundamentals', slug: 'ai-fundamentals' },
  { id: 'cat-2', name: 'ChatGPT & LLMs', slug: 'chatgpt-llms' },
  { id: 'cat-3', name: 'AI Art & Design', slug: 'ai-art' },
  { id: 'cat-4', name: 'Machine Learning', slug: 'machine-learning' },
  { id: 'cat-5', name: 'AI Development', slug: 'ai-development' },
  { id: 'cat-6', name: 'AI for Business', slug: 'ai-business' },
  { id: 'cat-7', name: 'AI Tools', slug: 'ai-tools' },
  { id: 'cat-8', name: 'Deep Learning', slug: 'deep-learning' },
  { id: 'cat-9', name: 'NLP & Text', slug: 'nlp' },
  { id: 'cat-10', name: 'Computer Vision', slug: 'computer-vision' },
];

// Pool of unique YouTube video IDs for demo (AI/tech educational content)
const YOUTUBE_VIDEO_POOL = [
  'aircAruvnKk', // 3Blue1Brown - Neural Networks
  'IHZwWFHWa-w', // 3Blue1Brown - Gradient Descent
  'Ilg3gGewQ5U', // 3Blue1Brown - Backpropagation
  'tIeHLnjs5U8', // 3Blue1Brown - Neural network 2
  'JTxsNm9IdYU', // ChatGPT introduction
  'ad79nYk2keg', // AI overview
  'kCc8FmEb1nY', // Andrej Karpathy - GPT from scratch
  'VMj-3S1tku0', // Deep Learning lecture
  'WXuK6gekU1Y', // Python for AI
  'rfscVS0vtbw', // Python Full Course
  'GwIo3gDZCVQ', // OpenAI API Tutorial
  '0kARDVL2nZg', // ChatGPT Tutorial
  'bQI5uDxrFfA', // Machine Learning basics
  'ukzFI9rgwfU', // ML for beginners
  'i_LwzRVP7bg', // Supervised learning
  'jHv63Uvk5VA', // AI Applications
  '_ZvnD96BVIs', // Prompt Engineering
  'sTeoEFzVNSc', // ChatGPT Tips
  'jC4v5AS4RIM', // AI Writing
  'uRQH2CFvedY', // AI Tools
  'VznoKyh6AXs', // AI for Students
  'YygA0b9yx2A', // Voice AI
  'PJXrs0uRCyw', // AI Photo Editing
  'SVcsDDABEkM', // AI Art Intro
  'qTgPSKKjfVg', // DALL-E
  'KzQn_3IAR30', // Image prompts
  'FW0x_PtTLNs', // AI styles
  'V2PN3XKrT7Q', // AI artwork
  'mJeNghZXtMo', // AI everyday
  '5dZ_lvDgevk', // Future of AI
];

// Helper to create chapters with lessons
function createChapters(
  courseId: string,
  chapterData: { title: string; lessons: { title: string; videoId: string; duration: number }[] }[]
): Chapter[] {
  return chapterData.map((chapter, chapterIndex) => ({
    id: `${courseId}-ch${chapterIndex + 1}`,
    title: chapter.title,
    lessons: chapter.lessons.map((lesson, lessonIndex) => ({
      id: `${courseId}-ch${chapterIndex + 1}-l${lessonIndex + 1}`,
      title: lesson.title,
      duration: lesson.duration,
      videoUrl: lesson.videoId,
      order: lessonIndex + 1,
    })),
  }));
}

// Tool tag mapping based on category - used for grouping Vava courses
const CATEGORY_TO_TOOL_TAG: Record<string, string[]> = {
  'AI Fundamentals': ['AI Basics'],
  'ChatGPT & LLMs': ['ChatGPT'],
  'AI Art & Design': ['AI Art'],
  'Machine Learning': ['Machine Learning'],
  'AI Development': ['AI Development'],
  'AI for Business': ['AI Business'],
  'AI Tools': ['AI Tools'],
  'Deep Learning': ['Deep Learning'],
  'NLP & Text': ['NLP'],
  'Computer Vision': ['Computer Vision'],
  'Nunu Training': ['Nunu'],
};

// Helper to create a course with proper chapter structure
function createCourse(
  id: string,
  title: string,
  subtitle: string,
  description: string,
  thumbnailUrl: string,
  category: string,
  tags: string[],
  level: CourseLevel,
  instructor: { name: string; avatar: string },
  trailer: Trailer,
  chapters: Chapter[],
  isFeatured: boolean,
  createdAt: Date,
  courseType: CourseType = 'vava',
  toolTags?: string[]
): Course {
  const allLessons = chapters.flatMap((ch) => ch.lessons);
  const totalDuration = allLessons.reduce((sum, l) => sum + l.duration, 0);

  // Determine tool tags: use provided or derive from category
  const finalToolTags = toolTags || (courseType === 'vava' ? CATEGORY_TO_TOOL_TAG[category] || [category] : undefined);

  return {
    id,
    title,
    subtitle,
    description,
    thumbnailUrl,
    trailer,
    category,
    tags,
    level,
    instructor,
    chapters,
    totalDuration,
    lessonCount: allLessons.length,
    isFeatured,
    createdAt,
    courseType,
    toolTags: finalToolTags,
    isFree: level === 1, // Level 1 courses are free
  };
}

// 100 AI Courses with Chapter-based structure (3 chapters × 5 lessons = 15 lessons per course)
export const MOCK_COURSES: Course[] = [
  // ==================== LEVEL 1 (FREE) - 15 Courses ====================
  createCourse(
    'c1',
    'Introduction to AI',
    'Your first step into artificial intelligence',
    'A beginner-friendly introduction to AI concepts, history, and real-world applications. No prior experience required.',
    'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800',
    'AI Fundamentals',
    ['AI', 'Beginner', 'Introduction'],
    1,
    { name: 'Dr. Sarah Chen', avatar: 'https://i.pravatar.cc/150?u=sarah' },
    { title: 'Course Trailer', youtubeId: 'ad79nYk2keg', duration: 120 },
    createChapters('c1', [
      {
        title: 'Chapter 1: AI Basics',
        lessons: [
          { title: 'What is Artificial Intelligence?', videoId: 'aircAruvnKk', duration: 720 },
          { title: 'Brief History of AI', videoId: 'IHZwWFHWa-w', duration: 900 },
          { title: 'Types of AI Systems', videoId: 'Ilg3gGewQ5U', duration: 840 },
          { title: 'AI vs Machine Learning', videoId: 'tIeHLnjs5U8', duration: 780 },
          { title: 'AI Terminology Guide', videoId: 'JTxsNm9IdYU', duration: 660 },
        ],
      },
      {
        title: 'Chapter 2: AI in Practice',
        lessons: [
          { title: 'AI in Everyday Life', videoId: 'kCc8FmEb1nY', duration: 720 },
          { title: 'AI in Healthcare', videoId: 'VMj-3S1tku0', duration: 900 },
          { title: 'AI in Finance', videoId: 'WXuK6gekU1Y', duration: 840 },
          { title: 'AI in Transportation', videoId: 'rfscVS0vtbw', duration: 780 },
          { title: 'AI in Entertainment', videoId: 'GwIo3gDZCVQ', duration: 660 },
        ],
      },
      {
        title: 'Chapter 3: Future of AI',
        lessons: [
          { title: 'Emerging AI Technologies', videoId: '0kARDVL2nZg', duration: 720 },
          { title: 'AI Ethics & Safety', videoId: 'bQI5uDxrFfA', duration: 900 },
          { title: 'AI Job Market', videoId: 'ukzFI9rgwfU', duration: 840 },
          { title: 'Learning AI Skills', videoId: 'i_LwzRVP7bg', duration: 780 },
          { title: 'Your AI Journey Begins', videoId: 'jHv63Uvk5VA', duration: 660 },
        ],
      },
    ]),
    true,
    new Date('2024-01-01')
  ),

  createCourse(
    'c2',
    'ChatGPT for Beginners',
    'Start using ChatGPT today',
    'Learn the basics of ChatGPT - from creating an account to writing your first prompts.',
    'https://images.unsplash.com/photo-1676299081847-824916de030a?w=800',
    'ChatGPT & LLMs',
    ['ChatGPT', 'Beginner', 'Free'],
    1,
    { name: 'Alex Kim', avatar: 'https://i.pravatar.cc/150?u=alex' },
    { title: 'Course Trailer', youtubeId: 'JTxsNm9IdYU', duration: 120 },
    createChapters('c2', [
      {
        title: 'Chapter 1: Getting Started',
        lessons: [
          { title: 'What is ChatGPT?', videoId: '_ZvnD96BVIs', duration: 600 },
          { title: 'Creating Your Account', videoId: 'sTeoEFzVNSc', duration: 720 },
          { title: 'The ChatGPT Interface', videoId: 'jC4v5AS4RIM', duration: 840 },
          { title: 'Your First Conversation', videoId: 'uRQH2CFvedY', duration: 780 },
          { title: 'Understanding Responses', videoId: 'VznoKyh6AXs', duration: 600 },
        ],
      },
      {
        title: 'Chapter 2: Basic Prompts',
        lessons: [
          { title: 'What is a Prompt?', videoId: 'YygA0b9yx2A', duration: 600 },
          { title: 'Writing Clear Prompts', videoId: 'aircAruvnKk', duration: 720 },
          { title: 'Asking Follow-up Questions', videoId: 'IHZwWFHWa-w', duration: 840 },
          { title: 'Getting Better Answers', videoId: 'Ilg3gGewQ5U', duration: 780 },
          { title: 'Common Prompt Mistakes', videoId: 'tIeHLnjs5U8', duration: 600 },
        ],
      },
      {
        title: 'Chapter 3: Practical Uses',
        lessons: [
          { title: 'Writing Emails with ChatGPT', videoId: 'kCc8FmEb1nY', duration: 600 },
          { title: 'Brainstorming Ideas', videoId: 'VMj-3S1tku0', duration: 720 },
          { title: 'Learning New Topics', videoId: 'WXuK6gekU1Y', duration: 840 },
          { title: 'Creative Writing Help', videoId: 'rfscVS0vtbw', duration: 780 },
          { title: 'Daily ChatGPT Habits', videoId: 'GwIo3gDZCVQ', duration: 600 },
        ],
      },
    ]),
    true,
    new Date('2024-01-05')
  ),

  createCourse(
    'c3',
    'AI Image Generation Basics',
    'Create AI art with simple prompts',
    'Introduction to AI image generation tools like DALL-E, Midjourney, and Stable Diffusion.',
    'https://images.unsplash.com/photo-1547891654-e66ed7ebb968?w=800',
    'AI Art & Design',
    ['AI Art', 'DALL-E', 'Beginner'],
    1,
    { name: 'Mia Johnson', avatar: 'https://i.pravatar.cc/150?u=mia' },
    { title: 'Course Trailer', youtubeId: 'SVcsDDABEkM', duration: 120 },
    createChapters('c3', [
      {
        title: 'Chapter 1: AI Art Introduction',
        lessons: [
          { title: 'What is AI Art?', videoId: 'qTgPSKKjfVg', duration: 720 },
          { title: 'Popular AI Art Tools', videoId: 'KzQn_3IAR30', duration: 900 },
          { title: 'How AI Creates Images', videoId: 'FW0x_PtTLNs', duration: 840 },
          { title: 'Setting Up Your Tools', videoId: 'V2PN3XKrT7Q', duration: 780 },
          { title: 'Your First AI Image', videoId: 'mJeNghZXtMo', duration: 660 },
        ],
      },
      {
        title: 'Chapter 2: Prompt Writing',
        lessons: [
          { title: 'Anatomy of a Good Prompt', videoId: '5dZ_lvDgevk', duration: 720 },
          { title: 'Describing Subjects', videoId: 'aircAruvnKk', duration: 900 },
          { title: 'Style and Mood Words', videoId: 'IHZwWFHWa-w', duration: 840 },
          { title: 'Negative Prompts', videoId: 'Ilg3gGewQ5U', duration: 780 },
          { title: 'Prompt Templates', videoId: 'tIeHLnjs5U8', duration: 660 },
        ],
      },
      {
        title: 'Chapter 3: Creating Art',
        lessons: [
          { title: 'Portrait Generation', videoId: 'JTxsNm9IdYU', duration: 720 },
          { title: 'Landscape Creation', videoId: 'kCc8FmEb1nY', duration: 900 },
          { title: 'Abstract Art', videoId: 'VMj-3S1tku0', duration: 840 },
          { title: 'Character Design', videoId: 'WXuK6gekU1Y', duration: 780 },
          { title: 'Sharing Your Creations', videoId: 'rfscVS0vtbw', duration: 660 },
        ],
      },
    ]),
    true,
    new Date('2024-01-10')
  ),

  createCourse(
    'c4',
    'Understanding Machine Learning',
    'ML concepts explained simply',
    'A non-technical introduction to machine learning concepts and terminology.',
    'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800',
    'Machine Learning',
    ['ML', 'Concepts', 'Beginner'],
    1,
    { name: 'Prof. David Lee', avatar: 'https://i.pravatar.cc/150?u=david' },
    { title: 'Course Trailer', youtubeId: 'ukzFI9rgwfU', duration: 120 },
    createChapters('c4', [
      {
        title: 'Chapter 1: ML Fundamentals',
        lessons: [
          { title: 'What is Machine Learning?', videoId: 'GwIo3gDZCVQ', duration: 780 },
          { title: 'ML vs Traditional Programming', videoId: '0kARDVL2nZg', duration: 900 },
          { title: 'Types of Machine Learning', videoId: 'bQI5uDxrFfA', duration: 720 },
          { title: 'Data in Machine Learning', videoId: 'i_LwzRVP7bg', duration: 840 },
          { title: 'ML Terminology', videoId: 'jHv63Uvk5VA', duration: 600 },
        ],
      },
      {
        title: 'Chapter 2: Learning Types',
        lessons: [
          { title: 'Supervised Learning', videoId: '_ZvnD96BVIs', duration: 780 },
          { title: 'Unsupervised Learning', videoId: 'sTeoEFzVNSc', duration: 900 },
          { title: 'Reinforcement Learning', videoId: 'jC4v5AS4RIM', duration: 720 },
          { title: 'Classification vs Regression', videoId: 'uRQH2CFvedY', duration: 840 },
          { title: 'Choosing the Right Approach', videoId: 'VznoKyh6AXs', duration: 600 },
        ],
      },
      {
        title: 'Chapter 3: ML Applications',
        lessons: [
          { title: 'Image Recognition', videoId: 'YygA0b9yx2A', duration: 780 },
          { title: 'Natural Language Processing', videoId: 'PJXrs0uRCyw', duration: 900 },
          { title: 'Recommendation Systems', videoId: 'SVcsDDABEkM', duration: 720 },
          { title: 'Fraud Detection', videoId: 'qTgPSKKjfVg', duration: 840 },
          { title: 'ML in Your Daily Life', videoId: 'KzQn_3IAR30', duration: 600 },
        ],
      },
    ]),
    false,
    new Date('2024-01-15')
  ),

  createCourse(
    'c5',
    'AI Writing Assistant Guide',
    'Write better with AI help',
    'Learn to use AI writing tools to improve your writing productivity.',
    'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800',
    'AI Tools',
    ['Writing', 'Productivity', 'Tools'],
    1,
    { name: 'Emma Davis', avatar: 'https://i.pravatar.cc/150?u=emma' },
    { title: 'Course Trailer', youtubeId: 'jC4v5AS4RIM', duration: 120 },
    createChapters('c5', [
      {
        title: 'Chapter 1: AI Writing Tools',
        lessons: [
          { title: 'Overview of AI Writing Tools', videoId: 'FW0x_PtTLNs', duration: 600 },
          { title: 'ChatGPT for Writing', videoId: 'V2PN3XKrT7Q', duration: 720 },
          { title: 'Claude for Writing', videoId: 'mJeNghZXtMo', duration: 900 },
          { title: 'Specialized Writing AIs', videoId: '5dZ_lvDgevk', duration: 780 },
          { title: 'Choosing Your Tools', videoId: 'aircAruvnKk', duration: 660 },
        ],
      },
      {
        title: 'Chapter 2: Writing Tasks',
        lessons: [
          { title: 'Email Writing', videoId: 'IHZwWFHWa-w', duration: 600 },
          { title: 'Blog Post Creation', videoId: 'Ilg3gGewQ5U', duration: 720 },
          { title: 'Social Media Content', videoId: 'tIeHLnjs5U8', duration: 900 },
          { title: 'Report Writing', videoId: 'JTxsNm9IdYU', duration: 780 },
          { title: 'Creative Writing', videoId: 'kCc8FmEb1nY', duration: 660 },
        ],
      },
      {
        title: 'Chapter 3: Best Practices',
        lessons: [
          { title: 'Editing AI Content', videoId: 'VMj-3S1tku0', duration: 600 },
          { title: 'Maintaining Your Voice', videoId: 'WXuK6gekU1Y', duration: 720 },
          { title: 'Fact-Checking AI Output', videoId: 'rfscVS0vtbw', duration: 900 },
          { title: 'Ethical Considerations', videoId: 'GwIo3gDZCVQ', duration: 780 },
          { title: 'Building a Workflow', videoId: '0kARDVL2nZg', duration: 660 },
        ],
      },
    ]),
    false,
    new Date('2024-01-20')
  ),

  // Additional Level 1 courses (simplified for brevity - all with proper 3x5 structure)
  ...generateSimplifiedCourses([
    { id: 'c6', title: 'AI for Students', subtitle: 'Study smarter with AI', category: 'AI Tools', level: 1, featured: false },
    { id: 'c7', title: 'Voice AI Basics', subtitle: 'Understanding voice assistants', category: 'AI Fundamentals', level: 1, featured: false },
    { id: 'c8', title: 'AI Photo Editing', subtitle: 'Enhance photos with AI', category: 'AI Art & Design', level: 1, featured: false },
    { id: 'c9', title: 'AI Chatbots 101', subtitle: 'Understanding conversational AI', category: 'ChatGPT & LLMs', level: 1, featured: false },
    { id: 'c10', title: 'AI in Social Media', subtitle: 'Leveraging AI for content', category: 'AI Tools', level: 1, featured: false },
    { id: 'c11', title: 'AI Ethics Primer', subtitle: 'Responsible AI usage', category: 'AI Fundamentals', level: 1, featured: false },
    { id: 'c12', title: 'AI Music Creation', subtitle: 'Make music with AI', category: 'AI Art & Design', level: 1, featured: false },
    { id: 'c13', title: 'AI Translation Tools', subtitle: 'Break language barriers', category: 'AI Tools', level: 1, featured: false },
    { id: 'c14', title: 'AI Search Tips', subtitle: 'Better results with AI', category: 'AI Tools', level: 1, featured: false },
    { id: 'c15', title: 'AI Coding Assistants', subtitle: 'Code faster with AI', category: 'AI Development', level: 1, featured: true },
  ]),

  // ==================== LEVEL 2-10 (PAID) ====================
  ...generateSimplifiedCourses([
    // Level 2
    { id: 'c16', title: 'Prompt Engineering Basics', subtitle: 'Master the art of prompting', category: 'ChatGPT & LLMs', level: 2, featured: true },
    { id: 'c17', title: 'AI Productivity Workflow', subtitle: 'Automate your daily tasks', category: 'AI Tools', level: 2, featured: false },
    { id: 'c18', title: 'DALL-E Masterclass', subtitle: 'Create stunning AI images', category: 'AI Art & Design', level: 2, featured: false },
    { id: 'c19', title: 'ML for Non-Coders', subtitle: 'Understand ML without code', category: 'Machine Learning', level: 2, featured: false },
    { id: 'c20', title: 'AI Content Strategy', subtitle: 'Plan content with AI help', category: 'AI for Business', level: 2, featured: false },

    // Level 3
    { id: 'c21', title: 'Advanced Prompt Techniques', subtitle: 'Chain prompts like a pro', category: 'ChatGPT & LLMs', level: 3, featured: true },
    { id: 'c22', title: 'Midjourney Deep Dive', subtitle: 'Master AI image generation', category: 'AI Art & Design', level: 3, featured: false },
    { id: 'c23', title: 'Python for AI', subtitle: 'Code your first AI project', category: 'AI Development', level: 3, featured: false },
    { id: 'c24', title: 'AI Data Analysis', subtitle: 'Analyze data with AI tools', category: 'AI for Business', level: 3, featured: false },
    { id: 'c25', title: 'NLP Fundamentals', subtitle: 'Understanding text AI', category: 'NLP & Text', level: 3, featured: false },

    // Level 4
    { id: 'c26', title: 'Building AI Agents', subtitle: 'Create autonomous AI systems', category: 'AI Development', level: 4, featured: true },
    { id: 'c27', title: 'Stable Diffusion Pro', subtitle: 'Advanced image generation', category: 'AI Art & Design', level: 4, featured: false },
    { id: 'c28', title: 'AI API Integration', subtitle: 'Connect AI to your apps', category: 'AI Development', level: 4, featured: false },
    { id: 'c29', title: 'ML Model Training', subtitle: 'Train your first model', category: 'Machine Learning', level: 4, featured: false },
    { id: 'c30', title: 'AI Business Automation', subtitle: 'Automate business processes', category: 'AI for Business', level: 4, featured: false },

    // Level 5
    { id: 'c31', title: 'LLM Fine-tuning', subtitle: 'Customize language models', category: 'Deep Learning', level: 5, featured: true },
    { id: 'c32', title: 'Computer Vision Intro', subtitle: 'Teach AI to see', category: 'Computer Vision', level: 5, featured: false },
    { id: 'c33', title: 'RAG Systems', subtitle: 'Retrieval-augmented generation', category: 'ChatGPT & LLMs', level: 5, featured: false },
    { id: 'c34', title: 'AI Project Management', subtitle: 'Lead AI initiatives', category: 'AI for Business', level: 5, featured: false },
    { id: 'c35', title: 'Text-to-Speech AI', subtitle: 'Create AI voices', category: 'NLP & Text', level: 5, featured: false },

    // Level 6
    { id: 'c36', title: 'Transformer Architecture', subtitle: 'Deep dive into transformers', category: 'Deep Learning', level: 6, featured: true },
    { id: 'c37', title: 'Object Detection', subtitle: 'Real-time object recognition', category: 'Computer Vision', level: 6, featured: false },
    { id: 'c38', title: 'AI Agents Framework', subtitle: 'Build multi-agent systems', category: 'AI Development', level: 6, featured: false },
    { id: 'c39', title: 'Semantic Search', subtitle: 'Intelligent search systems', category: 'NLP & Text', level: 6, featured: false },
    { id: 'c40', title: 'AI Product Design', subtitle: 'Design AI-first products', category: 'AI for Business', level: 6, featured: false },

    // Level 7
    { id: 'c41', title: 'Neural Network Design', subtitle: 'Architecture from scratch', category: 'Deep Learning', level: 7, featured: true },
    { id: 'c42', title: 'Image Segmentation', subtitle: 'Pixel-perfect AI vision', category: 'Computer Vision', level: 7, featured: false },
    { id: 'c43', title: 'Custom GPT Development', subtitle: 'Build your own ChatGPT', category: 'ChatGPT & LLMs', level: 7, featured: false },
    { id: 'c44', title: 'AI Ethics Advanced', subtitle: 'Complex ethical challenges', category: 'AI Fundamentals', level: 7, featured: false },
    { id: 'c45', title: 'Production ML Ops', subtitle: 'Deploy ML at scale', category: 'Machine Learning', level: 7, featured: false },

    // Level 8
    { id: 'c46', title: 'Attention Mechanisms', subtitle: 'The heart of modern AI', category: 'Deep Learning', level: 8, featured: true },
    { id: 'c47', title: '3D Vision AI', subtitle: 'Depth and spatial AI', category: 'Computer Vision', level: 8, featured: false },
    { id: 'c48', title: 'Multi-modal AI', subtitle: 'Text, image, and audio AI', category: 'AI Development', level: 8, featured: false },
    { id: 'c49', title: 'AI Research Methods', subtitle: 'Conduct AI research', category: 'AI Fundamentals', level: 8, featured: false },
    { id: 'c50', title: 'Enterprise AI Strategy', subtitle: 'AI at organization scale', category: 'AI for Business', level: 8, featured: false },

    // Level 9
    { id: 'c51', title: 'State-of-Art Models', subtitle: 'Cutting-edge architectures', category: 'Deep Learning', level: 9, featured: true },
    { id: 'c52', title: 'Video Understanding', subtitle: 'AI for video analysis', category: 'Computer Vision', level: 9, featured: false },
    { id: 'c53', title: 'Reasoning AI Systems', subtitle: 'Build AI that thinks', category: 'AI Development', level: 9, featured: false },
    { id: 'c54', title: 'AI Safety Research', subtitle: 'Ensuring safe AI systems', category: 'AI Fundamentals', level: 9, featured: false },
    { id: 'c55', title: 'Distributed Training', subtitle: 'Train on multiple GPUs', category: 'Machine Learning', level: 9, featured: false },

    // Level 10
    { id: 'c56', title: 'AGI Research Topics', subtitle: 'Towards general intelligence', category: 'AI Fundamentals', level: 10, featured: true },
    { id: 'c57', title: 'Neural Architecture Search', subtitle: 'AI designing AI', category: 'Deep Learning', level: 10, featured: false },
    { id: 'c58', title: 'Embodied AI', subtitle: 'AI with physical presence', category: 'AI Development', level: 10, featured: false },
    { id: 'c59', title: 'Consciousness in AI', subtitle: 'Philosophy meets AI', category: 'AI Fundamentals', level: 10, featured: false },
    { id: 'c60', title: 'AI Research Leadership', subtitle: 'Lead breakthrough research', category: 'AI for Business', level: 10, featured: false },
  ]),
];

// Helper to generate simplified courses with proper chapter structure
function generateSimplifiedCourses(
  courseConfigs: { id: string; title: string; subtitle: string; category: string; level: CourseLevel; featured: boolean; courseType?: CourseType }[]
): Course[] {
  const instructors = [
    { name: 'Dr. Sarah Chen', avatar: 'https://i.pravatar.cc/150?u=sarah' },
    { name: 'Alex Kim', avatar: 'https://i.pravatar.cc/150?u=alex' },
    { name: 'Mia Johnson', avatar: 'https://i.pravatar.cc/150?u=mia' },
    { name: 'Prof. David Lee', avatar: 'https://i.pravatar.cc/150?u=david' },
    { name: 'Emma Davis', avatar: 'https://i.pravatar.cc/150?u=emma' },
    { name: 'Dr. James Wilson', avatar: 'https://i.pravatar.cc/150?u=james' },
    { name: 'Lisa Wang', avatar: 'https://i.pravatar.cc/150?u=lisa' },
    { name: 'Mark Thompson', avatar: 'https://i.pravatar.cc/150?u=mark' },
    { name: 'Dr. Nina Patel', avatar: 'https://i.pravatar.cc/150?u=nina' },
    { name: 'Ryan Garcia', avatar: 'https://i.pravatar.cc/150?u=ryan' },
  ];

  const thumbnails = [
    // AI & Technology themed images - all unique
    'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800', // AI brain visualization
    'https://images.unsplash.com/photo-1593376893114-1aed528d80cf?w=800', // Robot hand
    'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800', // Robot face
    'https://images.unsplash.com/photo-1531746790731-6c087fecd65a?w=800', // AI chatbot
    'https://images.unsplash.com/photo-1516110833967-0b5716ca1387?w=800', // Digital network
    'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800', // Circuit board
    'https://images.unsplash.com/photo-1535378917042-10a22c95931a?w=800', // AI concept
    'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800', // Cybersecurity
    'https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=800', // Code on screen
    'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800', // Programming
    'https://images.unsplash.com/photo-1555255707-c07966088b7b?w=800', // Neural network
    'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800', // Server room
    'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800', // Digital earth
    'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=800', // Laptop code
    'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800', // MacBook code
    'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800', // Digital handshake
    'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800', // AI interface
    'https://images.unsplash.com/photo-1580894894513-541e068a3e2b?w=800', // Data visualization
    'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800', // Analytics dashboard
    'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800', // Data charts
    'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=800', // Dashboard
    'https://images.unsplash.com/photo-1551434678-e076c223a692?w=800', // Team coding
    'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800', // Team collaboration
    'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800', // Workshop
    'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800', // Team meeting
    'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800', // Coding laptop
    'https://images.unsplash.com/photo-1510915228340-29c85a43dcfe?w=800', // Developer
    'https://images.unsplash.com/photo-1537432376769-00f5c2f4c8d2?w=800', // Neon keyboard
    'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800', // Security lock
    'https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?w=800', // AI art abstract
    'https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=800', // AI generated art
    'https://images.unsplash.com/photo-1633412802994-5c058f151b66?w=800', // Metaverse
    'https://images.unsplash.com/photo-1617791160505-6f00504e3519?w=800', // VR headset
    'https://images.unsplash.com/photo-1592478411213-6153e4ebc07d?w=800', // 3D render
    'https://images.unsplash.com/photo-1605810230434-7631ac76ec81?w=800', // Video screens
    'https://images.unsplash.com/photo-1526378722484-bd91ca387e72?w=800', // Camera setup
    'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=800', // Podcast mic
    'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=800', // Music production
    'https://images.unsplash.com/photo-1558403194-611308249627?w=800', // Sound waves
    'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800', // Writing desk
    'https://images.unsplash.com/photo-1456324504439-367cee3b3c32?w=800', // Notebook
    'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800', // Study desk
    'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=800', // Books stack
    'https://images.unsplash.com/photo-1456406644174-8ddd4cd52a06?w=800', // Learning
    'https://images.unsplash.com/photo-1532619675605-1ede6c2ed2b0?w=800', // Whiteboard
    'https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=800', // Laptop glow
    'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800', // Tech team
    'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800', // Minimal laptop
    'https://images.unsplash.com/photo-1483058712412-4245e9b90334?w=800', // Workspace
    'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=800', // MacBook minimal
    'https://images.unsplash.com/photo-1587620962725-abab7fe55159?w=800', // Code dark
    'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=800', // Python code
    'https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=800', // Code syntax
    'https://images.unsplash.com/photo-1607799279861-4dd421887fb3?w=800', // GitHub code
  ];

  return courseConfigs.map((config, index) => {
    const instructor = instructors[index % instructors.length];
    const thumbnail = thumbnails[index % thumbnails.length];
    const trailerIndex = index % YOUTUBE_VIDEO_POOL.length;

    // Create 3 chapters with 5 lessons each, using rotating video IDs
    const chapters = createChapters(config.id, [
      {
        title: 'Chapter 1: Foundations',
        lessons: Array.from({ length: 5 }, (_, i) => ({
          title: `Lesson ${i + 1}: Foundation Topic ${i + 1}`,
          videoId: YOUTUBE_VIDEO_POOL[(index * 15 + i) % YOUTUBE_VIDEO_POOL.length],
          duration: 600 + (i * 60),
        })),
      },
      {
        title: 'Chapter 2: Core Concepts',
        lessons: Array.from({ length: 5 }, (_, i) => ({
          title: `Lesson ${i + 1}: Core Topic ${i + 1}`,
          videoId: YOUTUBE_VIDEO_POOL[(index * 15 + 5 + i) % YOUTUBE_VIDEO_POOL.length],
          duration: 600 + (i * 60),
        })),
      },
      {
        title: 'Chapter 3: Advanced Topics',
        lessons: Array.from({ length: 5 }, (_, i) => ({
          title: `Lesson ${i + 1}: Advanced Topic ${i + 1}`,
          videoId: YOUTUBE_VIDEO_POOL[(index * 15 + 10 + i) % YOUTUBE_VIDEO_POOL.length],
          duration: 600 + (i * 60),
        })),
      },
    ]);

    return createCourse(
      config.id,
      config.title,
      config.subtitle,
      `A comprehensive course on ${config.title.toLowerCase()}. Perfect for learners at ${
        config.level === 1 ? 'beginner' : config.level <= 3 ? 'beginner to intermediate' : config.level <= 6 ? 'intermediate' : 'advanced'
      } level.`,
      thumbnail,
      config.category,
      [config.category, config.level === 1 ? 'Free' : 'Premium'],
      config.level,
      instructor,
      { title: 'Course Trailer', youtubeId: YOUTUBE_VIDEO_POOL[trailerIndex], duration: 120 },
      chapters,
      config.featured,
      new Date(`2024-0${Math.min(9, Math.floor(index / 10) + 1)}-${String((index % 28) + 1).padStart(2, '0')}`),
      config.courseType || 'vava' // Default to vava for learner courses
    );
  });
}

// Re-export helper functions
export function getCoursesByCategory(category: string): Course[] {
  return MOCK_COURSES.filter((course) => course.category === category);
}

export function getCoursesByLevel(level: CourseLevel): Course[] {
  return MOCK_COURSES.filter((course) => course.level === level);
}

export function getFreeCourses(): Course[] {
  return MOCK_COURSES.filter((course) => course.level === 1);
}

export function getFeaturedCourses(): Course[] {
  return MOCK_COURSES.filter((course) => course.isFeatured);
}

export function getCourseById(id: string): Course | undefined {
  return MOCK_COURSES.find((course) => course.id === id);
}

export function getAllCourses(): Course[] {
  return MOCK_COURSES;
}

export function getRecentCourses(limit: number = 10): Course[] {
  return [...MOCK_COURSES]
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice(0, limit);
}

export function searchCourses(query: string): Course[] {
  const lowerQuery = query.toLowerCase();
  return MOCK_COURSES.filter(
    (course) =>
      course.title.toLowerCase().includes(lowerQuery) ||
      course.subtitle.toLowerCase().includes(lowerQuery) ||
      course.description.toLowerCase().includes(lowerQuery) ||
      course.category.toLowerCase().includes(lowerQuery) ||
      course.tags.some((tag) => tag.toLowerCase().includes(lowerQuery))
  );
}

// Legacy compatibility - create a flat lessons getter
export function getCourseLessons(course: Course): Lesson[] {
  return course.chapters.flatMap((chapter) => chapter.lessons);
}

// ==================== VERIFIED NUNU REQUIRED COURSES ====================
// These 5 courses are required for Verified Nunu certification
// They focus on mentorship, teaching, and Nunu-specific skills

const VERIFIED_NUNU_COURSES: Course[] = [
  {
    id: 'nunu-v1',
    title: 'Mentorship Fundamentals',
    subtitle: 'The art of guiding AI learners',
    description: 'Learn the core principles of effective mentorship. Understand how to guide learners, provide constructive feedback, and create personalized learning paths. Required for Verified Nunu certification.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800',
    trailer: { title: 'Course Trailer', youtubeId: 'aircAruvnKk', duration: 120 },
    category: 'Nunu Training',
    tags: ['Nunu', 'Mentorship', 'Teaching', 'Verified Required'],
    level: 3 as CourseLevel,
    instructor: { name: 'Shang-Zhe Liu', avatar: 'https://i.pravatar.cc/150?u=shangzhe' },
    chapters: [
      {
        id: 'nunu-v1-ch1',
        title: 'Chapter 1: Mentorship Basics',
        lessons: [
          { id: 'nunu-v1-ch1-l1', title: 'What Makes a Great Mentor?', order: 1, videoUrl: 'aircAruvnKk', duration: 720 },
          { id: 'nunu-v1-ch1-l2', title: 'Understanding Your Mentee', order: 2, videoUrl: 'IHZwWFHWa-w', duration: 660 },
          { id: 'nunu-v1-ch1-l3', title: 'Setting Expectations', order: 3, videoUrl: 'Ilg3gGewQ5U', duration: 600 },
        ],
      },
      {
        id: 'nunu-v1-ch2',
        title: 'Chapter 2: Communication Skills',
        lessons: [
          { id: 'nunu-v1-ch2-l1', title: 'Active Listening', order: 1, videoUrl: 'tIeHLnjs5U8', duration: 720 },
          { id: 'nunu-v1-ch2-l2', title: 'Constructive Feedback', order: 2, videoUrl: 'JTxsNm9IdYU', duration: 660 },
          { id: 'nunu-v1-ch2-l3', title: 'Handling Difficult Conversations', order: 3, videoUrl: 'kCc8FmEb1nY', duration: 600 },
        ],
      },
    ],
    totalDuration: 3960,
    lessonCount: 6,
    isFeatured: false,
    createdAt: new Date('2025-01-15'),
    courseType: 'nunu',
    track: 'nunu',
    verifiedRequired: true,
    isFree: false,
  },
  {
    id: 'nunu-v2',
    title: 'Teaching AI Effectively',
    subtitle: 'Pedagogy for AI educators',
    description: 'Master the techniques for teaching AI concepts to learners at all levels. From explaining complex concepts simply to creating engaging learning experiences. Required for Verified Nunu certification.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800',
    trailer: { title: 'Course Trailer', youtubeId: 'VMj-3S1tku0', duration: 120 },
    category: 'Nunu Training',
    tags: ['Nunu', 'Teaching', 'Pedagogy', 'Verified Required'],
    level: 4 as CourseLevel,
    instructor: { name: 'Dr. Sarah Chen', avatar: 'https://i.pravatar.cc/150?u=sarah' },
    chapters: [
      {
        id: 'nunu-v2-ch1',
        title: 'Chapter 1: AI Pedagogy',
        lessons: [
          { id: 'nunu-v2-ch1-l1', title: 'How Adults Learn AI', order: 1, videoUrl: 'WXuK6gekU1Y', duration: 720 },
          { id: 'nunu-v2-ch1-l2', title: 'Scaffolding Complex Concepts', order: 2, videoUrl: 'rfscVS0vtbw', duration: 660 },
          { id: 'nunu-v2-ch1-l3', title: 'Hands-On Learning Design', order: 3, videoUrl: 'GwIo3gDZCVQ', duration: 600 },
        ],
      },
      {
        id: 'nunu-v2-ch2',
        title: 'Chapter 2: Practical Teaching',
        lessons: [
          { id: 'nunu-v2-ch2-l1', title: 'Creating Learning Paths', order: 1, videoUrl: '0kARDVL2nZg', duration: 720 },
          { id: 'nunu-v2-ch2-l2', title: 'Assessment Strategies', order: 2, videoUrl: 'bQI5uDxrFfA', duration: 660 },
          { id: 'nunu-v2-ch2-l3', title: 'Adapting to Learning Styles', order: 3, videoUrl: 'ukzFI9rgwfU', duration: 600 },
        ],
      },
    ],
    totalDuration: 3960,
    lessonCount: 6,
    isFeatured: false,
    createdAt: new Date('2025-01-16'),
    courseType: 'nunu',
    track: 'nunu',
    verifiedRequired: true,
    isFree: false,
  },
  {
    id: 'nunu-v3',
    title: 'Nunu Ethics & Standards',
    subtitle: 'Professional conduct for mentors',
    description: 'Understand the ethical responsibilities of being a Nunu mentor. Learn about boundaries, confidentiality, and maintaining professional standards. Required for Verified Nunu certification.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800',
    trailer: { title: 'Course Trailer', youtubeId: 'i_LwzRVP7bg', duration: 120 },
    category: 'Nunu Training',
    tags: ['Nunu', 'Ethics', 'Standards', 'Verified Required'],
    level: 3 as CourseLevel,
    instructor: { name: 'Prof. David Lee', avatar: 'https://i.pravatar.cc/150?u=david' },
    chapters: [
      {
        id: 'nunu-v3-ch1',
        title: 'Chapter 1: Ethical Foundations',
        lessons: [
          { id: 'nunu-v3-ch1-l1', title: 'The Nunu Code of Conduct', order: 1, videoUrl: 'jHv63Uvk5VA', duration: 720 },
          { id: 'nunu-v3-ch1-l2', title: 'Boundaries in Mentorship', order: 2, videoUrl: 'aircAruvnKk', duration: 660 },
          { id: 'nunu-v3-ch1-l3', title: 'Confidentiality & Trust', order: 3, videoUrl: 'IHZwWFHWa-w', duration: 600 },
        ],
      },
      {
        id: 'nunu-v3-ch2',
        title: 'Chapter 2: Professional Practice',
        lessons: [
          { id: 'nunu-v3-ch2-l1', title: 'Handling Conflicts', order: 1, videoUrl: 'Ilg3gGewQ5U', duration: 720 },
          { id: 'nunu-v3-ch2-l2', title: 'Fair & Inclusive Mentoring', order: 2, videoUrl: 'tIeHLnjs5U8', duration: 660 },
          { id: 'nunu-v3-ch2-l3', title: 'Quality Standards', order: 3, videoUrl: 'JTxsNm9IdYU', duration: 600 },
        ],
      },
    ],
    totalDuration: 3960,
    lessonCount: 6,
    isFeatured: false,
    createdAt: new Date('2025-01-17'),
    courseType: 'nunu',
    track: 'nunu',
    verifiedRequired: true,
    isFree: false,
  },
  {
    id: 'nunu-v4',
    title: 'Building Vava Success',
    subtitle: 'Maximize mentee outcomes',
    description: 'Learn strategies for helping your Vavas achieve their AI learning goals. Track progress, celebrate wins, and navigate setbacks together. Required for Verified Nunu certification.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800',
    trailer: { title: 'Course Trailer', youtubeId: 'kCc8FmEb1nY', duration: 120 },
    category: 'Nunu Training',
    tags: ['Nunu', 'Coaching', 'Success', 'Verified Required'],
    level: 4 as CourseLevel,
    instructor: { name: 'Emma Davis', avatar: 'https://i.pravatar.cc/150?u=emma' },
    chapters: [
      {
        id: 'nunu-v4-ch1',
        title: 'Chapter 1: Goal Setting',
        lessons: [
          { id: 'nunu-v4-ch1-l1', title: 'Understanding Vava Goals', order: 1, videoUrl: 'VMj-3S1tku0', duration: 720 },
          { id: 'nunu-v4-ch1-l2', title: 'Creating SMART Objectives', order: 2, videoUrl: 'WXuK6gekU1Y', duration: 660 },
          { id: 'nunu-v4-ch1-l3', title: 'Milestone Planning', order: 3, videoUrl: 'rfscVS0vtbw', duration: 600 },
        ],
      },
      {
        id: 'nunu-v4-ch2',
        title: 'Chapter 2: Progress Tracking',
        lessons: [
          { id: 'nunu-v4-ch2-l1', title: 'Measuring Growth', order: 1, videoUrl: 'GwIo3gDZCVQ', duration: 720 },
          { id: 'nunu-v4-ch2-l2', title: 'Celebrating Wins', order: 2, videoUrl: '0kARDVL2nZg', duration: 660 },
          { id: 'nunu-v4-ch2-l3', title: 'Overcoming Setbacks', order: 3, videoUrl: 'bQI5uDxrFfA', duration: 600 },
        ],
      },
    ],
    totalDuration: 3960,
    lessonCount: 6,
    isFeatured: false,
    createdAt: new Date('2025-01-18'),
    courseType: 'nunu',
    track: 'nunu',
    verifiedRequired: true,
    isFree: false,
  },
  {
    id: 'nunu-v5',
    title: 'Advanced Nunu Practices',
    subtitle: 'Expert-level mentorship',
    description: 'Take your Nunu skills to the next level. Learn advanced coaching techniques, handle complex situations, and develop your own mentorship style. Required for Verified Nunu certification.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800',
    trailer: { title: 'Course Trailer', youtubeId: 'ukzFI9rgwfU', duration: 120 },
    category: 'Nunu Training',
    tags: ['Nunu', 'Advanced', 'Expert', 'Verified Required'],
    level: 5 as CourseLevel,
    instructor: { name: 'Shang-Zhe Liu', avatar: 'https://i.pravatar.cc/150?u=shangzhe' },
    chapters: [
      {
        id: 'nunu-v5-ch1',
        title: 'Chapter 1: Advanced Techniques',
        lessons: [
          { id: 'nunu-v5-ch1-l1', title: 'Coaching High-Performers', order: 1, videoUrl: 'i_LwzRVP7bg', duration: 720 },
          { id: 'nunu-v5-ch1-l2', title: 'Mentoring Across Disciplines', order: 2, videoUrl: 'jHv63Uvk5VA', duration: 660 },
          { id: 'nunu-v5-ch1-l3', title: 'Group Mentoring Sessions', order: 3, videoUrl: 'aircAruvnKk', duration: 600 },
        ],
      },
      {
        id: 'nunu-v5-ch2',
        title: 'Chapter 2: Your Nunu Journey',
        lessons: [
          { id: 'nunu-v5-ch2-l1', title: 'Developing Your Style', order: 1, videoUrl: 'IHZwWFHWa-w', duration: 720 },
          { id: 'nunu-v5-ch2-l2', title: 'Building Your Reputation', order: 2, videoUrl: 'Ilg3gGewQ5U', duration: 660 },
          { id: 'nunu-v5-ch2-l3', title: 'The Path to Super Nunu', order: 3, videoUrl: 'tIeHLnjs5U8', duration: 600 },
        ],
      },
    ],
    totalDuration: 3960,
    lessonCount: 6,
    isFeatured: true,
    createdAt: new Date('2025-01-19'),
    courseType: 'nunu',
    track: 'nunu',
    verifiedRequired: true,
    isFree: false,
  },
];

// Add Verified Nunu courses to the main course list
MOCK_COURSES.push(...VERIFIED_NUNU_COURSES);

// ==================== 6 REQUIRED SERIES (10 COURSES EACH) ====================
// These series are ALWAYS shown on the Learn page in this exact order:
// 1. ChatGPT series (10)
// 2. Make series (10)
// 3. n8n series (10)
// 4. Midjourney series (10)
// 5. Stable Diffusion series (10)
// 6. Gemini series (10)
//
// Each series has exactly 1 free course (level 1, isFree: true)

const SERIES_CONFIGS = [
  {
    id: 'chatgpt',
    name: 'ChatGPT',
    toolTag: 'ChatGPT',
    courses: [
      { title: 'ChatGPT for Complete Beginners', subtitle: 'Your first AI conversation', free: true },
      { title: 'ChatGPT Prompt Mastery', subtitle: 'Write prompts that get results' },
      { title: 'ChatGPT for Writing', subtitle: 'Create content with AI assistance' },
      { title: 'ChatGPT for Business', subtitle: 'Automate your daily work tasks' },
      { title: 'ChatGPT for Developers', subtitle: 'Code faster with AI pair programming' },
      { title: 'ChatGPT Advanced Techniques', subtitle: 'Chain prompts and build workflows' },
      { title: 'ChatGPT API Integration', subtitle: 'Build apps with OpenAI API' },
      { title: 'ChatGPT for Education', subtitle: 'Learning and teaching with AI' },
      { title: 'ChatGPT Plugins & GPTs', subtitle: 'Extend ChatGPT capabilities' },
      { title: 'ChatGPT for Research', subtitle: 'Academic research with AI assistance' },
    ],
  },
  {
    id: 'make',
    name: 'Make',
    toolTag: 'Make',
    courses: [
      { title: 'Make.com Fundamentals', subtitle: 'Visual automation for beginners', free: true },
      { title: 'Make Scenarios Deep Dive', subtitle: 'Build complex automation workflows' },
      { title: 'Make + AI Integrations', subtitle: 'Connect AI tools with Make' },
      { title: 'Make for E-commerce', subtitle: 'Automate your online store' },
      { title: 'Make Data Processing', subtitle: 'Transform and route data automatically' },
      { title: 'Make for Marketing', subtitle: 'Automate campaigns and leads' },
      { title: 'Make Error Handling', subtitle: 'Build robust, reliable automations' },
      { title: 'Make Advanced Patterns', subtitle: 'Professional automation architecture' },
      { title: 'Make + CRM Automation', subtitle: 'Sales pipeline automation' },
      { title: 'Make Enterprise Solutions', subtitle: 'Scale automation across teams' },
    ],
  },
  {
    id: 'n8n',
    name: 'n8n',
    toolTag: 'n8n',
    courses: [
      { title: 'n8n Getting Started', subtitle: 'Self-hosted automation basics', free: true },
      { title: 'n8n Workflow Design', subtitle: 'Create powerful automation flows' },
      { title: 'n8n + AI Workflows', subtitle: 'Build AI-powered automations' },
      { title: 'n8n for DevOps', subtitle: 'Automate your development pipeline' },
      { title: 'n8n Data Transformation', subtitle: 'Process and transform any data' },
      { title: 'n8n Custom Nodes', subtitle: 'Extend n8n with your own integrations' },
      { title: 'n8n Self-Hosting Guide', subtitle: 'Deploy and manage your own instance' },
      { title: 'n8n Security Best Practices', subtitle: 'Secure your automation workflows' },
      { title: 'n8n + Database Integration', subtitle: 'Connect to any database system' },
      { title: 'n8n Production Deployment', subtitle: 'Scale n8n for enterprise use' },
    ],
  },
  {
    id: 'midjourney',
    name: 'Midjourney',
    toolTag: 'Midjourney',
    courses: [
      { title: 'Midjourney for Beginners', subtitle: 'Create stunning AI art today', free: true },
      { title: 'Midjourney Prompt Engineering', subtitle: 'Master the art of AI prompts' },
      { title: 'Midjourney Styles & Aesthetics', subtitle: 'Achieve any artistic style' },
      { title: 'Midjourney for Designers', subtitle: 'Professional design workflows' },
      { title: 'Midjourney Character Design', subtitle: 'Create consistent characters' },
      { title: 'Midjourney Environments', subtitle: 'Build immersive worlds' },
      { title: 'Midjourney for Marketing', subtitle: 'Create marketing visuals' },
      { title: 'Midjourney Advanced Parameters', subtitle: 'Master every setting' },
      { title: 'Midjourney Inpainting & Editing', subtitle: 'Refine and modify images' },
      { title: 'Midjourney Professional Workflows', subtitle: 'From concept to final asset' },
    ],
  },
  {
    id: 'stable-diffusion',
    name: 'Stable Diffusion',
    toolTag: 'Stable Diffusion',
    courses: [
      { title: 'Stable Diffusion Basics', subtitle: 'Open-source AI art generation', free: true },
      { title: 'Stable Diffusion WebUI', subtitle: 'Master the AUTOMATIC1111 interface' },
      { title: 'SD Model Training', subtitle: 'Train custom models and LoRAs' },
      { title: 'ControlNet Mastery', subtitle: 'Precise control over AI generation' },
      { title: 'SD for Concept Art', subtitle: 'Professional concept workflows' },
      { title: 'SD Upscaling & Enhancement', subtitle: 'Create high-resolution artwork' },
      { title: 'ComfyUI Workflows', subtitle: 'Node-based generation pipelines' },
      { title: 'SD Animation & Video', subtitle: 'Create AI-powered animations' },
      { title: 'SD for Game Assets', subtitle: 'Generate game art and textures' },
      { title: 'SD Production Pipeline', subtitle: 'Enterprise AI art workflow' },
    ],
  },
  {
    id: 'gemini',
    name: 'Gemini',
    toolTag: 'Gemini',
    courses: [
      { title: 'Gemini Introduction', subtitle: 'Google\'s multimodal AI', free: true },
      { title: 'Gemini for Productivity', subtitle: 'Enhance your daily workflow' },
      { title: 'Gemini + Google Workspace', subtitle: 'AI in Docs, Sheets, and more' },
      { title: 'Gemini API Development', subtitle: 'Build with Gemini API' },
      { title: 'Gemini Vision & Images', subtitle: 'Multimodal AI applications' },
      { title: 'Gemini for Analysis', subtitle: 'Data analysis with AI' },
      { title: 'Gemini vs ChatGPT', subtitle: 'Choose the right tool' },
      { title: 'Gemini Advanced Features', subtitle: 'Power user techniques' },
      { title: 'Gemini for Education', subtitle: 'Learning with Google AI' },
      { title: 'Gemini Enterprise Integration', subtitle: 'Deploy AI across your org' },
    ],
  },
];

// Generate the 60 series courses
const SERIES_COURSES: Course[] = [];

SERIES_CONFIGS.forEach((series, seriesIndex) => {
  series.courses.forEach((courseConfig, courseIndex) => {
    const courseId = `${series.id}-${courseIndex + 1}`;
    const isFree = courseConfig.free === true;
    const level = isFree ? 1 : (Math.min(10, Math.floor(courseIndex / 2) + 2) as CourseLevel);

    const instructors = [
      { name: 'Dr. Sarah Chen', avatar: 'https://i.pravatar.cc/150?u=sarah' },
      { name: 'Alex Kim', avatar: 'https://i.pravatar.cc/150?u=alex' },
      { name: 'Mia Johnson', avatar: 'https://i.pravatar.cc/150?u=mia' },
      { name: 'Prof. David Lee', avatar: 'https://i.pravatar.cc/150?u=david' },
      { name: 'Emma Davis', avatar: 'https://i.pravatar.cc/150?u=emma' },
      { name: 'Dr. James Wilson', avatar: 'https://i.pravatar.cc/150?u=james' },
    ];

    const thumbnails = [
      'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800',
      'https://images.unsplash.com/photo-1676299081847-824916de030a?w=800',
      'https://images.unsplash.com/photo-1547891654-e66ed7ebb968?w=800',
      'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800',
      'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800',
      'https://images.unsplash.com/photo-1593376893114-1aed528d80cf?w=800',
      'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800',
      'https://images.unsplash.com/photo-1531746790731-6c087fecd65a?w=800',
      'https://images.unsplash.com/photo-1516110833967-0b5716ca1387?w=800',
      'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800',
    ];

    const course: Course = {
      id: courseId,
      title: courseConfig.title,
      subtitle: courseConfig.subtitle,
      description: `A comprehensive course on ${courseConfig.title.toLowerCase()}. Part of the ${series.name} series.`,
      thumbnailUrl: thumbnails[(seriesIndex * 10 + courseIndex) % thumbnails.length],
      trailer: {
        title: 'Course Trailer',
        youtubeId: YOUTUBE_VIDEO_POOL[(seriesIndex * 10 + courseIndex) % YOUTUBE_VIDEO_POOL.length],
        duration: 120,
      },
      category: series.name,
      tags: [series.name, isFree ? 'Free' : 'Premium', `Level ${level}`],
      level: level,
      instructor: instructors[(seriesIndex + courseIndex) % instructors.length],
      chapters: createChapters(courseId, [
        {
          title: 'Chapter 1: Getting Started',
          lessons: Array.from({ length: 5 }, (_, i) => ({
            title: `Lesson ${i + 1}: Introduction to ${series.name}`,
            videoId: YOUTUBE_VIDEO_POOL[(seriesIndex * 15 + i) % YOUTUBE_VIDEO_POOL.length],
            duration: 600 + i * 60,
          })),
        },
        {
          title: 'Chapter 2: Core Techniques',
          lessons: Array.from({ length: 5 }, (_, i) => ({
            title: `Lesson ${i + 1}: ${series.name} Techniques`,
            videoId: YOUTUBE_VIDEO_POOL[(seriesIndex * 15 + 5 + i) % YOUTUBE_VIDEO_POOL.length],
            duration: 600 + i * 60,
          })),
        },
        {
          title: 'Chapter 3: Advanced Applications',
          lessons: Array.from({ length: 5 }, (_, i) => ({
            title: `Lesson ${i + 1}: Advanced ${series.name}`,
            videoId: YOUTUBE_VIDEO_POOL[(seriesIndex * 15 + 10 + i) % YOUTUBE_VIDEO_POOL.length],
            duration: 600 + i * 60,
          })),
        },
      ]),
      totalDuration: 10500,
      lessonCount: 15,
      isFeatured: courseIndex === 0, // First course in each series is featured
      createdAt: new Date(`2024-0${Math.min(9, seriesIndex + 1)}-${String(courseIndex + 1).padStart(2, '0')}`),
      courseType: 'vava',
      toolTags: [series.toolTag],
      isFree: isFree,
    };

    SERIES_COURSES.push(course);
  });
});

// Add series courses to the main list
MOCK_COURSES.push(...SERIES_COURSES);

// ==================== SERIES COURSE HELPERS ====================

/**
 * Required series in display order for Learn page
 */
export const REQUIRED_SERIES_ORDER = [
  'ChatGPT',
  'Make',
  'n8n',
  'Midjourney',
  'Stable Diffusion',
  'Gemini',
] as const;

/**
 * Get courses for a specific series by tool tag
 */
export function getSeriesCourses(seriesTag: string): Course[] {
  return MOCK_COURSES.filter(
    (course) => course.courseType === 'vava' && course.toolTags?.includes(seriesTag)
  );
}

/**
 * Get all courses organized by required series order
 */
export function getCoursesBySeriesOrder(): Map<string, Course[]> {
  const result = new Map<string, Course[]>();
  REQUIRED_SERIES_ORDER.forEach((series) => {
    result.set(series, getSeriesCourses(series));
  });
  return result;
}

/**
 * Get free courses - exactly 1 per required series (6 total)
 */
export function getFreeCoursesBySeries(): Course[] {
  return REQUIRED_SERIES_ORDER.map((series) => {
    const seriesCourses = getSeriesCourses(series);
    return seriesCourses.find((c) => c.isFree);
  }).filter((c): c is Course => c !== undefined);
}

// ==================== NUNU/VAVA COURSE HELPERS ====================

/**
 * Get all Nunu courses (mentor training)
 */
export function getNunuCourses(): Course[] {
  return MOCK_COURSES.filter((course) => course.courseType === 'nunu');
}

/**
 * Get all Vava courses (learner courses)
 */
export function getVavaCourses(): Course[] {
  return MOCK_COURSES.filter((course) => course.courseType === 'vava');
}

/**
 * Get all free Vava courses
 */
export function getFreeVavaCourses(): Course[] {
  return MOCK_COURSES.filter((course) => course.courseType === 'vava' && course.isFree);
}

/**
 * Get unique tool tags from all Vava courses
 */
export function getAllToolTags(): string[] {
  const tags = new Set<string>();
  MOCK_COURSES.forEach((course) => {
    if (course.courseType === 'vava' && course.toolTags) {
      course.toolTags.forEach((tag) => tags.add(tag));
    }
  });
  return Array.from(tags).sort();
}

/**
 * Get Vava courses grouped by their primary tool tag
 */
export function getVavaCoursesByToolTag(): Map<string, Course[]> {
  const grouped = new Map<string, Course[]>();

  MOCK_COURSES.forEach((course) => {
    if (course.courseType === 'vava' && course.toolTags && course.toolTags.length > 0) {
      const primaryTag = course.toolTags[0];
      const existing = grouped.get(primaryTag) || [];
      existing.push(course);
      grouped.set(primaryTag, existing);
    }
  });

  return grouped;
}

/**
 * Get all Verified Nunu required courses
 */
export function getVerifiedRequiredCourses(): Course[] {
  return MOCK_COURSES.filter((course) => course.verifiedRequired === true);
}

/**
 * Get courses by track
 */
export function getCoursesByTrack(track: CourseTrack): Course[] {
  if (track === 'general') {
    return MOCK_COURSES.filter((course) => !course.track || course.track === 'general');
  }
  return MOCK_COURSES.filter((course) => course.track === track);
}

// Special course for hero section
export { MOCK_COURSES as courses };
