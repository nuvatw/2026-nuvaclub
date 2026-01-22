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
    { id: 'plan-explorer', type: 'plan', name: 'Explorer', description: 'Start your journey with free access to basic features and community content.', price: 0, imageUrl: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800', isActive: true, avgRating: 4.5, reviewCount: 234, createdAt: now, updatedAt: now },
    { id: 'plan-traveler', type: 'plan', name: 'Traveler', description: 'Unlock full access to courses, forum posting, and Sprint participation.', price: 990, imageUrl: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800', isActive: true, avgRating: 4.8, reviewCount: 156, createdAt: now, updatedAt: now },
    // Duo Tickets
    { id: 'ticket-go', type: 'duo-ticket', name: 'Duo Go', description: 'Monthly ticket with a general Nunu mentor for one-on-one companionship.', price: 990, imageUrl: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800', isActive: true, avgRating: 4.6, reviewCount: 89, createdAt: now, updatedAt: now },
    { id: 'ticket-run', type: 'duo-ticket', name: 'Duo Run', description: 'Quarterly ticket with a certified Nunu mentor for professional guidance.', price: 2490, imageUrl: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800', isActive: true, avgRating: 4.8, reviewCount: 67, createdAt: now, updatedAt: now },
    { id: 'ticket-fly', type: 'duo-ticket', name: 'Duo Fly', description: 'Premium quarterly ticket with one-on-one sessions with our founder.', price: 4990, imageUrl: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=800', isActive: true, avgRating: 5.0, reviewCount: 28, createdAt: now, updatedAt: now },
    // Events
    { id: 'event-1', type: 'event', name: 'AI Workshop', description: 'A full-day hands-on workshop covering Prompt engineering to automation.', price: 1990, imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800', isActive: true, avgRating: 4.7, reviewCount: 45, createdAt: now, updatedAt: now },
    { id: 'event-2', type: 'event', name: 'nuvaClub Meetup', description: 'Connect with community members, share experiences, and build lasting relationships.', price: 500, imageUrl: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800', isActive: true, avgRating: 4.9, reviewCount: 78, createdAt: now, updatedAt: now },
    { id: 'event-3', type: 'event', name: 'AI Entrepreneurs Forum', description: 'Exchange practical AI experience with successful entrepreneurs.', price: 1500, imageUrl: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800', isActive: true, avgRating: 4.8, reviewCount: 52, createdAt: now, updatedAt: now },
    { id: 'event-4', type: 'event', name: 'Prompt Engineering Lab', description: 'Deep dive into advanced prompt engineering techniques.', price: 2500, imageUrl: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800', isActive: true, avgRating: 4.9, reviewCount: 34, createdAt: now, updatedAt: now },
    { id: 'event-5', type: 'event', name: 'Live Q&A Session', description: 'Real-time Q&A with our founder - ask anything about AI, career, or strategy.', price: 500, imageUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800', isActive: true, avgRating: 4.7, reviewCount: 123, createdAt: now, updatedAt: now },
    { id: 'event-6', type: 'event', name: 'AI Tools Webinar', description: 'Free webinar introducing the latest AI tools for productivity.', price: 0, imageUrl: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800', isActive: true, avgRating: 4.5, reviewCount: 210, createdAt: now, updatedAt: now },
    // Merchandise
    { id: 'merch-1', type: 'merchandise', name: 'nuvaClub T-Shirt', description: 'Premium cotton t-shirt with nuvaClub logo. Comfortable and stylish.', price: 590, imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800', isActive: true, avgRating: 4.8, reviewCount: 156, createdAt: now, updatedAt: now },
    { id: 'merch-2', type: 'merchandise', name: 'nuvaClub Mug', description: 'Ceramic mug, 350ml capacity. Perfect for your morning coffee.', price: 390, imageUrl: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=800', isActive: true, avgRating: 4.6, reviewCount: 89, createdAt: now, updatedAt: now },
    { id: 'merch-3', type: 'merchandise', name: 'Sticker Pack', description: 'Set of 6 vinyl stickers. Great for laptops, water bottles, and more.', price: 150, imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800', isActive: true, avgRating: 4.9, reviewCount: 234, createdAt: now, updatedAt: now },
    { id: 'merch-4', type: 'merchandise', name: 'nuvaClub Cap', description: 'Classic baseball cap with embroidered logo. Adjustable strap.', price: 490, imageUrl: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=800', isActive: true, avgRating: 4.7, reviewCount: 67, createdAt: now, updatedAt: now },
    { id: 'merch-5', type: 'merchandise', name: 'Canvas Tote Bag', description: 'Eco-friendly canvas tote. Spacious and durable for everyday use.', price: 350, imageUrl: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=800', isActive: true, avgRating: 4.8, reviewCount: 98, createdAt: now, updatedAt: now },
    { id: 'merch-6', type: 'merchandise', name: 'Metal Keychain', description: 'Premium metal keychain with nuvaClub emblem. Sleek and durable.', price: 190, imageUrl: 'https://images.unsplash.com/photo-1622434641406-a158123450f9?w=800', isActive: true, avgRating: 4.5, reviewCount: 145, createdAt: now, updatedAt: now },
    { id: 'merch-7', type: 'merchandise', name: 'Dot Grid Notebook', description: 'A5 dot grid notebook, 192 pages. Perfect for notes and sketches.', price: 290, imageUrl: 'https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=800', isActive: true, avgRating: 4.9, reviewCount: 112, createdAt: now, updatedAt: now },
  ]);

  // ==========================================
  // PLAN PRODUCTS
  // ==========================================
  db.planProducts.createMany([
    { id: 'plan-prod-1', productId: 'plan-explorer', planType: 'explorer', billingCycle: 'monthly', features: ['Access first chapter of all courses', 'Browse forum discussions', 'View Sprint projects', 'Basic community access'], isPopular: false },
    { id: 'plan-prod-2', productId: 'plan-traveler', planType: 'traveler', billingCycle: 'monthly', features: ['Full access to all courses', 'Post and comment in forum', 'Submit Sprint projects', 'Vote on Sprint submissions', 'Priority support'], isPopular: true },
  ]);

  // ==========================================
  // DUO TICKET PRODUCTS
  // ==========================================
  db.duoTicketProducts.createMany([
    { id: 'duo-prod-1', productId: 'ticket-go', ticketType: 'go', duration: 'month', benefits: ['Enter Space', 'Match with general Nunu', 'Add Discord friend', 'One-on-one learning support'] },
    { id: 'duo-prod-2', productId: 'ticket-run', ticketType: 'run', duration: 'quarter', benefits: ['Enter Space', 'Match with certified Nunu', 'Add Discord friend', 'Professional learning guidance', 'Priority matching'] },
    { id: 'duo-prod-3', productId: 'ticket-fly', ticketType: 'fly', duration: 'quarter', benefits: ['Enter Space', 'One-on-one with founder', 'Add Discord friend', 'Deep consultation service', 'Career development advice', 'AI strategy planning'] },
  ]);

  // ==========================================
  // EVENT PRODUCTS
  // ==========================================
  db.eventProducts.createMany([
    { id: 'event-prod-1', productId: 'event-1', eventType: 'in-person', date: new Date('2026-02-15'), location: 'Xinyi District, Taipei', capacity: 30, remainingSeats: 12, overview: "Join us for an intensive full-day workshop where you'll learn practical AI skills from industry experts.", whatYouWillLearn: ['Master prompt engineering techniques', 'Build automated workflows', 'Integrate AI into daily work', 'AI-assisted content creation'], whoIsItFor: ['Professionals', 'Entrepreneurs', 'Students', 'Anyone curious about AI'], isLiveQA: false },
    { id: 'event-prod-2', productId: 'event-2', eventType: 'in-person', date: new Date('2026-03-01'), location: 'Daan District, Taipei', capacity: 50, remainingSeats: 35, overview: 'Monthly community meetup to connect with fellow nuvaClub members.', whatYouWillLearn: ['Network with professionals', 'Share AI journeys', 'Discover collaborations', 'Get community tips'], whoIsItFor: ['All nuvaClub members', 'Interested visitors', 'Networking seekers', 'Accountability partners'], isLiveQA: false },
    { id: 'event-prod-3', productId: 'event-3', eventType: 'in-person', date: new Date('2026-03-15'), location: 'Songshan District, Taipei', capacity: 100, remainingSeats: 45, overview: 'Learn from founders who successfully integrated AI into their businesses.', whatYouWillLearn: ['AI implementation strategies', 'Common pitfalls to avoid', 'ROI considerations', 'Building AI-first products'], whoIsItFor: ['Startup founders', 'Business owners', 'Product managers', 'Innovation leaders'], isLiveQA: false },
    { id: 'event-prod-4', productId: 'event-4', eventType: 'in-person', date: new Date('2026-03-20'), location: 'Zhongshan District, Taipei', capacity: 25, remainingSeats: 10, overview: 'Intensive small-group workshop on advanced prompt engineering.', whatYouWillLearn: ['Chain-of-thought prompting', 'Few-shot learning', 'System prompt optimization', 'Multi-modal prompting'], whoIsItFor: ['Developers', 'Content creators', 'Researchers', 'Advanced users'], isLiveQA: false },
    { id: 'event-prod-5', productId: 'event-5', eventType: 'online', date: new Date('2026-03-25'), location: 'Online (Zoom)', capacity: 200, remainingSeats: 150, overview: 'Exclusive live Q&A with our founder - ask anything!', whatYouWillLearn: ['Personalized advice', 'Learn from others', 'Current AI trends', 'Career guidance'], whoIsItFor: ['Anyone with questions', 'Career changers', 'Students', 'Professionals'], isLiveQA: true },
    { id: 'event-prod-6', productId: 'event-6', eventType: 'online', date: new Date('2026-04-01'), location: 'Online (YouTube Live)', capacity: 500, remainingSeats: 300, overview: 'Free webinar showcasing the best AI tools of 2026.', whatYouWillLearn: ['Top AI tools overview', 'Choosing the right tool', 'Free vs paid comparison', 'Getting started tips'], whoIsItFor: ['Beginners', 'Curious learners', 'Professionals exploring', 'Students'], isLiveQA: false },
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
    { id: 'merch-prod-1', productId: 'merch-1' },
    { id: 'merch-prod-2', productId: 'merch-2' },
    { id: 'merch-prod-3', productId: 'merch-3' },
    { id: 'merch-prod-4', productId: 'merch-4' },
    { id: 'merch-prod-5', productId: 'merch-5' },
    { id: 'merch-prod-6', productId: 'merch-6' },
    { id: 'merch-prod-7', productId: 'merch-7' },
  ]);

  // Merchandise variants
  db.merchandiseVariants.createMany([
    { id: 'var-1-1', merchandiseProductId: 'merch-prod-1', name: 'S', stock: 10 },
    { id: 'var-1-2', merchandiseProductId: 'merch-prod-1', name: 'M', stock: 15 },
    { id: 'var-1-3', merchandiseProductId: 'merch-prod-1', name: 'L', stock: 12 },
    { id: 'var-1-4', merchandiseProductId: 'merch-prod-1', name: 'XL', stock: 8 },
    { id: 'var-4-1', merchandiseProductId: 'merch-prod-4', name: 'One Size', stock: 20 },
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
      total: 1659,
      currency: 'TWD',
      paymentMethod: 'credit_card',
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
      quantity: 1,
      unitPrice: 990,
      totalPrice: 990,
    },
    {
      id: 'order-item-2',
      orderId: 'order-1',
      productId: 'merch-1',
      productName: 'nuvaClub T-Shirt',
      productType: 'merchandise',
      quantity: 1,
      unitPrice: 590,
      totalPrice: 590,
      selectedVariant: 'M',
    },
  ]);
}
