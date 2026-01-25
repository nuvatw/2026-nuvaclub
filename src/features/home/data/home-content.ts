// Home page content data - extracted for maintainability

export const STATS = [
  { value: '50+', label: 'AI Courses' },
  { value: '10K+', label: 'Learners' },
  { value: '500+', label: 'Mentor Matches' },
  { value: '95%', label: 'Satisfaction' },
] as const;

export const PAIN_POINTS = [
  {
    icon: '😵',
    title: 'Overwhelmed by Information',
    description: 'Thousands of AI tutorials, but no clear path forward',
  },
  {
    icon: '🤷',
    title: 'Learning Alone',
    description: 'No one to ask questions or validate your progress',
  },
  {
    icon: '📉',
    title: 'Giving Up Too Soon',
    description: 'Without accountability, motivation fades quickly',
  },
] as const;

export const PILLARS = [
  {
    icon: '📚',
    title: 'Learn',
    subtitle: 'Structured AI Courses',
    description:
      'From ChatGPT basics to advanced automation. Video courses designed for real-world application, not just theory.',
    href: '/learn',
    gradient: 'from-blue-500 to-blue-700',
    features: ['50+ video courses', 'Hands-on projects', 'Progress tracking'],
  },
  {
    icon: '💬',
    title: 'Forum',
    subtitle: 'Community Q&A',
    description:
      'Stuck on a problem? Get answers from fellow learners and experts who\'ve been where you are.',
    href: '/forum',
    gradient: 'from-green-500 to-green-700',
    features: ['Expert answers', 'Resource sharing', 'Weekly discussions'],
  },
  {
    icon: '🤝',
    title: 'Space',
    subtitle: '1:1 Mentorship',
    description:
      'Get matched with a Nunu (mentor) who guides your journey. Personal feedback, accountability, and support.',
    href: '/space',
    gradient: 'from-purple-500 to-purple-700',
    features: ['Personal mentor', 'Weekly check-ins', 'Career guidance'],
  },
  {
    icon: '🚀',
    title: 'Sprint',
    subtitle: 'Build & Showcase',
    description:
      'Apply what you learn. Build real AI projects, get community feedback, and build your portfolio.',
    href: '/sprint',
    gradient: 'from-orange-500 to-orange-700',
    features: ['Quarterly challenges', 'Community voting', 'Portfolio pieces'],
  },
  {
    icon: '🛒',
    title: 'Shop',
    subtitle: 'Events & More',
    description:
      'Exclusive workshops, live events, and merchandise. Connect with the community IRL.',
    href: '/shop',
    gradient: 'from-pink-500 to-pink-700',
    features: ['Live workshops', 'Exclusive events', 'Community merch'],
  },
] as const;

export const FEATURED_COURSES = [
  {
    id: 'course-1',
    title: 'ChatGPT Mastery',
    instructor: 'Dr. Sarah Chen',
    level: 'Beginner',
    duration: '4 hours',
    image: '/images/courses/chatgpt.jpg',
    rating: 4.9,
    students: 2847,
  },
  {
    id: 'course-2',
    title: 'Prompt Engineering Pro',
    instructor: 'Michael Torres',
    level: 'Intermediate',
    duration: '6 hours',
    image: '/images/courses/prompt.jpg',
    rating: 4.8,
    students: 1923,
  },
  {
    id: 'course-3',
    title: 'AI Automation Workflow',
    instructor: 'Emily Zhang',
    level: 'Advanced',
    duration: '8 hours',
    image: '/images/courses/automation.jpg',
    rating: 4.9,
    students: 1456,
  },
] as const;

export const TESTIMONIALS = [
  {
    quote:
      'I went from AI-curious to building automated workflows for my business in 3 months. The mentor matching was a game-changer.',
    name: 'James Liu',
    role: 'Startup Founder',
    avatar: 'https://i.pravatar.cc/150?u=james',
  },
  {
    quote:
      'Finally, a structured path to learning AI. No more jumping between random YouTube tutorials. Everything just clicks here.',
    name: 'Michelle Park',
    role: 'Marketing Director',
    avatar: 'https://i.pravatar.cc/150?u=michelle',
  },
  {
    quote:
      'My Nunu mentor helped me land an AI-focused role. The community here is incredibly supportive and knowledgeable.',
    name: 'David Chen',
    role: 'Product Manager',
    avatar: 'https://i.pravatar.cc/150?u=david2',
  },
] as const;

export const PRICING_TIERS = [
  {
    name: 'Explorer',
    price: 'Free',
    period: '',
    description: 'Start your AI journey',
    features: [
      'Access to free courses',
      'Forum browsing & liking',
      'Sprint project viewing',
      'Community access',
    ],
    cta: 'Start Free',
    href: '/learn',
    highlight: false,
  },
  {
    name: 'Solo Traveler',
    price: '$9.99',
    period: '/month',
    description: 'Full learning access',
    features: [
      'All 50+ AI courses',
      'Forum posting & discussions',
      'Sprint project submissions',
      'Progress certificates',
      '12-level AI assessments',
    ],
    cta: 'Start Learning',
    href: '/shop',
    highlight: true,
  },
  {
    name: 'Duo Traveler',
    price: '$29',
    period: '/month',
    description: 'Learning + Mentorship',
    features: [
      'Everything in Solo Traveler',
      '1:1 Nunu mentor matching',
      'Weekly mentor sessions',
      'Priority support',
      'Exclusive Discord access',
    ],
    cta: 'Get a Mentor',
    href: '/shop',
    highlight: false,
  },
] as const;

// Mentorship features for the MentorshipSection
export const MENTORSHIP_FEATURES = [
  { icon: '🎯', text: 'Matched based on your goals and level' },
  { icon: '💬', text: 'Weekly 1:1 sessions and async support' },
  { icon: '📈', text: 'Track your progress together' },
  { icon: '🔥', text: 'Stay accountable and motivated' },
] as const;

// Hero video ID (YouTube)
export const HERO_VIDEO_ID = 'dLRdaUda8Ho';
