import type { Course, CourseCategory, CourseLevel, Chapter, Lesson, Trailer } from '@/features/learn/types';

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
  createdAt: Date
): Course {
  const allLessons = chapters.flatMap((ch) => ch.lessons);
  const totalDuration = allLessons.reduce((sum, l) => sum + l.duration, 0);

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
  courseConfigs: { id: string; title: string; subtitle: string; category: string; level: CourseLevel; featured: boolean }[]
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
    'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800',
    'https://images.unsplash.com/photo-1676299081847-824916de030a?w=800',
    'https://images.unsplash.com/photo-1547891654-e66ed7ebb968?w=800',
    'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800',
    'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800',
    'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800',
    'https://images.unsplash.com/photo-1589254065878-42c9da997008?w=800',
    'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=800',
    'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800',
    'https://images.unsplash.com/photo-1507146426996-ef05306b995a?w=800',
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
      new Date(`2024-0${Math.min(9, Math.floor(index / 10) + 1)}-${String((index % 28) + 1).padStart(2, '0')}`)
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

// Special course for hero section
export { MOCK_COURSES as courses };
