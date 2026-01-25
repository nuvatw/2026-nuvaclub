import type { EventProduct } from '@/features/shop/types';

/**
 * Events Mock Data
 *
 * Contains all event products (workshops, meetups, webinars, AMA sessions).
 * Events from March 2026 to December 2026, plus weekly AMA sessions.
 */

export const MOCK_EVENTS: EventProduct[] = [
  // ==========================================
  // Weekly AMA Sessions (Every Thursday 20:00-21:00 GMT+8)
  // ==========================================
  {
    id: 'ama-1',
    type: 'event',
    eventType: 'online',
    isLiveQA: true,
    name: 'Weekly AMA with Founders',
    description: 'Ask anything about AI, career, learning strategies, or get feedback on your projects.',
    date: new Date('2026-01-30T20:00:00+08:00'),
    endDate: new Date('2026-01-30T21:00:00+08:00'),
    location: 'Online (Discord)',
    price: 0,
    capacity: 100,
    remainingSeats: 45,
    imageUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800',
    rating: 4.8,
    reviewCount: 156,
    hotScore: 92,
    overview: 'Join our weekly AMA (Ask Me Anything) session with the nuvaClub founders. Every Thursday night, we open the floor for your questions about AI trends, career advice, learning strategies, or feedback on your projects.',
    whatYouWillLearn: [
      'Get personalized advice for your situation',
      'Learn from other members\' questions',
      'Stay updated on AI trends',
      'Career guidance from experienced mentors',
    ],
    whoIsItFor: [
      'All nuvaClub members',
      'Anyone with questions about AI',
      'Career changers seeking guidance',
      'Students planning their learning path',
    ],
    agenda: [
      { time: '20:00', title: 'Welcome & Weekly Updates', description: 'Brief community announcements' },
      { time: '20:10', title: 'Live Q&A Session', description: '45 minutes of open questions' },
      { time: '20:55', title: 'Closing & Next Week Preview', description: 'Wrap-up and announcements' },
    ],
  },
  {
    id: 'ama-2',
    type: 'event',
    eventType: 'online',
    isLiveQA: true,
    name: 'Weekly AMA with Founders',
    description: 'Ask anything about AI, career, learning strategies, or get feedback on your projects.',
    date: new Date('2026-02-06T20:00:00+08:00'),
    endDate: new Date('2026-02-06T21:00:00+08:00'),
    location: 'Online (Discord)',
    price: 0,
    capacity: 100,
    remainingSeats: 78,
    imageUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800',
    rating: 4.8,
    reviewCount: 156,
    hotScore: 88,
    overview: 'Join our weekly AMA (Ask Me Anything) session with the nuvaClub founders. Every Thursday night, we open the floor for your questions about AI trends, career advice, learning strategies, or feedback on your projects.',
    whatYouWillLearn: [
      'Get personalized advice for your situation',
      'Learn from other members\' questions',
      'Stay updated on AI trends',
      'Career guidance from experienced mentors',
    ],
    whoIsItFor: [
      'All nuvaClub members',
      'Anyone with questions about AI',
      'Career changers seeking guidance',
      'Students planning their learning path',
    ],
    agenda: [
      { time: '20:00', title: 'Welcome & Weekly Updates', description: 'Brief community announcements' },
      { time: '20:10', title: 'Live Q&A Session', description: '45 minutes of open questions' },
      { time: '20:55', title: 'Closing & Next Week Preview', description: 'Wrap-up and announcements' },
    ],
  },
  {
    id: 'ama-3',
    type: 'event',
    eventType: 'online',
    isLiveQA: true,
    name: 'Weekly AMA with Founders',
    description: 'Ask anything about AI, career, learning strategies, or get feedback on your projects.',
    date: new Date('2026-02-13T20:00:00+08:00'),
    endDate: new Date('2026-02-13T21:00:00+08:00'),
    location: 'Online (Discord)',
    price: 0,
    capacity: 100,
    remainingSeats: 100,
    imageUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800',
    rating: 4.8,
    reviewCount: 156,
    hotScore: 85,
    overview: 'Join our weekly AMA (Ask Me Anything) session with the nuvaClub founders. Every Thursday night, we open the floor for your questions about AI trends, career advice, learning strategies, or feedback on your projects.',
    whatYouWillLearn: [
      'Get personalized advice for your situation',
      'Learn from other members\' questions',
      'Stay updated on AI trends',
      'Career guidance from experienced mentors',
    ],
    whoIsItFor: [
      'All nuvaClub members',
      'Anyone with questions about AI',
      'Career changers seeking guidance',
      'Students planning their learning path',
    ],
    agenda: [
      { time: '20:00', title: 'Welcome & Weekly Updates', description: 'Brief community announcements' },
      { time: '20:10', title: 'Live Q&A Session', description: '45 minutes of open questions' },
      { time: '20:55', title: 'Closing & Next Week Preview', description: 'Wrap-up and announcements' },
    ],
  },

  // ==========================================
  // Main Events (March - December 2026)
  // ==========================================
  {
    id: 'event-1',
    type: 'event',
    eventType: 'in-person',
    name: 'nuvaClub Spring Meetup',
    description: 'Kick off spring with our community gathering! Network, share experiences, and celebrate together.',
    date: new Date('2026-03-07'),
    location: 'Daan District, Taipei',
    price: 500,
    capacity: 60,
    remainingSeats: 38,
    imageUrl: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800',
    rating: 4.9,
    reviewCount: 89,
    hotScore: 94,
    overview: 'Our Spring Meetup is the perfect opportunity to connect with fellow nuvaClub members after the Lunar New Year. Share your learning progress, discover new collaboration opportunities, and enjoy an evening of meaningful connections.',
    whatYouWillLearn: [
      'Network with like-minded professionals',
      'Share and learn from others\' AI journeys',
      'Discover collaboration opportunities',
      'Get tips from experienced community members',
    ],
    whoIsItFor: [
      'All nuvaClub members',
      'Anyone interested in joining our community',
      'Professionals seeking networking opportunities',
      'Those looking for accountability partners',
    ],
    agenda: [
      { time: '18:30', title: 'Doors Open', description: 'Arrive, grab a drink, and mingle' },
      { time: '19:00', title: 'Welcome & Introductions', description: 'Brief overview and icebreakers' },
      { time: '19:30', title: 'Lightning Talks', description: 'Community members share their stories' },
      { time: '20:15', title: 'Open Networking', description: 'Free-form networking with structured activities' },
      { time: '21:30', title: 'Closing', description: 'Wrap-up and future event announcements' },
    ],
  },
  {
    id: 'event-2',
    type: 'event',
    eventType: 'in-person',
    name: 'AI Workshop: From Zero to Automation',
    description: 'A full-day hands-on workshop covering prompt engineering to workflow automation.',
    date: new Date('2026-03-21'),
    location: 'Xinyi District, Taipei',
    price: 2490,
    capacity: 30,
    remainingSeats: 12,
    imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800',
    rating: 4.8,
    reviewCount: 67,
    hotScore: 96,
    overview: 'Join us for an intensive full-day workshop where you\'ll learn practical AI skills from industry experts. This hands-on session covers everything from basic prompt engineering to building automated workflows that can transform your productivity.',
    whatYouWillLearn: [
      'Master prompt engineering techniques for ChatGPT and Claude',
      'Build automated workflows with AI tools',
      'Integrate AI into your daily work processes',
      'Best practices for AI-assisted content creation',
    ],
    whoIsItFor: [
      'Professionals looking to enhance productivity with AI',
      'Entrepreneurs wanting to leverage AI for business',
      'Students interested in practical AI applications',
      'Anyone curious about hands-on AI implementation',
    ],
    agenda: [
      { time: '09:00', title: 'Registration & Welcome', description: 'Check-in, networking, and coffee' },
      { time: '09:30', title: 'Prompt Engineering Fundamentals', description: 'Learn the core principles of effective prompting' },
      { time: '11:00', title: 'Break', description: 'Refreshments and networking' },
      { time: '11:15', title: 'Hands-on Workshop Part 1', description: 'Build your first AI-powered workflow' },
      { time: '12:30', title: 'Lunch', description: 'Catered lunch with networking opportunities' },
      { time: '13:30', title: 'Advanced Automation Techniques', description: 'Multi-step workflows and integrations' },
      { time: '15:00', title: 'Break', description: 'Refreshments' },
      { time: '15:15', title: 'Hands-on Workshop Part 2', description: 'Complete your personalized AI toolkit' },
      { time: '16:45', title: 'Q&A and Wrap-up', description: 'Final questions and next steps' },
    ],
    faqs: [
      { question: 'Do I need prior AI experience?', answer: 'No! This workshop is designed for beginners and intermediate users alike.' },
      { question: 'What should I bring?', answer: 'Just bring your laptop with internet access. All tools and accounts will be provided.' },
      { question: 'Is lunch included?', answer: 'Yes, lunch and refreshments are included in the ticket price.' },
    ],
  },
  {
    id: 'event-3',
    type: 'event',
    eventType: 'online',
    name: 'AI Tools Webinar: 2026 Edition',
    description: 'Free webinar showcasing the latest and most powerful AI tools for productivity.',
    date: new Date('2026-04-12'),
    location: 'Online (YouTube Live)',
    price: 0,
    capacity: 500,
    remainingSeats: 342,
    imageUrl: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800',
    rating: 4.6,
    reviewCount: 234,
    hotScore: 78,
    overview: 'A free introductory webinar showcasing the best AI tools of 2026. Perfect for beginners who want to understand the AI landscape and find the right tools for their needs.',
    whatYouWillLearn: [
      'Overview of top AI tools in 2026',
      'How to choose the right tool for your needs',
      'Free vs paid tool comparisons',
      'Getting started tips',
    ],
    whoIsItFor: [
      'Complete beginners to AI',
      'Anyone curious about AI tools',
      'Professionals exploring options',
      'Students starting their AI journey',
    ],
    agenda: [
      { time: '19:00', title: 'Introduction', description: 'Why AI tools matter in 2026' },
      { time: '19:15', title: 'Tool Showcase', description: 'Live demos of top 10 tools' },
      { time: '19:45', title: 'Q&A', description: 'Your questions answered live' },
      { time: '20:00', title: 'End', description: 'Resources and next steps' },
    ],
  },
  {
    id: 'event-4',
    type: 'event',
    eventType: 'in-person',
    name: 'Prompt Engineering Masterclass',
    description: 'Deep dive into advanced prompt engineering with hands-on labs and certification.',
    date: new Date('2026-05-09'),
    location: 'Zhongshan District, Taipei',
    price: 3200,
    capacity: 25,
    remainingSeats: 8,
    imageUrl: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800',
    rating: 4.9,
    reviewCount: 45,
    hotScore: 98,
    overview: 'An intensive small-group masterclass focused exclusively on mastering prompt engineering. With only 25 seats, you\'ll get personalized attention and hands-on practice with advanced techniques. Certificate included.',
    whatYouWillLearn: [
      'Chain-of-thought and tree-of-thought prompting',
      'Few-shot and zero-shot learning techniques',
      'System prompt optimization for different models',
      'Multi-modal prompting strategies (text, image, code)',
    ],
    whoIsItFor: [
      'Developers building AI applications',
      'Content creators using AI daily',
      'Researchers and data analysts',
      'Anyone wanting advanced prompt mastery',
    ],
    agenda: [
      { time: '09:30', title: 'Advanced Prompt Patterns', description: 'Beyond basic prompting techniques' },
      { time: '11:00', title: 'Hands-on Lab Session 1', description: 'Practice with guided exercises' },
      { time: '12:30', title: 'Lunch & Discussion', description: 'Share learnings with peers' },
      { time: '13:30', title: 'Multi-modal Prompting', description: 'Images, code, and structured outputs' },
      { time: '15:00', title: 'Hands-on Lab Session 2', description: 'Build your personal prompt library' },
      { time: '16:30', title: 'Certification & Closing', description: 'Receive your certificate' },
    ],
  },
  {
    id: 'event-5',
    type: 'event',
    eventType: 'in-person',
    name: 'AI Hackathon: Summer Edition',
    description: '48-hour hackathon to build innovative AI-powered solutions. Prizes worth NT$100,000!',
    date: new Date('2026-06-20'),
    location: 'Taiwan Tech Arena, Taipei',
    price: 0,
    capacity: 150,
    remainingSeats: 67,
    imageUrl: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800',
    rating: 4.9,
    reviewCount: 178,
    hotScore: 99,
    overview: 'Our flagship summer hackathon! Form teams, build AI-powered solutions over 48 hours, and compete for prizes worth NT$100,000. Mentors, food, and energy drinks provided throughout the event.',
    whatYouWillLearn: [
      'Rapid prototyping with AI tools',
      'Team collaboration under pressure',
      'Pitching AI solutions effectively',
      'Real-world problem solving skills',
    ],
    whoIsItFor: [
      'Developers of all skill levels',
      'Designers and UX specialists',
      'Product enthusiasts',
      'Anyone who loves building things',
    ],
    agenda: [
      { time: 'Day 1 - 09:00', title: 'Kickoff', description: 'Theme reveal and team formation' },
      { time: 'Day 1 - 12:00', title: 'Hacking Begins', description: 'Start building your solution!' },
      { time: 'Day 2 - 12:00', title: 'Mentor Sessions', description: 'Get feedback from experts' },
      { time: 'Day 2 - 18:00', title: 'Final Submissions', description: 'Submit your project' },
      { time: 'Day 2 - 19:00', title: 'Demo & Awards', description: 'Showcase and prize ceremony' },
    ],
  },
  {
    id: 'event-6',
    type: 'event',
    eventType: 'online',
    name: 'AI for Developers: API Integration Workshop',
    description: 'Learn to integrate OpenAI, Anthropic, and other AI APIs into your applications.',
    date: new Date('2026-07-11'),
    location: 'Online (Google Meet)',
    price: 1500,
    capacity: 80,
    remainingSeats: 52,
    imageUrl: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800',
    rating: 4.7,
    reviewCount: 98,
    hotScore: 82,
    overview: 'A technical workshop for developers wanting to integrate AI capabilities into their applications. Covers major AI APIs, best practices, and production deployment strategies.',
    whatYouWillLearn: [
      'OpenAI and Anthropic API deep dive',
      'Building AI-powered features step by step',
      'Prompt management in production systems',
      'Cost optimization and rate limiting strategies',
    ],
    whoIsItFor: [
      'Software developers (2+ years experience)',
      'Full-stack engineers',
      'Technical product managers',
      'Anyone building products with AI APIs',
    ],
    agenda: [
      { time: '19:00', title: 'API Overview', description: 'Understanding different AI APIs' },
      { time: '19:45', title: 'Live Coding Session', description: 'Build a feature together' },
      { time: '20:30', title: 'Production Tips', description: 'Deployment and scaling' },
      { time: '21:00', title: 'Q&A', description: 'Technical questions' },
    ],
  },
  {
    id: 'event-7',
    type: 'event',
    eventType: 'in-person',
    name: 'AI Business Strategy Summit',
    description: 'Executive-level insights on AI transformation. Featured speakers from top tech companies.',
    date: new Date('2026-08-15'),
    location: 'Grand Hyatt, Taipei',
    price: 4500,
    capacity: 100,
    remainingSeats: 41,
    imageUrl: 'https://images.unsplash.com/photo-1591115765373-5207764f72e7?w=800',
    rating: 4.9,
    reviewCount: 34,
    hotScore: 87,
    overview: 'A premium summit for business leaders exploring AI transformation. Features keynotes from industry experts, hands-on strategy sessions, and exclusive networking with C-suite executives.',
    whatYouWillLearn: [
      'AI transformation roadmaps that work',
      'Building AI-ready organizations',
      'Risk management in AI adoption',
      'Creating competitive advantage with AI',
    ],
    whoIsItFor: [
      'C-suite executives',
      'Business unit leaders',
      'Strategy consultants',
      'Digital transformation officers',
    ],
    agenda: [
      { time: '09:00', title: 'Morning Keynote', description: 'AI Leadership in 2026 and Beyond' },
      { time: '10:30', title: 'Panel Discussion', description: 'Industry Leaders Share Their Journey' },
      { time: '12:00', title: 'Executive Lunch', description: 'Private networking with speakers' },
      { time: '14:00', title: 'Strategy Workshop', description: 'Build Your AI Roadmap' },
      { time: '16:30', title: 'Closing Reception', description: 'Networking drinks and appetizers' },
    ],
  },
  {
    id: 'event-8',
    type: 'event',
    eventType: 'online',
    name: 'AI Content Creation Bootcamp',
    description: 'Master AI-powered content creation for social media, blogs, video scripts, and more.',
    date: new Date('2026-09-05'),
    location: 'Online (Zoom)',
    price: 1800,
    capacity: 60,
    remainingSeats: 35,
    imageUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800',
    rating: 4.8,
    reviewCount: 112,
    hotScore: 91,
    overview: 'Learn to create compelling content at scale using AI tools. This online bootcamp covers everything from social media posts to long-form articles, video scripts, and marketing copy.',
    whatYouWillLearn: [
      'AI-assisted copywriting that converts',
      'Visual content generation workflows',
      'Content strategy optimization with AI',
      'Batch content creation systems',
    ],
    whoIsItFor: [
      'Content creators and marketers',
      'Social media managers',
      'Bloggers and freelance writers',
      'Small business owners',
    ],
    agenda: [
      { time: '10:00', title: 'Content Strategy with AI', description: 'Planning your content calendar' },
      { time: '11:30', title: 'Writing Workshop', description: 'AI-assisted copywriting techniques' },
      { time: '13:00', title: 'Break', description: '30-minute break' },
      { time: '13:30', title: 'Visual Content Lab', description: 'Image and video creation' },
      { time: '15:30', title: 'Wrap-up', description: 'Your complete content toolkit' },
    ],
  },
  {
    id: 'event-9',
    type: 'event',
    eventType: 'in-person',
    name: 'AI Ethics & Responsible Use Workshop',
    description: 'Understanding bias, privacy, and safety considerations in AI applications.',
    date: new Date('2026-10-17'),
    location: 'NTU Campus, Taipei',
    price: 800,
    capacity: 80,
    remainingSeats: 62,
    imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800',
    rating: 4.7,
    reviewCount: 56,
    hotScore: 74,
    overview: 'Explore the ethical implications of AI and learn how to use AI responsibly. This workshop covers bias detection, privacy considerations, safety best practices, and ethical decision frameworks.',
    whatYouWillLearn: [
      'Understanding and detecting AI bias',
      'Privacy considerations when using AI',
      'Safety best practices for AI deployment',
      'Ethical decision-making frameworks',
    ],
    whoIsItFor: [
      'Anyone using AI in their work',
      'Policy makers and regulators',
      'AI practitioners and developers',
      'Business leaders and managers',
    ],
    agenda: [
      { time: '14:00', title: 'AI Ethics Overview', description: 'Key concepts and frameworks' },
      { time: '14:45', title: 'Case Studies', description: 'Real-world ethical dilemmas' },
      { time: '15:30', title: 'Interactive Workshop', description: 'Apply ethical frameworks' },
      { time: '16:15', title: 'Open Discussion', description: 'Community dialogue' },
    ],
  },
  {
    id: 'event-10',
    type: 'event',
    eventType: 'in-person',
    name: 'nuvaClub Year-End Celebration',
    description: 'Celebrate 2026 with the nuvaClub community! Awards, entertainment, and unforgettable memories.',
    date: new Date('2026-12-12'),
    location: 'W Hotel, Taipei',
    price: 1200,
    capacity: 200,
    remainingSeats: 156,
    imageUrl: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800',
    rating: 5.0,
    reviewCount: 0,
    hotScore: 95,
    overview: 'Join us for the biggest nuvaClub event of the year! We\'ll celebrate our community\'s achievements, present awards to top contributors, enjoy live entertainment, and create memories to last a lifetime.',
    whatYouWillLearn: [
      'Celebrate community achievements',
      'Network with the entire nuvaClub family',
      'Get inspired for 2027',
      'Create lasting friendships',
    ],
    whoIsItFor: [
      'All nuvaClub members',
      'Nunus and Vavas',
      'Community contributors',
      'Anyone who wants to celebrate with us',
    ],
    agenda: [
      { time: '18:00', title: 'Red Carpet & Welcome Drinks', description: 'Arrive in style' },
      { time: '19:00', title: 'Opening & Year in Review', description: 'Highlights of 2026' },
      { time: '19:30', title: 'Awards Ceremony', description: 'Honoring top contributors' },
      { time: '20:30', title: 'Dinner & Entertainment', description: 'Live performances' },
      { time: '22:00', title: 'Party & Dancing', description: 'Celebrate into the night!' },
    ],
  },
];

