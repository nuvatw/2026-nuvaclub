import type { MockDB } from '../core/MockDB';

/**
 * Seed shop module data
 */
export async function seedShop(db: MockDB): Promise<void> {
  const now = new Date();

  // ==========================================
  // PRODUCTS (base table)
  // ==========================================
  db.products.createMany([
    // Plans
    { id: 'plan-explorer', type: 'plan', name: 'Explorer', description: 'Start your journey with free access to basic features and community content.', shortDescription: 'Free basic access', price: 0, currency: 'TWD', imageUrl: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800', isActive: true, isFeatured: false, slug: 'plan-explorer', createdAt: now, updatedAt: now },
    { id: 'plan-traveler', type: 'plan', name: 'Traveler', description: 'Unlock full access to courses, forum posting, and Sprint participation.', shortDescription: 'Full platform access', price: 990, currency: 'TWD', imageUrl: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800', isActive: true, isFeatured: true, slug: 'plan-traveler', createdAt: now, updatedAt: now },
    // Events
    { id: 'event-1', type: 'event', name: 'AI Workshop', description: 'A full-day hands-on workshop covering Prompt engineering to automation.', shortDescription: 'Full-day AI workshop', price: 1990, currency: 'TWD', imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800', isActive: true, isFeatured: true, slug: 'ai-workshop-feb-2026', createdAt: now, updatedAt: now },
    { id: 'event-2', type: 'event', name: 'nuvaClub Meetup', description: 'Connect with community members, share experiences, and build lasting relationships.', shortDescription: 'Community meetup', price: 500, currency: 'TWD', imageUrl: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800', isActive: true, isFeatured: false, slug: 'nuvaclub-meetup-mar-2026', createdAt: now, updatedAt: now },
    { id: 'event-3', type: 'event', name: 'AI Entrepreneurs Forum', description: 'Exchange practical AI experience with successful entrepreneurs.', shortDescription: 'Entrepreneur networking', price: 1500, currency: 'TWD', imageUrl: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800', isActive: true, isFeatured: false, slug: 'ai-entrepreneurs-forum', createdAt: now, updatedAt: now },
    { id: 'event-4', type: 'event', name: 'Prompt Engineering Lab', description: 'Deep dive into advanced prompt engineering techniques.', shortDescription: 'Advanced prompting', price: 2500, currency: 'TWD', imageUrl: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800', isActive: true, isFeatured: false, slug: 'prompt-engineering-lab', createdAt: now, updatedAt: now },
    { id: 'event-5', type: 'event', name: 'Live Q&A Session', description: 'Real-time Q&A with our founder - ask anything about AI, career, or strategy.', shortDescription: 'Live Q&A session', price: 500, currency: 'TWD', imageUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800', isActive: true, isFeatured: false, slug: 'live-qa-session', createdAt: now, updatedAt: now },
    { id: 'event-6', type: 'event', name: 'AI Tools Webinar', description: 'Free webinar introducing the latest AI tools for productivity.', shortDescription: 'Free AI tools webinar', price: 0, currency: 'TWD', imageUrl: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800', isActive: true, isFeatured: false, slug: 'ai-tools-webinar', createdAt: now, updatedAt: now },
    // Merchandise
    { id: 'merch-1', type: 'merchandise', name: 'nuvaClub T-Shirt', description: 'Premium cotton t-shirt with nuvaClub logo. Comfortable and stylish.', shortDescription: 'Premium cotton tee', price: 590, currency: 'TWD', imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800', isActive: true, isFeatured: true, slug: 'nuvaclub-tshirt', createdAt: now, updatedAt: now },
    { id: 'merch-2', type: 'merchandise', name: 'nuvaClub Mug', description: 'Ceramic mug, 350ml capacity. Perfect for your morning coffee.', shortDescription: '350ml ceramic mug', price: 390, currency: 'TWD', imageUrl: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=800', isActive: true, isFeatured: false, slug: 'nuvaclub-mug', createdAt: now, updatedAt: now },
    { id: 'merch-3', type: 'merchandise', name: 'Sticker Pack', description: 'Set of 6 vinyl stickers. Great for laptops, water bottles, and more.', shortDescription: '6-piece sticker set', price: 150, currency: 'TWD', imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800', isActive: true, isFeatured: false, slug: 'sticker-pack', createdAt: now, updatedAt: now },
    { id: 'merch-4', type: 'merchandise', name: 'nuvaClub Cap', description: 'Classic baseball cap with embroidered logo. Adjustable strap.', shortDescription: 'Embroidered cap', price: 490, currency: 'TWD', imageUrl: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=800', isActive: true, isFeatured: false, slug: 'nuvaclub-cap', createdAt: now, updatedAt: now },
    { id: 'merch-5', type: 'merchandise', name: 'Canvas Tote Bag', description: 'Eco-friendly canvas tote. Spacious and durable for everyday use.', shortDescription: 'Eco-friendly tote', price: 350, currency: 'TWD', imageUrl: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=800', isActive: true, isFeatured: false, slug: 'canvas-tote-bag', createdAt: now, updatedAt: now },
    { id: 'merch-6', type: 'merchandise', name: 'Metal Keychain', description: 'Premium metal keychain with nuvaClub emblem. Sleek and durable.', shortDescription: 'Metal emblem keychain', price: 190, currency: 'TWD', imageUrl: 'https://images.unsplash.com/photo-1622434641406-a158123450f9?w=800', isActive: true, isFeatured: false, slug: 'metal-keychain', createdAt: now, updatedAt: now },
    { id: 'merch-7', type: 'merchandise', name: 'Dot Grid Notebook', description: 'A5 dot grid notebook, 192 pages. Perfect for notes and sketches.', shortDescription: 'A5 dot grid notebook', price: 290, currency: 'TWD', imageUrl: 'https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=800', isActive: true, isFeatured: false, slug: 'dot-grid-notebook', createdAt: now, updatedAt: now },
  ]);

  // ==========================================
  // PRODUCT STATS (denormalized statistics)
  // ==========================================
  db.productStats.createMany([
    { productId: 'plan-explorer', totalRatings: 234, sumRatings: 1053, avgRating: 4.5, totalSold: 5000, totalRevenue: 0, viewCount: 15000, lastUpdatedAt: now },
    { productId: 'plan-traveler', totalRatings: 156, sumRatings: 749, avgRating: 4.8, totalSold: 1200, totalRevenue: 1188000, viewCount: 8500, lastUpdatedAt: now },
    { productId: 'event-1', totalRatings: 45, sumRatings: 212, avgRating: 4.7, totalSold: 180, totalRevenue: 358200, viewCount: 2800, lastUpdatedAt: now },
    { productId: 'event-2', totalRatings: 78, sumRatings: 382, avgRating: 4.9, totalSold: 350, totalRevenue: 175000, viewCount: 4200, lastUpdatedAt: now },
    { productId: 'event-3', totalRatings: 52, sumRatings: 250, avgRating: 4.8, totalSold: 150, totalRevenue: 225000, viewCount: 1900, lastUpdatedAt: now },
    { productId: 'event-4', totalRatings: 34, sumRatings: 167, avgRating: 4.9, totalSold: 75, totalRevenue: 187500, viewCount: 1200, lastUpdatedAt: now },
    { productId: 'event-5', totalRatings: 123, sumRatings: 578, avgRating: 4.7, totalSold: 600, totalRevenue: 300000, viewCount: 5500, lastUpdatedAt: now },
    { productId: 'event-6', totalRatings: 210, sumRatings: 945, avgRating: 4.5, totalSold: 1500, totalRevenue: 0, viewCount: 12000, lastUpdatedAt: now },
    { productId: 'merch-1', totalRatings: 156, sumRatings: 749, avgRating: 4.8, totalSold: 890, totalRevenue: 525100, viewCount: 4500, lastUpdatedAt: now },
    { productId: 'merch-2', totalRatings: 89, sumRatings: 409, avgRating: 4.6, totalSold: 620, totalRevenue: 241800, viewCount: 3100, lastUpdatedAt: now },
    { productId: 'merch-3', totalRatings: 234, sumRatings: 1147, avgRating: 4.9, totalSold: 1450, totalRevenue: 217500, viewCount: 6800, lastUpdatedAt: now },
    { productId: 'merch-4', totalRatings: 67, sumRatings: 315, avgRating: 4.7, totalSold: 340, totalRevenue: 166600, viewCount: 2200, lastUpdatedAt: now },
    { productId: 'merch-5', totalRatings: 98, sumRatings: 470, avgRating: 4.8, totalSold: 520, totalRevenue: 182000, viewCount: 2900, lastUpdatedAt: now },
    { productId: 'merch-6', totalRatings: 145, sumRatings: 653, avgRating: 4.5, totalSold: 780, totalRevenue: 148200, viewCount: 3800, lastUpdatedAt: now },
    { productId: 'merch-7', totalRatings: 112, sumRatings: 549, avgRating: 4.9, totalSold: 410, totalRevenue: 118900, viewCount: 2400, lastUpdatedAt: now },
  ]);

  // ==========================================
  // PLAN PRODUCTS
  // ==========================================
  db.planProducts.createMany([
    { id: 'plan-prod-1', productId: 'plan-explorer', planType: 'explorer', billingCycle: 'monthly', isPopular: false, isRecommended: false },
    { id: 'plan-prod-2', productId: 'plan-traveler', planType: 'traveler', billingCycle: 'monthly', isPopular: true, isRecommended: true },
  ]);

  // ==========================================
  // PLAN PRODUCT FEATURES (junction table)
  // ==========================================
  db.planProductFeatures.createMany([
    // Explorer features
    { id: 'ppf-1-1', planProductId: 'plan-prod-1', feature: 'Access first chapter of all courses', isHighlighted: false, sortOrder: 1 },
    { id: 'ppf-1-2', planProductId: 'plan-prod-1', feature: 'Browse forum discussions', isHighlighted: false, sortOrder: 2 },
    { id: 'ppf-1-3', planProductId: 'plan-prod-1', feature: 'View Sprint projects', isHighlighted: false, sortOrder: 3 },
    { id: 'ppf-1-4', planProductId: 'plan-prod-1', feature: 'Basic community access', isHighlighted: false, sortOrder: 4 },
    // Traveler features
    { id: 'ppf-2-1', planProductId: 'plan-prod-2', feature: 'Full access to all courses', isHighlighted: true, sortOrder: 1 },
    { id: 'ppf-2-2', planProductId: 'plan-prod-2', feature: 'Post and comment in forum', isHighlighted: true, sortOrder: 2 },
    { id: 'ppf-2-3', planProductId: 'plan-prod-2', feature: 'Submit Sprint projects', isHighlighted: false, sortOrder: 3 },
    { id: 'ppf-2-4', planProductId: 'plan-prod-2', feature: 'Vote on Sprint submissions', isHighlighted: false, sortOrder: 4 },
    { id: 'ppf-2-5', planProductId: 'plan-prod-2', feature: 'Priority support', isHighlighted: false, sortOrder: 5 },
  ]);

  // ==========================================
  // EVENT PRODUCTS
  // ==========================================
  db.eventProducts.createMany([
    { id: 'event-prod-1', productId: 'event-1', eventType: 'in-person', date: new Date('2026-02-15'), location: 'Xinyi District, Taipei', timezone: 'Asia/Taipei', capacity: 30, remainingSeats: 12, overview: "Join us for an intensive full-day workshop where you'll learn practical AI skills from industry experts.", isLiveQA: false },
    { id: 'event-prod-2', productId: 'event-2', eventType: 'in-person', date: new Date('2026-03-01'), location: 'Daan District, Taipei', timezone: 'Asia/Taipei', capacity: 50, remainingSeats: 35, overview: 'Monthly community meetup to connect with fellow nuvaClub members.', isLiveQA: false },
    { id: 'event-prod-3', productId: 'event-3', eventType: 'in-person', date: new Date('2026-03-15'), location: 'Songshan District, Taipei', timezone: 'Asia/Taipei', capacity: 100, remainingSeats: 45, overview: 'Learn from founders who successfully integrated AI into their businesses.', isLiveQA: false },
    { id: 'event-prod-4', productId: 'event-4', eventType: 'in-person', date: new Date('2026-03-20'), location: 'Zhongshan District, Taipei', timezone: 'Asia/Taipei', capacity: 25, remainingSeats: 10, overview: 'Intensive small-group workshop on advanced prompt engineering.', isLiveQA: false },
    { id: 'event-prod-5', productId: 'event-5', eventType: 'online', date: new Date('2026-03-25'), location: 'Online (Zoom)', timezone: 'Asia/Taipei', capacity: 200, remainingSeats: 150, overview: 'Exclusive live Q&A with our founder - ask anything!', isLiveQA: true },
    { id: 'event-prod-6', productId: 'event-6', eventType: 'online', date: new Date('2026-04-01'), location: 'Online (YouTube Live)', timezone: 'Asia/Taipei', capacity: 500, remainingSeats: 300, overview: 'Free webinar showcasing the best AI tools of 2026.', isLiveQA: false },
  ]);

  // ==========================================
  // EVENT LEARNING OUTCOMES (junction table)
  // ==========================================
  db.eventLearningOutcomes.createMany([
    // Event 1 learning outcomes
    { id: 'elo-1-1', eventProductId: 'event-prod-1', outcome: 'Master prompt engineering techniques', sortOrder: 1 },
    { id: 'elo-1-2', eventProductId: 'event-prod-1', outcome: 'Build automated workflows', sortOrder: 2 },
    { id: 'elo-1-3', eventProductId: 'event-prod-1', outcome: 'Integrate AI into daily work', sortOrder: 3 },
    { id: 'elo-1-4', eventProductId: 'event-prod-1', outcome: 'AI-assisted content creation', sortOrder: 4 },
    // Event 2 learning outcomes
    { id: 'elo-2-1', eventProductId: 'event-prod-2', outcome: 'Network with professionals', sortOrder: 1 },
    { id: 'elo-2-2', eventProductId: 'event-prod-2', outcome: 'Share AI journeys', sortOrder: 2 },
    { id: 'elo-2-3', eventProductId: 'event-prod-2', outcome: 'Discover collaborations', sortOrder: 3 },
    { id: 'elo-2-4', eventProductId: 'event-prod-2', outcome: 'Get community tips', sortOrder: 4 },
    // Event 3 learning outcomes
    { id: 'elo-3-1', eventProductId: 'event-prod-3', outcome: 'AI implementation strategies', sortOrder: 1 },
    { id: 'elo-3-2', eventProductId: 'event-prod-3', outcome: 'Common pitfalls to avoid', sortOrder: 2 },
    { id: 'elo-3-3', eventProductId: 'event-prod-3', outcome: 'ROI considerations', sortOrder: 3 },
    { id: 'elo-3-4', eventProductId: 'event-prod-3', outcome: 'Building AI-first products', sortOrder: 4 },
    // Event 4 learning outcomes
    { id: 'elo-4-1', eventProductId: 'event-prod-4', outcome: 'Chain-of-thought prompting', sortOrder: 1 },
    { id: 'elo-4-2', eventProductId: 'event-prod-4', outcome: 'Few-shot learning', sortOrder: 2 },
    { id: 'elo-4-3', eventProductId: 'event-prod-4', outcome: 'System prompt optimization', sortOrder: 3 },
    { id: 'elo-4-4', eventProductId: 'event-prod-4', outcome: 'Multi-modal prompting', sortOrder: 4 },
    // Event 5 learning outcomes
    { id: 'elo-5-1', eventProductId: 'event-prod-5', outcome: 'Personalized advice', sortOrder: 1 },
    { id: 'elo-5-2', eventProductId: 'event-prod-5', outcome: 'Learn from others', sortOrder: 2 },
    { id: 'elo-5-3', eventProductId: 'event-prod-5', outcome: 'Current AI trends', sortOrder: 3 },
    { id: 'elo-5-4', eventProductId: 'event-prod-5', outcome: 'Career guidance', sortOrder: 4 },
    // Event 6 learning outcomes
    { id: 'elo-6-1', eventProductId: 'event-prod-6', outcome: 'Top AI tools overview', sortOrder: 1 },
    { id: 'elo-6-2', eventProductId: 'event-prod-6', outcome: 'Choosing the right tool', sortOrder: 2 },
    { id: 'elo-6-3', eventProductId: 'event-prod-6', outcome: 'Free vs paid comparison', sortOrder: 3 },
    { id: 'elo-6-4', eventProductId: 'event-prod-6', outcome: 'Getting started tips', sortOrder: 4 },
  ]);

  // ==========================================
  // EVENT TARGET AUDIENCES (junction table)
  // ==========================================
  db.eventTargetAudiences.createMany([
    // Event 1 target audience
    { id: 'eta-1-1', eventProductId: 'event-prod-1', audience: 'Professionals', sortOrder: 1 },
    { id: 'eta-1-2', eventProductId: 'event-prod-1', audience: 'Entrepreneurs', sortOrder: 2 },
    { id: 'eta-1-3', eventProductId: 'event-prod-1', audience: 'Students', sortOrder: 3 },
    { id: 'eta-1-4', eventProductId: 'event-prod-1', audience: 'Anyone curious about AI', sortOrder: 4 },
    // Event 2 target audience
    { id: 'eta-2-1', eventProductId: 'event-prod-2', audience: 'All nuvaClub members', sortOrder: 1 },
    { id: 'eta-2-2', eventProductId: 'event-prod-2', audience: 'Interested visitors', sortOrder: 2 },
    { id: 'eta-2-3', eventProductId: 'event-prod-2', audience: 'Networking seekers', sortOrder: 3 },
    { id: 'eta-2-4', eventProductId: 'event-prod-2', audience: 'Accountability partners', sortOrder: 4 },
    // Event 3 target audience
    { id: 'eta-3-1', eventProductId: 'event-prod-3', audience: 'Startup founders', sortOrder: 1 },
    { id: 'eta-3-2', eventProductId: 'event-prod-3', audience: 'Business owners', sortOrder: 2 },
    { id: 'eta-3-3', eventProductId: 'event-prod-3', audience: 'Product managers', sortOrder: 3 },
    { id: 'eta-3-4', eventProductId: 'event-prod-3', audience: 'Innovation leaders', sortOrder: 4 },
    // Event 4 target audience
    { id: 'eta-4-1', eventProductId: 'event-prod-4', audience: 'Developers', sortOrder: 1 },
    { id: 'eta-4-2', eventProductId: 'event-prod-4', audience: 'Content creators', sortOrder: 2 },
    { id: 'eta-4-3', eventProductId: 'event-prod-4', audience: 'Researchers', sortOrder: 3 },
    { id: 'eta-4-4', eventProductId: 'event-prod-4', audience: 'Advanced users', sortOrder: 4 },
    // Event 5 target audience
    { id: 'eta-5-1', eventProductId: 'event-prod-5', audience: 'Anyone with questions', sortOrder: 1 },
    { id: 'eta-5-2', eventProductId: 'event-prod-5', audience: 'Career changers', sortOrder: 2 },
    { id: 'eta-5-3', eventProductId: 'event-prod-5', audience: 'Students', sortOrder: 3 },
    { id: 'eta-5-4', eventProductId: 'event-prod-5', audience: 'Professionals', sortOrder: 4 },
    // Event 6 target audience
    { id: 'eta-6-1', eventProductId: 'event-prod-6', audience: 'Beginners', sortOrder: 1 },
    { id: 'eta-6-2', eventProductId: 'event-prod-6', audience: 'Curious learners', sortOrder: 2 },
    { id: 'eta-6-3', eventProductId: 'event-prod-6', audience: 'Professionals exploring', sortOrder: 3 },
    { id: 'eta-6-4', eventProductId: 'event-prod-6', audience: 'Students', sortOrder: 4 },
  ]);

  // Event agenda items
  db.eventAgendaItems.createMany([
    // Event 1 agenda
    { id: 'agenda-1-1', eventProductId: 'event-prod-1', time: '09:00', title: 'Registration & Welcome', description: 'Check-in, networking, and coffee', sortOrder: 1 },
    { id: 'agenda-1-2', eventProductId: 'event-prod-1', time: '09:30', title: 'Prompt Engineering Fundamentals', description: 'Learn the core principles', sortOrder: 2 },
    { id: 'agenda-1-3', eventProductId: 'event-prod-1', time: '11:00', title: 'Break', description: 'Refreshments and networking', sortOrder: 3 },
    { id: 'agenda-1-4', eventProductId: 'event-prod-1', time: '11:15', title: 'Hands-on Workshop Part 1', description: 'Build your first AI workflow', sortOrder: 4 },
    { id: 'agenda-1-5', eventProductId: 'event-prod-1', time: '12:30', title: 'Lunch', description: 'Catered lunch with networking', sortOrder: 5 },
    { id: 'agenda-1-6', eventProductId: 'event-prod-1', time: '13:30', title: 'Advanced Automation', description: 'Multi-step workflows', sortOrder: 6 },
    { id: 'agenda-1-7', eventProductId: 'event-prod-1', time: '15:00', title: 'Break', description: 'Refreshments', sortOrder: 7 },
    { id: 'agenda-1-8', eventProductId: 'event-prod-1', time: '15:15', title: 'Hands-on Workshop Part 2', description: 'Complete your AI toolkit', sortOrder: 8 },
    { id: 'agenda-1-9', eventProductId: 'event-prod-1', time: '16:45', title: 'Q&A and Wrap-up', description: 'Final questions and next steps', sortOrder: 9 },
    // Event 2 agenda
    { id: 'agenda-2-1', eventProductId: 'event-prod-2', time: '18:30', title: 'Doors Open', description: 'Arrive and mingle', sortOrder: 1 },
    { id: 'agenda-2-2', eventProductId: 'event-prod-2', time: '19:00', title: 'Welcome & Introductions', description: 'Overview and icebreakers', sortOrder: 2 },
    { id: 'agenda-2-3', eventProductId: 'event-prod-2', time: '19:30', title: 'Lightning Talks', description: 'Community stories', sortOrder: 3 },
    { id: 'agenda-2-4', eventProductId: 'event-prod-2', time: '20:15', title: 'Open Networking', description: 'Free-form networking', sortOrder: 4 },
    { id: 'agenda-2-5', eventProductId: 'event-prod-2', time: '21:30', title: 'Closing', description: 'Wrap-up and announcements', sortOrder: 5 },
  ]);

  // Event FAQs
  db.eventFAQs.createMany([
    { id: 'faq-1-1', eventProductId: 'event-prod-1', question: 'Do I need prior AI experience?', answer: 'No! This workshop is designed for beginners and intermediate users alike.', sortOrder: 1 },
    { id: 'faq-1-2', eventProductId: 'event-prod-1', question: 'What should I bring?', answer: 'Just bring your laptop with internet access. All tools and accounts will be provided.', sortOrder: 2 },
    { id: 'faq-1-3', eventProductId: 'event-prod-1', question: 'Is lunch included?', answer: 'Yes, lunch and refreshments are included in the ticket price.', sortOrder: 3 },
  ]);

  // ==========================================
  // MERCHANDISE PRODUCTS
  // ==========================================
  db.merchandiseProducts.createMany([
    { id: 'merch-prod-1', productId: 'merch-1', requiresShipping: true },
    { id: 'merch-prod-2', productId: 'merch-2', requiresShipping: true },
    { id: 'merch-prod-3', productId: 'merch-3', requiresShipping: true },
    { id: 'merch-prod-4', productId: 'merch-4', requiresShipping: true },
    { id: 'merch-prod-5', productId: 'merch-5', requiresShipping: true },
    { id: 'merch-prod-6', productId: 'merch-6', requiresShipping: true },
    { id: 'merch-prod-7', productId: 'merch-7', requiresShipping: true },
  ]);

  // Merchandise variants
  db.merchandiseVariants.createMany([
    { id: 'var-1-1', merchandiseProductId: 'merch-prod-1', name: 'S', sku: 'TSHIRT-S', stock: 10, isActive: true, createdAt: now, updatedAt: now },
    { id: 'var-1-2', merchandiseProductId: 'merch-prod-1', name: 'M', sku: 'TSHIRT-M', stock: 15, isActive: true, createdAt: now, updatedAt: now },
    { id: 'var-1-3', merchandiseProductId: 'merch-prod-1', name: 'L', sku: 'TSHIRT-L', stock: 12, isActive: true, createdAt: now, updatedAt: now },
    { id: 'var-1-4', merchandiseProductId: 'merch-prod-1', name: 'XL', sku: 'TSHIRT-XL', stock: 8, isActive: true, createdAt: now, updatedAt: now },
    { id: 'var-4-1', merchandiseProductId: 'merch-prod-4', name: 'One Size', sku: 'CAP-OS', stock: 20, isActive: true, createdAt: now, updatedAt: now },
  ]);

  // ==========================================
  // DISCOUNT CODES
  // ==========================================
  db.discountCodes.createMany([
    { id: 'discount-1', code: 'WELCOME10', description: 'Welcome discount for new users', discountType: 'percentage', discountValue: 10, maxUses: 1000, usedCount: 234, maxUsesPerUser: 1, validFrom: new Date('2026-01-01'), validUntil: new Date('2026-12-31'), isActive: true, createdAt: now, updatedAt: now },
    { id: 'discount-2', code: 'NEWYEAR2026', description: 'New Year special offer', discountType: 'fixed', discountValue: 200, maxUses: 500, usedCount: 89, maxUsesPerUser: 1, minOrderAmount: 1000, validFrom: new Date('2026-01-01'), validUntil: new Date('2026-01-31'), isActive: true, createdAt: now, updatedAt: now },
  ]);

  // ==========================================
  // SAMPLE ORDER
  // ==========================================
  db.orders.createMany([
    {
      id: 'order-1',
      userId: 'user-1',
      orderNumber: 'ORD-2026-00001',
      status: 'completed',
      subtotal: 1580,
      discount: 0,
      tax: 79,
      shippingCost: 60,
      total: 1719,
      currency: 'TWD',
      paymentMethod: 'credit-card',
      paidAt: new Date('2026-01-15T10:30:00'),
      completedAt: new Date('2026-01-15T10:35:00'),
      createdAt: new Date('2026-01-15T10:30:00'),
      updatedAt: new Date('2026-01-15T10:35:00'),
    },
  ]);

  db.orderItems.createMany([
    {
      id: 'order-item-1',
      orderId: 'order-1',
      productId: 'plan-traveler',
      productName: 'Traveler',
      productType: 'plan',
      productImageUrl: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800',
      quantity: 1,
      unitPrice: 990,
      totalPrice: 990,
      createdAt: new Date('2026-01-15T10:30:00'),
    },
    {
      id: 'order-item-2',
      orderId: 'order-1',
      productId: 'merch-1',
      productName: 'nuvaClub T-Shirt',
      productType: 'merchandise',
      productImageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800',
      variantId: 'var-1-2',
      variantName: 'M',
      quantity: 1,
      unitPrice: 590,
      totalPrice: 590,
      createdAt: new Date('2026-01-15T10:30:00'),
    },
  ]);
}
