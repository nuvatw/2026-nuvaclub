import type { MockDB } from '../core/MockDB';

/**
 * Seed users data
 *
 * 10 Canonical Users (used consistently across all platform data):
 * 1. user-1 (Alex Chen) - solo-traveler - Active community member
 * 2. user-2 (Sarah Lin) - duo-run - Power user, mentor
 * 3. user-3 (Mike Wang) - solo-traveler - Experienced learner
 * 4. user-4 (Emily Huang) - duo-fly - Premium user, content creator
 * 5. user-5 (Kevin Lee) - explorer - New user, asking questions
 * 6. user-6 (Jessica Wu) - duo-go - Engaged learner
 * 7. user-7 (David Zhang) - explorer - Casual user
 * 8. user-8 (Lisa Chen) - duo-go - Active participant
 * 9. user-9 (Tom Huang) - solo-traveler - Regular contributor
 * 10. user-10 (Amy Lin) - duo-fly - Expert mentor
 */
export async function seedUsers(db: MockDB): Promise<void> {
  const now = new Date();

  // ==========================================
  // 10 Canonical Users
  // ==========================================
  db.users.createMany([
    // 1. Alex Chen - solo-traveler - Active community member
    {
      id: 'user-1',
      email: 'alex@nuvaclub.test',
      name: 'Alex Chen',
      avatar: 'https://i.pravatar.cc/150?u=alex',
      bio: 'Passionate learner exploring web development and design.',
      discordId: 'alexchen#1234',
      githubUsername: 'sindresorhus',
      identityType: 'solo-traveler',
      emailVerified: true,
      createdAt: new Date('2025-10-15'),
      updatedAt: now,
      lastLoginAt: new Date('2026-01-22'),
    },
    // 2. Sarah Lin - duo-run - Power user, mentor
    {
      id: 'user-2',
      email: 'sarah@nuvaclub.test',
      name: 'Sarah Lin',
      avatar: 'https://i.pravatar.cc/150?u=sarah',
      bio: 'Senior developer and mentor. Love helping others grow!',
      discordId: 'sarahlin#5678',
      githubUsername: 'gaearon',
      identityType: 'duo-run',
      emailVerified: true,
      createdAt: new Date('2025-08-01'),
      updatedAt: now,
      lastLoginAt: new Date('2026-01-22'),
    },
    // 3. Mike Wang - solo-traveler - Experienced learner
    {
      id: 'user-3',
      email: 'mike@nuvaclub.test',
      name: 'Mike Wang',
      avatar: 'https://i.pravatar.cc/150?u=mike',
      bio: 'Full-stack developer diving deep into React and TypeScript.',
      discordId: 'mikewang#9012',
      githubUsername: 'tj',
      identityType: 'solo-traveler',
      emailVerified: true,
      createdAt: new Date('2025-09-10'),
      updatedAt: now,
      lastLoginAt: new Date('2026-01-21'),
    },
    // 4. Emily Huang - duo-fly - Premium user, content creator
    {
      id: 'user-4',
      email: 'emily@nuvaclub.test',
      name: 'Emily Huang',
      avatar: 'https://i.pravatar.cc/150?u=emily',
      bio: 'Content creator and tech educator. Building cool stuff!',
      discordId: 'emilyhuang#3456',
      githubUsername: 'addyosmani',
      identityType: 'duo-fly',
      emailVerified: true,
      createdAt: new Date('2025-07-01'),
      updatedAt: now,
      lastLoginAt: new Date('2026-01-22'),
    },
    // 5. Kevin Lee - explorer - New user, asking questions
    {
      id: 'user-5',
      email: 'kevin@nuvaclub.test',
      name: 'Kevin Lee',
      avatar: 'https://i.pravatar.cc/150?u=kevin',
      bio: 'Newbie developer eager to learn and grow.',
      discordId: 'kevinlee#7890',
      githubUsername: 'kentcdodds',
      identityType: 'explorer',
      emailVerified: true,
      createdAt: new Date('2026-01-10'),
      updatedAt: now,
      lastLoginAt: new Date('2026-01-21'),
    },
    // 6. Jessica Wu - duo-go - Engaged learner
    {
      id: 'user-6',
      email: 'jessica@nuvaclub.test',
      name: 'Jessica Wu',
      avatar: 'https://i.pravatar.cc/150?u=jessica',
      bio: 'UI/UX enthusiast learning frontend development.',
      discordId: 'jessicawu#2345',
      githubUsername: 'wesbos',
      identityType: 'duo-go',
      emailVerified: true,
      createdAt: new Date('2025-11-15'),
      updatedAt: now,
      lastLoginAt: new Date('2026-01-20'),
    },
    // 7. David Zhang - explorer - Casual user
    {
      id: 'user-7',
      email: 'david@nuvaclub.test',
      name: 'David Zhang',
      avatar: 'https://i.pravatar.cc/150?u=david',
      bio: 'Casual coder exploring different technologies.',
      discordId: 'davidzhang#6789',
      githubUsername: 'yyx990803',
      identityType: 'explorer',
      emailVerified: true,
      createdAt: new Date('2026-01-05'),
      updatedAt: now,
      lastLoginAt: new Date('2026-01-19'),
    },
    // 8. Lisa Chen - duo-go - Active participant
    {
      id: 'user-8',
      email: 'lisa@nuvaclub.test',
      name: 'Lisa Chen',
      avatar: 'https://i.pravatar.cc/150?u=lisa',
      bio: 'Active community member and aspiring developer.',
      discordId: 'lisachen#0123',
      githubUsername: 'rauchg',
      identityType: 'duo-go',
      emailVerified: true,
      createdAt: new Date('2025-12-01'),
      updatedAt: now,
      lastLoginAt: new Date('2026-01-22'),
    },
    // 9. Tom Huang - solo-traveler - Regular contributor
    {
      id: 'user-9',
      email: 'tom@nuvaclub.test',
      name: 'Tom Huang',
      avatar: 'https://i.pravatar.cc/150?u=tom',
      bio: 'Open source contributor and community helper.',
      discordId: 'tomhuang#4567',
      githubUsername: 'mxstbr',
      identityType: 'solo-traveler',
      emailVerified: true,
      createdAt: new Date('2025-10-01'),
      updatedAt: now,
      lastLoginAt: new Date('2026-01-21'),
    },
    // 10. Amy Lin - duo-fly - Expert mentor
    {
      id: 'user-10',
      email: 'amy@nuvaclub.test',
      name: 'Amy Lin',
      avatar: 'https://i.pravatar.cc/150?u=amy',
      bio: 'Expert mentor with 10+ years of experience in tech.',
      discordId: 'amylin#8901',
      githubUsername: 'Rich-Harris',
      identityType: 'duo-fly',
      emailVerified: true,
      createdAt: new Date('2025-06-01'),
      updatedAt: now,
      lastLoginAt: new Date('2026-01-22'),
    },
  ]);

  // ==========================================
  // Subscriptions
  // ==========================================
  db.userSubscriptions.createMany([
    // Solo Traveler subscriptions (user-1, user-3, user-9)
    {
      id: 'sub-user-1',
      userId: 'user-1',
      planType: 'traveler',
      status: 'active',
      billingCycle: 'monthly',
      currentPeriodStart: new Date('2026-01-01'),
      currentPeriodEnd: new Date('2026-02-01'),
      createdAt: new Date('2025-10-15'),
    },
    {
      id: 'sub-user-3',
      userId: 'user-3',
      planType: 'traveler',
      status: 'active',
      billingCycle: 'monthly',
      currentPeriodStart: new Date('2026-01-01'),
      currentPeriodEnd: new Date('2026-02-01'),
      createdAt: new Date('2025-09-10'),
    },
    {
      id: 'sub-user-9',
      userId: 'user-9',
      planType: 'traveler',
      status: 'active',
      billingCycle: 'monthly',
      currentPeriodStart: new Date('2026-01-01'),
      currentPeriodEnd: new Date('2026-02-01'),
      createdAt: new Date('2025-10-01'),
    },
    // Duo Run subscription (user-2)
    {
      id: 'sub-user-2',
      userId: 'user-2',
      planType: 'traveler',
      status: 'active',
      billingCycle: 'monthly',
      currentPeriodStart: new Date('2026-01-01'),
      currentPeriodEnd: new Date('2026-02-01'),
      createdAt: new Date('2025-08-01'),
    },
    // Duo Fly subscriptions (user-4, user-10)
    {
      id: 'sub-user-4',
      userId: 'user-4',
      planType: 'traveler',
      status: 'active',
      billingCycle: 'yearly',
      currentPeriodStart: new Date('2025-07-01'),
      currentPeriodEnd: new Date('2026-07-01'),
      createdAt: new Date('2025-07-01'),
    },
    {
      id: 'sub-user-10',
      userId: 'user-10',
      planType: 'traveler',
      status: 'active',
      billingCycle: 'yearly',
      currentPeriodStart: new Date('2025-06-01'),
      currentPeriodEnd: new Date('2026-06-01'),
      createdAt: new Date('2025-06-01'),
    },
    // Duo Go subscriptions (user-6, user-8)
    {
      id: 'sub-user-6',
      userId: 'user-6',
      planType: 'traveler',
      status: 'active',
      billingCycle: 'monthly',
      currentPeriodStart: new Date('2026-01-01'),
      currentPeriodEnd: new Date('2026-02-01'),
      createdAt: new Date('2025-11-15'),
    },
    {
      id: 'sub-user-8',
      userId: 'user-8',
      planType: 'traveler',
      status: 'active',
      billingCycle: 'monthly',
      currentPeriodStart: new Date('2026-01-01'),
      currentPeriodEnd: new Date('2026-02-01'),
      createdAt: new Date('2025-12-01'),
    },
    // Explorer subscriptions (user-5, user-7)
    {
      id: 'sub-user-5',
      userId: 'user-5',
      planType: 'explorer',
      status: 'active',
      billingCycle: 'monthly',
      currentPeriodStart: new Date('2026-01-10'),
      currentPeriodEnd: new Date('2026-02-10'),
      createdAt: new Date('2026-01-10'),
    },
    {
      id: 'sub-user-7',
      userId: 'user-7',
      planType: 'explorer',
      status: 'active',
      billingCycle: 'monthly',
      currentPeriodStart: new Date('2026-01-05'),
      currentPeriodEnd: new Date('2026-02-05'),
      createdAt: new Date('2026-01-05'),
    },
  ]);

  // ==========================================
  // Duo Tickets
  // ==========================================
  db.duoTickets.createMany([
    // Duo Run ticket (user-2)
    {
      id: 'ticket-user-2',
      userId: 'user-2',
      ticketType: 'run',
      status: 'active',
      validFrom: new Date('2026-01-01'),
      validUntil: new Date('2026-03-31'),
      purchasedAt: new Date('2025-08-01'),
    },
    // Duo Fly tickets (user-4, user-10)
    {
      id: 'ticket-user-4',
      userId: 'user-4',
      ticketType: 'fly',
      status: 'active',
      validFrom: new Date('2025-07-01'),
      validUntil: new Date('2026-07-01'),
      purchasedAt: new Date('2025-07-01'),
    },
    {
      id: 'ticket-user-10',
      userId: 'user-10',
      ticketType: 'fly',
      status: 'active',
      validFrom: new Date('2025-06-01'),
      validUntil: new Date('2026-06-01'),
      purchasedAt: new Date('2025-06-01'),
    },
    // Duo Go tickets (user-6, user-8)
    {
      id: 'ticket-user-6',
      userId: 'user-6',
      ticketType: 'go',
      status: 'active',
      validFrom: new Date('2026-01-01'),
      validUntil: new Date('2026-03-31'),
      purchasedAt: new Date('2025-11-15'),
    },
    {
      id: 'ticket-user-8',
      userId: 'user-8',
      ticketType: 'go',
      status: 'active',
      validFrom: new Date('2026-01-01'),
      validUntil: new Date('2026-03-31'),
      purchasedAt: new Date('2025-12-01'),
    },
  ]);

  // ==========================================
  // User Favorites
  // ==========================================
  db.userFavorites.createMany([
    // User 1 favorites
    {
      id: 'fav-1-1',
      userId: 'user-1',
      itemType: 'course',
      itemId: 'course-1',
      addedAt: new Date('2026-01-15'),
    },
    {
      id: 'fav-1-2',
      userId: 'user-1',
      itemType: 'course',
      itemId: 'course-7',
      addedAt: new Date('2026-01-18'),
    },
    {
      id: 'fav-1-3',
      userId: 'user-1',
      itemType: 'post',
      itemId: 'post-4',
      addedAt: new Date('2026-01-16'),
    },
    // User 2 favorites
    {
      id: 'fav-2-1',
      userId: 'user-2',
      itemType: 'course',
      itemId: 'course-3',
      addedAt: new Date('2026-01-12'),
    },
    {
      id: 'fav-2-2',
      userId: 'user-2',
      itemType: 'post',
      itemId: 'post-1',
      addedAt: new Date('2026-01-14'),
    },
    // User 3 favorites
    {
      id: 'fav-3-1',
      userId: 'user-3',
      itemType: 'course',
      itemId: 'course-5',
      addedAt: new Date('2026-01-10'),
    },
    {
      id: 'fav-3-2',
      userId: 'user-3',
      itemType: 'post',
      itemId: 'post-2',
      addedAt: new Date('2026-01-15'),
    },
    // User 4 favorites
    {
      id: 'fav-4-1',
      userId: 'user-4',
      itemType: 'course',
      itemId: 'course-6',
      addedAt: new Date('2026-01-08'),
    },
    {
      id: 'fav-4-2',
      userId: 'user-4',
      itemType: 'course',
      itemId: 'course-8',
      addedAt: new Date('2026-01-12'),
    },
    // User 5 favorites
    {
      id: 'fav-5-1',
      userId: 'user-5',
      itemType: 'course',
      itemId: 'course-1',
      addedAt: new Date('2026-01-18'),
    },
    // User 6 favorites
    {
      id: 'fav-6-1',
      userId: 'user-6',
      itemType: 'course',
      itemId: 'course-4',
      addedAt: new Date('2026-01-11'),
    },
    {
      id: 'fav-6-2',
      userId: 'user-6',
      itemType: 'post',
      itemId: 'post-3',
      addedAt: new Date('2026-01-17'),
    },
    // User 7 favorites
    {
      id: 'fav-7-1',
      userId: 'user-7',
      itemType: 'course',
      itemId: 'course-2',
      addedAt: new Date('2026-01-13'),
    },
    // User 8 favorites
    {
      id: 'fav-8-1',
      userId: 'user-8',
      itemType: 'course',
      itemId: 'course-5',
      addedAt: new Date('2026-01-09'),
    },
    {
      id: 'fav-8-2',
      userId: 'user-8',
      itemType: 'post',
      itemId: 'post-4',
      addedAt: new Date('2026-01-19'),
    },
    // User 9 favorites
    {
      id: 'fav-9-1',
      userId: 'user-9',
      itemType: 'course',
      itemId: 'course-7',
      addedAt: new Date('2026-01-14'),
    },
    // User 10 favorites
    {
      id: 'fav-10-1',
      userId: 'user-10',
      itemType: 'course',
      itemId: 'course-8',
      addedAt: new Date('2026-01-07'),
    },
    {
      id: 'fav-10-2',
      userId: 'user-10',
      itemType: 'post',
      itemId: 'post-2',
      addedAt: new Date('2026-01-16'),
    },
  ]);
}
