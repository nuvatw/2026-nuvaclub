import type {
  EventProduct,
  MerchandiseProduct,
  DuoProduct,
  Product,
  ShopProduct,
  ProductCategory,
} from '@/features/shop/types';
import { PLANS } from './plans';
import { DUO_PRODUCTS } from './duo';

export const EVENTS: EventProduct[] = [
  {
    id: 'event-1',
    type: 'event',
    eventType: 'in-person',
    name: 'AI Workshop',
    description: 'A full-day hands-on workshop covering Prompt engineering to automation.',
    date: new Date('2026-02-15'),
    location: 'Xinyi District, Taipei',
    price: 1990,
    capacity: 30,
    remainingSeats: 12,
    imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800',
    rating: 4.7,
    reviewCount: 45,
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
    id: 'event-2',
    type: 'event',
    eventType: 'in-person',
    name: 'nuvaClub Meetup',
    description: 'Connect with community members, share experiences, and build lasting relationships.',
    date: new Date('2026-03-01'),
    location: 'Daan District, Taipei',
    price: 500,
    capacity: 50,
    remainingSeats: 35,
    imageUrl: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800',
    rating: 4.9,
    reviewCount: 78,
    overview: 'Our monthly community meetup is the perfect opportunity to connect with fellow nuvaClub members. Share your learning journey, get inspired by others\' stories, and build meaningful connections that extend beyond the event.',
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
    id: 'event-3',
    type: 'event',
    eventType: 'in-person',
    name: 'AI Entrepreneurs Forum',
    description: 'Exchange practical AI experience with successful entrepreneurs.',
    date: new Date('2026-03-15'),
    location: 'Songshan District, Taipei',
    price: 1500,
    capacity: 100,
    remainingSeats: 45,
    imageUrl: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800',
    rating: 4.8,
    reviewCount: 52,
    overview: 'Learn directly from founders who have successfully integrated AI into their businesses. This forum brings together entrepreneurs from various industries to share their experiences, challenges, and strategies for leveraging AI.',
    whatYouWillLearn: [
      'Real-world AI implementation strategies',
      'Common pitfalls and how to avoid them',
      'ROI considerations for AI investments',
      'Building AI-first products and services',
    ],
    whoIsItFor: [
      'Startup founders',
      'Business owners considering AI adoption',
      'Product managers',
      'Innovation leaders',
    ],
    agenda: [
      { time: '14:00', title: 'Opening Keynote', description: 'The State of AI in Business 2026' },
      { time: '14:45', title: 'Panel: AI Success Stories', description: 'Founders share their journeys' },
      { time: '15:45', title: 'Networking Break', description: 'Coffee and connections' },
      { time: '16:15', title: 'Workshop: AI Strategy Canvas', description: 'Interactive session' },
      { time: '17:30', title: 'Closing & Happy Hour', description: 'Drinks and continued networking' },
    ],
  },
  {
    id: 'event-4',
    type: 'event',
    eventType: 'in-person',
    name: 'Prompt Engineering Lab',
    description: 'Deep dive into advanced prompt engineering techniques.',
    date: new Date('2026-03-20'),
    location: 'Zhongshan District, Taipei',
    price: 2500,
    capacity: 25,
    remainingSeats: 10,
    imageUrl: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800',
    rating: 4.9,
    reviewCount: 34,
    overview: 'An intensive small-group workshop focused exclusively on mastering prompt engineering. With only 25 seats, you\'ll get personalized attention and hands-on practice with advanced techniques.',
    whatYouWillLearn: [
      'Chain-of-thought prompting',
      'Few-shot learning techniques',
      'System prompt optimization',
      'Multi-modal prompting strategies',
    ],
    whoIsItFor: [
      'Developers building AI applications',
      'Content creators using AI daily',
      'Researchers and analysts',
      'Anyone wanting advanced prompt skills',
    ],
    agenda: [
      { time: '09:30', title: 'Advanced Prompt Patterns', description: 'Beyond basic prompting' },
      { time: '11:00', title: 'Hands-on Lab Session 1', description: 'Practice with guidance' },
      { time: '12:30', title: 'Lunch & Discussion', description: 'Share learnings' },
      { time: '13:30', title: 'Multi-modal Prompting', description: 'Images, code, and more' },
      { time: '15:00', title: 'Hands-on Lab Session 2', description: 'Build your prompt library' },
      { time: '16:30', title: 'Graduation & Certificates', description: 'Wrap-up' },
    ],
  },
  {
    id: 'event-5',
    type: 'event',
    eventType: 'online',
    isLiveQA: true,
    name: 'Live Q&A Session',
    description: 'Real-time Q&A with our founder - ask anything about AI, career, or strategy.',
    date: new Date('2026-03-25'),
    location: 'Online (Zoom)',
    price: 500,
    capacity: 200,
    remainingSeats: 150,
    imageUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800',
    rating: 4.7,
    reviewCount: 123,
    overview: 'Join our founder for an exclusive live Q&A session. This is your opportunity to ask anything about AI trends, career advice, learning strategies, or get feedback on your projects. Questions are answered in real-time.',
    whatYouWillLearn: [
      'Get personalized advice for your situation',
      'Learn from others\' questions',
      'Understand current AI trends',
      'Career guidance from an expert',
    ],
    whoIsItFor: [
      'Anyone with questions about AI',
      'Career changers seeking guidance',
      'Students planning their path',
      'Professionals wanting expert insights',
    ],
    agenda: [
      { time: '20:00', title: 'Welcome & Introduction', description: 'Brief overview' },
      { time: '20:10', title: 'Live Q&A Session', description: '50 minutes of Q&A' },
      { time: '21:00', title: 'Closing Thoughts', description: 'Final remarks' },
    ],
  },
  {
    id: 'event-6',
    type: 'event',
    eventType: 'online',
    name: 'AI Tools Webinar',
    description: 'Free webinar introducing the latest AI tools for productivity.',
    date: new Date('2026-04-01'),
    location: 'Online (YouTube Live)',
    price: 0,
    capacity: 500,
    remainingSeats: 300,
    imageUrl: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800',
    rating: 4.5,
    reviewCount: 210,
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
      { time: '19:00', title: 'Introduction', description: 'Why AI tools matter' },
      { time: '19:15', title: 'Tool Showcase', description: 'Live demos of top tools' },
      { time: '19:45', title: 'Q&A', description: 'Your questions answered' },
      { time: '20:00', title: 'End', description: 'Resources and next steps' },
    ],
  },
];