// Legacy export for backward compatibility
export const EVENTS = MOCK_EVENTS;

// Helper functions
export const getEventById = (id: string): EventProduct | undefined =>
  MOCK_EVENTS.find((e) => e.id === id);

export const getUpcomingEvents = (): EventProduct[] =>
  MOCK_EVENTS.filter((e) => e.date >= new Date()).sort(
    (a, b) => a.date.getTime() - b.date.getTime()
  );

export const getEventsByType = (eventType: EventProduct['eventType']): EventProduct[] =>
  MOCK_EVENTS.filter((e) => e.eventType === eventType);

export const getFreeEvents = (): EventProduct[] =>
  MOCK_EVENTS.filter((e) => e.price === 0);

export const getAvailableEvents = (): EventProduct[] =>
  MOCK_EVENTS.filter((e) => e.remainingSeats > 0);

export const getPastEvents = (): EventProduct[] => {
  const now = new Date();
  return MOCK_EVENTS.filter((e) => e.date <= now).sort((a, b) => b.date.getTime() - a.date.getTime());
};

export const getInPersonEvents = (): EventProduct[] =>
  MOCK_EVENTS.filter((e) => e.eventType === 'in-person');

export const getOnlineEvents = (): EventProduct[] =>
  MOCK_EVENTS.filter((e) => e.eventType === 'online');

