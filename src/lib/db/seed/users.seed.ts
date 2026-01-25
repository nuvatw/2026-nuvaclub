import type { MockDB } from '../core/MockDB';

/**
 * Seed users data
 *
 * 20 Canonical Users (used consistently across all platform data):
 *
 * NUNUS (6 active mentors):
 * - user-2 (Sarah Lin) - N4, Regular - Automation specialist
 * - user-4 (Emily Huang) - N2, Verified - AI Strategy expert
 * - user-10 (Amy Lin) - N1, Verified - Master mentor
 * - user-11 (Ryan Chen) - N5, Regular - Beginner mentor
 * - user-14 (Sophia Wang) - N3, Verified - Product AI expert
 * - user-18 (Eric Liu) - N4, Regular - Full-stack mentor
 *
 * VAVAS (8 learners, 6 paired):
 * - user-1 (Alex Chen) - Paired with Sarah (3 months)
 * - user-5 (Kevin Lee) - Paired with Emily (2 months)
 * - user-6 (Jessica Wu) - Paired with Amy (6 months)
 * - user-7 (David Zhang) - Paired with Ryan (1 month)
 * - user-8 (Lisa Chen) - Looking for Nunu
 * - user-12 (Mia Huang) - Paired with Sophia (4 months)
 * - user-15 (Noah Lin) - Looking for Nunu
 * - user-17 (Zoe Wu) - Paired with Eric (3 months)
 *
 * EXPLORERS/NEW (6 users):
 * - user-3 (Mike Wang) - Explorer, browsing
 * - user-9 (Tom Huang) - Pending Nunu application
 * - user-13 (Olivia Lee) - New explorer
 * - user-16 (Ethan Chen) - Interested in becoming Nunu
 * - user-19 (Hannah Zhang) - New explorer
 * - user-20 (Lucas Wang) - New explorer
 */