export const MERCHANDISE: MerchandiseProduct[] = [
  {
    id: 'merch-1',
    type: 'merchandise',
    name: 'nuvaClub T-Shirt',
    description: 'Premium cotton t-shirt with nuvaClub logo. Comfortable and stylish.',
    price: 590,
    imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800',
    rating: 4.8,
    reviewCount: 156,
    variants: [
      { name: 'S', stock: 10 },
      { name: 'M', stock: 15 },
      { name: 'L', stock: 12 },
      { name: 'XL', stock: 8 },
    ],
  },
  {
    id: 'merch-2',
    type: 'merchandise',
    name: 'nuvaClub Mug',
    description: 'Ceramic mug, 350ml capacity. Perfect for your morning coffee.',
    price: 390,
    imageUrl: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=800',
    rating: 4.6,
    reviewCount: 89,
  },
  {
    id: 'merch-3',
    type: 'merchandise',
    name: 'Sticker Pack',
    description: 'Set of 6 vinyl stickers. Great for laptops, water bottles, and more.',
    price: 150,
    imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
    rating: 4.9,
    reviewCount: 234,
  },
  {
    id: 'merch-4',
    type: 'merchandise',
    name: 'nuvaClub Cap',
    description: 'Classic baseball cap with embroidered logo. Adjustable strap.',
    price: 490,
    imageUrl: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=800',
    rating: 4.7,
    reviewCount: 67,
    variants: [
      { name: 'One Size', stock: 20 },
    ],
  },
  {
    id: 'merch-5',
    type: 'merchandise',
    name: 'Canvas Tote Bag',
    description: 'Eco-friendly canvas tote. Spacious and durable for everyday use.',
    price: 350,
    imageUrl: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=800',
    rating: 4.8,
    reviewCount: 98,
  },
  {
    id: 'merch-6',
    type: 'merchandise',
    name: 'Metal Keychain',
    description: 'Premium metal keychain with nuvaClub emblem. Sleek and durable.',
    price: 190,
    imageUrl: 'https://images.unsplash.com/photo-1622434641406-a158123450f9?w=800',
    rating: 4.5,
    reviewCount: 145,
  },
  {
    id: 'merch-7',
    type: 'merchandise',
    name: 'Dot Grid Notebook',
    description: 'A5 dot grid notebook, 192 pages. Perfect for notes and sketches.',
    price: 290,
    imageUrl: 'https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=800',
    rating: 4.9,
    reviewCount: 112,
  },
];

// Helper function to get all products
export function getAllProducts(): Product[] {
  return [...PLANS, ...EVENTS, ...MERCHANDISE, ...DUO_PRODUCTS];
}

// Export Duo products
export { DUO_PRODUCTS } from './duo';

// IDs for products with special filter flags
const NEW_ARRIVAL_IDS = ['event-1', 'event-4', 'merch-7'];
const DISCOUNT_IDS = ['event-6']; // Free webinar

// Convert any product to ShopProduct format for unified display
export function toShopProduct(product: Product): ShopProduct {
  const categoryMap: Record<string, ProductCategory> = {
    'plan': 'plan',
    'event': 'event',
    'merchandise': 'merchant',
    'duo': 'duo',
  };

  const rating = 'rating' in product ? product.rating : 0;

  return {
    id: product.id,
    type: product.type,
    category: categoryMap[product.type],
    name: product.name,
    description: product.description,
    price: product.price,
    imageUrl: 'imageUrl' in product ? product.imageUrl : '',
    rating,
    reviewCount: 'reviewCount' in product ? product.reviewCount : 0,
    // Filter flags
    isNew: NEW_ARRIVAL_IDS.includes(product.id),
    isBestSeller: rating >= 4.8,
    isOnDiscount: DISCOUNT_IDS.includes(product.id) || product.price === 0,
  };
}

// Get all products as ShopProduct format
export function getAllShopProducts(): ShopProduct[] {
  return getAllProducts().map(toShopProduct);
}

// Get products by category
export function getProductsByCategory(category: ProductCategory): Product[] {
  const all = getAllProducts();
  const categoryMap: Record<ProductCategory, string> = {
    'plan': 'plan',
    'event': 'event',
    'merchant': 'merchandise',
    'duo': 'duo',
  };
  return all.filter((p) => p.type === categoryMap[category]);
}

// Get event by ID
export function getEventById(id: string): EventProduct | undefined {
  return EVENTS.find((event) => event.id === id);
}

// Get product by ID
export function getProductById(id: string): Product | undefined {
  return getAllProducts().find((p) => p.id === id);
}