// Sorting functions
export type EventSortBy = 'hot' | 'date' | 'price-low' | 'price-high';

export const getEventsSorted = (sortBy: EventSortBy): EventProduct[] => {
  const events = [...MOCK_EVENTS];
  switch (sortBy) {
    case 'hot':
      return events.sort((a, b) => (b.hotScore || 0) - (a.hotScore || 0));
    case 'date':
      return events.sort((a, b) => a.date.getTime() - b.date.getTime());
    case 'price-low':
      return events.sort((a, b) => a.price - b.price);
    case 'price-high':
      return events.sort((a, b) => b.price - a.price);
    default:
      return events;
  }
};

// Search and filter function
export const searchAndFilterEvents = (
  query: string,
  eventType: 'all' | 'in-person' | 'online',
  sortBy: EventSortBy
): EventProduct[] => {
  let events = [...MOCK_EVENTS];

  // Filter by event type
  if (eventType !== 'all') {
    events = events.filter((e) => e.eventType === eventType);
  }

  // Search by query
  if (query.trim()) {
    const lowerQuery = query.toLowerCase().trim();
    events = events.filter(
      (e) =>
        e.name.toLowerCase().includes(lowerQuery) ||
        e.description.toLowerCase().includes(lowerQuery) ||
        e.location.toLowerCase().includes(lowerQuery)
    );
  }

  // Sort
  switch (sortBy) {
    case 'hot':
      return events.sort((a, b) => (b.hotScore || 0) - (a.hotScore || 0));
    case 'date':
      return events.sort((a, b) => a.date.getTime() - b.date.getTime());
    case 'price-low':
      return events.sort((a, b) => a.price - b.price);
    case 'price-high':
      return events.sort((a, b) => b.price - a.price);
    default:
      return events;
  }
};