export async function seedUsers(db: MockDB): Promise<void> {
  const now = new Date();

  // ==========================================
  // 20 Canonical Users
  // ==========================================
  db.users.createMany([
    // === VAVAS (Learners) ===
    // 1. Alex Chen - Paired with Sarah Lin
    {
      id: 'user-1',
      email: 'alex@nuvaclub.test',
      name: 'Alex Chen',
      avatar: 'https://avatar.iran.liara.run/public/boy?username=alex',
      bio: 'Passionate learner exploring web development and design. Currently learning automation with my Nunu.',
      discordId: 'alexchen#1234',
      githubUsername: 'alexchen-dev',
      identityType: 'solo-traveler',
      emailVerified: true,
      createdAt: new Date('2025-10-15'),
      updatedAt: now,
      lastLoginAt: new Date('2026-01-22'),
    },
    // 5. Kevin Lee - Paired with Emily Huang
    {
      id: 'user-5',
      email: 'kevin@nuvaclub.test',
      name: 'Kevin Lee',
      avatar: 'https://avatar.iran.liara.run/public/boy?username=kevin',
      bio: 'Startup founder learning to integrate AI into business processes.',
      discordId: 'kevinlee#7890',
      githubUsername: 'kevinlee-startup',
      identityType: 'solo-traveler',
      emailVerified: true,
      createdAt: new Date('2025-11-10'),
      updatedAt: now,
      lastLoginAt: new Date('2026-01-21'),
    },
    // 6. Jessica Wu - Paired with Amy Lin
    {
      id: 'user-6',
      email: 'jessica@nuvaclub.test',
      name: 'Jessica Wu',
      avatar: 'https://avatar.iran.liara.run/public/girl?username=jessica',
      bio: 'UI/UX enthusiast learning frontend development. Committed to 6-month intensive mentorship.',
      discordId: 'jessicawu#2345',
      githubUsername: 'jessicawu-design',
      identityType: 'voyager',
      emailVerified: true,
      createdAt: new Date('2025-08-15'),
      updatedAt: now,
      lastLoginAt: new Date('2026-01-22'),
    },
    // 7. David Zhang - Paired with Ryan Chen
    {
      id: 'user-7',
      email: 'david@nuvaclub.test',
      name: 'David Zhang',
      avatar: 'https://avatar.iran.liara.run/public/boy?username=david',
      bio: 'Complete beginner starting my AI journey. Taking it one month at a time.',
      discordId: 'davidzhang#6789',
      githubUsername: 'davidzhang-learn',
      identityType: 'explorer',
      emailVerified: true,
      createdAt: new Date('2026-01-05'),
      updatedAt: now,
      lastLoginAt: new Date('2026-01-22'),
    },
    // 8. Lisa Chen - Looking for Nunu
    {
      id: 'user-8',
      email: 'lisa@nuvaclub.test',
      name: 'Lisa Chen',
      avatar: 'https://avatar.iran.liara.run/public/girl?username=lisa',
      bio: 'Active community member seeking a patient mentor to guide my learning.',
      discordId: 'lisachen#0123',
      githubUsername: 'lisachen-code',
      identityType: 'explorer',
      emailVerified: true,
      createdAt: new Date('2025-12-01'),
      updatedAt: now,
      lastLoginAt: new Date('2026-01-22'),
    },
    // 12. Mia Huang - Paired with Sophia Wang
    {
      id: 'user-12',
      email: 'mia@nuvaclub.test',
      name: 'Mia Huang',
      avatar: 'https://avatar.iran.liara.run/public/girl?username=mia',
      bio: 'Product manager learning to integrate AI into product workflows. 4-month commitment.',
      discordId: 'miahuang#4567',
      githubUsername: 'miahuang-pm',
      identityType: 'solo-traveler',
      emailVerified: true,
      createdAt: new Date('2025-10-20'),
      updatedAt: now,
      lastLoginAt: new Date('2026-01-21'),
    },
    // 15. Noah Lin - Looking for Nunu
    {
      id: 'user-15',
      email: 'noah@nuvaclub.test',
      name: 'Noah Lin',
      avatar: 'https://avatar.iran.liara.run/public/boy?username=noah',
      bio: 'Software developer wanting to learn advanced AI techniques from a verified mentor.',
      discordId: 'noahlin#8901',
      githubUsername: 'noahlin-dev',
      identityType: 'solo-traveler',
      emailVerified: true,
      createdAt: new Date('2025-11-15'),
      updatedAt: now,
      lastLoginAt: new Date('2026-01-20'),
    },
    // 17. Zoe Wu - Paired with Eric Liu
    {
      id: 'user-17',
      email: 'zoe@nuvaclub.test',
      name: 'Zoe Wu',
      avatar: 'https://avatar.iran.liara.run/public/girl?username=zoe',
      bio: 'Frontend developer expanding into full-stack with AI. 3-month intensive program.',
      discordId: 'zoewu#2345',
      githubUsername: 'zoewu-frontend',
      identityType: 'solo-traveler',
      emailVerified: true,
      createdAt: new Date('2025-11-01'),
      updatedAt: now,
      lastLoginAt: new Date('2026-01-22'),
    },

    // === NUNUS (Mentors) ===
    // 2. Sarah Lin - N4, Regular - Automation specialist
    {
      id: 'user-2',
      email: 'sarah@nuvaclub.test',
      name: 'Sarah Lin',
      avatar: 'https://avatar.iran.liara.run/public/girl?username=sarah',
      bio: 'Senior developer and N4 Nunu mentor. Specializing in automation workflows with Make.com and Zapier.',
      discordId: 'sarahlin#5678',
      githubUsername: 'sarahlin-automation',
      identityType: 'solo-traveler',
      emailVerified: true,
      createdAt: new Date('2025-08-01'),
      updatedAt: now,
      lastLoginAt: new Date('2026-01-22'),
    },
    // 4. Emily Huang - N2, Verified - AI Strategy expert
    {
      id: 'user-4',
      email: 'emily@nuvaclub.test',
      name: 'Emily Huang',
      avatar: 'https://avatar.iran.liara.run/public/girl?username=emily',
      bio: 'Certified N2 Nunu and AI Strategy consultant. Helping businesses leverage AI effectively.',
      discordId: 'emilyhuang#3456',
      githubUsername: 'emilyhuang-ai',
      identityType: 'solo-traveler',
      emailVerified: true,
      createdAt: new Date('2025-07-01'),
      updatedAt: now,
      lastLoginAt: new Date('2026-01-22'),
    },
    // 10. Amy Lin - N1, Verified - Master mentor (Voyager)
    {
      id: 'user-10',
      email: 'amy@nuvaclub.test',
      name: 'Amy Lin',
      avatar: 'https://avatar.iran.liara.run/public/girl?username=amy',
      bio: 'Master N1 Nunu with 10+ years experience. Helped 100+ learners achieve their goals.',
      discordId: 'amylin#8901',
      githubUsername: 'amylin-master',
      identityType: 'voyager',
      emailVerified: true,
      createdAt: new Date('2025-06-01'),
      updatedAt: now,
      lastLoginAt: new Date('2026-01-22'),
    },
    // 11. Ryan Chen - N5, Regular - Beginner mentor
    {
      id: 'user-11',
      email: 'ryan@nuvaclub.test',
      name: 'Ryan Chen',
      avatar: 'https://avatar.iran.liara.run/public/boy?username=ryan',
      bio: 'New N5 Nunu excited to help fellow beginners. Patient and understanding approach.',
      discordId: 'ryanchen#1234',
      githubUsername: 'ryanchen-nunu',
      identityType: 'explorer',
      emailVerified: true,
      createdAt: new Date('2025-12-01'),
      updatedAt: now,
      lastLoginAt: new Date('2026-01-21'),
    },
    // 14. Sophia Wang - N3, Verified - Product AI expert (Voyager)
    {
      id: 'user-14',
      email: 'sophia@nuvaclub.test',
      name: 'Sophia Wang',
      avatar: 'https://avatar.iran.liara.run/public/girl?username=sophia',
      bio: 'Certified N3 Nunu specializing in AI for product development. Former PM at tech startup.',
      discordId: 'sophiawang#5678',
      githubUsername: 'sophiawang-product',
      identityType: 'voyager',
      emailVerified: true,
      createdAt: new Date('2025-09-01'),
      updatedAt: now,
      lastLoginAt: new Date('2026-01-22'),
    },
    // 18. Eric Liu - N4, Regular - Full-stack mentor
    {
      id: 'user-18',
      email: 'eric@nuvaclub.test',
      name: 'Eric Liu',
      avatar: 'https://avatar.iran.liara.run/public/boy?username=eric',
      bio: 'N4 Nunu and full-stack developer. Teaching modern web development with AI integration.',
      discordId: 'ericliu#9012',
      githubUsername: 'ericliu-fullstack',
      identityType: 'solo-traveler',
      emailVerified: true,
      createdAt: new Date('2025-10-01'),
      updatedAt: now,
      lastLoginAt: new Date('2026-01-21'),
    },

    // === EXPLORERS / NEW USERS ===
    // 3. Mike Wang - Explorer, browsing
    {
      id: 'user-3',
      email: 'mike@nuvaclub.test',
      name: 'Mike Wang',
      avatar: 'https://avatar.iran.liara.run/public/boy?username=mike',
      bio: 'Full-stack developer exploring AI tools. Still deciding on a mentor.',
      discordId: 'mikewang#9012',
      githubUsername: 'mikewang-dev',
      identityType: 'solo-traveler',
      emailVerified: true,
      createdAt: new Date('2025-09-10'),
      updatedAt: now,
      lastLoginAt: new Date('2026-01-21'),
    },
    // 9. Tom Huang - Pending Nunu application
    {
      id: 'user-9',
      email: 'tom@nuvaclub.test',
      name: 'Tom Huang',
      avatar: 'https://avatar.iran.liara.run/public/boy?username=tom',
      bio: 'Open source contributor applying to become a Nunu. Passionate about teaching.',
      discordId: 'tomhuang#4567',
      githubUsername: 'tomhuang-oss',
      identityType: 'solo-traveler',
      emailVerified: true,
      createdAt: new Date('2025-10-01'),
      updatedAt: now,
      lastLoginAt: new Date('2026-01-21'),
    },
    // 13. Olivia Lee - New explorer
    {
      id: 'user-13',
      email: 'olivia@nuvaclub.test',
      name: 'Olivia Lee',
      avatar: 'https://avatar.iran.liara.run/public/girl?username=olivia',
      bio: 'Just joined NuvaClub! Excited to explore AI learning opportunities.',
      discordId: 'olivialee#3456',
      githubUsername: 'olivialee-new',
      identityType: 'explorer',
      emailVerified: true,
      createdAt: new Date('2026-01-15'),
      updatedAt: now,
      lastLoginAt: new Date('2026-01-22'),
    },
    // 16. Ethan Chen - Interested in becoming Nunu
    {
      id: 'user-16',
      email: 'ethan@nuvaclub.test',
      name: 'Ethan Chen',
      avatar: 'https://avatar.iran.liara.run/public/boy?username=ethan',
      bio: 'Experienced developer considering becoming a Nunu mentor. Evaluating the program.',
      discordId: 'ethanchen#7890',
      githubUsername: 'ethanchen-senior',
      identityType: 'explorer',
      emailVerified: true,
      createdAt: new Date('2026-01-10'),
      updatedAt: now,
      lastLoginAt: new Date('2026-01-20'),
    },
    // 19. Hannah Zhang - New explorer
    {
      id: 'user-19',
      email: 'hannah@nuvaclub.test',
      name: 'Hannah Zhang',
      avatar: 'https://avatar.iran.liara.run/public/girl?username=hannah',
      bio: 'Design student exploring how AI can enhance creative workflows.',
      discordId: 'hannahzhang#0123',
      githubUsername: 'hannahzhang-design',
      identityType: 'explorer',
      emailVerified: true,
      createdAt: new Date('2026-01-18'),
      updatedAt: now,
      lastLoginAt: new Date('2026-01-22'),
    },
    // 20. Lucas Wang - New explorer
    {
      id: 'user-20',
      email: 'lucas@nuvaclub.test',
      name: 'Lucas Wang',
      avatar: 'https://avatar.iran.liara.run/public/boy?username=lucas',
      bio: 'Marketing professional curious about AI automation for campaigns.',
      discordId: 'lucaswang#4567',
      githubUsername: 'lucaswang-marketing',
      identityType: 'explorer',
      emailVerified: true,
      createdAt: new Date('2026-01-20'),
      updatedAt: now,
      lastLoginAt: new Date('2026-01-22'),
    },
  ]);

  // ==========================================
  // User Subscriptions
  // ==========================================
  db.userSubscriptions.createMany([
    // Solo Traveler subscriptions
    { id: 'sub-user-1', userId: 'user-1', plan: 'traveler', status: 'active', billingCycle: 'monthly', periodStart: new Date('2026-01-01'), periodEnd: new Date('2026-02-01'), autoRenew: true, renewalPrice: 990, createdAt: new Date('2025-10-15'), updatedAt: now },
    { id: 'sub-user-2', userId: 'user-2', plan: 'traveler', status: 'active', billingCycle: 'monthly', periodStart: new Date('2026-01-01'), periodEnd: new Date('2026-02-01'), autoRenew: true, renewalPrice: 990, createdAt: new Date('2025-08-01'), updatedAt: now },
    { id: 'sub-user-3', userId: 'user-3', plan: 'traveler', status: 'active', billingCycle: 'monthly', periodStart: new Date('2026-01-01'), periodEnd: new Date('2026-02-01'), autoRenew: true, renewalPrice: 990, createdAt: new Date('2025-09-10'), updatedAt: now },
    { id: 'sub-user-4', userId: 'user-4', plan: 'traveler', status: 'active', billingCycle: 'yearly', periodStart: new Date('2025-07-01'), periodEnd: new Date('2026-07-01'), autoRenew: true, renewalPrice: 8910, yearlyStartDate: new Date('2025-07-01'), yearlyEndDate: new Date('2026-07-01'), monthsIncluded: 12, createdAt: new Date('2025-07-01'), updatedAt: now },
    { id: 'sub-user-5', userId: 'user-5', plan: 'traveler', status: 'active', billingCycle: 'monthly', periodStart: new Date('2026-01-01'), periodEnd: new Date('2026-02-01'), autoRenew: true, renewalPrice: 990, createdAt: new Date('2025-11-10'), updatedAt: now },
    { id: 'sub-user-6', userId: 'user-6', plan: 'voyager', status: 'active', billingCycle: 'yearly', periodStart: new Date('2026-01-01'), periodEnd: new Date('2027-01-01'), autoRenew: true, renewalPrice: 17910, yearlyStartDate: new Date('2026-01-01'), yearlyEndDate: new Date('2027-01-01'), monthsIncluded: 12, createdAt: new Date('2025-08-15'), updatedAt: now },
    { id: 'sub-user-9', userId: 'user-9', plan: 'traveler', status: 'active', billingCycle: 'monthly', periodStart: new Date('2026-01-01'), periodEnd: new Date('2026-02-01'), autoRenew: true, renewalPrice: 990, createdAt: new Date('2025-10-01'), updatedAt: now },
    { id: 'sub-user-10', userId: 'user-10', plan: 'voyager', status: 'active', billingCycle: 'yearly', periodStart: new Date('2025-06-01'), periodEnd: new Date('2026-06-01'), autoRenew: true, renewalPrice: 17910, yearlyStartDate: new Date('2025-06-01'), yearlyEndDate: new Date('2026-06-01'), monthsIncluded: 12, createdAt: new Date('2025-06-01'), updatedAt: now },
    { id: 'sub-user-12', userId: 'user-12', plan: 'traveler', status: 'active', billingCycle: 'monthly', periodStart: new Date('2026-01-01'), periodEnd: new Date('2026-02-01'), autoRenew: true, renewalPrice: 990, createdAt: new Date('2025-10-20'), updatedAt: now },
    { id: 'sub-user-14', userId: 'user-14', plan: 'voyager', status: 'active', billingCycle: 'monthly', periodStart: new Date('2026-01-01'), periodEnd: new Date('2026-02-01'), autoRenew: true, renewalPrice: 1990, createdAt: new Date('2025-09-01'), updatedAt: now },
    { id: 'sub-user-15', userId: 'user-15', plan: 'traveler', status: 'active', billingCycle: 'monthly', periodStart: new Date('2026-01-01'), periodEnd: new Date('2026-02-01'), autoRenew: true, renewalPrice: 990, createdAt: new Date('2025-11-15'), updatedAt: now },
    { id: 'sub-user-17', userId: 'user-17', plan: 'traveler', status: 'active', billingCycle: 'monthly', periodStart: new Date('2026-01-01'), periodEnd: new Date('2026-02-01'), autoRenew: true, renewalPrice: 990, createdAt: new Date('2025-11-01'), updatedAt: now },
    { id: 'sub-user-18', userId: 'user-18', plan: 'traveler', status: 'active', billingCycle: 'monthly', periodStart: new Date('2026-01-01'), periodEnd: new Date('2026-02-01'), autoRenew: true, renewalPrice: 990, createdAt: new Date('2025-10-01'), updatedAt: now },
    // Explorer subscriptions
    { id: 'sub-user-7', userId: 'user-7', plan: 'explorer', status: 'active', billingCycle: 'monthly', periodStart: new Date('2026-01-05'), periodEnd: new Date('2026-02-05'), autoRenew: false, renewalPrice: 0, createdAt: new Date('2026-01-05'), updatedAt: now },
    { id: 'sub-user-8', userId: 'user-8', plan: 'explorer', status: 'active', billingCycle: 'monthly', periodStart: new Date('2026-01-01'), periodEnd: new Date('2026-02-01'), autoRenew: false, renewalPrice: 0, createdAt: new Date('2025-12-01'), updatedAt: now },
    { id: 'sub-user-11', userId: 'user-11', plan: 'explorer', status: 'active', billingCycle: 'monthly', periodStart: new Date('2026-01-01'), periodEnd: new Date('2026-02-01'), autoRenew: false, renewalPrice: 0, createdAt: new Date('2025-12-01'), updatedAt: now },
    { id: 'sub-user-13', userId: 'user-13', plan: 'explorer', status: 'active', billingCycle: 'monthly', periodStart: new Date('2026-01-15'), periodEnd: new Date('2026-02-15'), autoRenew: false, renewalPrice: 0, createdAt: new Date('2026-01-15'), updatedAt: now },
    { id: 'sub-user-16', userId: 'user-16', plan: 'explorer', status: 'active', billingCycle: 'monthly', periodStart: new Date('2026-01-10'), periodEnd: new Date('2026-02-10'), autoRenew: false, renewalPrice: 0, createdAt: new Date('2026-01-10'), updatedAt: now },
    { id: 'sub-user-19', userId: 'user-19', plan: 'explorer', status: 'active', billingCycle: 'monthly', periodStart: new Date('2026-01-18'), periodEnd: new Date('2026-02-18'), autoRenew: false, renewalPrice: 0, createdAt: new Date('2026-01-18'), updatedAt: now },
    { id: 'sub-user-20', userId: 'user-20', plan: 'explorer', status: 'active', billingCycle: 'monthly', periodStart: new Date('2026-01-20'), periodEnd: new Date('2026-02-20'), autoRenew: false, renewalPrice: 0, createdAt: new Date('2026-01-20'), updatedAt: now },
  ]);

  // ==========================================
  // User Duo Tickets (for those with active matches)
  // ==========================================
  db.userDuoTickets.createMany([
    { id: 'ticket-user-1', userId: 'user-1', tier: 'go', status: 'active', validFrom: new Date('2026-02-01'), validUntil: new Date('2026-05-01'), purchasedAt: new Date('2026-01-15'), createdAt: new Date('2026-01-15') },
    { id: 'ticket-user-2', userId: 'user-2', tier: 'run', status: 'active', validFrom: new Date('2026-01-01'), validUntil: new Date('2026-07-01'), purchasedAt: new Date('2025-08-01'), createdAt: new Date('2025-08-01') },
    { id: 'ticket-user-4', userId: 'user-4', tier: 'fly', status: 'active', validFrom: new Date('2025-07-01'), validUntil: new Date('2026-07-01'), purchasedAt: new Date('2025-07-01'), createdAt: new Date('2025-07-01') },
    { id: 'ticket-user-5', userId: 'user-5', tier: 'run', status: 'active', validFrom: new Date('2026-02-01'), validUntil: new Date('2026-04-01'), purchasedAt: new Date('2026-01-10'), createdAt: new Date('2026-01-10') },
    { id: 'ticket-user-6', userId: 'user-6', tier: 'fly', status: 'active', validFrom: new Date('2026-02-01'), validUntil: new Date('2026-08-01'), purchasedAt: new Date('2026-01-05'), createdAt: new Date('2026-01-05') },
    { id: 'ticket-user-7', userId: 'user-7', tier: 'go', status: 'active', validFrom: new Date('2026-02-01'), validUntil: new Date('2026-03-01'), purchasedAt: new Date('2026-01-20'), createdAt: new Date('2026-01-20') },
    { id: 'ticket-user-10', userId: 'user-10', tier: 'fly', status: 'active', validFrom: new Date('2025-06-01'), validUntil: new Date('2026-06-01'), purchasedAt: new Date('2025-06-01'), createdAt: new Date('2025-06-01') },
    { id: 'ticket-user-12', userId: 'user-12', tier: 'run', status: 'active', validFrom: new Date('2026-02-01'), validUntil: new Date('2026-06-01'), purchasedAt: new Date('2026-01-12'), createdAt: new Date('2026-01-12') },
    { id: 'ticket-user-14', userId: 'user-14', tier: 'fly', status: 'active', validFrom: new Date('2025-09-01'), validUntil: new Date('2026-09-01'), purchasedAt: new Date('2025-09-01'), createdAt: new Date('2025-09-01') },
    { id: 'ticket-user-17', userId: 'user-17', tier: 'go', status: 'active', validFrom: new Date('2026-02-01'), validUntil: new Date('2026-05-01'), purchasedAt: new Date('2026-01-08'), createdAt: new Date('2026-01-08') },
    { id: 'ticket-user-18', userId: 'user-18', tier: 'run', status: 'active', validFrom: new Date('2025-10-01'), validUntil: new Date('2026-10-01'), purchasedAt: new Date('2025-10-01'), createdAt: new Date('2025-10-01') },
  ]);

  // ==========================================
  // User Favorites
  // ==========================================
  db.userFavorites.createMany([
    { id: 'fav-1-1', userId: 'user-1', itemType: 'course', itemId: 'course-1', createdAt: new Date('2026-01-15') },
    { id: 'fav-1-2', userId: 'user-1', itemType: 'course', itemId: 'course-7', createdAt: new Date('2026-01-18') },
    { id: 'fav-2-1', userId: 'user-2', itemType: 'course', itemId: 'course-3', createdAt: new Date('2026-01-12') },
    { id: 'fav-3-1', userId: 'user-3', itemType: 'course', itemId: 'course-5', createdAt: new Date('2026-01-10') },
    { id: 'fav-5-1', userId: 'user-5', itemType: 'course', itemId: 'course-1', createdAt: new Date('2026-01-18') },
    { id: 'fav-6-1', userId: 'user-6', itemType: 'course', itemId: 'course-4', createdAt: new Date('2026-01-11') },
    { id: 'fav-8-1', userId: 'user-8', itemType: 'course', itemId: 'course-5', createdAt: new Date('2026-01-09') },
    { id: 'fav-10-1', userId: 'user-10', itemType: 'course', itemId: 'course-8', createdAt: new Date('2026-01-07') },
    { id: 'fav-12-1', userId: 'user-12', itemType: 'course', itemId: 'course-2', createdAt: new Date('2026-01-14') },
    { id: 'fav-15-1', userId: 'user-15', itemType: 'course', itemId: 'course-6', createdAt: new Date('2026-01-16') },
  ]);

  // ==========================================
  // User Activities
  // ==========================================
  db.userActivities.createMany([
    { id: 'activity-1', userId: 'user-1', activityType: 'view', targetType: 'course', targetId: 'course-1', metadata: { duration: 120, source: 'homepage' }, createdAt: new Date('2026-01-20T10:00:00') },
    { id: 'activity-2', userId: 'user-1', activityType: 'complete', targetType: 'lesson', targetId: 'l1-1', metadata: { progress: 100 }, createdAt: new Date('2026-01-20T10:30:00') },
    { id: 'activity-3', userId: 'user-5', activityType: 'view', targetType: 'course', targetId: 'course-2', metadata: { duration: 60, source: 'search' }, createdAt: new Date('2026-01-21T15:00:00') },
    { id: 'activity-4', userId: 'user-8', activityType: 'view', targetType: 'post', targetId: 'matching-post-1', metadata: { source: 'browse' }, createdAt: new Date('2026-01-22T09:00:00') },
    { id: 'activity-5', userId: 'user-15', activityType: 'view', targetType: 'post', targetId: 'matching-post-2', metadata: { source: 'search' }, createdAt: new Date('2026-01-22T10:00:00') },
  ]);

  // ==========================================
  // User Points (reputation system)
  // ==========================================
  const todayStart = new Date();
  todayStart.setUTCHours(0, 0, 0, 0);

  db.userPoints.createMany([
    // Vavas
    { id: 'points-user-1', userId: 'user-1', totalPoints: 850, learningPoints: 450, communityPoints: 400, dailyLearningPoints: 30, dailyCommunityPoints: 25, dailyUpvotePoints: 10, lastDailyReset: todayStart, createdAt: new Date('2025-10-15'), updatedAt: now },
    { id: 'points-user-5', userId: 'user-5', totalPoints: 620, learningPoints: 380, communityPoints: 240, dailyLearningPoints: 35, dailyCommunityPoints: 20, dailyUpvotePoints: 12, lastDailyReset: todayStart, createdAt: new Date('2025-11-10'), updatedAt: now },
    { id: 'points-user-6', userId: 'user-6', totalPoints: 1200, learningPoints: 720, communityPoints: 480, dailyLearningPoints: 45, dailyCommunityPoints: 30, dailyUpvotePoints: 15, lastDailyReset: todayStart, createdAt: new Date('2025-08-15'), updatedAt: now },
    { id: 'points-user-7', userId: 'user-7', totalPoints: 95, learningPoints: 60, communityPoints: 35, dailyLearningPoints: 10, dailyCommunityPoints: 5, dailyUpvotePoints: 2, lastDailyReset: todayStart, createdAt: new Date('2026-01-05'), updatedAt: now },
    { id: 'points-user-8', userId: 'user-8', totalPoints: 480, learningPoints: 250, communityPoints: 230, dailyLearningPoints: 25, dailyCommunityPoints: 18, dailyUpvotePoints: 8, lastDailyReset: todayStart, createdAt: new Date('2025-12-01'), updatedAt: now },
    { id: 'points-user-12', userId: 'user-12', totalPoints: 750, learningPoints: 420, communityPoints: 330, dailyLearningPoints: 32, dailyCommunityPoints: 22, dailyUpvotePoints: 10, lastDailyReset: todayStart, createdAt: new Date('2025-10-20'), updatedAt: now },
    { id: 'points-user-15', userId: 'user-15', totalPoints: 920, learningPoints: 550, communityPoints: 370, dailyLearningPoints: 38, dailyCommunityPoints: 25, dailyUpvotePoints: 12, lastDailyReset: todayStart, createdAt: new Date('2025-11-15'), updatedAt: now },
    { id: 'points-user-17', userId: 'user-17', totalPoints: 680, learningPoints: 400, communityPoints: 280, dailyLearningPoints: 30, dailyCommunityPoints: 20, dailyUpvotePoints: 10, lastDailyReset: todayStart, createdAt: new Date('2025-11-01'), updatedAt: now },
    // Nunus
    { id: 'points-user-2', userId: 'user-2', totalPoints: 2450, learningPoints: 1200, communityPoints: 1250, dailyLearningPoints: 50, dailyCommunityPoints: 45, dailyUpvotePoints: 20, lastDailyReset: todayStart, createdAt: new Date('2025-08-01'), updatedAt: now },
    { id: 'points-user-4', userId: 'user-4', totalPoints: 3200, learningPoints: 1500, communityPoints: 1700, dailyLearningPoints: 60, dailyCommunityPoints: 55, dailyUpvotePoints: 25, lastDailyReset: todayStart, createdAt: new Date('2025-07-01'), updatedAt: now },
    { id: 'points-user-10', userId: 'user-10', totalPoints: 4100, learningPoints: 1800, communityPoints: 2300, dailyLearningPoints: 80, dailyCommunityPoints: 70, dailyUpvotePoints: 30, lastDailyReset: todayStart, createdAt: new Date('2025-06-01'), updatedAt: now },
    { id: 'points-user-11', userId: 'user-11', totalPoints: 380, learningPoints: 200, communityPoints: 180, dailyLearningPoints: 20, dailyCommunityPoints: 15, dailyUpvotePoints: 8, lastDailyReset: todayStart, createdAt: new Date('2025-12-01'), updatedAt: now },
    { id: 'points-user-14', userId: 'user-14', totalPoints: 2100, learningPoints: 1000, communityPoints: 1100, dailyLearningPoints: 48, dailyCommunityPoints: 42, dailyUpvotePoints: 18, lastDailyReset: todayStart, createdAt: new Date('2025-09-01'), updatedAt: now },
    { id: 'points-user-18', userId: 'user-18', totalPoints: 1800, learningPoints: 900, communityPoints: 900, dailyLearningPoints: 42, dailyCommunityPoints: 38, dailyUpvotePoints: 16, lastDailyReset: todayStart, createdAt: new Date('2025-10-01'), updatedAt: now },
    // Explorers
    { id: 'points-user-3', userId: 'user-3', totalPoints: 1120, learningPoints: 720, communityPoints: 400, dailyLearningPoints: 40, dailyCommunityPoints: 15, dailyUpvotePoints: 8, lastDailyReset: todayStart, createdAt: new Date('2025-09-10'), updatedAt: now },
    { id: 'points-user-9', userId: 'user-9', totalPoints: 920, learningPoints: 400, communityPoints: 520, dailyLearningPoints: 30, dailyCommunityPoints: 35, dailyUpvotePoints: 15, lastDailyReset: todayStart, createdAt: new Date('2025-10-01'), updatedAt: now },
    { id: 'points-user-13', userId: 'user-13', totalPoints: 50, learningPoints: 30, communityPoints: 20, dailyLearningPoints: 5, dailyCommunityPoints: 3, dailyUpvotePoints: 1, lastDailyReset: todayStart, createdAt: new Date('2026-01-15'), updatedAt: now },
    { id: 'points-user-16', userId: 'user-16', totalPoints: 180, learningPoints: 100, communityPoints: 80, dailyLearningPoints: 15, dailyCommunityPoints: 10, dailyUpvotePoints: 5, lastDailyReset: todayStart, createdAt: new Date('2026-01-10'), updatedAt: now },
    { id: 'points-user-19', userId: 'user-19', totalPoints: 30, learningPoints: 20, communityPoints: 10, dailyLearningPoints: 3, dailyCommunityPoints: 2, dailyUpvotePoints: 1, lastDailyReset: todayStart, createdAt: new Date('2026-01-18'), updatedAt: now },
    { id: 'points-user-20', userId: 'user-20', totalPoints: 25, learningPoints: 15, communityPoints: 10, dailyLearningPoints: 2, dailyCommunityPoints: 2, dailyUpvotePoints: 1, lastDailyReset: todayStart, createdAt: new Date('2026-01-20'), updatedAt: now },
  ]);
}
